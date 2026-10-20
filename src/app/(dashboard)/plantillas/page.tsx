"use client";

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Shield,
  ArrowLeft,
  CheckCircle2,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocxCompiler } from "@/components/templates/DocxCompiler";

interface TemplateItem {
  id: string;
  slug: string;
  title: string;
  lawArticle: string;
  minTier: "pro_30" | "elite_50";
  description: string;
  clauses: { heading: string; body: string }[];
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "tpl-1",
    slug: "propuesta_economica",
    title: "Formulario Oficial de Propuesta Económica",
    lawArticle: "Artículo 45 del Texto Único de la Ley 22",
    minTier: "pro_30",
    description: "Desglose formal de precios unitarios, ITBMS, cronograma y aceptación irrevocable del pliego.",
    clauses: [
      {
        heading: "1. PRESENTACIÓN FORMAL DE OFERTA",
        body: "El proponente se compromete a ejecutar la totalidad de los suministros y obras descritos en el pliego de cargos conforme al precio unitario y global consignado en la presente propuesta, cumpliendo con los estándares de la República de Panamá.",
      },
      {
        heading: "2. PLAZO DE ENTREGA Y EJECUCIÓN",
        body: "La empresa garantiza la entrega satisfactoria dentro del plazo perentorio de 180 días calendario contados a partir de la entrega de la Orden de Proceder refrendada por la Contraloría General de la República.",
      },
      {
        heading: "3. DECLARACIÓN DE INDEPENDENCIA DE LA OFERTA",
        body: "Declaramos bajo fe de juramento que la presente propuesta ha sido elaborada de manera autónoma, sin colusión, concierto previo ni acuerdos restrictivos con otros proponentes o competidores.",
      },
    ],
  },
  {
    id: "tpl-2",
    slug: "pacto_integridad",
    title: "Pacto de Integridad y Transparencia",
    lawArticle: "Artículo 28 del Texto Único de la Ley 22",
    minTier: "pro_30",
    description: "Compromiso solemne anticorrupción y adhesión al código ético de la DGCP.",
    clauses: [
      {
        heading: "1. COMPROMISO CONTRA EL SOBORNO Y LA CORRUPCIÓN",
        body: "El proponente, sus directivos, empleados y subcontratistas se comprometen a no ofrecer, dar, solicitar ni aceptar sobornos, gratificaciones o favores indebidos a ningún servidor público directa o indirectamente.",
      },
      {
        heading: "2. DEBER DE DENUNCIA",
        body: "Nos obligamos a poner en conocimiento inmediato de las autoridades judiciales y administrativas competentes cualquier indicio de conducta contraria a la ley durante el trámite de adjudicación y ejecución contractual.",
      },
    ],
  },
  {
    id: "tpl-3",
    slug: "medidas_retorsion",
    title: "Declaración Jurada de Medidas de Retorsión",
    lawArticle: "Ley 48 de 2016 y Decreto Ejecutivo 170",
    minTier: "pro_30",
    description: "Requisito obligatorio para todas las licitaciones estatales en Panamá.",
    clauses: [
      {
        heading: "1. CUMPLIMIENTO DE LA LEY 48 DE 2016",
        body: "Declaramos bajo la gravedad de juramento que la empresa no pertenece a jurisdicciones discriminatorias ni se encuentra incluida en la lista de Estados sancionados o sujetos a medidas de retorsión por el Ministerio de Relaciones Exteriores de Panamá.",
      },
    ],
  },
  {
    id: "tpl-4",
    slug: "carta_consorcio",
    title: "Carta de Intención y Acuerdo de Consorcio",
    lawArticle: "Artículo 51 del Texto Único de la Ley 22",
    minTier: "elite_50",
    description: "Fórmula asociativa para sumar facturación DGI y experiencia técnica para pliegos de gran envergadura.",
    clauses: [
      {
        heading: "1. CONSTITUCIÓN DEL CONSORCIO ACCIDENTAL",
        body: "Las partes acuerdan constituir un Consorcio con responsabilidad solidaria e ilimitada ante el Estado panameño para concurrir conjuntamente a la licitación pública.",
      },
      {
        heading: "2. PORCENTAJE DE PARTICIPACIÓN",
        body: "La empresa líder asumirá el 60% de participación operativa y financiera, y la empresa asociada asumirá el 40%, designando como Representante Común a la persona autorizada en el presente instrumento.",
      },
    ],
  },
];

