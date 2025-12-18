/** @format */

/**
 * Mots-clés et patterns suspects de phishing (FR + EN)
 */
const PHISHING_KEYWORDS = [
  // Urgence et pression (FR + EN)
  /\b(urgent|urgence|immédiat|immédiatement|dans les 24h|dans 24 heures|dans les prochaines heures)\b/gi,
  /\b(immediate|asap|right away|within 24 hours|within the next hours|hurry|hurry up)\b/gi,
  /\b(action requise|action immédiate|agissez maintenant)\b/gi,
  /\b(action required|immediate action|act now|take action|respond immediately)\b/gi,
  /\b(votre compte sera|sera suspendu|sera fermé|sera supprimé)\b/gi,
  /\b(your account will|will be suspended|will be closed|will be deleted|account suspension|account closure)\b/gi,

  // Menaces (FR + EN)
  /\b(suspendre|fermer|supprimer|bloquer|verrouiller)\b/gi,
  /\b(suspend|close|delete|block|lock|terminate|deactivate)\b/gi,
  /\b(sans délai|sans attendre|immédiatement)\b/gi,
  /\b(without delay|without waiting|immediately|right now|now or never)\b/gi,

  // Liens suspects (FR + EN)
  /\b(cliquez ici|cliquez sur ce lien|suivez ce lien)\b/gi,
  /\b(click here|click this link|follow this link|click the link|click below)\b/gi,
  /\b(téléchargez|téléchargez maintenant|ouvrez la pièce jointe)\b/gi,
  /\b(download|download now|open attachment|open the attachment|download file)\b/gi,

  // Demande d'informations sensibles (FR + EN)
  /\b(mot de passe|password|code pin|numéro de carte|numéro de compte bancaire)\b/gi,
  /\b(password|pin code|card number|bank account number|ssn|social security number|credit card)\b/gi,
  /\b(confirmez vos informations|vérifiez votre identité|mettez à jour votre compte)\b/gi,
  /\b(confirm your information|verify your identity|update your account|verify account|account verification)\b/gi,

  // Offres trop belles (FR + EN)
  /\b(gagnez|gagnant|loterie|prix|récompense|gratuit)\b/gi,
  /\b(win|winner|lottery|prize|reward|free|congratulations you won|you are a winner)\b/gi,
  /\b(millionnaire|richesse|fortune|argent facile)\b/gi,
  /\b(millionaire|wealth|fortune|easy money|make money fast|get rich quick)\b/gi,

  // Phishing classique (FR + EN)
  /\b(paypal|amazon|microsoft|apple|google|facebook)\s+(suspendu|fermé|bloqué)\b/gi,
  /\b(paypal|amazon|microsoft|apple|google|facebook)\s+(suspended|closed|blocked|locked|compromised)\b/gi,
  /\b(vérifiez votre compte|confirmez votre identité|mise à jour requise)\b/gi,
  /\b(verify your account|confirm your identity|update required|security update|account verification)\b/gi,
  /\b(unusual activity|suspicious activity|unauthorized access|security alert)\b/gi,
  /\b(verify payment|payment verification|billing issue|payment problem)\b/gi,
  /\b(limited time offer|exclusive offer|special promotion|act fast)\b/gi,
];

/**
 * Patterns de liens suspects (FR + EN)
 */
const SUSPICIOUS_LINK_PATTERNS = [
  // URLs raccourcies
  /(bit\.ly|tinyurl\.com|t\.co|goo\.gl|short\.link|is\.gd|ow\.ly|rebrand\.ly|buff\.ly|tiny\.cc)/gi,
  // IP addresses au lieu de domaines
  /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi,
  // Domaines suspects
  /(free|gratuit|promo|discount|deal|offer|win|prize|lottery|reward)[\w-]*\.(tk|ml|ga|cf|gq|xyz|top|click|download)/gi,
  // Caractères suspects dans les URLs (FR + EN)
  /[^\w.-](click|here|link|download|free|win|prize|cliquez|ici|lien|télécharger|gratuit|gagnant)[^\w.-]/gi,
  // Patterns de phishing courants
  /(verify|confirm|update|secure|login|signin|account)[\w-]*\.(tk|ml|ga|cf|gq|xyz|top)/gi,
  /(paypal|amazon|microsoft|apple|google|facebook)[\w-]*\.(tk|ml|ga|cf|gq|xyz|top)/gi,
];

/**
 * Détecte les liens dans un texte
 */
function extractLinks(text: string): string[] {
  const urlRegex =
    /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9-]+\.(com|net|org|io|co|uk|fr|de|es|it|nl|be|ch|ca|au|jp|cn|ru|br|mx|ar|in|za|ae|sa|tr|pl|se|no|dk|fi|ie|pt|gr|cz|hu|ro|bg|hr|sk|si|lt|lv|ee|is|lu|mt|cy|li|mc|ad|sm|va|me|mk|al|ba|rs|md|ua|by|kz|ge|am|az|kg|tj|tm|uz|mn|np|bd|lk|mm|kh|la|vn|th|my|sg|id|ph|bn|tl|pg|fj|nc|pf|ws|to|vu|sb|ki|nr|pw|fm|mh|ck|nu|tk|tv|wf|as|gu|mp|vi|pr|gp|mq|re|yt|pm|bl|mf|gf|tf|io|ac|sh|gs|pn|bv|hm|aq|um|cx|cc|nf|ax|sj|bv|hm|aq|um|io|ac|sh|gs|pn|nf|ax|sj|tk|ml|ga|cf|gq)[^\s]*)/gi;
  return text.match(urlRegex) || [];
}

/**
 * Analyse un message pour détecter du phishing
 */
export function detectPhishing(content: string): {
  isPhishing: boolean;
  reasons: string[];
  suspiciousLinks: string[];
} {
  const reasons: string[] = [];
  const suspiciousLinks: string[] = [];

  // Vérifier les mots-clés de phishing
  for (const pattern of PHISHING_KEYWORDS) {
    if (pattern.test(content)) {
      reasons.push("Mots-clés suspects de phishing détectés");
      break; // Un seul match suffit
    }
  }

  // Extraire et analyser les liens
  const links = extractLinks(content);
  for (const link of links) {
    const lowerLink = link.toLowerCase();

    // Vérifier les patterns suspects
    for (const pattern of SUSPICIOUS_LINK_PATTERNS) {
      if (pattern.test(lowerLink)) {
        suspiciousLinks.push(link);
        reasons.push("Lien suspect détecté");
        break;
      }
    }

    // Vérifier les domaines suspects
    if (
      /(bit\.ly|tinyurl|t\.co|goo\.gl|short\.link|is\.gd|ow\.ly)/i.test(link)
    ) {
      suspiciousLinks.push(link);
      reasons.push("URL raccourcie détectée (potentiellement dangereuse)");
    }
  }

  // Vérifier la densité de mots-clés suspects
  const suspiciousWordCount = PHISHING_KEYWORDS.reduce((count, pattern) => {
    const matches = content.match(pattern);
    return count + (matches ? matches.length : 0);
  }, 0);

  if (suspiciousWordCount > 3) {
    reasons.push("Trop de mots-clés suspects dans le message");
  }

  return {
    isPhishing: reasons.length > 0 || suspiciousLinks.length > 0,
    reasons: [...new Set(reasons)], // Supprimer les doublons
    suspiciousLinks: [...new Set(suspiciousLinks)],
  };
}
