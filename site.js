(function () {
  var d = document, root = d.documentElement;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };

  /* rolagem suave */
  if (window.Lenis && !calm && matchMedia('(pointer: fine)').matches) {
    var lenis = new window.Lenis({ lerp: 0.09 });
    var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  /* menu do celular */
  var burger = d.querySelector('.burger');
  if (burger) burger.addEventListener('click', function () {
    var on = root.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', on);
  });

  /* entrada dos elementos ao rolar */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $('[data-r]').forEach(function (el) { io.observe(el); });

  /* numeros que contam */
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      var el = e.target, to = +el.dataset.count, t0 = performance.now();
      if (calm) return;
      (function tick(t) {
        var p = clamp((t - t0) / 1600), v = Math.round(to * (1 - Math.pow(1 - p, 4)));
        el.textContent = v.toLocaleString('pt-BR');
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.6 });
  $('[data-count]').forEach(function (el) { cio.observe(el); });

  /* texto que acende palavra por palavra */
  $('.words').forEach(function (el) {
    el.innerHTML = el.textContent.trim().split(' ').filter(Boolean).map(function (w) { return '<span>' + w + '</span>'; }).join(' ');
  });

  var top = d.querySelector('.top'), last = 0;
  var cards = $('.stack-card'), words = $('.words'), exp = $('.expand'), pars = $('[data-par]');
  function frame() {
    var y = window.scrollY, vh = window.innerHeight;
    if (top && !root.classList.contains('menu-open')) top.classList.toggle('hide', y > last && y > 300);
    last = y;
    cards.forEach(function (c, i) {
      var n = cards[i + 1]; if (!n) return;
      var r = c.getBoundingClientRect(), nr = n.getBoundingClientRect();
      c.style.setProperty('--p', clamp(1 - (nr.top - r.top) / r.height).toFixed(3));
    });
    words.forEach(function (el) {
      var r = el.getBoundingClientRect(), s = el.children;
      var p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.45));
      for (var i = 0; i < s.length; i++) s[i].classList.toggle('on', i < p * s.length);
    });
    exp.forEach(function (el) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--e', clamp(-r.top / (r.height - vh) / 0.7).toFixed(3));
    });
    pars.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.setProperty('--par', ((p + 0.5) * +el.dataset.par).toFixed(1));
    });
  }
  if (calm) { exp.forEach(function (el) { el.style.height = '100vh'; }); }
  else {
    var tick = false;
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(function () { frame(); tick = false; }); } }, { passive: true });
    addEventListener('resize', frame);
    frame();
  }

  /* aberto agora (horario de Brasilia) */
  $('.open').forEach(function (el) {
    try {
      var p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var g = function (k) { return p.filter(function (x) { return x.type === k; })[0].value; };
      var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), m = (+g('hour') % 24) * 60 + +g('minute');
      var on = (wd >= 1 && wd <= 5 && m >= 480 && m < 1140) || (wd === 6 && m >= 540 && m < 840);
      el.textContent = on ? 'Aberto agora' : 'Fechado agora';
      el.classList.toggle('off', !on);
    } catch (e) { el.hidden = true; }
  });

  /* formulario: monta a mensagem do WhatsApp */
  var form = d.getElementById('agendar');
  if (form) {
    var q = new URLSearchParams(location.search).get('t');
    if (q) $('option', form).forEach(function (o) { if (o.value === q) o.selected = true; });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var out = d.getElementById('saida'), nome = form.nome.value.trim(), tel = form.tel.value.replace(/[^0-9]/g, '');
      out.hidden = false; out.className = 'msg err';
      if (!nome) { out.textContent = 'Escreva seu nome para a equipe saber com quem vai falar.'; form.nome.focus(); return; }
      if (tel.length < 10) { out.textContent = 'Informe o WhatsApp com DDD, por exemplo (21) 9 8765-4321.'; form.tel.focus(); return; }
      var per = (form.querySelector('input[name=periodo]:checked') || {}).value || 'qualquer horário';
      var txt = 'Olá! Sou ' + nome + ' e gostaria de agendar uma avaliação de ' + form.trat.value.toLowerCase() + ', de preferência ' + per + '.' + (form.obs.value.trim() ? ' ' + form.obs.value.trim() : '');
      out.className = 'msg'; out.textContent = '';
      var p1 = d.createElement('p'); p1.textContent = 'Mensagem pronta: “' + txt + '”';
      var a = d.createElement('a'); a.className = 'link'; a.target = '_blank'; a.rel = 'noopener';
      a.href = 'https://wa.me/' + form.dataset.wa + '?text=' + encodeURIComponent(txt); a.innerHTML = 'Enviar pelo WhatsApp <span>↗</span>';
      a.style.width = 'max-content';
      out.appendChild(p1); out.appendChild(a);
    });
  }
})();
