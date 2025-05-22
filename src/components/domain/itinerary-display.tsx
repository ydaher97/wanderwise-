
"use client";

import { useItineraryStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, RotateCcw, ClipboardList, FileText, CheckSquare, CircleDollarSign, MapPin, Image as ImageIcon, CalendarDays, Users } from "lucide-react";
import { GoogleMapDisplay, MappableActivity } from "./google-map-display";
import { mockPlacesDatabase, Place } from "@/lib/mock-data"; 
import Image from "next/image";
import { format, parseISO } from "date-fns";


interface ParsedItineraryItem {
  id: string; 
  type: 'day_header' | 'activity' | 'description';
  content: string;
  mappable?: MappableActivity; 
  imageUrl?: string; 
}

export function ItineraryDisplay() {
  const { 
    itineraryText, 
    destination, 
    budget, 
    isLoading, 
    error, 
    itineraryId, 
    startDate, 
    endDate, 
    numberOfPeople,
    preferences,
    createdAt 
  } = useItineraryStore();
  const router = useRouter();
  const [hoveredActivityId, setHoveredActivityId] = useState<string | null>(null);

  useEffect(() => {
    // If not loading and essential data is missing, redirect to plan page.
    // This allows for flexibility if some optional data (like ID or full dates) isn't there for a newly generated plan.
    if (!isLoading && !itineraryText && !destination && budget === null && !error) {
      router.replace("/plan");
    }
  }, [isLoading, itineraryText, destination, budget, error, router]);

  const { parsedItems, mappableActivities } = useMemo(() => {
    if (!itineraryText || !destination) return { parsedItems: [], mappableActivities: [] };

    const lines = itineraryText.split('\n').map(line => line.trim()).filter(line => line !== '');
    const tempParsedItems: ParsedItineraryItem[] = [];
    const tempMappableActivities: MappableActivity[] = [];

    const allKnownPlaces: Place[] = [];
     if (mockPlacesDatabase[destination]) {
       Object.values(mockPlacesDatabase[destination]).forEach(placeTypeArray => {
        allKnownPlaces.push(...placeTypeArray);
      });
    } else {
        const cityKey = Object.keys(mockPlacesDatabase).find(k => destination.toLowerCase().startsWith(k.split(',')[0].toLowerCase()));
        if (cityKey && mockPlacesDatabase[cityKey]) {
            Object.values(mockPlacesDatabase[cityKey]).forEach(placeTypeArray => {
                allKnownPlaces.push(...placeTypeArray);
            });
        }
    }


    lines.forEach((line, index) => {
      const itemId = `item-${index}`;
      if (/^(Day \d+\s?:|Tour:|Morning:|Afternoon:|Evening:)/i.test(line)) {
        tempParsedItems.push({ id: itemId, type: 'day_header', content: line });
      } else if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) {
        const activityContent = line.replace(/^(-\s?|\*\s?|\d+\.\s)/, '').trim();
        let foundPlaceDetails: MappableActivity | undefined = undefined;
        let imageUrl: string | undefined = undefined;

        for (const place of allKnownPlaces) {
          if (activityContent.includes(place.name)) { 
            if (place.lat && place.lng) {
                foundPlaceDetails = { id: itemId, name: place.name, lat: place.lat, lng: place.lng, imageUrl: place.imageUrl };
                if (!tempMappableActivities.find(ma => ma.name === place.name)) { 
                     tempMappableActivities.push(foundPlaceDetails);
                }
            }
            imageUrl = place.imageUrl; 
            break; 
          }
        }
        tempParsedItems.push({ id: itemId, type: 'activity', content: activityContent, mappable: foundPlaceDetails, imageUrl });
      } else {
        tempParsedItems.push({ id: itemId, type: 'description', content: line });
      }
    });
    return { parsedItems: tempParsedItems, mappableActivities: tempMappableActivities };
  }, [itineraryText, destination]);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin text-primary lucide lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <p className="text-xl font-semibold mt-4 text-primary">Crafting your adventure...</p>
        <p className="text-muted-foreground">Please wait while we generate your personalized itinerary.</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center shadow-lg border-destructive">
        <CardHeader>
          <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-destructive pt-2">Oops! Something went wrong.</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground mb-4">We encountered an error while generating your itinerary:</p>
          <p className="text-sm bg-destructive/5 p-3 rounded-md border border-destructive/20 text-destructive-foreground">{error}</p>
        </CardContent>
        <CardFooter> 
          <Button onClick={() => router.push("/plan")} variant="destructive" size="lg">
            <RotateCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!itineraryText || !destination || budget === null) {
     return (
       <Card className="w-full max-w-2xl mx-auto text-center shadow-lg">
        <CardHeader>
           <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-primary pt-2">No Itinerary Data Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            It looks like there's no complete itinerary data to display. Please go back and plan your trip or check your dashboard.
          </p>
           <div className="flex gap-4 justify-center">
            <Link href="/plan">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">Plan a New Trip</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">My Trips</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formattedStartDate = startDate ? format(parseISO(startDate), "MMM d, yyyy") : "N/A";
  const formattedEndDate = endDate ? format(parseISO(endDate), "MMM d, yyyy") : "N/A";
  const formattedCreatedAt = createdAt ? format(parseISO(createdAt.toString()), "MMM d, yyyy 'at' h:mm a") : "Not saved";


  return (
    <div className="grid md:grid-cols-3 gap-8 items-start">
      <Card className="w-full shadow-2xl overflow-hidden md:col-span-2">
        <CardHeader className="bg-primary/10">
           <div className="flex items-center gap-3">
            <ClipboardList className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold text-primary">Your Personalized Itinerary</CardTitle>
              <CardDescription className="text-primary/80">For: <span className="font-semibold">{destination}</span>
              {itineraryId && <span className="text-xs block"> (Saved: {formattedCreatedAt})</span>}
              </CardDescription>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm text-primary/90">
            {startDate && endDate && (
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4"/> <span>{formattedStartDate} - {formattedEndDate}</span>
              </div>
            )}
            {numberOfPeople && (
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4"/> <span>{numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}</span>
              </div>
            )}
            {budget && (
              <div className="flex items-center gap-1.5">
                <CircleDollarSign className="h-4 w-4"/> <span>Budget: ${budget.toLocaleString()}</span>
              </div>
            )}
          </div>
          {preferences && (
             <p className="mt-2 text-xs text-primary/70 italic">Preferences: {preferences}</p>
          )}
        </CardHeader>
        <CardContent className="p-6 md:p-8 max-h-[70vh] overflow-y-auto">
          {parsedItems.length > 0 ? (
            <div className="space-y-4">
              {parsedItems.map((item) => {
                if (item.type === 'day_header') {
                  return (
                    <div key={item.id} className="pt-4 pb-2 mt-2 first:mt-0">
                      <h2 className="text-2xl font-semibold text-primary border-b-2 border-primary/30 pb-2">
                        {item.content}
                      </h2>
                    </div>
                  );
                } else if (item.type === 'activity') {
                  const placeKeywords = item.content.split(' ').slice(0, 2).join(' ');
                  return (
                    <Card 
                      key={item.id} 
                      className={`shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] bg-card ${item.mappable && hoveredActivityId === item.id ? 'ring-2 ring-accent' : ''}`}
                      onMouseEnter={() => item.mappable && setHoveredActivityId(item.id)}
                      onMouseLeave={() => item.mappable && setHoveredActivityId(null)}
                    >
                      <CardContent className="p-0">
                        {item.imageUrl && (
                          <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
                            <Image 
                              src={item.imageUrl} 
                              alt={`Image of ${item.content}`} 
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{objectFit: "cover"}}
                              data-ai-hint={`activity ${placeKeywords}`}
                            />
                          </div>
                        )}
                        <div className="p-4 flex items-start gap-3">
                          {item.mappable ? <MapPin className="h-5 w-5 text-accent mt-1 flex-shrink-0" /> : <CheckSquare className="h-5 w-5 text-primary mt-1 flex-shrink-0" />}
                          <p className="text-foreground flex-grow">{item.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                } else if (item.type === 'description') {
                  return (
                    <p key={item.id} className="text-muted-foreground text-sm leading-relaxed my-1">
                      {item.content}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">Your itinerary details will appear here.</p>
          )}
        </CardContent>
        <CardFooter className="bg-muted/30 border-t p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
           <Link href="/dashboard">
             <Button variant="outline" className="text-primary border-primary hover:bg-primary/5 hover:text-primary font-semibold">
                My Trips
            </Button>
          </Link>
          <Link href="/plan">
            <Button variant="outline" className="text-primary border-primary hover:bg-primary/5 hover:text-primary font-semibold">
              <RotateCcw className="mr-2 h-4 w-4" /> Plan Another Trip
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <div className="md:col-span-1 md:sticky md:top-24 h-full min-h-[500px] md:min-h-[calc(100vh-7rem)]">
        <GoogleMapDisplay 
          destination={destination} 
          activities={mappableActivities} 
          hoveredActivityId={hoveredActivityId} 
        />
      </div>
    </div>
  );
}
