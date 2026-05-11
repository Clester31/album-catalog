import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function ConfirmDeletePopup({
  onClose,
  description,
}: {
  onClose: () => void;
  description: string;
}) {
  return (
    <Card className="max-w-1/2 items-center justify-center m-auto">
      <CardHeader className="text-center w-lg">
        <CardTitle>Desciption</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center w-full">
        <p className="text-md text-muted-foreground text-center">
          {description}
        </p>
        <Button variant={"outline"} onClick={onClose}>
          Close
        </Button>
      </CardContent>
    </Card>
  );
}
