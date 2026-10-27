(function(){
  "use strict";

  /* ============================================================
     THE BUILD, DAY BY DAY
     Seven cards cover eleven days: 1 and 2 were one teardown, and 4
     through 7 were one unbroken run at the headliner and the engine.
     days[] drives the clock pips, the badge and the days-left
     readout, so re-splitting a card fixes all three at once.
     show:true swaps the last card into the FP 6.0 finale, which gets
     its own row labels and a photo strip underneath.
     ============================================================ */
  var LAST_DAY = 11;
  var ROW_LABELS = ["What went on", "Why it happened on this day", "What slowed it down"];

  var DAYS = [
    {
      id:"teardown", days:[1,2], label:"Day 1 & 2", num:"1–2", short:"Tear Down",
      img:"images/day-teardown.webp", alt:"Cutting wheel throwing sparks inside the fender well with the truck up on stands",
      cat:"Day 1 and 2", name:"Tear Down",
      brand:"A $12,000 Marketplace truck, stripped to the shell",
      went:"The truck came apart: the wheels came off, the suspension came out, and the interior was stripped back.",
      why:"Nothing else on the list could begin until every part headed for powder coat was off the truck, so the teardown had to come first.",
      fought:"Twenty years of Wisconsin winters. Every bolt we touched was seized, and that is the part of a cheap truck nobody prices in."
    },
    {
      id:"coat", days:[3], label:"Day 3", num:"3", short:"Powder Coat",
      img:"images/day-coat.webp", pos:"38% 46%", alt:"Powder coating a suspension link high-visibility green in the spray booth",
      cat:"Day 3", name:"Powder Coat & Paint",
      brand:"Everything getting color leaves the shop",
      went:"The suspension pieces, the 419 Fab frame overlays and strut plates, and every visible bracket went out for powder coat and paint.",
      why:"Powder coat is the one job you cannot make up for later by working longer. The oven runs on its own schedule, not ours, so the parts had to go out early enough to come back with days left to bolt them on.",
      fought:"The truck sat still for the day while the calendar kept moving."
    },
    {
      id:"power", days:[4,5,6,7], label:"Day 4-7", num:"4–7", short:"Starlight & Power",
      img:"images/day-power.webp", alt:"Headliner laid out on the bench with fiber optic strands being run by hand",
      cat:"Day 4 through 7", name:"Starlight & Performance",
      brand:"The headliner went in while the engine came together underneath it",
      went:"Four straight days went into running fiber by hand into the Starlight headliner while the performance upgrade was assembled underneath it.",
      why:"A gutted truck is the only time the headliner and the engine bay are both wide open, and neither job rewards hurrying. The performance upgrade never arrives alone either. It needs fuel and spark to match, and that is a second order with its own lead time.",
      fought:"Hundreds of individual strands, each placed by hand, and four days in the headliner meant four days away from the rest of the truck."
    },
    {
      id:"d8", days:[8], label:"Day 8", num:"8", short:"Fuel & Lights",
      img:"images/day-d8.webp", alt:"Fuel pump module pulled out of the tank on the bench",
      cat:"Day 8", name:"Rock Lights & Fuel Pump",
      brand:"Lighting underneath, a larger pump in the tank",
      went:"Rock lights went on under the body, and the factory fuel pump came out for a bigger one.",
      why:"A boosted 6.0 will run a stock pump out of fuel before the tune ever gets a fair chance, so the pump had to be in before the first real pull.",
      fought:"Tank work is the job that looks like an hour on paper and rarely is."
    },
    {
      id:"d9", days:[9], label:"Day 9", num:"9", short:"Suspension",
      img:"images/day-d9.webp", alt:"Coated traction bars and suspension mounted underneath the truck",
      cat:"Day 9", name:"Suspension & Headlights",
      brand:"The coated parts come home",
      went:"Leveling keys, upper control arms, M1 shocks front and rear, and the Spec-D headlights all went on in a single day.",
      why:"The powder coat came back on Day 9, and none of the suspension could go in until it did; everything that sets the stance of the truck happens here.",
      fought:"The suspension sat on the bench until the coated parts came back, so nothing that sets the stance could start until the oven was finished with them."
    },
    {
      id:"d10", days:[10], label:"Day 10", num:"10", short:"Wheels On",
      img:"images/day-d10.webp", alt:"Truck on the lift with the chrome 26x14 ARKON wheels mounted",
      cat:"Day 10", name:"Wheels, Tint & Stickers",
      brand:"ARKON 26x14, Venom Power Terra Hunter R/T Plus, B&M, Customs Unlimited",
      went:"The B&M cover went on the rear end, the 26x14 ARKON Lincolns on 33x14.50 Venom Power Terra Hunter R/T Plus tires went on the corners, the frame lights went in, the windows were tinted, and the sponsor stickers were laid.",
      why:"Wheels go on last, because everything underneath has to be finished before the truck comes off the hoist for good.",
      fought:"Five jobs that each look quick on paper, all stacked on the same day."
    },
    {
      id:"fp", days:[11], label:"FP 6.0", num:"6.0", head:"FP", short:"Show Day", last:true, show:true,
      img:"images/day-fp.webp", alt:"The finished truck being loaded onto the trailer for the haul to Tennessee",
      cat:"The show", name:"FP Truck Fest 6.0",
      brand:"Jamestown, Tennessee . October 2 and 3, 2026",
      labels:["What it is", "What we pulled into", "The burnout pit"],
      went:"The sixth running of FP Truck Fest, on the Fitzgerald Performance property in Jamestown, Tennessee. Two days, one ticket, three vendor zones, a dirt track, and sled pulls for the first time this year with $20,000 on the line. It calls itself the rowdiest diesel show in the country.",
      why:"Four hundred trucks in the judged Gold Lot out of more than 2,500 applications. A Silver Lot that sold out in about two minutes. Fifty Chaos Passes for the whole event. A field full of built diesels, and one gas truck.",
      fought:"Custom Offsets sponsors burnout alley, so we were always going to be there. The only question was what we brought. A boosted 6.0 that cost $12,000 to start with, holding its own against built diesels in the pit and in the alley, was the answer."
    }
  ];

  var el = function(id){ return document.getElementById(id); };

  /* ============ SPRING ============
     Damped harmonic oscillator stepped by rAF at fixed sub-steps, so a
     dropped frame can't destabilise it. to() changes only the target, so
     position and velocity carry over and a click mid-move bends the
     motion in flight instead of restarting it from zero. */
  function Spring(x, cfg){ this.x = x; this.v = 0; this.target = x; this.cfg = cfg; this.done = true; }
  Spring.prototype.to = function(t, cfg){
    if (cfg) this.cfg = cfg;
    if (this.done && Math.abs(this.target - t) < 1e-9) return;
    this.target = t; this.done = false;
  };
  Spring.prototype.snap = function(t){ this.target = t; this.x = t; this.v = 0; this.done = true; };
  Spring.prototype.step = function(dt){
    if (this.done) return false;
    var k = this.cfg.s, c = this.cfg.d;
    var n = Math.max(1, Math.ceil(dt * 300)), h = dt / n;
    for (var i = 0; i < n; i++){
      this.v += (-k * (this.x - this.target) - c * this.v) * h;
      this.x += this.v * h;
    }
    if (Math.abs(this.v) < 0.004 && Math.abs(this.x - this.target) < 0.0008){
      this.x = this.target; this.v = 0; this.done = true;
    }
    return true;
  };

  /* pop overshoots a touch, the panel opens and closes without bounce */
  var CFG = { pop:{s:340,d:25}, open:{s:170,d:26}, shut:{s:220,d:30} };
  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ THE DAY STAGE ============ */
  var hero   = el('dayhero'),  sideL = el('sideL'), sideR = el('sideR');
  var panel  = el('dayPanel'), panelIn = panel.firstElementChild;
  var detail = el('detail');
  var q = function(role){ return document.querySelector('[data-role="' + role + '"]'); };

  var SEL = 0, OPEN = false, natural = 0;
  var popSp  = new Spring(1, CFG.pop);    // hero scale, dips and springs back on a change
  var openSp = new Spring(0, CFG.open);   // panel height, 0 shut to 1 open
  var swapSp = new Spring(1, CFG.open);   // panel contents sliding in on a day change

  function tk(s){
    return String(s).replace(/TK_[A-Z_0-9]+/g, function(m){ return '<span class="tk">' + m + '</span>'; });
  }
  function numCls(n){ return n.length > 2 ? ' --wide' : ''; }

  /* How many small dates fit either side of the hero at this width. Measured
     rather than guessed from a breakpoint, so the clamps can change freely. */
  var SIDE_MAX = 2;   // dates shown either side of the hero
  var swipe = function(){ return window.matchMedia('(max-width:767px)').matches; };
  var stacked = function(){ return !swipe() && window.matchMedia('(max-width:374px)').matches; };

  // Measure a real tile rather than re-deriving the CSS clamp in JS. The
  // probe is laid out once per render, which only happens on a day change
  // or a resize.
  function tileWidth(){
    var probe = sideL.firstElementChild || sideR.firstElementChild;
    if (probe) return probe.offsetWidth;
    var t = document.createElement('div');
    t.className = 'daytile';
    t.style.cssText = 'position:absolute;visibility:hidden;animation:none';
    sideR.appendChild(t);
    var w = t.offsetWidth;
    sideR.removeChild(t);
    return w;
  }

  function sideCount(){
    if (swipe()) return DAYS.length;   // phones: every date in one swipeable row
    var stage = el('daystage');
    var avail = stage.clientWidth;
    var gap   = parseFloat(getComputedStyle(stage).columnGap) || 0;
    var tgap  = parseFloat(getComputedStyle(sideL).columnGap) || 8;
    var tileW = tileWidth();
    // stacked: each side gets its own full-width row under or over the hero
    // offsetWidth, not the bounding rect: the hero and tiles carry scale
    // transforms and the rect would report the scaled size
    var room = stacked() ? avail : (avail - hero.offsetWidth - gap * 2) / 2;
    return Math.max(0, Math.min(SIDE_MAX, Math.floor((room + tgap) / (tileW + tgap))));
  }

  function tile(i, dist, dir){
    var d = DAYS[i];
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'daytile' + (d.last ? ' daytile--last' : '');
    b.style.setProperty('--d', dist);
    b.style.setProperty('--dx', (dir * 16) + 'px');
    b.setAttribute('aria-label', d.label + ', ' + d.name);
    b.innerHTML =
      '<span class="daytile__face"><span class="daytile__in">' +
        '<span class="daytile__head"><span class="daytile__hk">' + (d.head || 'Day') + '</span></span>' +
        '<span class="daytile__strip"></span>' +
        '<span class="daytile__body"><span class="daytile__n' + (d.num.length > 2 ? ' daytile__n--wide' : '') + '">' + d.num + '</span></span>' +
      '</span></span>';
    b.addEventListener('click', function(){ pick(i); });
    b.addEventListener('keydown', navKeys(i));
    return b;
  }

  function peer(i){
    var d = DAYS[i];
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'dayhero dayhero--peer' + (d.last ? ' dayhero--last' : '');
    b.dataset.i = i;
    b.setAttribute('aria-label', d.label + ', ' + d.name);
    b.innerHTML =
      '<span class="dayhero__tag" aria-hidden="true">' + (d.last ? 'Jamestown, TN' : '') + '</span>' +
      '<span class="dayhero__face"><span class="dayhero__in">' +
        '<span class="dayhero__head"><span class="dayhero__hk">' + (d.head || 'Day') + '</span></span>' +
        '<span class="dayhero__strip"></span>' +
        '<span class="dayhero__body"><span class="dayhero__n' + (d.num.length > 2 ? ' dayhero__n--wide' : '') + '">' + d.num + '</span></span>' +
        '<span class="dayhero__foot"><span class="dayhero__rule"></span><span class="dayhero__t">' + d.short + '</span></span>' +
        '<span class="dayhero__cta" aria-hidden="true"><span>Open this day</span></span>' +
      '</span></span>';
    b.addEventListener('click', function(){ pick(i); });
    b.addEventListener('keydown', navKeys(i));
    return b;
  }

  function navKeys(i){
    return function(e){
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = Math.min(DAYS.length - 1, i + 1);
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   n = Math.max(0, i - 1);
      if (e.key === 'Home') n = 0;
      if (e.key === 'End')  n = DAYS.length - 1;
      if (n === null || n === i) return;
      e.preventDefault();
      pick(n);
      hero.focus();
    };
  }

  function renderSides(){
    var n = sideCount();
    sideL.innerHTML = ''; sideR.innerHTML = '';
    var make = swipe() ? function(k){ return peer(k); } : tile;
    for (var i = Math.max(0, SEL - n); i < SEL; i++) sideL.appendChild(make(i, SEL - i, -1));
    for (var j = SEL + 1; j <= Math.min(DAYS.length - 1, SEL + n); j++) sideR.appendChild(make(j, j - SEL, 1));
    // reserve the same width on both sides so the hero stays dead centre
    // even on day 1 or day 11, when one side has nothing in it
    var w = 0;
    if (n && !stacked()){
      var tw = tileWidth();
      var gap = parseFloat(getComputedStyle(sideL).columnGap) || 0;
      w = n * tw + (n - 1) * gap;
    }
    el('daystage').style.setProperty('--sidew', w + 'px');
  }

  function centerHero(smooth){
    if (!swipe()){ applyScale(); return; }
    var s = el('daystage');
    s.scrollTo({ left: hero.offsetLeft + hero.offsetWidth / 2 - s.clientWidth / 2, behavior: smooth && !REDUCE ? 'smooth' : 'auto' });
    applyScale();
  }

  /* Phones: every card's size and fade follow its distance from the middle of
     the row, read straight off the scroll position, so they track the finger.
     Uses the CSS `scale` property so it stacks with the pop spring's transform. */
  function applyScale(){
    var s = el('daystage');
    var cards = s.querySelectorAll('.dayhero');
    if (!swipe()){
      for (var k = 0; k < cards.length; k++){ cards[k].style.scale = ''; cards[k].style.opacity = ''; cards[k].style.zIndex = ''; }
      return;
    }
    var step = cards.length > 1 ? Math.abs(cards[1].offsetLeft - cards[0].offsetLeft) : 1;
    var mid = s.scrollLeft + s.clientWidth / 2;
    for (var i = 0; i < cards.length; i++){
      var c = cards[i];
      var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid) / step;
      var near = Math.min(1, d), far = Math.max(0, Math.min(1, d - 1));
      c.style.scale = (1 - 0.5 * near).toFixed(4);
      c.style.opacity = (1 - 0.35 * near - 0.35 * far).toFixed(3);
      c.style.zIndex = d < 0.5 ? 3 : 1;
    }
  }

  // when a swipe comes to rest, the card in the middle becomes the selected day
  function settle(){
    if (!swipe()) return;
    var s = el('daystage'), mid = s.scrollLeft + s.clientWidth / 2;
    var cards = s.querySelectorAll('.dayhero'), best = null, bd = Infinity;
    for (var i = 0; i < cards.length; i++){
      var d = Math.abs(cards[i].offsetLeft + cards[i].offsetWidth / 2 - mid);
      if (d < bd){ bd = d; best = cards[i]; }
    }
    if (!best || best === hero) return;
    var n = +best.dataset.i;
    var refocus = document.activeElement === best;
    SEL = n;
    fillHero();
    renderSides();
    centerHero(false);
    fillPanel();
    measure(true);
    if (OPEN){ swapSp.snap(0); swapSp.to(1, CFG.open); run(); }
    if (refocus) hero.focus({ preventScroll: true });
  }

  var scrollRaf = 0, settleT;
  el('daystage').addEventListener('scroll', function(){
    if (!swipe()) return;
    if (!scrollRaf) scrollRaf = requestAnimationFrame(function(){ scrollRaf = 0; applyScale(); });
    clearTimeout(settleT);
    settleT = setTimeout(settle, 140);
  }, { passive: true });

  function fillHero(){
    var d = DAYS[SEL];
    hero.className = 'dayhero' + (d.last ? ' dayhero--last' : '');
    hero.setAttribute('aria-label', d.label + ', ' + d.name + '. ' + (OPEN ? 'Close' : 'Open') + '.');
    q('heroNum').className = 'dayhero__n' + (d.num.length > 2 ? ' dayhero__n--wide' : '');
    q('heroNum').textContent = d.num;
    q('heroHead').textContent = d.head || 'Day';
    q('heroTitle').textContent = d.short;
    q('heroTag').textContent = d.last ? 'Jamestown, TN' : '';
  }

  function fillPanel(){
    var d = DAYS[SEL], lastDay = d.days[d.days.length - 1];
    q('badge').textContent = d.days.length > 1
      ? 'Days ' + d.days[0] + ' to ' + lastDay + ' of ' + LAST_DAY
      : 'Day ' + d.days[0] + ' of ' + LAST_DAY;
    q('phb').textContent = d.label;
    // Real photo when the day has one, placeholder stripe when it doesn't
    var dimg = q('dayimg');
    if (d.img){
      if (dimg.getAttribute('src') !== d.img) dimg.setAttribute('src', d.img);
      dimg.style.objectPosition = d.pos || '50% 50%';
      dimg.alt = d.alt || '';
      dimg.hidden = false;
      q('ph').hidden = true;
    } else {
      dimg.hidden = true;
      q('ph').hidden = false;
    }
    q('cat').textContent = d.cat;
    q('name').textContent = d.name;
    q('brand').textContent = d.brand;
    var left = LAST_DAY - lastDay;
    q('left').textContent = left === 0 ? 'It leaves today' : left === 1 ? '1 day left' : left + ' days left';
    [].slice.call(detail.querySelectorAll('.clock__scale span')).forEach(function(s, n){
      var day = n + 1;
      s.className = day <= lastDay ? 'on' : '';
    });
    // FP 6.0 relabels the four rows and opens the show strip under them
    var labels = d.labels || ROW_LABELS;
    ['kWent','kWhy','kFought'].forEach(function(role, n){ q(role).textContent = labels[n]; });
    el('showstrip').hidden = !d.show;
    detail.querySelector('.clock').hidden = !!d.show;
    q('went').innerHTML   = tk(d.went);
    q('why').innerHTML    = tk(d.why);
    q('fought').innerHTML = tk(d.fought);
  }

  function measure(animate){
    var prev = natural;
    natural = panelIn.offsetHeight;
    if (animate && OPEN && prev && natural && Math.abs(prev - natural) > 1){
      openSp.x = prev / natural; openSp.v = 0; openSp.done = false;
      openSp.to(1, CFG.open);
    }
  }

  function render(){
    hero.style.transform = 'scale(' + popSp.x + ')';
    var o = openSp.x, oc = o < 0 ? 0 : o > 1 ? 1 : o;
    panel.style.height = (o * natural) + 'px';
    panel.style.visibility = oc < 0.01 ? 'hidden' : 'visible';
    var sw = swapSp.x, sc = sw < 0 ? 0 : sw > 1 ? 1 : sw;
    panelIn.style.opacity = (oc * sc);
    panelIn.style.transform = 'translate3d(0,' + ((1 - sc) * 22 + (1 - oc) * 14) + 'px,0)';
  }

  var raf = 0, lastT = 0;
  function tick(now){
    var dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
    var busy = popSp.step(dt) | openSp.step(dt) | swapSp.step(dt);
    render();
    raf = busy ? requestAnimationFrame(tick) : 0;
  }
  function run(){
    if (REDUCE){ popSp.snap(popSp.target); openSp.snap(openSp.target); swapSp.snap(swapSp.target); render(); return; }
    if (!raf){ lastT = performance.now(); raf = requestAnimationFrame(tick); }
  }

  function setOpen(on){
    OPEN = on;
    hero.setAttribute('aria-expanded', on ? 'true' : 'false');
    q('heroCta').textContent = on ? 'Close this day' : 'Open this day';
    panel.toggleAttribute('inert', !on);
    fillHero();
    if (on) measure(false);
    openSp.to(on ? 1 : 0, on ? CFG.open : CFG.shut);
    run();
  }

  // pick a day: it takes the middle, the sides re-form around it, and the
  // panel opens on it. Picking while open just swaps the contents.
  function pick(i){
    if (i === SEL && OPEN) return;
    var changed = i !== SEL;
    SEL = i;
    if (changed){
      fillHero();
      renderSides();
      centerHero(true);
      popSp.x = 0.9; popSp.v = 0; popSp.done = false;   // dip, then spring back
      popSp.to(1, CFG.pop);
    }
    fillPanel();
    measure(true);
    if (changed && OPEN){ swapSp.snap(0); swapSp.to(1, CFG.open); }
    if (!OPEN) { swapSp.snap(1); setOpen(true); } else run();
  }

  hero.addEventListener('click', function(){ measure(false); setOpen(!OPEN); });
  hero.addEventListener('keydown', function(e){
    var n = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = Math.min(DAYS.length - 1, SEL + 1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   n = Math.max(0, SEL - 1);
    if (n === null || n === SEL) return;
    e.preventDefault();
    pick(n);
  });

  var rt;
  window.addEventListener('resize', function(){
    clearTimeout(rt);
    rt = setTimeout(function(){
      renderSides();
      centerHero(false);
      measure(false);
      if (OPEN) openSp.snap(1);
      render();
    }, 100);
  });

  // boot: the hero shows day one, shut on wider screens, already open on phones
  fillHero();
  renderSides();
  centerHero(false);
  fillPanel();
  panel.toggleAttribute('inert', true);
  measure(false);
  if (swipe()){ setOpen(true); openSp.snap(1); }
  render();

  /* ============ FINANCING MODAL ============ */
  var finModal = el('finModal'), finOpen = el('finOpen'), lastFocus = null;
  function trapFocus(e){
    if (e.key !== 'Tab') return;
    var f = [].slice.call(finModal.querySelectorAll('a[href], button:not([disabled])'));
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1], cur = document.activeElement;
    if (!finModal.contains(cur) || (e.shiftKey && cur === first)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && cur === last) { e.preventDefault(); first.focus(); }
  }
  function openFin(){
    lastFocus = document.activeElement;
    finModal.classList.add('on');
    finModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', trapFocus);
    var x = finModal.querySelector('.modal__x');
    if (x) x.focus();
  }
  function closeFin(){
    finModal.classList.remove('on');
    finModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trapFocus);
    if (lastFocus) lastFocus.focus();
  }
  if (finOpen) finOpen.addEventListener('click', openFin);
  [].slice.call(finModal.querySelectorAll('[data-close]')).forEach(function(n){
    n.addEventListener('click', closeFin);
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && finModal.classList.contains('on')) closeFin();
  });

  /* ============ PARTS CATEGORY TABS ============ */
  var ptabs = [].slice.call(document.querySelectorAll('.ptab'));
  var pcards = [].slice.call(document.querySelectorAll('.pcard'));
  function matches(cat, c){
    var k = c.dataset.cat;
    if (cat === 'all') return true;
    if (cat === 'wt') return k === 'wheel' || k === 'tire';
    return k === cat;
  }
  var PER_PAGE = 6;
  var pgCat = 'all', pgPage = 0, pgPool = [];
  var pager = el('pager'), pgDots = el('pgDots');

  function drawPage(){
    var total = Math.max(1, Math.ceil(pgPool.length / PER_PAGE));
    if (pgPage > total - 1) pgPage = total - 1;
    if (pgPage < 0) pgPage = 0;
    var start = pgPage * PER_PAGE, end = start + PER_PAGE;

    pcards.forEach(function(c){ c.style.display = 'none'; });
    pgPool.slice(start, end).forEach(function(c){ c.style.display = ''; c.classList.add('in'); });

    var single = total < 2;
    pager.hidden = single;
    // the back arrow only appears once the reader has paged forward
    el('pgPrev').hidden = single || pgPage === 0;
    el('pgNext').hidden = single;
    el('pgNow').textContent = pgPage + 1;
    el('pgTotal').textContent = total;
    el('pgCount').textContent = '. ' + pgPool.length + (pgPool.length === 1 ? ' part' : ' parts');
    el('pgPrev').disabled = pgPage === 0;
    el('pgNext').disabled = pgPage >= total - 1;

    var dots = '';
    for (var i = 0; i < total; i++) {
      dots += '<button type="button" data-p="' + i + '" aria-current="' + (i === pgPage ? 'true' : 'false') +
              '" aria-label="Go to page ' + (i + 1) + '"></button>';
    }
    pgDots.innerHTML = dots;
  }

  function setCat(cat){
    pgCat = cat; pgPage = 0;
    pgPool = pcards.filter(function(c){ return matches(cat, c); });
    drawPage();
  }

  ptabs.forEach(function(t){
    t.addEventListener('click', function(){
      ptabs.forEach(function(x){ x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
      var row = t.parentElement;
      if (row.scrollWidth > row.clientWidth){
        var x = t.offsetLeft - row.offsetLeft - (row.clientWidth - t.offsetWidth) / 2;
        row.scrollTo({ left: x, behavior: REDUCE ? 'auto' : 'smooth' });
      }
      setCat(t.dataset.cat);
    });
  });
  function keepGridInView(){
    var g = el('pgrid').getBoundingClientRect();
    // page coordinates: offsetTop is relative to the section, which sent the page back to the top
    if (g.top < 0) window.scrollTo({ top: window.scrollY + g.top - 90, behavior: 'smooth' });
  }
  el('pgPrev').addEventListener('click', function(){
    pgPage--; drawPage(); keepGridInView();
    if (el('pgPrev').hidden) el('pgNext').focus();
  });
  el('pgNext').addEventListener('click', function(){ pgPage++; drawPage(); keepGridInView(); });
  pgDots.addEventListener('click', function(e){
    var b = e.target.closest('button[data-p]');
    if (b) { pgPage = parseInt(b.dataset.p, 10); drawPage(); keepGridInView(); }
  });
  setCat('all');

  /* ============ FAQ ACCORDION ============ */
  var qbtns = [].slice.call(document.querySelectorAll('.q__btn'));
  qbtns.forEach(function(btn){
    var body = btn.nextElementSibling;
    btn.addEventListener('click', function(){
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      body.style.maxHeight = open ? '0px' : body.scrollHeight + 'px';
    });
  });
  window.addEventListener('resize', function(){
    qbtns.forEach(function(btn){
      if (btn.getAttribute('aria-expanded') === 'true') btn.nextElementSibling.style.maxHeight = btn.nextElementSibling.scrollHeight + 'px';
    });
  });

  /* ============ NAV AND JUMP SCROLLSPY + PROGRESS ============ */
  var navLinks = [].slice.call(document.querySelectorAll('.nav__links a'));
  var jumpLinks = [].slice.call(document.querySelectorAll('.jump__in a'));
  var secs = navLinks.map(function(a){ return document.querySelector(a.getAttribute('href')); });
  var bar = el('progress');
  function onScroll(){
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    var mark = y + 140, best = -1;
    secs.forEach(function(sec, n){ if (sec && sec.offsetTop <= mark) best = n; });
    navLinks.forEach(function(a, n){ a.classList.toggle('on', n === best); });
    jumpLinks.forEach(function(a, n){ a.classList.toggle('on', n === best); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ============ REVEAL ============ */
  var rv = [].slice.call(document.querySelectorAll('.rv'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -70px 0px', threshold: 0.05 });
    rv.forEach(function(n){ io.observe(n); });
  } else {
    rv.forEach(function(n){ n.classList.add('in'); });
  }
})();
