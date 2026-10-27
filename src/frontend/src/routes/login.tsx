import { createFileRoute } from "@tanstack/react-router";
import { CatchAll } from "./$";

export const Route = createFileRoute("/login")({ component: CatchAll });
