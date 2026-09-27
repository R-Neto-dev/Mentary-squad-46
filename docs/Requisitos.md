# Levantamento de Requisitos — Mentary: Extrator de Questões e Inteligência Avaliativa

_Residência em Software & IA · Empresa: Raiatech · Squad 46_

## 1. Introdução

### 1.1 Objetivo

Este documento consolida os requisitos funcionais e não funcionais do MVP integrado à Mentary, organizado nas três capacidades do desafio: transformar materiais em questões estruturadas, transformar questões em avaliações e transformar respostas em decisões pedagógicas. O fluxo esperado é **extrair → revisar → estruturar → armazenar → avaliar → processar → analisar → recomendar → intervir → acompanhar**.

### 1.2 Escopo

**Dentro do escopo da Residência:** Extrator de Questões, interface de revisão, integrações necessárias e camada de Inteligência Avaliativa (indicadores, qualidade das questões, dashboards e recomposição).

**Fora do escopo** (mantido pela equipe interna da Raiatech): Banco de Questões, Construtor de Simulados, configurações da avaliação, aplicação com rolagem, controle do tempo e registro das respostas. Esses componentes aparecem aqui apenas como pontos de integração.

### 1.3 Como ler os requisitos

Cada requisito tem um identificador, uma prioridade e uma origem.

| Item | Significado |
|---|---|
| MVP | Requisito prioritário para o MVP, conforme o escopo esperado no documento do desafio. |
| Complementar | Previsto no desafio como funcionalidade "poderá" ou de segunda entrega. |
| Futuro | Evolução prevista, fora do MVP. |
| DD | Documento de Descrição Detalhada do Desafio. |
| SL | Slides do Desafio Mentary (blueprint). |
| MQ | Modelo da questão para compatibilidade. |
| MA / MP | Manual do Administrador / Manual do Professor. |
| EP | Entrega Parcial TAKEOFF (personas e casos de borda). |
| PR | Proposta da equipe, derivada dos documentos; precisa de validação com a Raiatech. |

> A classificação de prioridade é uma proposta do squad, baseada no escopo do MVP descrito no desafio, e deve ser confirmada com a Raiatech.

### 1.4 Perfis de usuário

| Perfil | Papel no sistema |
|---|---|
| Administrador da Plataforma | Gerencia instituições, modalidades e administradores. Define faixas de desempenho e regras de alerta (configuração da Mentary). |
| Administrador da Instituição | Gerencia usuários, turmas e permissões da instituição; concede a permissão de Revisão de Questões. |
| Gestor da Rede de Ensino | Compara escolas, acompanha descritores críticos recorrentes e exporta relatórios consolidados. Perfil ainda inexistente nos manuais. |
| Gestor Escolar | Acompanha resultados consolidados, evolução e intervenções da escola. Perfil ainda inexistente nos manuais. |
| Coordenador Pedagógico | Compara turmas, identifica descritores críticos e acompanha intervenções. |
| Professor | Envia documentos, monta simulados, analisa o desempenho da turma e aprova planos de recomposição. |
| Professor com permissão de Revisão | Revisa e aprova questões extraídas antes de entrarem no Banco. A revisão é uma permissão, não um perfil separado. |
| Estudante | Usuário indireto: gera as respostas e os dados comportamentais; não acessa os módulos de extração, revisão e análise. |

### 1.5 Resumo dos requisitos

**Requisitos funcionais**

| Módulo | Total | MVP | Complementar | Futuro |
|---|---|---|---|---|
| Extrator de Questões | 18 | 10 | 7 | 1 |
| Interface de revisão e aprovação | 13 | 11 | 2 | 0 |
| Integração com o Banco de Questões | 9 | 7 | 2 | 0 |
| Construtor de Simulados e Validador Pedagógico | 10 | 2 | 8 | 0 |
| Recebimento e processamento de aplicações | 11 | 7 | 4 | 0 |
| Indicadores e relatórios de desempenho | 9 | 6 | 3 | 0 |
| Análise da qualidade das questões | 6 | 3 | 3 | 0 |
| Dashboards por perfil | 5 | 2 | 3 | 0 |
| Recomposição da aprendizagem | 12 | 7 | 5 | 0 |
| Acesso, perfis e permissões | 6 | 5 | 1 | 0 |
| Catálogos e configurações | 4 | 3 | 1 | 0 |
| Total | 103 | 63 | 39 | 1 |

**Requisitos não funcionais**

