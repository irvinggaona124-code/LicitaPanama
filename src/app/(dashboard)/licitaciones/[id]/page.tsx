"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Sparkles,
  Shield,
  Building2,
  Calendar,
  Send,
  ArrowLeft,
  FileCheck2,
  TrendingUp,
  AlertCircle,
  Users,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProbabilityGauge } from "@/components/tenders/ProbabilityGauge";
import { MOCK_TENDERS, type MockTender } from "@/lib/data/mock-tenders";
import { formatCurrency } from "@/lib/utils";

export default function TenderWarRoomPage() {
  const params = useParams();
  const tenderId = params?.id as string;

  const [tender, setTender] = useState<MockTender | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    {
      role: "model",
      text: "¡Bienvenido a la Sala de Guerra de Gemini 3.8 Flash! He procesado el pliego de cargos de este acto público. ¿Deseas analizar los requisitos técnicos, las fianzas exigidas o la estrategia de oferta económica?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const found = MOCK_TENDERS.find((t) => t.id === tenderId) || MOCK_TENDERS[0];
    setTender(found);
  }, [tenderId]);

  const handleSendMessage = async (textToSend?: string) => {
    const msg = textToSend || inputMessage;
    if (!msg.trim()) return;

    setInputMessage("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderTitle: tender?.title,
          tenderMarkdown: tender?.pliego_summary,
          message: msg,
          history: messages,
        }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: "No se pudo conectar con el motor de IA en este momento.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Error de conexión al consultar Gemini 3.8 Flash.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!tender) return null;

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center text-xs text-slate-400 hover:text-emerald-400 transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Volver al Explorador
          </a>
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="text-xs">
              Sala de Guerra Activa
            </Badge>
            <Badge variant="gold" className="text-xs">
              Gemini 3.8 Flash
            </Badge>
          </div>
        </div>

        {/* Acto Title & Header */}
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A]/90 p-8 backdrop-blur-xl shadow-2xl mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20 font-bold">
              {tender.acto_numero}
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Cierre: {new Date(tender.close_date).toLocaleDateString("es-PA")}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 font-[family-name:var(--font-heading)]">
            {tender.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>{tender.entity_name}</span>
            </div>
            <div>
              <span className="text-slate-500">Monto Oficial:</span>{" "}
              <strong className="text-emerald-400 font-mono">
                {formatCurrency(tender.reference_amount)}
              </strong>
            </div>
            <div>
              <span className="text-slate-500">Provincia:</span>{" "}
              <strong className="text-white">{tender.province}</strong>
            </div>
          </div>
        </div>

        {/* 2-Column War Room Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Probability Gauge & Competitor Matrix */}
          <div className="lg:col-span-5 space-y-6">
            {/* Probability Gauge Component */}
            <ProbabilityGauge
              score={82}
              isLocked={false}
              financialMatch={true}
              technicalMatch={88}
              competitorRisk="Medio"
              law22Compliance={94}
            />

            {/* Competitor Matrix (Plan $50) */}
            <div className="rounded-3xl border border-slate-800 bg-[#0F172A]/90 p-6 backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white font-[family-name:var(--font-heading)]">
                    Historial de Competidores (PanamáCompra)
                  </h3>
                </div>
                <Badge variant="cyan" className="text-[10px]">
                  Exclusivo Plan $50
                </Badge>
              </div>

              <div className="space-y-3 mb-6">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-bold text-white mb-1">
                    <span>CONSTRUCTORA NACIONAL S.A.</span>
                    <span className="text-emerald-400">62% Victorias</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                    <span>Descuento Promedio vs Oficial:</span>
                    <span className="text-amber-400 font-bold">-7.5%</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-bold text-white mb-1">
                    <span>ELECTROMECÁNICA PANAMÁ S.A.</span>
                    <span className="text-emerald-400">45% Victorias</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                    <span>Descuento Promedio vs Oficial:</span>
                    <span className="text-amber-400 font-bold">-4.8%</span>
                  </div>
                </div>
              </div>

              {/* Recommended Bid Pill */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1">
                  <Target className="w-4 h-4" />
                  <span>Rango de Oferta Recomendado por IA</span>
                </div>
                <p className="text-slate-300 font-mono text-sm font-extrabold">
                  {formatCurrency(tender.reference_amount * 0.92)} a {formatCurrency(tender.reference_amount * 0.95)}
                </p>
                <p className="text-slate-400 text-[11px] mt-1">
                  Un 93% del precio oficial maximiza la probabilidad sin caer en causal de oferta temeraria según la Ley 22.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800">
                <a href="/plantillas">
                  <Button variant="default" size="sm" className="w-full flex items-center justify-center gap-2">
                    <FileCheck2 className="w-4 h-4" />
                    <span>Redactar Propuesta en Estudio de Plantillas</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Gemini 3.8 Flash Chat */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-800 bg-[#0F172A]/90 p-6 backdrop-blur-xl shadow-xl flex flex-col h-[700px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-[family-name:var(--font-heading)]">
                      Asistente Especializado Gemini 3.8 Flash
                    </h3>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Lectura de pliego activa • Contexto legal Ley 22
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-emerald-500 text-slate-950 font-medium ml-8"
                          : "bg-slate-900 border border-slate-800 text-slate-200 mr-8"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                      <span className="ml-2 font-mono">Gemini 3.8 Flash analizando...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompt Pills */}
              <div className="py-3 flex flex-wrap gap-2 border-t border-slate-800/80 mt-2">
                <button
                  onClick={() => handleSendMessage("¿Qué fianzas y porcentajes exige este pliego?")}
                  className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-[11px] text-slate-300 hover:border-emerald-500/50 hover:text-white transition-colors"
                >
                  ¿Qué fianzas exige el pliego?
                </button>
                <button
                  onClick={() => handleSendMessage("¿Cuáles son los criterios de ponderación técnica?")}
                  className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-[11px] text-slate-300 hover:border-emerald-500/50 hover:text-white transition-colors"
                >
                  Criterios de ponderación
                </button>
                <button
                  onClick={() => handleSendMessage("¿Cómo podemos subsanar la capacidad financiera?")}
                  className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-[11px] text-slate-300 hover:border-emerald-500/50 hover:text-white transition-colors"
                >
                  Subsanación de experiencia
                </button>
              </div>

              {/* Input Bar */}
              <div className="flex items-center space-x-2 pt-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Pregunta a Gemini 3.8 Flash sobre este pliego de cargos..."
                  className="flex-1 text-xs sm:text-sm bg-slate-900 border-slate-700 text-white"
                />
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
