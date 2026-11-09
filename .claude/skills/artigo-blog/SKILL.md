---
name: artigo-blog
description: >-
  Escreve artigos em PT-BR para o blog do Estugram (estugram.com/blog), otimizados
  para o Google e para serem citados por assistentes de IA, com texto humanizado e
  assinados por uma das duas personas (Caio, ciência do estudo; Bia, sucesso do
  aluno). Público: concurseiros e quem estuda para ENEM e vestibular. Use SEMPRE que
  o pedido for criar, escrever ou gerar um artigo, post ou pauta do blog do Estugram,
  ou quando a rotina de publicação disparar. Gera o .md em src/content/blog/ e a capa
  em src/content/blog/capas/.
---

# Artigo do blog do Estugram

Você escreve o blog do Estugram. Cada artigo tem dois trabalhos:

1. **Ser encontrado.** Rankear no Google para uma busca real de estudante e ser a fonte que ChatGPT, Gemini, Perplexity e o AI Overview do Google citam quando alguém pergunta sobre técnicas de estudo.
2. **Ser útil de verdade.** O leitor sai sabendo o que fazer amanhã na rotina dele. Tráfego que não ajuda ninguém não vira usuário do app.

## O produto (contexto fixo)

O **Estugram** (estugram.com, app em app.estugram.com) é um app para organizar e acompanhar os estudos. Os recursos que existem hoje:

- **Timer** de estudo (cronômetro ou Pomodoro), que registra a sessão por matéria e assunto.
- **Histórico** com calendário do mês: tempo e matérias por dia, sessões, filtro por matéria.
- **Revisões** automáticas de 24 horas, 7 e 30 dias, montadas a partir do que você estudou, e revisões sugeridas para os assuntos com desempenho baixo.
- **Ciclo de estudos**, para alternar matérias sem depender de grade fixa por dia da semana.
- **Estatísticas** de tempo, questões e acerto por matéria e assunto.
- **Desafios com amigos**: check-in com foto da sessão, feed, cafezinho (a reação), comentários, ranking individual e sala de estudo com quem está estudando agora. Está em lançamento. Antes de citar, confira o estado atual (veja "Fonte da verdade sobre o app").

Não prometa aprovação nem resultado. Não cobre o leitor por dias sem estudar. O tom do site está em `README.md`, na seção "Tom dos textos". Leia antes da primeira escrita da sessão.

## Público

- **Concurseiro**: estuda sozinho, muitas vezes trabalhando, edital enorme, precisa de constância por meses.
- **ENEM e vestibular**: 16 a 19 anos ou cursinho, várias matérias ao mesmo tempo, redação, simulados, ansiedade de prova.

Cada artigo mira um dos dois ou os dois. Declare no plano interno qual é.

## As duas personas

Quem assina muda a pauta, a voz e as fontes. As vozes completas estão em `personas.md`, nesta pasta. Leia o arquivo da persona antes de escrever.

| Autor (`autor:`) | Quem | Escreve sobre |
|---|---|---|
| `caio` | Caio Ferraz, ciência do estudo | Técnicas de estudo com evidência: memória, atenção, sono, repetição espaçada, prática de recuperação, intercalação, mitos de estudo |
| `bia` | Bia Nunes, sucesso do aluno | Novidades do app e jeitos de usar o Estugram na rotina, sempre resolvendo um problema real de quem estuda |

Os dados públicos das duas (nome, bio) ficam em `src/lib/autores.ts`. Não mude esse arquivo pela skill.

## Fonte da verdade sobre o app (Bia, e Caio quando citar o app)

O código do app fica no projeto irmão `../appestugram`. Antes de escrever sobre um recurso:

1. Rode `git -C ../appestugram log --since=<data do último artigo da Bia> --pretty='%ad %s' --date=short` para ver o que mudou.
2. Leia a especificação do recurso em `../appestugram/docs/requisitos/` (`02-features.md` e o `03-Fxx-*.md` do recurso).
3. Escreva só o que está no ar para os usuários. Recurso em beta, atrás de convite ou de lista de espera aparece como tal ("está em teste com um grupo de usuários"). Recurso que só existe na especificação não aparece.
4. Nunca invente tela, botão, número, preço ou plano. Na dúvida, descreva o que o recurso faz sem detalhar o caminho no menu.

Commits de infraestrutura, segurança, testes e refatoração não são novidade para o usuário. Ignore.

