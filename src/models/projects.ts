export interface ProjectFilter {
  _id: string;
  className: string;
  color: string;
  title: {
    fr?: string;
    en?: string;
  };
}

export interface Project {
  _id: string;
  projectFilterType: {
    _id: string;
    title: {
      fr?: string;
      en?: string;
    };
    color: string;
    className: string;
  };
  title: {
    fr?: string;
    en?: string;
  };
  featuredImage: string; // URL directe de l'image
  featuredImageWidth?: number; // Largeur de l'image
  featuredImageHeight?: number; // Hauteur de l'image
  gallery: string[]; // Tableau d'URLs
  content: {
    fr?: unknown[]; // PortableText array
    en?: unknown[]; // PortableText array
  };
  type: {
    _id: string;
    title: {
      fr?: string;
      en?: string;
    };
  };
  status: {
    _id: string;
    title: {
      fr?: string;
      en?: string;
    };
  };
  year: string;
  tools: {
    _id: string;
    title: {
      fr?: string;
      en?: string;
    };
  }[];
  website: string;
  client: {
    _id: string;
    title: {
      fr?: string;
      en?: string;
    };
  };
  slugFr?: string;
  slugEn?: string;
}
