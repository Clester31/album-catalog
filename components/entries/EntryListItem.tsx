"use client";
import { useAppContext } from "@/lib/context/AppContext";
import { EntryType } from "@/lib/types/types";
import { ratingColors } from "@/lib/utils";

/* eslint-disable @next/next/no-img-element */
export default function EntryListItem({ entry }: { entry: EntryType }) {
  const { setSelectedEntry, selectedEntry } = useAppContext();

  // Use live data from context if this is the currently selected entry
  const liveEntry = selectedEntry?.id === entry.id ? selectedEntry : entry;

  return (
    <div
      className="flex flex-col gap-2 cursor-pointer hover:opacity-80 transition-opacity w-32 h-32"
      onClick={() => setSelectedEntry(liveEntry)}
    >
      <img
        src={liveEntry.entryCoverArt}
        alt={liveEntry.entryTitle}
        className="w-32 h-32 object-cover rounded-md"
      />
      <div
        className="absolute w-6 h-6 text-center items-center rounded-tl-md rounded-br-md"
        style={{
          backgroundColor: ratingColors[Number(liveEntry.entryRating)] ?? "transparent",
        }}
      >
        <h1>{liveEntry.entryRating}</h1>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold truncate w-32">{liveEntry.entryTitle}</p>
        <p className="text-xs text-muted-foreground truncate w-32">{liveEntry.entryArtist}</p>
      </div>
    </div>
  );
}