/* The Special — app logic */
let deals = loadDeals();
let nextId = deals.reduce((m,d)=>Math.max(m,d.id),0)+1;
let activeTab = 'today';

const TABS = [['today','🔥 Today'],['all','All deals'],['ig','📸 Instagram finds'],['expired','Graveyard']];
const $ = id => document.getElementById(id);

function status(d){
  if (d.dead || (d.down >= DOWNVOTE_LIMIT && d.down > d.up * DOWNVOTE_RATIO)) return 'expired';
  if ((Date.now() - d.lastVerified) / 864e5 > STALE_DAYS) return 'stale';
  if (d.up >= 5) return 'verified';
  return 'new';
}
function freshText(d){
  const days = Math.floor((Date.now() - d.lastVerified) / 864e5);
  return days === 0 ? '✓ verified today' : days === 1 ? '✓ verified yesterday' : `last verified ${days}d ago`;
}

function renderTabs(){
  $('tabs').innerHTML = TABS.map(([k,l]) =>
    `<div class="tab ${k===activeTab?'active':''}" data-tab="${k}">${l}</div>`).join('');
  $('tabs').querySelectorAll('.tab').forEach(el =>
    el.addEventListener('click', () => { activeTab = el.dataset.tab; renderTabs(); render(); }));
}

function render(){
  const q = $('q').value.toLowerCase();
  let list = deals.filter(d => (d.chain + ' ' + d.deal).toLowerCase().includes(q));
  const st = Object.fromEntries(list.map(d => [d.id, status(d)]));
  if (activeTab === 'today')   list = list.filter(d => st[d.id] !== 'expired' && d.days.includes(TODAY));
  if (activeTab === 'ig')      list = list.filter(d => d.src === 'ig' && st[d.id] !== 'expired');
  if (activeTab === 'all')     list = list.filter(d => st[d.id] !== 'expired');
  if (activeTab === 'expired') list = list.filter(d => st[d.id] === 'expired');
  const rank = {verified:0, new:1, stale:2, expired:3};
  list.sort((a,b) => rank[st[a.id]] - rank[st[b.id]] || (b.up-b.down) - (a.up-a.down));

  const label = activeTab === 'today' ? `${DAY_NAMES[TODAY]}'s specials — ${list.length} live` :
        activeTab === 'expired' ? '💀 Marked unavailable by the community' : `${list.length} deals`;
  $('feed').innerHTML = `<div class="section-label">${label}</div>` +
    (list.length ? list.map(d => cardHTML(d, st[d.id])).join('') :
     `<div class="empty">Nothing here yet.<br>Be the first to post a find! 🎉</div>`);
  $('feed').querySelectorAll('[data-vote]').forEach(el =>
    el.addEventListener('click', () => vote(+el.dataset.id, +el.dataset.vote)));
  $('feed').querySelectorAll('.reel').forEach(el =>
    el.addEventListener('click', () => window.open('https://' + el.dataset.ig, '_blank')));
}

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }

function cardHTML(d, s){
  const [bg, emoji] = brand(d.chain);
  const dayPills = d.days.length === 7 ? `<span class="pill day">Every day</span>` :
    d.days.map(i => `<span class="pill ${i===TODAY?'today':'day'}">${i===TODAY?'TODAY':DAY_NAMES[i]}</span>`).join('');
  const statusPill = s === 'verified' ? `<span class="pill verified">✓ Verified</span>` :
    s === 'new' ? `<span class="pill new">◉ New find</span>` :
    s === 'stale' ? `<span class="pill stalep">⏳ Needs re-check</span>` :
    `<span class="pill expiredp">✕ Unavailable</span>`;
  const srcPill = d.src === 'ig' ? `<span class="pill ig">📸 Reel</span>` :
    d.src === 'community' ? `<span class="pill src">👤 Community find</span>` : `<span class="pill src">🌐 Found on web</span>`;
  const reel = d.ig ? `<div class="reel" data-ig="${esc(d.ig)}">
      <div class="play">▶</div><div class="rl"><div class="rt">Watch the reel · ${esc(d.igUser||'')}</div><div class="ru">${esc(d.ig)}</div></div></div>` : '';
  const dead = s === 'expired' ? `<div class="dead-note">✕ ${d.down} people reported this no longer works</div>` : '';
  return `<div class="card ${s==='expired'?'expired':s==='stale'?'stale':''}">
    <div class="card-top">
      <div class="avatar" style="background:${bg}">${emoji}</div>
      <div class="card-info">
        <div class="chain">${esc(d.chain)} ${srcPill}</div>
        <div class="deal-title">${esc(d.deal)} · <span class="price">${esc(d.price)}</span></div>
        <div class="meta">${statusPill}${dayPills}</div>
      </div>
    </div>
    ${reel}${dead}
    <div class="card-bottom">
      <div class="fresh">${s==='expired'?'RIP 🪦':freshText(d)}</div>
      <div class="votes">
        <button class="vbtn up ${d.myVote===1?'voted':''}" ${s==='expired'?'disabled':''} data-id="${d.id}" data-vote="1">👍 ${d.up}</button>
        <button class="vbtn down ${d.myVote===-1?'voted':''}" ${s==='expired'?'disabled':''} data-id="${d.id}" data-vote="-1">👎 ${d.down}</button>
      </div>
    </div>
  </div>`;
}

