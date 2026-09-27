# Personas — Mentary: Extrator de Questões e Inteligência Avaliativa

_Residência em Software & IA · Empresa: Raiatech · Squad 46_

> Os perfis seguem a nomenclatura dos documentos do desafio e dos manuais da Mentary (Professor, Coordenador Pedagógico, Gestor Escolar, Gestor da Rede de Ensino e Administrador). A revisão de questões é uma **permissão** concedida a um professor, não um perfil separado.

## Persona 1 — Mariana Oliveira, Gestora da Rede de Ensino

**Idade:** 32 anos

**Perfil na Mentary:** Gestor da Rede de Ensino

**Formação:** Pedagogia / Gestão Educacional

**Familiaridade com tecnologia:** Média. Usa painéis e planilhas, mas precisa de ferramentas simples.

**Contexto:** Acompanha várias escolas da rede e usa os resultados dos simulados para apoiar decisões de políticas e de alocação de recursos.

**Objetivo:** Melhorar a qualidade da educação por meio da análise de dados e de decisões estratégicas.

**Frustração:** Dificuldade para organizar muitos dados, comparar escolas e gerar relatórios consolidados.

**Necessidade-chave:** Ter uma ferramenta simples para visualizar, comparar e analisar dados das escolas e da rede, com exportação de relatórios consolidados.

**Cenário crítico:** Precisa tomar uma decisão importante, mas os dados estão espalhados e os relatórios demoram para ser produzidos.

**Métrica de sucesso:** Reduzir o tempo de análise e de geração de relatórios, facilitando decisões mais rápidas e eficientes (meta a validar com a Raiatech).

---

## Persona 2 — Carla Mendes, Professora de Matemática

**Idade:** 38 anos

**Perfil na Mentary:** Professor

**Formação:** Licenciada em Matemática, com pós-graduação em Educação Digital

**Familiaridade com tecnologia:** Média. Tem boa formação pedagógica, mas pouco tempo disponível.

**Contexto:** Usa a Mentary para extrair questões de provas antigas em PDF, montar simulados no Construtor e acompanhar o desempenho da turma pelos dashboards.

**Objetivo:** Montar avaliações alinhadas à BNCC/SAEB rapidamente e identificar a tempo em que ponto cada aluno trava.

**Frustração:** Cadastrar questão manualmente é demorado e repetitivo; depois da prova, os dados brutos não viram sozinhos informação pedagógica útil.

**Necessidade-chave:** Interface de revisão rápida (confiar no que foi extraído sem precisar redigitar) e dashboards que já apontem a habilidade ou o descritor crítico, não só a nota final.

**Cenário crítico:** Entre uma aula e outra, ela aprova às pressas um simulado montado no Construtor sem checar o alerta do Validador Pedagógico e aplica uma prova desbalanceada (concentrada em poucos descritores) sem perceber.

**Métrica de sucesso:** Tempo entre "material em mãos" e "simulado publicado"; percentual de alunos corretamente identificados como precisando de reforço.

---

## Persona 3 — Beatriz Souza, Coordenadora Pedagógica

**Idade:** 41 anos

**Perfil na Mentary:** Coordenador Pedagógico

**Formação:** Pedagogia, com especialização em Gestão Escolar

**Familiaridade com tecnologia:** Média. Usa painéis e planilhas, mas não configura sistemas.

**Contexto:** Acompanha o desempenho de todas as turmas da escola, orienta os professores com base nos resultados dos simulados e define estratégias de intervenção e recomposição da aprendizagem.

**Objetivo:** Identificar descritores e habilidades críticos da escola como um todo, comparar turmas e priorizar ações de recomposição.

**Frustração:** Dados fragmentados por turma e por professor; dificuldade de enxergar padrões recorrentes entre disciplinas e séries e de saber se as intervenções estão trazendo resultado.

**Necessidade-chave:** Dashboard do Coordenador com comparação entre turmas, descritores críticos, distribuição dos estudantes por faixa de desempenho e acompanhamento das intervenções já aplicadas.

**Cenário crítico:** Após um simulado diagnóstico, precisa decidir onde intervir. Se o sistema não destacar os descritores necessários, os alunos passam de ano sem as habilidades essenciais.

**Métrica de sucesso:** Identificar rapidamente quais turmas e descritores precisam de mais atenção (meta a validar) e reduzir o número de descritores críticos entre avaliações consecutivas.

---

## Persona 4 — José Amorim, Gestor Escolar

**Idade:** 42 anos

**Perfil na Mentary:** Gestor Escolar

**Formação:** Licenciatura, com especialização em Gestão Escolar

**Familiaridade com tecnologia:** Média.

**Contexto:** Responde pelos resultados da escola perante a rede de ensino e acompanha a saúde geral da escola ao longo do tempo.

