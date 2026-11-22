// Desenha as salas de demonstração do herói com o mesmo código da sala do app
// (../appestugram/resources/js/Desafio/Sala): móveis, paredes e bonecos.
// Uso: node scripts/salas/gerar.mjs   (precisa do appestugram ao lado, com npm install feito)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const APP = resolve(SITE, "../appestugram");
const req = createRequire(APP + "/package.json");
const { createServer } = await import(req.resolve("vite"));
const vue = (await import(req.resolve("@vitejs/plugin-vue"))).default;
const { createSSRApp, h } = await import(req.resolve("vue"));
const { renderToString } = await import(req.resolve("@vue/server-renderer"));

const srv = await createServer({ root: APP, configFile: false, plugins: [vue()], server: { middlewareMode: true, hmr: false, ws: false }, appType: "custom", logLevel: "error", optimizeDeps: { noDiscovery: true } });
const carrega = (f) => srv.ssrLoadModule(`/resources/js/Desafio/Sala/${f}`);
const Avatar = (await carrega("AvatarSvg.vue")).default;
const Maos = (await carrega("MaosSvg.vue")).default;
const { visualPadrao } = await carrega("visual.js");
const { criarGeometria, pts } = await carrega("geometria.js");
const { MOVEIS, tilesDe } = await carrega("moveis.js");
const { MODELOS } = await carrega("modelos.js");

// A aparência sai do nome, como no app; o corpo acompanha o gênero do nome de demonstração.
function visualDe(p) {
  for (let k = 0; k < 40; k++) {
    const v = visualPadrao(k ? `${p.nome}${k}` : p.nome);
    if (!p.g || v.corpo === (p.g === "f" ? "feminino" : "masculino")) return v;
  }
  return visualPadrao(p.nome);
}
const render = (comp, props) => renderToString(createSSRApp({ render: () => h(comp, props) }));
const enxuga = (s) =>
  s
    .replace(/<!--.*?-->/g, "")
    .replace(/ data-v-[a-z0-9]+(="")?/g, "")
    .replace(/ style="[^"]*"/g, "")
    .replace(/(\d+\.\d{2})\d+/g, "$1");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const forma = ({ t, texto, ...a }) => `<${t} ${Object.entries(a).filter(([, v]) => v != null).map(([k, v]) => `${k}="${esc(v)}"`).join(" ")}>${texto ? esc(texto) : ""}</${t}>`;
const formas = (l) => l.map(forma).join("");

// Só animações que funcionam com o SVG carregado como imagem e que somem com movimento reduzido.
const ESTILO = `<style>
.boca-aberta{display:none}.caneca-mao{opacity:0}
.sala-pisca{animation:pisca 1.6s ease-in-out infinite}
.sala-vapor{animation:vapor 2.4s ease-in-out infinite}
.sala-neon{animation:neon 6s steps(1) infinite}
.balao{animation:balao 9s ease-in-out infinite;opacity:0}
.b1{animation-delay:4.5s}
@keyframes pisca{50%{opacity:.35}}
@keyframes vapor{0%,100%{opacity:0}50%{opacity:.7}}
@keyframes neon{0%,41%,44%,100%{opacity:1}42%,43%{opacity:.4}}
@keyframes balao{0%,6%{opacity:0}10%,40%{opacity:1}46%,100%{opacity:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.balao{opacity:1}}
</style>`;
const defs = (noite) => `<defs>
<linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${noite ? "#141B3A" : "#8EC5FF"}"/><stop offset="1" stop-color="${noite ? "#2B2F5E" : "#D8ECFF"}"/></linearGradient>
<radialGradient id="luz"><stop offset="0" stop-color="#FFE7A3" stop-opacity="0.7"/><stop offset="1" stop-color="#FFE7A3" stop-opacity="0"/></radialGradient>
<radialGradient id="luzRosa"><stop offset="0" stop-color="#FF4D8A" stop-opacity="0.5"/><stop offset="1" stop-color="#FF4D8A" stop-opacity="0"/></radialGradient>
<pattern id="malhaDot" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><rect width="2.4" height="2.4" fill="#ECEDEF"/><path d="M0 2.4L2.4 0M0 0L2.4 2.4" stroke="#C3C6CC" stroke-width="0.4"/></pattern>
</defs>`;

