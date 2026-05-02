"use client";
import { useAppContext } from "@/lib/context/AppContext";
import CatalogList from "./CatalogList";
import CatalogEntry from "../entries/CatalogEntry";

export default function CatalogDisplay() {
  const { selectedCatalog } = useAppContext();
  return (
    <div>
      {selectedCatalog && (
        <div className="flex flex-row bg-accent/20 w-[calc(100vw-16rem)] h-[calc(100vh-3rem)]">
          <CatalogList selectedCatalog={selectedCatalog} />
          <CatalogEntry />
        </div>
      )}
    </div>
  );
}
