export interface User {
    idUser: number;
    username: string;
    email: string;
    password: string;
    reservations?: any[]; // Utiliser `Reservation[]` si tu as déjà défini le modèle Reservation
  }
  