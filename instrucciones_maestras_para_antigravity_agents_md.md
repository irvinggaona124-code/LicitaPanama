# AGENTS.md — Archivo Maestro de Orquestación para Google Antigravity

> **IDENTIDAD DEL AGENTE:** Eres **Google Antigravity**, actuando como el **Ingeniero Principal Full-Stack, Arquitecto Cloud y Especialista en Ciberseguridad**. Tu misión es construir, probar, asegurar y desplegar de principio a fin la plataforma **LicitaPanama AI** antes del sábado, manteniendo un costo de infraestructura de $\$0.00$ y utilizando exclusivamente **Gemini 3.8 Flash (`gemini-3.8-flash`)** como motor de inteligencia artificial dentro de la aplicación web.

---

## 1. REGLAS INQUEBRANTABLES DE EJECUCIÓN (NON-NEGOTIABLE RULES)

1.  **Cero Código Incompleto o Placeholders:** Está terminantemente prohibido dejar comentarios tipo `// TODO: implement later` o datos estáticos falsos sin conectar a Supabase o a la API de PanamáCompra. Cada archivo generado debe ser funcional y listo para producción.
2.  **Optimización de Tokens Activa:** Mantén activo el skill `caveman` en modo `/caveman lite` durante la generación de código extenso para maximizar la velocidad y eficiencia de respuesta sin omitir lógica de código.
3.  **Modelo de IA Único en Producción:** Toda llamada a IA dentro del código de la aplicación (`src/lib/ai/`) debe utilizar el SDK oficial `@google/genai` e invocar estrictamente el modelo `"gemini-3.8-flash"`.
4.  **Verificación Documental Previa:** Antes de implementar integraciones con Next.js 15 App Router, Supabase SSR o `@google/genai`, consulta el servidor **Context7 MCP** para usar siempre las APIs actuales.
5.  **Ciberseguridad por Defecto:** Toda tabla creada en Supabase debe tener `ENABLE ROW LEVEL SECURITY` activo desde el primer segundo, y todo archivo fiscal de la DGI debe cifrarse con `AES-256-GCM` antes de guardarse.

---

## 2. ARQUITECTURA DE CARPETAS DEL PROYECTO (NEXT.JS 15 APP ROUTER)

Debes estructurar el repositorio siguiendo exactamente este árbol de directorios:

```text
licitapanama-ai/
├── .agents/
│   └── mcp_config.json              # Configuración de Stitch, Supabase, 21st.dev, Firecrawl, Playwright, Context7
├── .github/
│   └── workflows/
│       ├── panamacompra_sync.yml    # Cron cada 30 min: Scraper OCDS + Playwright + Alertas $30/$50
│       └── weekly_free_digest.yml   # Cron lunes 8:00 AM: Alerta semanal Plan $0
├── .stitch/
│   └── DESIGN.md                    # Sistema de Diseño extraído con Google Stitch MCP
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx             # Hero 3D WebGL Panamá + Buscador Público sin login + Pricing
│   │   │   └── licitacion/[id]/     # Vista pública del pliego (Con Paywall para IA y Plantillas)
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx       # SSO 1-Clic: Google, Microsoft, GitHub (Sin 2FA inicial)
│   │   │   ├── callback/route.ts    # OAuth PKCE Callback handler
│   │   │   └── onboarding/page.tsx  # Formulario corto (RUC, Rubro UNSPSC, DGI XML Dropzone)
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx   # Radar personalizado + Score de Probabilidad + Alertas
│   │   │   ├── licitaciones/[id]/   # Sala de Guerra IA: Gemini 3.8 Flash + Matriz Competidores
│   │   │   ├── plantillas/page.tsx  # Estudio Generador de Plantillas Ley 22 (.docx / .pdf)
│   │   │   ├── facturacion/page.tsx # Gestión de Planes ($0, $30, $50)
│   │   │   └── seguridad/page.tsx   # Activación opcional de 2FA (TOTP/Passkeys) + Audit Logs
│   │   └── api/
│   │       ├── ai/
│   │       │   ├── chat/route.ts            # Chat especializado con Gemini 3.8 Flash
│   │       │   ├── win-probability/route.ts # Análisis Empresa + DGI + Competidores (Planes $30 y $50)
│   │       │   └── generate-template/route.ts # Redactor de plantillas Ley 22 (Plan $50)
│   │       ├── dgi/parse-xml/route.ts       # Lector y Cifrador AES-256-GCM de Facturas DGI (SFEP)
│   │       ├── webhooks/billing/route.ts    # Webhook LemonSqueezy / Paddle / Yappy
│   │       └── cron/sync-tenders/route.ts   # Endpoint protegido de ingesta y alertas
│   ├── components/
│   │   ├── three/PanamaTenderRadar3D.tsx    # Escena WebGL interactiva creada con threejs-skills
│   │   ├── tenders/                         # Tarjetas, Filtros y Velocímetro de Probabilidad
│   │   ├── templates/DocxCompiler.tsx       # Compilador cliente .docx para Ley 22
│   │   └── support/DevTeamChatWidget.tsx    # Widget Crisp.chat exclusivo para Plan $50
│   └── lib/
│       ├── ai/gemini-flash.ts               # Cliente centralizado Gemini 3.8 Flash + Schemas JSON
│       ├── security/crypto-vault.ts         # Cifrado AES-256-GCM + Sanitizador Prompt Injection
│       ├── notifications/dispatcher.ts      # Resend (Email) + Meta WhatsApp Cloud API + Slack/Teams
│       └── supabase/                        # Clientes SSR, Server Actions y Middleware de sesión
```

