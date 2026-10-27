import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  initialQuestions,
  initialAssessments,
  initialSchools,
  initialClasses,
  initialStudents,
  initialPlans,
  initialNotifications,
  initialActivities,
  type Profile,
  type Question,
  type Assessment,
  type School,
  type ClassRoom,
  type Student,
  type Plan,
} from "./data";
type State = {
  authenticated: boolean;
  profile: Profile;
  questions: Question[];
  assessments: Assessment[];
  schools: School[];
  classes: ClassRoom[];
  students: Student[];
  plans: Plan[];
  notifications: typeof initialNotifications;
  activities: typeof initialActivities;
  settings: {
    name: string;
    email: string;
    compact: boolean;
    emailNotifications: boolean;
    year: string;
  };
};
const initial: State = {
  authenticated: false,
  profile: "Professora",
  questions: initialQuestions,
  assessments: initialAssessments,
  schools: initialSchools,
  classes: initialClasses,
  students: initialStudents,
  plans: initialPlans,
  notifications: initialNotifications,
  activities: initialActivities,
  settings: {
    name: "Carla Oliveira",
    email: "carla.oliveira@escola.edu.br",
    compact: false,
    emailNotifications: true,
    year: "5º ano",
  },
};
const Context = createContext<{
  state: State;
  update: (fn: (s: State) => State) => void;
  log: (text: string) => void;
  setProfile: (p: Profile) => void;
  setAuthenticated: (authenticated: boolean) => void;
  ready: boolean;
} | null>(null);
export function MentaryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mentary-demo-v1");
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<State>;
        const wasCoordinator = parsed.profile === "Coordenadora";
        const profile: Profile =
          parsed.profile === "Gestora" || wasCoordinator ? "Gestora" : "Professora";
        setState({
          ...initial,
          ...parsed,
          profile,
          settings: {
            ...initial.settings,
            ...parsed.settings,
            ...(wasCoordinator ? { name: "Mariana Santos" } : {}),
          },
        });
      }
    } catch {
      // Invalid or unavailable saved data should not prevent the demo from loading.
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem("mentary-demo-v1", JSON.stringify(state));
  }, [state, ready]);
  const update = (fn: (s: State) => State) => setState(fn);
  const log = (text: string) =>
    setState((s) => ({
      ...s,
      activities: [{ id: crypto.randomUUID(), text, date: "Agora" }, ...s.activities],
    }));
  const setProfile = (profile: Profile) =>
    setState((s) => ({
      ...s,
      profile,
      settings: {
        ...s.settings,
        name: profile === "Professora" ? "Carla Oliveira" : "Mariana Santos",
      },
    }));
  const setAuthenticated = (authenticated: boolean) => setState((s) => ({ ...s, authenticated }));
  return (
    <Context.Provider value={{ state, update, log, setProfile, setAuthenticated, ready }}>
      {children}
    </Context.Provider>
  );
}
export function useMentary() {
  const c = useContext(Context);
  if (!c) throw new Error("MentaryProvider is required");
  return c;
}
