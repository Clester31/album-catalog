import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function ConfirmDeletePopup({
    onSubmit,
    onClose,
    item,
}: {
    onSubmit: () => Promise<void>;
    onClose: () => void
    item: string;
}) {
  return (
    <Card>
      <CardHeader className="text-center w-lg">
        <CardTitle>Delete {item}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center w-full">
        <h1 className="text-md">Are you sure you want to delete this {item}?</h1>
        <div className="flex flex-row w-full gap-2 items-center justify-center">
            <Button variant={"destructive"} className="w-1/2" onClick={onSubmit}>Yes</Button>
            <Button variant={"outline"} className="w-1/2" onClick={onClose}>No</Button>
        </div>
      </CardContent>
    </Card>
  );
}
