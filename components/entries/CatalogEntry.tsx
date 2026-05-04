/* eslint-disable @next/next/no-img-element */
"use client";

import { useAppContext } from "@/lib/context/AppContext";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  getTrackRatings,
  updateEntryRating,
  updateEntryReview,
} from "@/lib/actions/actions";
import { ratingColors } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { TrackType } from "@/lib/types/types";
import TrackRating from "../tracks/TrackRating";

export default function CatalogEntry() {
  const { selectedEntry, setSelectedEntry } = useAppContext();
  const [editReview, setEditReview] = useState<boolean>(false);
  const [entryReview, setEntryReview] = useState<string>("");
  const [entryTracks, setEntryTracks] = useState<TrackType[]>([]);

  useEffect(() => {
    const updateEntryTracks = async () => {
      if (selectedEntry) {
        const response = await getTrackRatings(selectedEntry.id);
        setEntryTracks([...response].sort((a, b) => a.trackOrder - b.trackOrder));
      } else {
        setEntryTracks([]);
      }
    };
    updateEntryTracks();
  }, [selectedEntry]);

  const updateRating = async (rating: number) => {
    if (!selectedEntry) return;

    setSelectedEntry({ ...selectedEntry, entryRating: rating });

    try {
      await updateEntryRating(selectedEntry.id, rating);
    } catch (error) {
      setSelectedEntry(selectedEntry);
      console.error("failed to update rating: ", error);
    }
  };

  const updateReview = async () => {
    if (!selectedEntry) return;

    setSelectedEntry({ ...selectedEntry, entryReview });

    try {
      await updateEntryReview(selectedEntry.id, entryReview);
    } catch (error) {
      setSelectedEntry(selectedEntry);
      console.error("failed to update review: ", error);
    }
  };

  return (
    <div className="flex flex-col w-2/5 p-4 gap-4 overflow-y-scroll">
      <div className="entry-header flex flex-row w-full justify-around items-start text-center gap-2 p-4 h-[20rem]">
        <div className="w-1/2">
          <img
            src={selectedEntry?.entryCoverArt}
            alt="album-cover"
            className="w-xs rounded-xl border-2 h-xs"
          />
        </div>
        <div className="flex flex-col items-center justify-center w-1/2 gap-2">
          <h1 className="text-4xl font-semibold">
            {selectedEntry?.entryTitle}
          </h1>
          <h2 className="text-2xl text-white/50">
            {selectedEntry?.entryArtist}
          </h2>
          <div className="header-rating flex flex-col gap-4">
            <Card className="w-32 h-32 flex justify-center text-6xl">
              <CardContent className="relative flex items-center justify-center">
                <div
                  className="absolute w-16 h-16 rounded-full blur-xl"
                  style={{
                    background:
                      selectedEntry?.entryRating !== undefined
                        ? ratingColors[selectedEntry.entryRating]
                        : undefined,
                    opacity: 0.75,
                  }}
                />
                <h1
                  className="relative text-6xl"
                  style={{
                    textShadow: `0 0 10px ${selectedEntry?.entryRating !== undefined ? ratingColors[selectedEntry.entryRating] : "white"}`,
                    color: `${selectedEntry?.entryRating === 0 ? "gray" : "white"}`,
                  }}
                >
                  {selectedEntry?.entryRating}
                </h1>
              </CardContent>
            </Card>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"}>Edit Rating</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Select a Rating</DropdownMenuLabel>
                  {Array.from({ length: 11 }, (_, i) => (
                    <DropdownMenuItem
                      key={i}
                      className="cursor-pointer"
                      onClick={() => updateRating(i)}
                    >
                      {i}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {selectedEntry?.entryRating === 0 && (
              <p className="text-white/50">Rating not set</p>
            )}
          </div>
        </div>
      </div>
      <div className="entry-review flex flex-col gap-2">
        <h1 className="text-xl font-semibold flex flex-row gap-2 items-center">
          Review{" "}
          {!editReview && (
            <Button
              className="h-6"
              variant={"outline"}
              onClick={() => setEditReview(true)}
            >
              <i className="fa-solid fa-pencil"></i>
            </Button>
          )}
        </h1>

        {editReview ? (
          <div className="flex flex-col gap-2">
            <Textarea
              className="w-full h-64 overflow-y-scroll resize-none p-4"
              maxLength={2000}
              placeholder="max length: 2000 characters"
              defaultValue={selectedEntry?.entryReview}
              onChange={(e) => setEntryReview(e.target.value)}
            />
            <div className="w-full flex flex-row gap-2 items-center justify-center">
              <Button
                variant={"destructive"}
                className="w-1/2"
                onClick={() => {
                  setEntryReview("");
                  setEditReview(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant={"default"}
                className="w-1/2"
                onClick={() => {
                  updateReview();
                  setEditReview(false);
                }}
              >
                Update
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="bg-card border-accent border-2 rounded-xl p-4 h-64 cursor-pointer hover:border-white/50 transition-colors"
            onClick={() => setEditReview(true)}
          >
            {selectedEntry?.entryReview ? (
              <p>{selectedEntry.entryReview}</p>
            ) : (
              <p className="text-white/50 text-center mt-24">
                No review yet. Click here to write one.
              </p>
            )}
          </div>
        )}
      </div>
      <div className="entry-tracks flex flex-col gap-2">
        <h1 className="text-xl font-semibold flex flex-row gap-2 items-center">Track Ratings</h1>
        {selectedEntry &&
          entryTracks &&
          entryTracks.map((track: TrackType, index: number) => {
            return (
              <TrackRating key={index} track={track} />
            )
          })}
      </div>
    </div>
  );
}
