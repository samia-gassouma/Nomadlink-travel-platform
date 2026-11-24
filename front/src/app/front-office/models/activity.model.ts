// activity.model.ts
export interface Activity {
  id: number;
  activityName: string;
  activityDescription: string;
  activityType: string;
  activityLocation: string;
  priceType: string;
  priceRange: string;
  bookingRequired: string;
  duration: string;
  difficultyLevel: string;
  requiredEquipment: string;
  safetyTips: string;
  accessibility: string[];
  languages: string[];
  galleryImages: string[];
  mainImage: string;
  destinationId?: number;
  destination?: {
    id: number;
    name: string;
  };

}
