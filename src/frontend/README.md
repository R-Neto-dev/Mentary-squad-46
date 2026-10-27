# Mentary — Inteligência Educacional

Protótipo frontend responsivo para apoiar professores, coordenação e gestão escolar na organização de questões, criação de avaliações, análise de aprendizagem e planejamento da recomposição.

**Aplicação demonstrativa:** https://purple-flow-insights.lovable.app  
**Editor Lovable:** https://lovable.dev/projects/2afb0b5c-72eb-49fd-9f99-104b4b1e2e1c

## Tecnologias
- React + TypeScript
- TanStack Start / TanStack Router
- Tailwind CSS 4 e design system próprio
- Lucide React
- Recharts
- Componentes Radix UI

## Escopo do protótipo
- Landing page institucional Mentary.
- Login demonstrativo com perfis Professora, Coordenadora e Gestora.
- Dashboards, gráficos e indicadores com dados fictícios compartilhados.
- Banco de questões com pesquisa, filtros, edição e revisão.
- Importação demonstrativa de PDF/imagem com etapa de revisão manual.
- Construtor de avaliações e validador pedagógico local.
- Habilidades BNCC/SAEB e planos de recomposição.
- Gestão de escolas, turmas e estudantes.
- Relatórios com impressão e exportação CSV.
- Notificações, histórico de atividades, configurações e ajuda.

## Dados e privacidade
Não há autenticação real, backend, Supabase, APIs externas ou IA real. Os dados de demonstração são mantidos no armazenamento local do navegador para que as alterações apareçam entre os módulos no mesmo dispositivo. A importação de arquivos simula a extração e exige revisão antes de salvar.

## Executar localmente
Requer Node.js e npm.

```sh
git clone https://github.com/R-Neto-dev/Mentary-squad-46.git
cd Mentary-squad-46/src/frontend
npm install
npm run dev
```

Scripts úteis: `npm run build`, `npm run lint` e `npm test`.

## Sincronização e publicação
- O projeto acompanha a branch padrão `main` quando a integração com o Lovable está conectada.
- Commits no GitHub devem aparecer no editor/preview do Lovable após a sincronização.
- Para atualizar o endereço público `purple-flow-insights.lovable.app`, abra o projeto no Lovable e use **Publish → Update/Publish changes**; o envio ao GitHub não publica automaticamente o site.

## Próximas verificações
- Rodar build, lint e testes de navegação no ambiente de desenvolvimento.
- Conferir a sincronização com o projeto Lovable conectado.