| Categoria | Total | MVP | Complementar | Futuro |
|---|---|---|---|---|
| Desempenho | 4 | 3 | 1 | 0 |
| Confiabilidade e resiliência | 5 | 4 | 1 | 0 |
| Qualidade e governança da IA | 6 | 5 | 1 | 0 |
| Segurança e privacidade | 9 | 8 | 1 | 0 |
| Usabilidade e acessibilidade | 7 | 5 | 2 | 0 |
| Integração e interoperabilidade | 6 | 6 | 0 | 0 |
| Manutenibilidade | 4 | 4 | 0 | 0 |
| Testabilidade e qualidade | 4 | 3 | 1 | 0 |
| Infraestrutura e implantação | 3 | 3 | 0 | 0 |
| Escalabilidade | 3 | 1 | 2 | 0 |
| Observabilidade e custo | 3 | 2 | 1 | 0 |
| Conformidade e direitos autorais | 2 | 1 | 1 | 0 |
| Compatibilidade | 1 | 1 | 0 | 0 |
| Total | 57 | 46 | 11 | 0 |

## 2. Requisitos funcionais

### RF-EXT · Extrator de Questões

_Transformar materiais educacionais em questões estruturadas (Capacidade 1)._

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RF-EXT-01 | Permitir o upload de documentos em PDF contendo questões (formato prioritário do MVP). | MVP | DD, SL |
| RF-EXT-02 | Permitir o upload de imagens de páginas (JPG/PNG) e de arquivos estruturados (CSV, XLSX, JSON). | Compl. | DD, SL |
| RF-EXT-03 | Validar o arquivo no envio (tipo, tamanho máximo e integridade) e informar o erro de forma clara. | MVP | PR |
| RF-EXT-04 | Processar o arquivo de forma assíncrona, exibindo o status (enviado, em processamento, extraído, com erro) sem bloquear o usuário. | MVP | PR |
| RF-EXT-05 | Extrair o texto de PDFs que possuem camada de texto. | MVP | DD |
| RF-EXT-06 | Aplicar OCR em documentos escaneados, fotos e imagens, quando necessário. | Compl. | DD, EP |
| RF-EXT-07 | Identificar, em cada questão, o número ou identificação do item, o enunciado e as alternativas de resposta. | MVP | DD |
| RF-EXT-08 | Identificar o gabarito quando disponível (no item ou em gabarito ao final do documento). Se ausente, marcar “sem gabarito”; o sistema nunca deve inferir ou inventar um gabarito. | MVP | DD, EP |
| RF-EXT-09 | Extrair e associar à questão correspondente as imagens, gráficos, tabelas, diagramas e figuras. | Compl. | DD |
| RF-EXT-10 | Registrar, por questão, o documento e a página de origem, a data da extração e o usuário que enviou o arquivo. | MVP | DD |
| RF-EXT-11 | Indicar o nível de confiança por questão e por campo extraído, sinalizando layout ambíguo, alternativas incompletas, imagens possivelmente cortadas e possíveis falsos positivos (texto comum identificado como questão). | MVP | EP |
| RF-EXT-12 | Sugerir metadados pedagógicos (componente curricular, ano/etapa, tema, dificuldade, habilidade BNCC e descritor) por regras e palavras-chave. As sugestões são sempre editáveis e nunca definitivas. | MVP | DD |
| RF-EXT-13 | Sugerir a classificação pedagógica com serviços de Inteligência Artificial (modelos de linguagem), em complemento às regras. | Compl. | DD, EP |
| RF-EXT-14 | Importar arquivos CSV/XLSX/JSON mapeando colunas para os campos da questão e gerando relatório das linhas inválidas. | Compl. | DD |
| RF-EXT-15 | Em caso de falha, timeout ou indisponibilidade de OCR/IA, preservar o documento, registrar o erro, permitir novo processamento e, quando possível, seguir com extração por regras. | MVP | EP |
| RF-EXT-16 | Permitir reprocessar um documento ou uma questão específica. | Compl. | PR |
| RF-EXT-17 | Alertar sobre a qualidade estimada de documentos escaneados, tortos ou fotografados antes da revisão. | Compl. | EP |
| RF-EXT-18 | Sinalizar questões com possibilidade de associação a recursos de Realidade Aumentada. | Futuro | DD |

### RF-REV · Interface de revisão e aprovação