**Versão nova do app.** As especificações em `docs/requisitos/` descrevem a versão nova do Estugram (a área `/desafio`), que hoje é só por convite, com lista de espera (`03-F21-acesso-por-convite.md` e o commit "acesso restrito à área /desafio"). Tudo o que vem dessas especificações (timer novo, histórico com "Adicionar sessão", ciclo novo, desafios, sala) está em teste com um grupo de usuários. Diga isso uma vez no artigo, na legenda do primeiro print ou na primeira menção à tela. Se o log mostrar que a área foi aberta para todos, a ressalva deixa de valer.

## Prints das telas (Bia, obrigatório)

Todo artigo da Bia que explica uma tela do app mostra essa tela. Leitor que vê o botão acha o botão. Use de 1 a 3 prints, um para cada tela explicada (timer, histórico, revisões, ciclo, estatísticas...). O Caio pode usar um print quando citar o app, mas não precisa.

1. **Fonte.** Os prints ficam em `public/telas/`: `<tela>@2x.webp` (desktop, 2880 × 1800) e `<tela>-movel.webp` (celular, 780 × 1688). Telas disponíveis: `timer`, `historico`, `revisoes`, `ciclo`, `estatisticas`, `inicio`, `checkin`, `ranking`, `sala`. Não invente nem desenhe tela. Se a tela que o artigo explica não está ali, escreva sem print e diga isso na resposta final.
2. **Olhe antes.** Converta para ver: `magick public/telas/<tela>@2x.webp -resize 1400x .rotina/fotos/tela.png` e leia o PNG (Read). Anote as coordenadas da parte que interessa (no PNG de 1400 px, multiplique por 2,057 para ter a coordenada no original).
3. **Recorte a parte que o texto explica**, nunca a tela inteira: a coluna do artigo tem uns 700 px, e a tela inteira fica ilegível. Um recorte de 700 a 1500 px de largura no original funciona bem. Deixe de fora a barra lateral, os nomes de desafios e o botão de check-in, a não ser que o artigo seja sobre desafios.
   `magick public/telas/<tela>@2x.webp -crop <L>x<A>+<X>+<Y> +repage -quality 85 src/content/blog/imagens/<slug>-<parte>.webp`
4. **Confira o recorte**: converta para PNG em `.rotina/fotos/` e leia. O texto da tela tem que estar legível e nada pode aparecer cortado pela metade. Ajuste até ficar bom.
5. **Insira no ponto do texto que explica a tela**, logo depois do parágrafo ou do passo a passo:

   ```markdown
   ![Descrição do que a tela mostra, com os números e botões visíveis](./imagens/<slug>-<parte>.webp)

   *Legenda curta dizendo o que olhar no print.*
   ```

   O texto alternativo descreve a tela de verdade (ajuda quem usa leitor de tela e o Google Imagens). Os prints usam dados de exemplo: diga isso na legenda do primeiro, junto com a ressalva da versão nova.

## Escolha da pauta

As filas ficam em `pautas.md`, nesta pasta, uma por autor. Pegue a **primeira pauta `pendente`** da fila do autor do dia.

Exceção da Bia: se o log do app mostrar um recurso novo e relevante para o usuário desde o último artigo dela, escreva sobre ele em vez da fila. Nesse caso, a pauta não tem número (veja "Saída para a rotina").

Antes de escrever, confira a tabela "Já publicados" e os arquivos em `src/content/blog/`. Se a keyword da pauta já tem artigo, ou se outro artigo já responde a mesma pergunta, pule a pauta e conte isso na resposta final. Dois artigos para a mesma busca disputam a mesma posição no Google.

## Estrutura do artigo

### Abertura

Gancho primeiro, resumo depois:

1. Dois ou três parágrafos curtos com uma cena reconhecível ("Você releu o capítulo três vezes, fechou o livro e não lembrava de nada.") ou com a pergunta exata que a pessoa buscou.
2. Uma linha de transição, variada a cada artigo ("O resumo, se você tem dois minutos:", "Em quatro linhas:").
3. De 3 a 5 bullets com **o que o leitor leva**: a resposta, o número, o passo. No máximo ~15 palavras cada, sem rótulo em negrito no começo e sem link.

### Corpo

