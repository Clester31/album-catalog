/* eslint-disable @next/next/no-img-element */
"use client";

import { CatalogType, EntryType } from "@/lib/types/types";
import { Button } from "../ui/button";
import { useAppContext } from "@/lib/context/AppContext";
import AlbumSearchPopup from "../popup/AlbumSearchPopup";
import { LastFMAlbum } from "@/lib/types/LastFMInfoTypes";
import { addCatalogItem, getCatalogEntries } from "@/lib/actions/actions";
import { useEffect } from "react";
import { Spinner } from "../ui/spinner";
import EntryListItem from "../entries/EntryListItem";

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

  return (
    <div className="flex flex-col w-3/5 border-r-2 p-4 gap-4">
      <div
        className="catalog-header flex flex-row items-center gap-4 pb-4"
        style={{ borderBottom: `2px solid ${selectedCatalog?.catalogColor}` }}
      >
        <h1 className="text-4xl font-semibold">
          {selectedCatalog?.catalogTitle}
        </h1>
        <Button variant={"outline"}>
          <i className="fa-solid fa-pencil"></i>
        </Button>
      </div>
      <div className="catalog-entries-list grid grid-cols-7 gap-4 justify-center mx-auto">
        {selectedCatalog?.entry?.map((entry: EntryType, index: number) => (
          <EntryListItem entry={entry} key={index} />
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