_Human-in-the-loop: a IA extrai, o humano valida antes de a questão entrar no Banco._

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RF-REV-01 | Listar os documentos enviados com a contagem de questões por status (aguardando validação, em revisão, aprovada, rejeitada). | MVP | DD, SL |
| RF-REV-02 | Exibir lado a lado o documento original (página de origem) e a questão extraída. | MVP | DD, SL, EP |
| RF-REV-03 | Permitir editar enunciado, alternativas (incluir, remover e reordenar), gabarito, imagens e fonte. | MVP | DD |
| RF-REV-04 | Permitir selecionar o componente curricular, o ano/etapa, o tema e o nível de dificuldade. | MVP | DD |
| RF-REV-05 | Permitir associar habilidades da BNCC e descritores por busca no catálogo. | MVP | DD |
| RF-REV-06 | Permitir descartar itens identificados indevidamente como questão e rejeitar ou devolver questões informando o motivo. | MVP | PR |
| RF-REV-07 | Destacar visualmente os campos de baixa confiança e as questões com alerta pendente. | MVP | EP |
| RF-REV-08 | Impedir a aprovação de questão sem enunciado, com menos de duas alternativas, sem gabarito, sem componente curricular ou sem ao menos uma habilidade/descritor associado. | MVP | EP, PR |
| RF-REV-09 | Restringir a aprovação a usuários com a permissão de Revisão de Questões. | MVP | PR |
| RF-REV-10 | Registrar o responsável pela aprovação e o histórico de alterações (quem, quando, campo, valor anterior e novo). | MVP | DD |
| RF-REV-11 | Incorporar a questão ao Banco de Questões Mentary somente após a revisão e a aprovação. | MVP | DD, SL |
| RF-REV-12 | Oferecer navegação rápida entre as questões do lote (próxima pendente, filtro por baixa confiança) e impedir aprovação em massa de questões com alerta pendente. | Compl. | EP |
| RF-REV-13 | Alertar sobre possível duplicidade ou semelhança com questões já existentes no Banco antes da aprovação. | Compl. | DD, EP |

### RF-BQ · Integração com o Banco de Questões

_Integração ao Banco e às estruturas existentes da Mentary, sem sistemas paralelos._

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RF-BQ-01 | Persistir a questão aprovada no Banco Mentary de acordo com o modelo de compatibilidade (question_id, fk_user_id, fk_institution_id, title, question_type, content_type, fk_content_id, correct_answer_index, answer_options_type, answer_options, question_visibility_status, answers_explanation, ar_gallery_id, subjects, created_at, updated_at, metadata). | MVP | MQ |
| RF-BQ-02 | Gravar o gabarito como índice da alternativa correta (base 0), as alternativas como texto e o tipo como “MULTIPLA ESCOLHA”. | MVP | MQ |
| RF-BQ-03 | Gravar a classificação pedagógica em metadata (bncc, descritor, ano_escolar, dificuldade, prova, origem). | MVP | MQ |
| RF-BQ-04 | Definir a visibilidade (PUBLICO ou PRIVADO) e vincular a questão ao usuário e à instituição. | MVP | MQ |
| RF-BQ-05 | Persistir a rastreabilidade (documento, página, data da extração, usuário que enviou, aprovador e histórico) em estruturas complementares ligadas ao question_id. | MVP | DD, PR |
| RF-BQ-06 | Registrar a origem da questão, diferenciando: cadastrada manualmente, inserida no Construtor, importada de arquivo estruturado, gerada pelo Extrator e, futuramente, por IA. | MVP | DD |
| RF-BQ-07 | Associar imagem, modelo 3D (.glb) ou URL à questão (content_type e fk_content_id) e o registro de Realidade Aumentada (ar_gallery_id), quando existirem. | Compl. | MQ, MP |
| RF-BQ-08 | Permitir consultar o Banco com filtros por componente curricular, ano escolar, tema, habilidade BNCC, descritor, dificuldade, tipo, fonte, origem, status de revisão e histórico de aplicação (em conjunto com a equipe Raiatech). | MVP | DD |
| RF-BQ-09 | Impedir a alteração de questão já respondida por algum estudante; alterações passam a gerar uma nova versão da questão. | Compl. | MP, PR |

### RF-SIM · Construtor de Simulados e Validador Pedagógico

