

export interface Review {
  id?: number;               
  produit: { id: number };      
  rating: number;           
  commentaire: string;   
  fullName  : string; 
  date: Date;                
  helpfulCount?: number;     
}