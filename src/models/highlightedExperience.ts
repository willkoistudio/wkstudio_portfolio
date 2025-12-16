export interface HighlightedExperience {
  _id: string;
  company: string;
  logo?: string;
  position: {
    fr?: string;
    en?: string;
  };
  from: string;
  to?: string;
  clients?: string[];
}
