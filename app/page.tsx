"use client";

import CatalogDisplay from "@/components/catalog/CatalogDisplay";
import SignInFeatures from "@/components/clerk/SignInFeatures";
import SplashScreen from "@/components/ui/SplashScreen";
import { useAppContext } from "@/lib/context/AppContext";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  const { selectedCatalog } = useAppContext();
  return (
    <div>
      <Show when="signed-out">
        <SplashScreen />
      </Show>
      <Show when="signed-in">
        {
          !selectedCatalog &&
          (
            <div className="flex flex-col text-center w-[calc(100vw-16rem)] h-[calc(100vh-3rem)] items-center justify-center gap-1 text-white/50 text-xl w-1/4">
              <p>Click on a catalog in the sidebar to view its contents.</p>
              <p>Create a new catalog by clicking the "+ New Catalog" button on the sidebar</p>
            </div>
          )
        }
        <CatalogDisplay />
      </Show>
    </div>
  );
}
