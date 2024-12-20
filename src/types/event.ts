export interface Event {
  id: string;
  title: string;
  venue: string;
  location: string;
  start_time: string;
  end_time: string;
  is_live: boolean;
  type: "packages" | "rsvp";
  packages?: {
    name: string;
    price: number;
    description: string;
  }[];
  ical_uid?: string;
  is_imported: boolean;
  created_at: string;
  updated_at: string;
}