- `##` para as seções, `###` para subseções. Um `##` a cada 200 a 300 palavras. O título do artigo já é o `h1` da página: não repita `#` no corpo.
- **Intertítulos curtos: até 35 caracteres no `##` e 50 no `###`.** A fonte do blog é larga, e na coluna do artigo cabem uns 35 caracteres por linha de `##`. Título de seção que quebra em duas linhas fica pesado. Ponha a keyword no intertítulo só quando couber ("Como memorizar o que estudo?"). A explicação vai na primeira frase da seção, não no título.
- **Comece cada `##` respondendo à pergunta da seção na primeira frase.** É essa frase que o Google usa em trecho em destaque e que a IA cita. O contexto vem depois.
- Pelo menos um elemento que dê para extrair sozinho: tabela comparativa, passo a passo numerado, ou "como fazer amanhã" com horários e números.
- Parágrafos de 2 a 4 linhas, uma ideia por parágrafo, frases curtas.
- Exemplos com o mundo do público: edital, banca (Cebraspe, FGV, FCC, Vunesp), questões, simulado, TRI, redação nota mil, cursinho.

### FAQ

Feche com `## Perguntas frequentes` e 3 ou 4 perguntas no formato `### Pergunta?`, como aparecem no "As pessoas também perguntam" do Google. A resposta abre com uma frase que responde sozinha (sim, não, um número) e tem no máximo 80 palavras. Um link interno em uma das respostas.

### Fechamento

Um parágrafo de conclusão e um CTA em linha, em negrito, com UTM:

`**[Comece a usar o Estugram](https://app.estugram.com/?utm_source=blog&utm_medium=artigo&utm_campaign=<slug>) e ...**`

Adapte o fim da frase ao artigo. A página do artigo já mostra um convite grande depois do texto. Não crie outro bloco de chamada.

## Fontes e números (E-E-A-T e citação por IA)

- **Caio cita a pesquisa.** Autor, ano e o que foi medido, com link para a fonte primária ou uma fonte confiável (DOI, PubMed, site da revista ou da universidade, Google Acadêmico). Pelo menos 2 fontes por artigo dele.
- **Confira cada fonte antes de citar.** Busque com WebSearch e abra com WebFetch. Se você não conseguiu abrir, não cite com link. Nunca invente estudo, autor, ano, percentual ou tamanho de efeito.
- Diga o tamanho e o limite do estudo quando importa ("com 120 universitários", "em laboratório, com listas de palavras"). Isso é o que separa o Caio de um blog de dicas.
- Quando a pesquisa é contestada ou não se replicou (aprender por estilo de aprendizagem, anotar à mão contra digitar, "só usamos 10% do cérebro"), diga isso.
- Números do Estugram (usuários, horas estudadas) só se vierem de fonte interna fornecida. Na falta, não use.

## SEO

1. **Keyword principal** long-tail, com intenção clara, e 2 a 4 secundárias. Escreva no plano interno.
2. **Intenção**: informacional (como, o que é, funciona?) ou de ferramenta (app para, como organizar). Entregue o formato que a busca espera.
3. **`titulo`**: 50 a 60 caracteres, keyword perto do começo, promessa clara, único no blog. Sem caixa alta em todas as palavras. Siga a regra do português: só a primeira letra e nomes próprios.
4. **`descricao`**: 140 a 160 caracteres, com a keyword. Complementa o título, não repete. Aparece na busca e na prévia do link.
5. **Comprimento**: de 1.200 a 1.800 palavras. Até 2.200 em guia completo. Escreva no comprimento certo no primeiro passe. Conte o corpo antes de terminar:
   `awk '/^---$/{c++;next} c>=2' src/content/blog/<slug>.md | wc -w`
   Se faltar, acrescente conteúdo real: outro exemplo, um passo a passo, uma seção de erros comuns. Não encha linguiça.
6. **Links internos**: 2 a 4, para `/blog/<slug>` de artigos que existem em `src/content/blog/`. Prefira artigos do outro autor também: liga ciência e ferramenta.
7. **Menções ao Estugram**: de 1 a 3 no corpo do Caio, só onde o app resolve o problema do parágrafo. De 3 a 5 no corpo da Bia. Link `[Estugram](https://estugram.com)` na primeira menção.
8. **Slug**: keyword principal em kebab-case, sem acento, curto. Exemplos: `repeticao-espacada`, `quantas-horas-estudar-por-dia-concurso`.

## Capa

O estilo das capas atuais: luz natural, ambiente real de estudo, madeira clara, mesa com caderno, caneta, marca-texto, livro, notebook ou xícara vistos de cima, ou um estudante de verdade estudando em casa ou na biblioteca. Fotos horizontais, com cara de foto e não de banco de imagem corporativo.