_Transformar questões em avaliações (Capacidade 2). O Construtor é mantido pela equipe Raiatech; aqui está a integração._

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RF-SIM-01 | Permitir consultar e selecionar, no Construtor de Simulados, as questões do Banco, inclusive as originadas do Extrator. | MVP | DD |
| RF-SIM-02 | Permitir montar simulados diagnósticos, avaliações formativas, listas de exercícios e avaliações alinhadas às matrizes do SAEB. | MVP | DD, SL |
| RF-SIM-03 | Permitir incluir novos itens diretamente durante a elaboração da avaliação, mantendo a origem “Construtor”. | Compl. | DD |
| RF-SIM-04 | Validador Pedagógico: exibir a quantidade de questões por descritor e por habilidade da BNCC. | Compl. | DD, SL |
| RF-SIM-05 | Validador Pedagógico: exibir a distribuição por nível de dificuldade e sinalizar desequilíbrio. | Compl. | DD, EP |
| RF-SIM-06 | Validador Pedagógico: sinalizar descritores não contemplados e concentração excessiva em um descritor. | Compl. | DD, SL |
| RF-SIM-07 | Validador Pedagógico: sinalizar questões sem gabarito, sem habilidade ou descritor associado e ainda não validadas. | Compl. | DD, SL |
| RF-SIM-08 | Validador Pedagógico: sinalizar questões semelhantes ou repetidas. | Compl. | DD |
| RF-SIM-09 | Validador Pedagógico: estimar o tempo de realização da prova. | Compl. | DD, SL |
| RF-SIM-10 | Exigir confirmação explícita para publicar um simulado com alertas críticos em aberto, registrando quem confirmou. | Compl. | EP, PR |

### RF-APL · Recebimento e processamento de aplicações

_Base da Inteligência Avaliativa (Capacidade 3)._

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RF-APL-01 | Receber os dados de uma aplicação: questões aplicadas, gabaritos, respostas dos estudantes, escola, turma, componente, habilidades BNCC, descritores, data, tempo total, tempo por questão, respondidas, em branco, puladas, revisitadas, mudanças de resposta, ordem de navegação e status de conclusão. | MVP | DD |
| RF-APL-02 | Validar a consistência dos dados recebidos (questões e estudantes existentes, alternativa dentro do intervalo, duplicidade) e registrar as rejeições. | MVP | PR |
| RF-APL-03 | Tornar o recebimento idempotente: reenviar a mesma aplicação não deve duplicar respostas. | MVP | PR |
| RF-APL-04 | Classificar cada resposta como acerto, erro ou omissão (em branco ou pulada). | MVP | DD, SL |
| RF-APL-05 | Calcular o desempenho por estudante, por turma e por descritor. | MVP | DD |
| RF-APL-06 | Calcular o desempenho por habilidade BNCC, questão, escola, rede, componente, ano escolar, aplicação e período. | Compl. | DD |
| RF-APL-07 | Comparar os resultados de duas aplicações. | MVP | DD |
| RF-APL-08 | Exibir a evolução entre várias aplicações. | Compl. | DD |
| RF-APL-09 | Considerar o status de conclusão (concluída, incompleta, não realizada) no cálculo de participação e de desempenho. | MVP | DD |
| RF-APL-10 | Recalcular os resultados quando o gabarito de uma questão for corrigido, mantendo o registro da correção. | Compl. | SL, PR |
| RF-APL-11 | Processar os dados comportamentais (tempo por questão, ordem de navegação, revisitas e mudanças de resposta) e derivar indicadores de gestão do tempo. | Compl. | DD, SL |

### RF-IND · Indicadores e relatórios de desempenho

_Transformar respostas em informação pedagógica._

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RF-IND-01 | Calcular os indicadores: percentual de participação, percentual geral de acertos, quantidade de acertos e erros, percentual de questões não respondidas, tempo médio de realização e tempo médio por questão. | MVP | DD |
| RF-IND-02 | Permitir análises por estudante, turma e descritor no MVP, ampliando para escola, rede, componente, ano escolar, questão, habilidade, aplicação e período. | MVP | DD |
| RF-IND-03 | Gerar o relatório de desempenho por descritor: código e descrição, componente, número de questões, número de estudantes, % de acertos, erros e omissões, tempo médio, questões associadas, comparação entre turmas e escolas, evolução e nível de atenção pedagógica. | MVP | DD |
| RF-IND-04 | Gerar relatório equivalente por habilidade da BNCC. | Compl. | DD |
| RF-IND-05 | Classificar automaticamente o nível de atenção pedagógica (crítico, atenção, intermediário, adequado) conforme faixas de desempenho configuráveis pela administração da Mentary, com valores padrão. | MVP | DD |
| RF-IND-06 | Identificar lacunas de aprendizagem: descritores e habilidades com baixo desempenho e estudantes que necessitam de acompanhamento. | MVP | DD |
| RF-IND-07 | Exibir o tamanho da amostra (número de estudantes e respostas) junto de cada indicador e sinalizar amostras pequenas como de baixa confiabilidade. | MVP | EP |
| RF-IND-08 | Apresentar os dados comportamentais como contexto, sem classificar o estudante apenas por tempo ou revisitas. | Compl. | EP |
| RF-IND-09 | Exportar relatórios consolidados (formato a definir). | Compl. | DD |

### RF-QUA · Análise da qualidade das questões

