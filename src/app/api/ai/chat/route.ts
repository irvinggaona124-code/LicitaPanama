import { NextRequest, NextResponse } from "next/server";
import { chatWithTender } from "@/lib/ai/gemini-flash";

export async function POST(request: NextRequest) {
  try {
    const { tenderTitle, tenderMarkdown, message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Mensaje vacío." },
        { status: 400 }
      );
    }

    const reply = await chatWithTender(
      tenderTitle || "Pliego de Licitación Pública",
      tenderMarkdown || "Condiciones y pliego oficial de PanamáCompra.",
      message,
      history || []
    );

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error al procesar consulta con Gemini 3.8 Flash." },
      { status: 500 }
    );
  }
}
