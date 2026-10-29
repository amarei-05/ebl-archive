(() => {
const CLASSES = [
  { ko: '뱅가드', en: 'VANGUARD', b: ['척후병', '돌격수', '기수', '전술가', '에이전트', '책사'] },
  { ko: '가드', en: 'GUARD', b: ['드레드노트', '공격수', '로드', '아츠 파이터', '교관', '파이터', '소드마스터', '솔로블레이드', '해방자', '리퍼', '대검사', '어스셰이커', '프라이멀 가드', '용병'] },
  { ko: '디펜더', en: 'DEFENDER', b: ['프로텍터', '가디언', '저거너트', '아츠 프로텍터', '결전자', '포트리스', '센트리 프로텍터', '프라이멀 프로텍터'] },
  { ko: '스나이퍼', en: 'SNIPER', b: ['명사수', '포격사수', '저격수', '헤비슈터', '산탄사수', '공성사수', '투척수', '사냥꾼', '루프슈터', '스카이브레이커'] },
  { ko: '캐스터', en: 'CASTER', b: ['코어 캐스터', '스플래시 캐스터', '블래스트 캐스터', '체인 캐스터', '메카 캐스터', '진법 캐스터', '미스틱 캐스터', '프라이멀 캐스터', '셰이퍼 캐스터'] },
  { ko: '메딕', en: 'MEDIC', b: ['메딕', '멀티 타겟 메딕', '테라피스트', '방랑 메딕', '주술 메딕', '체인 메딕', '파수꾼'] },
  { ko: '서포터', en: 'SUPPORTER', b: ['감속자', '소환사', '약화자', '음유시인', '비호자', '기능공', '의식술사', '유격수'] },
  { ko: '스페셜리스트', en: 'SPECIALIST', b: ['푸쉬마스터', '후크마스터', '처형자', '매복자', '기인', '상인', '함정술사', '인형사', '연금술사', '스카이레인저', '조정자'] }
];

const VOICE = [
  '어시스턴트 임명', '대화 1', '대화 2', '대화 3', '1차 정예화 후 대화', '2차 정예화 후 대화',
  '신뢰도 상승 후 대화 1', '신뢰도 상승 후 대화 2', '신뢰도 상승 후 대화 3', '방치', '오퍼레이터 입사',
  '작전기록 학습', '1차 정예화 (승진)', '2차 정예화 (승진)', '팀 배치', '팀장 임명', '작전 출발', '작전 개시',
  '오퍼레이터 선택 1', '오퍼레이터 선택 2', '배치 1', '배치 2', '작전 중 1', '작전 중 2', '작전 중 3', '작전 중 4',
  '고난이도 작전 종료', '3★ 작전 종료', '비 3★ 작전 종료', '작전 실패', '시설에 배치', '터치', '신뢰도 터치', '타이틀', '인사'
];

const FIELDS = {
  name_ko: { label: '코드네임 (한글)', en: 'CODENAME KR' },
  name_en: { label: '코드네임 (영어)', en: 'CODENAME EN' },
  title: { label: '직책', en: 'TITLE' },
  gender: { label: '성별', en: 'GENDER' },
  race: { label: '종족', en: 'RACE' },
  origin: { label: '출신지', en: 'PLACE OF BIRTH' },
  faction: { label: '진영', en: 'AFFILIATION' },
  real_name: { label: '본명', en: 'REAL NAME' },
  age: { label: '나이', en: 'AGE', suffix: '세' },
  height: { label: '키', en: 'HEIGHT', suffix: 'cm' },
  combat_years: { label: '전투경험', en: 'COMBAT EXP.', suffix: '년', blank: '없음' },
  infection: { label: '감염여부', en: 'INFECTION' },
  class: { label: '병과', en: 'CLASS' },
  branch: { label: '포지션', en: 'BRANCH' }
};
const INFO_ORDER = ['title', 'gender', 'race', 'origin', 'faction', 'real_name', 'age', 'height', 'combat_years', 'infection', 'class', 'branch'];
const INFO_WIDE = [];
const FORM_ORDER = ['name_ko', 'name_en', 'title', 'gender', 'race', 'origin', 'faction', 'real_name', 'age', 'height', 'combat_years', 'infection', 'class', 'branch'];
const DEFAULT_FACTION = '아이젠비더 연구소';
const EXAM = [
  { k: 'physical', label: '물리적 강도', en: 'PHYSICAL STRENGTH' },
  { k: 'mobility', label: '전장 기동력', en: 'MOBILITY' },
  { k: 'endurance', label: '생체 인내도', en: 'PHYSIOLOGICAL ENDURANCE' },
  { k: 'tactical', label: '전술 계획력', en: 'TACTICAL ACUMEN' },
  { k: 'combat', label: '전투 기술력', en: 'COMBAT SKILL' },
  { k: 'arts', label: '아츠 적응성', en: 'ORIGINIUM ARTS ASSIMILATION' }
];
const GRADES = ['결함', '부족', '보통', '표준', '우수', '월등', '■■'];
const GRADE_LABEL = { '■■': '측정 불능 (■■)' };
const LEGACY_GRADE = { '일반': '부족', '탁월': '월등' };
const grade = v => LEGACY_GRADE[v] || v || '';
const NOTES = [
  { k: 'personality', label: '성격', en: 'PERSONALITY' },
  { k: 'traits', label: '특징', en: 'TRAITS' },
  { k: 'past', label: '과거', en: 'BACKGROUND' }
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const local = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
};
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clone = o => JSON.parse(JSON.stringify(o));
const rid = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('').replace(/^(.{8})(.{4})(.{4})(.{4})/, '$1-$2-$3-$4-');
const serial = id => String(id || '').replace(/-/g, '').slice(-4).toUpperCase().padStart(4, '0');
const classOf = ko => CLASSES.find(c => c.ko === ko);
const fmt = s => {
  if (!s) return '';
  const d = new Date(s);
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const CFG = window.EBL_CONFIG || {};
const DEMO = !CFG.supabaseUrl || !CFG.supabaseKey || !window.supabase;
const sb = DEMO ? null : window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey);

function blank() {
  const o = { portrait: '', voice: {}, exam: {} };
  FORM_ORDER.forEach(k => { o[k] = ''; });
  NOTES.forEach(n => { o[n.k] = ''; });
  o.faction = DEFAULT_FACTION;
  return o;
}

function seed() {
  const now = Date.now();
  const mk = (id, mins, data) => Object.assign(blank(), data, {
    id,
    created_at: new Date(now - mins * 60000).toISOString(),
    updated_at: new Date(now - mins * 30000).toISOString(),
    updated_by: '예시'
  });
  return [
    mk('0c1a7e52-0000-4000-8000-00000000a1f3', 3000, {
      name_ko: '할라이트', name_en: 'Halite', title: '연구소 외곽 경비 책임자', gender: '여', race: '루포', origin: '우르수스',
      real_name: '(예시) 엘레나 소로카', age: '27', height: '178', combat_years: '6', infection: '비감염자',
      class: '디펜더', branch: '가디언',
      exam: { physical: '우수', mobility: '보통', endurance: '월등', tactical: '표준', combat: '우수', arts: '결함' },
      personality: '말수가 적고 원칙을 중시한다. 맡은 구역에서는 누구에게도 양보하지 않지만, 순찰이 끝나면 후배들에게 간식을 나눠 주는 다정한 면도 있다.',
      traits: '왼쪽 귀에 작은 흉터가 있다. 대형 방패를 한 손으로 다루며, 비번인 날에도 장비 점검을 거르지 않는다.',
      past: '우르수스 국경 지대의 자경단 출신. 감염자 습격 사건 이후 연구소에 경비 요원으로 합류했다. (예시 데이터)',
      voice: {
        '어시스턴트 임명': '오늘 하루 박사님 곁은 제가 지킵니다. 서류 더미 말고 다른 위협이 있다면 말씀만 하세요.',
        '대화 1': '연구소 외벽 순찰은 하루 세 번 돕니다. 박사님이 밤늦게 불을 켜 두시는 것도 다 보여요. 주무세요.',
        '대화 2': '방패가 무거워 보인다고요? 이게 가벼우면 아무도 지킬 수 없어요.',
        '작전 개시': '전원, 제 뒤로. 한 걸음도 물러서지 않습니다.',
        '배치 1': '여기는 제가 맡습니다.',
        '터치': '…박사님, 갑옷 위를 두드리셔도 소리만 나요.',
        '인사': '좋은 아침입니다, 박사님. 외곽 이상 없습니다.'
      }
    }),
    mk('5b9d2c10-0000-4000-8000-00000000b7e2', 2000, {
      name_ko: '모로우', name_en: 'Morrow', title: '아츠 응용 연구원', gender: '남', race: '페림', origin: '리타니아',
      real_name: '(예시) 비공개', age: '22', height: '163', combat_years: '2', infection: '감염자',
      class: '캐스터', branch: '체인 캐스터',
      exam: { physical: '부족', mobility: '표준', endurance: '보통', tactical: '우수', combat: '표준', arts: '■■' },
      personality: '호기심이 많고 실험 이야기만 나오면 말이 빨라진다.',
      traits: '항상 손때 묻은 실험 노트를 들고 다닌다.',
      voice: {
        '어시스턴트 임명': '보조 업무라면 맡을게요. 대신 제 실험 노트는 넘겨보지 말아 주세요.',
        '대화 1': '아츠가 한 곳에서 다른 곳으로 옮겨 가는 순간을 좋아해요. 번개가 길을 고르는 것처럼요.',
        '작전 출발': '계산은 끝났어요. 나머지는 현장에서 확인할게요.',
        '작전 중 1': '연결, 다음 표적으로!',
        '3★ 작전 종료': '오차 없이 끝났네요. 기록해 둘게요.'
      }
    }),
    mk('9e4f6a33-0000-4000-8000-00000000c05d', 1000, {
      name_ko: '카이트', name_en: 'Kite', title: '정찰 지원', gender: '여', race: '리베리', origin: '라테라노',
      real_name: '', age: '19', height: '170', combat_years: '3', infection: '비감염자',
      class: '스나이퍼', branch: '명사수',
      exam: { mobility: '우수', combat: '표준' },
      voice: { '인사': '높은 곳은 늘 비어 있으니까, 제가 먼저 올라가 있을게요.' }
    })
  ];
}

const demo = { rows: seed(), hist: [], pw: 'demo' };

const api = DEMO ? {
  async list() { return clone(demo.rows); },
  async get(id) {
    const r = demo.rows.find(x => x.id === id);
    if (!r) throw new Error('not_found');
    return clone(r);
  },
  async check(pw) { return pw === demo.pw; },
  async save(pw, id, data, editor) {
    if (pw !== demo.pw) throw new Error('invalid_password');
    if (!String(data.name_ko || '').trim() && !String(data.name_en || '').trim()) throw new Error('name_required');
    const now = new Date().toISOString();
    const pick = {};
    ['portrait', 'voice', 'exam', ...NOTES.map(n => n.k), ...FORM_ORDER].forEach(k => { pick[k] = data[k] ?? (k === 'voice' || k === 'exam' ? {} : ''); });
    let row;
    if (id) {
      row = demo.rows.find(x => x.id === id);
      if (!row) throw new Error('not_found');
      Object.assign(row, clone(pick), { updated_at: now, updated_by: editor });
    } else {
      row = Object.assign(clone(pick), { id: rid(), created_at: now, updated_at: now, updated_by: editor });
      demo.rows.push(row);
    }
    demo.hist.unshift({ id: rid(), operator_id: row.id, action: id ? 'update' : 'create', editor, created_at: now, snapshot: clone(row) });
    return row.id;
  },
  async remove(pw, id, editor) {
    if (pw !== demo.pw) throw new Error('invalid_password');
    const i = demo.rows.findIndex(x => x.id === id);
    if (i < 0) throw new Error('not_found');
    const [row] = demo.rows.splice(i, 1);
    demo.hist.unshift({ id: rid(), operator_id: id, action: 'delete', editor, created_at: new Date().toISOString(), snapshot: row });
  },
  async history(id) { return clone(demo.hist.filter(h => h.operator_id === id)); }
} : {
  async list() {
    const { data, error } = await sb.from('operators')
      .select('id,name_ko,name_en,class,branch,portrait,created_at,updated_at')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },
  async get(id) {
    const { data, error } = await sb.from('operators').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('not_found');
    return data;
  },
  async check(pw) {
    const { data, error } = await sb.rpc('check_password', { p_password: pw });
    if (error) throw error;
    return data === true;
  },
  async save(pw, id, data, editor) {
    const { data: newId, error } = await sb.rpc('save_operator', { p_password: pw, p_id: id || null, p_data: data, p_editor: editor });
    if (error) throw error;
    return newId;
  },
  async remove(pw, id, editor) {
    const { error } = await sb.rpc('delete_operator', { p_password: pw, p_id: id, p_editor: editor });
    if (error) throw error;
  },
  async history(id) {
    const { data, error } = await sb.from('operator_history')
      .select('id,action,editor,created_at,snapshot')
      .eq('operator_id', id)
      .order('created_at', { ascending: false })
      .limit(30);
    if (error) throw error;
    return data;
  }
};

const errText = e => {
  const m = String((e && (e.message || e.details)) || e || '');
  if (m.includes('invalid_password')) return '편집 비밀번호가 맞지 않아요. 다시 입력해 주세요.';
  if (m.includes('name_required')) return '코드네임(한글 또는 영어)을 하나 이상 적어 주세요.';
  if (m.includes('not_found')) return '이 오퍼레이터를 찾을 수 없어요. 이미 삭제되었을 수 있어요.';
  if (m.includes('portrait_size')) return '이미지가 너무 커요. 다른 이미지를 골라 주세요.';
  if (m.includes('Failed to fetch') || m.includes('NetworkError')) return '서버에 연결하지 못했어요. 인터넷 연결이나 config.js 설정을 확인해 주세요.';
  return '처리하지 못했어요: ' + m;
};
const isAuthErr = e => String((e && e.message) || e).includes('invalid_password');

let toastTimer;
function toast(msg, bad) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.toggle('err', !!bad);
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
}

const session = { pw: null, nick: null };
function cred() {
  const pw = session.pw || local.get('ebl_pw');
  const nick = session.nick || local.get('ebl_nick');
  return pw && nick ? { pw, nick } : null;
}
function forget() { session.pw = null; local.set('ebl_pw', null); }

function gate(message) {
  return new Promise(resolve => {
    const wrap = document.createElement('div');
    wrap.className = 'gate';
    wrap.innerHTML = `
      <form class="gate-box hud" novalidate>
        <div class="eyebrow">ACCESS CONTROL · EDIT AUTH</div>
        <h2>편집 인증</h2>
        <p>편집 비밀번호와 닉네임을 입력해 주세요. 닉네임은 수정 기록에 남아요.</p>
        <div class="field"><label for="gate-pw">편집 비밀번호 <small>PASSWORD</small></label><input type="password" id="gate-pw" autocomplete="current-password"></div>
        <div class="field"><label for="gate-nick">닉네임 <small>EDITOR</small></label><input type="text" id="gate-nick" maxlength="40" autocomplete="nickname" value="${esc(session.nick || local.get('ebl_nick') || '')}"></div>
        <p class="err" id="gate-err">${esc(message || '')}</p>
        <div class="gate-row">
          <button type="button" class="btn btn-ghost" id="gate-cancel">취소</button>
          <button type="submit" class="btn btn-primary" id="gate-ok">확인</button>
        </div>
      </form>`;
    document.body.appendChild(wrap);
    const pwEl = $('#gate-pw', wrap), nickEl = $('#gate-nick', wrap), errEl = $('#gate-err', wrap), ok = $('#gate-ok', wrap);
    pwEl.focus();
    const close = v => { wrap.remove(); document.removeEventListener('keydown', onKey); resolve(v); };
    const onKey = e => { if (e.key === 'Escape') close(null); };
    document.addEventListener('keydown', onKey);
    $('#gate-cancel', wrap).addEventListener('click', () => close(null));
    $('form', wrap).addEventListener('submit', async e => {
      e.preventDefault();
      const pw = pwEl.value, nick = nickEl.value.trim();
      if (!pw) { errEl.textContent = '편집 비밀번호를 입력해 주세요.'; pwEl.focus(); return; }
      if (!nick) { errEl.textContent = '닉네임을 입력해 주세요.'; nickEl.focus(); return; }
      ok.disabled = true;
      ok.textContent = '확인 중…';
      try {
        if (!(await api.check(pw))) {
          errEl.textContent = '편집 비밀번호가 맞지 않아요.';
          ok.disabled = false;
          ok.textContent = '확인';
          pwEl.select();
          return;
        }
        session.pw = pw;
        session.nick = nick;
        local.set('ebl_pw', pw);
        local.set('ebl_nick', nick);
        close({ pw, nick });
      } catch (err) {
        errEl.textContent = errText(err);
        ok.disabled = false;
        ok.textContent = '확인';
      }
    });
  });
}
async function auth(message) { return (!message && cred()) || gate(message); }

const SIL = '<svg viewBox="0 0 100 92" aria-hidden="true"><circle cx="50" cy="34" r="19"/><path d="M12 92c2-24 17-38 38-38s36 14 38 38z"/></svg>';
const portraitHTML = src => src
  ? `<img src="${esc(src)}" alt="">`
  : `<div class="noimg">${SIL}<span>NO IMAGE</span></div>`;
const badgeHTML = (ko, lg) => {
  const c = classOf(ko);
  return c ? `<span class="badge${lg ? ' badge-lg' : ''}">${c.en}</span>` : '';
};

function setNav(v) {
  $$('[data-nav]').forEach(a => {
    if (a.dataset.nav === v) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

let listFilter = local.get('ebl_filter') || 'all';

async function viewList(main) {
  setNav('list');
  const rows = await api.list();
  const counts = {};
  rows.forEach(r => { counts[r.class] = (counts[r.class] || 0) + 1; });
  if (listFilter !== 'all' && !classOf(listFilter)) listFilter = 'all';
  const shown = listFilter === 'all' ? rows : rows.filter(r => r.class === listFilter);
  const chips = [`<button type="button" class="chip" data-f="all" aria-pressed="${listFilter === 'all'}">ALL <small>${rows.length}</small></button>`]
    .concat(CLASSES.map(c => `<button type="button" class="chip" data-f="${c.ko}" aria-pressed="${listFilter === c.ko}" title="${c.ko}">${c.en} <small>${counts[c.ko] || 0}</small></button>`))
    .join('');
  const cards = shown.map((r, i) => `
    <a class="card" href="#oc-${esc(r.id)}" style="animation-delay:${Math.min(i, 12) * 30}ms">
      <div class="card-img">${portraitHTML(r.portrait)}</div>
      <div class="card-body">
        <span class="serial">EBL-${serial(r.id)}</span>
        <strong class="card-en">${esc(r.name_en || r.name_ko)}</strong>
        <span class="card-ko">${esc(r.name_ko || ' ')}</span>
        <span class="card-tags">${badgeHTML(r.class)}${r.branch ? `<span class="card-branch">${esc(r.branch)}</span>` : ''}</span>
      </div>
    </a>`).join('');
  const label = listFilter === 'all' ? '전체 오퍼레이터' : `${listFilter} · ${classOf(listFilter).en}`;
  main.innerHTML = `
    <section class="hero hud">
      <div>
        <div class="eyebrow">EISENBIEDER LAB. // PERSONNEL ARCHIVE</div>
        <h1>Operator<br><em>Archive</em></h1>
        <p>아이젠비더 연구소 소속 오퍼레이터 인사 파일과 음성 기록</p>
      </div>
      <div class="hero-meta">
        <div class="hero-count"><small>REGISTERED</small><b>${String(rows.length).padStart(2, '0')}</b></div>
        <div class="hero-code">SEC-04 / ARCHIVE ONLINE<br>ACCESS: PUBLIC READ</div>
      </div>
    </section>
    <div class="stripe" aria-hidden="true"></div>
    <div class="toolbar">
      <div class="filters" role="group" aria-label="병과 필터">${chips}</div>
      <span class="toolbar-note">${esc(label)} · ${shown.length}</span>
    </div>
    ${rows.length ? `<div class="grid">${cards}<a class="card card-add" href="#new"><b>+</b><span>NEW OPERATOR</span>신규 오퍼레이터 등록</a></div>`
      : `<div class="empty-state"><div class="eyebrow">NO RECORDS</div><p>아직 등록된 오퍼레이터가 없어요. 첫 OC를 등록해 보세요.</p><a class="btn btn-primary" href="#new">+ 신규 등록</a></div>`}`;
  $$('.chip', main).forEach(b => b.addEventListener('click', () => {
    listFilter = b.dataset.f;
    local.set('ebl_filter', listFilter);
    viewList(main);
  }));
}

function typeText(el, text) {
  cancelAnimationFrame(el._raf);
  if (reduced() || !text) { el.textContent = text; return; }
  const total = Math.min(1600, Math.max(400, text.length * 24));
  const start = performance.now();
  el.classList.add('typing');
  const step = t => {
    const k = Math.min(1, (t - start) / total);
    el.textContent = text.slice(0, Math.ceil(text.length * k));
    if (k < 1) el._raf = requestAnimationFrame(step);
    else el.classList.remove('typing');
  };
  el._raf = requestAnimationFrame(step);
}
function stopType(el) { cancelAnimationFrame(el._raf); el.classList.remove('typing'); }

let detailTab = 'file';

async function viewDetail(main, id) {
  setNav('');
  const o = await api.get(id);
  const s = serial(o.id);
  const voice = o.voice || {};
  const filled = VOICE.filter(v => String(voice[v] || '').trim()).length;
  const cells = INFO_ORDER.map(k => {
    const f = FIELDS[k];
    const v = String(o[k] || '').trim();
    const val = v ? `${esc(v)}${f.suffix ? `<span class="unit">${f.suffix}</span>` : ''}` : f.blank ? esc(f.blank) : '<span class="none">미기재</span>';
    return `<div class="cell${INFO_WIDE.includes(k) ? ' wide' : ''}"><div class="cell-label">${f.label}<small>${f.en}</small></div><div class="cell-value">${val}</div></div>`;
  }).join('');
  const exam = o.exam || {};
  const examHTML = EXAM.map(e => {
    const g = grade(exam[e.k]);
    const lv = GRADES.indexOf(g);
    const cls = g === '■■' ? ' ex-redact' : g ? '' : ' ex-none';
    const bars = [0, 1, 2, 3, 4, 5].map(i => `<i${lv >= i ? ' class="on"' : ''}></i>`).join('');
    return `<div class="ex${cls}"><div class="cell-label">${e.label}<small>${e.en}</small></div><div class="ex-grade">${g ? esc(g) : '미기재'}${g === '■■' ? '<small>측정 불능</small>' : ''}</div><div class="ex-bar" aria-hidden="true">${bars}</div></div>`;
  }).join('');
  const notesHTML = NOTES.map(n => {
    const v = String(o[n.k] || '').trim();
    return `<article class="note"><div class="cell-label">${n.label}<small>${n.en}</small></div>${v ? `<p>${esc(v)}</p>` : '<p class="none">미기재</p>'}</article>`;
  }).join('');
  const voices = VOICE.map((label, i) => {
    const t = String(voice[label] || '').trim();
    return `
      <div class="vo${t ? '' : ' is-empty'}">
        <button type="button" class="vo-head" aria-expanded="false"${t ? '' : ' disabled'}>
          <span class="vo-no">VOICE ${String(i + 1).padStart(2, '0')}</span>
          <span class="vo-title">${esc(label)}</span>
          <span class="vo-state">${t ? '' : '기록 없음'}</span>
          <span class="vo-icon" aria-hidden="true"></span>
        </button>
        ${t ? `<div class="vo-body"><div class="vo-inner"><p class="vo-text"><span class="vo-ghost">${esc(t)}</span><span class="vo-typed"></span></p></div></div>` : ''}
      </div>`;
  }).join('');
  main.innerHTML = `
    <a class="back" href="#list">← OPERATOR LIST</a>
    <header class="dossier hud">
      <div class="dossier-img">${portraitHTML(o.portrait)}</div>
      <div class="dossier-id">
        <div class="eyebrow">PERSONNEL FILE · EBL-${s}</div>
        <h1 class="codename">${esc(o.name_en || o.name_ko)}</h1>
        <p class="codename-ko">${esc(o.name_ko)}</p>
        <div class="dossier-tags">
          ${badgeHTML(o.class, true)}
          ${o.branch ? `<span class="tag">${esc(o.branch)}</span>` : ''}
          ${o.infection ? `<span class="tag${o.infection === '감염자' ? ' tag-warn' : ''}">${esc(o.infection)}</span>` : ''}
          ${o.faction ? `<span class="tag">${esc(o.faction)}</span>` : ''}
        </div>
        <div class="dossier-meta">LAST UPDATE ${fmt(o.updated_at)}${o.updated_by ? ` · BY ${esc(o.updated_by)}` : ''}</div>
      </div>
      <span class="ghost-serial" aria-hidden="true">${s}</span>
    </header>
    <div class="stripe" aria-hidden="true"></div>
    <div class="tabs" role="tablist">
      <button type="button" class="tab" role="tab" id="t-file" aria-controls="p-file" aria-selected="${detailTab === 'file'}">파일 <small>FILE</small></button>
      <button type="button" class="tab" role="tab" id="t-voice" aria-controls="p-voice" aria-selected="${detailTab === 'voice'}">음성 기록 <small>VOICE ${filled}/${VOICE.length}</small></button>
    </div>
    <section id="p-file" role="tabpanel" aria-labelledby="t-file"${detailTab === 'file' ? '' : ' hidden'}>
      <div class="info">${cells}</div>
      <div class="subhead"><span class="eyebrow">MEDICAL EXAMINATION</span><h3>종합검진</h3></div>
      <div class="exam">${examHTML}</div>
      <div class="subhead"><span class="eyebrow">PROFILE</span><h3>성격 · 특징 · 과거</h3></div>
      <div class="notes">${notesHTML}</div>
    </section>
    <section id="p-voice" role="tabpanel" aria-labelledby="t-voice"${detailTab === 'voice' ? '' : ' hidden'}>
      <div class="voice">${voices}</div>
    </section>
    <div class="detail-foot">
      <span class="mono">REGISTERED ${fmt(o.created_at)}</span>
      <div class="foot-actions">
        <button type="button" class="btn btn-ghost btn-sm" id="show-history" aria-expanded="false">수정 기록</button>
        <a class="btn btn-primary btn-sm" href="#edit-${esc(o.id)}">수정하기</a>
      </div>
    </div>
    <section class="history" id="history" hidden></section>`;

  const setTab = t => {
    detailTab = t;
    $('#t-file').setAttribute('aria-selected', t === 'file');
    $('#t-voice').setAttribute('aria-selected', t === 'voice');
    $('#p-file').hidden = t !== 'file';
    $('#p-voice').hidden = t !== 'voice';
  };
  $('#t-file').addEventListener('click', () => setTab('file'));
  $('#t-voice').addEventListener('click', () => setTab('voice'));

  $$('.vo-head', main).forEach(b => b.addEventListener('click', () => {
    const item = b.closest('.vo');
    if (item.classList.contains('is-empty')) return;
    const open = !item.classList.contains('open');
    item.classList.toggle('open', open);
    b.setAttribute('aria-expanded', open);
    const typed = $('.vo-typed', item);
    const text = $('.vo-ghost', item).textContent;
    if (open) {
      typed.textContent = '';
      setTimeout(() => { if (item.classList.contains('open')) typeText(typed, text); }, reduced() ? 0 : 160);
    } else {
      stopType(typed);
      setTimeout(() => { if (!item.classList.contains('open')) typed.textContent = ''; }, 400);
    }
  }));

  const hb = $('#show-history');
  const hs = $('#history');
  hb.addEventListener('click', async () => {
    if (!hs.hidden) { hs.hidden = true; hb.setAttribute('aria-expanded', 'false'); return; }
    hs.hidden = false;
    hb.setAttribute('aria-expanded', 'true');
    hs.innerHTML = '<div class="h-empty">기록을 불러오는 중…</div>';
    try {
      const list = await api.history(o.id);
      const act = { create: '생성', update: '수정', delete: '삭제' };
      hs.innerHTML = `
        <div class="history-head"><span class="eyebrow">REVISION LOG</span><p>최근 30개까지 보여요. 되돌리면 그 시점 내용으로 새로 저장돼요.</p></div>
        ${list.length ? list.map((h, i) => `
          <div class="h-row">
            <span class="h-time">${fmt(h.created_at)}</span>
            <span class="h-act">${act[h.action] || esc(h.action)}</span>
            <span class="h-who">${esc(h.editor || '알 수 없음')}</span>
            ${i === 0 ? '<span class="h-time">현재</span>' : `<button type="button" class="btn btn-ghost btn-sm" data-restore="${i}">이 버전으로 되돌리기</button>`}
          </div>`).join('') : '<div class="h-empty">아직 수정 기록이 없어요.</div>'}`;
      $$('[data-restore]', hs).forEach(btn => btn.addEventListener('click', () => restore(o.id, list[Number(btn.dataset.restore)].snapshot)));
    } catch (e) {
      hs.innerHTML = `<div class="h-empty">${esc(errText(e))}</div>`;
    }
  });
}

async function restore(id, snap, msg) {
  const c = await auth(msg);
  if (!c) return;
  try {
    await api.save(c.pw, id, snap, c.nick + ' (복원)');
    toast('선택한 버전으로 되돌렸어요.');
    render();
  } catch (e) {
    if (isAuthErr(e)) { forget(); return restore(id, snap, errText(e)); }
    toast(errText(e), true);
  }
}

function squareImage(file, size = 360) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(img.naturalWidth, img.naturalHeight);
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const x = c.getContext('2d');
      x.imageSmoothingQuality = 'high';
      x.drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      let d = c.toDataURL('image/webp', 0.86);
      if (!d.startsWith('data:image/webp')) d = c.toDataURL('image/jpeg', 0.88);
      resolve(d);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image')); };
    img.src = url;
  });
}

function fieldHTML(k, o) {
  const f = FIELDS[k];
  const v = esc(o[k] || '');
  const lab = `<label for="f-${k}">${f.label}${k === 'name_ko' || k === 'name_en' ? ' <span class="req">*</span>' : ''}<small>${f.en}</small></label>`;
  let ctl;
  if (k === 'infection') {
    ctl = `<select id="f-${k}"><option value="">선택 안 함</option>${['감염자', '비감염자'].map(x => `<option${o[k] === x ? ' selected' : ''}>${x}</option>`).join('')}</select>`;
  } else if (k === 'class') {
    ctl = `<select id="f-${k}"><option value="">선택 안 함</option>${CLASSES.map(c => `<option value="${c.ko}"${o[k] === c.ko ? ' selected' : ''}>${c.ko} · ${c.en}</option>`).join('')}</select>`;
  } else if (k === 'branch') {
    ctl = `<select id="f-${k}"></select>`;
  } else if (f.suffix) {
    ctl = `<div class="suffix"><input type="text" id="f-${k}" value="${v}" maxlength="20"${f.blank ? ` placeholder="비워 두면 '${f.blank}'으로 표시돼요"` : ''}><span>${f.suffix}</span></div>`;
  } else {
    ctl = `<input type="text" id="f-${k}" value="${v}" maxlength="80">`;
  }
  return `<div class="field${k === 'title' ? ' wide' : ''}">${lab}${ctl}</div>`;
}

function fillBranch(cls, current) {
  const sel = $('#f-branch');
  const c = classOf(cls);
  sel.disabled = !c;
  sel.innerHTML = c
    ? `<option value="">선택 안 함</option>${c.b.map(b => `<option${b === current ? ' selected' : ''}>${b}</option>`).join('')}`
    : '<option value="">병과를 먼저 골라 주세요</option>';
}

async function viewEdit(main, id) {
  setNav(id ? '' : 'new');
  let c = await auth();
  if (!c) { location.hash = id ? '#oc-' + id : '#list'; return; }
  const o = id ? await api.get(id) : blank();
  let portrait = o.portrait || '';
  const voice = o.voice || {};
  const voices = VOICE.map((label, i) => {
    const t = voice[label] || '';
    return `
      <div class="vo vo-edit">
        <button type="button" class="vo-head" aria-expanded="false" aria-controls="v-${i}">
          <span class="vo-no">VOICE ${String(i + 1).padStart(2, '0')}</span>
          <span class="vo-title">${esc(label)}</span>
          <span class="vo-state${t ? ' filled' : ''}">${t ? '작성됨' : '비어 있음'}</span>
          <span class="vo-icon" aria-hidden="true"></span>
        </button>
        <div class="vo-body"><div class="vo-inner"><div class="vo-field">
          <label class="sr-only" for="v-${i}">${esc(label)} 대사</label>
          <textarea id="v-${i}" data-label="${esc(label)}" rows="3" placeholder="${esc(label)} 대사를 적어 주세요">${esc(t)}</textarea>
        </div></div></div>
      </div>`;
  }).join('');
  main.innerHTML = `
    <a class="back" href="${id ? '#oc-' + esc(id) : '#list'}">← ${id ? 'BACK TO FILE' : 'OPERATOR LIST'}</a>
    <div class="form-head">
      <div class="eyebrow">${id ? 'FILE UPDATE · EBL-' + serial(id) : 'NEW REGISTRATION'}</div>
      <h1 class="page-title">${id ? esc(o.name_ko || o.name_en) + ' 수정' : '신규 오퍼레이터 등록'}</h1>
      <p class="who">편집자 <b id="who-nick">${esc(c.nick)}</b> · <button type="button" class="linkbtn" id="switch-user">다른 이름으로 편집</button></p>
    </div>
    <form id="oc-form" novalidate>
      <section class="fs hud">
        <h2 class="fs-title"><span>PAGE 1</span>파일</h2>
        <div class="fs-grid">
          <div class="portrait-field">
            <div class="portrait-box" id="portrait-box">${portraitHTML(portrait)}</div>
            <div class="portrait-actions">
              <label class="btn btn-sm file-btn">이미지 선택<input class="sr-only" type="file" id="f-portrait" accept="image/*"></label>
              <button type="button" class="btn btn-ghost btn-sm" id="clear-portrait"${portrait ? '' : ' hidden'}>이미지 지우기</button>
            </div>
            <p class="hint">정사각형 두상 이미지를 권장해요. 다른 비율은 가운데를 기준으로 자동으로 잘려요.</p>
          </div>
          <div class="inputs">${FORM_ORDER.map(k => fieldHTML(k, o)).join('')}</div>
        </div>
        <div class="fs-sub">
          <h3 class="fs-subtitle"><span>MEDICAL EXAMINATION</span>종합검진</h3>
          <div class="inputs inputs-3">${EXAM.map(e => `
            <div class="field"><label for="ex-${e.k}">${e.label}<small>${e.en}</small></label>
              <select id="ex-${e.k}"><option value="">선택 안 함</option>${GRADES.map(g => `<option value="${g}"${grade((o.exam || {})[e.k]) === g ? ' selected' : ''}>${GRADE_LABEL[g] || g}</option>`).join('')}</select>
            </div>`).join('')}
          </div>
        </div>
        <div class="fs-sub">
          <h3 class="fs-subtitle"><span>PROFILE</span>성격 · 특징 · 과거</h3>
          <div class="notes-edit">${NOTES.map(n => `
            <div class="field"><label for="n-${n.k}">${n.label}<small>${n.en}</small></label>
              <textarea id="n-${n.k}" rows="5" maxlength="5000" placeholder="자유롭게 적어 주세요. 줄바꿈도 그대로 보여요.">${esc(o[n.k] || '')}</textarea>
            </div>`).join('')}
          </div>
        </div>
      </section>
      <section class="fs hud">
        <h2 class="fs-title"><span>PAGE 2</span>음성 기록</h2>
        <div class="voice">${voices}</div>
      </section>
      <div class="actions">
        ${id ? '<button type="button" class="btn btn-danger" id="del">삭제</button>' : ''}
        <div class="actions-right">
          <span class="status" id="status" aria-live="polite"></span>
          <a class="btn btn-ghost" href="${id ? '#oc-' + esc(id) : '#list'}">취소</a>
          <button type="submit" class="btn btn-primary" id="save">저장</button>
        </div>
      </div>
    </form>`;

  fillBranch(o.class, o.branch);
  $('#f-class').addEventListener('change', e => fillBranch(e.target.value, ''));

  const status = $('#status');
  const setStatus = (m, bad) => { status.textContent = m; status.classList.toggle('err', !!bad); };

  $('#switch-user').addEventListener('click', async () => {
    forget();
    session.nick = null;
    local.set('ebl_nick', null);
    const n = await gate();
    if (n) { c = n; $('#who-nick').textContent = n.nick; }
  });

  $('#f-portrait').addEventListener('change', async e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      portrait = await squareImage(file);
      $('#portrait-box').innerHTML = portraitHTML(portrait);
      $('#clear-portrait').hidden = false;
      setStatus('');
    } catch (err) {
      setStatus('이 파일은 이미지로 읽을 수 없어요. PNG나 JPG 파일을 골라 주세요.', true);
    }
    e.target.value = '';
  });
  $('#clear-portrait').addEventListener('click', () => {
    portrait = '';
    $('#portrait-box').innerHTML = portraitHTML('');
    $('#clear-portrait').hidden = true;
  });

  $$('.vo-edit', main).forEach(item => {
    const head = $('.vo-head', item);
    const ta = $('textarea', item);
    const st = $('.vo-state', item);
    head.addEventListener('click', () => {
      const open = !item.classList.contains('open');
      item.classList.toggle('open', open);
      head.setAttribute('aria-expanded', open);
      if (open) setTimeout(() => ta.focus({ preventScroll: true }), reduced() ? 0 : 200);
    });
    ta.addEventListener('input', () => {
      const has = !!ta.value.trim();
      st.textContent = has ? '작성됨' : '비어 있음';
      st.classList.toggle('filled', has);
    });
  });

  const del = $('#del');
  if (del) {
    let armed = false, timer;
    del.addEventListener('click', async () => {
      if (!armed) {
        armed = true;
        del.classList.add('armed');
        del.textContent = '한 번 더 누르면 삭제돼요';
        timer = setTimeout(() => { armed = false; del.classList.remove('armed'); del.textContent = '삭제'; }, 4000);
        return;
      }
      clearTimeout(timer);
      del.disabled = true;
      try {
        if (!cred()) { const n = await gate(); if (!n) { del.disabled = false; return; } c = n; }
        await api.remove(c.pw, id, c.nick);
        toast('오퍼레이터를 삭제했어요.');
        location.hash = '#list';
      } catch (e) {
        if (isAuthErr(e)) forget();
        setStatus(errText(e), true);
        del.disabled = false;
        armed = false;
        del.classList.remove('armed');
        del.textContent = '삭제';
      }
    });
  }

  $('#oc-form').addEventListener('submit', async e => {
    e.preventDefault();
    const data = { portrait, voice: {}, exam: {} };
    FORM_ORDER.forEach(k => { data[k] = $('#f-' + k).value.trim(); });
    EXAM.forEach(x => { const v = $('#ex-' + x.k).value; if (v) data.exam[x.k] = v; });
    NOTES.forEach(n => { data[n.k] = $('#n-' + n.k).value.trim(); });
    $$('.vo-edit textarea', main).forEach(t => { const v = t.value.trim(); if (v) data.voice[t.dataset.label] = v; });
    if (!data.name_ko && !data.name_en) {
      setStatus('코드네임(한글 또는 영어)을 하나 이상 적어 주세요.', true);
      $('#f-name_ko').focus();
      return;
    }
    const btn = $('#save');
    btn.disabled = true;
    btn.textContent = '저장 중…';
    setStatus('');
    try {
      if (!cred()) { const n = await gate(); if (!n) throw new Error('cancel'); c = n; }
      const newId = await api.save(c.pw, id, data, c.nick);
      toast(id ? '수정 내용을 저장했어요.' : '새 오퍼레이터를 등록했어요.');
      location.hash = '#oc-' + (newId || id);
    } catch (err) {
      btn.disabled = false;
      btn.textContent = '저장';
      if (String(err.message) === 'cancel') return;
      if (isAuthErr(err)) { forget(); setStatus('편집 비밀번호가 맞지 않아요. 저장을 다시 누르면 비밀번호를 다시 물어봐요.', true); return; }
      setStatus(errText(err), true);
    }
  });
}