_Auditoria automática do Banco de Questões com base nas aplicações._

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RF-QUA-01 | Calcular por questão: quantidade de aplicações, estudantes que responderam, % de acertos, erros e omissões, distribuição por alternativa, alternativa incorreta mais escolhida, tempo médio, frequência de revisitas e de mudanças de resposta, desempenho por turma e histórico de utilização. | MVP | DD |
| RF-QUA-02 | Gerar alertas por regras configuráveis: possivelmente fácil demais (alto acerto e tempo muito baixo), possivelmente difícil demais, alto índice de respostas em branco, distratores pouco funcionais, tempo de resposta muito elevado e concentração inesperada em uma alternativa. | MVP | DD, SL |
| RF-QUA-03 | Alertar quando uma alternativa incorreta é mais escolhida que o gabarito (possível distrator confuso ou gabarito cadastrado errado). | MVP | SL |
| RF-QUA-04 | Permitir à administração configurar os limiares das regras de alerta, com valores padrão. | Compl. | DD, SL |
| RF-QUA-05 | Gerar alertas somente a partir de uma amostra mínima configurável, informando o tamanho da amostra. | Compl. | EP |
| RF-QUA-06 | Permitir encaminhar uma questão alertada para revisão pedagógica (status “necessita revisão”) e registrar a decisão tomada. | Compl. | DD |

### RF-DSH · Dashboards por perfil

_Visões micro, meso, macro e global da inteligência avaliativa._

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RF-DSH-01 | Dashboard do Professor: resultado geral da turma, participação, desempenho individual, desempenho por habilidade e por descritor, questões com maior índice de erro, estudantes que necessitam de acompanhamento, evolução entre avaliações e sugestões de intervenção. | MVP | DD, SL |
| RF-DSH-02 | Dashboard do Coordenador Pedagógico: comparação entre turmas, descritores críticos, distribuição dos estudantes por faixa de desempenho, padrões de dificuldade, acompanhamento das intervenções, comparação entre aplicações e priorização de ações de recomposição. | Compl. | DD, SL |
| RF-DSH-03 | Dashboard do Gestor Escolar: resultados consolidados, participação por turma, comparação entre anos escolares, desempenho por componente, descritores prioritários, evolução da escola e situação das ações de intervenção. | Compl. | DD, SL |
| RF-DSH-04 | Dashboard do Gestor da Rede de Ensino: comparação entre escolas, participação geral, desempenho por escola e por ano escolar, descritores críticos recorrentes, evolução da rede, identificação de escolas ou turmas que precisam de mais apoio e exportação de relatórios consolidados. | Compl. | DD, SL |
| RF-DSH-05 | Oferecer filtros, tabelas e gráficos em interface responsiva, reutilizando componentes entre os dashboards. | MVP | DD |

### RF-REC · Recomposição da aprendizagem

_Planos de intervenção sugeridos por regras e por IA, sempre validados pelo professor._

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RF-REC-01 | Identificar os descritores e habilidades críticos a partir das faixas de desempenho. | MVP | DD, SL |
| RF-REC-02 | Cruzar os descritores críticos com as habilidades da BNCC relacionadas. | MVP | SL |
| RF-REC-03 | Sugerir, por regras, questões do Banco Mentary para os descritores críticos, priorizando as ainda não respondidas pelos estudantes. | MVP | DD, SL |
| RF-REC-04 | Sugerir listas de exercícios e atividades de revisão focadas nas lacunas identificadas. | MVP | DD |
| RF-REC-05 | Permitir ao professor revisar, ajustar e aprovar o plano; nenhuma recomendação é aplicada sem aprovação. | MVP | DD, SL |
| RF-REC-06 | Persistir o plano de intervenção (descritores, estudantes ou turmas, itens sugeridos, responsável, datas e status: rascunho, aprovado, aplicado, concluído). | MVP | DD |
| RF-REC-07 | Selecionar estudantes ou turmas com dificuldades semelhantes para a mesma intervenção. | Compl. | DD |
| RF-REC-08 | Sugerir com apoio de IA roteiros gamificados, sequências de aprendizagem e nova avaliação de acompanhamento. | Compl. | DD, SL |
| RF-REC-09 | Permitir registrar a nova avaliação de acompanhamento e comparar seus resultados com o diagnóstico inicial. | Compl. | DD |
| RF-REC-10 | Permitir que coordenador e gestores acompanhem o status das intervenções. | Compl. | DD |
| RF-REC-11 | Permitir ao professor excluir conteúdos já vistos ou ajustar o plano ao tempo disponível. | Compl. | EP |
| RF-REC-12 | Em caso de indisponibilidade do serviço de IA, gerar as sugestões por regras e informar o usuário. | MVP | EP |

