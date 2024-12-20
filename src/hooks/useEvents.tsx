import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseICalEvents } from "@/utils/icalParser";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface ICalEvent {
  id: string; // Add this line
  date: string;
  venue: string;
  location: string;
  time: string;
  type: "packages" | "rsvp";
  packages?: {
    name: string;
    price: number;
    description: string;
  }[];
  icalLink: string;
  isCameloEvent?: boolean;
  icalUid?: string;
}

interface DbPackage {
  name: string;
  price: number;
  description: string;
}

export const useEvents = () => {
  // Fetch manual events from Supabase
  const { data: dbEvents, isLoading: isDbLoading } = useQuery({
    queryKey: ['db-events'],
    queryFn: async () => {
      console.log('Fetching database events...');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_live', true);
      
      if (error) {
        console.error('Error fetching database events:', error);
        toast.error('Failed to load database events');
        return [];
      }

      console.log('Database events:', data);
      
      return data.map(event => {
        // Safely parse packages data
        let parsedPackages: DbPackage[] | undefined;
        if (event.packages && Array.isArray(event.packages)) {
          parsedPackages = (event.packages as Json[]).map(pkg => {
            if (typeof pkg === 'object' && pkg !== null) {
              const typedPkg = pkg as Record<string, Json>;
              return {
                name: String(typedPkg.name || ''),
                price: Number(typedPkg.price || 0),
                description: String(typedPkg.description || '')
              };
            }
            return {
              name: '',
              price: 0,
              description: ''
            };
          });
        }

        return {
          date: new Date(event.start_time).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }).toUpperCase(),
          venue: event.venue,
          location: event.location,
          time: `${new Date(event.start_time).toLocaleTimeString('en-US', { 
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          })} - ${new Date(event.end_time).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          })}`,
          type: event.type as "packages" | "rsvp",
          packages: parsedPackages,
          icalLink: CAMELO_ICAL_URL,
          isCameloEvent: event.is_imported,
          icalUid: event.ical_uid
        } as ICalEvent;
      });
    },
  });

  // Fetch Camelo iCal events
  const { data: cameloEvents, isLoading: isCameloLoading } = useQuery({
    queryKey: ['camelo-events'],
    queryFn: async () => {
      try {
        console.log('Fetching Camelo iCal events...');
        const response = await axios.get(CAMELO_ICAL_URL);
        const parsedEvents = parseICalEvents(response.data, CAMELO_ICAL_URL);
        console.log('Parsed Camelo events:', parsedEvents);
        return parsedEvents.map(event => ({
          ...event,
          // Clean up venue name by removing the prefix
          venue: event.venue.replace('DJ  Epidemik . | DJ @ ', ''),
          isCameloEvent: true
        }));
      } catch (error) {
        console.error('Error fetching Camelo iCal data:', error);
        toast.error('Failed to load Camelo events');
        return [];
      }
    },
  });

  // Combine all events and sort by date
  const allEvents = [
    ...(dbEvents || []),
    ...(cameloEvents || [])
  ].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  console.log('Combined events:', allEvents);

  return {
    events: allEvents,
    isLoading: isDbLoading || isCameloLoading,
  };
};

const CAMELO_ICAL_URL = "https://api.camelohq.com/ical/0951e7cf-629b-4dbf-b08a-263cf483e740?smso=true&token=WG4wUGQyZThCT1VoME42R2F5QT0tLTZ4WmVxRG54YnJBS3pyNHgtLUloNTQ0T1Q2aUtYQzl4bjBHcTFMN2c9PQ%3D%3D&wid=6f6f1fb7-7065-4d7b-b965-9d2fc0f23674";