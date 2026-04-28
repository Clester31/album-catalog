import { useState, type FormEvent } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function NewCatalogPopup({
    onSubmit,
    onClose,
}: {
    onSubmit: (name: string, description: string) => Promise<void>;
    onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await onSubmit(name, description);
    setLoading(false)
    onClose()
  };

  return (
    <Card>
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
          </div>
          <CardFooter className="flex flex-row gap-4 items-center justify-center bg-card">
            <Button type="submit" className="w-1/2">
                Create
            </Button>
            <Button variant="destructive" className="w-1/2" onClick={onClose}>
                Cancel
            </Button>
            {
                loading && <h1>Loading...</h1>
            }
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
