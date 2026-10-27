import { createFileRoute } from "@tanstack/react-router";
import { AssessmentsRoute } from "./$";

export const Route = createFileRoute("/simulados")({ component: AssessmentsRoute });