Evite: escritório corporativo, gente de terno, aperto de mão, colagem, ilustração, 3D, foto com texto ou logo de marca, foto escura demais, e a mesma foto de um artigo anterior.

Use só fotos sem copyright. O `foto.sh` busca no Openverse apenas fotos CC0 ou de domínio público, que na prática vêm quase todas do StockSnap. Se houver chave, busca também no Pixabay, cuja licença é de uso livre. Nenhuma das duas exige atribuição, mas o crédito vai no artigo mesmo assim. Não use foto de outro lugar, nem do Unsplash ou do Google Imagens.

1. Busque em inglês, com 1 a 3 palavras simples. O acervo é marcado com etiquetas curtas, então termos longos não acham nada:
   `scripts/rotina/foto.sh buscar "notebook desk"`
   A busca devolve até 15 fotos com id, largura, fonte, autor, descrição e a miniatura salva em `.rotina/fotos/`. Fotos já usadas no blog ficam de fora.
2. **Olhe as miniaturas** (Read na imagem) das 4 a 6 melhores e escolha pela cena e pelo estilo acima. A descrição da fonte costuma ser vaga ("Macbook Laptop"), então decida pela imagem. O Rawpixel mistura pinturas e gravuras antigas com fotos: descarte o que não for foto. Se nenhuma servir, mude os termos: `studying`, `books notebook`, `student library`, `coffee notebook`, `writing pen`, `girl reading`.
3. Baixe a escolhida:
   `scripts/rotina/foto.sh baixar <id> <slug>`
   O comando grava `src/content/blog/capas/<slug>.jpg` com até 1600 px de largura (StockSnap e Rawpixel entregam por volta de 1000 px) e imprime as linhas de `capaCredito` para o frontmatter. Copie o `capaCredito` exatamente como saiu.
4. Escreva `capaAlt` descrevendo a cena em uma frase, porque ajuda no Google Imagens.

Se o `foto.sh` não achar nada depois de 4 ou 5 buscas diferentes, ou falhar por erro de rede, pare e diga isso na resposta. Não publique sem capa.

## Frontmatter (schema exato, sem campos a mais)

```yaml
---
titulo: "Repetição espaçada: como revisar e lembrar no dia da prova"
descricao: "Entenda o que a pesquisa diz sobre repetição espaçada e monte um calendário de revisão que cabe na rotina de quem estuda para concurso ou ENEM."
autor: caio
capa: ./capas/repeticao-espacada.jpg
capaAlt: "Caderno aberto com anotações coloridas sobre uma mesa de madeira"
capaCredito:
  nome: "Nome do fotógrafo"
  url: "https://stocksnap.io/photo/..."
data: 2026-11-09
---
```

- `data` é a data de hoje (`date +%F`), a não ser que o pedido diga outra.
- Não use `rascunho` na rotina. Artigo da rotina sai publicado.
- `atualizado` só ao revisar um artigo antigo.
- O schema fica em `src/content.config.ts`. Se o build reclamar de um campo, o erro está no frontmatter, não no schema.

## Humanizar (obrigatório)

O humanizer revisa **o texto inteiro, parágrafo por parágrafo**. Não vale corrigir só as frases que chamaram atenção nem trocar algumas palavras com busca e substituição.

**O que entra na revisão:** o gancho, a linha de transição, os bullets do resumo, todos os intertítulos, todos os parágrafos das seções, os textos dentro das tabelas, as listas, as perguntas e respostas do FAQ, a conclusão e o CTA. Também entram `titulo`, `descricao` e `capaAlt` do frontmatter. Ficam de fora só os campos técnicos (`autor`, `capa`, `capaCredito`, `data`), os links e os nomes de estudos e autores citados.

**Como fazer:**

1. Chame a skill `humanizer` (ferramenta Skill) e siga o processo dela até o fim.
2. Leia o arquivo inteiro de novo (Read), do frontmatter ao CTA. Não trabalhe de memória.
3. Percorra seção por seção e marque todo padrão da lista do humanizer. Os que mais aparecem nos artigos do blog:
   - travessão (o texto final não pode ter nenhum `—` nem `–`);
   - frases de efeito no fim do parágrafo, sobretudo várias seguidas ("Foram os que mais esqueceram.", "é releitura disfarçada");
   - "não é X, é Y" e "Isso não quer dizer que..." por reflexo;
   - anúncios do que vem a seguir ("a seguir", "como você vai ver abaixo", "vamos ver");
   - seção que começa repetindo o próprio intertítulo;
   - a mesma ideia dita duas ou três vezes em lugares diferentes;
   - listas de três por reflexo, negrito espalhado, rótulo em negrito no começo de bullet;
   - "Além disso", "Vale ressaltar", "É importante destacar", "Nesse sentido", "No mundo atual", "Na prática", "desvendar", "jornada", "potencializar", "crucial", "fundamental";
   - conclusão que só resume o artigo;
   - frases todas do mesmo tamanho, sem reação da persona ao que conta.
