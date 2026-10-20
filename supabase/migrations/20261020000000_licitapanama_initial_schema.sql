-- ==============================================================================
-- LICITAPANAMA AI: MIGRACIÓN MAESTRA DE BASE DE DATOS Y POLÍTICAS RLS
-- Motor: PostgreSQL 15+ con extensiones uuid-ossp y pgvector
-- ==============================================================================

-- 1. Extensiones críticas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Enumeración de planes de suscripción
DO $$ BEGIN
  CREATE TYPE subscription_tier AS ENUM ('free_0', 'pro_30', 'elite_50');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Tabla de Empresas (Organizations)
CREATE TABLE IF NOT EXISTS public.organizations (
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

-- 4. Tabla Pública de Licitaciones (PanamáCompra)
CREATE TABLE IF NOT EXISTS public.tenders (
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

-- 5. Historial de Competidores en PanamáCompra (Plan $50)
CREATE TABLE IF NOT EXISTS public.tender_competitors_history (
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

-- 6. Bóveda Cifrada de Facturas Fiscales DGI (Zero-Trust AES-256-GCM)
CREATE TABLE IF NOT EXISTS public.dgi_invoices_vault (
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

-- 7. Catálogo de Plantillas de Licitación (Ley 22)
CREATE TABLE IF NOT EXISTS public.templates_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  law22_article TEXT NOT NULL,
  min_tier subscription_tier NOT NULL DEFAULT 'pro_30',
  structure_schema JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Registro Inmutable de Auditoría de Ciberseguridad
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. HABILITAR ROW LEVEL SECURITY (RLS) EN TODAS LAS TABLAS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_competitors_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dgi_invoices_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- 10. POLÍTICAS ROW LEVEL SECURITY
-- 10.1 Licitaciones públicas accesibles sin login
DROP POLICY IF EXISTS "Public can view tenders" ON public.tenders;
CREATE POLICY "Public can view tenders" ON public.tenders
  FOR SELECT USING (true);

-- 10.2 Organizaciones: usuarios gestionan solo la suya
DROP POLICY IF EXISTS "Users manage own organization" ON public.organizations;
CREATE POLICY "Users manage own organization" ON public.organizations
  FOR ALL USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

-- 10.3 Bóveda DGI: aislamiento multi-inquilino absoluto
DROP POLICY IF EXISTS "Strict tenant isolation for DGI invoices" ON public.dgi_invoices_vault;
CREATE POLICY "Strict tenant isolation for DGI invoices" ON public.dgi_invoices_vault
  FOR ALL USING (
    org_id IN (SELECT id FROM public.organizations WHERE owner_user_id = auth.uid())
  );

-- 10.4 Plantillas Ley 22 según el plan de suscripción
DROP POLICY IF EXISTS "Tier-based template access" ON public.templates_catalog;
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

-- 10.5 Historial de competidores accesible para suscriptores elite_50
DROP POLICY IF EXISTS "Elite tier access to competitor history" ON public.tender_competitors_history;
CREATE POLICY "Elite tier access to competitor history" ON public.tender_competitors_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.owner_user_id = auth.uid()
      AND o.plan_tier = 'elite_50'
    )
  );

-- 10.6 Logs de auditoría: lectura restringida a la propia empresa
DROP POLICY IF EXISTS "Organization view own audit logs" ON public.security_audit_logs;
CREATE POLICY "Organization view own audit logs" ON public.security_audit_logs
  FOR SELECT USING (
    org_id IN (SELECT id FROM public.organizations WHERE owner_user_id = auth.uid())
  );
