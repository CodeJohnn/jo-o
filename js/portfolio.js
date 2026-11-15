/* Reusable coverflow: one instance for each [data-coverflow] region. */
(function () {
  'use strict';
  document.querySelectorAll('[data-coverflow]').forEach(function (root) {
    const cards = Array.from(root.querySelectorAll('[data-project]'));
    const dots = Array.from(root.querySelectorAll('[data-go]'));
    const stage = root.querySelector('.featured-stage');
    const play = root.querySelector('[data-play]');
    const status = root.querySelector('.featured-status');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let active = 0, timer, visible = false, paused = motion.matches, hovered = false, pointer = null, suppressClick = false;
    function schedule() {
      clearTimeout(timer);
      if (!paused && !motion.matches && visible && !hovered && !document.hidden && !root.contains(document.activeElement)) {
        timer = setTimeout(function () { select(active + 1, false); }, 5000);
      }
    }
    function updatePlay() {
      play.innerHTML = paused ? 'Retomar rotação <span aria-hidden="true">▷</span>' : 'Pausar rotação <span aria-hidden="true">Ⅱ</span>';
      play.setAttribute('aria-label', paused ? 'Retomar rotação automática' : 'Pausar rotação automática');
      play.disabled = motion.matches;
      if (motion.matches) { play.textContent = 'Movimento reduzido'; play.setAttribute('aria-label', 'Rotação desativada pela preferência de movimento reduzido'); }
    }
    function pause() { paused = true; updatePlay(); schedule(); }
    function fit() {
      if (cards[active]) stage.style.height = (cards[active].offsetHeight + 52) + 'px';
    }
    function select(index, manual) {
      if (manual) pause();
      active = (index + cards.length) % cards.length;
      cards.forEach(function (card, i) {
        const current = i === active;
        card.dataset.position = current ? 'active' : i === (active + 1) % cards.length ? 'next' : 'prev';
        card.querySelector('a').tabIndex = current ? 0 : -1;
        const overlay = card.querySelector('.featured-select');
        overlay.tabIndex = current ? -1 : 0;
        dots[i].setAttribute('aria-pressed', String(current));
      });
      if (manual) status.textContent = cards[active].getAttribute('aria-label');
      fit(); schedule();
    }
    root.classList.add('ready');
    root.querySelector('[data-prev]').addEventListener('click', function () { select(active - 1, true); });
    root.querySelector('[data-next]').addEventListener('click', function () { select(active + 1, true); });
    dots.forEach(function (dot, i) { dot.addEventListener('click', function () { select(i, true); }); });
    cards.forEach(function (card, i) { card.querySelector('.featured-select').addEventListener('click', function () { select(i, true); }); });
    play.addEventListener('click', function () { paused = !paused; updatePlay(); schedule(); });
    root.addEventListener('mouseenter', function () { hovered = true; schedule(); });
    root.addEventListener('mouseleave', function () { hovered = false; schedule(); });
    root.addEventListener('focusin', function (e) { if (e.target !== play) pause(); else schedule(); });
    root.addEventListener('focusout', function () { setTimeout(schedule, 0); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); select(active + (e.key === 'ArrowRight' ? 1 : -1), true); dots[active].focus(); }
    });
    stage.addEventListener('dragstart', function (e) { e.preventDefault(); });
    stage.addEventListener('pointerdown', function (e) {
      if (!e.isPrimary || e.button !== 0) return;
      pause(); pointer = { id: e.pointerId, x: e.clientX, y: e.clientY };
    });
    window.addEventListener('pointerup', function (e) {
      if (!pointer || pointer.id !== e.pointerId) return;
      const dx = e.clientX - pointer.x, dy = e.clientY - pointer.y;
      pointer = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.25) {
        suppressClick = true; select(active + (dx < 0 ? 1 : -1), true);
        setTimeout(function () { suppressClick = false; }, 0);
      }
    });
    window.addEventListener('pointercancel', function () { pointer = null; });
    stage.addEventListener('click', function (e) { if (suppressClick) { e.preventDefault(); e.stopPropagation(); } }, true);
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', function () { if (motion.matches) paused = true; updatePlay(); schedule(); });
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(stage.parentElement);
    window.addEventListener('resize', fit);
    cards.forEach(function (card) { card.querySelector('img').addEventListener('load', fit); });
    if ('IntersectionObserver' in window) {
      root.classList.add('entering');
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) root.classList.add('visible');
        schedule();
      }, { threshold: 0.15 }).observe(root);
    } else visible = true;
    select(0, false); updatePlay();
  });
})();
