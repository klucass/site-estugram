# Estugram · landing page

Site estático em Astro para o novo posicionamento do Estugram. A marca no cabeçalho e no rodapé é `public/estugram-logo-branca.png`, a mesma imagem que o app usa (`appestugram/public/img/estugram-logo-branca.png`); o símbolo sozinho fica em `public/favicon.svg`. O site apresenta os desafios de estudo em grupo, com check-in com foto, feed e ranking.

O visual da página segue o protótipo de alta fidelidade de desafios (https://claude.ai/artifact/GD9yD5myMZQHPjHw7Cc6HL): tema escuro `#0E1117`, fonte Archivo larga, azul `#5B8CFF` com texto escuro por cima e rosa `#FF4D8A` para sequência e para o "cafezinho". O protótipo usava uma chama ("fogo"), trocada por uma xícara de café para não lembrar a marca do Tinder. Posicionamento e planos vêm de `appestugram/docs/estugram-desafios.md`.

## Tom dos textos

A página foi escrita para o lançamento dos desafios. O público principal é quem estuda para concurso e quer manter uma rotina com amigos. A mensagem parte de acompanhar os estudos e encontrar motivação na companhia do grupo.

O tom é próximo e acolhedor, com competição leve. Evite cobranças por dias sem estudar, promessas de aprovação, superlativos sem comprovação e gírias forçadas. Explique os benefícios com situações concretas e apresente o app também a quem nunca usou o Estugram. O plano Turma continua sendo apresentado como piloto.

Toda pontuação é individual. A trilha de interação tem um ranking separado do ranking de estudos. Comentar e mandar cafezinho para participantes diferentes do desafio rende pontos: quanto mais pessoas diferentes receberem essas interações, maior a pontuação. Esses pontos não se somam aos de estudo. Valores, limites e períodos de contagem não foram definidos para os textos do site.

## Rodar

```sh
npm install
npm run dev      # http://localhost:4321
npm run check    # tipos
npm run build    # gera dist/
npm run preview
```

## Arquivos

- `src/pages/index.astro`: todas as seções e o texto da página.
- `src/pages/termos.astro` e `src/pages/privacidade.astro`: texto trazido de `site-estugram` (estugram.com), com o layout `src/layouts/Documento.astro`.
- `src/components/Header.astro` e `src/components/Footer.astro`: cabeçalho e rodapé de todas as páginas.
- `src/config.ts`: links do app com UTM, e-mail do piloto e números dos planos.
- `public/telas/`: prints do app. Cada tela tem `nome.webp` (1920px), `nome@2x.webp` e `nome-movel.webp` (celular). Os prints da sala de estudo (`sala`) e os de `inicio` e `ranking` foram refeitos em 28/10/2026 com o seed de demonstração (`DEMO_NOW="2026-10-15 15:30:00"`), avatares e presenças na sala da Maratona e o navegador com o relógio na mesma hora.
- `src/components/Tela.astro`: mostra um print numa moldura de navegador ou de celular. Com `tipo="auto"`, troca para o print de celular em telas estreitas.
- `src/scripts/movimento.ts`: entrada dos blocos ao rolar, números que contam, borda que acende sob o mouse e cabeçalho com fundo de vidro. Sem JavaScript ou com movimento reduzido, a página aparece parada e completa.
- `public/og.jpg`: imagem de prévia do link (WhatsApp, redes), recortada de `inicio@2x.webp`.
- `src/components/CheckinCard.astro`: post do feed, com o botão de cafezinho funcionando.
- `src/components/RankingDemo.astro`: exemplo de ranking individual, com pódio e lista de participantes.
- `src/components/Cafe.astro`: ícone da xícara, usado na reação e na sequência de dias.
- `src/styles/global.css`: tokens de cor, tipografia e botões.
- `src/content/blog/`: artigos do blog, um `.md` por artigo, com as capas em `capas/`. Veja "Blog" abaixo.
- `src/pages/blog/[...page].astro`: lista paginada (`/blog`, `/blog/2`...). `src/pages/blog/[slug].astro`: página do artigo.
- `src/lib/blog.ts`: ordem dos artigos, data em português e tempo de leitura.

## Blog

O blog que ficava em `blog.estugram.com` (projeto `estugram-blog`, em Nuxt) agora está em `/blog`. Os 12 artigos vieram de lá com o mesmo slug: `blog.estugram.com/posts/pomodoro` virou `/blog/pomodoro`.

Para publicar um artigo, crie `src/content/blog/nome-do-artigo.md`. O nome do arquivo vira o endereço.

```md
---
titulo: "Como montar um ciclo de estudos"
descricao: "Resumo de uma ou duas frases. Aparece na lista e na prévia do link."
autor: caio # ou bia, veja src/lib/autores.ts
capa: ./capas/ciclo.webp
capaAlt: "" # descreva a foto se ela mostrar algo importante
capaCredito: # opcional, aparece abaixo da capa
  nome: "Fotógrafo"
  url: "https://stocksnap.io/photo/..."
data: 2026-10-22 # data futura agenda o artigo: ele só aparece no build desse dia
atualizado: 2026-11-20 # opcional, quando o artigo for revisado
rascunho: true # some do site publicado, mas aparece no npm run dev
---

Texto em Markdown. Use ### para os intertítulos.
```

A capa é otimizada no build (vários tamanhos em WebP), e a prévia de 1200×630 é gerada a partir dela. A lista mostra os mais novos primeiro. Artigos sem `data` vão para o fim, em ordem alfabética. O número de artigos por página fica em `postsPorPagina`, em `config.ts`.

### Autores

Os artigos são assinados por duas personas da equipe, definidas em `src/lib/autores.ts`. Caio Ferraz escreve sobre ciência do estudo. Bia Nunes, do sucesso do aluno, escreve sobre novidades e uso do app. Cada uma tem uma página em `/blog/autor/<id>`, que diz que é uma persona. O artigo mostra a assinatura no topo, um cartão do autor no fim e o autor no JSON-LD.

### Busca e assistentes de IA

- `/sitemap-index.xml`, gerado pelo `@astrojs/sitemap` e apontado no `robots.txt`.
- `/rss.xml` com todos os artigos.
- `/llms.txt`, um resumo do site e a lista de artigos em Markdown para assistentes de IA.
- JSON-LD `BlogPosting` com autor, `datePublished` e `dateModified`, e `ProfilePage` nas páginas de autor.

### Rotina de publicação

Três artigos por semana saem sozinhos, segunda, quarta e sexta às 9h, pelo launchd do Mac. Nenhum servidor fica ligado: o script chama o Claude Code em modo headless, confere o resultado e faz o push no `master`, e o Netlify publica.

- `.claude/skills/artigo-blog/`: a skill com as regras de SEO e de escrita (`SKILL.md`), a voz das personas (`personas.md`) e as filas de pauta de cada autor (`pautas.md`). Ela usa a skill `humanizer`, copiada em `.claude/skills/humanizer/`.
- `scripts/rotina/publicar-artigo.sh`: escolhe o autor do dia (dois do Caio para um da Bia, pela tabela "Já publicados"), chama o Claude, confere que saiu exatamente um artigo com capa, data e autor certos, roda o build, marca a pauta e faz o commit e o push. Avisa o resultado com uma notificação do macOS.
- `scripts/rotina/foto.sh`: busca e baixa a capa, só com fotos sem copyright. Usa o Openverse, filtrado para CC0 e domínio público (só StockSnap e Rawpixel, com cerca de 1000 px), sem chave. Se houver `PIXABAY_API_KEY` em `.rotina/env`, busca também no Pixabay (1280 px). O Pexels fechou a API para chaves novas, e a API do Unsplash exige carregar a foto do servidor deles, o que não funciona com as capas otimizadas no build.
- `.rotina/` (fora do git): `env` com chaves opcionais, `rotina.log`, a última resposta do Claude e as miniaturas das fotos.

Instalar: rode `scripts/rotina/instalar.sh`. Para rodar na hora: `launchctl kickstart gui/$(id -u)/br.estugram.blog-artigo`. Para escrever um artigo na mão, peça ao Claude Code na pasta do projeto usando a skill `artigo-blog`.

Se o Mac estiver dormindo no horário, o artigo sai quando ele acordar. O script nunca publica dois artigos no mesmo dia.

**Artigo agendado.** Um artigo com `data` futura fica fora do site publicado (o filtro está em `src/lib/blog.ts`, no horário de Brasília) e aparece no `npm run dev`. O launchd roda o script todo dia às 9h: na segunda, quarta e sexta ele escreve o artigo novo, e em qualquer dia em que houver um artigo com a data de hoje ele dispara um build novo no Netlify para o artigo aparecer. O build é disparado pelo `NETLIFY_BUILD_HOOK` de `.rotina/env`, se houver (crie em Netlify > Site configuration > Build & deploy > Build hooks). Sem ele, o script faz um commit vazio no `master`. Num dia de rotina com artigo agendado, a rotina não escreve outro.

## Antes de publicar

- **Os desafios ainda não existem no app.** Os botões levam para `app.estugram.com`. Se o lançamento demorar, troque os CTAs por uma lista de espera.
- **Limite de 10 pessoas no plano Grátis** é hipótese do modelo de negócio (`planos.gratis` em `config.ts`).
- **Plano Turma** aparece como "Piloto" e abre um e-mail, porque ainda não tem preço.
- Pro a R$ 37/ano com 7 dias grátis vem do app atual.
- Painel da turma, nomes e números são exemplos, marcados como ilustrativos.
- **Datas dos artigos antigos.** O blog antigo não guardava data de publicação, então os 12 artigos aparecem sem data. O histórico do `estugram-blog` também não ajuda: todos entraram juntos no commit que criou o blog em Nuxt (02/11/2024). Preencha `data` neles se souber quando saíram.
- **Redirecionar o blog antigo.** No servidor de `blog.estugram.com`, crie um 301 de `/posts/:slug` para `https://estugram.com/blog/:slug` e de `/` para `https://estugram.com/blog`.
- Termos e privacidade repetem o texto de estugram.com, que é genérico e de maio de 2022. Ele não fala de fotos de check-in, feed, ranking nem do que os outros participantes do desafio veem. Vale uma revisão jurídica antes do lançamento.
