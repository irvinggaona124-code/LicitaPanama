import { NextRequest, NextResponse } from "next/server";
import { generateLaw22TemplateContent } from "@/lib/ai/gemini-flash";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { templateType, tenderTitle, actoNumero, entityName } = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let companyProfile = {
      ruc: "155694200",
      dv: "2",
      razonSocial: "INGENIERÍA Y CONSTRUCCIONES DEL ISTMO S.A.",
      industrySummary: "Construcción y obras de infraestructura",
      validatedDgiRevenue: 2400000.0,
      yearsExperience: 10,
      unspscCodes: ["72141003"],
    };

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
      }
    }

    const templateContent = await generateLaw22TemplateContent(
      templateType || "propuesta_economica",
      companyProfile,
      tenderTitle || "Licitación Pública de Obras",
      actoNumero || "2026-0-09-0-03-LV-024891",
      entityName || "Ministerio de Obras Públicas"
    );

    return NextResponse.json({
      success: true,
      template: templateContent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error al redactar plantilla Ley 22." },
      { status: 500 }
    );
  }
}
