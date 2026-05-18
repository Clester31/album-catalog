"use client";

import { useAppContext } from "@/lib/context/AppContext";
import { Button } from "../ui/button";
import NewCatalogPopup from "../popup/NewCatalogPopup";
import { createNewCatalog, getAllUserCatalogs } from "@/lib/actions/actions";
import { useEffect, useState } from "react";
import { CatalogType } from "@/lib/types/types";
import CatalogSidebarItem from "../catalog/CatalogSidebarItem";
import { Spinner } from "../ui/spinner";
import { Show, useUser } from "@clerk/nextjs";

export default function Sidebar() {
  const { setPopup, closePopup, catalogs, setCatalogs, setSelectedCatalog } =
    useAppContext();
  const [loading, setLoading] = useState<boolean>(false);

  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const fetchAllUserCatalogs = async () => {
      if (!isLoaded || !isSignedIn) return;

      setLoading(true);
      const data = await getAllUserCatalogs();
      setCatalogs(data);
      setLoading(false);
    };

    fetchAllUserCatalogs();
  }, [isLoaded, isSignedIn, setCatalogs]);

  const handleSubmit = async (
    name: string,
    description: string,
    color: string,
  ) => {
    const newCatalog = await createNewCatalog(name, description, color);
    setCatalogs(catalogs ? [...catalogs, newCatalog] : [newCatalog]);
    closePopup();
  };

  const handleSelectCatalog = (catalog: CatalogType) => {
    setSelectedCatalog(catalog);
    console.log(catalog);
  };

  return (
    <Show when={"signed-in"}>
      <div className="flex flex-col bg-primary-foreground border-r-2 border-r-accent w-64 h-[calc(100vh-3rem)] p-4 gap-4">
        <Button
          variant={"default"}
          onClick={() => {
            setPopup(
              <NewCatalogPopup
                onSubmit={handleSubmit}
                onClose={closePopup}
                type="new"
              />,
            );
          }}
        >
          <h1>+ New Catalog</h1>
        </Button>
        <div className="catalog-list flex flex-col gap-2">
          <h1 className="font-semibold">Catalogs</h1>
          {!loading && catalogs ? (
            catalogs.length > 0 ? (
              catalogs.map((catalog: CatalogType, index: number) => {
                return (
                  <CatalogSidebarItem
                    key={index}
                    catalog={catalog}
                    onSelect={handleSelectCatalog}
                  />
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                No catalogs
              </p>
            )
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </Show>
  );
}
