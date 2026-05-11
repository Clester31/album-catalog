/* eslint-disable @next/next/no-img-element */
"use client";

import { CatalogType, EntryType } from "@/lib/types/types";
import { Button } from "../ui/button";
import { useAppContext } from "@/lib/context/AppContext";
import AlbumSearchPopup from "../popup/AlbumSearchPopup";
import { LastFMAlbum } from "@/lib/types/LastFMInfoTypes";
import {
  addCatalogItem,
  deleteUserCatalog,
  getCatalogEntries,
  updateUserCatalog,
} from "@/lib/actions/actions";
import { useEffect } from "react";
import { Spinner } from "../ui/spinner";
import EntryListItem from "../entries/EntryListItem";
import ConfirmDeletePopup from "../popup/ConfirmDeletePopup";
import NewCatalogPopup from "../popup/NewCatalogPopup";
import FullDescriptionPopup from "../popup/FullDescriptionPopup";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function CatalogList({
  selectedCatalog,
}: {
  selectedCatalog: CatalogType | null;
}) {
  const { setPopup, closePopup, catalogs, setCatalogs, setSelectedCatalog } =
    useAppContext();

  useEffect(() => {
    if (!selectedCatalog) return;

    const fetchEntries = async () => {
      const entries = await getCatalogEntries(selectedCatalog.id);
      const updatedCatalog = { ...selectedCatalog, entry: entries };
      setSelectedCatalog(updatedCatalog);
      setCatalogs(
        catalogs?.map((c) =>
          c.id === updatedCatalog.id ? updatedCatalog : c,
        ) ?? [],
      );
    };

    fetchEntries();
  }, []);

  const handleSubmit = async (submittedAlbum: LastFMAlbum) => {
    closePopup();
    setPopup(<Spinner />);
    if (!selectedCatalog) return;
    const newEntry = await addCatalogItem(submittedAlbum, selectedCatalog.id);
    const updatedCatalog: CatalogType = {
      ...selectedCatalog,
      entry: [...(selectedCatalog.entry ?? []), newEntry],
    };
    setSelectedCatalog(updatedCatalog);
    setCatalogs(
      catalogs?.map((c) => (c.id === updatedCatalog.id ? updatedCatalog : c)) ??
        [],
    );
    closePopup();
  };

  const deleteCatalog = async () => {
    if (!selectedCatalog) return;

    const removedEntry = await deleteUserCatalog(selectedCatalog.id);
    setSelectedCatalog(null);
    setCatalogs(catalogs?.filter((c) => c.id !== removedEntry.id) ?? []);

    closePopup();
  };

  const updateCatalog = async (
    newName: string,
    newDescription: string,
    newColor: string,
  ) => {
    if (!selectedCatalog) return;

    const updatedEntry = await updateUserCatalog(
      selectedCatalog.id,
      newName,
      newDescription,
      newColor,
    );
    const updatedCatalog: CatalogType = {
      ...selectedCatalog,
      catalogTitle: updatedEntry.catalogTitle,
      catalogDescription: updatedEntry.catalogDescription,
      catalogColor: updatedEntry.catalogColor,
    };
    setSelectedCatalog(updatedCatalog);
    setCatalogs(
      catalogs?.map((c) => (c.id === updatedCatalog.id ? updatedCatalog : c)) ??
        [],
    );

    closePopup();
  };

  const updateFilter = (type: string) => {
    if (!selectedCatalog) return;

    let sortedEntries = [...(selectedCatalog.entry ?? [])];
    switch (type) {
      case "Earliest Listen":
        sortedEntries.sort(
          (a, b) => new Date(a.entryListeningDate).getTime() - new Date(b.entryListeningDate).getTime(),
        );
        break;
      case "Latest Listen":
        sortedEntries.sort(
          (a, b) => new Date(b.entryListeningDate).getTime() - new Date(a.entryListeningDate).getTime(),
        );
        break;
      case "High to Low":
        sortedEntries.sort(
          (a, b) => Number(b.entryRating) - Number(a.entryRating),
        );
        break;
      case "Low to High":
        sortedEntries.sort(
          (a, b) => Number(a.entryRating) - Number(b.entryRating),
        );
        break;
      case "A-Z":
        sortedEntries.sort((a, b) => a.entryTitle.localeCompare(b.entryTitle));
        break;
      case "Z-A":
        sortedEntries.sort((a, b) => b.entryTitle.localeCompare(a.entryTitle));
        break;
      case "Recently Added":
        sortedEntries.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }
    setSelectedCatalog({ ...selectedCatalog, entry: sortedEntries });
  };

  return (
    <div className="flex flex-col w-3/5 border-r-2 p-4 gap-4">
      <div
        className="catalog-header flex flex-row flex-nowrap items-center gap-4 pb-4"
        style={{ borderBottom: `2px solid ${selectedCatalog?.catalogColor}` }}
      >
        <h1 className="text-4xl font-semibold">
          {selectedCatalog?.catalogTitle}
        </h1>
        <div className="flex flex-row gap-4">
          <Button
            variant={"outline"}
            onClick={() => {
              setPopup(
                <NewCatalogPopup
                  onSubmit={updateCatalog}
                  onClose={closePopup}
                  type="edit"
                />,
              );
            }}
          >
            <i className="fa-solid fa-pencil"></i>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                <i className="fa-solid fa-filter"></i>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Filter Entries</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => updateFilter("Recently Added")}
                >
                  Recently Added
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateFilter("Earliest Listen")}>
                  Earliest Listen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateFilter("Latest Listen")}>
                  Latest Listen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateFilter("High to Low")}>
                  High to Low
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateFilter("Low to High")}>
                  Low to High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateFilter("A-Z")}>
                  A-Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateFilter("Z-A")}>
                  Z-A
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant={"destructive"}
            onClick={() => {
              setPopup(
                <ConfirmDeletePopup
                  onSubmit={() => deleteCatalog()}
                  onClose={closePopup}
                  item={"catalog"}
                />,
              );
            }}
          >
            <i className="fa-solid fa-trash"></i>
          </Button>
        </div>
        <p
          className="text-sm text-muted-foreground bg-muted rounded-md p-2 flex-1 min-w-0 border hover:border-white transition 100 ease-in-out cursor-pointer truncate"
          onClick={() => {
            setPopup(
              <FullDescriptionPopup
                onClose={closePopup}
                description={selectedCatalog?.catalogDescription ?? ""}
              />,
            );
          }}
        >
          {selectedCatalog?.catalogDescription}
        </p>
      </div>
      <div
        className="catalog-entries-list grid gap-4 w-full"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(8rem, 1fr))" }}
      >
        {selectedCatalog?.entry?.map((entry: EntryType, index: number) => (
          <div className="mb-8" key={entry.id}>
            <EntryListItem entry={entry} key={index} />
          </div>
        ))}
        <Button
          variant={"outline"}
          className="new-entry-button w-32 h-32 text-4xl"
          onClick={() =>
            setPopup(
              <AlbumSearchPopup onSubmit={handleSubmit} onClose={closePopup} />,
            )
          }
        >
          +
        </Button>
      </div>
    </div>
  );
}
