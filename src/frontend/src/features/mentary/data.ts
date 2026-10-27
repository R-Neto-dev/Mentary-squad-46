export type Profile = "Professora" | "Gestora";
export type Question = {
  id: string;
  text: string;
  subject: string;
  year: string;
  skill: string;
  difficulty: string;
  status: string;
  options: string[];
  answer: number;
  reason: string;
  source: string;
  updated: string;
  history: string[];
};
export type Assessment = {
  id: string;
  name: string;
  subject: string;
  year: string;
  classId: string;
  questions: string[];
  status: string;
  date: string;
};
export type School = { id: string; name: string; city: string };
export type ClassRoom = { id: string; name: string; schoolId: string; teacher: string };
export type Student = { id: string; name: string; classId: string; score: number };
export type Plan = {
  id: string;
  title: string;
  skill: string;
  classId: string;
  responsible: string;
  deadline: string;
  strategy: string;
  status: string;
};
export const subjects = ["Matemática", "Língua Portuguesa", "Ciências"];
export const skills = Array.from({ length: 12 }, (_, i) => ({
  id: `EF0${i < 6 ? 5 : 6}${i % 3 === 0 ? "MA" : i % 3 === 1 ? "LP" : "CI"}${String(i + 1).padStart(2, "0")}`,
  name: [
    "Resolver problemas com números naturais",
    "Identificar a ideia central do texto",
    "Relacionar seres vivos e ambiente",
    "Interpretar frações e suas representações",
    "Inferir informações implícitas",
    "Compreender o ciclo da água",
    "Calcular medidas de área e perímetro",
    "Reconhecer os gêneros textuais",
    "Identificar transformações de materiais",
    "Interpretar gráficos e tabelas",
    "Analisar recursos de pontuação",
    "Explorar fontes de energia",
  ][i],
  subject: subjects[i % 3],
  year: i < 6 ? "5º ano" : "6º ano",
  descriptor: `D${i + 1}`,
  score: 48 + i * 3,
}));
const stems = [
  [
    "Em uma biblioteca há 240 livros. Se 3/8 dos livros são de literatura, quantos livros de literatura há na biblioteca?",
    ["60 livros", "80 livros", "90 livros", "120 livros"],
    2,
    "Multiplicamos 240 por 3/8, obtendo 90 livros.",
  ],
  [
    "Leia: “Mesmo com a chuva, Ana pegou seu guarda-chuva e foi à escola.” O que podemos concluir sobre Ana?",
    [
      "Ela desistiu de ir à escola.",
      "Ela se preparou para sair na chuva.",
      "Ela ficou em casa.",
      "Ela esqueceu seu guarda-chuva.",
    ],
    1,
    "O guarda-chuva indica que Ana se preparou para a chuva e manteve sua ida à escola.",
  ],
  [
    "Qual das alternativas descreve corretamente a evaporação no ciclo da água?",
    [
      "Água líquida transformando-se em vapor.",
      "Vapor transformando-se em gelo.",
      "Gelo transformando-se em líquido.",
      "Água infiltrando-se no solo.",
    ],
    0,
    "A evaporação é a passagem da água do estado líquido para o gasoso.",
  ],
  [
    "Uma escola organizou 156 alunos em grupos com 6 integrantes. Quantos grupos foram formados?",
    ["24 grupos", "25 grupos", "26 grupos", "28 grupos"],
    2,
    "Dividindo 156 por 6, obtemos 26 grupos.",
  ],
  [
    "No trecho “O menino correu como o vento”, qual recurso de linguagem é utilizado?",
    ["Comparação", "Onomatopeia", "Ironia", "Antítese"],
    0,
    "A expressão “como o vento” compara a velocidade do menino à do vento.",
  ],
  [
    "Qual ação contribui para a conservação dos recursos naturais?",
    [
      "Descartar resíduos no rio.",
      "Deixar luzes acesas sem necessidade.",
      "Separar materiais para reciclagem.",
      "Queimar o lixo doméstico.",
    ],
    2,
    "A reciclagem permite reaproveitar materiais e reduzir a utilização de recursos naturais.",
  ],
];
export const initialQuestions: Question[] = Array.from({ length: 30 }, (_, i) => {
  const s = stems[i % 6];
  return {
    id: `Q-${String(i + 1).padStart(4, "0")}`,
    text: String(s[0]),
    subject: subjects[i % 3],
    year: i < 15 ? "5º ano" : "6º ano",
    skill: skills[i % 12].id,
    difficulty: ["Fácil", "Média", "Difícil"][Math.floor(i / 3) % 3],
    status:
      i < 21
        ? "Aprovada"
        : i < 25
          ? "Pendente de revisão"
          : i < 27
            ? "Em revisão"
            : i < 29
              ? "Rascunho"
              : "Rejeitada",
    options: s[1] as string[],
    answer: s[2] as number,
    reason: String(s[3]),
    source: i % 2 ? "Cadastro manual" : "Avaliação diagnóstica.pdf",
    updated: "08/10/2026",
    history: [
      "Questão cadastrada em 02/10/2026",
      i < 21 ? "Aprovada por Carla Oliveira" : "Aguardando revisão pedagógica",
    ],
  };
});
export const initialSchools: School[] = [
  { id: "s1", name: "Escola Municipal Monteiro Lobato", city: "São Paulo, SP" },
  { id: "s2", name: "Escola Municipal Paulo Freire", city: "São Paulo, SP" },
  { id: "s3", name: "Escola Municipal Cecília Meireles", city: "São Paulo, SP" },
];
export const initialClasses: ClassRoom[] = Array.from({ length: 6 }, (_, i) => ({
  id: `t${i + 1}`,
  name: `${i % 2 ? "6º" : "5º"} ano ${i < 2 ? "A" : i < 4 ? "B" : "C"}`,
  schoolId: `s${Math.floor(i / 2) + 1}`,
  teacher: i % 2 ? "Lucas Santos" : "Carla Oliveira",
}));
const names = [
  "Ana Clara Silva",
  "Miguel Santos",
  "Helena Oliveira",
  "Arthur Souza",
  "Alice Costa",
  "Davi Pereira",
  "Laura Almeida",
  "Gabriel Lima",
  "Sophia Rodrigues",
  "Pedro Fernandes",
  "Manuela Gomes",
  "Lucas Ribeiro",
  "Isabela Carvalho",
  "Matheus Martins",
  "Valentina Rocha",
  "Bernardo Alves",
  "Julia Nascimento",
  "Rafael Araújo",
  "Maria Eduarda",
  "Gustavo Mendes",
  "Luiza Barbosa",
  "Samuel Dias",
  "Beatriz Teixeira",
  "Enzo Moreira",
];
export const initialStudents: Student[] = names.map((name, i) => ({
  id: `a${i + 1}`,
  name,
  classId: `t${Math.floor(i / 4) + 1}`,
  score: 45 + ((i * 7) % 49),
}));
export const initialAssessments: Assessment[] = [
  "Avaliação diagnóstica · 5º ano",
  "Simulado SAEB · Matemática",
  "Leitura e interpretação",
  "Avaliação bimestral · Ciências",
  "Simulado interdisciplinar",
  "Diagnóstico de aprendizagem · 6º ano",
].map((name, i) => ({
  id: `av${i + 1}`,
  name,
  subject: subjects[i % 3],
  year: i % 2 ? "6º ano" : "5º ano",
  classId: `t${i + 1}`,
  questions: initialQuestions
    .filter((q) => q.subject === subjects[i % 3])
    .slice(0, 6)
    .map((q) => q.id),
  status: [
    "Aplicado",
    "Pronto para aplicação",
    "Em preparação",
    "Aplicado",
    "Rascunho",
    "Aplicado",
  ][i],
  date: `${String(9 - i).padStart(2, "0")}/10/2026`,
}));
export const initialPlans: Plan[] = [
  {
    id: "p1",
    title: "Oficina de resolução de problemas",
    skill: skills[0].id,
    classId: "t1",
    responsible: "Carla Oliveira",
    deadline: "2026-10-30",
    strategy:
      "Trabalhar situações-problema em pequenos grupos com materiais concretos e avaliação formativa semanal.",
    status: "Em andamento",
  },
  {
    id: "p2",
    title: "Leitura compartilhada e inferências",
    skill: skills[1].id,
    classId: "t2",
    responsible: "Lucas Santos",
    deadline: "2026-11-05",
    strategy: "Realizar leitura mediada e discussão de inferências com registros individuais.",
    status: "Planejado",
  },
];
export const initialNotifications = Array.from({ length: 10 }, (_, i) => ({
  id: `n${i}`,
  title: [
    "Questões aguardando sua revisão",
    "Avaliação diagnóstica concluída",
    "Habilidades prioritárias identificadas",
    "Novo relatório de desempenho",
  ][i % 4],
  text: [
    "4 questões importadas precisam de revisão.",
    "Os resultados da turma 5º ano A estão disponíveis.",
    "Confira as oportunidades de recomposição.",
    "Relatório do bimestre disponível para consulta.",
  ][i % 4],
  path: ["/questoes/revisao", "/simulados", "/recomposicao", "/relatorios"][i % 4],
  read: i > 3,
  date: `${i + 1} h atrás`,
}));
export const initialActivities = Array.from({ length: 15 }, (_, i) => ({
  id: `h${i}`,
  text: [
    "Carla Oliveira aprovou uma questão",
    "Avaliação diagnóstica foi atualizada",
    "Beatriz Costa criou um plano de ação",
    "Relatório de turma foi consultado",
    "Questões adicionadas ao banco",
  ][i % 5],
  date: `${i + 1} h atrás`,
}));
export function mean(rows: Student[]) {
  return rows.length ? Math.round(rows.reduce((s, a) => s + a.score, 0) / rows.length) : 0;
}
export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv =
    "\uFEFF" +
    rows
      .map((r) => r.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(";"))
      .join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
