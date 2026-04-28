"use client";
import { useAppContext } from "@/lib/context/AppContext";

export default function PopupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { popup, closePopup } = useAppContext();
  return (
    <div className="relative w-full">
      {children}
      {popup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40" onClick={closePopup} />
          <div className="z-10">{popup}</div>
        </div>
      )}
    </div>
  );
}
