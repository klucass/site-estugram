// Tudo o que é número de negócio ou link fica aqui, para ajustar sem mexer no layout.

export const appUrl = 'https://app.estugram.com';
export const contatoEmail = 'ajuda@estugram.com';

/** Link do app com UTM indicando de qual botão da página veio o clique. */
export function signupUrl(placement: string) {
  const url = new URL(appUrl);
  url.searchParams.set('utm_source', 'estugram');
  url.searchParams.set('utm_medium', 'landing');
  url.searchParams.set('utm_campaign', 'desafios');
  url.searchParams.set('utm_content', placement);
  return url.toString();
}

/** Contato do piloto com mentores e cursinhos (plano Turma ainda sem preço público). */
export const pilotoUrl = `mailto:${contatoEmail}?subject=${encodeURIComponent('Piloto Estugram Turma')}`;

// Planos fora do site até os valores serem definidos depois do lançamento.
// Para mostrar de novo a seção e o link "Planos" do cabeçalho, troque para true.
export const mostrarPlanos = false;

export const planos = {
  // Preço e teste do Pro vêm do app atual (Paywall.vue e User::isInTrialPeriod).
  pro: { anual: 37, testeDias: 7 },
  // Hipótese do modelo de negócio, ainda não validada.
  gratis: { maxParticipantes: 10 },
};

// Quantos artigos cabem em cada página de /blog. Com 10, a primeira página fecha
// a grade: o destaque ocupa uma linha e os outros 9 formam três linhas de três.
export const postsPorPagina = 10;