---

## 3. ESQUEMA SQL COMPLETO Y POLÍTICAS RLS (EJECUTAR VÍA SUPABASE MCP)

En el **Paso 3**, debes ejecutar exactamente esta migración SQL en Supabase usando el **Supabase MCP**:

```sql
-- Activar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Enumeración de Planes ($0, $30, $50)
CREATE TYPE subscription_tier AS ENUM ('free_0', 'pro_30', 'elite_50');

-- 1. Tabla de Empresas (Organizations)
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ruc TEXT NOT NULL,
  dv TEXT NOT NULL,
  razon_social TEXT NOT NULL,
  industry_summary TEXT NOT NULL,
  unspsc_codes TEXT[] DEFAULT '{}',
  company_embedding vector(768),
  validated_dgi_revenue NUMERIC(15, 2) DEFAULT 0,
  plan_tier subscription_tier NOT NULL DEFAULT 'free_0',
  alert_email TEXT NOT NULL,
  whatsapp_number TEXT,
  slack_webhook_url TEXT,
  teams_webhook_url TEXT,
  billing_customer_id TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabla Pública de Licitaciones (PanamáCompra)
CREATE TABLE public.tenders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  acto_numero TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  province TEXT NOT NULL DEFAULT 'Panamá',
  category_unspsc TEXT,
  reference_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  publish_date TIMESTAMPTZ NOT NULL,
  close_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'PUBLICADO',
  source_url TEXT NOT NULL,
  pliego_markdown TEXT,
  required_templates TEXT[] DEFAULT '{}',
  tender_embedding vector(768),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Historial de Competidores en PanamáCompra (Para el Plan de $50)
CREATE TABLE public.tender_competitors_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  acto_numero TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  category_unspsc TEXT NOT NULL,
  competitor_ruc TEXT NOT NULL,
  competitor_name TEXT NOT NULL,
  reference_amount NUMERIC(15, 2) NOT NULL,
  offered_amount NUMERIC(15, 2) NOT NULL,
  won_tender BOOLEAN NOT NULL DEFAULT FALSE,
  award_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Bóveda Cifrada de Facturas Fiscales DGI (Zero-Trust)
CREATE TABLE public.dgi_invoices_vault (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  cufe_code TEXT NOT NULL,
  issuer_ruc TEXT NOT NULL,
  total_amount NUMERIC(15, 2) NOT NULL,
  issue_date DATE NOT NULL,
  encrypted_xml_payload TEXT NOT NULL,
  iv_hex TEXT NOT NULL,
  auth_tag_hex TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Catálogo de Plantillas de Licitación (Ley 22)
CREATE TABLE public.templates_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  law22_article TEXT NOT NULL,
  min_tier subscription_tier NOT NULL DEFAULT 'pro_30',
  structure_schema JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Registro Inmutable de Auditoría de Ciberseguridad
CREATE TABLE public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HABILITAR ROW LEVEL SECURITY (RLS) EN TODAS LAS TABLAS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_competitors_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dgi_invoices_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS
-- Cualquier visitante sin iniciar sesión puede ver las licitaciones públicas
CREATE POLICY "Public can view tenders" ON public.tenders
  FOR SELECT USING (true);

-- Solo usuarios autenticados pueden ver su propia organización
CREATE POLICY "Users manage own organization" ON public.organizations
  FOR ALL USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

-- Aislamiento estricto para la bóveda de facturas DGI
CREATE POLICY "Strict tenant isolation for DGI invoices" ON public.dgi_invoices_vault
  FOR ALL USING (
    org_id IN (SELECT id FROM public.organizations WHERE owner_user_id = auth.uid())
  );

-- Control de acceso a plantillas según el plan ($30 ve pro_30; $50 ve todo)
CREATE POLICY "Tier-based template access" ON public.templates_catalog
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.owner_user_id = auth.uid()
      AND (
        (o.plan_tier = 'pro_30' AND min_tier = 'pro_30')
        OR (o.plan_tier = 'elite_50')
      )
    )
  );
```

---

## 4. CONFIGURACIÓN EXACTA DE GEMINI 3.8 FLASH (`src/lib/ai/gemini-flash.ts`)

Implementa el cliente de inteligencia artificial siguiendo esta especificación:

1.  **Modelo:** `const MODEL_ID = "gemini-3.8-flash";`
2.  **Modo 1 — Analizador de Probabilidad (Plan $\$30$):**
    *   Recibe: Perfil de la empresa, sumatoria de facturas fiscales DGI validadas (`validated_dgi_revenue`), y el Markdown del pliego de cargos.
    *   Devuelve (`responseMimeType: "application/json"`):
        *   `win_probability_pct` (0 a 100)
        *   `financial_capacity_match` (Booleano + explicación respecto al monto de referencia)
        *   `technical_strengths` (Lista de puntos fuertes de la empresa)
        *   `missing_requirements` (Requisitos del pliego que la empresa debe subsanar)
