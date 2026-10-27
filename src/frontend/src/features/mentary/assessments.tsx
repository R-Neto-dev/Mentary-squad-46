import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Plus,
  Search,
  Copy,
  Pencil,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  Eye,
  ShieldCheck,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useMentary } from "./store";
import { subjects, skills, type Assessment } from "./data";
import { PageHeading, SearchField, SelectField, Badge, Modal, Empty, Panel, Progress } from "./ui";
export function Assessments() {
  const { state, update, log } = useMentary();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [edit, setEdit] = useState<Assessment | null>(null);
  const rows = state.assessments.filter(
    (a) =>
      (!search || a.name.toLowerCase().includes(search.toLowerCase())) &&
      (!status || a.status === status),
  );
  const detail = state.assessments.find((a) => a.id === selected);
  return (
    <div className="page">
      <PageHeading
        title="Roteiros de questões"
        description="Organize questões, confira habilidades BNCC/SAEB e acompanhe a preparação das avaliações."
      >
        <Button asChild>
          <Link to="/simulados/criar">
            <Plus />
            Criar roteiro
          </Link>
        </Button>
      </PageHeading>
      <div className="filter-bar">
        <SearchField value={search} onChange={setSearch} placeholder="Buscar roteiro..." />
        <SelectField
          label="Status das avaliações"
          value={status}
          onChange={setStatus}
          all="Todos os status"
          options={["Rascunho", "Em preparação", "Pronto para aplicação", "Aplicado", "Arquivado"]}
        />
      </div>
      <div className="grid-three assessment-grid">
        {rows.map((a) => (
          <article key={a.id} className="panel assessment-card">
            <div className="assessment-card-top">
              <div className="icon-tile">
                <ClipboardList size={21} />
              </div>
              <Badge>{a.status}</Badge>
            </div>
            <h2 className="assessment-card-title">{a.name}</h2>
            <p className="assessment-card-subtitle">
              {a.subject} · {a.year}
            </p>
            <div className="assessment-card-meta">
              <div className="assessment-meta-item">
                <span>Questões</span>
                <strong>{a.questions.length} questões</strong>
              </div>
              <div className="assessment-meta-item">
                <span>Turma</span>
                <strong>{state.classes.find((c) => c.id === a.classId)?.name}</strong>
              </div>
            </div>
            <div className="assessment-card-footer">
              <span className="demo-note">{a.date}</span>
              <div className="assessment-card-actions">
                <Button
                  variant="ghost"
                  size="icon"
                  className="assessment-icon-action"
                  aria-label={`Editar ${a.name}`}
                  onClick={() => setEdit({ ...a })}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="assessment-icon-action"
                  aria-label={`Duplicar ${a.name}`}
                  onClick={() => {
                    update((s) => ({
                      ...s,
                      assessments: [
                        {
                          ...a,
                          id: crypto.randomUUID(),
                          name: `${a.name} (cópia)`,
                          status: "Rascunho",
                        },
                        ...s.assessments,
                      ],
                    }));
                    log(`Avaliação ${a.name} duplicada`);
                    toast.success("Avaliação duplicada.");
                  }}
                >
                  <Copy />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="assessment-icon-action"
                  aria-label={`Excluir ${a.name}`}
                  onClick={() => setDeleting(a.id)}
                >
                  <Trash2 />
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setSelected(a.id)}>
                  Abrir
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!rows.length && <Empty />}
      <Modal
        open={Boolean(detail)}
        onClose={() => setSelected(null)}
        title={detail?.name || "Avaliação"}
        description="Prévia da avaliação e composição das questões."
      >
        {detail && (
          <>
            <div className="action-row mb-5">
              <Badge>{detail.status}</Badge>
              <Badge>{detail.subject}</Badge>
              <Badge>{detail.year}</Badge>
            </div>
            {detail.questions.map((id, i) => {
              const q = state.questions.find((x) => x.id === id);
              return q ? (
                <div key={id} className="py-5 border-t">
                  <h3 className="leading-6">
                    {i + 1}. {q.text}
                  </h3>
                  {q.options.map((o, j) => (
                    <p key={j} className="subtext">
                      {String.fromCharCode(65 + j)}. {o}
                    </p>
                  ))}
                </div>
              ) : null;
            })}
            <div className="action-row mt-5 no-print">
              <Button variant="outline" onClick={() => window.print()}>
                <Eye />
                Imprimir prévia
              </Button>
              <Button asChild>
                <Link to="/simulados/validador">
                  <ShieldCheck />
                  Validar composição
                </Link>
              </Button>
            </div>
          </>
        )}
      </Modal>
      <Modal
        open={Boolean(edit)}
        onClose={() => setEdit(null)}
        title="Editar avaliação"
        description="Atualize os dados e a composição da avaliação."
      >
        {edit && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update((s) => ({
                ...s,
                assessments: s.assessments.map((a) => (a.id === edit.id ? edit : a)),
              }));
              log(`Avaliação ${edit.name} atualizada`);
              setEdit(null);
              toast.success("Avaliação atualizada.");
            }}
            className="grid gap-4"
          >
            <label className="field">
              Nome
              <input
                required
                className="control"
                value={edit.name}
                onChange={(e) => setEdit({ ...edit, name: e.target.value })}
              />
            </label>
            <label className="field">
              Status
              <SelectField
                label="Status da avaliação"
                value={edit.status}
                onChange={(v) => setEdit({ ...edit, status: v })}
                options={[
                  "Rascunho",
                  "Em preparação",
                  "Pronto para aplicação",
                  "Aplicado",
                  "Arquivado",
                ]}
              />
            </label>
            <h3>Composição</h3>
            {edit.questions.map((id, i) => (
              <div key={id} className="flex gap-2 items-center text-xs border-b pb-2">
                <span className="flex-1 truncate">
                  {i + 1}. {state.questions.find((q) => q.id === id)?.text}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Mover ${id} para cima`}
                  disabled={i === 0}
                  onClick={() => {
                    const q = [...edit.questions];
                    [q[i - 1], q[i]] = [q[i], q[i - 1]];
                    setEdit({ ...edit, questions: q });
                  }}
                >
                  <ArrowUp />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remover ${id}`}
                  onClick={() =>
                    setEdit({ ...edit, questions: edit.questions.filter((q) => q !== id) })
                  }
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
            <label className="field">
              Adicionar questão
              <SelectField
                label="Adicionar questão à avaliação"
                value=""
                onChange={(v) => {
                  if (v && !edit.questions.includes(v))
                    setEdit({ ...edit, questions: [...edit.questions, v] });
                }}
                all="Selecione uma questão"
                options={state.questions
                  .filter((q) => !edit.questions.includes(q.id) && q.status === "Aprovada")
                  .map((q) => ({ value: q.id, label: `${q.id} · ${q.subject}` }))}
              />
            </label>
            <Button type="submit">
              <Check />
              Salvar alterações
            </Button>
          </form>
        )}
      </Modal>
      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Excluir avaliação?"
        description="Esta ação remove a avaliação do ambiente demonstrativo."
      >
        <div className="action-row justify-end">
          <Button variant="outline" onClick={() => setDeleting(null)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              update((s) => ({
                ...s,
                assessments: s.assessments.filter((a) => a.id !== deleting),
              }));
              log("Avaliação excluída");
              setDeleting(null);
              toast.success("Avaliação excluída.");
            }}
          >
            Excluir avaliação
          </Button>
        </div>
      </Modal>
    </div>
  );
}
export function AssessmentBuilder() {
  const { state, update, log } = useMentary();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("Matemática");
  const [year, setYear] = useState("5º ano");
  const [classId, setClass] = useState("t1");
  const [chosenSkills, setSkills] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const labels = [
    "Informações",
    "Disciplinas",
    "Ano e turma",
    "Habilidades",
    "Questões",
    "Revisão",
    "Salvamento",
  ];
  const rows = state.questions.filter(
    (q) =>
      q.status === "Aprovada" &&
      q.subject === subject &&
      q.year === year &&
      (!chosenSkills.length || chosenSkills.includes(q.skill)) &&
      q.text.toLowerCase().includes(search.toLowerCase()),
  );
  const move = (i: number, d: number) => {
    const next = [...selected];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setSelected(next);
  };
  const save = () => {
    const a: Assessment = {
      id: crypto.randomUUID(),
      name,
      subject,
      year,
      classId,
      questions: selected,
      status: "Rascunho",
      date: "12/10/2026",
    };
    update((s) => ({ ...s, assessments: [a, ...s.assessments] }));
    log(`Avaliação ${name} criada com ${selected.length} questões`);
    toast.success("Avaliação salva como rascunho.");
    navigate({ to: "/simulados" });
  };
  return (
    <div className="page">
      <PageHeading
        title="Criar roteiro"
        description="Monte um roteiro de questões alinhado à turma, à disciplina e às habilidades BNCC/SAEB."
      />
      <div className="stepper">
        {labels.map((l, i) => (
          <div key={l} className={`step ${i <= step ? "active" : ""}`}>
            <span className="step-number">{i < step ? <Check size={13} /> : i + 1}</span>
            {l}
          </div>
        ))}
      </div>
      <div className="panel p-6 md:p-8">
        {step === 0 && (
          <>
            <h2>Vamos começar pela avaliação</h2>
            <label className="field mt-6">
              Nome da avaliação
              <input
                aria-label="Nome da avaliação"
                className="control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Avaliação diagnóstica de Matemática"
              />
            </label>
          </>
        )}
        {step === 1 && (
          <>
            <h2>Área do conhecimento</h2>
            <div className="grid-three mt-6">
              {subjects.map((s) => (
                <Button
                  key={s}
                  variant={subject === s ? "default" : "outline"}
                  size="lg"
                  onClick={() => {
                    setSubject(s);
                    setSkills([]);
                    setSelected([]);
                  }}
                >
                  {s}
                </Button>
              ))}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2>Ano escolar e turma</h2>
            <div className="form-grid mt-6">
              <label className="field">
                Ano escolar
                <SelectField
                  label="Ano escolar da avaliação"
                  value={year}
                  onChange={(v) => {
                    setYear(v);
                    setSelected([]);
                  }}
                  options={["5º ano", "6º ano"]}
                />
              </label>
              <label className="field">
                Turma
                <SelectField
                  label="Turma da avaliação"
                  value={classId}
                  onChange={setClass}
                  options={state.classes.map((c) => ({ value: c.id, label: c.name }))}
                />
              </label>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h2>Habilidades e descritores</h2>
            <p className="subtext mb-6">
              Selecione as habilidades que deseja avaliar ou mantenha todas disponíveis.
            </p>
            {skills
              .filter((s) => s.subject === subject && s.year === year)
              .map((s) => (
                <label key={s.id} className="list-item">
                  <input
                    type="checkbox"
                    checked={chosenSkills.includes(s.id)}
                    onChange={(e) =>
                      setSkills(
                        e.target.checked
                          ? [...chosenSkills, s.id]
                          : chosenSkills.filter((x) => x !== s.id),
                      )
                    }
                  />
                  <span className="badge">{s.id}</span>
                  <span className="grow">{s.name}</span>
                  <span className="subtext">{s.descriptor}</span>
                </label>
              ))}
          </>
        )}
        {step === 4 && (
          <>
            <div className="flex justify-between gap-3 mb-5">
              <h2>Selecione suas questões</h2>
              <Badge>{selected.length} selecionadas</Badge>
            </div>
            <SearchField value={search} onChange={setSearch} placeholder="Buscar questão..." />
            {rows.map((q) => (
              <label key={q.id} className="list-item">
                <input
                  type="checkbox"
                  checked={selected.includes(q.id)}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked ? [...selected, q.id] : selected.filter((x) => x !== q.id),
                    )
                  }
                />
                <div className="grow">
                  <span className="badge">{q.id}</span>
                  <p className="subtext">{q.text}</p>
                </div>
                <Badge>{q.difficulty}</Badge>
              </label>
            ))}
            {!rows.length && <Empty text="Nenhuma questão aprovada para esta seleção." />}
          </>
        )}
        {step === 5 && (
          <>
            <h2>{name}</h2>
            <p className="subtext mb-5">
              {subject} · {year} · {selected.length} questões
            </p>
            {selected.map((id, i) => {
              const q = state.questions.find((x) => x.id === id);
              return (
                q && (
                  <div key={id} className="border-t py-5">
                    <div className="flex gap-3">
                      <h3 className="grow leading-6">
                        {i + 1}. {q.text}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Subir questão ${i + 1}`}
                        disabled={i === 0}
                        onClick={() => move(i, -1)}
                      >
                        <ArrowUp />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Descer questão ${i + 1}`}
                        disabled={i === selected.length - 1}
                        onClick={() => move(i, 1)}
                      >
                        <ArrowDown />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remover questão ${i + 1}`}
                        onClick={() => setSelected(selected.filter((x) => x !== id))}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    {q.options.map((o, j) => (
                      <p key={j} className="subtext">
                        {String.fromCharCode(65 + j)}. {o}
                      </p>
                    ))}
                  </div>
                )
              );
            })}
          </>
        )}
        {step === 6 && (
          <div className="text-center py-10">
            <ClipboardList size={45} className="mx-auto text-primary mb-5" />
            <h2>Tudo pronto para salvar</h2>
            <p className="subtext mt-3">
              {name} · {selected.length} questões · {subject}
            </p>
            <p className="subtext">A avaliação será salva como rascunho para revisão pedagógica.</p>
            <Button className="mt-6" onClick={save}>
              <Check />
              Salvar avaliação
            </Button>
          </div>
        )}
        <div className="action-row justify-between mt-8 pt-5 border-t">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
            <ChevronLeft />
            Voltar
          </Button>
          {step < 6 && (
            <Button
              disabled={(step === 0 && !name.trim()) || (step >= 4 && !selected.length)}
              onClick={() => setStep(step + 1)}
            >
              Continuar
              <ChevronRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
export function Validator() {
  const { state } = useMentary();
  const [id, setId] = useState(state.assessments[0]?.id || "");
  const [executed, setExecuted] = useState(false);
  const assessment = state.assessments.find((a) => a.id === id);
  const qs = state.questions.filter((q) => assessment?.questions.includes(q.id));
  const unclassified = qs.filter(
    (q) => !q.skill || !q.reason || q.answer < 0 || !q.options[q.answer],
  ).length;
  const uniqueSkills = new Set(qs.map((q) => q.skill)).size;
  const duplicates = qs.length - new Set(qs.map((q) => q.text)).size;
  const maxSkill = Math.max(0, ...qs.map((q) => qs.filter((x) => x.skill === q.skill).length));
  const score = qs.length
    ? Math.max(
        0,
        100 -
          unclassified * 15 -
          duplicates * 10 -
          (maxSkill / qs.length > 0.5 ? 20 : 0) -
          (new Set(qs.map((q) => q.difficulty)).size < 3 ? 15 : 0),
      )
    : 0;
  const alerts = [
    ...(unclassified ? [`${unclassified} questões têm metadados incompletos.`] : []),
    ...(duplicates ? [`${duplicates} enunciados são repetidos na avaliação.`] : []),
    ...(qs.length && maxSkill / qs.length > 0.5
      ? ["Mais de 50% das questões se concentram em uma habilidade."]
      : []),
    ...(new Set(qs.map((q) => q.difficulty)).size < 3
      ? ["A avaliação não contempla os três níveis de dificuldade."]
      : []),
    ...(!qs.length ? ["Adicione questões à avaliação antes de validar."] : []),
  ];
  return (
    <div className="page">
      <PageHeading
        title="Validador pedagógico"
        description="Um apoio à revisão da composição, não uma certificação pedagógica."
      >
        <Button onClick={() => setExecuted(true)} disabled={!assessment}>
          <ShieldCheck />
          Executar validação
        </Button>
      </PageHeading>
      <div className="filter-bar">
        <SelectField
          label="Avaliação para validar"
          value={id}
          onChange={(v) => {
            setId(v);
            setExecuted(false);
          }}
          options={state.assessments.map((a) => ({ value: a.id, label: a.name }))}
        />
      </div>
      {!executed ? (
        <div className="panel empty">
          <ShieldCheck size={42} />
          <h2>Revise o equilíbrio da sua avaliação</h2>
          <p className="subtext">Selecione uma avaliação e execute a validação demonstrativa.</p>
        </div>
      ) : (
        <>
          <div className="notice mb-6">
            <ShieldCheck size={20} />
            <div>
              <h2>Equilíbrio pedagógico: {score}/100</h2>
              <p className="mt-2">
                Critérios locais: metadados completos, diversidade de habilidades e dificuldades e
                ausência de enunciados repetidos.
              </p>
            </div>
          </div>
          <div className="metrics">
            <div className="panel metric">
              <div className="metric-label">Questões analisadas</div>
              <div className="metric-value mt-3">{qs.length}</div>
            </div>
            <div className="panel metric">
              <div className="metric-label">Habilidades contempladas</div>
              <div className="metric-value mt-3">{uniqueSkills}</div>
            </div>
            <div className="panel metric">
              <div className="metric-label">Metadados incompletos</div>
              <div className="metric-value mt-3">{unclassified}</div>
            </div>
            <div className="panel metric">
              <div className="metric-label">Possíveis redundâncias</div>
              <div className="metric-value mt-3">{duplicates}</div>
            </div>
          </div>
          <div className="grid-two">
            <Panel title="Distribuição por dificuldade">
              {["Fácil", "Média", "Difícil"].map((d) => (
                <div className="list-item" key={d}>
                  <span className="w-16">{d}</span>
                  <div className="grow">
                    <Progress
                      value={
                        qs.length
                          ? (qs.filter((q) => q.difficulty === d).length / qs.length) * 100
                          : 0
                      }
                    />
                  </div>
                  <span>{qs.filter((q) => q.difficulty === d).length}</span>
                </div>
              ))}
            </Panel>
            <Panel title="Cobertura de habilidades">
              {[...new Set(qs.map((q) => q.skill))].map((s) => (
                <div className="list-item" key={s}>
                  <span className="badge">{s}</span>
                  <span className="grow text-xs">{skills.find((x) => x.id === s)?.descriptor}</span>
                  <Badge>{qs.filter((q) => q.skill === s).length} questões</Badge>
                </div>
              ))}
            </Panel>
          </div>
          <Panel title="Alertas de composição" className="mt-6">
            {alerts.length ? (
              alerts.map((a) => (
                <div key={a} className="list-item">
                  <AlertTriangle size={18} className="text-warning" />
                  <p>{a}</p>
                </div>
              ))
            ) : (
              <div className="list-item">
                <Check className="text-success" />
                Nenhum alerta identificado pelos critérios demonstrativos.
              </div>
            )}
          </Panel>
        </>
      )}
    </div>
  );
}
