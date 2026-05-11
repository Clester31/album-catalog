/* eslint-disable @next/next/no-img-element */
"use client";

import { useAppContext } from "@/lib/context/AppContext";
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
  deleteEntry,
  getTrackRatings,
  updateEntryListeningDate,
  updateEntryRating,
  updateEntryReview,
} from "@/lib/actions/actions";
import { ratingColors } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { EntryType, TrackType } from "@/lib/types/types";
import TrackRating from "../tracks/TrackRating";
import ConfirmDeletePopup from "../popup/ConfirmDeletePopup";
import { Spinner } from "../ui/spinner";
import { DatePicker } from "../ui/DatePicker";

export default function CatalogEntry() {
  const {
    selectedEntry,
    setSelectedEntry,
    setPopup,
    closePopup,
    setCatalogs,
    catalogs,
    selectedCatalog,
    setSelectedCatalog,
  } = useAppContext();
  const [editReview, setEditReview] = useState<boolean>(false);
  const [entryReview, setEntryReview] = useState<string>("");
  const [entryTracks, setEntryTracks] = useState<TrackType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const updateEntryTracks = async () => {
      setLoading(true);
      setEntryTracks([]);

      if (selectedEntry) {
        const response = await getTrackRatings(selectedEntry.id);
        setEntryTracks(
          [...response].sort((a, b) => a.trackOrder - b.trackOrder),
        );
      } else {
        setEntryTracks([]);
      }
      setLoading(false);
    };
    updateEntryTracks();
  }, [selectedEntry]);

  const syncEntryUpdate = (updatedEntry: EntryType) => {
    setSelectedEntry(updatedEntry);
    setSelectedCatalog(
      selectedCatalog
        ? {
            ...selectedCatalog,
            entry:
              selectedCatalog.entry?.map((e) =>
                e.id === updatedEntry.id ? updatedEntry : e,
              ) ?? [],
          }
        : null,
    );
    setCatalogs(
      catalogs?.map((catalog) => ({
        ...catalog,
        entry:
          catalog.entry?.map((e) =>
            e.id === updatedEntry.id ? updatedEntry : e,
          ) ?? [],
      })) ?? null,
    );
  };

  const updateRating = async (rating: number) => {
    if (!selectedEntry) return;
    syncEntryUpdate({ ...selectedEntry, entryRating: rating });
    try {
      await updateEntryRating(selectedEntry.id, rating);
    } catch (error) {
      syncEntryUpdate(selectedEntry); 
    }
  };

  const updateReview = async () => {
    if (!selectedEntry) return;
    syncEntryUpdate({ ...selectedEntry, entryReview });
    try {
      await updateEntryReview(selectedEntry.id, entryReview);
    } catch (error) {
      syncEntryUpdate(selectedEntry);
      console.error("failed to update review: ", error);
    }
  };

  const updateListeningDate = async (newDate: string) => {
    if (!selectedEntry) return;
    syncEntryUpdate({ ...selectedEntry, entryListeningDate: newDate });
    try {
      await updateEntryListeningDate(selectedEntry.id, newDate);
    } catch (error) {
      syncEntryUpdate(selectedEntry);
    }
  };

  const deleteCatalogEntry = async () => {
    if (!selectedEntry) return;

    try {
      await deleteEntry(selectedEntry.id);

      setCatalogs(
        catalogs?.map((catalog) => ({
          ...catalog,
          entry: catalog.entry?.filter((e) => e.id !== selectedEntry.id) ?? [],
        })) ?? null,
      );

      setSelectedCatalog(
        selectedCatalog
          ? {
              ...selectedCatalog,
              entry:
                selectedCatalog.entry?.filter(
                  (e) => e.id !== selectedEntry.id,
                ) ?? [],
            }
          : null,
      );

      setSelectedEntry(null);
    } catch (error) {
      console.error("failed to delete entry: ", error);
    }

    closePopup();
  };

  if (!selectedEntry) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-2/5 p-4 gap-4">
        <h1 className="w-3/4 text-xl text-white/75 text-center">
          Click on an entry to view/edit it&apos;s details. You can add a new
          entry by clicking the &apos;+&apos; button
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-2/5 p-4 gap-8 overflow-y-scroll">
      <div className="entry-header flex flex-row w-full justify-between items-start text-center gap-2 p-4 h-[20rem] items-center mb-4">
        <div className="w-1/2 items-center flex flex-col justify-center gap-2">
          <img
            src={selectedEntry?.entryCoverArt}
            alt="album-cover"
            className="w-72 rounded-xl border-2 h-xs"
          />
          <DatePicker onChange={updateListeningDate} />
        </div>
        <div className="flex flex-col items-center w-1/2 gap-2">
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
        <h1 className="text-xl font-semibold flex flex-row gap-2 items-center">
          Track Ratings
        </h1>
        {selectedEntry && entryTracks && !loading ? (
          <div className="flex flex-col gap-2">
            {entryTracks.map((track: TrackType, index: number) => {
              return <TrackRating key={track.id} track={track} />;
            })}
            <Button
              variant={"destructive"}
              className="h-12 text-xl w-full"
              onClick={() =>
                setPopup(
                  <ConfirmDeletePopup
                    onSubmit={deleteCatalogEntry}
                    onClose={closePopup}
                    item={"entry"}
                  />,
                )
              }
            >
              Delete Catalog
            </Button>
          </div>
        ) : (
          <div className="flex justify-center scale-200">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
