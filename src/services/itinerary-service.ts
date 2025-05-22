'use server';

import { db } from '@/lib/firebase';
import type { SavedItinerary, NewItineraryData } from '@/types/itinerary';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  Timestamp,
  orderBy,
} from 'firebase/firestore';

/**
 * Saves a new itinerary to Firestore for a specific user.
 * @param userId The ID of the user saving the itinerary.
 * @param itineraryData The itinerary data to save.
 * @returns The ID of the newly created itinerary document.
 */
export async function saveItinerary(
  userId: string,
  itineraryData: NewItineraryData
): Promise<string> {
  if (!userId) {
    throw new Error('User ID is required to save an itinerary.');
  }
  console.log('Saving itinerary:', itineraryData);
  // Format the data to ensure it's compatible with Firestore
  const formattedData = {
    ...itineraryData,
    userId,
    createdAt: Timestamp.now(),
    // Ensure dates are stored as strings
    startDate: itineraryData.startDate.toString(),
    endDate: itineraryData.endDate.toString(),
    // Ensure numbers are stored as numbers
    numberOfPeople: Number(itineraryData.numberOfPeople),
    budget: Number(itineraryData.budget),
    // Ensure text fields are strings
    name: String(itineraryData.name),
    destination: String(itineraryData.destination),
    preferences: String(itineraryData.preferences),
    itineraryText: String(itineraryData.itineraryText)
  };

  try {
    const itinerariesCol = collection(db, 'itineraries');
    const docRef = await addDoc(itinerariesCol, formattedData);
    return docRef.id;
  } catch (error: any) {
    console.error('Error saving itinerary to Firestore:', error);
    const originalErrorMessage = error.message || 'An unknown Firestore error occurred.';
    throw new Error(`Could not save itinerary: ${originalErrorMessage}. Please check server logs for details and verify Firestore rules.`);
  }
}

/**
 * Fetches all itineraries for a specific user from Firestore, ordered by creation date.
 * Converts Timestamps to ISO strings.
 * @param userId The ID of the user whose itineraries to fetch.
 * @returns A promise that resolves to an array of SavedItinerary objects (with createdAt as string).
 */
export async function getUserItineraries(userId: string): Promise<SavedItinerary[]> {
  if (!userId) {
    return [];
  }
  try {
    const itinerariesCol = collection(db, 'itineraries');
    const q = query(
      itinerariesCol,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      // Ensure all fields are explicitly mapped and createdAt is converted
      return {
        id: doc.id,
        userId: data.userId,
        name: data.name,
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        numberOfPeople: data.numberOfPeople,
        budget: data.budget,
        preferences: data.preferences,
        itineraryText: data.itineraryText,
        createdAt: (data.createdAt as Timestamp).toDate().toISOString(), // Convert Timestamp to ISO string
      } as SavedItinerary; // Cast to SavedItinerary which expects createdAt as string
    });
  } catch (error) {
    console.error('Error fetching user itineraries from Firestore:', error);
    return [];
  }
}

/**
 * Fetches a single itinerary by its ID from Firestore.
 * Ensures the itinerary belongs to the specified user.
 * Converts Timestamps to ISO strings.
 * @param userId The ID of the user requesting the itinerary.
 * @param itineraryId The ID of the itinerary document to fetch.
 * @returns A promise that resolves to the SavedItinerary object (with createdAt as string) or null.
 */
export async function getItineraryById(
  userId: string,
  itineraryId: string
): Promise<SavedItinerary | null> {
  if (!userId || !itineraryId) {
    return null;
  }
  try {
    const itineraryDocRef = doc(db, 'itineraries', itineraryId);
    const docSnap = await getDoc(itineraryDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const itineraryData = {
        id: docSnap.id,
        userId: data.userId,
        name: data.name,
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        numberOfPeople: data.numberOfPeople,
        budget: data.budget,
        preferences: data.preferences,
        itineraryText: data.itineraryText,
        createdAt: (data.createdAt as Timestamp).toDate().toISOString(), // Convert Timestamp to ISO string
      } as SavedItinerary;

      if (itineraryData.userId === userId) {
        return itineraryData;
      } else {
        console.warn('User attempted to fetch itinerary not belonging to them.');
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching itinerary by ID from Firestore:', error);
    return null;
  }
}

