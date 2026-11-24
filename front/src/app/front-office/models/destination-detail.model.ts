export interface Activity {
  idActivity: number;
  nom: string;
  description: string;
  image: string;
  localisation: string;
  prix: number;
  duree: number;
  type: string | null;  // ou enum si tu veux le typer davantage
}
