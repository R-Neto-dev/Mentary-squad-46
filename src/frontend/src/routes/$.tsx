import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useMentary } from "@/features/mentary/store";
import classroom from "@/assets/classroom.jpg";
import { AppShell } from "@/features/mentary/shell";
import { Dashboard } from "@/features/mentary/dashboard";
import { QuestionBank } from "@/features/mentary/questions";
import { Assessments, AssessmentBuilder, Validator } from "@/features/mentary/assessments";
import {
  subjects,
  skills,
  mean,
  downloadCsv,
  type Plan,
  type School,
  type ClassRoom,
  type Student,
} from "@/features/mentary/data";
import {
  PageHeading,
  Panel,
  Metric,
  Badge,
  Modal,
  SearchField,
  SelectField,
  Empty,
  Progress,
  DemoNote,
} from "@/features/mentary/ui";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  Bell,
  BookOpenCheck,
  ChevronRight,
  ClipboardList,
  CheckCircle2,
  FileChartColumn,
  FileText,
  GraduationCap,
  Plus,
  Printer,
  School as SchoolIcon,
  Settings,
  ShieldCheck,
  Sprout,
  Target,
  Trash2,
  Upload,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/$")({ component: CatchAll });

export function CatchAll() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <PlatformEntry path={path} />
  );
}

function PlatformEntry({ path }: { path: string }) {
  const { state, ready } = useMentary();
  if (path === "/login") return <DemoLogin />;
  if (!ready) return <div className="session-loading">Carregando plataforma…</div>;
  if (!state.authenticated) return <DemoLogin />;
  return (
    <AppShell>
      <Workspace path={path} />
    </AppShell>
  );
}

