"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface ContextType {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  popup: React.ReactNode | null;
  setPopup: (popup: React.ReactNode | null) => void;
  closePopup: () => void;
}

const AppContext = createContext<ContextType | undefined>(undefined);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [popup, setPopup] = useState<React.ReactNode | null>(null);
  const closePopup = () => setPopup(null);

  return (
    <AppContext.Provider value={{ theme, setTheme, popup, setPopup, closePopup }}>
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
