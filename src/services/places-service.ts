
'use server';
/**
 * @fileOverview A mock service to fetch place suggestions.
 * In a real application, this would call an external API like Google Places.
 */
import type { Place } from '@/lib/mock-data';
import { mockPlacesDatabase } from '@/lib/mock-data';


/**
 * Fetches suggested places based on location, type, and an optional query.
 * This is a mock implementation.
 */
export async function fetchPlaceSuggestions(
  location: string,
  type: "restaurant" | "tourist_attraction" | "cafe",
  query?: string // e.g., "sushi", "modern art"
): Promise<Place[]> {
  console.log(`Mock fetchPlaces: location=${location}, type=${type}, query=${query}`);
  
  const normalizedLocation = location.toLowerCase();
  const locationKey = Object.keys(mockPlacesDatabase).find(k => 
    k.toLowerCase() === normalizedLocation || normalizedLocation.includes(k.split(',')[0].toLowerCase())
  ) || "Paris, France"; // Fallback to Paris if no good match

  const locationPlaces = mockPlacesDatabase[locationKey];
  
  if (!locationPlaces || !locationPlaces[type]) {
    console.warn(`No places found for location: ${locationKey}, type: ${type}`);
    return [];
  }

  let results = locationPlaces[type];

  if (query) {
    const normalizedQuery = query.toLowerCase();
    results = results.filter(
      (place) =>
        place.name.toLowerCase().includes(normalizedQuery) ||
        (place.description && place.description.toLowerCase().includes(normalizedQuery)) ||
        place.category.toLowerCase().includes(normalizedQuery)
    );
  }
  
  // Return a subset to simulate API limits and variety
  return results.slice(0, 5); // Increased to 5 for more variety
}

