import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseICalEvents } from "@/utils/icalParser";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface ICalEvent {
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
          icalLink: YOUR_ICAL_URL,
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
        const response = await axios.get(YOUR_ICAL_URL);
        const parsedEvents = parseICalEvents(response.data, YOUR_ICAL_URL);
        console.log('Parsed Camelo events:', parsedEvents);
        return parsedEvents.map(event => ({
          ...event,
          isCameloEvent: true
        }));
      } catch (error) {
        console.error('Error fetching Camelo iCal data:', error);
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

const YOUR_ICAL_URL = "https://calendar.google.com/calendar/ical/your-calendar-id/basic.ics"; // Replace with your actual iCal URL