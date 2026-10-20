"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Shield,
  Building2,
  FileCheck2,
  TrendingUp,
  Bell,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  FileText,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProbabilityGauge } from "@/components/tenders/ProbabilityGauge";
import { MOCK_TENDERS } from "@/lib/data/mock-tenders";
import { formatCurrency } from "@/lib/utils";

export default function MainDashboardPage() {
  const [activeTenders] = useState(MOCK_TENDERS.slice(0, 4));

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
              LP
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-heading)]">
                  Panel de Control Empresarial
                </h1>
                <Badge variant="default" className="text-[10px]">
                  Plan Pro Pyme
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                INGENIERÍA Y CONSTRUCCIONES DEL ISTMO S.A. • RUC: 155694200-2
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a href="/plantillas">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 border-slate-700">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <span>Plantillas Ley 22</span>
              </Button>
            </a>
            <a href="/seguridad">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 border-slate-700">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Seguridad y 2FA</span>
              </Button>
            </a>
            <a href="/facturacion">
              <Button variant="gold" size="sm" className="flex items-center gap-1.5 text-slate-950 font-bold">
                <span>Gestionar Plan</span>
              </Button>
            </a>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono mb-1">
              LICITACIONES EN TU RUBRO
            </span>
            <span className="text-2xl font-extrabold text-white font-mono">
              18 Actos
            </span>
            <span className="text-[11px] text-emerald-400 block mt-1">
              4 publicadas esta semana
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono mb-1">
              SOLVENCIA FISCAL DGI
            </span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              $1,850,000.00
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Certificada con AES-256-GCM
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono mb-1">
              ALERTAS DESPACHADAS
            </span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">
              24 Enviadas
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Vía Correo y WhatsApp
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono mb-1">
              TASA MEDIA DE VICTORIA
            </span>
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">
              78% P_Win
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Fórmula Gemini 3.8 Flash
            </span>
          </div>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Watched Tenders */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white font-[family-name:var(--font-heading)]">
                Licitaciones Monitoreadas en Tiempo Real
              </h3>
              <a href="/#explorador" className="text-xs text-emerald-400 hover:underline font-mono">
                Buscar más actos →
              </a>
            </div>

            {activeTenders.map((tender) => (
              <div
                key={tender.id}
                className="p-5 rounded-2xl border border-slate-800 bg-[#0F172A]/80 backdrop-blur-md hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {tender.acto_numero}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {tender.entity_name}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm line-clamp-1">
                    {tender.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
                    <span>Monto: <strong className="text-emerald-400">{formatCurrency(tender.reference_amount)}</strong></span>
                    <span>Provincia: <strong className="text-slate-300">{tender.province}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <a href={`/licitaciones/${tender.id}`}>
                    <Button variant="glassEmerald" size="sm" className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Sala de Guerra IA</span>
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Mini Probability Radar & Quick Tools */}
          <div className="lg:col-span-4 space-y-6">
            <ProbabilityGauge
              score={78}
              isLocked={false}
              financialMatch={true}
              technicalMatch={85}
              competitorRisk="Bajo"
              law22Compliance={96}
            />

            <div className="rounded-3xl border border-slate-800 bg-[#0F172A]/90 p-6 backdrop-blur-xl shadow-xl space-y-4">
              <h4 className="font-bold text-white text-sm font-[family-name:var(--font-heading)]">
                Herramientas Rápidas Ley 22
              </h4>
              <div className="space-y-2 text-xs">
                <a
                  href="/plantillas"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Generar Propuesta Económica (.docx)
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <a
                  href="/plantillas"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Pacto de Integridad y Ley 48
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
