"use client";

import React, { useState } from "react";
import {
  Building2,
  FileCheck2,
  TrendingUp,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const UNSPSC_CATALOG = [
  { code: "39121011", label: "Generadores de energía y sistemas eléctricos" },
  { code: "72141003", label: "Pavimentación y obras viales" },
  { code: "72151500", label: "Mantenimiento electromecánico industrial" },
  { code: "51101500", label: "Medicamentos e insumos hospitalarios" },
  { code: "72121400", label: "Construcción de infraestructura educativa" },
  { code: "72141114", label: "Acueductos y plantas potabilizadoras" },
  { code: "81112000", label: "Servicios de tecnología de la información y cloud" },
  { code: "80101500", label: "Consultoría de ingeniería y supervisión de obra" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [ruc, setRuc] = useState("155694200");
  const [dv, setDv] = useState("2");
  const [razonSocial, setRazonSocial] = useState("INGENIERÍA Y CONSTRUCCIONES DEL ISTMO S.A.");
  const [selectedUnspsc, setSelectedUnspsc] = useState<string[]>([
    "39121011",
    "72141003",
  ]);
  const [annualRevenue, setAnnualRevenue] = useState("1500000");
  const [yearsExperience, setYearsExperience] = useState("8");
  const [alertEmail, setAlertEmail] = useState("licitaciones@istmopanama.com");
  const [whatsapp, setWhatsapp] = useState("+507 6890-1234");

  // DGI Upload State
  const [dgiUploading, setDgiUploading] = useState(false);
  const [dgiSuccess, setDgiSuccess] = useState<any>(null);
  const [dgiError, setDgiError] = useState<string | null>(null);

  const handleToggleUnspsc = (code: string) => {
    setSelectedUnspsc((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setDgiUploading(true);
      setDgiError(null);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/dgi/parse-xml", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDgiSuccess(data.invoice);
      } else {
        setDgiError(data.error || "Error al validar XML de DGI.");
      }
    } catch (err: any) {
      setDgiError(err.message || "Fallo en conexión.");
    } finally {
      setDgiUploading(false);
    }
  };

  const handleFinishOnboarding = () => {
    setIsSubmitting(true);
    // Simulate saving organization profile and redirect to dashboard
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#070B14] text-[#F8FAFC] flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Top Brand */}
      <div className="absolute top-6 left-6 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30">
          LP
        </div>
        <span className="font-extrabold text-lg text-white font-[family-name:var(--font-heading)]">
          LicitaPanamá <span className="text-emerald-400">AI</span>
        </span>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>PASO {step} DE 4</span>
            <span className="text-emerald-400 font-semibold">
              {step === 1 && "Identificación Fiscal"}
              {step === 2 && "Rubro UNSPSC"}
              {step === 3 && "Capacidad Técnica"}
              {step === 4 && "Conexión DGI"}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Multi-Step Card */}
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A]/90 p-8 backdrop-blur-xl shadow-2xl">
          {/* STEP 1: RUC + DV + RAZÓN SOCIAL */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Badge variant="default" className="mb-2 text-[11px]">
                  Paso 1: Identificación Jurídica
                </Badge>
                <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)]">
                  Datos Fiscales de la Empresa
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Gemini 3.8 Flash utilizará estos datos para verificar tu personería en PanamáCompra.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">
                    RUC (Registro Único de Contribuyente)
                  </label>
                  <Input
                    value={ruc}
                    onChange={(e) => setRuc(e.target.value)}
                    placeholder="155694200"
                    className="font-mono"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">
                    DV
                  </label>
                  <Input
                    value={dv}
                    onChange={(e) => setDv(e.target.value)}
                    placeholder="2"
                    maxLength={2}
                    className="font-mono text-center"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1.5">
                  Razón Social (según Registro Público de Panamá)
                </label>
                <Input
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value)}
                  placeholder="NOMBRE COMERCIAL O JURÍDICO S.A."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">
                    Correo para Alertas de Licitación
                  </label>
                  <Input
                    type="email"
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    placeholder="licitaciones@tuempresa.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">
                    WhatsApp para Alertas (Opcional)
                  </label>
                  <Input
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+507 6890-1234"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: UNSPSC CODES */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Badge variant="cyan" className="mb-2 text-[11px]">
                  Paso 2: Segmentación de Mercado
                </Badge>
                <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)]">
                  Rubros de PanamáCompra (UNSPSC)
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Selecciona los rubros donde tu empresa compite para filtrar licitaciones exactas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {UNSPSC_CATALOG.map((cat) => {
                  const isChecked = selectedUnspsc.includes(cat.code);
                  return (
                    <div
                      key={cat.code}
                      onClick={() => handleToggleUnspsc(cat.code)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? "bg-emerald-500/10 border-emerald-500/50 text-white"
                          : "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs text-emerald-400 font-bold">
                          {cat.code}
                        </span>
                        {isChecked && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <p className="text-xs leading-snug">{cat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: CAPACIDAD TÉCNICA Y EXPERIENCIA */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Badge variant="gold" className="mb-2 text-[11px]">
                  Paso 3: Perfil Financiero
                </Badge>
                <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)]">
                  Capacidad de Contratación
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Parámetros clave para la fórmula de probabilidad de adjudicación P_Win.
                </p>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1.5">
                  Facturación Anual Promedio Acreditada (USD)
                </label>
                <Input
                  type="number"
                  value={annualRevenue}
                  onChange={(e) => setAnnualRevenue(e.target.value)}
                  placeholder="1500000"
                  className="font-mono text-emerald-400 text-base"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Estimado: {formatCurrency(Number(annualRevenue) || 0)}
                </span>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1.5">
                  Años de Experiencia Comprobable en Contrataciones
                </label>
                <Input
                  type="number"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  placeholder="8"
                  className="font-mono"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Gemini 3.8 Flash utilizará estos valores para recomendarte el rango de oferta económica y detectar si tu empresa califica financieramente para pliegos mayores a $1,000,000.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: CONEXIÓN FISCAL DGI (DROPZONE XML) */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <Badge variant="default" className="mb-2 text-[11px]">
                  Paso 4: Verificación DGI (Opcional)
                </Badge>
                <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)]">
                  Bóveda de Facturación DGI Cifrada
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Sube facturas electrónicas (.xml SFEP) para que la IA certifique tu solvencia real con grado bancario AES-256-GCM.
                </p>
              </div>

              {/* Upload Dropzone */}
              <label className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/50 group">
                <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-emerald-400 transition-colors mb-3" />
                <span className="text-sm font-semibold text-white mb-1">
                  {dgiUploading
                    ? "Cifrando y analizando factura DGI..."
                    : "Haz clic para subir Factura Electrónica SFEP (.xml)"}
                </span>
                <span className="text-xs text-slate-400">
                  Cifrado inmediato con AES-256-GCM en memoria efímera
                </span>
                <input
                  type="file"
                  accept=".xml,.pdf"
                  onChange={handleFileUpload}
                  disabled={dgiUploading}
                  className="hidden"
                />
              </label>

              {dgiError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{dgiError}</span>
                </div>
              )}

              {dgiSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Factura DGI Validada y Cifrada en Bóveda</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px] pt-1">
                    <div>CUFE: {dgiSuccess.cufe.slice(0, 16)}...</div>
                    <div>Total: {formatCurrency(dgiSuccess.totalAmount)}</div>
                    <div>Emisor: {dgiSuccess.issuerRuc}</div>
                    <div>Algoritmo: {dgiSuccess.cipherAlgorithm}</div>
                  </div>
                </div>
              )}

              <div className="text-center">
                <span className="text-xs text-slate-500">
                  Puedes omitir este paso ahora y cargar facturas en cualquier momento desde tu panel de Facturación.
                </span>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-8">
            {step > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={handleFinishOnboarding}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
              >
                <Sparkles className="w-4 h-4" />
                {isSubmitting ? "Configurando Panel..." : "Finalizar y Entrar al Dashboard"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
