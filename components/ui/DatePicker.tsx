"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppContext } from "@/lib/context/AppContext";

export function DatePicker({
  onChange,
}: {
  onChange?: (date: string) => Promise<void>;
}) {
  const [date, setDate] = React.useState<Date>();
  const { selectedEntry } = useAppContext();

  React.useEffect(() => {
  if (selectedEntry?.entryListeningDate) {
    const [year, month, day] = selectedEntry.entryListeningDate.split("-").map(Number);
    setDate(new Date(year, month - 1, day)); 
  } else {
    setDate(undefined);
  }
}, [selectedEntry?.id]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Set Listening Date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            if (!newDate) return;
            const formattedDate = format(newDate, "yyyy-MM-dd");
            if (onChange) {
              onChange(formattedDate);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
