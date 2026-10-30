// ===== НАСТРОЙКА ПОЧТЫ =====
// СЮДА ВСТАВИТЬ ПОЧТУ: зарегистрируйся на formspree.io, создай форму,
// укажи там почту салона и вставь ссылку вида https://formspree.io/f/xxxxxxx
const FORM_URL = '';

// ===== 1. ШАПКА МЕНЯЕТ ВИД ПРИ ПРОКРУТКЕ =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  // Если прокрутили больше 60 пикселей — добавляем класс scrolled
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== 2. БУРГЕР-МЕНЮ НА ТЕЛЕФОНЕ =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  nav.classList.toggle('open');
  header.classList.toggle('menu-open');
});
// После нажатия на пункт меню — закрываем его
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
    header.classList.remove('menu-open');
  });
});

// ===== 3. ПЛАВНОЕ ПОЯВЛЕНИЕ ПРИ ПРОКРУТКЕ =====
const items = document.querySelectorAll('.reveal');

// Каждому элементу в своей группе даём небольшую задержку — получается «волна»
document.querySelectorAll('.cards').forEach(group => {
  group.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.setProperty('--delay', (i % 3) * 0.15 + 's');
  });
});

// Следим, когда элемент появляется на экране
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // анимация один раз
    }
  });
}, { threshold: 0.15 });
items.forEach(el => observer.observe(el));

// ===== 4. ПРОСМОТР ФОТО НА ВЕСЬ ЭКРАН =====
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
// (открытие фото по клику — ниже, в разделе 14, вместе с лентой)
function closeLightbox() { lightbox.classList.remove('open'); }
document.getElementById('lbClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// ===== 5. ОТПРАВКА ФОРМЫ ЗАПИСИ =====
const form = document.getElementById('bookingForm');
const msg = document.getElementById('formMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // не перезагружаем страницу

  // Если почта ещё не подключена — просто показываем подсказку
  if (!FORM_URL) {
    msg.textContent = 'Форма пока не подключена к почте (см. script.js).';
    msg.classList.add('show');
    return;
  }

  try {
    const response = await fetch(FORM_URL, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      msg.textContent = 'Спасибо! Мы скоро свяжемся с вами ✨';
      form.reset();
    } else {
      msg.textContent = 'Не удалось отправить. Попробуйте ещё раз.';
    }
  } catch (err) {
    msg.textContent = 'Ошибка сети. Попробуйте ещё раз.';
  }
  msg.classList.add('show');
});


// =====================================================
//   ДОПОЛНИТЕЛЬНЫЕ ЭФФЕКТЫ
// =====================================================

// ===== 6. ЗАСТАВКА: прячем через 1.6 секунды после загрузки =====
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('done'), 1600);
});

// ===== 7. ЗАГОЛОВОК ПО БУКВАМ =====
const heroTitle = document.getElementById('heroTitle');
heroTitle.innerHTML = heroTitle.textContent.split('')
  .map((ch, i) => `<span class="ch" style="--i:${i}">${ch}</span>`).join('');

// ===== 8. ПОЛОСКА ПРОКРУТКИ + ПЛАВАЮЩИЕ КНОПКИ + ПАРАЛЛАКС =====
const progress = document.getElementById('progress');
const floatBtn = document.getElementById('floatBtn');
const toTop = document.getElementById('toTop');
const heroBg = document.getElementById('heroBg');
const heroContent = document.getElementById('heroContent');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (y / max * 100) + '%';
  // Кнопки появляются после главной и исчезают у формы записи
  const bookingTop = document.getElementById('booking').getBoundingClientRect().top;
  floatBtn.classList.toggle('show', y > window.innerHeight * 0.7 && bookingTop > window.innerHeight * 0.5);
  toTop.classList.toggle('show', y > window.innerHeight);
  // Параллакс: фон и текст главной двигаются с разной скоростью
  if (y < window.innerHeight) {
    heroBg.style.transform = `translateY(${y * 0.3}px)`;
    heroContent.style.transform = `translateY(${y * 0.15}px)`;
    heroContent.style.opacity = 1 - y / (window.innerHeight * 0.8);
  }
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== 9. ИСКОРКИ НА ГЛАВНОЙ (canvas) =====
(function () {
  const canvas = document.getElementById('sparkles');
  const ctx = canvas.getContext('2d');
  let w, h, dots = [];
  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    dots = Array.from({ length: Math.min(w < 700 ? 18 : 45, Math.floor(w / 30)) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 2.2 + 0.6,
      s: Math.random() * 0.4 + 0.15,      // скорость подъёма
      p: Math.random() * Math.PI * 2       // фаза мерцания
    }));
  }
  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    dots.forEach(d => {
      d.y -= d.s; d.x += Math.sin(t / 1500 + d.p) * 0.2;
      if (d.y < -5) { d.y = h + 5; d.x = Math.random() * w; }
      ctx.globalAlpha = 0.35 + 0.35 * Math.sin(t / 600 + d.p);   // мерцание
      ctx.fillStyle = '#ffd9dc';
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize(); window.addEventListener('resize', resize);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(draw);
})();

// ===== 10. СЧЁТЧИКИ: числа «набегают» =====
const counters = document.querySelectorAll('.count');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || 0);
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / 1800, 1);
      const eased = 1 - Math.pow(1 - p, 3);          // замедление к концу
      el.textContent = (to * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(c => countObserver.observe(c));

// ===== 11. СВЕЧЕНИЕ ЗА МЫШКОЙ + 3D-НАКЛОН КАРТОЧЕК =====
const glow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', (e) => {
  glow.classList.add('on');
  glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});
