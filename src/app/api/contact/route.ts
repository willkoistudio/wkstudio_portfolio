/** @format */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit } from "@/lib/rate-limit";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { isValidEmailDomain } from "@/lib/email-validation";
import { detectPhishing } from "@/lib/phishing-detection";
import { stripHtml, containsHtml, escapeHtml } from "@/lib/html-sanitizer";
import { z } from "zod";
import { getTranslations } from "next-intl/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  company: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
  recaptchaToken: z.string().min(1, "Token reCAPTCHA requis"),
  honeypot: z.string().optional(), // Champ honeypot
});

// Simple tracking (in production, use a database)
const emailStats = {
  totalSent: 0,
  totalBlocked: 0,
  lastReset: Date.now(),
};

export async function POST(request: NextRequest) {
  try {
    const t = await getTranslations();

    // Get client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limiting: 5 requests per 15 minutes per IP
    const rateLimitResult = rateLimit(ip, 5, 15 * 60 * 1000);

    if (!rateLimitResult.success) {
      emailStats.totalBlocked++;
      return NextResponse.json(
        {
          error: t("about.footer.contactForm.errors.rateLimit"),
          resetTime: rateLimitResult.resetTime,
        },
        { status: 429 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // 1. Vérifier le honeypot (si rempli, c'est un bot)
    if (validatedData.honeypot && validatedData.honeypot.trim() !== "") {
      emailStats.totalBlocked++;
      console.warn("Bot détecté via honeypot:", ip);
      return NextResponse.json(
        { error: "Requête suspecte détectée" },
        { status: 400 },
      );
    }

    // 2. Vérifier le domaine email (bloquer les domaines jetables)
    const emailValidation = isValidEmailDomain(validatedData.email);
    if (!emailValidation.valid) {
      emailStats.totalBlocked++;
      console.warn(
        "Email invalide:",
        validatedData.email,
        emailValidation.reason,
      );
      return NextResponse.json(
        { error: emailValidation.reason || "Adresse email non autorisée" },
        { status: 400 },
      );
    }

    // 3. Vérifier et bloquer le HTML dans le message
    if (containsHtml(validatedData.message)) {
      emailStats.totalBlocked++;
      console.warn("HTML détecté dans le message:", ip);
      return NextResponse.json(
        { error: "Le HTML n'est pas autorisé dans les messages" },
        { status: 400 },
      );
    }

    // 4. Nettoyer le message (supprimer tout HTML résiduel)
    const cleanMessage = stripHtml(validatedData.message);
    const cleanName = stripHtml(validatedData.name);
    const cleanSubject = stripHtml(validatedData.subject);
    const cleanCompany = validatedData.company
      ? stripHtml(validatedData.company)
      : undefined;

    // 5. Détecter le phishing dans le message
    const phishingCheck = detectPhishing(cleanMessage);
    if (phishingCheck.isPhishing) {
      emailStats.totalBlocked++;
      console.warn("Phishing détecté:", {
        ip,
        reasons: phishingCheck.reasons,
        links: phishingCheck.suspiciousLinks,
      });
      return NextResponse.json(
        {
          error: "Contenu suspect détecté. Veuillez reformuler votre message.",
        },
        { status: 400 },
      );
    }

    // 6. Vérifier aussi le sujet pour le phishing
    const subjectPhishingCheck = detectPhishing(cleanSubject);
    if (subjectPhishingCheck.isPhishing) {
      emailStats.totalBlocked++;
      console.warn("Phishing détecté dans le sujet:", ip);
      return NextResponse.json(
        { error: "Sujet suspect détecté" },
        { status: 400 },
      );
    }

    // 7. Verify reCAPTCHA - OBLIGATOIRE
    const isValidRecaptcha = await verifyRecaptcha(
      validatedData.recaptchaToken,
    );

    if (!isValidRecaptcha) {
      emailStats.totalBlocked++;
      return NextResponse.json(
        { error: t("about.recaptcha.failed") },
        { status: 400 },
      );
    }

    // Send email using Resend (avec contenu nettoyé et échappé)
    const escapedMessage = escapeHtml(cleanMessage).replace(/\n/g, "<br>");
    const escapedName = escapeHtml(cleanName);
    const escapedSubject = escapeHtml(cleanSubject);
    const escapedCompany = cleanCompany ? escapeHtml(cleanCompany) : undefined;

    const { data, error } = await resend.emails.send({
      from: "WKOISTUDIO Portfolio Contact <onboarding@resend.dev>", // Change this to your verified domain
      to: ["koi.william91@gmail.com"],
      replyTo: validatedData.email,
      subject: `[WKOISTUDIO Portfolio] ${escapedSubject} - ${escapedName}`,
      html: `
        <h2>Nouveau message depuis le portfolio</h2>
        <p><strong>Nom:</strong> ${escapedName}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        ${escapedCompany ? `<p><strong>Entreprise:</strong> ${escapedCompany}</p>` : ""}
        <p><strong>Sujet:</strong> ${escapedSubject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${escapedMessage}</p>
      `,
      text: `
Nouveau message depuis le portfolio

Nom: ${cleanName}
Email: ${validatedData.email}
${escapedCompany ? `Entreprise: ${escapedCompany}\n` : ""}Sujet: ${cleanSubject}

Message:
${cleanMessage}
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 },
      );
    }

    // Update stats
    emailStats.totalSent++;

    return NextResponse.json(
      {
        success: true,
        messageId: data?.id,
        stats: {
          totalSent: emailStats.totalSent,
          remaining: rateLimitResult.remaining,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// GET endpoint for stats (optional, protect this in production)
export async function GET() {
  return NextResponse.json({
    stats: emailStats,
  });
}
