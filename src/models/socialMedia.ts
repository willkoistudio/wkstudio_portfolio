import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface SocialMediaLink {
  name: string;
  url: string;
  icon?: IconProp; // icône FontAwesome
  customIcon?: string; // chemin vers SVG personnalisé
}
