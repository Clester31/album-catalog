"use client";
import { useAppContext } from "@/lib/context/AppContext";
import { EntryType } from "@/lib/types/types";

/* eslint-disable @next/next/no-img-element */
export default function EntryListItem({ entry }: { entry: EntryType }) {
  const { setSelectedEntry } = useAppContext();
  return (
    <div className="flex flex-col gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedEntry(entry)}>
      <img
        src={entry.entryCoverArt}
        alt={entry.entryTitle}
        className="w-32 h-32 object-cover rounded-md"
      />
      <div className="text-center">
        <p className="text-sm font-semibold truncate w-32">
          {entry.entryTitle}
        </p>
        <p className="text-xs text-muted-foreground truncate w-32">
          {entry.entryArtist}
        </p>
      </div>
    </div>
  );
}
