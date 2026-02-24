require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
const logger = require("../config/logger");


/**
 * MailerService — Multi-provider email service
 * Supports: SendGrid (production), Nodemailer (staging/dev)
 */

// Determine provider based on environment
const useProvider = process.env.MAIL_PROVIDER || "nodemailer"; // nodemailer | sendgrid

let mailer;

if (useProvider === "sendgrid" && process.env.SENDGRID_API_KEY) {
  // ─── SendGrid Configuration (Production) ───
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  logger.info("📧 Mail provider: SendGrid");
  
  mailer = {
    name: "SendGrid",
    send: async (to, subject, text, html) => {
      try {
        const msg = {
          to,
          from: process.env.EMAIL_FROM || process.env.MAIL_FROM || "noreply@senmedicaltech.com",
          subject,
          text,
          html,
          trackingSettings: {
            clickTracking: { enable: true },
            openTracking: { enable: true },
          },
        };
        await sgMail.send(msg);
        logger.debug(`📧 Email sent via SendGrid to ${to}`);
      } catch (err) {
        logger.error(`❌ SendGrid error: ${err.message}`);
        throw err;
      }
    },
  };
} else {
  // ─── Nodemailer Configuration (Staging/Dev) ───
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || process.env.MAIL_HOST,
  port: parseInt(process.env.SMTP_PORT || process.env.MAIL_PORT || "587"),
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER || process.env.MAIL_USER,
    pass: process.env.SMTP_PASS || process.env.MAIL_PASS,
  },
});
  logger.info(`📧 Mail provider: Nodemailer (${process.env.SMTP_HOST || process.env.MAIL_HOST || "mailtrap"})`);

  mailer = {
    name: "Nodemailer",
    send: async (to, subject, text, html) => {
      try {
        const msg = {
          from: process.env.EMAIL_FROM || process.env.MAIL_FROM || "noreply@senmedicaltech.local",
          to,
          subject,
          text,
          html,
        };
        await transporter.sendMail(msg);
        logger.debug(`📧 Email sent via Nodemailer to ${to}`);
      } catch (err) {
        logger.error(`❌ Nodemailer error: ${err.message}`);
        throw err;
      }
    },
  };
}

/**
 * Send generic email
 */
const sendMail = async (to, subject, text, html) => {
  if (!to) throw new Error("No recipient provided");
  if (!mailer) throw new Error("Email service not configured");
  
  try {
    await mailer.send(to, subject, text, html);
    return { success: true, provider: mailer.name, to };
  } catch (err) {
    logger.error(`Failed to send email to ${to}: ${err.message}`);
    throw err;
  }
};

/**
 * Send order confirmation email
 */
const sendOrderConfirmation = async (order, overrideEmail = null) => {
  try {
    const recipient = overrideEmail || (order.user && order.user.email) || order.guestEmail;
    if (!recipient) {
      logger.warn(`⚠️ No recipient for order ${order._id}`);
      return;
    }

    const subject = `Confirmation de commande - ${order._id}`;
    
    // Build order items list
    const itemsList = order.items
      .map((it) => `- ${it.quantity} x ${it.product} @ €${it.price}`)
      .join("\n");

    const text = `
Merci pour votre commande!

Commande: ${order._id}
Date: ${new Date(order.createdAt).toLocaleDateString("fr-FR")}

Articles:
${itemsList}

Adresse de livraison:
${order.shippingAddress.address}
${order.shippingAddress.postalCode} ${order.shippingAddress.city}
${order.shippingAddress.country}

Total: €${order.totalPrice}
Statut: ${order.orderStatus}

Merci d'avoir commandé chez SenMedicalTech!
`.trim();

    const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>Confirmation de commande</h2>
  
  <p>Merci pour votre commande!</p>
  
  <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p><strong>Commande:</strong> <code>${order._id}</code></p>
    <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
  </div>
  
  <h3>Articles commandés:</h3>
  <ul>
    ${order.items.map(it => `<li>${it.quantity} x ${it.product} — €${it.price}</li>`).join("")}
  </ul>
  
  <h3>Adresse de livraison:</h3>
  <p>
    ${order.shippingAddress.address}<br/>
    ${order.shippingAddress.postalCode} ${order.shippingAddress.city}<br/>
    ${order.shippingAddress.country}
  </p>
  
  <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="font-size: 18px; margin: 0;"><strong>Total: €${order.totalPrice}</strong></p>
    <p style="font-size: 12px; color: #666; margin: 5px 0;">Statut: <strong>${order.orderStatus}</strong></p>
  </div>
  
  <p style="margin-top: 20px; font-size: 12px;">Questions? Contactez-nous:</p>
  <p style="font-size: 12px; color: #666;">
    SenMedicalTech — Matériel Orthopédique<br/>
    <a href="https://senmedicaltech.com" style="color: #007bff; text-decoration: none;">senmedicaltech.com</a><br/>
    support@senmedicaltech.com
  </p>
</div>
`.trim();

    await sendMail(recipient, subject, text, html);
    logger.info(`✅ Order confirmation email sent to ${recipient} for order ${order._id}`);
  } catch (err) {
    logger.error(`❌ Failed to send order confirmation for ${order._id}: ${err.message}`);
    throw err;
  }
};

module.exports = {
  sendMail,
  sendOrderConfirmation,
  mailer,
};
