import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Artigos do blog. O nome do arquivo vira o endereço: pomodoro.md fica em /blog/pomodoro.
const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      descricao: z.string(),
      capa: image(),
      /** Texto alternativo da capa. Vazio quando a foto é só ilustrativa. */
      capaAlt: z.string().default(''),
      /** Data de publicação. Os artigos trazidos do blog antigo ainda não têm. */
      data: z.coerce.date().optional(),
      /** Aparece no `npm run dev`, mas fica fora do site publicado. */
      rascunho: z.boolean().default(false),
    }),
});

export const collections = { blog };
