import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface EventActionsProps {
  children: ReactNode;
  type: "packages" | "rsvp";
  isCameloEvent: boolean;
  venue: string;
  icalLink: string;
  handleAddToCalendar: (icalLink: string, venue: string) => void;
}

export const EventActions = ({
  children,
  type,
  isCameloEvent,
  venue,
  icalLink,
  handleAddToCalendar,
}: EventActionsProps) => {
  return (
    <div className="flex gap-2">
      {!isCameloEvent && children}
      <Button
        onClick={() => handleAddToCalendar(icalLink, venue)}
        variant="outline"
        className="px-4 whitespace-nowrap"
      >
        Add to Calendar
      </Button>
    </div>
  );
};