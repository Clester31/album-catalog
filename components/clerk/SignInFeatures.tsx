import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

export default function SignInFeatures() {
  return (
    <div className="flex flex-row space-x-2 items-center">
      <div>
        <i className="fa-solid fa-sun"></i>
      </div>
      <Show when={"signed-out"}>
        <Button asChild variant={"outline"}>
          <SignInButton />
        </Button>
        <Button asChild variant={"default"}>
          <SignUpButton />
        </Button>
      </Show>
      <Show when={"signed-in"}>
        <Button asChild variant={"default"}>
          <UserButton />
        </Button>
      </Show>
    </div>
  );
}