function DemoLogin() {
  const { setProfile, setAuthenticated } = useMentary();
  const navigate = useNavigate();
  const [profile, setSelected] = useState<"Professora" | "Gestora">("Professora");
  const [step, setStep] = useState<"role" | "credentials">("role");
  const [recoveringPassword, setRecoveringPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const enter = (e: FormEvent) => {
    e.preventDefault();
    setProfile(profile);
    setAuthenticated(true);
    toast.success(`Acesso demonstrativo como ${profile.toLowerCase()} liberado`);
    navigate({ to: profile === "Gestora" ? "/analise-aprendizagem" : "/questoes/importar" });
  };
  const requestPasswordRecovery = (e: FormEvent) => {
    e.preventDefault();
    toast.info("Ambiente demonstrativo: o envio real de e-mail não está habilitado.");
  };
  return (
    <main className="login-page login-reference">
      <header className="login-nav">
        <Link to="/" className="login-brand">
          <img src="/marca_mentary_horizontal.webp" alt="Mentary" />
        </Link>
        <nav aria-label="Navegação principal">
          <Link to="/">Início</Link>
        </nav>
      </header>
      <section
        className={`login-content ${step === "role" ? "login-content-role" : "login-content-credentials"} ${recoveringPassword ? "login-content-recovery" : ""}`}
      >
        <div className="login-role" hidden={step !== "role"}>
          <span className="login-role-eyebrow">MENTARY · ACESSO À PLATAFORMA</span>
          <h1>Selecione o seu cargo</h1>
          <p>Clique na opção que indica o seu cargo e siga para tela de acesso.</p>
          <div className="login-role-options">
            {(
              [
                {
                  value: "Professora",
                  label: "Professor(a)",
                  icon: <GraduationCap size={104} strokeWidth={2.4} />,
                },
                {
                  value: "Gestora",
                  label: "Gestor(a)",
                  icon: <Settings size={104} strokeWidth={2.4} />,
                },
              ] as const
            ).map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => {
                  setSelected(p.value);
                  setStep("credentials");
                }}
                className="login-role-option"
              >
                <span className="login-role-icon">{p.icon}</span>
                <span className="login-role-copy">
                  <strong>{p.value === "Professora" ? "Sou professor" : "Sou gestor"}</strong>
                  <small>
                    {p.value === "Professora"
                      ? "Organize suas turmas e acompanhe a aprendizagem."
                      : "Acompanhe sua rede e planeje ações pedagógicas."}
                  </small>
                </span>
              </button>
            ))}
          </div>
          <Link to="/" className="login-role-back">
            Voltar
          </Link>
        </div>
        <div className="login-credentials" hidden={step !== "credentials" || recoveringPassword}>
          <div className="login-intro">
            <Link to="/" className="login-credentials-brand">
              <img src="/marca_mentary_horizontal.webp" alt="Mentary" />
              <span>INTELIGÊNCIA EDUCACIONAL</span>
            </Link>
            <h1>Seja bem-vindo, {profile === "Professora" ? "professor(a)" : "gestor(a)"}</h1>
            <p>Acesse seu espaço de trabalho e acompanhe as próximas decisões pedagógicas.</p>
            <div className="login-benefits" aria-label="Recursos da plataforma">
              <span>
                <CheckCircle2 size={16} /> Dados de aprendizagem em um só lugar
              </span>
              <span>
                <CheckCircle2 size={16} /> Ferramentas para apoiar sua rotina
              </span>
            </div>
          </div>
          <form className="login-card" onSubmit={enter}>
            <label className="field">
              E-mail de acesso*
              <input
                className="control"
                type="email"
                placeholder="Digite o seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="field">
              Senha*
              <input
                className="control"
                type="password"
                placeholder="Digite a sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
              />
            </label>
            <div className="login-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />{" "}
                <span>Lembrar senha</span>
              </label>
              <button
                type="button"
                className="login-forgot"
                onClick={() => setRecoveringPassword(true)}
              >
                Esqueceu sua senha?
              </button>
            </div>
            <Button type="submit" className="w-full login-submit" size="lg">
              Acessar
            </Button>
            <button type="button" className="login-back" onClick={() => setStep("role")}>
              Voltar
            </button>
          </form>
          <p className="login-disclaimer">
            Ambiente demonstrativo · Os dados são fictícios e ficam salvos somente neste navegador.
          </p>
        </div>
        <div className="login-recovery" hidden={!recoveringPassword}>
          <Link to="/" className="login-credentials-brand">
            <img src="/marca_mentary_horizontal.webp" alt="Mentary" />
            <span>INTELIGÊNCIA EDUCACIONAL</span>
          </Link>
          <div className="login-recovery-card">
            <h1>Recuperar senha</h1>
            <p>Informe seu e-mail de acesso para solicitar a recuperação da senha.</p>
            <form onSubmit={requestPasswordRecovery}>
              <label className="field">
                E-mail de acesso*
                <input
                  className="control"
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <Button type="submit" className="w-full login-submit" size="lg">
                Enviar instruções
              </Button>
              <button
                type="button"
                className="login-back"
                onClick={() => setRecoveringPassword(false)}
              >
                Voltar para o login
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function Workspace({ path }: { path: string }) {
  if (path === "/dashboard") return <Dashboard />;
  if (path === "/meu-desempenho") return <Dashboard mode="desempenho" />;
  if (path === "/analise-aprendizagem") return <Dashboard mode="analise" />;
  if (path === "/questoes") return <QuestionBank />;
  if (path === "/questoes/revisao") return <QuestionBank review />;
  if (path === "/questoes/importar") return <ImportQuestions />;
  if (path === "/simulados") return <Assessments />;
  if (path === "/simulados/criar") return <AssessmentBuilder />;
  if (path === "/simulados/validador") return <Validator />;
  if (path === "/habilidades") return <SkillsPage />;
  if (path === "/recomposicao") return <PlansPage />;
  if (path === "/turmas") return <ClassesPage />;
  if (path === "/escolas") return <SchoolsPage />;
  if (path === "/relatorios") return <ReportsPage />;
  if (path === "/atividades") return <ActivitiesPage />;
  if (path === "/notificacoes") return <NotificationsPage />;
  if (path === "/configuracoes") return <SettingsPage />;
  if (path === "/ajuda") return <HelpPage />;
  return <Dashboard />;
}

