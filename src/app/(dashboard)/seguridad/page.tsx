"use client";

import React, { useState } from "react";
import {
  Shield,
  KeyRound,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  History,
  ArrowLeft,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function SecurityPage() {
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [showTotpSetup, setShowTotpSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [setupSuccess, setSetupSuccess] = useState(false);

  const mockLogs = [
    {
      id: "log-1",
      event: "DGI_INVOICE_ENCRYPTED_AND_VAULTED",
      details: "Factura CUFE FE0120268923 cifrada con AES-256-GCM ($145,000.00)",
      ip: "190.140.88.24 (Panamá)",
      date: "Hace 15 minutos",
      status: "Éxito",
    },
    {
      id: "log-2",
      event: "ORGANIZATION_PROFILE_UPDATED",
      details: "Actualización de códigos UNSPSC y solvencia anual",
      ip: "190.140.88.24 (Panamá)",
      date: "Hace 1 hora",
      status: "Éxito",
    },
    {
      id: "log-3",
      event: "OAUTH_LOGIN_SUCCESS",
      details: "Inicio de sesión SSO vía Google Workspace",
      ip: "190.140.88.24 (Panamá)",
      date: "Hoy 08:30 AM",
      status: "Éxito",
    },
  ];

  const handleActivateTotp = () => {
    if (verificationCode.length === 6) {
      setTotpEnabled(true);
      setShowTotpSetup(false);
      setSetupSuccess(true);
    }
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
          <Badge variant="default" className="text-xs">
            Ciberseguridad Zero-Trust B2B
          </Badge>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white font-[family-name:var(--font-heading)]">
            Seguridad de la Empresa y 2FA
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gestiona la autenticación de dos factores voluntaria y audita el acceso inmutable a tus datos fiscales.
          </p>
        </div>

        {/* 2FA Card */}
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A]/90 p-8 backdrop-blur-xl shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-[family-name:var(--font-heading)]">
                  Autenticación de Dos Factores (TOTP / Passkeys)
                </h3>
                <p className="text-xs text-slate-400">
                  Protege tu cuenta con Google Authenticator, Microsoft Authenticator o llave física WebAuthn.
                </p>
              </div>
            </div>

            <Badge variant={totpEnabled ? "default" : "secondary"}>
              {totpEnabled ? "Activo y Protegido" : "Opcional (Desactivado)"}
            </Badge>
          </div>

          {setupSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                ¡2FA activado con éxito! A partir de tu próximo inicio de sesión se solicitará tu código TOTP de 6 dígitos.
              </span>
            </div>
          )}

          {!totpEnabled && !showTotpSetup && (
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                El registro inicial no impone 2FA para acelerar tu incorporación. Puedes habilitarlo en cualquier momento.
              </span>
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowTotpSetup(true)}
              >
                Configurar 2FA Ahora
              </Button>
            </div>
          )}

          {showTotpSetup && (
            <div className="pt-6 border-t border-slate-800/80 space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* QR Code Mock */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center">
                  <div className="w-36 h-36 bg-white rounded-xl p-2 flex items-center justify-center mb-3">
                    <QrCode className="w-32 h-32 text-slate-950" />
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-semibold mb-1">
                    CLAVE: LP26-7890-ABCD-EF12
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Escanea este código con tu aplicación de autenticación
                  </span>
                </div>

                {/* Verification Input */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1.5">
                      Ingresa el código de 6 dígitos generado por tu app:
                    </label>
                    <Input
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="font-mono text-center text-lg tracking-widest text-emerald-400"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleActivateTotp}
                      disabled={verificationCode.length !== 6}
                      className="w-full"
                    >
                      Confirmar y Activar 2FA
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTotpSetup(false)}
                      className="w-full"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Audit Logs */}
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A]/90 p-8 backdrop-blur-xl shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <History className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white font-[family-name:var(--font-heading)]">
              Registro Inmutable de Auditoría (Security Logs)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">EVENTO</th>
                  <th className="pb-3 font-semibold">DETALLES / CIFRADO</th>
                  <th className="pb-3 font-semibold">DIRECCIÓN IP</th>
                  <th className="pb-3 font-semibold">FECHA</th>
                  <th className="pb-3 font-semibold text-right">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mockLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40">
                    <td className="py-3 text-emerald-400 font-bold">{log.event}</td>
                    <td className="py-3 text-slate-300">{log.details}</td>
                    <td className="py-3 text-slate-400">{log.ip}</td>
                    <td className="py-3 text-slate-500">{log.date}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
