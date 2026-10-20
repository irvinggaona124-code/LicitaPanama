"use client";

import React from "react";
import { Search, Filter, X, Building, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TenderSearchFilterProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedProvince: string;
  onProvinceChange: (val: string) => void;
  selectedBudget: string;
  onBudgetChange: (val: string) => void;
  totalResults: number;
}

const PROVINCES = [
  "Todas las Provincias",
  "Panamá",
  "Chiriquí",
  "Colón",
  "Coclé",
  "Veraguas",
  "Herrera",
  "Los Santos",
  "Panamá Oeste",
  "Bocas del Toro",
  "Darién",
];

const BUDGET_RANGES = [
  { label: "Cualquier Monto", value: "all" },
  { label: "Hasta $500,000", value: "under_500k" },
  { label: "$500,000 a $2,000,000", value: "500k_2m" },
  { label: "Más de $2,000,000", value: "over_2m" },
];

export function TenderSearchFilter({
  searchQuery,
  onSearchChange,
  selectedProvince,
  onProvinceChange,
  selectedBudget,
  onBudgetChange,
  totalResults,
}: TenderSearchFilterProps) {
  const hasActiveFilters =
    searchQuery !== "" ||
    selectedProvince !== "Todas las Provincias" ||
    selectedBudget !== "all";

  const clearFilters = () => {
    onSearchChange("");
    onProvinceChange("Todas las Provincias");
    onBudgetChange("all");
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-[#0F172A]/90 p-5 backdrop-blur-md mb-8 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        {/* Search Input */}
        <div className="relative md:col-span-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por acto, entidad o palabra clave (ej. generador, carretera, MINSA)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 text-xs sm:text-sm bg-slate-900/90 border-slate-700/80 text-white placeholder:text-slate-500"
          />
        </div>

        {/* Province Select */}
        <div className="relative md:col-span-3">
          <select
            value={selectedProvince}
            onChange={(e) => onProvinceChange(e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {PROVINCES.map((prov) => (
              <option key={prov} value={prov} className="bg-slate-900 text-white">
                {prov}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Range Select */}
        <div className="relative md:col-span-3">
          <select
            value={selectedBudget}
            onChange={(e) => onBudgetChange(e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {BUDGET_RANGES.map((b) => (
              <option key={b.value} value={b.value} className="bg-slate-900 text-white">
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear / Results info */}
        <div className="md:col-span-1 flex items-center justify-center">
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              title="Limpiar filtros"
              className="p-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-center font-mono text-[11px] text-emerald-400 font-semibold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
              {totalResults}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
