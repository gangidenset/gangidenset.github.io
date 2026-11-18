(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  document.documentElement.classList.add('motion');

  // 一覧のアプリを、画面に入ったときにグループごとに順番に表示する
  const apps = document.querySelectorAll('.app');
  if ('IntersectionObserver' in window) {
    document.querySelectorAll('.apps').forEach(group => {
      group.querySelectorAll('.app').forEach((app, i) => app.style.setProperty('--d', `${Math.min(i, 4) * 70}ms`));
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    apps.forEach(a => io.observe(a));
  } else {
    apps.forEach(a => a.classList.add('in'));
  }

  // ホーム画面のアイコンを押したら、アプリを起動するように押し込んでから移動する
  document.querySelectorAll('.home .icon').forEach(icon => {
    icon.addEventListener('click', ev => {
      const id = icon.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      icon.classList.remove('tap'); void icon.offsetWidth; icon.classList.add('tap');
      target.classList.add('in');
      setTimeout(() => {
        history.pushState(null, '', id);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.classList.remove('hit'); void target.offsetWidth; target.classList.add('hit');
        target.querySelector('a')?.focus({ preventScroll: true });
      }, 220);
    });
  });

  // スマホの画面を、マウスの位置に合わせて少しだけ傾ける（マウス操作のときだけ）
  const hero = document.querySelector('.hero');
  const phone = document.querySelector('.phone');
  if (hero && phone && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let raf = 0;
    hero.addEventListener('pointermove', e => {
      const r = phone.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        phone.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`);
        phone.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`);
      });
    });
    hero.addEventListener('pointerleave', () => {
      phone.style.setProperty('--ry', '0deg');
      phone.style.setProperty('--rx', '0deg');
    });
  }
})();
