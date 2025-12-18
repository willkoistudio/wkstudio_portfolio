/** @format */

/**
 * Supprime tous les tags HTML d'un texte
 */
export function stripHtml(html: string): string {
  // Supprimer les commentaires HTML
  let text = html.replace(/<!--[\s\S]*?-->/g, "");

  // Supprimer les tags script et style avec leur contenu
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");

  // Supprimer tous les autres tags HTML
  text = text.replace(/<[^>]+>/g, "");

  // Décoder les entités HTML
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&copy;/g, "©")
    .replace(/&reg;/g, "®")
    .replace(/&trade;/g, "™")
    .replace(/&hellip;/g, "...")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'");

  // Décoder les entités numériques
  text = text.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
  text = text.replace(/&#x([a-f\d]+);/gi, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16)),
  );

  // Nettoyer les espaces multiples
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * Vérifie si un texte contient du HTML
 */
export function containsHtml(text: string): boolean {
  // Vérifier la présence de tags HTML
  const htmlTagRegex = /<[^>]+>/g;
  return htmlTagRegex.test(text);
}

/**
 * Échappe les caractères HTML pour éviter l'injection
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}
