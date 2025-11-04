import { JSX } from "react";
import { Button } from "../components/ui/button";

export default function NotFound(): JSX.Element {
  return (
    <div className="mx-auto text-center max-w-[450px] mt-10 flex flex-col items-center justify-center">
      <h2 className="text-fade-grad font-clash text-4xl font-semibold">Not found</h2>
      <p className="mt-4 text-pretty font-mono text-sm text-foreground">
        Whatever you were looking for, is simply not here. <br />
        <i>Have you tried looking under the bed?</i>
      </p>
      <Button variant="outline" size="lg" asChild className="mt-10">
        <a href="/">Feeling lucky ✨</a>
      </Button>
    </div>
  )
}