3.  **Modo 2 — Inteligencia Competitiva de PanamáCompra + Mejoras Accionables (Exclusivo Plan $\$50$):**
    *   Recibe todo lo del Modo 1 **MÁS** el historial de `tender_competitors_history` de la misma entidad y código UNSPSC.
    *   Devuelve adicionalmente:
        *   `top_competitors`: Lista de competidores reales que participan en esa institución, su porcentaje promedio de descuento respecto al precio oficial y su tasa de victoria.
        *   `recommended_bid_range_usd`: Rango óptimo de oferta económica sugerido para ganar sin caer en oferta riesgosa o temeraria según la Ley 22.
        *   `actionable_improvements`: Plan exacto de lo que la empresa debe mejorar (certificaciones, fianzas, alianzas en consorcio o ajuste de margen) para superar a los competidores detectados.
4.  **Modo 3 — Generador de Plantillas Específicas Ley 22 (Exclusivo Plan $\$50$):**
    *   Genera el contenido formal completo adaptado al pliego y a la empresa para compilarlo inmediatamente a `.docx` y `.pdf`.

---

## 5. PROTOCOLO DE EJECUCIÓN PASO A PASO (ORDEN ESTRICTO)

Debes ejecutar las siguientes fases en orden cronológico. No avances a la siguiente fase hasta que la fase actual compile sin errores de TypeScript (`npm run build`) y pase las verificaciones correspondientes:

1.  **FASE 1:** Inicializar el proyecto Next.js 15, instalar dependencias (`@google/genai`, `@supabase/ssr`, `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `docx`, `lucide-react`, `resend`, `zod`) y configurar variables de entorno `.env.example`.
2.  **FASE 2:** Invocar **Google Stitch MCP** (`enhance-prompt` $\rightarrow$ `stitch-design` $\rightarrow$ `extract-design-md`) para generar `.stitch/DESIGN.md` y construir el sistema de diseño base con `shadcn-ui` y **21st.dev Magic MCP**.
3.  **FASE 3:** Ejecutar el script SQL de la Sección 3 en Supabase mediante **Supabase MCP** y auditar las políticas RLS con el skill `security-auditor`.
4.  **FASE 4:** Construir la Landing Page Pública (`src/app/(public)/page.tsx`) incluyendo el **Radar Holográfico 3D de Panamá en WebGL** (`threejs-skills`) y el buscador de licitaciones en vivo que permite ver actos públicos sin iniciar sesión pero bloquea plantillas, alertas e IA detrás del modal de registro SSO.
5.  **FASE 5:** Implementar el inicio de sesión SSO con **Google, Microsoft y GitHub** sin 2FA obligatorio al registrarse, la ruta `/onboarding` con el formulario corto de 4 pasos, el parser cifrado de facturas XML/CUFE de la DGI y la página `/seguridad` para activar 2FA opcionalmente después.
6.  **FASE 6:** Construir el scraper de **PanamáCompra** usando la API OCDS + **Playwright MCP** + **Firecrawl MCP**, configurar el workflow de GitHub Actions y programar el despachador de alertas por plan ($\$0$ correo semanal; $\$30$ correo instantáneo; $\$50$ WhatsApp + Correo + Slack + Microsoft Teams).
7.  **FASE 7:** Construir los endpoints y vistas de **Gemini 3.8 Flash** (Chat con el pliego, Calculadora de Probabilidad con datos DGI + Competidores de PanamáCompra, y Estudio Generador de Plantillas Ley 22 descargables en `.docx` con el skill `docx-generator`).
8.  **FASE 8:** Integrar la pasarela de pagos (**LemonSqueezy / Paddle + Yappy**), el widget de chat en vivo con el equipo de desarrollo (**Crisp.chat** exclusivo para el plan de $\$50$), realizar la inspección visual en navegador real con `stitch-loop` + **Playwright MCP**, y dejar lista la configuración de despliegue en **Vercel + Cloudflare WAF**.

---

## 6. PROMPT DE ARRANQUE INMEDIATO (COPIAR Y PEGAR EN EL CHAT DE ANTIGRAVITY)

Para iniciar la construcción ahora mismo, pega este comando en el chat de Google Antigravity:

> `/caveman lite`
> Lee los archivos `plan_licitaciones_panama.md` y `AGENTS.md` en la raíz del proyecto. Actúa como el Ingeniero Principal autónomo y ejecuta en orden estricto desde la **FASE 1 hasta la FASE 8** usando todos los Skills instalados (`stitch-design`, `stitch-loop`, `threejs-skills`, `21st-dev`, `docx-generator`, `markitdown`, `security-auditor`, `agent-skills`) y tus servidores MCP activos (`Stitch`, `Supabase`, `Context7`, `Firecrawl`, `Playwright`). Empieza ahora mismo ejecutando la **FASE 1 y FASE 2** sin detenerte.