**Objetivo:** Ter uma visão consolidada da escola: resultados por componente curricular, participação por turma, comparação entre anos escolares, descritores prioritários, evolução e situação das ações de intervenção.

**Frustração:** Os resultados chegam tarde e em formatos diferentes, e ele não sabe se as intervenções estão realmente acontecendo.

**Necessidade-chave:** Dashboard do Gestor Escolar com resultados consolidados, evolução da escola e status das ações, mostrando o tamanho da amostra junto de cada indicador.

**Cenário crítico:** Ao apresentar os resultados à rede, interpreta a queda de uma turma pequena como piora real, quando é apenas oscilação estatística, e decide com base em um alerta de peso visual exagerado.

**Métrica de sucesso:** Tomar decisões com o painel sem precisar solicitar relatórios extras aos coordenadores (meta a validar).

---

## Persona 5 — Camila Ferreira, Professora com permissão de Revisão

**Idade:** 34 anos

**Perfil na Mentary:** Professor com a permissão de Revisão de Questões, concedida pela administração

**Formação:** Licenciatura em Pedagogia, com pós-graduação em Avaliação Educacional

**Familiaridade com tecnologia:** Intermediária. Confortável com planilhas, sistemas de gestão escolar e editores de texto, mas não é uma pessoa técnica.

**Contexto:** Usa a Mentary para revisar e aprovar questões extraídas automaticamente de materiais educacionais (PDFs, listas de exercícios, provas antigas), comparando o conteúdo extraído com o documento original antes de liberá-lo para o Banco de Questões.

**Objetivo:** Aprovar questões com confiança de que estão fiéis ao material original e prontas para avaliações reais, com gabarito correto, alternativas bem formatadas e classificação pedagógica completa (BNCC, descritor, componente curricular e dificuldade).

**Frustração:** Não ter certeza, à primeira vista, se a extração capturou tudo corretamente; precisa comparar lado a lado com o original. Imagens, gráficos e tabelas de PDFs de baixa qualidade podem vir cortados ou na posição errada, e classificar pedagogicamente cada questão consome tempo mental, mesmo com a digitação automatizada.

**Necessidade-chave:** Interface de revisão lado a lado (documento original × questão extraída), com campos editáveis para enunciado, alternativas, gabarito e imagens, além de rastreabilidade automática (origem, página, data, quem enviou, quem aprovou).

**Cenário crítico:** Recebe um lote de 25 questões extraídas de um PDF de avaliação. Ao comparar, percebe que uma imagem veio cortada e que o gabarito de outra questão está errado (a IA marcou uma alternativa que não é a correta). Corrige ambos antes de aprovar, sabendo que o erro chegaria a uma prova aplicada a centenas de alunos.

**Métrica de sucesso:** Redução do tempo médio de revisão por questão, mantendo zero questões com gabarito incorreto ou classificação pedagógica incompleta liberadas para o Banco de Questões.

---

## Persona 6 — Ricardo Nascimento, Administrador da Instituição

**Idade:** 45 anos

**Perfil na Mentary:** Administrador da Instituição (ou da Plataforma)

**Formação:** Gestão da Tecnologia da Informação / Administração

**Familiaridade com tecnologia:** Alta. Confortável com sistemas de gestão, planilhas e importação de dados em massa (CSV).

**Contexto:** Mantém a estrutura organizacional da Mentary funcionando: cadastra instituições, turmas e usuários (professores, coordenadores, estudantes), inclusive em lote por CSV, e gera QR Codes e carteirinhas dos estudantes. Também concede a permissão de Revisão de Questões aos professores designados.

**Objetivo:** Manter o cadastro sempre organizado e atualizado, garantindo que cada pessoa tenha o acesso correto no momento certo: professores, revisores, coordenadores, gestores e estudantes, sem inconsistências e sem ver dados que não lhe pertencem.

**Frustração:** Cadastrar usuários um a um quando a instituição é grande e lidar com exclusões recusadas porque ainda existe algo vinculado ao registro, sem saber de imediato o que está bloqueando.

**Necessidade-chave:** Fluxo de cadastro, edição e remoção claro e previsível, com a regra de que a exclusão só é permitida se não houver nada vinculado; permissões e perfis de acesso bem definidos; mensagens que indiquem o que impede uma exclusão.

**Cenário crítico:** Recebe 50 novos alunos no início do semestre e usa a importação por CSV (nome, email, data de nascimento, papel), garantindo que o arquivo siga o padrão exigido. Depois tenta excluir uma instituição de teste e o sistema recusa porque ainda há usuários vinculados; ele precisa identificar e remover esses vínculos primeiro.

**Métrica de sucesso:** Redução do tempo gasto para cadastrar usuários em massa (via CSV), zero exclusões acidentais de dados em uso e zero acessos indevidos a dados de estudantes.

---
