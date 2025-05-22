
'use server';
/**
 * @fileOverview Generates a personalized multi-day travel itinerary based on user inputs.
 *
 * - generateItinerary - A function that generates a travel itinerary.
 * - GenerateItineraryInput - The input type for the generateItinerary function.
 * - GenerateItineraryOutput - The return type for the generateItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { findPlacesTool } from '@/ai/tools/find-places-tool';

const GenerateItineraryInputSchema = z.object({
  destination: z.string().describe('The destination for the trip.'),
  startDate: z.string().describe('The start date of the trip (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date of the trip (YYYY-MM-DD).'),
  numberOfPeople: z.number().describe('The number of people on the trip.'),
  budget: z.number().describe('The budget for the trip in USD.'),
  preferences: z.string().describe('The preferences for the trip, such as types of attractions and restaurants.'),
});
export type GenerateItineraryInput = z.infer<typeof GenerateItineraryInputSchema>;

const GenerateItineraryOutputSchema = z.object({
  itinerary: z.string().describe('The generated travel itinerary as a formatted text string. When a place is found using the findPlacesTool, its exact name as returned by the tool should be used in the itinerary text.'),
});
export type GenerateItineraryOutput = z.infer<typeof GenerateItineraryOutputSchema>;

export async function generateItinerary(input: GenerateItineraryInput): Promise<GenerateItineraryOutput> {
  return generateItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateItineraryPrompt',
  input: {schema: GenerateItineraryInputSchema},
  output: {schema: GenerateItineraryOutputSchema},
  tools: [findPlacesTool], 
  prompt: `You are a travel expert. Generate a multi-day travel itinerary based on the following information:

Destination: {{destination}}
Start Date: {{startDate}}
End Date: {{endDate}}
Number of People: {{numberOfPeople}}
Budget: {{budget}}
User Preferences: {{preferences}}

The itinerary should include diverse activity suggestions and daily schedules.
**Use the 'findPlacesTool' to find specific restaurants, cafes, and tourist attractions for the itinerary. The tool now returns place names, categories, descriptions, and coordinates.**
When suggesting a meal (e.g., lunch, dinner) or an activity (e.g., museum visit, park), try to use the tool to find a real place.
For example, if the user wants Italian food for dinner, you can use the tool with placeType 'restaurant' and query 'Italian food'.
If the user wants to visit a historical site, use the tool with placeType 'tourist_attraction' and query 'historical site' or a more specific term based on preferences.
**Crucially, when you include a place found by the tool in the itinerary, use its EXACT name as returned by the tool.** This helps the system link it to map data later. Do NOT rephrase or shorten the name.

Please format the output as a plain text string.
Each day should start with a line like "Day X: [Date - optional description]".
Activities for each day should be listed on new lines, each starting with a hyphen (e.g., "- Activity description including the EXACT place name from the tool").
You can also include sub-headings like "Morning:", "Afternoon:", "Evening:" on their own lines before listing activities for that part of the day.
Provide brief descriptions for activities where appropriate, on the same line as the activity.

Example of desired format using the tool:
Day 1: Arrival and Local Exploration
- Arrive at the hotel and check-in.
- Lunch at 'Le Petit Cafe' (Cafe, charming spot near hotel). <-- Assume 'Le Petit Cafe' was the exact name from the tool
Afternoon:
- Visit the 'City History Museum' (Museum, local history exhibits). <-- Assume 'City History Museum' was the exact name from the tool
- Walk through the Old Town.
Evening:
- Dinner at 'Trattoria Bella' (Restaurant, traditional Italian). <-- Assume 'Trattoria Bella' was the exact name from the tool

Ensure the output is a single string, following this text-based format. Do not output JSON.`,
});

const generateItineraryFlow = ai.defineFlow(
  {
    name: 'generateItineraryFlow',
    inputSchema: GenerateItineraryInputSchema,
    outputSchema: GenerateItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