function ImportQuestions() {
  const { state, update, log } = useMentary();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [review, setReview] = useState(false);
  const [text, setText] = useState(
    "Uma escola tem 36 estudantes divididos igualmente em 4 grupos. Quantos estudantes há em cada grupo?",
  );
  const [subject, setSubject] = useState("Matemática");
  const [year, setYear] = useState("5º ano");
  const selectFile = (candidate?: File) => {
    if (!candidate) return;
    const supported = /\.(pdf|png|jpe?g|webp)$/i.test(candidate.name);
    if (!supported) {
      toast.error("Escolha um arquivo PDF, PNG, JPG ou WEBP.");
      return;
    }
    if (candidate.size > 10 * 1024 * 1024) {
      toast.error("O arquivo deve ter no máximo 10 MB.");
      return;
    }
    setFile(candidate);
    setReview(false);
  };
  const run = () => {
    if (!file) {
      toast.error("Selecione um PDF ou imagem primeiro.");
      return;
    }
    setProcessing(true);
    window.setTimeout(() => {
      setProcessing(false);
      setReview(true);
      toast.success("Extração demonstrativa concluída. Revise o conteúdo antes de salvar.");
    }, 650);
  };
  const save = () => {
    const nextQuestionNumber =
      Math.max(0, ...state.questions.map((question) => Number(question.id.replace("Q-", "")))) + 1;
    const id = `Q-${String(nextQuestionNumber).padStart(4, "0")}`;
    update((s) => ({
      ...s,
      questions: [
        {
          id,
          text,
          subject,
          year,
          skill: skills.find((x) => x.subject === subject)?.id || skills[0].id,
          difficulty: "Média",
          status: "Pendente de revisão",
          options: ["6 estudantes", "8 estudantes", "9 estudantes", "12 estudantes"],
          answer: 2,
          reason: "Dividir 36 estudantes igualmente em 4 grupos resulta em 9 estudantes por grupo.",
          source: file?.name || "Importação demonstrativa",
          updated: "12/10/2026",
          history: ["Extraída em ambiente demonstrativo; aguardando revisão."],
        },
        ...s.questions,
      ],
    }));
    log(`Questão extraída de ${file?.name} enviada para revisão`);
    toast.success("Questão adicionada ao banco para revisão.");
    setReview(false);
    setFile(null);
  };
  return (
    <div className="page">
      <PageHeading
        title="Importar questões"
        description="Envie documentos e revise a extração simulada antes de incorporar ao banco."
      >
        <Button variant="outline" asChild>
          <Link to="/questoes">
            <BookOpenCheck />
            Voltar ao banco
          </Link>
        </Button>
      </PageHeading>
      <div className="stepper">
        {["Arquivo", "Extração", "Revisão"].map((s, i) => (
          <div
            className={`step ${(review ? i <= 2 : file ? i <= 1 : i === 0) ? "active" : ""}`}
            key={s}
          >
            <span className="step-number">{i + 1}</span>
            {s}
          </div>
        ))}
      </div>
      <Panel
        title="Arquivo de origem"
        description="Formatos aceitos no protótipo: PDF, PNG e JPG. O processamento é local e simulado."
      >
        <div className="p-6">
          <label
            className="upload-zone block cursor-pointer"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              selectFile(event.dataTransfer.files[0]);
            }}
          >
            <Upload size={32} />
            <strong className="block">
              {file ? file.name : "Arraste seu arquivo ou clique para selecionar"}
            </strong>
            <p className="subtext mt-2">PDF ou imagem · máximo recomendado de 10 MB</p>
            <input
              className="sr-only"
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp"
              onChange={(e) => {
                selectFile(e.target.files?.[0]);
              }}
            />
            <span className="inline-flex mt-4">
              <span className="button inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm">
                Selecionar arquivo
              </span>
            </span>
          </label>
          <div className="action-row justify-end mt-5">
            <Button onClick={run} disabled={!file || processing}>
              {processing ? (
                "Processando demonstração…"
              ) : (
                <>
                  <Upload size={16} /> Extrair questões
                </>
              )}
            </Button>
          </div>
        </div>
      </Panel>
      {review && (
        <Panel
          title="Revisar questão extraída"
          description="Confira o texto e os metadados. A questão ficará pendente até ser aprovada."
        >
          <form
            className="p-6 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <label className="field">
              Enunciado
              <textarea
                className="control"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                minLength={15}
              />
            </label>
            <div className="form-grid">
              <label className="field">
                Disciplina
                <SelectField
                  label="Disciplina"
                  value={subject}
                  onChange={setSubject}
                  options={subjects}
                />
              </label>
              <label className="field">
                Ano escolar
                <SelectField
                  label="Ano escolar"
                  value={year}
                  onChange={setYear}
                  options={["5º ano", "6º ano"]}
                />
              </label>
            </div>
            <div className="notice">
              <ShieldCheck size={18} />
              <p>
                A extração é apenas ilustrativa. Confira enunciado, alternativas, resposta correta e
                habilidade antes de utilizar em avaliações.
              </p>
            </div>
            <div className="action-row justify-end">
              <Button type="button" variant="outline" onClick={() => setReview(false)}>
                Descartar revisão
              </Button>
              <Button type="submit">Salvar para revisão</Button>
            </div>
          </form>
        </Panel>
      )}
    </div>
  );
}

