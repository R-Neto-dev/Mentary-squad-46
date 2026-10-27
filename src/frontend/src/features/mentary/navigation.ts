import {
  BookOpenCheck,
  ChartNoAxesColumnIncreasing,
  ChartNoAxesCombined,
  ClipboardList,
  CircleHelp,
  FileChartColumn,
  FileSearch,
  GraduationCap,
  History,
  LayoutDashboard,
  School,
  Settings,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import type { Profile } from "./data";

export const teacherNavGroups = [
  {
    label: "FUNCIONALIDADES DO PROFESSOR",
    items: [
      { title: "Visão geral", path: "/dashboard", icon: LayoutDashboard },
      { title: "Minhas turmas", path: "/turmas", icon: School },
      { title: "Alunos", path: "/meu-desempenho", icon: Users },
      { title: "Avaliações e simulados", path: "/simulados", icon: ClipboardList },
      { title: "Banco de questões", path: "/questoes", icon: BookOpenCheck },
      { title: "Extração e revisão de questões", path: "/questoes/importar", icon: FileSearch },
      { title: "Habilidades BNCC/SAEB", path: "/habilidades", icon: GraduationCap },
      { title: "Desempenho", path: "/analise-aprendizagem", icon: ChartNoAxesColumnIncreasing },
      { title: "Recomposição da aprendizagem", path: "/recomposicao", icon: Sparkles },
      { title: "Relatórios", path: "/relatorios", icon: FileChartColumn },
    ],
  },
  {
    label: "SISTEMA",
    items: [
      { title: "Histórico de atividades", path: "/atividades", icon: History },
      { title: "Configurações", path: "/configuracoes", icon: Settings },
      { title: "Ajuda", path: "/ajuda", icon: CircleHelp },
    ],
  },
];

export const managerNavGroups = [
  {
    label: "FUNCIONALIDADES DO GESTOR",
    items: [
      { title: "Visão geral da rede", path: "/dashboard", icon: LayoutDashboard },
      { title: "Escolas e unidades", path: "/escolas", icon: School },
      { title: "Alunos e turmas", path: "/turmas", icon: Users },
      { title: "Avaliações da rede", path: "/simulados", icon: ClipboardList },
      {
        title: "Desempenho comparativo",
        path: "/analise-aprendizagem",
        icon: ChartNoAxesCombined,
      },
      {
        title: "Habilidades e descritores críticos",
        path: "/habilidades",
        icon: Target,
      },
      { title: "Recomposição da aprendizagem", path: "/recomposicao", icon: BookOpenCheck },
      { title: "Relatórios estratégicos", path: "/relatorios", icon: FileChartColumn },
      { title: "Histórico de atividades", path: "/atividades", icon: History },
    ],
  },
  {
    label: "ADMINISTRAÇÃO DA REDE",
    items: [
      { title: "Configurações da rede", path: "/configuracoes", icon: Settings },
      { title: "Ajuda", path: "/ajuda", icon: CircleHelp },
    ],
  },
];

export function getNavGroups(profile: Profile) {
  return profile === "Gestora" ? managerNavGroups : teacherNavGroups;
}

export const allNav = [...teacherNavGroups, ...managerNavGroups].flatMap((group) => group.items);
