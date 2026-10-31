import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Artigos publicados, do mais novo para o mais antigo. Os sem data vão para o fim, em ordem de título. */
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.rascunho);
  return posts.sort((a, b) => {
    const da = a.data.data?.getTime() ?? 0;
    const db = b.data.data?.getTime() ?? 0;
    return db - da || a.data.titulo.localeCompare(b.data.titulo, 'pt-BR');
  });
}

const formatoData = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export function formatarData(data: Date) {
  return formatoData.format(data);
}

/** Minutos de leitura, contando 200 palavras por minuto. */
export function minutosDeLeitura(post: Post) {
  const palavras = (post.body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}