### RF-ACE · Acesso, perfis e permissões

_Reutilizar a autenticação e os cadastros existentes da Mentary._

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RF-ACE-01 | Utilizar a autenticação e os cadastros existentes (usuários, instituições, turmas, estudantes), sem criar sistemas paralelos. | MVP | DD, SL |
| RF-ACE-02 | Suportar os perfis Administrador da Plataforma, Administrador da Instituição, Coordenador, Professor e Estudante, prevendo Gestor Escolar e Gestor da Rede de Ensino. | MVP | MA, MP, DD |
| RF-ACE-03 | Permitir que a administração conceda e revogue a permissão de Revisão de Questões a um usuário (por exemplo, a um professor). | MVP | PR |
| RF-ACE-04 | Restringir os dados pelo escopo do perfil: o professor vê as suas turmas, o coordenador e o gestor escolar veem a sua escola, o gestor da rede vê a sua rede. Nenhum perfil acessa dados de outra instituição. | MVP | EP |
| RF-ACE-05 | Impedir que estudantes acessem os módulos de extração, revisão, Banco e análise. | MVP | PR |
| RF-ACE-06 | Registrar trilha de auditoria de aprovações de questões, alterações de permissão e exportações de relatórios. | Compl. | PR |

### RF-CFG · Catálogos e configurações

_Dados de referência pedagógicos._

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RF-CFG-01 | Manter o catálogo de habilidades da BNCC (código, descrição, componente, ano/etapa). | MVP | DD, PR |
| RF-CFG-02 | Manter o catálogo de descritores das matrizes do SAEB (código, descrição, componente, etapa), identificando cada descritor pela combinação de componente, etapa e código. | MVP | DD, PR |
| RF-CFG-03 | Relacionar habilidades da BNCC a descritores. | Compl. | SL |
| RF-CFG-04 | Manter vocabulários controlados para componente curricular, ano/etapa e nível de dificuldade, evitando texto livre no metadata. | MVP | MQ, PR |

## 3. Requisitos não funcionais

### RNF-DES · Desempenho

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RNF-DES-01 | O upload e o início do processamento não devem bloquear a interface; o processamento é assíncrono, com feedback de progresso. | MVP | PR |
| RNF-DES-02 | A extração de um PDF típico (até 30 páginas) deve ser concluída em tempo a definir (meta a validar). | MVP | PR |
| RNF-DES-03 | Os dashboards de turma devem carregar em até 3 s e os relatórios consolidados de rede em até 10 s, sob a carga esperada (meta a validar). | MVP | PR |
| RNF-DES-04 | Os cálculos agregados devem usar índices ou pré-cálculo para não degradar com o volume de respostas. | Compl. | PR |

### RNF-CON · Confiabilidade e resiliência

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RNF-CON-01 | Falhas de OCR, IA, timeouts e limites de requisição devem ter tratamento definido (retentativas limitadas, mensagem clara), sem perda do documento enviado. | MVP | EP |
| RNF-CON-02 | A falha deve ser visível: itens com extração incompleta ou incerta nunca aparecem como corretos. | MVP | EP |
| RNF-CON-03 | O sistema nunca deve inventar gabarito nem aplicar classificação definitiva sem validação humana. | MVP | DD, EP |
| RNF-CON-04 | A aprovação de questões e a ingestão de aplicações devem ser transacionais e idempotentes. | MVP | PR |
| RNF-CON-05 | Definir com a Raiatech a política de backup e recuperação dos dados. | Compl. | PR |

### RNF-IA · Qualidade e governança da IA

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RNF-IA-01 | Medir a qualidade da extração em um conjunto de PDFs de referência (questões detectadas, alternativas completas, gabarito correto), com metas a validar. | MVP | PR |
| RNF-IA-02 | Registrar, por campo extraído, o método de obtenção (regra, OCR ou IA) e o nível de confiança. | MVP | PR |
| RNF-IA-03 | Todo resultado de IA (extração, classificação, alerta, recomendação) é uma sugestão sujeita a validação do professor ou revisor. | MVP | DD, SL |
| RNF-IA-04 | Alertas e recomendações usam linguagem probabilística (“possivelmente”) e exibem a evidência que os originou. | MVP | SL, EP |
| RNF-IA-05 | Não enviar dados pessoais de estudantes a serviços externos de IA; enviar apenas o conteúdo estritamente necessário. | MVP | PR |
| RNF-IA-06 | Registrar versão do modelo, prompts utilizados, latência e custo das chamadas de IA. | Compl. | PR |

