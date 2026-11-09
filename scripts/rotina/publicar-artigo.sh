#!/bin/bash
# Rotina do blog (segunda, quarta e sexta, 9h): o Claude escreve o próximo artigo com a
# skill artigo-blog, e este script confere o resultado, roda o build e sobe o commit para
# o master. O Netlify publica sozinho a partir do push.
# Agendado pelo launchd: scripts/rotina/br.estugram.blog-artigo.plist
# Roda todo dia às 9h: publica o artigo agendado para hoje, se houver, e só escreve artigo novo
# na segunda, quarta e sexta.
# Rodar na mão: scripts/rotina/publicar-artigo.sh   (AUTOR=bia força a autora, FORCAR=1 escreve em qualquer dia)
# Opcional em .rotina/env: NETLIFY_BUILD_HOOK=<url> para publicar agendados sem commit vazio.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO"

HOJE="$(date +%F)"
LOCK="$REPO/.rotina/lock"
PAUTAS=".claude/skills/artigo-blog/pautas.md"
mkdir -p "$REPO/.rotina"
[ -f "$REPO/.rotina/env" ] && . "$REPO/.rotina/env"

# Notificação do macOS com o resultado (sucesso, nada a fazer ou erro).
notificar() {
  osascript - "$1" "$2" "$3" <<'APPLESCRIPT' || true
on run argv
  display notification (item 2 of argv) with title "Blog Estugram" subtitle (item 1 of argv) sound name (item 3 of argv)
end run
APPLESCRIPT
}

RESULTADO=""   # preenchido quando a rotina termina bem
MOTIVO=""      # preenchido nos abortos explícitos
ERRO_CMD=""
finalizar() {
  local codigo=$?
  rmdir "$LOCK" 2>/dev/null || true
  if [ "$codigo" -eq 0 ]; then
    [ -n "$RESULTADO" ] && notificar "Sucesso" "$RESULTADO" "Glass"
  else
    notificar "Erro na publicação" "${MOTIVO:-Falhou em: $ERRO_CMD} (veja .rotina/rotina.log)" "Basso"
  fi
}

echo "=== $(date '+%F %T') rotina artigo-blog"

# Uma execução por vez (o launchd pode disparar de novo ao acordar o Mac).
if ! mkdir "$LOCK" 2>/dev/null; then
  echo "Outra execução em andamento ($LOCK). Saindo."
  exit 0
fi
trap 'ERRO_CMD=$BASH_COMMAND' ERR
trap finalizar EXIT

# Alterações locais que já existiam ficam onde estão: só a nova publicação entra no commit.
sujos() { git status --porcelain --untracked-files=all | cut -c4- | sort; }
ANTES="$(sujos)"
if [ -n "$ANTES" ]; then
  echo "Alterações locais pré-existentes (ficam fora do commit):"
  echo "$ANTES"
fi
if echo "$ANTES" | grep -qxF "$PAUTAS"; then
  MOTIVO="$PAUTAS tem alterações locais não commitadas"
  exit 1
fi
if [ "$(git branch --show-current)" != "master" ]; then
  MOTIVO="O site-estugram não está no branch master"
  exit 1
fi

git pull --rebase --autostash

# Artigo agendado: o build esconde artigos com data futura (src/lib/blog.ts). Quando chega o dia,
# é preciso um build novo no Netlify para ele aparecer. Uma vez por dia (marca em .rotina/).
DO_DIA="$(git grep -l "^data: $HOJE" HEAD -- src/content/blog | sed 's/^HEAD://' | head -1 || true)"
if [ -n "$DO_DIA" ] && [ ! -f "$REPO/.rotina/agendado-$HOJE" ]; then
  TITULO_DIA="$(sed -n 's/^titulo: "\(.*\)"$/\1/p' "$DO_DIA" | head -1)"
  echo "Artigo agendado para hoje: $DO_DIA. Disparando build."
  if [ -n "${NETLIFY_BUILD_HOOK:-}" ]; then
    curl -fsS -X POST -d '{}' "$NETLIFY_BUILD_HOOK" >/dev/null
  else
    # Sem build hook, um commit vazio no master faz o Netlify publicar de novo.
    # --only sem caminhos: não leva nada que esteja no stage.
    git commit --allow-empty --only -m "Publica artigo agendado: ${TITULO_DIA:-$DO_DIA}"
    git push origin master
  fi
  touch "$REPO/.rotina/agendado-$HOJE"
  RESULTADO="Publicado (agendado): ${TITULO_DIA:-$DO_DIA}"
