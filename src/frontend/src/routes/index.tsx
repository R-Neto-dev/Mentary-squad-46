import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenCheck,
  ChartNoAxesCombined,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Layers3,
  Target,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: LandingPage });

function LandingPage() {
  return (
    <main className="landing">
      <header className="public-nav landing-nav">
        <Link to="/" className="public-brand">
          <img
            src="/marca_mentary_horizontal.webp"
            alt="Mentary — Inteligência educacional"
            className="brand-logo"
          />
        </Link>
        <div className="landing-nav-spacer" aria-hidden="true" />
        <div className="action-row">
          <Link to="/login" className="landing-login">
            Entrar
          </Link>
          <Link to="/login" className="landing-cta">
            Explorar demonstração <ArrowRight size={16} />
          </Link>
        </div>
      </header>
      <section className="landing-hero">
        <div className="landing-glow" />
        <div className="landing-hero-copy">
          <h1>
            Inovação
            <br />
            <span>Educacional</span>
          </h1>
          <p>
            Potencialize o ensino com avaliações, habilidades BNCC/SAEB e dados claros para apoiar
            as decisões pedagógicas.
          </p>
          <div className="action-row">
            <a href="#plataforma" className="landing-secondary">
              Conheça as funcionalidades
            </a>
          </div>
          <div className="landing-proof">
            <span>
              <CheckCircle2 size={15} /> Análise de desempenho
            </span>
            <span>
              <CheckCircle2 size={15} /> Recomposição da aprendizagem
            </span>
          </div>
        </div>
        <div className="landing-mascot" aria-label="Mascote capivara 3D do Mentary" role="img">
          <div className="mascot-orbit mascot-orbit-one" />
          <div className="mascot-orbit mascot-orbit-two" />
          <div className="mascot-spark mascot-spark-one">✦</div>
          <div className="mascot-spark mascot-spark-two">✧</div>
          <svg
            className="capybara-3d"
            viewBox="0 0 520 430"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="capyBody" cx="32%" cy="20%" r="82%">
                <stop offset="0" stopColor="#FFE3B6" />
                <stop offset=".38" stopColor="#E9B273" />
                <stop offset=".72" stopColor="#C17A46" />
                <stop offset="1" stopColor="#784126" />
              </radialGradient>
              <radialGradient id="capyFace" cx="34%" cy="18%" r="86%">
                <stop offset="0" stopColor="#FFE1B2" />
                <stop offset=".5" stopColor="#E8AE70" />
                <stop offset=".82" stopColor="#CF8B52" />
                <stop offset="1" stopColor="#A65F37" />
              </radialGradient>
              <radialGradient id="capyMuzzle" cx="38%" cy="22%" r="90%">
                <stop offset="0" stopColor="#FFF2D6" />
                <stop offset=".65" stopColor="#F7D5A1" />
                <stop offset="1" stopColor="#DDA568" />
              </radialGradient>
              <radialGradient id="capyEar" cx="35%" cy="28%" r="80%">
                <stop offset="0" stopColor="#F5C28A" />
                <stop offset="1" stopColor="#A95F38" />
              </radialGradient>
              <linearGradient id="capyBook" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#B9F5FF" />
                <stop offset=".5" stopColor="#65D7EB" />
                <stop offset="1" stopColor="#20AFCB" />
              </linearGradient>
              <linearGradient id="capyPage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#D9D0F7" />
              </linearGradient>
              <radialGradient id="capyShine" cx="35%" cy="20%" r="75%">
                <stop offset="0" stopColor="#FFFFFF" stopOpacity=".55" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
              <filter id="capyShadow" x="-30%" y="-30%" width="160%" height="180%">
                <feDropShadow
                  dx="0"
                  dy="17"
                  stdDeviation="12"
                  floodColor="#120A45"
                  floodOpacity=".28"
                />
              </filter>
            </defs>
            <ellipse cx="264" cy="376" rx="145" ry="24" fill="#140B4C" opacity=".28" />
            <g filter="url(#capyShadow)">
              <path
                d="M152 278 Q130 218 165 176 Q193 145 266 153 Q337 151 367 202 Q388 238 360 292 L333 328 L183 328Z"
                fill="url(#capyBody)"
              />
              <ellipse cx="182" cy="195" rx="27" ry="33" fill="#8D4D2F" />
              <ellipse cx="184" cy="193" rx="17" ry="22" fill="url(#capyEar)" />
              <ellipse cx="333" cy="192" rx="26" ry="32" fill="#8D4D2F" />
              <ellipse cx="332" cy="191" rx="16" ry="21" fill="url(#capyEar)" />
              <path
                d="M173 204 Q178 152 232 142 Q284 129 324 164 Q345 186 339 226 Q333 270 296 286 Q256 304 211 280 Q177 260 173 204Z"
                fill="url(#capyFace)"
              />
              <ellipse cx="236" cy="178" rx="54" ry="22" fill="url(#capyShine)" opacity=".72" />
              <ellipse cx="254" cy="250" rx="75" ry="48" fill="url(#capyMuzzle)" />
              <ellipse cx="226" cy="238" rx="24" ry="12" fill="#FFF4D9" opacity=".28" />
              <ellipse cx="253" cy="222" rx="12" ry="8" fill="#3A211B" />
              <ellipse cx="249" cy="219" rx="3" ry="2" fill="#FFF0D5" opacity=".85" />
              <ellipse cx="218" cy="205" rx="6" ry="8" fill="#40241D" />
              <ellipse cx="294" cy="205" rx="6" ry="8" fill="#40241D" />
              <circle cx="220" cy="202" r="2" fill="#fff" />
              <circle cx="296" cy="202" r="2" fill="#fff" />
              <path
                d="M244 264 Q256 274 269 263"
                fill="none"
                stroke="#91522F"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M200 286 Q250 305 310 284 L333 321 Q268 350 183 322Z"
                fill="#B87543"
                opacity=".65"
              />
              <path d="M174 307 Q152 326 159 345 L192 345 L207 319Z" fill="url(#capyBody)" />
              <path d="M319 317 L337 345 L367 343 Q371 323 349 305Z" fill="url(#capyBody)" />
              <path
                d="M162 338 Q173 342 190 338"
                fill="none"
                stroke="#F5C58F"
                strokeWidth="3"
                opacity=".6"
              />
              <path
                d="M340 338 Q352 341 365 336"
                fill="none"
                stroke="#F5C58F"
                strokeWidth="3"
                opacity=".55"
              />
              <g transform="translate(168 296) rotate(-5)">
                <path d="M0 16 Q39 0 78 16 L78 74 Q39 58 0 74Z" fill="url(#capyPage)" />
                <path d="M78 16 Q117 0 156 16 L156 74 Q117 58 78 74Z" fill="#FFFDFE" />
                <path
                  d="M0 16 Q39 0 78 16 L78 74 Q39 58 0 74Z"
                  fill="url(#capyBook)"
                  opacity=".8"
                />
                <path d="M78 16 Q117 0 156 16 L156 74 Q117 58 78 74Z" fill="#A991EA" />
                <path
                  d="M81 19 Q117 5 152 19 L152 66 Q116 54 81 68Z"
                  fill="#D3C6FF"
                  opacity=".52"
                />
                <path d="M78 16 L78 74" stroke="#8B78C5" strokeWidth="4" opacity=".6" />
                <path d="M76 18 L76 75" stroke="#FFFFFF" strokeWidth="2" opacity=".9" />
                <path
                  d="M13 30 Q39 22 63 31 M13 42 Q39 34 63 43 M92 30 Q116 22 142 31 M92 42 Q116 34 142 43"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity=".8"
                />
                <path
                  d="M0 74 Q39 59 78 74 Q117 59 156 74 L156 83 Q117 68 78 83 Q39 68 0 83Z"
                  fill="#D7C9F5"
                />
              </g>
            </g>
            <g transform="translate(354 118) rotate(9)">
              <path d="M0 0 L28 0 L28 36 L14 28 L0 36Z" fill="#00C2E5" />
              <path d="M5 6 L23 6" stroke="#fff" strokeWidth="2" opacity=".7" />
            </g>
          </svg>
          <div className="mascot-caption">
            <span className="mascot-caption-mark">m</span>
            <span>
              <b>Aprender, acompanhar, evoluir.</b>
              <small>Educação com mais clareza e propósito.</small>
            </span>
          </div>
        </div>
      </section>
      <section id="impacto" className="landing-trust">
        <p>UMA PLATAFORMA PARA QUEM FAZ A EDUCAÇÃO ACONTECER</p>
        <div>
          <span>
            <GraduationCap /> Professores
          </span>
          <span>
            <Users /> Coordenação pedagógica
          </span>
          <span>
            <Layers3 /> Gestão escolar
          </span>
        </div>
      </section>
      <section id="plataforma" className="landing-section">
        <div className="landing-section-head">
          <span className="eyebrow">FERRAMENTAS DO MENTARY</span>
          <h2>
            Do planejamento à prática,
            <br />
            <span style={{ color: "#00C0E1", WebkitTextFillColor: "#00C0E1" }}>
              em um só lugar.
            </span>
          </h2>
          <p>
            Use cada ferramenta para organizar avaliações, acompanhar resultados e definir os
            próximos passos pedagógicos.
          </p>
        </div>
        <div className="landing-feature-grid">
          <article>
            <div className="landing-feature-icon">
              <BookOpenCheck />
            </div>
            <h3>1. Organize seu banco de questões</h3>
            <p>
              Cadastre ou importe questões, associe habilidades BNCC/SAEB e revise os itens antes de
              utilizá-los nas avaliações.
            </p>
            <Link to="/login">
              Acessar questões <ArrowRight size={15} />
            </Link>
          </article>
          <article>
            <div className="landing-feature-icon">
              <ClipboardList />
            </div>
            <h3>2. Monte avaliações</h3>
            <p>
              Selecione questões, distribua habilidades e confira a composição do simulado antes de
              finalizar a atividade.
            </p>
            <Link to="/login">
              Criar avaliação <ArrowRight size={15} />
            </Link>
          </article>
          <article>
            <div className="landing-feature-icon">
              <ChartNoAxesCombined />
            </div>
            <h3>3. Acompanhe os resultados</h3>
            <p>
              Consulte indicadores por turma e disciplina para reconhecer avanços e identificar
              pontos que precisam de atenção.
            </p>
            <Link to="/login">
              Ver desempenho <ArrowRight size={15} />
            </Link>
          </article>
          <article>
            <div className="landing-feature-icon">
              <Target />
            </div>
            <h3>4. Planeje as próximas ações</h3>
            <p>
              Transforme os dados observados em prioridades de aprendizagem e organize ações de
              recomposição com sua equipe.
            </p>
            <Link to="/login">
              Planejar ações <ArrowRight size={15} />
            </Link>
          </article>
        </div>
      </section>
      <section id="recursos" className="landing-guide">
        <div>
          <span className="eyebrow">COMECE EM POUCOS PASSOS</span>
          <h2>Uma rotina simples para decisões melhores.</h2>
          <p>
            <strong>Professor:</strong> organize questões, prepare avaliações e acompanhe as
            necessidades das suas turmas.
          </p>
          <p>
            <strong>Gestor:</strong> consulte a visão geral da escola, identifique tendências e
            apoie o planejamento pedagógico.
          </p>
          <Link to="/login" className="landing-cta landing-cta-large">
            Escolher meu perfil <ArrowRight size={18} />
          </Link>
        </div>
        <div className="landing-guide-steps">
          <div>
            <span>01</span>
            <div>
              <b>Entre no ambiente</b>
              <small>Escolha o perfil de professor ou gestor.</small>
            </div>
          </div>
          <div>
            <span>02</span>
            <div>
              <b>Abra a ferramenta</b>
              <small>Use o menu para acessar questões, avaliações ou indicadores.</small>
            </div>
          </div>
          <div>
            <span>03</span>
            <div>
              <b>Defina o próximo passo</b>
              <small>Consulte os dados e transforme os achados em ações pedagógicas.</small>
            </div>
          </div>
        </div>
      </section>
      <footer className="landing-footer">
        <Link to="/" className="public-brand">
          <img src="/marca_mentary_horizontal.webp" alt="Mentary" className="brand-logo" />
        </Link>
        <span>Inteligência educacional para transformar aprendizagem.</span>
        <span>© 2026 Mentary · @Raiatech</span>
      </footer>
    </main>
  );
}

