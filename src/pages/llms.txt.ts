// /llms.txt: resumo do site em Markdown para assistentes de IA (formato de llmstxt.org).
// Lista o que o Estugram é e todos os artigos, com link e resumo.
import type { APIContext } from 'astro';
import { getPosts } from '../lib/blog';
import { autores } from '../lib/autores';

export async function GET(context: APIContext) {
  const site = context.site!;
  const posts = await getPosts();
  const url = (caminho: string) => new URL(caminho, site).toString();

  const linhas = [
    '# Estugram',
    '',
    '> Aplicativo brasileiro para organizar e acompanhar os estudos de quem se prepara para concursos, ENEM e vestibular: registro do tempo estudado por matéria e assunto, timer, ciclo de estudos, calendário automático de revisões (24 horas, 7 e 30 dias), estatísticas de desempenho e desafios de estudo com amigos, com check-in, feed e ranking.',
    '',
    `- App: ${'https://app.estugram.com'}`,
    `- Site: ${url('/')}`,
    '',
    '## Blog',
    '',
    ...posts.map((p) => `- [${p.data.titulo}](${url(`/blog/${p.id}`)}): ${p.data.descricao}`),
    '',
    '## Autores',
    '',
    ...Object.entries(autores).map(([id, a]) => `- [${a.nome}](${url(`/blog/autor/${id}`)}), ${a.papel.toLowerCase()}: ${a.resumo}`),
    '',
    '## Outras páginas',
    '',
    `- [Termos de uso](${url('/termos')})`,
    `- [Política de privacidade](${url('/privacidade')})`,
    `- [Feed RSS](${url('/rss.xml')})`,
    '',
  ];

  return new Response(linhas.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
