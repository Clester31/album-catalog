import CatalogDisplay from "@/components/catalog/CatalogDisplay";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <CatalogDisplay />
    </div>
  )
}