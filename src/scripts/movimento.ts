// Animações da página: entrada ao rolar, números que contam, borda que segue
// o mouse e cabeçalho que ganha fundo depois do topo. Tudo é decorativo: sem
// este script o conteúdo aparece igual, só que parado.

const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Entrada ao rolar
const revelar = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      revelar.unobserve(e.target);
    }
  },
  { rootMargin: '0px 0px -12% 0px' },
);
document.querySelectorAll('[data-reveal]').forEach((el) => revelar.observe(el));

// Números que contam até o valor final. O texto no HTML já é o valor final.
const formatos: Record<string, (n: number) => string> = {
  int: (n) => Math.round(n).toLocaleString('pt-BR'),
  pct: (n) => `${Math.round(n)}%`,
  hm: (n) => {
    const m = Math.round(n);
    return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
  },
};

function contar(el: HTMLElement) {
  const alvo = Number(el.dataset.count);
  const fmt = formatos[el.dataset.format ?? 'int'];
  const dur = 1600;
  const t0 = performance.now();
  const passo = (t: number) => {
    const p = Math.min(1, (t - t0) / dur);
    const suave = 1 - Math.pow(1 - p, 4);
    el.textContent = fmt(alvo * suave);
    if (p < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}

if (!calmo) {
  const contador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        contar(e.target as HTMLElement);
        contador.unobserve(e.target);
      }
    },
    { threshold: 0.6 },
  );
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => contador.observe(el));
}

// Borda que acende sob o mouse
document.querySelectorAll<HTMLElement>('.spot').forEach((el) => {
  el.addEventListener('pointermove', (ev) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${ev.clientX - r.left}px`);
    el.style.setProperty('--my', `${ev.clientY - r.top}px`);
  });
});

// Cabeçalho e herói acompanham a rolagem
const topo = document.querySelector<HTMLElement>('.top');
const heroi = document.querySelector<HTMLElement>('[data-tilt]');
let agendado = false;

function aoRolar() {
  agendado = false;
  const y = window.scrollY;
  topo?.classList.toggle('rolou', y > 8);
  if (heroi && !calmo) {
    // 0 no topo da página, 1 depois de rolar uns 500px
    heroi.style.setProperty('--p', String(Math.min(1, y / 500)));
  }
}

window.addEventListener(
  'scroll',
  () => {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(aoRolar);
  },
  { passive: true },
);
aoRolar();