function vote(id, v){
  const d = deals.find(x => x.id === id);
  if (!d) return;
  if (d.myVote === v){ // undo
    v === 1 ? d.up-- : d.down--; d.myVote = 0; saveDeals(deals); render(); return;
  }
  if (d.myVote === 1) d.up--;
  if (d.myVote === -1) d.down--;
  d.myVote = v;
  if (v === 1){ d.up++; d.lastVerified = Date.now(); toast('Thanks! Marked as still working ✓'); }
  else {
    d.down++;
    if (d.down >= DOWNVOTE_LIMIT && d.down > d.up * DOWNVOTE_RATIO){ d.dead = true; toast('💀 Deal marked unavailable by the community'); }
    else toast('Got it — flagged as not working');
  }
  saveDeals(deals); render();
}

/* ---------- Post a find ---------- */
let selDays = new Set([TODAY]);
function renderDays(){
  $('f-days').innerHTML = DAY_NAMES.map((n,i) =>
    `<div class="daychip ${selDays.has(i)?'on':''}" data-day="${i}">${n}</div>`).join('') +
    `<div class="daychip ${selDays.size===7?'on':''}" data-day="all">Every day</div>`;
  $('f-days').querySelectorAll('.daychip').forEach(el =>
    el.addEventListener('click', () => {
      if (el.dataset.day === 'all') selDays = selDays.size === 7 ? new Set([TODAY]) : new Set([0,1,2,3,4,5,6]);
      else { const i = +el.dataset.day; selDays.has(i) ? selDays.delete(i) : selDays.add(i); }
      renderDays();
    }));
}
function openSheet(){ $('overlay').classList.add('open'); $('sheet').classList.add('open'); renderDays(); }
function closeSheet(){ $('overlay').classList.remove('open'); $('sheet').classList.remove('open'); }

/* Clipboard paste fallback (iOS / desktop): read an IG link off the clipboard */
async function igImport(){
  let text = '';
  try { text = await navigator.clipboard.readText(); } catch(e){ /* permission denied */ }
  const m = text && text.match(/https?:\/\/(www\.)?instagram\.com\/\S+/);
  if (m){
    $('f-link').value = m[0];
    toast('📸 Reel link pasted — add the details!');
  } else {
    toast('Copy an Instagram link first, then tap again');
  }
}

function submitFind(prefill){
  const chain = $('f-chain').value.trim();
  const deal = $('f-deal').value.trim();
  if (!chain || !deal){ toast('Add the restaurant and the deal 🙏'); return; }
  const link = $('f-link').value.trim();
  const isIG = /instagram\.com/i.test(link);
  deals.unshift({id: nextId++, chain, deal, price: $('f-price').value.trim() || '—',
    days: [...(selDays.size ? selDays : new Set([TODAY]))].sort(),
    src: isIG ? 'ig' : 'community', ig: isIG ? link.replace(/^https?:\/\//,'') : null, igUser: isIG ? '@you' : null,
    up: 1, down: 0, lastVerified: Date.now(), myVote: 1});
  ['f-chain','f-deal','f-price','f-link'].forEach(i => $(i).value = '');
  selDays = new Set([TODAY]);
  saveDeals(deals);
  closeSheet(); activeTab = 'all'; renderTabs(); render();
  toast('⭐ Posted! The crowd will verify it.');
}

/* ---------- Web Share Target (Android PWA): /?share-target&title=..&text=..&url=.. ---------- */
function handleShareTarget(){
  const p = new URLSearchParams(location.search);
  if (!p.has('share-target')) return;
  const shared = [p.get('url'), p.get('text'), p.get('title')].filter(Boolean).join(' ');
  const m = shared.match(/https?:\/\/(www\.)?instagram\.com\/\S+/);
  openSheet();
  if (m) $('f-link').value = m[0];
  else if (shared.trim()) $('f-deal').value = shared.trim().slice(0, 120);
  toast(m ? '📸 Reel shared — add the details!' : 'Shared — fill in the deal!');
  history.replaceState(null, '', location.pathname); // clean the URL
}

let toastTimer;
function toast(m){
  const t = $('toast'); t.textContent = m; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* wire up */
$('q').addEventListener('input', render);
$('fab').addEventListener('click', openSheet);
$('overlay').addEventListener('click', closeSheet);
$('ig-import').addEventListener('click', igImport);
$('f-submit').addEventListener('click', () => submitFind());
$('f-cancel').addEventListener('click', closeSheet);

renderTabs(); render(); handleShareTarget();
