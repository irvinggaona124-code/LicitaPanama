import { NextRequest, NextResponse } from "next/server";
import { analyzeWinProbability } from "@/lib/ai/gemini-flash";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenderId, tenderMarkdown, referenceAmount } = body;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Default company profile if not yet authenticated (for preview demo)
    let companyProfile = {
      ruc: "155694200",
      dv: "2",
      razonSocial: "EMPRESA CONTRATISTA PANAMÁ S.A.",
      industrySummary: "Servicios de infraestructura y suministros generales",
      validatedDgiRevenue: 1850000.0,
      yearsExperience: 7,
      unspscCodes: ["39121011", "72141003"],
    };
    let planTier: "pro_30" | "elite_50" = "pro_30";

    if (user) {
      const { data: org } = await supabase
        .from("organizations")
        .select("*")
        .eq("owner_user_id", user.id)
        .single();

      if (org) {
        companyProfile = {
          ruc: org.ruc,
          dv: org.dv,
          razonSocial: org.razon_social,
          industrySummary: org.industry_summary,
          validatedDgiRevenue: Number(org.validated_dgi_revenue) || 0,
          yearsExperience: 8,
          unspscCodes: org.unspsc_codes || [],
        };
        planTier = org.plan_tier === "elite_50" ? "elite_50" : "pro_30";
      }
    }

    // Call Gemini 3.8 Flash engine
    const analysis = await analyzeWinProbability(
      companyProfile,
      tenderMarkdown || "Especificaciones generales de obra y suministro.",
      referenceAmount || 1000000.0,
      undefined,
      planTier
    );

    return NextResponse.json({
      success: true,
      analysis,
      planTier,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error al calcular probabilidad de adjudicación." },
      { status: 500 }
    );
  }
}