### RNF-SEG · Segurança e privacidade

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RNF-SEG-01 | Autenticação obrigatória e autorização por perfil e escopo em todas as rotas da API. | MVP | DD, EP |
| RNF-SEG-02 | Isolamento total dos dados entre instituições e redes de ensino. | MVP | EP |
| RNF-SEG-03 | Comunicação protegida por HTTPS/TLS; criptografia em repouso para dados sensíveis (a definir). | MVP | PR |
| RNF-SEG-04 | Aderência à LGPD, com atenção a dados de crianças e adolescentes: finalidade, minimização, retenção e exclusão. | MVP | PR |
| RNF-SEG-05 | Validar e sanitizar uploads (tipo real do arquivo, tamanho, verificação de malware) e armazená-los fora de área pública. | MVP | PR |
| RNF-SEG-06 | Proteção contra as principais vulnerabilidades web (injeção, XSS, CSRF) e limitação de taxa de requisições. | MVP | PR |
| RNF-SEG-07 | Segredos e chaves de serviços de IA mantidos fora do código, em variáveis de ambiente. | MVP | PR |
| RNF-SEG-08 | Logs sem dados pessoais nem conteúdo sensível de estudantes. | MVP | PR |
| RNF-SEG-09 | Definir a política de retenção dos documentos enviados. | Compl. | PR |

### RNF-USA · Usabilidade e acessibilidade

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RNF-USA-01 | A interface de revisão deve priorizar produtividade: poucos cliques, edição direta nos campos e atalhos de teclado. | MVP | EP |
| RNF-USA-02 | Interfaces responsivas: desktop como prioridade para revisão e criação; dashboards utilizáveis em tablet e celular. | MVP | DD |
| RNF-USA-03 | Seguir os padrões visuais da Mentary, definidos em conjunto com a Raiatech. | MVP | DD |
| RNF-USA-04 | Mensagens de erro e de bloqueio devem explicar a causa e a ação recomendada (por exemplo, o que impede uma exclusão). | MVP | MA, EP |
| RNF-USA-05 | Gráficos com rótulos e legendas, com alternativa em tabela, sem depender apenas de cor para indicar alertas. | Compl. | PR |
| RNF-USA-06 | Atender às diretrizes de acessibilidade WCAG 2.1 nível AA. | Compl. | PR |
| RNF-USA-07 | Interface e mensagens em português do Brasil, com formatos de data e número locais. | MVP | PR |

### RNF-INT · Integração e interoperabilidade

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RNF-INT-01 | Integrar-se à arquitetura existente da Mentary, sem criar entidades paralelas para usuários, escolas, turmas, estudantes, questões ou simulados. | MVP | DD, SL |
| RNF-INT-02 | Expor APIs REST documentadas com Swagger/OpenAPI, com contratos definidos com a Raiatech e versionamento. | MVP | DD |
| RNF-INT-03 | Manter compatibilidade com o modelo de questão atual: novos dados em tabelas complementares ou campos opcionais. | MVP | MQ |
| RNF-INT-04 | Usar UUID v4 para identificadores e timestamps em UTC com fuso, conforme o modelo de questão. | MVP | MQ |
| RNF-INT-05 | Definir com a Raiatech o contrato de dados das aplicações, incluindo os eventos comportamentais. | MVP | DD |
| RNF-INT-06 | Padronizar as respostas de erro da API (código, mensagem e detalhes). | MVP | PR |

### RNF-MAN · Manutenibilidade

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RNF-MAN-01 | Usar TypeScript no front-end e no back-end, com ESLint e Prettier. | MVP | DD |
| RNF-MAN-02 | Arquitetura modular (extração, revisão, integração, análise, recomendação) com baixo acoplamento e serviços de IA atrás de interfaces substituíveis, permitindo evoluir de regras para modelos de linguagem. | MVP | DD, PR |
| RNF-MAN-03 | Migrações do banco versionadas com Prisma ORM. | MVP | DD |
| RNF-MAN-04 | Documentação técnica atualizada (README, decisões de arquitetura e API). | MVP | PR |

### RNF-TES · Testabilidade e qualidade

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RNF-TES-01 | Testes unitários (Jest ou Vitest), de componentes (React Testing Library) e ponta a ponta (Playwright ou Cypress) dos fluxos upload → revisão → aprovação e aplicação → dashboard. | MVP | DD |
| RNF-TES-02 | Integração contínua executando lint e testes a cada alteração. | MVP | DD |
| RNF-TES-03 | Conjunto de documentos de teste com casos de borda: baixa qualidade, sem gabarito, layout ambíguo, imagem essencial, texto que não é questão. | MVP | EP |
| RNF-TES-04 | Cobertura mínima de testes a definir (meta a validar). | Compl. | PR |