fi

# Já saiu artigo hoje? Não publica dois. (Só olha o que está commitado.)
if [ -n "$DO_DIA" ]; then
  echo "Já existe artigo com data $HOJE. Nada a escrever."
  RESULTADO="${RESULTADO:-Já existe artigo de hoje ($HOJE), nada a publicar.}"
  exit 0
fi

# O launchd chama todo dia (por causa dos agendados), mas artigo novo só sai na segunda,
# quarta e sexta. FORCAR=1 escreve em qualquer dia.
if [ -z "${FORCAR:-}" ] && ! [[ "$(date +%u)" =~ ^[135]$ ]]; then
  echo "Hoje não é dia de artigo novo."
  exit 0
fi

# Autor do dia: dois do Caio para um da Bia, pela tabela "Já publicados".
# Se as duas últimas linhas são do caio, é a vez da bia.
ULTIMOS="$(awk -F' \\| ' '/^## Já publicados/ {t=1; next} /^---$/ {t=0} t && /^\| `/ {print $2}' "$PAUTAS" | tail -2 | tr '\n' ' ')"
if [ -z "${AUTOR:-}" ]; then
  if [ "$ULTIMOS" = "caio caio " ]; then AUTOR=bia; else AUTOR=caio; fi
fi
echo "Autor do dia: $AUTOR (últimos: $ULTIMOS)"

PROMPT="Use a skill artigo-blog para escrever o artigo de hoje ($HOJE), como se a rotina tivesse disparado.
Autor do dia: $AUTOR. Pegue a próxima pauta pendente da fila desse autor em $PAUTAS
(para a bia, confira antes o log do app em ../appestugram, como a skill manda).
Escreva o artigo em src/content/blog/<slug>.md com autor: $AUTOR e data: $HOJE, baixe a capa com
scripts/rotina/foto.sh, passe o TEXTO INTEIRO pela skill humanizer com o processo completo da seção "Humanizar" da skill
(rascunho, lista do que ainda soa como IA, versão final, releitura do arquivo inteiro) e rode npm run build até passar.
Siga o checklist da skill inteiro.
NÃO edite $PAUTAS (você não tem permissão de escrita em .claude/): o script que te chamou marca a pauta.
NÃO faça git commit nem git push: o script cuida disso.
Termine a resposta com estas três linhas exatas:
PAUTA=<número da pauta, ou 0 se foi novidade do app fora da fila>
SLUG=<slug-do-artigo>
KEYWORD=<keyword principal>"

claude -p "$PROMPT" \
  --model claude-sonnet-5-5 \
  --no-session-persistence \
  --add-dir "$REPO/../appestugram" \
  --allowedTools "Skill" "Read" "Write" "Edit" "Glob" "Grep" "WebFetch" "WebSearch" \
    "Bash(npm run build*)" "Bash(scripts/rotina/foto.sh *)" \
    "Bash(git -C ../appestugram log*)" "Bash(git -C ../appestugram show*)" \
    "Bash(ls *)" "Bash(cat *)" "Bash(head *)" "Bash(tail *)" "Bash(wc *)" "Bash(grep *)" \
    "Bash(awk *)" "Bash(sed -n *)" "Bash(date*)" "Bash(sips *)" \
    "Bash(git status*)" "Bash(git diff*)" "Bash(git log*)" \
  | tee "$REPO/.rotina/ultima-resposta.txt"

