// Quem assina os artigos do blog. São personas editoriais da equipe do Estugram:
// a página de cada uma diz isso, e nenhuma bio inventa formação ou cargo.
// A voz de cada persona, para quem escreve, fica em .claude/skills/artigo-blog/personas.md.

export const autores = {
  caio: {
    nome: 'Caio Ferraz',
    papel: 'Ciência do estudo',
    /** Uma frase, para a assinatura do artigo e o JSON-LD. */
    resumo: 'Lê pesquisas sobre memória e aprendizagem e conta o que dá para levar para a rotina de quem estuda.',
    /** Parágrafos da página do autor. */
    sobre: [
      'Caio é curioso por como a gente aprende. Ele lê os estudos sobre memória, atenção e sono, confere o que foi testado com estudantes de verdade e separa o que tem evidência do que é só moda.',
      'Os textos dele são para quem estuda para concurso, ENEM ou vestibular e quer trocar horas perdidas por técnicas que funcionam, sempre com a fonte por perto para você conferir.',
    ],
    cor: '#5B8CFF',
  },
  bia: {
    nome: 'Bia Nunes',
    papel: 'Sucesso do aluno',
    resumo: 'Acompanha quem usa o Estugram e mostra as novidades do app e jeitos de tirar mais proveito dele.',
    sobre: [
      'Bia conversa com quem usa o Estugram todos os dias. Ela conta o que mudou no app, mostra recursos que pouca gente conhece e explica como encaixar cada um na rotina.',
      'Se você tem uma dúvida sobre o app ou uma ideia de recurso, escreva para ajuda@estugram.com.',
    ],
    cor: '#FF4D8A',
  },
} as const;

export type AutorId = keyof typeof autores;
export const autorIds = Object.keys(autores) as [AutorId, ...AutorId[]];

export function iniciais(nome: string) {
  return nome
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
}
