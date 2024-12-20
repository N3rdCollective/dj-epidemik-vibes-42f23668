export interface Package {
  name: string;
  price: number;
  description: string;
}

export interface EventFormValues {
  title: string;
  venue: string;
  location: string;
  start_time: string;
  end_time: string;
  type: string;
  packages?: Package[];
}

export interface Event {
  id: string;
  title: string;
  venue: string;
  location: string;
  start_time: string;
  end_time: string;
  type: string;
  packages?: Package[];
}