function route() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (h.startsWith('oc-')) return { v: 'detail', id: h.slice(3) };
  if (h.startsWith('edit-')) return { v: 'edit', id: h.slice(5) };
  if (h === 'new') return { v: 'edit', id: null };
  return { v: 'list' };
}

let lastDetail = null;
async function render() {
  const r = route();
  const main = $('#main');
  if (r.v === 'detail' && r.id !== lastDetail) detailTab = 'file';
  lastDetail = r.v === 'detail' ? r.id : lastDetail;
  main.innerHTML = '<div class="loading">DATA LOADING<span>_</span></div>';
  window.scrollTo(0, 0);
  try {
    if (r.v === 'list') await viewList(main);
    else if (r.v === 'detail') await viewDetail(main, r.id);
    else await viewEdit(main, r.id);
  } catch (e) {
    main.innerHTML = `<div class="errorbox"><b>ACCESS ERROR</b>${esc(errText(e))}<br><br><a class="btn" href="#list">목록으로</a></div>`;
  }
}

function isDark() {
  const t = document.documentElement.getAttribute('data-theme');
  return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function paintTheme() { $('#theme-label').textContent = isDark() ? 'DARK' : 'LIGHT'; }
$('#theme').addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  local.set('ebl_theme', next);
  paintTheme();
});
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paintTheme);
paintTheme();

if (DEMO) $('#demo-banner').hidden = false;
window.addEventListener('hashchange', render);
render();
})();
