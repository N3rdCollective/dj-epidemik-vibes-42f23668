import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface EventActionsProps {
  children: ReactNode;
  type: "packages" | "rsvp";
  isCameloEvent: boolean;
  venue: string;
}

export const EventActions = ({
  children,
  type,
  isCameloEvent,
  venue,
}: EventActionsProps) => {
  return (
    <div className="flex gap-2">
      {!isCameloEvent && children}
    </div>
  );
};