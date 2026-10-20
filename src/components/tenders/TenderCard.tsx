"use client";

import React from "react";
import { type MockTender } from "@/lib/data/mock-tenders";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Sparkles,
  Bell,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface TenderCardProps {
  tender: MockTender;
  onRequireAuth: (action: "templates" | "probability" | "alerts") => void;
  onViewDetails?: (tender: MockTender) => void;
}

export function TenderCard({
  tender,
  onRequireAuth,
  onViewDetails,
}: TenderCardProps) {
  return (
    <div className="group relative rounded-2xl border border-slate-800 bg-[#0F172A]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-slate-700 hover:shadow-2xl flex flex-col justify-between">
      {/* Top Meta Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800">
              {tender.acto_numero}
            </span>
            <Badge variant="default" className="text-[10px]">
              {tender.status}
            </Badge>
          </div>

          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{tender.province}</span>
          </div>
        </div>

        {/* Title & Entity */}
        <h3
          onClick={() => onViewDetails?.(tender)}
          className="text-lg font-bold text-white mb-2 leading-snug cursor-pointer group-hover:text-emerald-400 transition-colors line-clamp-2 font-[family-name:var(--font-heading)]"
        >
          {tender.title}
        </h3>

        <div className="flex items-center space-x-2 text-sm text-slate-300 mb-4">
          <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{tender.entity_name}</span>
        </div>

        {/* Budget Reference & Close Date */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 mb-5">
          <div>
            <span className="text-[10px] text-slate-400 block font-mono uppercase tracking-wider">
              Precio de Referencia
            </span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">
              {formatCurrency(tender.reference_amount)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-mono uppercase tracking-wider">
              Fecha de Apertura
            </span>
            <span className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-1 mt-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {new Date(tender.close_date).toLocaleDateString("es-PA")}
            </span>
          </div>
        </div>

        {/* UNSPSC Category */}
        <div className="text-xs text-slate-400 mb-5 line-clamp-1 font-mono">
          <span className="text-slate-500 font-semibold">Rubro:</span> {tender.category_unspsc}
        </div>
      </div>

      {/* 3 High-Value Paywall Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-slate-800/60">
        <button
          onClick={() => onRequireAuth("probability")}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] group/btn"
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Calcular Probabilidad de Ganar con IA</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onRequireAuth("templates")}
            className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 text-xs font-medium hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Plantillas Ley 22</span>
          </button>

          <button
            onClick={() => onRequireAuth("alerts")}
            className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 text-xs font-medium hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all"
          >
            <Bell className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Activar Alerta</span>
          </button>
        </div>
      </div>
    </div>
  );
}