export default function TemplatesStudioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem>(TEMPLATES[0]);
  const [actoNumero, setActoNumero] = useState("2026-0-12-0-08-LP-035412");
  const [entityName, setEntityName] = useState("Ministerio de Salud (MINSA)");
  const [companyName, setCompanyName] = useState("INGENIERÍA Y CONSTRUCCIONES DEL ISTMO S.A.");
  const [companyRuc, setCompanyRuc] = useState("155694200-2-2024");

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center text-xs text-slate-400 hover:text-emerald-400 transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Volver a Portada
          </a>
          <Badge variant="default" className="text-xs">
            Librería Oficial Ley 22 (.docx)
          </Badge>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white font-[family-name:var(--font-heading)]">
            Estudio Generador de Plantillas Ley 22
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Descarga en tu navegador archivos .docx editables listos para firmar y presentar ante la entidad licitante.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Template Catalog Selector */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Catálogo de Documentos Requeridos
            </h3>

            {TEMPLATES.map((tpl) => {
              const isSelected = selectedTemplate.id === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-slate-900 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                      : "bg-[#0F172A]/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge variant={tpl.minTier === "elite_50" ? "gold" : "default"} className="text-[10px]">
                      {tpl.minTier === "elite_50" ? "Plan Élite ($50)" : "Plan Pro ($30)"}
                    </Badge>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {tpl.lawArticle}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm mb-1 font-[family-name:var(--font-heading)]">
                    {tpl.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {tpl.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Interactive Document Preview & Compiler */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-800 bg-[#0F172A]/90 p-6 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Vista Previa de Impresión
                  </span>
                  <h3 className="text-lg font-bold text-white font-[family-name:var(--font-heading)]">
                    {selectedTemplate.title}
                  </h3>
                </div>

                <DocxCompiler
                  title={selectedTemplate.title}
                  actoNumero={actoNumero}
                  entityName={entityName}
                  companyName={companyName}
                  companyRuc={companyRuc}
                  clauses={selectedTemplate.clauses}
                  fileName={`${selectedTemplate.slug}_${actoNumero}.docx`}
                />
              </div>

              {/* Clean Institutional Slate Document Sheet */}
              <div className="rounded-2xl bg-[#F8FAFC] text-slate-900 p-8 shadow-inner border border-slate-300 font-serif text-xs leading-relaxed max-h-[500px] overflow-y-auto">
                <div className="text-center mb-6 border-b border-slate-300 pb-4">
                  <h4 className="font-bold text-sm tracking-wider uppercase mb-1">
                    República de Panamá
                  </h4>
                  <p className="text-[10px] text-slate-600 font-sans uppercase">
                    Dirección General de Contrataciones Públicas (DGCP)
                  </p>
                  <p className="text-xs font-bold text-slate-950 uppercase mt-2">
                    {selectedTemplate.title}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 font-sans text-[11px] mb-6 p-3 bg-slate-100 rounded-lg">
                  <div><strong>Acto N°:</strong> {actoNumero}</div>
                  <div><strong>Entidad:</strong> {entityName}</div>
                  <div className="col-span-2"><strong>Proponente:</strong> {companyName} (RUC: {companyRuc})</div>
                </div>

                <div className="space-y-4">
                  {selectedTemplate.clauses.map((c, i) => (
                    <div key={i}>
                      <p className="font-bold font-sans text-[11px] text-slate-800 mb-1">
                        {c.heading}
                      </p>
                      <p className="text-justify text-slate-700">
                        {c.body}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 text-center font-sans text-xs">
                  <div className="w-48 border-t border-slate-400 mx-auto mb-1" />
                  <p className="font-bold">REPRESENTANTE LEGAL AUTORIZADO</p>
                  <p className="text-[10px] text-slate-600">{companyName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
