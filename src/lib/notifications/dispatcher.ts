import { Resend } from "resend";
import { formatCurrency } from "@/lib/utils";

// Notification Dispatcher Interface
export interface TenderAlertPayload {
  actoNumero: string;
  title: string;
  entityName: string;
  province: string;
  referenceAmount: number;
  closeDate: string;
  sourceUrl: string;
  categoryUnspsc: string;
}

export interface OrganizationRecipient {
  id: string;
  razonSocial: string;
  planTier: "free_0" | "pro_30" | "elite_50";
  alertEmail: string;
  whatsappNumber?: string | null;
  slackWebhookUrl?: string | null;
  teamsWebhookUrl?: string | null;
}

/**
 * Despacha alertas omnicanal adaptadas estrictamente al nivel de suscripción.
 */
export async function dispatchTenderAlert(
  tender: TenderAlertPayload,
  recipient: OrganizationRecipient
) {
  const results = {
    email: false,
    whatsapp: false,
    slack: false,
    teams: false,
  };

  const formattedAmount = formatCurrency(tender.referenceAmount);
  const formattedClose = new Date(tender.closeDate).toLocaleDateString("es-PA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // 1. Despacho por Correo (Resend) - Disponible para Pro ($30) y Élite ($50)
  if (recipient.planTier === "pro_30" || recipient.planTier === "elite_50") {
    results.email = await sendEmailAlert(tender, recipient, formattedAmount, formattedClose);
  }

  // 2. Canales Exclusivos para Plan Élite ($50/mes)
  if (recipient.planTier === "elite_50") {
    // WhatsApp Cloud API
    if (recipient.whatsappNumber) {
      results.whatsapp = await sendWhatsAppAlert(
        tender,
        recipient.whatsappNumber,
        formattedAmount,
        formattedClose
      );
    }

    // Slack Incoming Webhook
    if (recipient.slackWebhookUrl) {
      results.slack = await sendSlackWebhookAlert(
        tender,
        recipient.slackWebhookUrl,
        formattedAmount,
        formattedClose
      );
    }

    // Microsoft Teams Incoming Webhook
    if (recipient.teamsWebhookUrl) {
      results.teams = await sendTeamsWebhookAlert(
        tender,
        recipient.teamsWebhookUrl,
        formattedAmount,
        formattedClose
      );
    }
  }

  return results;
}

/**
 * Envío de alerta por correo electrónico con Resend
 */
async function sendEmailAlert(
  tender: TenderAlertPayload,
  recipient: OrganizationRecipient,
  formattedAmount: string,
  formattedClose: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.includes("placeholder")) {
    console.log(`[SIMULATION EMAIL] Alerta enviada a ${recipient.alertEmail} para acto ${tender.actoNumero}`);
    return true;
  }

  try {
    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "alertas@licitapanama.ai";

    await resend.emails.send({
      from: `LicitaPanamá AI <${fromEmail}>`,
      to: [recipient.alertEmail],
      subject: `[Nueva Licitación] ${tender.entityName} licita ${formattedAmount}`,
      html: `
        <div style="font-family: sans-serif; background: #070B14; color: #F8FAFC; padding: 24px; border-radius: 12px;">
          <h2 style="color: #10B981; margin-top: 0;">Nueva Oportunidad Detectada en PanamáCompra</h2>
          <p>Estimado equipo de <strong>${recipient.razonSocial}</strong>,</p>
          <p>Hemos detectado un nuevo acto público coincidente con sus rubros registrados:</p>
          <div style="background: #0F172A; padding: 16px; border-radius: 8px; border: 1px solid #1E293B;">
            <p><strong>Entidad:</strong> ${tender.entityName}</p>
            <p><strong>Acto N°:</strong> ${tender.actoNumero}</p>
            <p><strong>Título:</strong> ${tender.title}</p>
            <p><strong>Monto Referencial:</strong> <span style="color: #10B981; font-weight: bold;">${formattedAmount}</span></p>
            <p><strong>Fecha de Cierre:</strong> ${formattedClose}</p>
            <p><strong>Provincia:</strong> ${tender.province}</p>
          </div>
          <div style="margin-top: 20px;">
            <a href="${tender.sourceUrl}" style="background: #10B981; color: #070B14; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">Ver Pliego en PanamáCompra</a>
          </div>
          <p style="font-size: 11px; color: #64748B; margin-top: 24px;">LicitaPanama AI - Notificación automatizada Ley 22.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Error al enviar email con Resend:", error);
    return false;
  }
}

/**
 * Envío de alerta vía Meta WhatsApp Cloud API Oficial
 */
async function sendWhatsAppAlert(
  tender: TenderAlertPayload,
  phoneNumber: string,
  formattedAmount: string,
  formattedClose: string
): Promise<boolean> {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId || token.includes("placeholder")) {
    console.log(`[SIMULATION WHATSAPP] Mensaje enviado al ${phoneNumber} para acto ${tender.actoNumero}`);
    return true;
  }

  try {
    const formattedPhone = phoneNumber.replace(/[^0-9]/g, "");
    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "text",
        text: {
          body: `🚨 *NUEVA LICITACIÓN - PANAMÁCOMPRA*\n\n🏛️ *Entidad:* ${tender.entityName}\n📋 *Acto:* ${tender.actoNumero}\n💼 *Objeto:* ${tender.title}\n💰 *Monto:* ${formattedAmount}\n⏳ *Cierre:* ${formattedClose}\n📍 *Provincia:* ${tender.province}\n\n🔗 ${tender.sourceUrl}`,
        },
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("Error en WhatsApp Cloud API:", err);
    return false;
  }
}

/**
 * Envío de alerta vía Slack Incoming Webhook
 */
async function sendSlackWebhookAlert(
  tender: TenderAlertPayload,
  webhookUrl: string,
  formattedAmount: string,
  formattedClose: string
): Promise<boolean> {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `*Nueva Licitación Publicada:* ${tender.title}`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "🚨 Nueva Licitación en PanamáCompra",
            },
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*Entidad:*\n${tender.entityName}` },
              { type: "mrkdwn", text: `*Monto:*\n${formattedAmount}` },
              { type: "mrkdwn", text: `*Acto:*\n${tender.actoNumero}` },
              { type: "mrkdwn", text: `*Cierre:*\n${formattedClose}` },
            ],
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "Ver en PanamáCompra" },
                url: tender.sourceUrl,
                style: "primary",
              },
            ],
          },
        ],
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("Error al enviar alerta a Slack:", err);
    return false;
  }
}

/**
 * Envío de alerta vía Microsoft Teams Incoming Webhook
 */
async function sendTeamsWebhookAlert(
  tender: TenderAlertPayload,
  webhookUrl: string,
  formattedAmount: string,
  formattedClose: string
): Promise<boolean> {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        themeColor: "10B981",
        summary: `Nueva Licitación: ${tender.entityName}`,
        sections: [
          {
            activityTitle: `Nueva Licitación en ${tender.province}`,
            activitySubtitle: tender.entityName,
            facts: [
              { name: "Acto N°:", value: tender.actoNumero },
              { name: "Monto:", value: formattedAmount },
              { name: "Cierre:", value: formattedClose },
              { name: "Objeto:", value: tender.title },
            ],
          },
        ],
        potentialAction: [
          {
            "@type": "OpenUri",
            name: "Abrir Pliego Oficial",
            targets: [{ os: "default", uri: tender.sourceUrl }],
          },
        ],
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("Error al enviar alerta a Microsoft Teams:", err);
    return false;
  }
}
