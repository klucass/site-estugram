#!/bin/bash
# Capa do artigo, só com fotos de licença livre (sem copyright).
#
#   scripts/rotina/foto.sh buscar "study desk notebook"   # fotos horizontais, miniaturas em .rotina/fotos/
#   scripts/rotina/foto.sh baixar <id> <slug>             # grava src/content/blog/capas/<slug>.jpg (1600 px)
#
# Fontes:
# - Openverse (api.openverse.org), sem chave. Só CC0 e domínio público, que dispensam atribuição.
#   Só StockSnap (960 px) e Rawpixel (1024 px, mistura fotos com pinturas antigas).
# - Pixabay, se houver PIXABAY_API_KEY em .rotina/env (licença do Pixabay: uso livre, sem atribuição).
#   Entrega 1280 px e aparece primeiro na lista.
# Mesmo sem obrigação, o artigo mostra o crédito (capaCredito).
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
DIR="$REPO/.rotina/fotos"
mkdir -p "$DIR"
[ -f "$REPO/.rotina/env" ] && . "$REPO/.rotina/env"

# Os CDNs recusam o curl sem identificação. O cliente se identifica, sem se passar por navegador.
UA="EstugramBlog/1.0 (+https://estugram.com/blog)"
baixa() { curl -fsSL --max-time "${TEMPO:-30}" -A "$UA" "$@"; }

enc() { node -e 'process.stdout.write(encodeURIComponent(process.argv[1]))' "$1"; }

case "${1:-}" in
  buscar)
    termos="${2:?uso: foto.sh buscar \"termos em inglês\"}"
    q="$(enc "$termos")"
    # Páginas de fotos já usadas em capas do blog
    grep -ho '^  url: .*' "$REPO"/src/content/blog/*.md 2>/dev/null | sed 's/^  url: //; s/"//g' > "$DIR/usadas.txt" || true

    baixa "https://api.openverse.org/v1/images/?q=$q&license=cc0,pdm&source=stocksnap,rawpixel&aspect_ratio=wide&page_size=20" \
      > "$DIR/openverse.json" || echo '{"results":[]}' > "$DIR/openverse.json"
    if [ -n "${PIXABAY_API_KEY:-}" ]; then
      baixa "https://pixabay.com/api/?key=$PIXABAY_API_KEY&q=$q&image_type=photo&orientation=horizontal&min_width=1600&safesearch=true&per_page=20" \
        > "$DIR/pixabay.json" || echo '{"hits":[]}' > "$DIR/pixabay.json"
    else
      echo '{"hits":[]}' > "$DIR/pixabay.json"
    fi

    # Uma lista só: id, tamanho, fonte, autor, descrição, miniatura, original e página da foto.
    node -e '
      const fs = require("fs");
      const [dir] = process.argv.slice(1);
      const usadas = new Set(fs.readFileSync(`${dir}/usadas.txt`, "utf8").split("\n").filter(Boolean));
      const ov = JSON.parse(fs.readFileSync(`${dir}/openverse.json`, "utf8")).results || [];
      const px = JSON.parse(fs.readFileSync(`${dir}/pixabay.json`, "utf8")).hits || [];
      const preferidas = ["stocksnap", "rawpixel"];
      const fotos = [
        ...px.map((p) => ({
          id: `pixabay-${p.id}`, w: p.imageWidth, h: p.imageHeight, fonte: "pixabay", autor: p.user,
          desc: p.tags, mini: p.webformatURL, original: p.largeImageURL, pagina: p.pageURL,
        })),
        ...ov
          .filter((p) => p.width >= 1600 && p.width / p.height >= 1.3)
          .sort((a, b) => preferidas.includes(b.provider) - preferidas.includes(a.provider))
          .map((p) => {
            // O StockSnap entrega 960 px e o Rawpixel 1024 px, mesmo que a original seja maior.
            const w = Math.min(p.width, { stocksnap: 960, rawpixel: 1024 }[p.provider] ?? p.width);
            return {
            id: `ov-${p.id}`, w, h: Math.round((w * p.height) / p.width), fonte: p.provider, autor: p.creator || p.provider,
            desc: p.title, mini: p.thumbnail, original: p.url, pagina: p.foreign_landing_url,
          }; }),
      ].filter((f) => !usadas.has(f.pagina)).slice(0, 15);
      fs.writeFileSync(`${dir}/busca.json`, JSON.stringify(fotos, null, 1));
      if (!fotos.length) console.error("Nenhuma foto livre e larga o bastante. Tente outros termos.");
      // Campo vazio vira "-": o read do bash junta tabs seguidos e desalinha as colunas.
      const limpa = (v) => String(v ?? "").replace(/[\t\n]+/g, " ").trim() || "-";
      for (const f of fotos) console.log([f.id, `${f.w}x${f.h}`, f.fonte, f.autor, f.desc, f.mini].map(limpa).join("\t"));
    ' "$DIR" > "$DIR/busca.tsv"

    while IFS=$'\t' read -r id tam fonte autor desc mini; do
      baixa -o "$DIR/$id.jpg" "$mini" || continue
      printf '%s\t%s\t%s\t%s\t%s\tminiatura: .rotina/fotos/%s.jpg\n' "$id" "$tam" "$fonte" "$autor" "$desc" "$id"
    done < "$DIR/busca.tsv"
    ;;

  baixar)
    id="${2:?uso: foto.sh baixar <id> <slug>}"
    slug="${3:?uso: foto.sh baixar <id> <slug>}"
    destino="$REPO/src/content/blog/capas/$slug.jpg"
    node -e '
      const [dir, id] = process.argv.slice(1);
      const f = require(`${dir}/busca.json`).find((x) => x.id === id);
      if (!f) { console.error(`ERRO: ${id} não está na última busca. Rode foto.sh buscar de novo.`); process.exit(1); }
      require("fs").writeFileSync(`${dir}/escolhida.json`, JSON.stringify(f));
    ' "$DIR" "$id"
    original="$(node -e 'process.stdout.write(require(process.argv[1]).original)' "$DIR/escolhida.json")"
    TEMPO=120 baixa -o "$DIR/original" "$original"
    # JPEG com no máximo 1600 px de largura. Foto menor não é ampliada.
    sips -s format jpeg -s formatOptions 82 "$DIR/original" --out "$destino" >/dev/null
    if [ "$(sips -g pixelWidth "$destino" | awk '/pixelWidth/ {print $2}')" -gt 1600 ]; then
      sips --resampleWidth 1600 "$destino" >/dev/null
    fi
    largura="$(sips -g pixelWidth "$destino" | awk '/pixelWidth/ {print $2}')"
    # O StockSnap só entrega 960 px pelo CDN; abaixo disso a capa fica borrada.
    if [ "${largura:-0}" -lt 960 ]; then
      rm -f "$destino"
      echo "ERRO: a foto tem só ${largura}px de largura. Escolha outra." >&2
      exit 1
    fi
    echo "Capa gravada: src/content/blog/capas/$slug.jpg (${largura}px)"
    echo "Frontmatter:"
    node -e '
      const f = require(process.argv[1]);
      console.log(`capa: ./capas/${process.argv[2]}.jpg`);
      console.log(`capaCredito:\n  nome: ${JSON.stringify(f.autor)}\n  url: ${JSON.stringify(f.pagina)}`);
      if (f.desc) console.log(`# descrição da fonte, para inspirar o capaAlt: ${f.desc}`);
    ' "$DIR/escolhida.json" "$slug"
    ;;

  *)
    echo "uso: foto.sh buscar \"termos\" | foto.sh baixar <id> <slug>" >&2
    exit 1
    ;;
esac
