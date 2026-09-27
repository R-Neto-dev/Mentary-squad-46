# Mentary

## Squad 46

**Integrantes:**
- Reginaldo Alves
- Luan Melo Guimarães
- José Guilherme
- Lucas Silva
- Eyck Silva

---

## Fluxo de desenvolvimento

A branch `main` é protegida e reflete sempre o código validado do projeto. Nenhuma alteração é enviada diretamente para ela: toda mudança passa por uma branch própria e por um Pull Request.

1. Criar uma branch para cada nova funcionalidade ou correção;
2. Utilizar o padrão de nomenclatura: `feature/USxx-descricao` (exemplo: `feature/US05-dashboard-coordenador`);
3. Realizar as alterações e commits na branch criada;
4. Abrir um Pull Request para a branch `main`;
5. Não realizar commits ou pushes diretamente na `main`;
6. Todo código destinado à `main` deve passar pelo fluxo de Pull Request.

### Criando a sua branch

```bash
# 1. Vá para a branch principal e puxe as atualizações
git checkout main
git pull origin main

# 2. Crie a sua branch a partir da main, seguindo o padrão feature/USxx-descricao
git checkout -b feature/US03-extrator-pdf
```

### Enviando o seu trabalho

```bash
git add .
git commit -m "feat: adiciona extração de enunciado e alternativas do PDF"
git push origin feature/US03-extrator-pdf
```

### Regras de Pull Request

* Todo PR deve ter como destino a branch `main`.
* O título do PR deve ser claro e, na descrição, referenciar a Issue relacionada (ex.: `Resolve #12`).
* O PR só pode ser mesclado após passar pela revisão de outro integrante do squad (Code Review). Quem abre o PR não aprova o próprio PR.
* O merge só é feito depois que os checks/CI (quando configurados) estiverem passando.
* Depois do merge, a branch de origem pode ser removida.

A branch `main` está configurada no GitHub com proteção de branch (*Settings → Branches*), exigindo Pull Request para qualquer alteração e bloqueando push direto, inclusive para administradores.
