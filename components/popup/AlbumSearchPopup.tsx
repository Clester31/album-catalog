"use client";

import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { getLastFMSearchResults } from "@/lib/actions/actions";
import {
  LastFMAlbum,
  LastFMTopAlbumsResponse,
} from "@/lib/types/LastFMInfoTypes";
import AlbumSearchResult from "../search/AlbumSearchResult";

export default function AlbumSearchPopup({
  onSubmit,
  onClose,
}: {
  onSubmit: (submittedAlbum: LastFMAlbum) => Promise<void>;
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<LastFMTopAlbumsResponse>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    const results = await getLastFMSearchResults(searchQuery);
    setSearchResults(results);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader className="text-center w-lg">
        <CardTitle>Search for an artist</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-2">
              <Input
                id="artist-search"
                type="text"
                placeholder="Weezer"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
                minLength={1}
              />
              <Button
                type="submit"
                variant="default"
                disabled={!searchQuery.trim()}
              >
                Search
              </Button>
            </div>
          </div>
        </form>
        <div className="h-96 bg-accent/75 border p-2 rounded-xl overflow-y-scroll overflow-x-hidden">
          {!searchResults ? (
            !loading ? (
              <h1 className="flex text-center justify-center items-center h-full text-lg text-white/50">
                Search results will appear here
              </h1>
            ) : (
              <div className="flex w-full h-full justify-center items-center">
                <Spinner className="w-8 h-8" />
              </div>
            )
          ) : (
            !loading && (
              <div className="flex flex-col gap-2">
                {searchResults.topalbums.album.map(
                  (album: LastFMAlbum, index: number) => {
                    return (
                      <div key={index} className="flex flex-row items-center bg-card/50 px-2 rounded-xl border">
                        <AlbumSearchResult key={index} album={album} />
                        <Button
                          type="button"
                          className="w-16 h-16 text-2xl bg-constructive/10 text-constructive hover:bg-constructive/20"
                          onClick={() => onSubmit(album)}
                        >
                          +
                        </Button>
                      </div>
                    );
                  },
                )}
              </div>
            )
          )}
        </div>
        <CardFooter className="flex flex-row gap-4 items-center justify-center bg-card">
          <Button
            type="button"
            variant="destructive"
            className="w-1/2"
            onClick={onClose}
          >
            Cancel
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
