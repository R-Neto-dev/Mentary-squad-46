import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  LibraryBig,
  ClipboardList,
  Users,
  Target,
  Plus,
  Upload,
  CalendarDays,
  ArrowRight,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  History,
  Sparkles,
  ListChecks,
  LayoutDashboard,
  School,
  TrendingUp,
  FileChartColumn,
  ChartNoAxesCombined,
  type LucideIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useMentary } from "./store";
import { skills, subjects, mean } from "./data";
import { PageHeading, Panel, Metric, Badge, SelectField, Progress, DemoNote, SearchField } from "./ui";

function StudentPerformanceDashboard() {
  const { state } = useMentary();
  const [classId, setClassId] = useState("");
  const [search, setSearch] = useState("");
  const teacherClasses = state.classes.filter((room) => room.teacher === state.settings.name);
  const availableClasses = teacherClasses.length ? teacherClasses : state.classes;
  const visibleClasses = availableClasses.filter((room) => !classId || room.id === classId);
  const students = state.students
    .filter((student) => visibleClasses.some((room) => room.id === student.classId))
    .filter((student) =>
      student.name.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR")),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  const average = mean(students);
  const needsSupport = students.filter((student) => student.score < 60);
  const chartData = students.map((student) => ({
    name: student.name.split(" ")[0],
    score: student.score,
  }));

  return (
    <div className="page">
      <PageHeading
        title="Desempenho por aluno"
        description="Acompanhe os resultados das avaliações e identifique quem precisa de apoio e quais habilidades priorizar."
      >
        <Button asChild>
          <Link to="/recomposicao">
            <Sparkles />
            Planejar recomposição
          </Link>
        </Button>
      </PageHeading>

      <div className="filter-bar">
        <SelectField
          label="Turma"
          value={classId}
          onChange={setClassId}
          all="Todas as minhas turmas"
          options={availableClasses.map((room) => ({ value: room.id, label: room.name }))}
        />
        <SearchField
          value={search}
          onChange={setSearch}
          label="Buscar aluno"
          placeholder="Buscar aluno pelo nome..."
        />
        <span className="ml-auto">
          <DemoNote />
        </span>
      </div>

      <div className="metrics">
        <Metric
          title="Alunos acompanhados"
          value={students.length}
          icon={Users}
          note="Nos filtros selecionados"
        />
        <Metric
          title="Média de acertos"
          value={`${average}%`}
          icon={Target}
          note="Desempenho atual"
        />
        <Metric
          title="Precisam de apoio"
          value={needsSupport.length}
          icon={Sparkles}
          note="Abaixo de 60%"
          tone="warning"
        />
        <Metric
          title="Turmas"
          value={visibleClasses.length}
          icon={School}
          note="Sob sua responsabilidade"
          tone="success"
        />
      </div>

      <div className="analytics-grid">
        <Panel
          title="Resultados por aluno"
          description="Percentual de acertos registrado para cada estudante"
        >
          {chartData.length ? (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 16, right: 12, left: 0, bottom: 4 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 4" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    axisLine={false}
                    tickLine={false}
                    width={42}
                  />
                  <Tooltip formatter={(value: number) => [`${value}%`, "Acertos"]} />
                  <Bar
                    dataKey="score"
                    fill="var(--primary)"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={34}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty">Nenhum aluno encontrado para os filtros selecionados.</div>
          )}
        </Panel>
        <Panel title="Atenção pedagógica" description="Estudantes abaixo da meta de 60%">
          {needsSupport.length ? (
            needsSupport.slice(0, 6).map((student) => (
              <div key={student.id} className="list-item">
                <div className="grow">
                  <div className="flex justify-between gap-3">
                    <strong className="text-sm">{student.name}</strong>
                    <span className="text-warning text-xs font-semibold">{student.score}%</span>
                  </div>
                  <p className="subtext">
                    {state.classes.find((room) => room.id === student.classId)?.name}
                  </p>
                  <Progress value={student.score} tone="warning" />
                </div>
              </div>
            ))
          ) : (
            <div className="empty">Nenhum aluno abaixo de 60% nos filtros atuais.</div>
          )}
        </Panel>
      </div>

      <Panel title="Desempenho individual" description="Resultados atuais por estudante e turma">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ALUNO</th>
                <th>TURMA</th>
                <th>ACERTOS</th>
                <th>ACOMPANHAMENTO</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="table-main">{student.name}</td>
                  <td>{state.classes.find((room) => room.id === student.classId)?.name ?? "—"}</td>
                  <td>{student.score}%</td>
                  <td>
                    <span className={`badge ${student.score < 60 ? "warning" : "success"}`}>
                      {student.score < 60 ? "Precisa de apoio" : "Dentro da meta"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!students.length && (
            <div className="empty">Nenhum aluno encontrado para os filtros selecionados.</div>
          )}
        </div>
      </Panel>
    </div>
  );
}

function AnalyticsDashboard({ mode = "dashboard" }: { mode?: string }) {
  const { state } = useMentary();
  const [school, setSchool] = useState("");
  const [classId, setClass] = useState("");
  const [subject, setSubject] = useState("");
  const [period, setPeriod] = useState("Este bimestre");
  const classes = state.classes.filter((c) => !school || c.schoolId === school);
  const students = state.students.filter(
    (s) => (!classId || s.classId === classId) && classes.some((c) => c.id === s.classId),
  );
  const score = mean(students);
  const assessments = state.assessments.filter(
    (a) =>
      (!classId || a.classId === classId) &&
      (!subject || a.subject === subject) &&
      classes.some((c) => c.id === a.classId),
  );
  const questions = state.questions.filter((q) => !subject || q.subject === subject);
  const factor = period === "Bimestre anterior" ? -7 : period === "Este mês" ? 3 : 0;
  const timeline = ["Mai", "Jun", "Jul", "Ago", "Set", "Out"].map((month, i) => ({
    month,
    atual: Math.max(0, score - 19 + i * 4 + factor),
    anterior: Math.max(0, score - 29 + i * 3),
  }));
  const priorities = skills.filter((s) => (!subject || s.subject === subject) && s.score < 70);
  const isManager = state.profile === "Gestora";
  const chartData = isManager
    ? state.schools
        .filter((s) => !school || s.id === school)
        .map((s) => {
          const schoolClasses = classes.filter(
            (c) => c.schoolId === s.id && (!classId || c.id === classId),
          );
          return {
            name: s.name.replace("Escola Municipal ", ""),
            score:
              mean(
                state.students.filter((student) =>
                  schoolClasses.some((room) => room.id === student.classId),
                ),
              ) + factor,
          };
        })
    : classes
        .filter((c) => !classId || c.id === classId)
        .map((c) => ({
          name: c.name,
          score: mean(state.students.filter((s) => s.classId === c.id)) + factor,
        }));
  const learning = mode === "analise";
  const performance = mode === "desempenho";
  const first = state.settings.name.split(" ")[0];
  return (
    <div className="page">
      <PageHeading
        title={
          learning ? "Análise de aprendizagem" : performance ? "Meu desempenho" : `Olá, ${first}!`
        }
        description={
          learning
            ? "Um olhar integrado sobre a aprendizagem e as oportunidades de evolução."
            : performance
              ? "Acompanhe suas atividades e o desenvolvimento das suas turmas."
              : state.profile === "Gestora"
                ? "Acompanhe os indicadores da rede e fortaleça as decisões pedagógicas."
                : "Cada aprendizagem conta. Acompanhe suas turmas e planeje os próximos passos."
        }
      >
        <Button variant="outline" asChild>
          <Link to="/questoes/importar">
            <Upload />
            Importar questões
          </Link>
        </Button>
        <Button asChild>
          <Link to="/simulados/criar">
            <Plus />
            Criar avaliação
          </Link>
        </Button>
      </PageHeading>
      <div className="filter-bar">
        <CalendarDays size={16} className="text-muted-foreground" />
        <SelectField
          label="Período"
          value={period}
          onChange={setPeriod}
          options={["Este bimestre", "Bimestre anterior", "Este mês"]}
        />
        <span className="h-5 border-l mx-1 hidden sm:block" />
        <SelectField
          label="Escola"
          value={school}
          onChange={(v) => {
            setSchool(v);
            setClass("");
          }}
          all="Todas as escolas"
          options={state.schools.map((s) => ({
            value: s.id,
            label: s.name.replace("Escola Municipal ", ""),
          }))}
        />
        <SelectField
          label="Turma"
          value={classId}
          onChange={setClass}
          all="Todas as turmas"
          options={classes.map((c) => ({ value: c.id, label: c.name }))}
        />
        <SelectField
          label="Área do conhecimento"
          value={subject}
          onChange={setSubject}
          all="Todas as disciplinas"
          options={subjects}
        />
        <span className="ml-auto hidden xl:block">
          <DemoNote />
        </span>
      </div>
      <div className="metrics">
        {isManager ? (
          <>
            <Metric
              title="Escolas"
              value={school ? 1 : state.schools.length}
              icon={School}
              note="Unidades acompanhadas"
            />
            <Metric
              title="Turmas"
              value={classes.length}
              icon={Users}
              note="Grupos no filtro atual"
            />
            <Metric
              title="Alunos"
              value={students.length}
              icon={Users}
              note="Alunos acompanhados"
              tone="success"
            />
            <Metric
              title="Avaliações"
              value={assessments.length}
              icon={ClipboardList}
              note="Avaliações registradas"
              tone="warning"
            />
          </>
        ) : (
          <>
            <Metric
              title={learning || performance ? "Desempenho médio" : "Questões no banco"}
              value={learning || performance ? `${score + factor}%` : questions.length}
              icon={learning || performance ? Target : LibraryBig}
              note={
                learning || performance
                  ? "Média dos alunos selecionados"
                  : `${questions.filter((q) => q.status === "Aprovada").length} aprovadas para utilização`
              }
            />
            <Metric
              title="Avaliações cadastradas"
              value={assessments.length}
              icon={ClipboardList}
              note={`${assessments.filter((a) => a.status === "Aplicado").length} avaliações aplicadas`}
            />
            <Metric
              title="Alunos acompanhados"
              value={students.length}
              icon={Users}
              note={`${classes.length} turmas neste período`}
              tone="success"
            />
            <Metric
              title="Habilidades prioritárias"
              value={priorities.length}
              icon={Target}
              note="Oportunidades de recomposição"
              tone="warning"
            />
          </>
        )}
      </div>
      <div className="analytics-grid">
        <Panel
          title="Evolução da aprendizagem"
          description="Desempenho médio das turmas ao longo do tempo"
          action={
            <span className="badge success">
              <ArrowUpRight size={12} />
              {score ? "+20 p.p." : "0 p.p."}
            </span>
          }
        >
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 15, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.16} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 4" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  dy={8}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  width={44}
                />
                <Tooltip
                  formatter={(v: number) => [`${v}%`]}
                  contentStyle={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
                <Area
                  name="Bimestre anterior"
                  type="monotone"
                  dataKey="anterior"
                  stroke="var(--chart-5)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="transparent"
                />
                <Area
                  name="Bimestre atual"
                  type="monotone"
                  dataKey="atual"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fill="url(#areaPurple)"
                />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: 10, paddingTop: 20 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel
          title={isManager ? "Comparação entre escolas" : "Desempenho por turma"}
          description={
            isManager
              ? "Média de desempenho por unidade escolar"
              : "Média de acertos nas avaliações"
          }
          action={
            <Button variant="ghost" size="icon" asChild aria-label="Ver análise de aprendizagem">
              <Link to="/analise-aprendizagem">
                <ArrowRight />
              </Link>
            </Button>
          }
        >
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 4" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  width={42}
                />
                <Tooltip
                  formatter={(v: number) => [`${v}%`, "Acertos"]}
                  contentStyle={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="score" fill="var(--primary)" radius={[5, 5, 0, 0]} maxBarSize={33} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
      <div className="analytics-grid">
        <Panel
          title="Avaliações recentes"
          description="Suas últimas avaliações e simulados"
          action={
            <Button variant="link" size="sm" asChild>
              <Link to="/simulados">
                Ver todas
                <ArrowRight />
              </Link>
            </Button>
          }
        >
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>AVALIAÇÃO</th>
                  <th>TURMA</th>
                  <th>STATUS</th>
                  <th>DATA</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {assessments.slice(0, 4).map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link to="/simulados" className="table-main">
                        {a.name}
                      </Link>
                      <div className="table-sub">
                        {a.subject} · {a.questions.length} questões
                      </div>
                    </td>
                    <td>{state.classes.find((c) => c.id === a.classId)?.name}</td>
                    <td>
                      <Badge>{a.status}</Badge>
                    </td>
                    <td>{a.date}</td>
                    <td>
                      <Button variant="ghost" size="icon" asChild aria-label={`Abrir ${a.name}`}>
                        <Link to="/simulados">
                          <ChevronRight />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!assessments.length && (
              <div className="empty">Nenhuma avaliação para os filtros selecionados.</div>
            )}
          </div>
        </Panel>
        <Panel
          title="Habilidades prioritárias"
          description="Onde podemos fazer a diferença"
          action={
            <div className="icon-tile warning">
              <Target size={18} />
            </div>
          }
        >
          {priorities.slice(0, 3).map((s) => (
            <Link key={s.id} to="/habilidades" className="list-item">
              <div className="grow">
                <div className="flex justify-between gap-3">
                  <span className="badge">{s.id}</span>
                  <span className="text-warning text-xs font-semibold">{s.score}%</span>
                </div>
                <p className="subtext mb-2">{s.name}</p>
                <Progress value={s.score} tone="warning" />
              </div>
              <ChevronRight size={15} className="text-muted-foreground" />
            </Link>
          ))}
          <div className="px-5 py-3">
            <Button variant="link" size="sm" asChild>
              <Link to="/recomposicao">
                Planejar recomposição
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </Panel>
      </div>
      <div className="grid-two">
        <Panel
          title={learning ? "Principais insights" : "Seu próximo passo"}
          description="Apoio ao planejamento pedagógico"
        >
          <div className="px-6 pb-6">
            <div className="notice">
              <Target size={19} />
              <div>
                <h3>
                  {score < 75
                    ? "Fortaleça as habilidades de resolução de problemas"
                    : "Sua turma está avançando"}
                </h3>
                <p className="mt-1">
                  {students.filter((a) => a.score < 60).length} alunos apresentam média inferior a
                  60%. Priorize acompanhamento em pequenos grupos e atividades de recomposição.
                </p>
                <Button variant="link" size="sm" asChild className="px-0 mt-2">
                  <Link to="/recomposicao">
                    Ver planos de ação
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Panel>
        <Panel
          title="Atividades recentes"
          action={
            <Button variant="link" size="sm" asChild>
              <Link to="/atividades">
                Ver histórico
                <ArrowRight />
              </Link>
            </Button>
          }
        >
          {state.activities.slice(0, 3).map((a, i) => (
            <div key={a.id} className="list-item">
              <div className="icon-tile !w-8 !h-8">
                {i % 2 ? <Clock3 size={15} /> : <CheckCircle2 size={15} />}
              </div>
              <div className="grow">
                <p className="text-xs">{a.text}</p>
                <p className="subtext">{a.date}</p>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

export function Dashboard({ mode = "dashboard" }: { mode?: string }) {
  if (mode === "dashboard") return <DashboardHome />;
  if (mode === "desempenho") return <StudentPerformanceDashboard />;
  return <AnalyticsDashboard mode={mode} />;
}

export function DashboardHome() {
  const { state } = useMentary();
  const firstName = state.settings.name.split(" ")[0];
  const isManager = state.profile === "Gestora";
  const appliedAssessments = state.assessments.filter(
    (assessment) => assessment.status === "Aplicado",
  ).length;
  const pendingQuestions = state.questions.filter((question) =>
    ["Pendente de revisão", "Em revisão"].includes(question.status),
  ).length;
  const managerMetrics = [
    { label: "Escolas", value: state.schools.length },
    { label: "Turmas", value: state.classes.length },
    { label: "Alunos", value: state.students.length },
    { label: "Avaliações", value: state.assessments.length },
  ];
  const teacherMetrics = [
    { label: "Questões", value: state.questions.length },
    { label: "Simulados", value: state.assessments.length },
    { label: "Aplicadas", value: appliedAssessments },
    { label: "Em revisão", value: pendingQuestions },
  ];
  const features: {
    title: string;
    description: string;
    path: string;
    icon: LucideIcon;
    metrics?: typeof teacherMetrics;
  }[] = isManager
    ? [
        {
          title: "Visão geral da rede",
          description: "Consulte escolas, turmas, estudantes e avaliações registradas no ambiente.",
          path: "/dashboard",
          icon: LayoutDashboard,
          metrics: managerMetrics,
        },
        {
          title: "Escolas e unidades",
          description: "Cadastre unidades e acompanhe os resultados registrados em cada escola.",
          path: "/escolas",
          icon: School,
        },
        {
          title: "Alunos e turmas",
          description: "Consulte as turmas e os estudantes associados às unidades da rede.",
          path: "/turmas",
          icon: Users,
        },
        {
          title: "Avaliações da rede",
          description: "Consulte avaliações e simulados registrados para apoiar a leitura dos resultados.",
          path: "/simulados",
          icon: ClipboardList,
        },
        {
          title: "Desempenho comparativo",
          description: "Acompanhe os indicadores da rede e compare os resultados das avaliações.",
          path: "/analise-aprendizagem",
          icon: ChartNoAxesCombined,
        },
        {
          title: "Comparação entre escolas",
          description:
            "Compare médias, percentuais de acerto e resultados por escola, turma, disciplina e período.",
          path: "/escolas",
          icon: School,
        },
        {
          title: "Habilidades e descritores críticos",
          description:
            "Identifique descritores BNCC/SAEB com menor desempenho e as turmas que precisam de atenção.",
          path: "/habilidades",
          icon: Target,
        },
        {
          title: "Evolução dos resultados",
          description:
            "Acompanhe a evolução das escolas e turmas entre avaliações e períodos letivos.",
          path: "/analise-aprendizagem",
          icon: TrendingUp,
        },
        {
          title: "Relatórios estratégicos",
          description: "Gere relatórios consolidados por escola, turma, habilidade e avaliação.",
          path: "/relatorios",
          icon: FileChartColumn,
        },
        {
          title: "Monitoramento da recomposição",
          description:
            "Acompanhe planos, ações registradas e resultados após as intervenções.",
          path: "/recomposicao",
          icon: ListChecks,
        },
        {
          title: "Histórico de atividades",
          description: "Consulte os registros demonstrativos de atividades e alterações no ambiente.",
          path: "/atividades",
          icon: History,
        },
      ]
    : [
        {
          title: "Extração e revisão de questões",
          description:
            "Envie PDFs e imagens para extrair enunciados, alternativas e gabaritos, depois revise as questões.",
          path: "/questoes/importar",
          icon: Upload,
        },
        {
          title: "Visão geral",
          description:
            "Questões cadastradas, simulados criados, avaliações aplicadas e questões aguardando revisão.",
          path: "/dashboard",
          icon: LayoutDashboard,
          metrics: teacherMetrics,
        },
        {
          title: "Minhas turmas",
          description: "Consulte suas turmas, disciplinas, séries e estudantes vinculados.",
          path: "/turmas",
          icon: School,
        },
        {
          title: "Avaliações e simulados",
          description: "Organize avaliações, acompanhe aplicações e monte novos simulados.",
          path: "/simulados",
          icon: ClipboardList,
        },
        {
          title: "Banco de questões",
          description:
            "Pesquise, filtre, edite e organize questões por disciplina, habilidade BNCC/SAEB e dificuldade.",
          path: "/questoes",
          icon: LibraryBig,
        },
        {
          title: "Habilidades BNCC/SAEB",
          description: "Consulte descritores, revise classificações e identifique habilidades prioritárias.",
          path: "/habilidades",
          icon: Target,
        },
        {
          title: "Construtor de simulados",
          description:
            "Selecione questões, defina quantidades e monte avaliações alinhadas às habilidades desejadas.",
          path: "/simulados/criar",
          icon: ClipboardList,
        },
        {
          title: "Desempenho dos alunos",
          description:
            "Visualize médias, percentuais de acertos, evolução e habilidades com maior dificuldade por turma e aluno.",
          path: "/meu-desempenho",
          icon: ChartNoAxesCombined,
        },
        {
          title: "Recomendações da IA",
          description:
            "Encontre sugestões de exercícios e atividades de recomposição com base nas lacunas identificadas.",
          path: "/recomposicao",
          icon: Sparkles,
        },
        {
          title: "Relatórios pedagógicos",
          description: "Gere análises individuais e por turma, com habilidades críticas e recomendações.",
          path: "/relatorios",
          icon: FileChartColumn,
        },
      ];

  return (
    <div className="page dashboard-home">
      <PageHeading
        title={`Olá, ${firstName}!`}
        description={
          isManager
            ? "Tenha uma visão consolidada da rede escolar, compare resultados e identifique onde é necessário intervir."
            : "O foco é facilitar a criação de avaliações, a organização das questões e a identificação das dificuldades dos alunos."
        }
      />
      <section className="dashboard-features" aria-label="Funcionalidades do perfil">
        <div className="dashboard-features-heading">
          <span>{isManager ? "DASHBOARD DO GESTOR" : "DASHBOARD DO PROFESSOR"}</span>
          <h2>{isManager ? "Acompanhe sua rede escolar" : "Organize sua rotina pedagógica"}</h2>
        </div>
        <div className="dashboard-feature-grid">
          {features.map(({ title, description, path, icon: Icon, metrics }, index) => (
            <Link className="dashboard-feature-card" to={path} key={title}>
              <span className="dashboard-feature-icon">
                <Icon size={22} />
              </span>
              <span className="dashboard-feature-number">{String(index + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <small>{description}</small>
              {metrics && (
                <span className="dashboard-overview-metrics">
                  {metrics.map((metric) => (
                    <span key={metric.label}>
                      <strong>{metric.value}</strong>
                      <small>{metric.label}</small>
                    </span>
                  ))}
                </span>
              )}
              <span className="dashboard-feature-link">
                {metrics ? "Ver indicadores" : "Acessar funcionalidade"}
                <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
