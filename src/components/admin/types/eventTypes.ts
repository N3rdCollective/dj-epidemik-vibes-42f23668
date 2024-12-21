export interface Package {
  name: string;
  price: number;
  description: string;
}

export type RecurringType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface EventFormValues {
  title: string;
  venue: string;
  location: string;
  start_time: string;
  end_time: string;
  type: string;
  packages?: Package[];
  recurring_type: RecurringType;
  recurring_end_date?: string;
  recurring_days?: number[];
  recurring_interval?: number;
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
  recurring_type?: RecurringType;
  recurring_end_date?: string;
  recurring_days?: number[];
  recurring_interval?: number;
}