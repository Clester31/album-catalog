"use client";
import { TrackType } from "@/lib/types/types";
import { formatSeconds, ratingColors } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { updateTrackRating, updateTrackReview } from "@/lib/actions/actions";
import { Textarea } from "../ui/textarea";

export default function TrackRating({ track }: { track: TrackType }) {
  const [showReview, setShowReview] = useState<boolean>(false);
  const [editReview, setEditReview] = useState<boolean>(false);
  const [trackRating, setTrackRating] = useState<number>(track.trackRating);
  const [trackReview, setTrackReview] = useState<string>(track.trackReview);
  const [newReview, setNewReview] = useState<string>("");

  const updateRating = async (rating: number) => {
    if (!track) return;

    setTrackRating(rating);

    try {
      await updateTrackRating(String(track.id), rating);
    } catch (error) {
      setTrackRating(trackRating);
      console.error("failed to update track rating: ", error);
    }
  };

  const updateReview = async () => {
    if (!track) return;

    setTrackReview(newReview);

    try {
      await updateTrackReview(String(track.id), newReview);
      setEditReview(false);
    } catch (error) {
      setTrackReview(trackReview);
      console.error("failed to update track review: ", error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="track-info flex flex-row bg-card border-2 border-accent p-2 justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          {!showReview ? (
            <i
              className="fa-solid fa-caret-down cursor-pointer hover:text-white/50 transition 150 ease-in-out"
              onClick={() => setShowReview(true)}
            ></i>
          ) : (
            <i
              className="fa-solid fa-caret-up cursor-pointer hover:text-white/50 transition 150 ease-in-out"
              onClick={() => setShowReview(false)}
            ></i>
          )}
          <h1>{track.trackTitle}</h1>
        </div>
        <div className="flex flex-row items-center gap-2">
          <p>{formatSeconds(track.trackDuration)}</p>
          <Card className="w-16 h-4 flex justify-center text-6xl">
            <CardContent className="relative flex items-center justify-center">
              <div
                className="absolute w-8 h-4 rounded-full blur-xl"
                style={{
                  background:
                    trackRating !== undefined
                      ? ratingColors[trackRating]
                      : undefined,
                  opacity: 0.75,
                }}
              />
              <h1
                className="relative text-xl"
                style={{
                  textShadow: `0 0 10px ${trackRating !== undefined ? ratingColors[trackRating] : "white"}`,
                  color: `${trackRating === 0 ? "gray" : "white"}`,
                }}
              >
                {trackRating}
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
        </div>
      </div>
      {showReview && (
        <div className="track-review p-2 flex flex-col gap-2">
          <div>
            {!editReview ? (
              <Button variant={"outline"} onClick={() => setEditReview(true)}>
                Edit Review
              </Button>
            ) : (
              <div className="flex flex-row gap-2 items-center">
                <Button
                  variant={"default"}
                  onClick={() => updateReview()}
                >
                  Update
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={() => setEditReview(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          {!editReview ? (
            <div className="bg-card border-accent border-2 rounded-xl p-4 h-32 cursor-pointer hover:border-white/50 transition-colors">
              {trackReview}
            </div>
          ) : (
            <Textarea
              className="w-full h-32 overflow-y-scroll resize-none"
              maxLength={500}
              placeholder="max length: 500 characters"
              defaultValue={track.trackReview}
              onChange={(e) => setNewReview(e.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );
}
