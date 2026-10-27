import { createFileRoute } from "@tanstack/react-router";
import { NestedWorkspace } from "./$";

export const Route = createFileRoute("/simulados/criar")({ component: NestedWorkspace });
