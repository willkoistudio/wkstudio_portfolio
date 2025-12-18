/** @format */

// Liste de domaines email jetables/temporaires courants
// Source: https://github.com/disposable-email-domains/disposable-email-domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "10minutemail.com",
  "20minutemail.com",
  "33mail.com",
  "guerrillamail.com",
  "mailinator.com",
  "tempmail.com",
  "throwaway.email",
  "yopmail.com",
  "getnada.com",
  "mohmal.com",
  "temp-mail.org",
  "fakeinbox.com",
  "trashmail.com",
  "mintemail.com",
  "sharklasers.com",
  "grr.la",
  "guerrillamailblock.com",
  "pokemail.net",
  "spam4.me",
  "bccto.me",
  "chacuo.net",
  "dispostable.com",
  "meltmail.com",
  "emailondeck.com",
  "tmpmail.org",
  "maildrop.cc",
  "getairmail.com",
  "melt.li",
  "mohmal.com",
  "tempinbox.co.uk",
  "mytrashmail.com",
  "mailcatch.com",
  "throwawaymail.com",
  "mailnesia.com",
  "mintemail.com",
  "tempail.com",
  "tempr.email",
  "getnada.com",
  "maildrop.cc",
  "mohmal.com",
  "spamgourmet.com",
  "temp-mail.io",
  "mail-temp.com",
  "emailtemp.org",
  "tempmailo.com",
  "mail-temp.com",
  "emailondeck.com",
  "throwawaymail.com",
  "maildrop.cc",
  "mohmal.com",
  "spamgourmet.com",
  "temp-mail.io",
  "mail-temp.com",
  "emailtemp.org",
  "tempmailo.com",
  "mail-temp.com",
  "emailondeck.com",
]);

/**
 * Extrait le domaine d'une adresse email
 */
function extractDomain(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return "";
  return parts[1].toLowerCase().trim();
}

/**
 * Vérifie si un domaine email est valide (pas jetable)
 */
export function isValidEmailDomain(email: string): {
  valid: boolean;
  reason?: string;
} {
  const domain = extractDomain(email);

  if (!domain) {
    return { valid: false, reason: "Format d'email invalide" };
  }

  // Vérifier si c'est un domaine jetable
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: "Les adresses email temporaires ne sont pas autorisées",
    };
  }

  // Vérifier les patterns suspects
  const suspiciousPatterns = [
    /^temp/i,
    /^fake/i,
    /^spam/i,
    /^test/i,
    /^throwaway/i,
    /^trash/i,
    /^disposable/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(domain)) {
      return {
        valid: false,
        reason: "Domaine email suspect détecté",
      };
    }
  }

  // Vérifier la structure du domaine
  if (
    !/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,}$/i.test(
      domain,
    )
  ) {
    return { valid: false, reason: "Format de domaine invalide" };
  }

  return { valid: true };
}
