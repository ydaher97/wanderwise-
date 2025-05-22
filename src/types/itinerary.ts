
import type { Timestamp } from 'firebase/firestore';

// This interface represents the structure of itinerary data stored in Firestore
export interface SavedItinerary {
  id: string; // Firestore document ID
  userId: string;
  name: string; // e.g., "Paris Trip July 2024" - can be auto-generated or user-defined
  destination: string;
  startDate: string; // ISO string format: "YYYY-MM-DD"
  endDate: string;   // ISO string format: "YYYY-MM-DD"
  numberOfPeople: number;
  budget: number;
  preferences: string;
  itineraryText: string; // The AI-generated itinerary content
  createdAt: string; // Changed from Timestamp to ISO string
}

// Input structure for creating a new itinerary (subset of SavedItinerary)
// Note: When saving, createdAt will be a Firestore Timestamp. When fetching, it's converted to string.
export type NewItineraryData = Omit<SavedItinerary, 'id' | 'userId' | 'createdAt'>;

