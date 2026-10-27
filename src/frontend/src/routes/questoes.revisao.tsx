import { createFileRoute } from "@tanstack/react-router";
import { NestedWorkspace } from "./$";

export const Route = createFileRoute("/questoes/revisao")({ component: NestedWorkspace });