async function desenhar(sala) {
  const M = MODELOS[sala.modelo];
  const g = criarGeometria(M.colunas, M.linhas, M.alturaParede);
  const { colunas, linhas, alturaParede: hh } = M;
  const pt = g.pt;
  const faixa = (a, b, z0, z1) => pts([pt(...a, z0), pt(...b, z0), pt(...b, z1), pt(...a, z1)]);
  const chao = M.itens.filter((i) => MOVEIS[i.tipo] && !MOVEIS[i.tipo].parede);
  const parede = M.semParedeAlta ? [] : [...M.itens.filter((i) => MOVEIS[i.tipo]?.parede), { tipo: "porta", parede: "esq", pos: M.porta }];

  const assentos = new Map();
  for (const item of chao) {
    const mov = MOVEIS[item.tipo];
    const profItem = Math.max(...tilesDe(item, mov).map((t) => t.c + t.r)) + 0.55;
    for (const a of mov.assentos?.(item) ?? []) assentos.set(`${a.c}-${a.r}`, { ...a, prof: a.emCima ? profItem + 0.05 : a.c + a.r + 0.6 });
  }
  const gente = sala.pessoas.map((p) => {
    const lugar = p.senta ? assentos.get(p.senta) : null;
    if (p.senta && !lugar) throw new Error(`${sala.id}: não há assento em ${p.senta} (${[...assentos.keys()].join(" ")})`);
    return { ...p, lugar, v: { ...visualDe(p), ...(p.v ?? {}) } };
  });
  const ocupadas = new Set(gente.filter((p) => p.lugar?.mesa).map((p) => `${p.lugar.mesa.c}-${p.lugar.mesa.r}`));
  const ctx = { g, ocupado: (c, r) => ocupadas.has(`${c}-${r}`), noite: !!sala.noite, hora: sala.noite ? "22:10" : "14:32", ponteiros: sala.noite ? { h: 305, m: 60 } : { h: 76, m: 192 }, quadro: { titulo: sala.quadro[0], linhas: sala.quadro[1] ? [sala.quadro[1]] : [] } };

  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${g.largura} ${g.altura}" font-family="Archivo, Helvetica, Arial, sans-serif" stroke-linejoin="round">${ESTILO}${defs(!!sala.noite)}`;
  s += `<polygon points="${pts([pt(0, 0), pt(0, linhas), pt(0, linhas, hh), pt(0, 0, hh)])}" fill="${M.paredes.esq}"/><polygon points="${pts([pt(0, 0), pt(colunas, 0), pt(colunas, 0, hh), pt(0, 0, hh)])}" fill="${M.paredes.dir}"/>`;
  if (!M.semParedeAlta) {
    s += `<polygon points="${faixa([0, 0], [0, linhas], 42, 45)}" fill="${M.paredes.friso}"/><polygon points="${faixa([0, 0], [colunas, 0], 42, 45)}" fill="${M.paredes.friso}"/>`;
    s += `<polygon points="${pts([pt(0, 0, hh), pt(0, linhas, hh), pt(-0.2, linhas, hh), pt(-0.2, -0.2, hh)])}" fill="${M.paredes.rodape[0]}"/><polygon points="${pts([pt(0, 0, hh), pt(colunas, 0, hh), pt(colunas, -0.2, hh), pt(-0.2, -0.2, hh)])}" fill="${M.paredes.rodape[1]}"/>`;
  } else {
    const sebe = [...Array.from({ length: linhas * 2 }, (_, i) => pt(0, i / 2 + 0.25, hh)), ...Array.from({ length: colunas * 2 }, (_, i) => pt(i / 2 + 0.25, 0, hh))];
    s += sebe.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="${i % 2 ? M.paredes.friso : M.paredes.dir}"/>`).join("");
  }
  s += `<polygon points="${faixa([0, 0], [0, linhas], 0, 7)}" fill="${M.paredes.rodape[0]}"/><polygon points="${faixa([0, 0], [colunas, 0], 0, 7)}" fill="${M.paredes.rodape[1]}"/>`;
  const recuo = (mov) => (mov.largura * 32 - (mov.larguraDesenho ?? mov.largura * 32)) / 2;
  for (const item of parede) {
    const mov = MOVEIS[item.tipo];
    s += `<g transform="${g.naParede(item.parede, item.pos, mov.largura, mov.z)}"><g transform="translate(${recuo(mov)} 0)">${formas(mov.desenho(ctx, item.parede))}</g></g>`;
  }
  // Chão com a espessura da laje aparecendo nas duas bordas da frente.
  s += `<polygon points="${pts([pt(0, linhas), pt(colunas, linhas), pt(colunas, linhas, -8), pt(0, linhas, -8)])}" fill="#000" opacity="0.35"/><polygon points="${pts([pt(colunas, 0), pt(colunas, linhas), pt(colunas, linhas, -8), pt(colunas, 0, -8)])}" fill="#000" opacity="0.5"/>`;
  for (let c = 0; c < colunas; c++) for (let r = 0; r < linhas; r++) s += `<polygon points="${g.losango(c, r)}" fill="${M.piso(c, r)}" stroke="${M.rejunte}" stroke-width="0.6"/>`;

  const pecas = chao.flatMap((item) => MOVEIS[item.tipo].pecas(item, ctx));
  const itens = pecas.map((p) => ({ prof: p.prof, svg: `<g>${formas(p.formas)}</g>` }));
  const baloes = [];
  for (const p of gente) {
    const { lugar } = p;
    const xy = lugar ? pt(...lugar.pe) : g.centro(p.c, p.r);
    const vira = (lugar ? lugar.espelhado : p.espelhado) ? ' transform="scale(-1 1)"' : "";
    const corpo = enxuga(await render(Avatar, { v: p.v, sentado: !!lugar, relaxado: !!lugar && !lugar.estudo, acao: p.acao, emote: p.emote }));
    itens.push({ prof: lugar ? lugar.prof : p.c + p.r + 0.6, svg: `<g transform="translate(${xy[0]} ${xy[1]})"><ellipse rx="12" ry="5" fill="#000" opacity="0.22"/><g${vira}>${corpo}</g></g>` });
    if (lugar?.estudo) itens.push({ prof: lugar.mesa.c + lugar.mesa.r + 0.6, svg: `<g transform="translate(${xy[0]} ${xy[1]})"><g${vira}>${enxuga(await render(Maos, { v: p.v, acao: p.acao }))}</g></g>` });
    const fala = sala.baloes?.find(([onde]) => onde === p.senta);
    if (fala) {
      const w = fala[1].length * 4.1 + 14;
      baloes.push(`<g class="balao b${baloes.length}" transform="translate(${xy[0]} ${xy[1] - 76})"><rect x="${-w / 2}" y="-9" width="${w}" height="16" rx="8" fill="#fff"/><path d="M-4 6 L0 12 L4 6 Z" fill="#fff"/><text y="2.6" font-size="8" font-weight="700" text-anchor="middle" fill="#1D2A4D">${esc(fala[1])}</text></g>`);
    }
  }
  itens.sort((a, b) => a.prof - b.prof);
  s += itens.map((i) => i.svg).join("");
  const luzes = [
    ...pecas.flatMap((p) => p.luzes ?? []),
    ...parede.flatMap((item) => {
      const mov = MOVEIS[item.tipo];
      const l = mov.luz?.(ctx);
      if (!l) return [];
      const [x, y] = item.parede === "dir" ? pt(item.pos, 0, mov.z) : pt(0, item.pos + mov.largura, mov.z);
      return [{ x: x + l.x + recuo(mov), y: y + (item.parede === "dir" ? 0.5 : -0.5) * l.x + l.y, r: l.r, cor: l.cor }];
    }),
  ];
  // À noite a sala escurece (só dentro do contorno dela) e as lâmpadas acendem.
  if (sala.noite) s += `<polygon points="${pts([pt(0, linhas, hh), pt(0, 0, hh), pt(colunas, 0, hh), pt(colunas, 0, -8), pt(colunas, linhas, -8), pt(0, linhas, -8)])}" fill="#0B1030" opacity="0.42"/>`;
  s += luzes.map((l) => `<circle cx="${l.x}" cy="${l.y}" r="${l.r}" fill="url(#${l.cor ? "luzRosa" : "luz"})" opacity="${l.forca ?? 1}"/>`).join("");
  s += baloes.join("") + "</svg>";
  writeFileSync(`${SITE}/public/salas/${sala.id}.svg`, s);

  // Rosto de cada pessoa, para a lista de quem está na sala.
  for (const p of gente) {
    const rosto = enxuga(await render(Avatar, { v: p.v }));
    writeFileSync(`${SITE}/public/salas/rostos/${p.nome.normalize("NFD").replace(/[^a-zA-Z]/g, "").toLowerCase()}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-14 -60 28 28"><style>.boca-aberta{display:none}</style>${rosto}</svg>`);
  }
  return { id: sala.id, largura: g.largura, altura: g.altura, bytes: s.length };
}

mkdirSync(`${SITE}/public/salas/rostos`, { recursive: true });
const dados = JSON.parse(readFileSync(`${SITE}/src/data/salas.json`, "utf8"));
const feitas = [];
for (const sala of dados.salas) feitas.push(await desenhar(sala));
// As medidas de cada desenho ficam junto dos dados, para a página reservar o espaço certo.
for (const f of feitas) Object.assign(dados.salas.find((s) => s.id === f.id), { largura: f.largura, altura: f.altura });
writeFileSync(`${SITE}/src/data/salas.json`, JSON.stringify(dados, null, 2) + "\n");
console.table(feitas);
await srv.close();
process.exit(0);