function SkillsPage() {
  const { state } = useMentary();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const criticalClasses = state.classes
    .map((room) => ({
      ...room,
      score: mean(state.students.filter((student) => student.classId === room.id)),
    }))
    .filter((room) => room.score < 60)
    .sort((a, b) => a.score - b.score);
  const rows = skills.filter(
    (s) =>
      (!query || `${s.id} ${s.name} ${s.descriptor}`.toLowerCase().includes(query.toLowerCase())) &&
      (!subject || s.subject === subject),
  );
  return (
    <div className="page">
      <PageHeading
        title="Turmas e descritores críticos"
        description="Identifique habilidades com baixo desempenho e as turmas que precisam de atenção."
      />
      <div className="filter-bar">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Buscar habilidade, código ou descritor"
        />
        <SelectField
          label="Disciplina"
          value={subject}
          onChange={setSubject}
          all="Todas as disciplinas"
          options={subjects}
        />
      </div>
      <Panel
        title="Turmas que precisam de atenção"
        description="Média atual calculada a partir dos resultados registrados para cada estudante."
        className="mb-6"
      >
        {criticalClasses.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>TURMA</th>
                  <th>ESCOLA</th>
                  <th>ESTUDANTES</th>
                  <th>MÉDIA</th>
                </tr>
              </thead>
              <tbody>
                {criticalClasses.map((room) => (
                  <tr key={room.id}>
                    <td className="table-main">{room.name}</td>
                    <td>
                      {state.schools.find((school) => school.id === room.schoolId)?.name ?? "—"}
                    </td>
                    <td>
                      {state.students.filter((student) => student.classId === room.id).length}
                    </td>
                    <td>
                      <Badge>{room.score}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">Nenhuma turma abaixo de 60% no momento.</div>
        )}
      </Panel>
      <div className="grid-three">
        {rows.map((s) => (
          <Panel key={s.id} title={s.id} description={s.subject}>
            <div className="px-5 pb-5">
              <p className="text-sm leading-6 min-h-12">{s.name}</p>
              <div className="flex justify-between mt-5 mb-2 text-xs">
                <span className="text-muted-foreground">Desempenho médio</span>
                <strong>{s.score}%</strong>
              </div>
              <Progress value={s.score} tone={s.score < 60 ? "warning" : ""} />
              <div className="flex justify-between mt-4">
                <Badge>{s.descriptor}</Badge>
                <Badge>{s.year}</Badge>
              </div>
            </div>
          </Panel>
        ))}
      </div>
      {!rows.length && <Empty />}
    </div>
  );
}

function PlansPage() {
  const { state, update, log } = useMentary();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [classId, setClass] = useState("t1");
  const [skill, setSkill] = useState(skills[0].id);
  const [strategy, setStrategy] = useState("");
  const recommendations = skills
    .slice()
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);
  const add = (e: FormEvent) => {
    e.preventDefault();
    const p: Plan = {
      id: crypto.randomUUID(),
      title,
      skill,
      classId,
      responsible: state.settings.name,
      deadline: "2026-11-15",
      strategy,
      status: "Planejado",
    };
    update((s) => ({ ...s, plans: [p, ...s.plans] }));
    log(`Plano de recomposição criado: ${title}`);
    setOpen(false);
    setTitle("");
    setStrategy("");
    toast.success("Plano criado.");
  };
  return (
    <div className="page">
      <PageHeading
        title="Recomposição da aprendizagem"
        description="Transforme evidências em ações pedagógicas acompanháveis."
      >
        <Button onClick={() => setOpen(true)}>
          <Plus />
          Novo plano de ação
        </Button>
      </PageHeading>
      <div className="metrics">
        <Metric
          title="Planos ativos"
          value={state.plans.filter((p) => p.status !== "Concluído").length}
          icon={Sprout}
          note="Ações em andamento"
        />
        <Metric
          title="Habilidades foco"
          value={new Set(state.plans.map((p) => p.skill)).size}
          icon={Target}
          note="Habilidades priorizadas"
        />
        <Metric
          title="Turmas envolvidas"
          value={new Set(state.plans.map((p) => p.classId)).size}
          icon={Users}
          note="Turmas acompanhadas"
        />
        <Metric
          title="Alunos em acompanhamento"
          value={state.students.filter((s) => s.score < 60).length}
          icon={GraduationCap}
          note="Média inferior a 60%"
          tone="warning"
        />
      </div>
      <Panel
        title="Recomendações de recomposição"
        description="Sugestões demonstrativas priorizadas pelas habilidades com menor desempenho médio."
        className="mb-6"
      >
        <div className="grid-three px-5 pb-5">
          {recommendations.map((recommendation) => (
            <article className="recommendation-card" key={recommendation.id}>
              <div className="flex items-center justify-between gap-3">
                <Badge>{recommendation.id}</Badge>
                <strong>{recommendation.score}%</strong>
              </div>
              <h3>{recommendation.name}</h3>
              <p>
                {recommendation.subject} · {recommendation.year}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSkill(recommendation.id);
                  setTitle(`Recomposição ${recommendation.id}`);
                  setStrategy(
                    `Retomar ${recommendation.name.toLowerCase()} com atividades graduadas, resolução orientada em pequenos grupos e uma checagem formativa ao final.`,
                  );
                  setOpen(true);
                }}
              >
                Criar plano para esta habilidade
              </Button>
            </article>
          ))}
        </div>
      </Panel>
      <div className="grid-two">
        {state.plans.map((p) => (
          <Panel
            key={p.id}
            title={p.title}
            description={state.classes.find((c) => c.id === p.classId)?.name}
          >
            <div className="px-5 pb-5">
              <div className="flex gap-2 flex-wrap">
                <Badge>{p.status}</Badge>
                <Badge>{p.skill}</Badge>
              </div>
              <p className="text-sm leading-6 mt-4">{p.strategy}</p>
              <div className="subtext mt-4">
                Responsável: {p.responsible} · Prazo: {p.deadline}
              </div>
              <div className="action-row mt-5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    update((s) => ({
                      ...s,
                      plans: s.plans.map((x) =>
                        x.id === p.id
                          ? {
                              ...x,
                              status: x.status === "Concluído" ? "Em andamento" : "Concluído",
                            }
                          : x,
                      ),
                    }));
                    log(`Status do plano atualizado: ${p.title}`);
                    toast.success("Status do plano atualizado.");
                  }}
                >
                  {p.status === "Concluído" ? "Reabrir plano" : "Marcar como concluído"}
                </Button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Novo plano de recomposição"
        description="Cadastre uma ação demonstrativa vinculada a uma turma e habilidade."
      >
        <form className="grid gap-4" onSubmit={add}>
          <label className="field">
            Título do plano
            <input
              className="control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={4}
            />
          </label>
          <label className="field">
            Turma
            <SelectField
              label="Turma"
              value={classId}
              onChange={setClass}
              options={state.classes.map((c) => ({ value: c.id, label: c.name }))}
            />
          </label>
          <label className="field">
            Habilidade foco
            <SelectField
              label="Habilidade"
              value={skill}
              onChange={setSkill}
              options={skills.map((s) => ({ value: s.id, label: `${s.id} · ${s.name}` }))}
            />
          </label>
          <label className="field">
            Estratégia
            <textarea
              className="control"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              required
              minLength={10}
            />
          </label>
          <Button type="submit">Salvar plano</Button>
        </form>
      </Modal>
    </div>
  );
}