### RNF-INF · Infraestrutura e implantação

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RNF-INF-01 | Aplicação containerizada com Docker, executável em ambiente local e de homologação. | MVP | DD |
| RNF-INF-02 | Versionamento com Git/GitHub e pipeline de CI/CD. | MVP | DD |
| RNF-INF-03 | Configuração por variáveis de ambiente; hospedagem a definir com a Raiatech. | MVP | PR |

### RNF-ESC · Escalabilidade

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RNF-ESC-01 | Suportar várias instituições e redes simultaneamente. | MVP | PR |
| RNF-ESC-02 | Processar documentos em fila, com capacidade de aumentar o número de workers. | Compl. | PR |
| RNF-ESC-03 | Definir o volume-alvo (estudantes, aplicações e documentos) com a Raiatech. | Compl. | PR |

### RNF-OBS · Observabilidade e custo

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RNF-OBS-01 | Logs estruturados com identificador de correlação e tratamento centralizado de erros. | MVP | DD |
| RNF-OBS-02 | Métricas de falhas de extração, tempo de processamento e uso dos serviços de IA. | Compl. | PR |
| RNF-OBS-03 | Documentar as ferramentas de IA (gratuitas e pagas), limites de requisição e custo estimado por documento; degradar de forma controlada ao atingir limites. | MVP | EP |

### RNF-LEG · Conformidade e direitos autorais

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RNF-LEG-01 | Processar apenas materiais autorizados e registrar a fonte de cada questão. | MVP | DD |
| RNF-LEG-02 | Definir a política para questões derivadas de materiais protegidos (por exemplo, visibilidade padrão PRIVADO). | Compl. | PR |

### RNF-COM · Compatibilidade

| ID | Requisito | Prioridade | Origem |
|---|---|---|---|
| RNF-COM-01 | Funcionar nas duas últimas versões estáveis de Chrome, Edge, Firefox e Safari. | MVP | PR |

## 4. Restrições e premissas

- A equipe interna da Raiatech mantém o Banco de Questões, o Construtor de Simulados, a aplicação com rolagem, o controle de tempo e o registro das respostas.
- O desenvolvimento deve ser integrado à Mentary, sendo proibido criar sistemas paralelos para usuários, turmas, estudantes, questões ou simulados.
- Stack sugerida: React e TypeScript no front-end; Node.js e TypeScript no back-end com APIs REST e Swagger; PostgreSQL com Prisma ORM; Docker; Jest ou Vitest; Playwright ou Cypress; ESLint, Prettier e integração contínua.
- No MVP, a extração combina técnicas automatizadas com revisão humana; os alertas de qualidade são baseados em regras configuráveis, sem modelos psicométricos complexos.
- A IA atua como apoio: professor e equipe pedagógica revisam, ajustam e aprovam questões extraídas e recomendações antes de qualquer ação pedagógica.
- O modelo de questão atual contempla apenas múltipla escolha com alternativas em texto.
- Regra existente da plataforma: registros só podem ser excluídos quando não há nada vinculado a eles (turmas, usuários, questões).

## 5. Pontos a validar com a Raiatech

1. Perfis e entidades: Gestor Escolar, Gestor da Rede e Rede de Ensino não existem nos manuais atuais (só Instituição, Coordenador e Administrador).
2. Contrato dos dados de aplicação: quem registra os eventos comportamentais (ordem de navegação, revisitas, mudanças de resposta) e em que formato.
3. Catálogo de habilidades BNCC e descritores SAEB: quem fornece a base e como se relacionam.
4. Extensões do modelo de questão: verdadeiro ou falso, alternativas com imagem, mais de uma figura por questão, mais de uma habilidade ou descritor, versionamento e campos de rastreabilidade.
5. Relação entre Roteiro (modelo sequencial atual) e Simulado, e se as questões do Banco podem ser usadas em roteiros.
6. Escopo do MVP: quais dashboards e quais formatos de exportação entram, e se o Validador Pedagógico entra como parte do MVP.
7. Visibilidade padrão (PUBLICO ou PRIVADO) das questões extraídas e tratamento de direitos autorais de materiais didáticos.
8. Regra de aprovação: um revisor basta ou é necessária dupla aprovação para questões de avaliações de rede?
9. Provedores de IA e OCR (gratuitos ou pagos), limites de uso e política de dados, especialmente sobre dados de estudantes e LGPD.
10. Metas numéricas dos requisitos não funcionais: desempenho, cobertura de testes, volume-alvo e qualidade mínima de extração.
