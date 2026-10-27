import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Search,
  ChevronDown,
  ChevronsLeft,
  Menu,
  X,
  ChevronRight,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getNavGroups } from "./navigation";
import { useMentary } from "./store";
import { Modal, DemoNote, IconButton } from "./ui";
export function AppShell({ children }: { children: ReactNode }) {
  const { state, update, setAuthenticated } = useMentary();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobile, setMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const compact = state.settings.compact;
  const navGroups = getNavGroups(state.profile);
  const current =
    navGroups.flatMap((group) => group.items).find((item) => item.path === path) ??
    navGroups.flatMap((group) => group.items).find((item) => path.startsWith(`${item.path}/`));
  const nestedTitle =
    path === "/simulados/criar"
      ? "Criar roteiro"
      : path === "/simulados/validador"
        ? "Validador pedagógico"
        : path.startsWith("/questoes/")
          ? "Revisar questões"
          : "";
  const results = [
    ...state.questions.map((q) => ({ title: `${q.id} · ${q.text}`, path: "/questoes" })),
    ...state.assessments.map((a) => ({ title: a.name, path: "/simulados" })),
    ...state.students.map((a) => ({ title: a.name, path: "/turmas" })),
    ...["Desempenho geral", "Relatório por turma"].map((title) => ({ title, path: "/relatorios" })),
  ]
    .filter((r) => search.length > 1 && r.title.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 10);
  return (
    <div className="app-frame">
      <div className={`mobile-overlay ${mobile ? "open" : ""}`} onClick={() => setMobile(false)} />
      <aside className={`app-sidebar ${compact ? "compact" : ""} ${mobile ? "mobile-open" : ""}`}>
        <div className="brand-block">
          <Link to="/">
            <img
              className="brand-logo"
              src="/marca_mentary_horizontal.webp"
              width={640}
              height={192}
              alt="Mentary"
            />
            <div className="brand-tag">Inteligência educacional</div>
          </Link>
          {mobile && (
            <IconButton label="Fechar menu" onClick={() => setMobile(false)}>
              <X />
            </IconButton>
          )}
        </div>
        <nav className="sidebar-scroll">
          {navGroups.map((g) => (
            <div key={g.label}>
              <div className="nav-label">{g.label}</div>
              {g.items.map((n) => (
                <Link
                  key={n.path}
                  to={n.path}
                  className="nav-link"
                  data-status={path === n.path ? "active" : undefined}
                  title={compact ? n.title : undefined}
                  onClick={() => setMobile(false)}
                >
                  <n.icon />
                  <span>{n.title}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="avatar">
            {state.settings.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="user-info flex-1">
            <h3 className="text-xs">{state.settings.name}</h3>
            <p className="subtext">{state.profile}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu do usuário">
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Conta atual · {state.profile}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/configuracoes">
                  <Settings />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/login" onClick={() => setAuthenticated(false)}>
                  <LogOut />
                  Sair
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <div className={`app-main ${compact ? "compact" : ""}`}>
        <header className="app-header">
          <IconButton
            label="Recolher ou abrir menu"
            onClick={() => {
              if (window.innerWidth <= 800) setMobile(!mobile);
              else update((s) => ({ ...s, settings: { ...s.settings, compact: !compact } }));
            }}
          >
            <span className="hidden md:block">
              <ChevronsLeft size={17} />
            </span>
            <span className="md:hidden">
              <Menu size={19} />
            </span>
          </IconButton>
          <div className="header-context">
            <span>Plataforma</span>
            <ChevronRight size={12} />
            <span className="text-foreground font-medium">{current?.title || "Dashboard"}</span>
            {nestedTitle && (
              <>
                <ChevronRight size={12} />
                <span className="text-foreground font-medium">{nestedTitle}</span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            className="header-search justify-start text-muted-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search />
            <span>Buscar na plataforma...</span>
          </Button>
          <div className="header-actions">
            <span className="badge hidden lg:inline-flex">Ambiente demonstrativo</span>
            <Link to="/configuracoes" title="Meu perfil" className="avatar">
              {state.settings.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </Link>
          </div>
        </header>
        {children}
        <footer className="flex justify-between px-8 pb-6">
          <span className="demo-note">© 2026 Mentary</span>
          <DemoNote />
        </footer>
      </div>
      <Modal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Busca global"
        description="Questões, avaliações, alunos e relatórios"
      >
        <div className="search-input">
          <Search size={17} />
          <input
            autoFocus
            placeholder="O que você procura?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mt-4">
          {results.map((r, i) => (
            <Link key={i} to={r.path} className="list-item" onClick={() => setSearchOpen(false)}>
              <Search size={15} />
              <span className="grow truncate">{r.title}</span>
              <ChevronRight size={15} />
            </Link>
          ))}
          {search.length > 1 && !results.length && (
            <p className="subtext">Nenhum resultado encontrado.</p>
          )}
          {search.length <= 1 && (
            <p className="subtext">Busque por um nome, código ou enunciado.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
