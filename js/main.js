// ===== Edit this =====
// Solana token mint. Leave '' to show "CA coming soon" with Buy/Jupiter/Chart/GMGN disabled.
const CA = '8uWftzVoVBqyPJj6Xq9kRUtnz54W5GP4pd4smwZHpump';
const X_URL = 'https://x.com/KimchiWifHat';
// =====================

const LINKS = {
  buy: (ca) => `https://swap.pump.fun/?input=So11111111111111111111111111111111111111112&output=${ca}`,
  jupiter: (ca) => `https://jup.ag/swap/SOL-${ca}`,
  chart: (ca) => `https://dexscreener.com/solana/${ca}`,
  gmgn: (ca) => `https://gmgn.ai/sol/token/${ca}`,
};

const SCENES = [
  ['01', 'Hat check', 'Close-up of the peach knit hat'],
  ['02', 'Kimchi stall', 'Kimchi stall with bubbling pots'],
  ['03', 'Tower aura', 'N Seoul Tower night aura'],
  ['04', 'Pepper pile', 'Lounging by a kimchi and pepper pile'],
  ['05', 'Subway ride', 'On the Seoul subway'],
  ['06', 'Rooftop hour', 'Rooftop overlooking the city at sunset'],
  ['07', 'Crystal spice', 'Solana crystal with chili peppers'],
  ['08', 'Still life', 'Hat still life with kimchi jar'],
  ['09', 'Neon rain', 'Rainy neon street'],
  ['10', 'Hat crowd', 'Market crowd all wearing the hat'],
  ['11', 'Spice throne', 'Kimchi throne'],
  ['12', 'PC bang', 'PC bang screens glowing'],
];

const ca = CA.trim();
const caLive = ca.length > 0;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

$$('[data-link]').forEach((a) => {
  const k = a.dataset.link;
  if (k === 'x') { a.href = X_URL; return; }
  if (!LINKS[k]) return;
  if (caLive) {
    a.href = LINKS[k](ca); a.target = '_blank'; a.rel = 'noopener';
    a.removeAttribute('aria-disabled'); a.removeAttribute('tabindex');
  } else {
    a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); a.setAttribute('tabindex', '-1');
    a.addEventListener('click', (e) => e.preventDefault());
  }
});
$$('[data-ca]').forEach((el) => { el.textContent = caLive ? ca : 'CA coming soon'; });
$$('[data-ca-state]').forEach((el) => { el.textContent = caLive ? 'live' : 'pending'; el.classList.toggle('live', caLive); });

const toast = $('.toast');
function showToast(t) { toast.textContent = t; toast.classList.add('show'); clearTimeout(showToast.t); showToast.t = setTimeout(() => toast.classList.remove('show'), 1600); }
$$('[data-copy]').forEach((b) => {
  if (!caLive) { b.disabled = true; b.setAttribute('aria-disabled', 'true'); return; }
  b.disabled = false; b.removeAttribute('aria-disabled');
  b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(ca); }
    catch { const t = document.createElement('textarea'); t.value = ca; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
    showToast('CA copied');
  });
});

const mosaic = $('[data-gallery]');
const layout = ['big', '', '', '', 'big', '', '', '', '', '', '', ''];
SCENES.forEach(([n, cap, alt], i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'tile ' + (layout[i] || ''); b.dataset.i = i;
  b.setAttribute('aria-label', `Open image: ${cap}`);
  b.innerHTML = `<div class="frame sq"><picture><source type="image/webp" srcset="/assets/img/scenes/scene-${n}-640.webp 640w, /assets/img/scenes/scene-${n}.webp 1024w" sizes="(min-width:1000px) ${layout[i] === 'big' ? '50vw' : '25vw'}, (min-width:640px) 50vw, 100vw"><img src="/assets/img/scenes/scene-${n}-640.jpg" width="640" height="640" loading="lazy" decoding="async" alt="${alt}"></picture></div><span class="cap">#${n} ${cap}</span>`;
  mosaic.appendChild(b);
});

const lb = $('.lightbox'), lbImg = $('img', lb), lbCap = $('figcaption', lb);
let cur = 0;
function show(i) {
  cur = (i + SCENES.length) % SCENES.length;
  const [n, cap, alt] = SCENES[cur];
  lbImg.src = `/assets/img/scenes/scene-${n}.webp`; lbImg.alt = alt; lbCap.textContent = `#${n} · ${cap}`;
}
mosaic.addEventListener('click', (e) => {
  const t = e.target.closest('.tile'); if (!t) return;
  show(+t.dataset.i);
  if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
});
$('.lb-close', lb).addEventListener('click', () => lb.close());
$('.lb-prev', lb).addEventListener('click', () => show(cur - 1));
$('.lb-next', lb).addEventListener('click', () => show(cur + 1));
lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
document.addEventListener('keydown', (e) => { if (!lb.open) return; if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1); });

if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));
} else $$('.reveal').forEach((el) => el.classList.add('in'));
