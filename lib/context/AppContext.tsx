"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { CatalogType, EntryType } from "../types/types";

interface ContextType {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  popup: React.ReactNode | null;
  setPopup: (popup: React.ReactNode | null) => void;
  closePopup: () => void;
  catalogs: CatalogType[] | null
  setCatalogs: (catalogs: CatalogType[] | null) => void;
  selectedCatalog: CatalogType | null;
  setSelectedCatalog: (selectedCatalog: CatalogType | null) => void;
  selectedEntry: EntryType | null
  setSelectedEntry: (selectedEntry: EntryType | null) => void;
}

const AppContext = createContext<ContextType | undefined>(undefined);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [popup, setPopup] = useState<React.ReactNode | null>(null);
  const closePopup = () => setPopup(null);
  const [catalogs, setCatalogs] = useState<CatalogType[] | null>(null);
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogType | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<EntryType | null>(null);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        popup,
        setPopup,
        closePopup,
        catalogs,
        setCatalogs,
        selectedCatalog, 
        setSelectedCatalog,
        selectedEntry,
        setSelectedEntry
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("UseAppContext must be used in a provider");
  }
  return context;
};
