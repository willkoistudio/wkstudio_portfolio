/** @format */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit } from "@/lib/rate-limit";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
  recaptchaToken: z.string().optional(),
});

// Simple tracking (in production, use a database)
const emailStats = {
  totalSent: 0,
  totalBlocked: 0,
  lastReset: Date.now(),
};

export async function POST(request: NextRequest) {
  try {
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
          error: "Trop de requêtes. Veuillez réessayer plus tard.",
          resetTime: rateLimitResult.resetTime,
        },
        { status: 429 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Verify reCAPTCHA if token is provided
    if (validatedData.recaptchaToken) {
      const isValidRecaptcha = await verifyRecaptcha(
        validatedData.recaptchaToken,
      );

      if (!isValidRecaptcha) {
        emailStats.totalBlocked++;
        return NextResponse.json(
          { error: "Vérification reCAPTCHA échouée" },
          { status: 400 },
        );
      }
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Change this to your verified domain
      to: ["koi.william91@gmail.com"],
      replyTo: validatedData.email,
      subject: `[Portfolio] ${validatedData.subject} - ${validatedData.name}`,
      html: `
        <h2>Nouveau message depuis le portfolio</h2>
        <p><strong>Nom:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        ${validatedData.company ? `<p><strong>Entreprise:</strong> ${validatedData.company}</p>` : ""}
        <p><strong>Sujet:</strong> ${validatedData.subject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
      `,
      text: `
Nouveau message depuis le portfolio

Nom: ${validatedData.name}
Email: ${validatedData.email}
${validatedData.company ? `Entreprise: ${validatedData.company}\n` : ""}Sujet: ${validatedData.subject}

Message:
${validatedData.message}
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
