"use client"

import { useAppContext } from "@/lib/context/AppContext";
import { Button } from "../ui/button";
import NewCatalogPopup from "../popup/NewCatalogPopup";

export default function Sidebar() {
  const { setPopup, closePopup } = useAppContext();

  const handleSubmit = async (name: string, description: string) => {
    console.log(name, description)
  }

  return (
    <div className="flex flex-col bg-primary-foreground border-r-2 border-r-accent w-64 h-[calc(100vh-3rem)] p-4">
      <Button
        variant={"default"}
        onClick={() => {
          setPopup(<NewCatalogPopup onSubmit={handleSubmit} onClose={closePopup} />);
        }}
      >
        <h1>+ New Catalog</h1>
      </Button>
      <div className="catalog-list"></div>
    </div>
  );
}
