"use client";

import React, { useEffect } from "react";
import { MessageSquare, Sparkles } from "lucide-react";

interface DevTeamChatWidgetProps {
  planTier: "free_0" | "pro_30" | "elite_50";
  organizationName?: string;
  userEmail?: string;
}

export function DevTeamChatWidget({
  planTier,
  organizationName = "Empresa Contratista",
  userEmail = "contacto@empresa.com",
}: DevTeamChatWidgetProps) {
  // Only load Crisp Web SDK if subscriber is on elite_50 tier
  useEffect(() => {
    if (planTier !== "elite_50") return;

    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    if (!websiteId || websiteId.includes("placeholder")) {
      console.log("[CRISP CHAT] Simulación: Canal directo con el equipo de desarrollo habilitado para Plan Élite ($50).");
      return;
    }

    // @ts-ignore
    window.$crisp = [];
    // @ts-ignore
    window.CRISP_WEBSITE_ID = websiteId;

    const d = document;
    const s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = true;
    d.getElementsByTagName("head")[0].appendChild(s);

    // Set user profile in Crisp
    // @ts-ignore
    window.$crisp.push(["set", "user:email", [userEmail]]);
    // @ts-ignore
    window.$crisp.push(["set", "user:nickname", [organizationName]]);
    // @ts-ignore
    window.$crisp.push(["set", "session:data", [[["plan", "elite_50"]]]]);

    return () => {
      // Cleanup script tag on unmount
      s.remove();
    };
  }, [planTier, organizationName, userEmail]);

  if (planTier !== "elite_50") {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold px-4 py-2.5 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer hover:scale-105 transition-transform">
      <MessageSquare className="w-4 h-4" />
      <span className="text-xs">Chat Directo con Desarrolladores</span>
      <Sparkles className="w-3.5 h-3.5 text-slate-900" />
    </div>
  );
}