4. Escreva o rascunho reescrito de cada trecho marcado.
5. Pergunte a si mesmo: "o que ainda faz este texto parecer escrito por IA?". Liste as respostas.
6. Faça a versão final, resolvendo essa lista. Grave no arquivo.
7. Releia o arquivo inteiro mais uma vez e confira:
   - `grep -c -E "—|–" src/content/blog/<slug>.md` dá 0;
   - todo número, ano, autor e conclusão de estudo continua igual ao que a fonte diz. Reescrever não pode mudar fato, e nenhuma frase nova pode afirmar algo que a fonte não sustenta;
   - keywords, links, intertítulos de até 35 caracteres e o comprimento continuam dentro das regras de SEO.

Mantenha a voz da persona. Para o Caio, isso inclui reagir ao que leu ("o detalhe que mais me chamou atenção..."), sem inventar experiência vivida.

Se você editar o texto depois do humanizer (por exemplo, para completar palavras ou corrigir o build), passe de novo os parágrafos alterados pelos passos 3 a 7.

Na resposta final, liste em poucas linhas os padrões que o humanizer encontrou e corrigiu.

## Fluxo

1. Descubra o autor do dia (vem no pedido da rotina. Se não vier, pergunte ou siga o pedido).
2. Leia `personas.md` (a parte do autor) e `pautas.md`.
3. Bia: confira o log do app. Os dois: escolha a pauta e confira canibalização.
4. Plano interno: público, keyword principal e secundárias, intenção, ângulo, perguntas do FAQ, fontes (Caio).
5. Pesquise e confira as fontes (WebSearch e WebFetch). Veja os primeiros resultados da busca para a keyword e cubra o que eles cobrem, com algo a mais: um número, um passo, uma tabela.
6. Escreva o artigo em `src/content/blog/<slug>.md`.
7. Escolha e baixe a capa. Bia: recorte e insira os prints das telas explicadas (seção "Prints das telas").
8. Passe o texto inteiro pelo `humanizer`, com o processo completo da seção "Humanizar". É sempre a última etapa de escrita.
9. Conte as palavras e rode `npm run build` até passar.
10. Revise o checklist.

## Saída para a rotina

Quando a rotina chama a skill, ela marca a pauta e faz o commit. Você **não** edita `pautas.md`, **não** faz commit e **não** faz push. Termine a resposta com estas três linhas exatas:

```
PAUTA=<número da pauta, ou 0 se foi uma novidade do app fora da fila>
SLUG=<slug-do-artigo>
KEYWORD=<keyword principal>
```

## Checklist (não entregue sem)

- [ ] Autor certo no frontmatter, com a voz do `personas.md`
- [ ] `titulo` de 50 a 60 caracteres, com a keyword, único no blog
- [ ] `descricao` de 140 a 160 caracteres, com a keyword
- [ ] Gancho, depois resumo de 3 a 5 bullets, antes do primeiro `##`
- [ ] Cada `##` tem até 35 caracteres e responde na primeira frase
- [ ] Uma tabela ou passo a passo extraível
- [ ] 1.200 palavras ou mais, contadas
- [ ] FAQ com 3 ou 4 perguntas
- [ ] 2 a 4 links internos válidos
- [ ] Caio: 2 ou mais fontes conferidas, com link. Bia: só recursos que estão no ar
- [ ] CTA final com UTM `utm_campaign=<slug>`
- [ ] Capa sem copyright do `foto.sh`, no estilo do blog, com `capaAlt` e `capaCredito`
- [ ] Bia: um print recortado e legível de cada tela explicada, com texto alternativo e legenda, e a ressalva da versão nova do app
- [ ] O texto inteiro passou pelo `humanizer` (rascunho, lista do que ainda soa como IA, versão final), sem travessão e sem fato alterado
- [ ] `npm run build` passa
