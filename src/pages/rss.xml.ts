// Feed RSS do blog em /rss.xml, para leitores de feed e para quem indexa o blog.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/blog';
import { autores } from '../lib/autores';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'Blog do Estugram',
    description: 'Técnicas de estudo com base em pesquisa e novidades do Estugram, para concursos, ENEM e vestibular.',
    site: context.site!,
    customData: '<language>pt-br</language>',
    items: posts.map((post) => ({
      title: post.data.titulo,
      description: post.data.descricao,
      link: `/blog/${post.id}`,
      pubDate: post.data.data,
      author: autores[post.data.autor].nome,
    })),
  });
}
