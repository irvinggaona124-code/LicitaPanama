export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SubscriptionTier = "free_0" | "pro_30" | "elite_50";

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          owner_user_id: string;
          ruc: string;
          dv: string;
          razon_social: string;
          industry_summary: string;
          unspsc_codes: string[];
          company_embedding: number[] | null;
          validated_dgi_revenue: number;
          plan_tier: SubscriptionTier;
          alert_email: string;
          whatsapp_number: string | null;
          slack_webhook_url: string | null;
          teams_webhook_url: string | null;
          billing_customer_id: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_user_id: string;
          ruc: string;
          dv: string;
          razon_social: string;
          industry_summary: string;
          unspsc_codes?: string[];
          company_embedding?: number[] | null;
          validated_dgi_revenue?: number;
          plan_tier?: SubscriptionTier;
          alert_email: string;
          whatsapp_number?: string | null;
          slack_webhook_url?: string | null;
          teams_webhook_url?: string | null;
          billing_customer_id?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_user_id?: string;
          ruc?: string;
          dv?: string;
          razon_social?: string;
          industry_summary?: string;
          unspsc_codes?: string[];
          company_embedding?: number[] | null;
          validated_dgi_revenue?: number;
          plan_tier?: SubscriptionTier;
          alert_email?: string;
          whatsapp_number?: string | null;
          slack_webhook_url?: string | null;
          teams_webhook_url?: string | null;
          billing_customer_id?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tenders: {
        Row: {
          id: string;
          acto_numero: string;
          title: string;
          entity_name: string;
          province: string;
          category_unspsc: string | null;
          reference_amount: number;
          publish_date: string;
          close_date: string;
          status: string;
          source_url: string;
          pliego_markdown: string | null;
          required_templates: string[];
          tender_embedding: number[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          acto_numero: string;
          title: string;
          entity_name: string;
          province?: string;
          category_unspsc?: string | null;
          reference_amount?: number;
          publish_date: string;
          close_date: string;
          status?: string;
          source_url: string;
          pliego_markdown?: string | null;
          required_templates?: string[];
          tender_embedding?: number[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          acto_numero?: string;
          title?: string;
          entity_name?: string;
          province?: string;
          category_unspsc?: string | null;
          reference_amount?: number;
          publish_date?: string;
          close_date?: string;
          status?: string;
          source_url?: string;
          pliego_markdown?: string | null;
          required_templates?: string[];
          tender_embedding?: number[] | null;
          created_at?: string;
        };
      };
      tender_competitors_history: {
        Row: {
          id: string;
          acto_numero: string;
          entity_name: string;
          category_unspsc: string;
          competitor_ruc: string;
          competitor_name: string;
          reference_amount: number;
          offered_amount: number;
          won_tender: boolean;
          award_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          acto_numero: string;
          entity_name: string;
          category_unspsc: string;
          competitor_ruc: string;
          competitor_name: string;
          reference_amount: number;
          offered_amount: number;
          won_tender?: boolean;
          award_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          acto_numero?: string;
          entity_name?: string;
          category_unspsc?: string;
          competitor_ruc?: string;
          competitor_name?: string;
          reference_amount?: number;
          offered_amount?: number;
          won_tender?: boolean;
          award_date?: string | null;
          created_at?: string;
        };
      };
      dgi_invoices_vault: {
        Row: {
          id: string;
          org_id: string;
          cufe_code: string;
          issuer_ruc: string;
          total_amount: number;
          issue_date: string;
          encrypted_xml_payload: string;
          iv_hex: string;
          auth_tag_hex: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          cufe_code: string;
          issuer_ruc: string;
          total_amount: number;
          issue_date: string;
          encrypted_xml_payload: string;
          iv_hex: string;
          auth_tag_hex: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          cufe_code?: string;
          issuer_ruc?: string;
          total_amount?: number;
          issue_date?: string;
          encrypted_xml_payload?: string;
          iv_hex?: string;
          auth_tag_hex?: string;
          created_at?: string;
        };
      };
      templates_catalog: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          law22_article: string;
          min_tier: SubscriptionTier;
          structure_schema: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          law22_article: string;
          min_tier?: SubscriptionTier;
          structure_schema: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          law22_article?: string;
          min_tier?: SubscriptionTier;
          structure_schema?: Json;
          created_at?: string;
        };
      };
      security_audit_logs: {
        Row: {
          id: string;
          org_id: string | null;
          user_id: string | null;
          event_type: string;
          metadata: Json;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id?: string | null;
          user_id?: string | null;
          event_type: string;
          metadata?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string | null;
          user_id?: string | null;
          event_type?: string;
          metadata?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      subscription_tier: SubscriptionTier;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
