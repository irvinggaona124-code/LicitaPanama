"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Sparkles,
  Shield,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DevTeamChatWidget } from "@/components/support/DevTeamChatWidget";

export default function BillingManagementPage() {
  const [currentTier, setCurrentTier] = useState<"free_0" | "pro_30" | "elite_50">("pro_30");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = (tier: "pro_30" | "elite_50") => {
    setIsProcessing(true);
    // In production, redirects to LemonSqueezy checkout URL or Yappy checkout session
    setTimeout(() => {
      setCurrentTier(tier);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center text-xs text-slate-400 hover:text-emerald-400 transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Volver a Portada
          </a>
          <Badge variant="gold" className="text-xs">
            Facturación B2B
          </Badge>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white font-[family-name:var(--font-heading)]">
            Gestión de Suscripción y Facturación
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Administra el plan de tu empresa, métodos de pago y facturas fiscales con validez DGI.
          </p>
        </div>

        {/* Current Plan Overview Card */}
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A]/90 p-8 backdrop-blur-xl shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Tu Suscripción Activa
              </span>
              <div className="flex items-center space-x-3 mt-1">
                <h2 className="text-2xl font-extrabold text-white font-[family-name:var(--font-heading)]">
                  {currentTier === "elite_50"
                    ? "Plan Corporativo Élite ($50/mes)"
                    : currentTier === "pro_30"
                    ? "Plan Pro Pyme ($30/mes)"
                    : "Plan Inicial ($0/mes)"}
                </h2>
                <Badge variant={currentTier === "elite_50" ? "default" : "gold"}>
                  Renovación Activa
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-mono">
                Próximo Cobro: 19 de Noviembre, 2026
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block mb-1">MÉTODO DE PAGO</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Visa terminada en •••• 4242
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block mb-1">PAGOS LOCALES PANAMÁ</span>
              <span className="font-bold text-emerald-400">
                Soporte Yappy Comercial Activo
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block mb-1">CANALES DE ALERTA</span>
              <span className="font-bold text-white">
                {currentTier === "elite_50"
                  ? "WhatsApp, Email, Slack, Teams"
                  : currentTier === "pro_30"
                  ? "Email Instantáneo"
                  : "Email Semanal"}
              </span>
            </div>
          </div>
        </div>

        {/* Change Plan Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pro 30 Option */}
          <div
            className={`rounded-3xl border p-6 transition-all ${
              currentTier === "pro_30"
                ? "border-amber-500 bg-amber-500/10"
                : "border-slate-800 bg-[#0F172A]/70"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-white text-lg">Plan Pro Pyme ($30/mes)</h3>
              {currentTier === "pro_30" && (
                <Badge variant="gold">Plan Actual</Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Análisis de probabilidad de ganar con facturas DGI y alertas inmediatas por correo.
            </p>
            {currentTier !== "pro_30" && (
              <Button
                variant="gold"
                size="sm"
                onClick={() => handleUpgrade("pro_30")}
                disabled={isProcessing}
                className="w-full text-slate-950 font-bold"
              >
                Cambiar a Plan Pro ($30/mes)
              </Button>
            )}
          </div>

          {/* Elite 50 Option */}
          <div
            className={`rounded-3xl border p-6 transition-all ${
              currentTier === "elite_50"
                ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                : "border-slate-800 bg-[#0F172A]/70"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-white text-lg">Plan Corporativo Élite ($50/mes)</h3>
              {currentTier === "elite_50" && (
                <Badge variant="default">Plan Actual</Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Inteligencia de competidores en PanamáCompra, alertas por WhatsApp y chat directo con desarrolladores.
            </p>
            {currentTier !== "elite_50" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleUpgrade("elite_50")}
                disabled={isProcessing}
                className="w-full text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Actualizar a Plan Élite ($50/mes)
              </Button>
            )}
          </div>
        </div>

        {/* Crisp Chat Floating for Elite Plan */}
        <DevTeamChatWidget planTier={currentTier} />
      </div>
    </div>
  );
}
