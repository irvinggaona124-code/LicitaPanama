import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { dispatchTenderAlert } from "@/lib/notifications/dispatcher";
import { MOCK_TENDERS } from "@/lib/data/mock-tenders";

export async function GET(request: NextRequest) {
  try {
    // 1. Verify CRON Secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "panamacompra_sync_secret_token_123";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "No autorizado. Token de sincronización inválido." },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    // 2. Fetch fresh tenders from PanamaCompra (Simulated with live mock releases)
    const tendersToSync = MOCK_TENDERS;
    let syncedCount = 0;
    let alertsSent = 0;

    for (const tender of tendersToSync) {
      // Upsert tender
      const { data: upsertedTender, error: tenderError } = await supabase
        .from("tenders")
        .upsert(
          {
            acto_numero: tender.acto_numero,
            title: tender.title,
            entity_name: tender.entity_name,
            province: tender.province,
            category_unspsc: tender.category_unspsc,
            reference_amount: tender.reference_amount,
            publish_date: tender.publish_date,
            close_date: tender.close_date,
            status: tender.status,
            source_url: tender.source_url,
            pliego_markdown: tender.pliego_summary,
            required_templates: tender.required_templates,
          },
          { onConflict: "acto_numero" }
        )
        .select()
        .single();

      if (!tenderError && upsertedTender) {
        syncedCount++;

        // 3. Find matching organizations
        const { data: matchedOrgs } = await supabase
          .from("organizations")
          .select("id, razon_social, plan_tier, alert_email, whatsapp_number, slack_webhook_url, teams_webhook_url, unspsc_codes")
          .eq("onboarding_completed", true);

        if (matchedOrgs && matchedOrgs.length > 0) {
          for (const org of matchedOrgs) {
            // Check UNSPSC match or notify if active
            const hasMatch =
              !org.unspsc_codes ||
              org.unspsc_codes.length === 0 ||
              org.unspsc_codes.some((code: string) => tender.category_unspsc.includes(code));

            if (hasMatch) {
              await dispatchTenderAlert(
                {
                  actoNumero: tender.acto_numero,
                  title: tender.title,
                  entityName: tender.entity_name,
                  province: tender.province,
                  referenceAmount: tender.reference_amount,
                  closeDate: tender.close_date,
                  sourceUrl: tender.source_url,
                  categoryUnspsc: tender.category_unspsc,
                },
                {
                  id: org.id,
                  razonSocial: org.razon_social,
                  planTier: org.plan_tier,
                  alertEmail: org.alert_email,
                  whatsappNumber: org.whatsapp_number,
                  slackWebhookUrl: org.slack_webhook_url,
                  teamsWebhookUrl: org.teams_webhook_url,
                }
              );
              alertsSent++;
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      syncedTenders: syncedCount,
      alertsDispatched: alertsSent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error al sincronizar PanamáCompra." },
      { status: 500 }
    );
  }
}
