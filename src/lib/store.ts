
import type { SavedItinerary } from '@/types/itinerary';
import { create } from 'zustand';

type ItineraryStoreState = {
  itineraryId: string | null; // ID of the itinerary if it's a saved one
  itineraryText: string | null;
  destination: string | null;
  budget: number | null;
  // Store other relevant fields from SavedItinerary if needed for display or context
  startDate?: string;
  endDate?: string;
  numberOfPeople?: number;
  preferences?: string;
  createdAt?: Date | string; // Store as ISO string or Date object

  isLoading: boolean;
  error: string | null;
  
  setItineraryData: (data: Partial<SavedItinerary> & { itineraryText: string; destination: string; budget: number; }) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearItinerary: () => void;
};

export const useItineraryStore = create<ItineraryStoreState>((set) => ({
  itineraryId: null,
  itineraryText: null,
  destination: null,
  budget: null,
  isLoading: false,
  error: null,

  setItineraryData: (data) => {
    set({
      itineraryId: data.id || null,
      itineraryText: data.itineraryText,
      destination: data.destination,
      budget: data.budget,
      startDate: data.startDate,
      endDate: data.endDate,
      numberOfPeople: data.numberOfPeople,
      preferences: data.preferences,
      createdAt: data.createdAt instanceof Date ? data.createdAt.toISOString() : data.createdAt?.toString(), // Ensure createdAt is serializable
      isLoading: false,
      error: null,
    });
  },
  setIsLoading: (loading) => set({ isLoading: loading, error: null }),
  setError: (error) => set({ error, isLoading: false }),
  clearItinerary: () => set({
    itineraryId: null,
    itineraryText: null,
    destination: null,
    budget: null,
    startDate: undefined,
    endDate: undefined,
    numberOfPeople: undefined,
    preferences: undefined,
    createdAt: undefined,
    isLoading: false,
    error: null,
  }),
}));
