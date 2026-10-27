import { createFileRoute } from "@tanstack/react-router";
import { NestedWorkspace } from "./$";

export const Route = createFileRoute("/simulados/validador")({ component: NestedWorkspace });
