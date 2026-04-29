import { useState, type FormEvent } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { catalogColors } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

export default function NewCatalogPopup({
  onSubmit,
  onClose,
}: {
  onSubmit: (name: string, description: string, color: string) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await onSubmit(name, description, catalogColors[selectedColor]);
    setLoading(false);
    onClose();
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle>New Catalog</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Catalog Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="My Catalog"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Catalog Description</Label>
              <Textarea
                className="w-lg"
                id="description"
                placeholder="This is my catalog. There are many like it, but this one is mine"
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <div className="grid gap-4 grid-cols-8">
                {catalogColors.map((color: string, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`cursor-pointer rounded-2xl w-full h-5 border-2 hover:border-white transition duration-100 ease-in-out ${index === selectedColor && "border-white/80"}`}
                      style={{ background: color }}
                      onClick={() => setSelectedColor(index)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <CardFooter className="flex flex-col gap-4 items-center justify-center bg-card mt-4">
            <div className="w-full flex flex-row gap-4 items-center justify-center">
              <Button type="submit" className="w-1/2">
                Create
              </Button>
              <Button variant="destructive" className="w-1/2" onClick={onClose}>
                Cancel
              </Button>
            </div>
            {loading && <h1><Spinner /></h1>}
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
