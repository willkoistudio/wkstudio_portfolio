import { SocialMediaLink } from "@/models/socialMedia";
import {
  faLinkedin,
  faGithub,
  faDribbble,
  faInstagram,
  faBehance,
  faCodepen,
  faPinterest,
  faDeviantart,
} from "@fortawesome/free-brands-svg-icons";

export const socialMediaLinks: SocialMediaLink[] = [
  {
    name: "Linkedin",
    url: "https://www.linkedin.com/in/williamkoi/",
    icon: faLinkedin,
  },
  {
    name: "GitHub",
    url: "https://github.com/willkoistudio",
    icon: faGithub,
  },
  {
    name: "Dribbble",
    url: "https://dribbble.com/wkoistudio",
    icon: faDribbble,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/wkoistudio/",
    icon: faInstagram,
  },
  {
    name: "Bēhance",
    url: "https://www.behance.net/wkoistudio",
    icon: faBehance,
  },
  {
    name: "Codepen",
    url: "https://codepen.io/willkoistudio",
    icon: faCodepen,
  },
  {
    name: "Pinterest",
    url: "https://www.pinterest.com/wkoistudio/",
    icon: faPinterest,
  },
  {
    name: "DeviantART",
    url: "https://www.deviantart.com/willkoi91",
    icon: faDeviantart,
  },
  {
    name: "Malt",
    url: "https://www.malt.fr/profile/williamkoi",
    customIcon: "/images/brands/Malt_logo_white.svg",
  },
  {
    name: "Upwork",
    url: "https://www.upwork.com/freelancers/~016936fb5c576b2120",
    customIcon: "/images/brands/Upwork-logo.svg",
  },
];
