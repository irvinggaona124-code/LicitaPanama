"use client";

import React, { useState } from "react";
import { Document, Paragraph, TextRun, Packer, HeadingLevel, AlignmentType } from "docx";
import { Download, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocxClause {
  heading: string;
  body: string;
}

interface DocxCompilerProps {
  title: string;
  actoNumero: string;
  entityName: string;
  companyName: string;
  companyRuc: string;
  clauses: DocxClause[];
  fileName?: string;
}

export function DocxCompiler({
  title,
  actoNumero,
  entityName,
  companyName,
  companyRuc,
  clauses,
  fileName = "Plantilla_Ley22_PanamaCompra.docx",
}: DocxCompilerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const generateAndDownloadDocx = async () => {
    try {
      setIsGenerating(true);

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 1440, // 1 inch
                  bottom: 1440,
                  left: 1440,
                  right: 1440,
                },
              },
            },
            children: [
              // Header Title
              new Paragraph({
                text: "REPÚBLICA DE PANAMÁ",
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_2,
                spacing: { after: 120 },
              }),
              new Paragraph({
                text: "DIRECCIÓN GENERAL DE CONTRATACIONES PÚBLICAS (DGCP)",
                alignment: AlignmentType.CENTER,
                spacing: { after: 240 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: title.toUpperCase(),
                    bold: true,
                    size: 28, // 14pt
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
              }),

              // Metadata block
              new Paragraph({
                children: [
                  new TextRun({ text: "ACTO PÚBLICO NÚMERO: ", bold: true }),
                  new TextRun({ text: actoNumero }),
                ],
                spacing: { after: 120 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "ENTIDAD LICITANTE: ", bold: true }),
                  new TextRun({ text: entityName }),
                ],
                spacing: { after: 120 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "PROPONENTE: ", bold: true }),
                  new TextRun({ text: `${companyName} (RUC: ${companyRuc})` }),
                ],
                spacing: { after: 240 },
              }),

              // Body Clauses
              ...clauses.flatMap((clause) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: clause.heading,
                      bold: true,
                      size: 22,
                    }),
                  ],
                  spacing: { before: 240, after: 120 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: clause.body,
                      size: 22,
                    }),
                  ],
                  alignment: AlignmentType.JUSTIFIED,
                  spacing: { after: 200 },
                }),
              ]),

              // Signature Line
              new Paragraph({
                spacing: { before: 720 },
                children: [
                  new TextRun({ text: "_____________________________________________", bold: true }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `REPRESENTANTE LEGAL AUTORIZADO`, bold: true }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `${companyName}` }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          },
        ],
      });

      // Generate blob in browser client (0 server RAM)
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (error) {
      console.error("Error al compilar .docx en cliente:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="default"
      size="sm"
      onClick={generateAndDownloadDocx}
      disabled={isGenerating}
      className="flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
    >
      {downloaded ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>¡Documento Descargado!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>{isGenerating ? "Compilando .docx..." : "Descargar .docx (Ley 22)"}</span>
        </>
      )}
    </Button>
  );
}
