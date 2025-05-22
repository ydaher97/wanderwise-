
/**
 * @fileOverview Mock place data for the WanderWise application.
 */

export interface Place {
  id: string; // Unique ID for each place
  name: string;
  category: string; // e.g., "Restaurant", "Museum", "Park"
  description?: string; // Short description or address
  lat?: number;
  lng?: number;
  imageUrl?: string; // URL for an image of the place
}

// Mock data - replace with actual API calls in a production app
// Added id, lat, lng, and imageUrl
export const mockPlacesDatabase: Record<string, Record<string, Place[]>> = {
  "Paris, France": {
    restaurant: [
      { id: "paris_le_procope", name: "Le Procope", category: "Restaurant", description: "Historic French restaurant", lat: 48.853, lng: 2.3385, imageUrl: "https://placehold.co/300x200.png" },
      { id: "paris_bouillon_chartier", name: "Bouillon Chartier", category: "Restaurant", description: "Traditional, budget-friendly", lat: 48.872, lng: 2.343, imageUrl: "https://placehold.co/300x200.png" },
      { id: "paris_le_consulat", name: "Le Consulat", category: "Restaurant", description: "Charming cafe in Montmartre", lat: 48.8867, lng: 2.3386, imageUrl: "https://placehold.co/300x200.png" },
    ],
    tourist_attraction: [
      { id: "paris_eiffel_tower", name: "Eiffel Tower", category: "Landmark", description: "Iconic iron lattice tower", lat: 48.8584, lng: 2.2945, imageUrl: "https://placehold.co/300x200.png" },
      { id: "paris_louvre_museum", name: "Louvre Museum", category: "Museum", description: "World's largest art museum", lat: 48.8606, lng: 2.3376, imageUrl: "https://placehold.co/300x200.png" },
      { id: "paris_notre_dame", name: "Cathédrale Notre-Dame de Paris", category: "Cathedral", description: "Medieval Catholic cathedral", lat: 48.8530, lng: 2.3499, imageUrl: "https://placehold.co/300x200.png" },
    ],
    cafe: [
      { id: "paris_cafe_de_flore", name: "Café de Flore", category: "Cafe", description: "Famous literary café", lat: 48.854, lng: 2.3325, imageUrl: "https://placehold.co/300x200.png" },
      { id: "paris_les_deux_magots", name: "Les Deux Magots", category: "Cafe", description: "Another historic literary café", lat: 48.8539, lng: 2.3329, imageUrl: "https://placehold.co/300x200.png" },
    ],
  },
  "Tokyo, Japan": {
    restaurant: [
      { id: "tokyo_sukiyabashi_jiro", name: "Sukiyabashi Jiro", category: "Restaurant", description: "Renowned sushi restaurant", lat: 35.6719, lng: 139.7643, imageUrl: "https://placehold.co/300x200.png" },
      { id: "tokyo_ichiran_shibuya", name: "Ichiran Ramen Shibuya", category: "Restaurant", description: "Popular tonkotsu ramen", lat: 35.6595, lng: 139.7013, imageUrl: "https://placehold.co/300x200.png" },
    ],
    tourist_attraction: [
      { id: "tokyo_senso_ji", name: "Senso-ji Temple", category: "Temple", description: "Ancient Buddhist temple", lat: 35.7148, lng: 139.7967, imageUrl: "https://placehold.co/300x200.png" },
      { id: "tokyo_skytree", name: "Tokyo Skytree", category: "Landmark", description: "Broadcasting and observation tower", lat: 35.7101, lng: 139.8107, imageUrl: "https://placehold.co/300x200.png" },
      { id: "tokyo_shibuya_crossing", name: "Shibuya Crossing", category: "Landmark", description: "Famous scramble crossing", lat: 35.6595, lng: 139.7006, imageUrl: "https://placehold.co/300x200.png" },
    ],
     cafe: [
      { id: "tokyo_blue_bottle_kiyosumi", name: "Blue Bottle Coffee - Kiyosumi Shirakawa", category: "Cafe", description: "Specialty coffee shop", lat: 35.682, lng: 139.798, imageUrl: "https://placehold.co/300x200.png" },
    ],
  },
  // Add more mock data as needed
};
