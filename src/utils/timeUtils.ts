import { parseISO, isAfter, addDays } from "date-fns";

export const adjustEndTimeForNextDay = (startTime: Date, endTime: Date): Date => {
  if (isAfter(startTime, endTime)) {
    return addDays(endTime, 1);
  }
  return endTime;
};

export const adjustEndTimeForFormDisplay = (startTime: Date, endTime: Date): Date => {
  if (isAfter(startTime, endTime)) {
    return addDays(endTime, -1);
  }
  return endTime;
};

export const formatDateTimeForInput = (date: Date): string => {
  return date.toISOString().slice(0, 16);
};