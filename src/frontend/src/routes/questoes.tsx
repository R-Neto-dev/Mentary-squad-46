import { createFileRoute } from "@tanstack/react-router";
import { QuestionsRoute } from "./$";

export const Route = createFileRoute("/questoes")({ component: QuestionsRoute });
