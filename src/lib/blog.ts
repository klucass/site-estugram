import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Data de hoje (AAAA-MM-DD) no horário de Brasília, que é o fuso das datas dos artigos. */
function hojeEmBrasilia() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
}

/** Artigo agendado: data depois de hoje. Fica fora do site até um build no dia (a rotina dispara esse build). */
export function agendado(data: Date | undefined) {
  return !!data && data.toISOString().slice(0, 10) > hojeEmBrasilia();
}

/** Artigos publicados, do mais novo para o mais antigo. Os sem data vão para o fim, em ordem de título.
 *  Em desenvolvimento aparecem também os rascunhos e os agendados. */
export async function getPosts() {
  const posts = await getCollection(
    'blog',
    ({ data }) => import.meta.env.DEV || (!data.rascunho && !agendado(data.data)),
  );
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
