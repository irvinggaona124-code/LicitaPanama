"use client";

import React from "react";
import { Lock, Sparkles, TrendingUp, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProbabilityGaugeProps {
  score?: number; // 0 to 100
  isLocked?: boolean;
  financialMatch?: boolean;
  technicalMatch?: number; // 0 to 100
  competitorRisk?: "Bajo" | "Medio" | "Alto";
  law22Compliance?: number; // 0 to 100
  onUnlock?: () => void;
}

export function ProbabilityGauge({
  score = 78,
  isLocked = false,
  financialMatch = true,
  technicalMatch = 85,
  competitorRisk = "Medio",
  law22Compliance = 95,
  onUnlock,
}: ProbabilityGaugeProps) {
  // Determine color based on score
  const getColor = (val: number) => {
    if (val >= 70) return { stroke: "#10B981", text: "text-emerald-400", label: "Alta Probabilidad" };
    if (val >= 40) return { stroke: "#F59E0B", text: "text-amber-400", label: "Competitivo con Ajustes" };
    return { stroke: "#EF4444", text: "text-red-400", label: "Riesgo Alto de Descalificación" };
  };

  const currentTheme = getColor(score);
  // Semicircle calculations (radius 70, strokeWidth 12)
  const radius = 70;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-[#0F172A]/90 p-6 backdrop-blur-md overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h4 className="font-bold text-white text-base font-[family-name:var(--font-heading)]">
            Probabilidad de Adjudicación (P_Win)
          </h4>
        </div>
        <Badge variant={score >= 70 ? "default" : score >= 40 ? "gold" : "destructive"}>
          Gemini 3.8 Flash
        </Badge>
      </div>

      {/* Main Gauge Graphic */}
      <div className={`relative flex flex-col items-center justify-center pt-2 transition-all duration-300 ${isLocked ? "filter blur-md select-none" : ""}`}>
        <div className="relative w-48 h-28 flex items-center justify-center">
          <svg className="w-48 h-48 -rotate-180 transform" viewBox="0 0 160 160">
            {/* Background arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#1E293B"
              strokeWidth="12"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Value arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={currentTheme.stroke}
              strokeWidth="12"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute top-12 flex flex-col items-center">
            <span className="text-3xl font-extrabold text-white font-[family-name:var(--font-mono)]">
              {score}%
            </span>
            <span className={`text-xs font-semibold ${currentTheme.text}`}>
              {currentTheme.label}
            </span>
          </div>
        </div>

        {/* 4 Factor Breakdown */}
        <div className="w-full grid grid-cols-2 gap-3 mt-4 text-xs font-[family-name:var(--font-mono)]">
          <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Solvencia DGI
            </div>
            <span className={financialMatch ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
              {financialMatch ? "Capacidad Aprobada" : "Insuficiente"}
            </span>
          </div>

          <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Afinidad Vectorial
            </div>
            <span className="text-amber-400 font-bold">{technicalMatch}% Match</span>
          </div>

          <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
              Riesgo Competidores
            </div>
            <span className="text-slate-200 font-bold">{competitorRisk}</span>
          </div>

          <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Fórmula Ley 22
            </div>
            <span className="text-emerald-400 font-bold">{law22Compliance}% Conforme</span>
          </div>
        </div>
      </div>

      {/* Paywall Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-[#070B14]/80 backdrop-blur-sm text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Lock className="w-6 h-6" />
          </div>
          <h4 className="text-white font-bold text-base mb-1 font-[family-name:var(--font-heading)]">
            Análisis de Probabilidad Protegido
          </h4>
          <p className="text-slate-400 text-xs max-w-xs mb-4">
            Gemini 3.8 Flash compara la facturación DGI de tu empresa con los requisitos de este pliego.
          </p>
          <Button
            onClick={onUnlock}
            variant="default"
            size="sm"
            className="w-full max-w-xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Calcular Probabilidad de Mi Empresa
          </Button>
        </div>
      )}
    </div>
  );
}