function SchoolsPage() {
  const { state, update, log } = useMentary();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const rows = state.schools.filter((s) =>
    (s.name + " " + s.city).toLowerCase().includes(query.toLowerCase()),
  );
  const comparisons = rows.map((school) => {
    const schoolClasses = state.classes.filter((room) => room.schoolId === school.id);
    const students = state.students.filter((student) =>
      schoolClasses.some((room) => room.id === student.classId),
    );
    return {
      school,
      classCount: schoolClasses.length,
      studentCount: students.length,
      average: mean(students),
    };
  });
  const add = (e: FormEvent) => {
    e.preventDefault();
    const school: School = { id: crypto.randomUUID(), name, city };
    update((s) => ({ ...s, schools: [...s.schools, school] }));
    log(`Escola cadastrada: ${name}`);
    setName("");
    setCity("");
    setOpen(false);
    toast.success("Escola cadastrada.");
  };
  return (
    <div className="page">
      <PageHeading
        title="Escolas e unidades"
        description="Organize as unidades escolares acompanhadas pela plataforma."
      >
        <Button onClick={() => setOpen(true)}>
          <Plus />
          Cadastrar escola
        </Button>
      </PageHeading>
      <div className="filter-bar">
        <SearchField value={query} onChange={setQuery} placeholder="Buscar escola ou município" />
      </div>
      <Panel
        title="Comparação entre escolas"
        description="Compare o desempenho médio, as turmas e os estudantes de cada unidade."
        className="mb-6"
      >
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ESCOLA</th>
                <th>TURMAS</th>
                <th>ESTUDANTES</th>
                <th>MÉDIA DE ACERTOS</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map(({ school, classCount, studentCount, average }) => (
                <tr key={school.id}>
                  <td className="table-main">{school.name}</td>
                  <td>{classCount}</td>
                  <td>{studentCount}</td>
                  <td>
                    <Badge>{average}%</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <div className="grid-three">
        {rows.map((s) => (
          <Panel key={s.id} title={s.name} description={s.city}>
            <div className="px-5 pb-5">
              <div className="metrics !grid-cols-2 !mb-0">
                <div>
                  <p className="subtext">Turmas</p>
                  <strong className="text-2xl">
                    {state.classes.filter((c) => c.schoolId === s.id).length}
                  </strong>
                </div>
                <div>
                  <p className="subtext">Estudantes</p>
                  <strong className="text-2xl">
                    {
                      state.students.filter((st) =>
                        state.classes.some((c) => c.schoolId === s.id && c.id === st.classId),
                      ).length
                    }
                  </strong>
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Cadastrar escola">
        <form className="grid gap-4" onSubmit={add}>
          <label className="field">
            Nome da escola
            <input
              className="control"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="field">
            Município / UF
            <input
              className="control"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <Button type="submit">Salvar escola</Button>
        </form>
      </Modal>
    </div>
  );
}

function ClassesPage() {
  const { state, update, log } = useMentary();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("Turmas");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [schoolId, setSchool] = useState("s1");
  const [teacher, setTeacher] = useState("Carla Oliveira");
  const rows = state.classes.filter((c) =>
    (c.name + " " + c.teacher).toLowerCase().includes(query.toLowerCase()),
  );
  const add = (e: FormEvent) => {
    e.preventDefault();
    const room: ClassRoom = { id: crypto.randomUUID(), name, schoolId, teacher };
    update((s) => ({ ...s, classes: [...s.classes, room] }));
    log(`Turma cadastrada: ${name}`);
    setOpen(false);
    setName("");
    toast.success("Turma cadastrada.");
  };
  return (
    <div className="page">
      <PageHeading
        title="Turmas e estudantes"
        description="Acompanhe os grupos e estudantes com dados demonstrativos."
      >
        <Button onClick={() => setOpen(true)}>
          <Plus />
          Nova turma
        </Button>
      </PageHeading>
      <div className="settings-tabs">
        <button className={kind === "Turmas" ? "selected" : ""} onClick={() => setKind("Turmas")}>
          Turmas ({state.classes.length})
        </button>
        <button
          className={kind === "Estudantes" ? "selected" : ""}
          onClick={() => setKind("Estudantes")}
        >
          Estudantes ({state.students.length})
        </button>
      </div>
      <div className="filter-bar">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder={kind === "Turmas" ? "Buscar turma ou professor" : "Buscar estudante"}
        />
      </div>
      {kind === "Turmas" ? (
        <Panel title="Turmas cadastradas">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>TURMA</th>
                  <th>ESCOLA</th>
                  <th>PROFESSOR(A)</th>
                  <th>ESTUDANTES</th>
                  <th>MÉDIA</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td className="table-main">{c.name}</td>
                    <td>
                      {state.schools.find((s) => s.id === c.schoolId)?.name || "Unidade cadastrada"}
                    </td>
                    <td>{c.teacher}</td>
                    <td>{state.students.filter((s) => s.classId === c.id).length}</td>
                    <td>
                      <Badge>{mean(state.students.filter((s) => s.classId === c.id))}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : (
        <Panel title="Estudantes">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ESTUDANTE</th>
                  <th>TURMA</th>
                  <th>DESEMPENHO</th>
                  <th>ACOMPANHAMENTO</th>
                </tr>
              </thead>
              <tbody>
                {state.students
                  .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
                  .map((s) => (
                    <tr key={s.id}>
                      <td className="table-main">{s.name}</td>
                      <td>{state.classes.find((c) => c.id === s.classId)?.name || "—"}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-24">
                            <Progress value={s.score} tone={s.score < 60 ? "warning" : ""} />
                          </div>
                          {s.score}%
                        </div>
                      </td>
                      <td>
                        <Badge>
                          {s.score < 60 ? "Recomposição prioritária" : "Em acompanhamento"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title="Cadastrar turma">
        <form className="grid gap-4" onSubmit={add}>
          <label className="field">
            Nome da turma
            <input
              className="control"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="field">
            Escola
            <SelectField
              label="Escola"
              value={schoolId}
              onChange={setSchool}
              options={state.schools.map((s) => ({ value: s.id, label: s.name }))}
            />
          </label>
          <label className="field">
            Professor(a)
            <input
              className="control"
              required
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
            />
          </label>
          <Button type="submit">Salvar turma</Button>
        </form>
      </Modal>
    </div>
  );
}

function ReportsPage() {
  const { state } = useMentary();
  const rows = state.classes.map((c) => [
    c.name,
    state.schools.find((s) => s.id === c.schoolId)?.name || "",
    c.teacher,
    state.students.filter((s) => s.classId === c.id).length,
    mean(state.students.filter((s) => s.classId === c.id)) + "%",
  ]);
  const schoolRows = state.schools.map((school) => {
    const schoolClasses = state.classes.filter((room) => room.schoolId === school.id);
    const schoolStudents = state.students.filter((student) =>
      schoolClasses.some((room) => room.id === student.classId),
    );
    return {
      name: school.name,
      classes: schoolClasses.length,
      students: schoolStudents.length,
      score: mean(schoolStudents),
    };
  });
  return (
    <div className="page">
      <PageHeading
        title="Relatórios"
        description="Exporte os indicadores e prepare relatórios para reuniões pedagógicas."
      >
        <div className="action-row">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer />
            Imprimir
          </Button>
          <Button
            onClick={() =>
              downloadCsv("mentary-relatorio-turmas.csv", [
                ["Turma", "Escola", "Professor", "Estudantes", "Desempenho médio"],
                ...rows,
              ])
            }
          >
            <ArrowDownToLine />
            Exportar CSV
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              downloadCsv("mentary-relatorio-descritores.csv", [
                ["Descritor", "Habilidade", "Disciplina", "Ano", "Desempenho medio"],
                ...skills.map((skill) => [
                  skill.descriptor,
                  skill.name,
                  skill.subject,
                  skill.year,
                  `${skill.score}%`,
                ]),
              ])
            }
          >
            <FileChartColumn />
            Exportar descritores
          </Button>
        </div>
      </PageHeading>
      <div className="metrics">
        <Metric
          title="Escolas"
          value={state.schools.length}
          icon={SchoolIcon}
          note="Unidades cadastradas"
        />
        <Metric
          title="Turmas"
          value={state.classes.length}
          icon={Users}
          note="Grupos acompanhados"
        />
        <Metric
          title="Estudantes"
          value={state.students.length}
          icon={GraduationCap}
          note="Base demonstrativa"
        />
        <Metric
          title="Média geral"
          value={mean(state.students) + "%"}
          icon={Target}
          note="Desempenho médio"
        />
      </div>
      <Panel
        title="Comparação entre escolas"
        description="Desempenho médio dos alunos e grupos acompanhados em cada unidade."
        className="mb-6"
      >
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ESCOLA</th>
                <th>TURMAS</th>
                <th>ALUNOS</th>
                <th>MÉDIA DE DESEMPENHO</th>
              </tr>
            </thead>
            <tbody>
              {schoolRows.map((school) => (
                <tr key={school.name}>
                  <td className="table-main">{school.name}</td>
                  <td>{school.classes}</td>
                  <td>{school.students}</td>
                  <td>
                    <Badge>{school.score}%</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel title="Desempenho por turma" description="Resumo dos dados atualmente registrados">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>TURMA</th>
                <th>ESCOLA</th>
                <th>RESPONSÁVEL</th>
                <th>ALUNOS</th>
                <th>MÉDIA</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {r.map((v, j) => (
                    <td key={j}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel
        title="Habilidades prioritárias"
        description="Habilidades com menor desempenho médio"
        className="mt-6"
      >
        {skills
          .slice()
          .sort((a, b) => a.score - b.score)
          .slice(0, 5)
          .map((s) => (
            <div className="list-item" key={s.id}>
              <span className="badge">{s.id}</span>
              <span className="grow">{s.name}</span>
              <div className="w-28">
                <Progress value={s.score} tone="warning" />
              </div>
              <strong>{s.score}%</strong>
            </div>
          ))}
      </Panel>
    </div>
  );
}

function ActivitiesPage() {
  const { state } = useMentary();
  return (
    <div className="page">
      <PageHeading
        title="Histórico de atividades"
        description="Acompanhe as principais ações realizadas no ambiente demonstrativo."
      />
      <Panel title="Atividade recente" description={`${state.activities.length} registros`}>
        {state.activities.map((a) => (
          <div key={a.id} className="list-item">
            <span className="icon-tile">
              <Activity size={17} />
            </span>
            <div className="grow">
              <p>{a.text}</p>
              <p className="subtext">{a.date}</p>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}
function NotificationsPage() {
  const { state, update } = useMentary();
  return (
    <div className="page">
      <PageHeading
        title="Notificações"
        description="Avisos sobre avaliações, questões e acompanhamento pedagógico."
      >
        <Button
          variant="outline"
          onClick={() =>
            update((s) => ({
              ...s,
              notifications: s.notifications.map((n) => ({ ...n, read: true })),
            }))
          }
        >
          Marcar todas como lidas
        </Button>
      </PageHeading>
      <Panel title="Central de notificações">
        {state.notifications.map((n) => (
          <Link to={n.path} key={n.id} className="list-item">
            <span className={`icon-tile ${n.read ? "" : "warning"}`}>
              <Bell size={17} />
            </span>
            <div className="grow">
              <div className="flex gap-2 items-center">
                <strong>{n.title}</strong>
                {!n.read && <span className="badge warning">Nova</span>}
              </div>
              <p className="subtext">
                {n.text} · {n.date}
              </p>
            </div>
            <ChevronRight size={16} />
          </Link>
        ))}
      </Panel>
    </div>
  );
}
function SettingsPage() {
  const { state, update, log } = useMentary();
  const [name, setName] = useState(state.settings.name);
  const [email, setEmail] = useState(state.settings.email);
  return (
    <div className="page">
      <PageHeading title="Configurações" description="Personalize seu ambiente demonstrativo." />
      <div className="grid-two">
        <Panel
          title="Perfil de demonstração"
          description="Essas informações são armazenadas apenas neste navegador."
        >
          <form
            className="p-5 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              update((s) => ({ ...s, settings: { ...s.settings, name, email } }));
              log("Configurações do perfil atualizadas");
              toast.success("Configurações salvas.");
            }}
          >
            <label className="field">
              Nome
              <input
                className="control"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="field">
              E-mail
              <input
                className="control"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <Button type="submit">Salvar perfil</Button>
          </form>
        </Panel>
        <Panel title="Preferências">
          <div className="list-item">
            <div className="grow">
              <strong>Menu compacto</strong>
              <p className="subtext">Recolhe a navegação lateral para ampliar o espaço.</p>
            </div>
            <input
              aria-label="Menu compacto"
              type="checkbox"
              checked={state.settings.compact}
              onChange={(e) =>
                update((s) => ({ ...s, settings: { ...s.settings, compact: e.target.checked } }))
              }
            />
          </div>
          <div className="list-item">
            <div className="grow">
              <strong>Notificações por e-mail</strong>
              <p className="subtext">Preferência ilustrativa; nenhum e-mail será enviado.</p>
            </div>
            <input
              aria-label="Notificações por e-mail"
              type="checkbox"
              checked={state.settings.emailNotifications}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  settings: { ...s.settings, emailNotifications: e.target.checked },
                }))
              }
            />
          </div>
          <div className="list-item">
            <div className="grow">
              <strong>Dados de demonstração</strong>
              <p className="subtext">Reinicie os dados para voltar ao estado inicial.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("mentary-demo-v1");
                window.location.reload();
              }}
            >
              Restaurar
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
function HelpPage() {
  return (
    <div className="page">
      <PageHeading
        title="Ajuda e orientações"
        description="Conheça os principais fluxos do protótipo Mentary."
      />
      <div className="grid-three">
        {[
          {
            title: "Banco de questões",
            text: "Pesquise, filtre, edite e revise itens antes de aprová-los para avaliações.",
            icon: BookOpenCheck,
            path: "/questoes",
          },
          {
            title: "Criar avaliações",
            text: "Monte avaliações a partir de questões aprovadas e valide sua composição.",
            icon: ClipboardList,
            path: "/simulados/criar",
          },
          {
            title: "Recomposição",
            text: "Registre estratégias de intervenção vinculadas a habilidades e turmas.",
            icon: Sprout,
            path: "/recomposicao",
          },
        ].map((x) => (
          <Panel key={x.title} title={x.title}>
            <div className="px-5 pb-5">
              <div className="icon-tile mb-4">
                <x.icon size={20} />
              </div>
              <p className="text-sm leading-6">{x.text}</p>
              <Button variant="link" asChild className="px-0 mt-4">
                <Link to={x.path}>
                  Abrir módulo <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          </Panel>
        ))}
      </div>
      <div className="notice mt-6">
        <ShieldCheck size={19} />
        <p>
          Este protótipo utiliza dados fictícios e não realiza autenticação, chamadas de API,
          extração real de arquivos ou análises por inteligência artificial.
        </p>
      </div>
    </div>
  );
}

export function QuestionsRoute() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return <AppShell>{path === "/questoes" ? <QuestionBank /> : <Outlet />}</AppShell>;
}
export function AssessmentsRoute() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return <AppShell>{path === "/simulados" ? <Assessments /> : <Outlet />}</AppShell>;
}
export function NestedWorkspace() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return <Workspace path={path} />;
}
