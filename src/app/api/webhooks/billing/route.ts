import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") || "";
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "default_webhook_secret";

    // Verify webhook HMAC signature if secret is configured
    if (secret && signature && !secret.includes("placeholder")) {
      const hmac = crypto.createHmac("sha256", secret);
      const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
      const signatureBuffer = Buffer.from(signature, "utf8");

      if (
        digest.length !== signatureBuffer.length ||
        !crypto.timingSafeEqual(digest, signatureBuffer)
      ) {
        return NextResponse.json(
          { error: "Firma de webhook inválida." },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name || payload.event || "subscription_updated";
    const customData = payload.meta?.custom_data || {};
    const orgId = customData.org_id || customData.organization_id;
    const planVariant = customData.plan_tier || (payload.data?.attributes?.first_order_item?.variant_id === 50 ? "elite_50" : "pro_30");

    const supabase = createAdminClient();

    if (orgId) {
      if (eventName === "subscription_created" || eventName === "subscription_updated" || eventName === "order_created") {
        await supabase
          .from("organizations")
          .update({
            plan_tier: planVariant === "elite_50" ? "elite_50" : "pro_30",
            billing_customer_id: payload.data?.attributes?.customer_id?.toString() || "cust_simulated",
          })
          .eq("id", orgId);

        await supabase.from("security_audit_logs").insert({
          org_id: orgId,
          event_type: "BILLING_SUBSCRIPTION_ACTIVATED",
          metadata: {
            eventName,
            planTier: planVariant,
          },
        });
      } else if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
        await supabase
          .from("organizations")
          .update({
            plan_tier: "free_0",
          })
          .eq("id", orgId);

        await supabase.from("security_audit_logs").insert({
          org_id: orgId,
          event_type: "BILLING_SUBSCRIPTION_CANCELLED",
          metadata: { eventName },
        });
      }
    }

    return NextResponse.json({
      received: true,
      event: eventName,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error al procesar webhook de facturación." },
      { status: 500 }
    );
  }
}
