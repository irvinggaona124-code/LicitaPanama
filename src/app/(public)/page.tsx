"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Sparkles,
  Shield,
  Search,
  ArrowRight,
  Zap,
  Award,
  BarChart3,
  Building2,
  FileCheck2,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { ProbabilityGauge } from "@/components/tenders/ProbabilityGauge";
import { SsoModal } from "@/components/ui/sso-modal";
import { TenderCard } from "@/components/tenders/TenderCard";
import { TenderSearchFilter } from "@/components/tenders/TenderSearchFilter";
import { PricingSection } from "@/components/pricing/PricingSection";
import { MOCK_TENDERS, type MockTender } from "@/lib/data/mock-tenders";

// Dynamic import for WebGL Three.js Radar to disable SSR
const PanamaTenderRadar3D = dynamic(
  () =>
    import("@/components/three/PanamaTenderRadar3D").then(
      (mod) => mod.PanamaTenderRadar3D
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] rounded-3xl border border-slate-800 bg-[#070B14] flex flex-col items-center justify-center text-slate-400 font-mono text-xs">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-3" />
        <span>Iniciando Radar Holográfico 3D (WebGL)...</span>
      </div>
    ),
  }
);

export default function HomePage() {
  const [isSsoOpen, setIsSsoOpen] = useState(false);
  const [ssoModalData, setSsoModalData] = useState({
    title: "Acceso Corporativo Instantáneo",
    subtitle:
      "Inicia sesión con tu cuenta corporativa para desbloquear IA, plantillas Ley 22 y alertas de PanamáCompra.",
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Todas las Provincias");
  const [selectedBudget, setSelectedBudget] = useState("all");

  const handleRequireAuth = (action: "templates" | "probability" | "alerts") => {
    if (action === "probability") {
      setSsoModalData({
        title: "Calculadora de Probabilidad de Adjudicación",
        subtitle:
          "Gemini 3.8 Flash analiza la solvencia fiscal de tu empresa (DGI) y tus antecedentes frente al pliego. Conéctate con SSO en 1 clic.",
      });
    } else if (action === "templates") {
      setSsoModalData({
        title: "Descarga de Plantillas Ley 22 (.docx)",
        subtitle:
          "Accede a los modelos oficiales: Propuesta Económica, Pacto de Integridad y Medidas de Retorsión Ley 48. Inicia sesión para descargar.",
      });
    } else {
      setSsoModalData({
        title: "Alertas Automáticas de PanamáCompra",
        subtitle:
          "Recibe notificaciones instantáneas de nuevas licitaciones en tu rubro por correo o WhatsApp. Inicia sesión para activar tu canal.",
      });
    }
    setIsSsoOpen(true);
  };

  // Filtered Tenders
  const filteredTenders = useMemo(() => {
    return MOCK_TENDERS.filter((tender) => {
      // Search query
      const matchesQuery =
        searchQuery === "" ||
        tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.entity_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.acto_numero.toLowerCase().includes(searchQuery.toLowerCase());

      // Province
      const matchesProvince =
        selectedProvince === "Todas las Provincias" ||
        tender.province === selectedProvince;

      // Budget
      let matchesBudget = true;
      if (selectedBudget === "under_500k") {
        matchesBudget = tender.reference_amount <= 500000;
      } else if (selectedBudget === "500k_2m") {
        matchesBudget =
          tender.reference_amount > 500000 &&
          tender.reference_amount <= 2000000;
      } else if (selectedBudget === "over_2m") {
        matchesBudget = tender.reference_amount > 2000000;
      }

      return matchesQuery && matchesProvince && matchesBudget;
    });
  }, [searchQuery, selectedProvince, selectedBudget]);

  return (
    <main className="min-h-screen bg-[#070B14] text-[#F8FAFC]">
      {/* Top Fixed Header */}
      <nav className="fixed top-0 inset-x-0 z-40 border-b border-slate-800/80 bg-[#070B14]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
              LP
            </div>
            <div>
              <span className="font-extrabold text-lg text-white font-[family-name:var(--font-heading)]">
                LicitaPanamá <span className="text-emerald-400">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                GovTech Panamá
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm text-slate-300 font-medium">
            <a href="#radar" className="hover:text-emerald-400 transition-colors">
              Radar 3D
            </a>
            <a href="#explorador" className="hover:text-emerald-400 transition-colors">
              Licitaciones en Vivo
            </a>
            <a href="#inteligencia" className="hover:text-emerald-400 transition-colors">
              Motor IA
            </a>
            <a href="#precios" className="hover:text-emerald-400 transition-colors">
              Planes
            </a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSsoModalData({
                  title: "Iniciar Sesión Corporativa",
                  subtitle:
                    "Accede a tu panel empresarial y sala de guerra de licitaciones.",
                });
                setIsSsoOpen(true);
              }}
              className="text-slate-300 hover:text-white"
            >
              Iniciar Sesión
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setSsoModalData({
                  title: "Registro Corporativo SSO",
                  subtitle:
                    "Crea la cuenta de tu empresa en 1 clic. Sin 2FA obligatorio en registro.",
                });
                setIsSsoOpen(true);
              }}
              className="flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Registrar Empresa</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-emerald-500/10 blur-[150px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge
            variant="default"
            className="mb-6 px-4 py-1.5 text-xs font-semibold tracking-wide border-emerald-500/30"
          >
            Impulsado por Gemini 3.8 Flash + PanamáCompra OCDS
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6 font-[family-name:var(--font-heading)]">
            Gana más licitaciones del Estado con{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">
              Certeza Algorítmica
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Plataforma GovTech de inteligencia de mercado para Panamá. Analiza pliegos en segundos, calcula tu probabilidad de adjudicación cruzando tus facturas DGI y genera plantillas formales de la Ley 22.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a href="#explorador" className="w-full sm:w-auto">
              <Button
                variant="default"
                size="lg"
                className="w-full sm:w-auto text-base px-8 h-12 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
              >
                Explorar Actos Públicos en Vivo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="#radar" className="w-full sm:w-auto">
              <Button
                variant="glass"
                size="lg"
                className="w-full sm:w-auto text-base px-8 h-12"
              >
                Ver Radar 3D de Provincias
              </Button>
            </a>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 block font-mono">
                ACTOS MONITOREADOS
              </span>
              <span className="text-2xl font-extrabold text-white font-mono">
                2,480+
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 block font-mono">
                MONTO EN JUEGO
              </span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                $184.5M
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 block font-mono">
                TIEMPO DE RESPUESTA IA
              </span>
              <span className="text-2xl font-extrabold text-amber-400 font-mono">
                1.4s
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 block font-mono">
                MARCO LEGAL
              </span>
              <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                Ley 22 / SFEP
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3D WebGL Radar Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto" id="radar">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <Badge variant="default" className="mb-2 text-xs font-semibold">
              Telemetría Espacial en Borde
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-[family-name:var(--font-heading)]">
              Radar Holográfico 3D de la República de Panamá
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-2 md:mt-0 leading-relaxed">
            Pulso espacial en tiempo real de actos públicos publicados por ministerios y entidades autónomas en las 10 provincias.
          </p>
        </div>

        <PanamaTenderRadar3D
          onSelectTender={(tender) => {
            handleRequireAuth("probability");
          }}
        />
      </section>

      {/* Public Tender Explorer with Intelligent Paywall */}
      <section className="py-16 px-6 max-w-7xl mx-auto" id="explorador">
        <div className="text-center mb-10">
          <Badge variant="cyan" className="mb-3 text-xs font-semibold">
            Acceso Abierto sin Iniciar Sesión
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 font-[family-name:var(--font-heading)]">
            Explorador Público de PanamáCompra
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            Consulta pliegos de cargos en vivo. Desbloquea plantillas oficiales y cálculo de probabilidad con tu cuenta corporativa.
          </p>
        </div>

        {/* Live Filter Controls */}
        <TenderSearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedProvince={selectedProvince}
          onProvinceChange={setSelectedProvince}
          selectedBudget={selectedBudget}
          onBudgetChange={setSelectedBudget}
          totalResults={filteredTenders.length}
        />

        {/* Tenders Cards Grid */}
        {filteredTenders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenders.map((tender) => (
              <TenderCard
                key={tender.id}
                tender={tender}
                onRequireAuth={handleRequireAuth}
                onViewDetails={() => handleRequireAuth("probability")}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-slate-800 bg-[#0F172A]/40">
            <Search className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white mb-1">
              No se encontraron actos públicos
            </h4>
            <p className="text-sm text-slate-400">
              Intenta cambiar los términos de búsqueda o restablecer los filtros de provincia y monto.
            </p>
          </div>
        )}
      </section>

      {/* GovTech Bento Grid Intelligence Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto" id="inteligencia">
        <div className="text-center mb-16">
          <Badge variant="gold" className="mb-3 text-xs font-semibold">
            Poder de Frontera
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 font-[family-name:var(--font-heading)]">
            Ingeniería de IA para Ganar Contratos
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            Combinamos modelos LLM de última generación, matemáticas de probabilidad y seguridad zero-trust.
          </p>
        </div>

        <BentoGrid>
          <BentoGridItem
            title="Velocímetro de Probabilidad P_Win"
            description="Algoritmo que correlaciona la facturación validada de la DGI con el monto de referencia y la similitud semántica del pliego en pgvector."
            header={
              <div className="flex items-center justify-center p-2">
                <ProbabilityGauge
                  score={78}
                  isLocked={true}
                  onUnlock={() => handleRequireAuth("probability")}
                />
              </div>
            }
            icon={<BarChart3 className="w-6 h-6 text-emerald-400" />}
            className="md:col-span-2 md:row-span-2"
          />

          <BentoGridItem
            title="Generador de Plantillas Ley 22"
            description="Exporta en cliente archivos .docx de propuesta formal, pacto de integridad y retorsión Ley 48 sin consumo en servidor."
            header={
              <div className="h-32 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-amber-400 space-y-1">
                <FileCheck2 className="w-8 h-8" />
                <span className="text-xs font-mono text-slate-300">
                  Exportación Nativa .docx
                </span>
              </div>
            }
            icon={<Award className="w-6 h-6 text-amber-400" />}
          />

          <BentoGridItem
            title="Inteligencia de Competidores"
            description="Exclusivo del Plan Élite ($50): detecta quiénes han ganado licitaciones similares en esa entidad y sus rangos de descuento."
            header={
              <div className="h-32 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-cyan-400 space-y-1">
                <Building2 className="w-8 h-8" />
                <span className="text-xs font-mono text-slate-300">
                  Mapeo Histórico PanamáCompra
                </span>
              </div>
            }
            icon={<Zap className="w-6 h-6 text-cyan-400" />}
          />

          <BentoGridItem
            title="Bóveda Cifrada DGI (AES-256-GCM)"
            description="Cifrado de grado bancario para facturas electrónicas SFEP con verificación automática de código CUFE."
            header={
              <div className="h-28 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-emerald-400">
                <Shield className="w-8 h-8" />
              </div>
            }
            icon={<Shield className="w-6 h-6 text-emerald-400" />}
            className="md:col-span-3"
          />
        </BentoGrid>
      </section>

      {/* Pricing Matrix */}
      <PricingSection
        onSelectPlan={(tier) => {
          setSsoModalData({
            title: `Activar ${tier === "elite_50" ? "Plan Corporativo Élite" : tier === "pro_30" ? "Plan Pro Pyme" : "Plan Inicial"}`,
            subtitle:
              "Inicia sesión con la cuenta de tu empresa para configurar tu suscripción.",
          });
          setIsSsoOpen(true);
        }}
      />

      {/* Institutional GovTech Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070B14] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30">
              LP
            </div>
            <div>
              <p className="font-semibold text-slate-300">
                LicitaPanamá AI — Plataforma de Inteligencia de Compras Públicas
              </p>
              <p className="text-[11px]">
                Cumplimiento estricto con el Texto Único de la Ley 22 y el Sistema de Factura Electrónica de Panamá (SFEP).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <span>República de Panamá</span>
            <span>•</span>
            <span>Cifrado AES-256-GCM</span>
            <span>•</span>
            <span>Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>

      {/* Interactive SSO Paywall Modal */}
      <SsoModal
        isOpen={isSsoOpen}
        onClose={() => setIsSsoOpen(false)}
        title={ssoModalData.title}
        subtitle={ssoModalData.subtitle}
      />
    </main>
  );
}