const canHover = window.matchMedia('(hover: hover)').matches;
(canHover ? document.querySelectorAll('.card') : []).forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
    const rx = ((y / r.height) - 0.5) * -8;          // наклон по вертикали
    const ry = ((x / r.width) - 0.5) * 8;            // наклон по горизонтали
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ===== 12. «МАГНИТНЫЕ» КНОПКИ: тянутся к курсору =====
(canHover ? document.querySelectorAll('.magnetic') : []).forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.25;
    const y = (e.clientY - r.top - r.height / 2) * 0.35;
    btn.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// ===== 13. ЛЕНТА ПОРТФОЛИО: сама медленно едет, можно потянуть =====
const strip = document.getElementById('strip');
const track = document.getElementById('stripTrack');
const originals = Array.from(track.querySelectorAll('.work'));   // настоящие фото
const photos = originals.map(w => ({ src: w.dataset.full, alt: w.querySelector('img').alt }));

// Нумеруем фото и делаем копии, чтобы лента крутилась по кругу без стыка
originals.forEach((w, i) => { w.dataset.i = i; });
function fillTrack() {
  // Копируем набор, пока лента не станет минимум в 2 раза шире экрана
  track.querySelectorAll('.clone').forEach(c => c.remove());
  const setWidth = track.scrollWidth;                 // ширина одного набора
  const copies = Math.max(1, Math.ceil((window.innerWidth * 2) / setWidth));
  for (let k = 0; k < copies; k++) {
    originals.forEach(w => {
      const c = w.cloneNode(true);
      c.classList.add('clone');
      c.setAttribute('aria-hidden', 'true');
      track.appendChild(c);
    });
  }
}
fillTrack();
let setW = 0;
function measure() { setW = originals.reduce((s, w) => s + w.offsetWidth + 22, 0); }   // 22 = промежуток
measure();
window.addEventListener('resize', () => { measure(); });
window.addEventListener('load', measure);

let paused = false, dragging = false, startX = 0, startScroll = 0, moved = 0, pos = 0;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SPEED = 0.35;                                   // пикселей за кадр — чем меньше, тем медленнее

// Браузер округляет scrollLeft до целых, поэтому дробную позицию храним сами (pos)
strip.addEventListener('scroll', () => {
  // если лента сдвинулась НЕ нами (мышка, палец, колесо) — запоминаем новое место
  if (Math.abs(strip.scrollLeft - pos) > 2) pos = strip.scrollLeft;
});

function loop() {
  if (!paused && !dragging && !reduce) {
    pos += SPEED;
    if (setW && pos >= setW) pos -= setW;        // дошли до конца набора — тихо в начало
    strip.scrollLeft = pos;
  } else if (setW) {
    // при ручной прокрутке тоже не даём выйти за края набора
    if (strip.scrollLeft >= setW) { strip.scrollLeft -= setW; pos = strip.scrollLeft; }
    else if (strip.scrollLeft <= 0 && dragging) { strip.scrollLeft += setW; pos = strip.scrollLeft; }
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Мышка: стоп при наведении, перетаскивание
strip.addEventListener('mouseenter', () => { paused = true; });
strip.addEventListener('mouseleave', () => { paused = false; dragging = false; strip.classList.remove('dragging'); });
strip.addEventListener('mousedown', (e) => { dragging = true; moved = 0; startX = e.pageX; startScroll = strip.scrollLeft; });
window.addEventListener('mouseup', () => {
  dragging = false; strip.classList.remove('dragging');
});
strip.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  moved = e.pageX - startX;
  if (Math.abs(moved) > 5) strip.classList.add('dragging');
  strip.scrollLeft = startScroll - moved;
});
// Палец: пока трогаем — стоп, через 1.5 сек продолжаем
let resumeTimer;
strip.addEventListener('touchstart', () => { paused = true; clearTimeout(resumeTimer); }, { passive: true });
strip.addEventListener('touchend', () => { resumeTimer = setTimeout(() => { paused = false; }, 1500); }, { passive: true });
strip.addEventListener('wheel', () => { paused = true; clearTimeout(resumeTimer); resumeTimer = setTimeout(() => { paused = false; }, 1500); }, { passive: true });
// Не ездим, пока лента вне экрана (экономим батарею)
new IntersectionObserver(([e]) => { if (!e.isIntersecting) paused = true; else if (!strip.matches(':hover')) paused = false; }).observe(strip);

// ===== 14. ПРОСМОТР ФОТО: клик, стрелки, свайп =====
let current = 0;
function showWork(i) {
  current = (i + photos.length) % photos.length;
  lbImg.src = photos[current].src;
  lbImg.alt = photos[current].alt;
}
track.addEventListener('click', (e) => {
  const w = e.target.closest('.work');
  if (!w || Math.abs(moved) > 5) return;           // это было перетаскивание, а не клик
  current = parseInt(w.dataset.i);
  showWork(current);
  lightbox.classList.add('open');
});
document.getElementById('lbPrev').addEventListener('click', (e) => { e.stopPropagation(); showWork(current - 1); });
document.getElementById('lbNext').addEventListener('click', (e) => { e.stopPropagation(); showWork(current + 1); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') showWork(current - 1);
  if (e.key === 'ArrowRight') showWork(current + 1);
});
// Свайп пальцем в окне просмотра
let lbStartX = 0;
lightbox.addEventListener('touchstart', (e) => { lbStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - lbStartX;
  if (Math.abs(dx) > 50) showWork(current + (dx < 0 ? 1 : -1));
}, { passive: true });
