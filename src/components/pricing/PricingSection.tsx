"use client";

import React from "react";
import { Check, Sparkles, Zap, Shield, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PricingSectionProps {
  onSelectPlan: (tier: "free_0" | "pro_30" | "elite_50") => void;
}

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto" id="precios">
      <div className="text-center mb-16">
        <Badge variant="gold" className="mb-4 text-xs font-semibold">
          Planes Diseñados para Contratistas de Panamá
        </Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 font-[family-name:var(--font-heading)]">
          Inversión Transparente, Cero Fricción
        </h2>
        <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
          Empieza gratis para explorar licitaciones o escala a Pro y Élite para desbloquear el poder predictivo de Gemini 3.8 Flash.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Plan Inicial ($0/mes) */}
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A]/70 p-8 backdrop-blur-md flex flex-col justify-between hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-300 font-[family-name:var(--font-heading)]">
                Plan Inicial
              </span>
              <Badge variant="secondary">Para Explorar</Badge>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-white font-[family-name:var(--font-mono)]">
                  $0
                </span>
                <span className="text-slate-400 text-sm ml-2">/ mes de por vida</span>
              </div>
              <p className="text-slate-400 text-xs mt-2">
                Monitorea el mercado de PanamáCompra sin costo alguno.
              </p>
            </div>

            <ul className="space-y-3.5 text-sm text-slate-300 mb-8 border-t border-slate-800/80 pt-6">
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Búsqueda y visualización ilimitada de actos públicos</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>1 alerta semanal por correo de tu rubro</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Radar 3D interactivo de provincias</span>
              </li>
              <li className="flex items-start space-x-3 opacity-40">
                <span className="w-4 h-4 text-slate-600 shrink-0 text-center font-bold">✕</span>
                <span className="line-through text-slate-500">Plantillas descargables Ley 22</span>
              </li>
              <li className="flex items-start space-x-3 opacity-40">
                <span className="w-4 h-4 text-slate-600 shrink-0 text-center font-bold">✕</span>
                <span className="line-through text-slate-500">Probabilidad IA con Gemini 3.8 Flash</span>
              </li>
            </ul>
          </div>

          <Button
            variant="outline"
            onClick={() => onSelectPlan("free_0")}
            className="w-full h-12 rounded-xl text-slate-200 border-slate-700 hover:bg-slate-800"
          >
            Comenzar Gratis
          </Button>
        </div>

        {/* Plan Pro Pyme ($30/mes) */}
        <div className="relative rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-[#0F172A]/90 to-[#0F172A] p-8 backdrop-blur-md flex flex-col justify-between shadow-[0_0_35px_rgba(245,158,11,0.15)] hover:border-amber-500/60 transition-all">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="px-4 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-lg">
              Más Popular
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-amber-400 font-[family-name:var(--font-heading)]">
                Plan Pro Pyme
              </span>
              <Badge variant="gold">Cálculo IA DGI</Badge>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-white font-[family-name:var(--font-mono)]">
                  $30
                </span>
                <span className="text-slate-400 text-sm ml-2">/ mes</span>
              </div>
              <p className="text-slate-400 text-xs mt-2">
                Ideal para Pymes contratistas que licitan con regularidad.
              </p>
            </div>

            <ul className="space-y-3.5 text-sm text-slate-200 mb-8 border-t border-slate-800/80 pt-6">
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="font-semibold text-white">Alertas instantáneas por correo</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Gemini 3.8 Flash:</strong> Calcula probabilidad P_Win cruzando facturas DGI
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Plantillas base esenciales oficiales de la Ley 22 (.docx)</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Bóveda cifrada AES-256-GCM para documentos fiscales</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Asistente virtual de pliegos con IA</span>
              </li>
            </ul>
          </div>

          <Button
            variant="gold"
            onClick={() => onSelectPlan("pro_30")}
            className="w-full h-12 rounded-xl text-slate-950 font-bold"
          >
            Activar Plan Pro ($30/mes)
          </Button>
        </div>

        {/* Plan Corporativo Élite ($50/mes) */}
        <div className="relative rounded-3xl border border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 via-[#0F172A]/90 to-[#0F172A] p-8 backdrop-blur-md flex flex-col justify-between shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:border-emerald-500/80 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-emerald-400 font-[family-name:var(--font-heading)]">
                Plan Corporativo Élite
              </span>
              <Badge variant="default">Máxima Potencia</Badge>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-white font-[family-name:var(--font-mono)]">
                  $50
                </span>
                <span className="text-slate-400 text-sm ml-2">/ mes</span>
              </div>
              <p className="text-slate-400 text-xs mt-2">
                Inteligencia competitiva completa y plantillas redactadas por IA.
              </p>
            </div>

            <ul className="space-y-3.5 text-sm text-slate-200 mb-8 border-t border-slate-800/80 pt-6">
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="font-semibold text-emerald-400">
                  Alertas Omnicanal: WhatsApp + Slack + Teams + Correo
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Análisis de Competidores Históricos:</strong> Quiénes ofertaron y márgenes
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Generación Total por IA:</strong> Gemini 3.8 Flash redacta tu propuesta a medida
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Catálogo completo de plantillas Ley 22 (.docx y .pdf)</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="flex items-center gap-1 font-semibold text-white">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  Chat Directo con el Equipo de Desarrollo (Crisp)
                </span>
              </li>
            </ul>
          </div>

          <Button
            variant="default"
            onClick={() => onSelectPlan("elite_50")}
            className="w-full h-12 rounded-xl text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Activar Plan Élite ($50/mes)
          </Button>
        </div>
      </div>
    </section>
  );
}