# Confere o resultado em vez de confiar na resposta.
# O que a rotina mudou = sujo agora e limpo antes, restrito aos arquivos do blog.
MUDOU="$(comm -13 <(echo "$ANTES") <(sujos) | grep -E '^src/content/blog/' || true)"
novos() {
  echo "$MUDOU" | while read -r f; do
    if [ -n "$f" ] && ! git ls-files --error-unmatch -- "$f" >/dev/null 2>&1; then echo "$f"; fi
  done | grep -E "$1" || true
}
POSTS="$(novos '^src/content/blog/[^/]+\.md$')"
if [ "$(echo "$POSTS" | grep -c .)" -ne 1 ]; then
  echo "Esperava exatamente 1 artigo novo em src/content/blog, achei: '${POSTS}'. Abortando sem commit."
  MOTIVO="O Claude não gerou exatamente 1 artigo novo"
  exit 1
fi
POST="$POSTS"
SLUG="$(basename "$POST" .md)"
if ! grep -q "^data: $HOJE" "$POST"; then
  MOTIVO="$SLUG.md não tem data $HOJE"
  exit 1
fi
if ! grep -q "^autor: $AUTOR" "$POST"; then
  MOTIVO="$SLUG.md não está assinado por $AUTOR"
  exit 1
fi
CAPA="$(sed -n 's#^capa: \./\(capas/.*\)$#src/content/blog/\1#p' "$POST" | head -1)"
if [ -z "$CAPA" ] || [ ! -f "$CAPA" ]; then
  MOTIVO="$SLUG.md sem capa baixada"
  exit 1
fi

npm run build

# Marca a pauta e registra em "Já publicados" (o Claude não escreve em .claude/).
RESPOSTA="$REPO/.rotina/ultima-resposta.txt"
PAUTA="$(sed -n 's/^PAUTA=\([0-9][0-9]*\).*/\1/p' "$RESPOSTA" | tail -1)"
KEYWORD="$(sed -n 's/^KEYWORD=//p' "$RESPOSTA" | tail -1)"
if [ -z "$PAUTA" ]; then
  MOTIVO="O Claude não informou PAUTA="
  exit 1
fi
if [ "$PAUTA" != "0" ] && ! grep -q "^| $PAUTA | .*| pendente |$" "$PAUTAS"; then
  MOTIVO="Não achei a pauta pendente informada pelo Claude (PAUTA=$PAUTA)"
  exit 1
fi
awk -v n="$PAUTA" -v slug="$SLUG" -v autor="$AUTOR" -v kw="${KEYWORD:-$SLUG}" -v hoje="$HOJE" '
  { linhas[NR] = $0 }
  n != "0" && $0 ~ "^\\| " n " \\| " && /\| pendente \|$/ { sub(/\| pendente \|$/, "| usada " hoje " |", linhas[NR]) }
  /^## Já publicados/ { tabela = 1 }
  tabela && /^\| `/ && !fim { ultima = NR }
  /^---$/ && ultima { fim = 1 }
  END {
    for (i = 1; i <= NR; i++) {
      print linhas[i]
      if (i == ultima) printf "| `%s` | %s | %s | %s |\n", slug, autor, kw, hoje
    }
  }' "$PAUTAS" > "$PAUTAS.tmp" && mv "$PAUTAS.tmp" "$PAUTAS"

MUDOU="$(printf '%s\n%s\n' "$MUDOU" "$PAUTAS" | sort -u | grep .)"
TITULO="$(sed -n 's/^titulo: "\(.*\)"$/\1/p' "$POST" | head -1)"
NOME="$(echo "$AUTOR" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')"
echo "Arquivos no commit:"
echo "$MUDOU"
# --only: commita só esses caminhos, mesmo que haja outras coisas no stage.
echo "$MUDOU" | xargs git add --
echo "$MUDOU" | xargs git commit -m "Novo artigo ($NOME): ${TITULO:-$SLUG}" --only --
git push origin master

echo "=== $(date '+%F %T') publicado: $POST"
RESULTADO="Publicado: ${TITULO:-$SLUG}"
