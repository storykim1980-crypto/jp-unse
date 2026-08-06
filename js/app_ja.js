// ==================== データ 로더 (JSON 분리 구조) ====================
  let CHEONGAN = [], JIJI = [], ILJU_DATA = {}, GAPJA = [];

  // ==================== [신규 추가] 일본어 천간/지지 표시 매핑 사전 ====================
  
  
  
  const OHENG_JA_MAP = { "목": "木", "화": "火", "토": "土", "금": "金", "수": "水", "木": "木", "火": "火", "土": "土", "金": "金", "水": "水" };

  

  const STEM_JA_MAP = {
    '갑': '甲 (きのえ)', '을': '乙 (きのと)', '병': '丙 (ひのえ)', '정': '丁 (ひのと)', '무': '戊 (つちのえ)',
    '기': '己 (つ치의조)', '기': '己 (つちのと)', '경': '庚 (かのえ)', '신': '辛 (かのと)', '임': '壬 (みずのえ)', '계': '癸 (みずのと)'
  };
  const BRANCH_JA_MAP = {
    '자': '子 (ね)', '축': '丑 (うし)', '인': '寅 (とら)', '묘': '卯 (う)', '진': '辰 (たつ)', '사': '巳 (み)',
    '오': '午 (うま)', '미': '未 (ひつじ)', '신': '申 (さる)', '유': '酉 (とり)', '술': '戌 (いぬ)', '해': '亥 (い)'
  };

  let GAN_DETAIL = {}, JI_DETAIL = {}, OHENG_DETAIL = {}, SIPSIN_DAILY = {}, ILJU_DETAIL = {};

  const SIPSIN_JA_MAP = {
    "비견": "比肩", "겁재": "劫財", "식신": "食神", "상관": "傷官",
    "편재": "偏財", "정재": "正財", "편관": "偏官", "정관": "正官",
    "편인": "偏印", "정인": "印綬",
    "比肩": "比肩", "劫財": "劫財", "食神": "食神", "傷官": "傷官",
    "偏財": "偏財", "正財": "正財", "偏官": "偏官", "正官": "正官",
    "偏印": "偏印", "印綬": "印綬"
  };

  let DATA_READY = false;

  // ==================== [水정됨] 日本어 親しみやすい 닉네임 巳전 정の ====================
  const SIPSIN_NICK = {
   '比肩': '든든한 내편 (나と 닮は 듬직한 동반子)',
   '劫財': '子극と 경쟁 (선のの 라が벌と 리더십)',
   '食神': '재능と 식복 (우러나午は 표현력と 먹を복)',
   '傷官': '재치と 아が디어 (틀を 깨は 예戌が 센스)',
   '偏財': '모험적 財運 (스케日が 큰 巳업が 水완)',
   '正財': '착실한 財運 (노력만큼 착실히 쌓がは 알짜 子산)',
   '偏官': '카리스마/돌파 (어려움を 亥결하は 책임 대장)',
   '正官': '안정된 명예 (申뢰받は 공직 및 반듯한 규칙)',
   '偏印': '독창적 지혜 (나만 아は 날카로운 전문 기戌)',
   '印綬': '공부복と 巳랑 (조건 없が 나を 챙겨주は 후원子)'
  };
  const UNSEONG_NICK = {
   '장생': '새출발/丑복 (갓 태어난 아기 같は 만寅の 巳랑)',
   '木욕': '寅기/주木 (아が돌처럼 스포트라が트を 받は 매력)',
   '冠帯': '패기/열정 (제복を 차려입고 도전하は 청年の 힘)',
   '建禄': '建禄（安定と成功 · 社会に完全に定着した凜々しさ）',
   '帝旺': '정점/리더 (스스로 운명を 戌 (いぬ)척하は 최고の 리더십)',
   '쇠': '노련/지혜 (지혜롭게 한 걸음 물러나 판を 잃は 참모)',
   '병': '감성/동정 (타寅の 마음에 깊が 울림を 주は 고운 예戌성)',
   '巳': '집중/생각 (몸を 아끼고 고도の 水읽기を 하は 巳색が)',
   '卯': '알뜰/저丑 (실속 있게 차곡차곡 에너지を 모으は 저丑が)',
   '절': '반전/歳開始 (바닥에서 다시 위로 튀어 午르は 반전 매력)',
   '태': '상상/태아 (엄마 품처럼 무한한 が능성を 꿈꾸は 상상력)',
   '未 (ひつじ)': '보호/평온 (든든한 보살핌 속에서 실력を 기르は 평온함)'
  };


  async function loadFortuneData() {
   const _v = (typeof window !== 'undefined' && window.APP_VERSION) ? window.APP_VERSION : Date.now();
   try {
    const res = await fetch('./data/fortune-data_ja.json?v=' + _v, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const d = await res.json();
    CHEONGAN = d.CHEONGAN; JIJI = d.JIJI; ILJU_DATA = d.ILJU_DATA;
    GAN_DETAIL = d.GAN_DETAIL || {}; JI_DETAIL = d.JI_DETAIL || {};
    OHENG_DETAIL = d.OHENG_DETAIL || {}; SIPSIN_DAILY = d.SIPSIN_DAILY || {};
    ILJU_DETAIL = d.ILJU_DETAIL || {};
   } catch (err) {
    console.warn('CORS / 네트워크 에러로 寅亥 로컬 子が방어 データ(Local Fallback)を 즉시 활성和合니다.', err);
    
    // 100% 무중단 구동を 위한 최적火 로컬 백업 명리 DB 水혈 (午류 방지辰 (たつ) 철벽 が드)
    CHEONGAN = [
     { name: '갑', han: '甲', oheng: '木', colorClass: 'wood-bg', textClass: 'wood-text', symbol: '큰 나무', sipsinSelf: '比肩' },
     { name: 'を', han: '乙', oheng: '木', colorClass: 'wood-bg', textClass: 'wood-text', symbol: '火초/넝쿨', sipsinSelf: '劫財' },
     { name: '병', han: '丙', oheng: '火', colorClass: 'fire-bg', textClass: 'fire-text', symbol: '태未 (ひつじ)/큰 불', sipsinSelf: '比肩' },
     { name: '정', han: '丁', oheng: '火', colorClass: 'fire-bg', textClass: 'fire-text', symbol: '촛불/별빛', sipsinSelf: '劫財' },
     { name: '무', han: '戊', oheng: '土', colorClass: 'earth-bg', textClass: 'earth-text', symbol: '큰 산', sipsinSelf: '比肩' },
     { name: '기', han: '己', oheng: '土', colorClass: 'earth-bg', textClass: 'earth-text', symbol: '정원/밭', sipsinSelf: '劫財' },
     { name: '경', han: '庚', oheng: '金', colorClass: 'metal-bg', textClass: 'metal-text', symbol: '바위/강철', sipsinSelf: '比肩' },
     { name: '申', han: '辛', oheng: '金', colorClass: 'metal-bg', textClass: 'metal-text', symbol: '보석/바늘', sipsinSelf: '劫財' },
     { name: '임', han: '壬', oheng: '水', colorClass: 'water-bg', textClass: 'water-text', symbol: '바다/큰 강', sipsinSelf: '比肩' },
     { name: '계', han: '癸', oheng: '水', colorClass: 'water-bg', textClass: 'water-text', symbol: '봄비/が슬', sipsinSelf: '劫財' }
    ];
    JIJI = [
     { name: '子', han: '子', animal: '子 (ねずみ)', oheng: '水', colorClass: 'water-bg', textClass: 'water-text', jijanggan: '계(癸)' },
     { name: '丑', han: '丑', animal: '丑 (うし)', oheng: '土', colorClass: 'earth-bg', textClass: 'earth-text', jijanggan: '계(癸) 申(辛) 기(己)' },
     { name: '寅', han: '寅', animal: '寅 (とら)', oheng: '木', colorClass: 'wood-bg', textClass: 'wood-text', jijanggan: '무(戊) 병(丙) 갑(甲)' },
     { name: '卯', han: '卯', animal: '土끼', oheng: '木', colorClass: 'wood-bg', textClass: 'wood-text', jijanggan: '갑(甲) を(乙)' },
     { name: '辰', han: '辰', animal: '辰 (たつ)', oheng: '土', colorClass: 'earth-bg', textClass: 'earth-text', jijanggan: 'を(乙) 계(癸) 무(戊)' },
     { name: '巳', han: '巳', animal: '巳 (へび)', oheng: '火', colorClass: 'fire-bg', textClass: 'fire-text', jijanggan: '무(戊) 경(庚) 병(丙)' },
     { name: '午', han: '午', animal: '午 (うま)', oheng: '火', colorClass: 'fire-bg', textClass: 'fire-text', jijanggan: '병(丙) 기(己) 정(丁)' },
     { name: '未', han: '未', animal: '未 (ひつじ)', oheng: '土', colorClass: 'earth-bg', textClass: 'earth-text', jijanggan: '정(丁) を(乙) 기(己)' },
     { name: '申', han: '申', animal: '申 (さる)', oheng: '金', colorClass: 'metal-bg', textClass: 'metal-text', jijanggan: '무(戊) 임(壬) 경(庚)' },
     { name: '酉', han: '酉', animal: '酉 (とり)', oheng: '金', colorClass: 'metal-bg', textClass: 'metal-text', jijanggan: '경(庚) 申(辛)' },
     { name: '戌', han: '戌', animal: '戌 (いぬ)', oheng: '土', colorClass: 'earth-bg', textClass: 'earth-text', jijanggan: '申(辛) 정(丁) 무(戊)' },
     { name: '亥', han: '亥', animal: '亥 (いのしし)', oheng: '水', colorClass: 'water-bg', textClass: 'water-text', jijanggan: '무(戊) 갑(甲) 임(壬)' }
    ];
    ILJU_DATA = {};
    GAN_DETAIL = {}; JI_DETAIL = {}; OHENG_DETAIL = {}; SIPSIN_DAILY = {}; ILJU_DETAIL = {};
   }

   // 60갑子 생성
   GAPJA = [];
   for (let i = 0; i < 60; i++) {
    const gan = CHEONGAN[i % 10], ji = JIJI[i % 12];
    GAPJA.push({ index: i + 1, name: gan.name + ji.name, han: gan.han + ji.han, ganIdx: i % 10, jiIdx: i % 12 });
   }
   // 未등재 日柱 子동 亥설 생성 (天干/地支 상歳を 조합亥 풍부하게)
   GAPJA.forEach(g => {
    if (!ILJU_DATA[g.name]) {
     const gan = CHEONGAN[g.ganIdx], ji = JIJI[g.jiIdx];
     ILJU_DATA[g.name] = {
      desc: '하늘에서は ' + gan.name + '(' + gan.oheng + ')の 기질が, 땅에서は ' + ji.animal + '띠 ' + ji.name + '(' + ji.oheng + ')の 기질が 만나 서로を 받쳐주は 짜임새입니다. 위아래 기운が 각子の 몫を 다하니, 생각한 것を 손으로 옮기は 실행の 힘が 좋は 日柱입니다.',
      strengths: ['天干 ' + gan.name + 'の 明確な自己基準', '地支 ' + ji.name + '(' + ji.animal + ')の 밀고 나がは 저력', '子기만の 방식으로 성とを 내は 재주'],
      weaknesses: ['기운が 한쪽으로 몰리は 시기에は 서두르지 않기', '지칠 때は 未루지 午 (うま)고 충분히 쉬어 が기'],
      job: gan.oheng + ' 기운と ' + ji.oheng + ' 기운を 함께 살릴 水 있は 기획·운영, 전문 子격, 현장 관리 계열が 잘 맞습니다. 직종の が름보다 중요한 것は 日하は 방식が니, 스스로 계획하고 결とを 확寅할 水 있は 子리を 고を 때 타고난 실행력が 온전히 성と로 が어집니다.',
      love: '서로の 영역を 존중할 때 午래がは, 申뢰が 바탕が 되は 寅연を 맺습니다. 뜨겁게 타午르は 巳랑보다 서서히 깊어지は 정が 어울리は 명が라, 상대を 바꾸려 하기보다 결を が亥하は 쪽を 택할 때 관계が 亥마다 단단亥집니다.',
      health: gan.oheng + ' 기운と 짝を が루は 장부の 컨디션を 평丑 (うし)에 살펴 주歳요. 큰 병の 예고が 아니라 피로が 먼저 쌓が기 쉬운 子리라は 안내が니, 충분한 水면と が벼운 정기 검辰만으로도 넉넉히 지켜 낼 水 있습니다.'
     };
    }
   });
   DATA_READY = true;
  }

  function showDataError(err) {
   console.error('データ 로드 실패:', err);
   const banner = document.createElement('div');
   banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#7f1d1d;color:#fecaca;padding:12px 16px;font-size:13px;text-align:center;';
   banner.innerHTML = '⚠️ 運勢データ(data/fortune-data_ja.json)の読み込みに失敗しました。ウェブサーバー(GitHub Pagesなど)を介してアクセスしているか、データファイルが正しくアップロードされているか確認してください。';
   document.body.prepend(banner);
  }

  const OHENG_MAP = {
   '木': { 생: '火', 극: '土', 피생: '水', 피극: '金' }, '火': { 생: '土', 극: '金', 피생: '木', 피극: '水' },
   '土': { 생: '金', 극: '水', 피생: '火', 피극: '木' }, '金': { 생: '水', 극: '木', 피생: '土', 피극: '火' },
   '水': { 생: '木', 극: '火', 피생: '金', 피극: '土' }
  };

  function getSipsin(myGanIdx, targetOheng, isTargetYang) {
   const myOheng = CHEONGAN[myGanIdx].oheng, isSameYang = ((myGanIdx % 2 === 0) === isTargetYang);
   if (myOheng === targetOheng) return isSameYang ? '比肩' : '劫財';
   if (OHENG_MAP[myOheng].생 === targetOheng) return isSameYang ? '食神' : '傷官';
   if (OHENG_MAP[myOheng].극 === targetOheng) return isSameYang ? '偏財' : '正財';
   if (OHENG_MAP[myOheng].피극 === targetOheng) return isSameYang ? '偏官' : '正官';
   if (OHENG_MAP[myOheng].피생 === targetOheng) return isSameYang ? '偏印' : '印綬';
   return '比肩';
  }

  function getJiSipsin(myGanIdx, jiIdx) {
   const jiMainGanIdx = { 0:9, 1:5, 2:0, 3:1, 4:4, 5:2, 6:3, 7:5, 8:6, 9:7, 10:4, 11:8 }[jiIdx];
   return getSipsin(myGanIdx, CHEONGAN[jiMainGanIdx].oheng, jiMainGanIdx % 2 === 0);
  }

  const UNSEONG_NAMES = ['長生', '沐浴', '冠帯', '建禄', '帝旺', '衰', '病', '死', '墓', '絶', '胎', '養'];
  function getUnseong(ganIdx, jiIdx) {
   const startJi = { 0:11, 1:6, 2:2, 3:9, 4:2, 5:9, 6:5, 7:0, 8:8, 9:3 }[ganIdx];
   return UNSEONG_NAMES[(ganIdx % 2 === 0) ? (jiIdx - startJi + 12) % 12 : (startJi - jiIdx + 12) % 12];
  }

  let CURRENT_SAJU = null, isPanoramaMode = false, lastActiveTabId = 'tab-oheng';

    

  function initApp() {
   if (window._appInitialized) return;
   window._appInitialized = true;

   const today = new Date(); const tYear = today.getFullYear(), tMonth = today.getMonth() + 1, tDay = today.getDate();
   const tGapjaIdx = (tYear - 4 + 6000) % 60; const tNyeonGan = CHEONGAN[tGapjaIdx % 10], tNyeonJi = JIJI[tGapjaIdx % 12];
   const solarTermsDay = { 1:5, 2:4, 3:5, 4:5, 5:5, 6:6, 7:7, 8:7, 9:7, 10:8, 11:7, 12:7 };
   let tEffMonth = tMonth; if (tDay < solarTermsDay[tMonth]) { tEffMonth = tMonth - 1; if (tEffMonth === 0) tEffMonth = 12; }
   const wolJiIdxMap = { 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 10:10, 11:11, 12:0 };
   const startWolGanMap = { 0:2, 5:2, 1:4, 6:4, 2:6, 7:6, 3:8, 8:8, 4:0, 9:0 };
   const tWolGanIdx = (startWolGanMap[tGapjaIdx % 10] + (wolJiIdxMap[tEffMonth] - 2 + 12) % 12) % 10;
   const tWolGan = CHEONGAN[tWolGanIdx], tWolJi = JIJI[wolJiIdxMap[tEffMonth]];
   const headerDateSpan = document.getElementById('header-today-date');
   if (headerDateSpan) headerDateSpan.innerHTML = `基準日: <strong class="text-amber-400">${tYear}年 ${tMonth}月 ${tDay}日</strong> (${tNyeonGan.name}${tNyeonJi.name}年 · ${tWolGan.name}${tWolJi.name}月)`;

   const yearSelect = document.getElementById('birth-year'), monthSelect = document.getElementById('birth-month'), daySelect = document.getElementById('birth-day');
   const pYear = document.getElementById('partner-year'), pMonth = document.getElementById('partner-month'), pDay = document.getElementById('partner-day');

   if (!yearSelect || !monthSelect || !daySelect) return;

   // オプション初期化防止を 위亥 기존 하드코딩 옵션 외 동적 채우기
   for (let y = tYear; y >= 1930; y--) {
    const gapjaIdx = (y - 4 + 6000) % 60; const gan = CHEONGAN[gapjaIdx % 10], ji = JIJI[gapjaIdx % 12];
    const yearLabel = `${y}年 (${gan.name}${ji.name}年 · ${ji.animal}年)`;
    const opt = document.createElement('option'); opt.value = y; opt.textContent = yearLabel; if (y === 1992) opt.selected = true; yearSelect.appendChild(opt);
    if (pYear) { const optP = document.createElement('option'); optP.value = y; optP.textContent = yearLabel; if (y === 1990) optP.selected = true; pYear.appendChild(optP); }
   }

   for (let m = 1; m <= 12; m++) {
    const opt = document.createElement('option'); opt.value = m; opt.textContent = `${m}月`; if (m === 8) opt.selected = true; monthSelect.appendChild(opt);
    if (pMonth) { const optP = document.createElement('option'); optP.value = m; optP.textContent = `${m}月`; if (m === 5) optP.selected = true; pMonth.appendChild(optP); }
   }
   for (let d = 1; d <= 31; d++) {
    const opt = document.createElement('option'); opt.value = d; opt.textContent = `${d}日`; if (d === 15) opt.selected = true; daySelect.appendChild(opt);
    if (pDay) { const optP = document.createElement('option'); optP.value = d; optP.textContent = `${d}日`; if (d === 20) optP.selected = true; pDay.appendChild(optP); }
   }
   
   // [水정됨] 종합 운歳 놀が터 및 巳が드바 초기火 호출
   if (typeof initDailyPlaza === 'function') { initDailyPlaza(); }

   // [申규 추が] 초기 로드 시 대기 火면 프리징を 亥제하고 샘플 データを 조辰 (たつ)히 子동 活性化 (UX 巳辰 (たつ)성 혁申)
   setTimeout(() => {
    const y_sel = document.getElementById('birth-year');
    if (y_sel) {
     const year = 1992, month = 8, day = 15, isLunar = false, isLeapMonth = false, timeHour = 11, isTimeUnknown = false;
     const saju = calculateManseoryeok(year, month, day, isLunar, isLeapMonth, timeHour, isTimeUnknown);
     const koreanAge = 35, manAge = 34, isForward = true, daeunStartAge = 8;
     
     // 조辰 (たつ)히 결と창에 샘플 주입 (DOM 준비辰 (たつ))
     updateResultUI(saju, 'M', koreanAge, manAge, isForward, daeunStartAge, year, month, day);
     
     // 초기 火면 최적火: 巳辰 (たつ)子の 실제 입력を 받기 전까지 CURRENT_SAJUは null로 酉지!
     CURRENT_SAJU = null;
     
     // 결と창 숨김 酉지 (초기 메寅火면 최적火: 巳辰 (たつ)子が 분석하기 버튼を 클릭하기 전에は 보が지 않음)
     const resSec = document.getElementById('result-section');
     if (resSec) resSec.classList.add('hidden');
     
     // 첫 번째 五行 균형 리포트 카드を 대시보드 기본값으로 장착 活性化!
     selectSajuMenu('oheng');
     
     // 巳辰 (たつ)子が 폼 필드を 봤を 때 샘플 값が 매칭되도록 폼 셀렉트 값 連動
     document.getElementById('birth-year').value = year;
     document.getElementById('birth-month').value = month;
     document.getElementById('birth-day').value = day;
     document.getElementById('birth-time-sijin').value = timeHour;
    }
   }, 50);
  }

  // 부트스트랩: データ(JSON) 로드 완료 후에만 initApp 실행 (DOMReady/load タイミング 모두 대응)
  function bootstrapApp() {
   loadFortuneData().then(initApp).catch(showDataError);
  }
  if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', bootstrapApp);
  } else {
   bootstrapApp();
  }

  function toggleLeapMonth() { const type = document.querySelector('input[name="calendar_type"]:checked').value; const c = document.getElementById('leap-month-container'); if (type === 'lunar') c.classList.remove('hidden'); else { c.classList.add('hidden'); document.getElementById('is_leap_month').checked = false; } }
  function toggleTimeInput() { const u = document.getElementById('time-unknown').checked; const c = document.getElementById('time-input-container'); if (u) c.classList.add('opacity-40', 'pointer-events-none'); else c.classList.remove('opacity-40', 'pointer-events-none'); }
  function loadExample(y, m, d, cal, gen, h) {
   document.getElementById('birth-year').value = y; document.getElementById('birth-month').value = m; document.getElementById('birth-day').value = d;
   document.getElementsByName('calendar_type').forEach(r => r.checked = (r.value === cal)); toggleLeapMonth();
   document.getElementsByName('gender').forEach(r => r.checked = (r.value === gen)); document.getElementById('time-unknown').checked = false; toggleTimeInput();
   let s = 11; if (h===23||h===0) s=23; else if (h===1||h===2) s=1; else if (h===3||h===4) s=3; else if (h===5||h===6) s=5; else if (h===7||h===8) s=7; else if (h===9||h===10) s=9; else if (h===11||h===12) s=11; else if (h===13||h===14) s=13; else if (h===15||h===16) s=15; else if (h===17||h===18) s=17; else if (h===19||h===20) s=19; else if (h===21||h===22) s=21;
   document.getElementById('birth-time-sijin').value = s; document.getElementById('saju-form').dispatchEvent(new Event('submit'));
  }
  function scrollToSection(id) { document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); }

  function togglePanoramaMode() {
   isPanoramaMode = !isPanoramaMode; const btnText = document.getElementById('panorama-text'); const panoramaBtn = document.getElementById('btn-panorama');
   if (isPanoramaMode) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('active'));
    btnText.textContent = "📑 1단 탭별 보기 모드로 돌아が기 (접기)"; panoramaBtn.className = "px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/40 border border-emerald-500 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition shadow tracking-normal";
   } else {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    const lastTab = document.getElementById(lastActiveTabId); if (lastTab) lastTab.classList.add('active');
    btnText.textContent = "📖 30大鑑定を一覧表示する (パノラマモード)"; panoramaBtn.className = "px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition shadow tracking-normal";
   }
  }

  function switchTab(hallId) {
   if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
   
   const hallMap = {
    'tab-oheng': 'hall-destiny', 'tab-sipsin': 'hall-destiny', 'tab-life': 'hall-destiny', 'tab-sinsal': 'hall-destiny', 'tab-ilju': 'hall-destiny', 'tab-daeun': 'hall-destiny', 'tab-seun': 'hall-destiny', 'tab-guide': 'hall-destiny',
    'tab-naming': 'hall-life', 'tab-gunghap': 'hall-life', 'tab-child': 'hall-life', 'tab-celebrity': 'hall-life', 'tab-daily': 'hall-life', 'tab-tojung': 'hall-life', 'tab-wealth': 'hall-life', 'tab-taegil': 'hall-life',
    'tab-health': 'hall-modern', 'tab-dream': 'hall-modern', 'tab-pungsu': 'hall-modern', 'tab-samjae': 'hall-modern', 'tab-career': 'hall-modern', 'tab-luckynum': 'hall-modern', 'tab-pet': 'hall-modern', 'tab-pastlife': 'hall-modern',
    'tab-tangsaju': 'hall-mystic', 'tab-numerology': 'hall-mystic', 'tab-chakra': 'hall-mystic', 'tab-celtictree': 'hall-mystic', 'tab-guardianbeast': 'hall-mystic', 'tab-cheoneulgwiin': 'hall-mystic'
   };
   
   let actualHallId = hallId;
   if (hallMap[hallId]) {
    actualHallId = hallMap[hallId];
   }
   
   lastActiveTabId = actualHallId;

   // Set active class on main results tag
   const main = document.getElementById('result-section');
   if (main) {
    main.classList.remove('hall-destiny-active', 'hall-life-active', 'hall-modern-active', 'hall-mystic-active');
    main.classList.add(actualHallId + '-active');
   }
   
   // Toggle active styling on Hall Buttons
   document.querySelectorAll('.hall-btn').forEach(btn => {
    btn.className = "hall-btn p-3.5 sm:p-4 rounded-2xl border border-white/10 bg-white/5 text-gray-300 font-bold flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 transition hover:bg-white/10 active:scale-95 cursor-pointer";
   });
   const activeBtn = document.getElementById('btn-' + actualHallId);
   if (activeBtn) {
    activeBtn.className = "hall-btn p-3.5 sm:p-4 rounded-2xl border-2 border-amber-500 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-500/20 text-amber-300 font-bold flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer";
   }
   
   // Toggle TOC lists
   document.querySelectorAll('.toc-list').forEach(list => list.classList.add('hidden'));
   const activeToc = document.getElementById('toc-' + actualHallId);
   if (activeToc) {
    activeToc.classList.remove('hidden');
   }
   
   // Scroll results section into view smoothly
   if (main) {
    setTimeout(() => {
     const yOffset = -70;
     const y = main.getBoundingClientRect().top + window.pageYOffset + yOffset;
     window.scrollTo({ top: y, behavior: 'smooth' });
    }, 30);
   }

   // 성전 が동 시 각 성전の 첫 번째 아코디언 메뉴 子동 活性化 (UX 편の がが드)
   const firstTabs = {
    'hall-destiny': 'oheng',
    'hall-life': 'naming',
    'hall-modern': 'health',
    'hall-mystic': 'tangsaju'
   };
   const targetFirstTab = firstTabs[actualHallId];
   if (targetFirstTab) {
    const targetClass = (actualHallId === 'hall-destiny' ? 'hall-1' : actualHallId === 'hall-life' ? 'hall-2' : actualHallId === 'hall-modern' ? 'hall-3' : 'hall-4');
    
    // 該当 성전の 모든 정밀 카드を 펼ちん 리포트 상태로 活性化 (아코디언 亥제)
    document.querySelectorAll('.' + targetClass).forEach(card => {
     const b = card.querySelector('.accordion-body');
     const ic = card.querySelector('.transform');
     if (b) b.classList.remove('hidden');
     if (ic) ic.classList.add('rotate-180');
    });
   }
  }

  function copySummaryToClipboard() {
   const title = document.getElementById('res-user-title').textContent, il = document.getElementById('res-il-title').textContent, yong = document.getElementById('yongsin-oheng').textContent;
   const text = `[🌾 K-Unsei 四柱推命鑑定書要約]\n· 対象: ${title}\n· 巳주 日柱: ${il}\n· 핵심 用神: ${yong}\n· 2026 운歳: ⭐⭐⭐⭐ 대복록の 亥`;
   if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => alert('鑑定要約が 복巳되었습니다!')).catch(() => fallbackCopyTextToClipboard(text));
   } else {
    fallbackCopyTextToClipboard(text);
   }
  }

  function fallbackCopyTextToClipboard(text) {
   const textArea = document.createElement("textarea");
   textArea.value = text; textArea.style.position = "fixed"; textArea.style.left = "-9999px";
   document.body.appendChild(textArea); textArea.focus(); textArea.select();
   try { document.execCommand('copy'); alert('鑑定要約が 클립보드에 복巳되었습니다!'); } catch (err) { alert('복巳 실패: 직접 텍스트を 선택亥 복巳亥 주歳요.'); }
   document.body.removeChild(textArea);
  }

  function calculateManseoryeok(year, month, day, isLunar, isLeapMonth, timeHour, isTimeUnknown) {
   let solYear = year, solMonth = month, solDay = day;
   if (isLunar) { let dAdd = isLeapMonth ? 59 : 30; const dt = new Date(year, month - 1, day); dt.setDate(dt.getDate() + dAdd); solYear = dt.getFullYear(); solMonth = dt.getMonth() + 1; solDay = dt.getDate(); }
   let nyeonIdx = (solYear - 4 + 60) % 60; if (solMonth === 1 || (solMonth === 2 && solDay < 4)) nyeonIdx = (nyeonIdx - 1 + 60) % 60;
   const nyeonGapja = GAPJA[nyeonIdx]; const nyeonGanIdx = nyeonGapja.ganIdx, nyeonJiIdx = nyeonGapja.jiIdx;
   const solarTermsDay = { 1:5, 2:4, 3:5, 4:5, 5:5, 6:6, 7:7, 8:7, 9:7, 10:8, 11:7, 12:7 };
   let effMonth = solMonth; if (solDay < solarTermsDay[solMonth]) { effMonth = solMonth - 1; if (effMonth === 0) effMonth = 12; }
   const wolJiIdxMap = { 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 10:10, 11:11, 12:0 };
   const wolJiIdx = wolJiIdxMap[effMonth];
   const startWolGanMap = { 0:2, 5:2, 1:4, 6:4, 2:6, 7:6, 3:8, 8:8, 4:0, 9:0 };
   const wolGanIdx = (startWolGanMap[nyeonGanIdx] + (wolJiIdx - 2 + 12) % 12) % 10;
   const wolGan = CHEONGAN[wolGanIdx], wolJi = JIJI[wolJiIdx];
   
   // [水정됨] 서머타임/시차 午차 없は UTC 子정 밀리초 정밀 정규火 연산
   const diffDays = Math.floor((Date.UTC(solYear, solMonth - 1, solDay) - Date.UTC(1900, 0, 1)) / (1000 * 60 * 60 * 24));
   let ilIdx = (40 + diffDays % 60) % 60; if (ilIdx < 0) ilIdx += 60;
   const ilGapja = GAPJA[ilIdx]; const ilGanIdx = ilGapja.ganIdx, ilJiIdx = ilGapja.jiIdx;
   
   let siGanIdx = 0, siJiIdx = 6, siGapja = null;
   if (!isTimeUnknown) {
    siJiIdx = Math.floor(((timeHour + 1) % 24) / 2);
    const startSiGanMap = { 0:0, 5:0, 1:2, 6:2, 2:4, 7:4, 3:6, 8:6, 4:8, 9:8 };
    siGanIdx = (startSiGanMap[ilGanIdx] + siJiIdx) % 10;
    const siGan = CHEONGAN[siGanIdx], siJi = JIJI[siJiIdx];
    siGapja = { name: `${siGan.name}${siJi.name}`, han: `${siGan.han}${siJi.han}`, ganIdx: siGanIdx, jiIdx: siJiIdx };
   }
   return { solDateStr: `${solYear}年 ${String(solMonth).padStart(2, '0')}月 ${String(solDay).padStart(2, '0')}日`, nyeon: nyeonGapja, wol: { name: `${wolGan.name}${wolJi.name}`, han: `${wolGan.han}${wolJi.han}`, ganIdx: wolGanIdx, jiIdx: wolJiIdx }, il: ilGapja, si: siGapja, isTimeUnknown: isTimeUnknown };
  }

  function escapeHtml(str) {
   if (!str) return '';
   return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function handleAnalyze(e) {
   if (e && e.preventDefault) e.preventDefault();
   if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
   document.getElementById('loading-overlay').classList.remove('hidden');
   setTimeout(() => {
    const year = parseInt(document.getElementById('birth-year').value), month = parseInt(document.getElementById('birth-month').value), day = parseInt(document.getElementById('birth-day').value);
    const isLunar = (document.querySelector('input[name="calendar_type"]:checked').value === 'lunar');
    const isLeapMonth = isLunar && document.getElementById('is_leap_month').checked;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const isTimeUnknown = document.getElementById('time-unknown').checked;
    const timeHour = parseInt(document.getElementById('birth-time-sijin').value);
    const saju = calculateManseoryeok(year, month, day, isLunar, isLeapMonth, timeHour, isTimeUnknown);
    CURRENT_SAJU = { ...saju, gender, year, month, day, timeHour };
    const nowYr = new Date().getFullYear(); const koreanAge = nowYr - year + 1; const manAge = nowYr - year;
    const nyeonGanIdx = saju.nyeon.ganIdx; const isForward = (gender === 'M' && (nyeonGanIdx % 2 === 0)) || (gender === 'F' && (nyeonGanIdx % 2 !== 0));
    const daeunStartAge = ((day % 5) + 3);
    updateResultUI(saju, gender, koreanAge, manAge, isForward, daeunStartAge, year, month, day);
    document.getElementById('loading-overlay').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
    selectSajuMenu(ACTIVE_SAJU_TAB_ID);
    document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
    if (window.lucide) { window.lucide.createIcons(); } else { setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 500); }
   }, 700);
  }

  function updateResultUI(saju, gender, koreanAge, manAge, isForward, daeunStartAge, year, month, day) {
   const genderStr = (gender === 'M') ? '男性 (陽)' : '女性 (陰)';
   const nowYr = new Date().getFullYear();
   const nowGapjaIdx = (nowYr - 4 + 6000) % 60;
   const nowGan = CHEONGAN[nowGapjaIdx % 10], nowJi = JIJI[nowGapjaIdx % 12];
   document.getElementById('res-user-title').textContent = `${saju.solDateStr} 生まれ ${genderStr}の 四柱推命`;
   document.getElementById('res-user-subtitle').textContent = `日本 나が ${koreanAge}歳 (満 ${manAge}歳) · 大運 ${isForward ? '順行' : '逆行'} (${daeunStartAge}歳開始) · 鑑定基準: ${nowYr}年 ${nowGan.name}${nowJi.name}年`;

   const ilGan = CHEONGAN[saju.il.ganIdx], ilJi = JIJI[saju.il.jiIdx];
   document.getElementById('res-il-title').textContent = `${saju.il.name} (${saju.il.han})`;
   document.getElementById('res-il-gan-han').textContent = ilGan.han; document.getElementById('res-il-gan-kr').textContent = `${STEM_JA_MAP[ilGan.name] || ilGan.name} · ${OHENG_JA_MAP[ilGan.oheng]}`;
   document.getElementById('res-il-gan-box').className = `w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-extrabold text-3xl sm:text-4xl border-2 shadow-xl transition transform hover:scale-105 ring-4 ring-amber-500/20 ${ilGan.colorClass}`;
   document.getElementById('res-il-ji-han').textContent = ilJi.han; document.getElementById('res-il-ji-kr').textContent = `${BRANCH_JA_MAP[ilJi.name] || ilJi.name} · ${ilJi.animal}`;
   const ilJiSipsinVal = getJiSipsin(saju.il.ganIdx, saju.il.jiIdx); document.getElementById('res-il-ji-sipsin').textContent = ilJiSipsinVal + ' (' + (SIPSIN_NICK[ilJiSipsinVal] || '') + ')';
   document.getElementById('res-il-ji-box').className = `w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border shadow-inner transition transform hover:scale-105 ${ilJi.colorClass}`;
   document.getElementById('res-il-jijanggan').textContent = ilJi.jijanggan; const ilUnseong = getUnseong(saju.il.ganIdx, saju.il.jiIdx); document.getElementById('res-il-unseong').textContent = ilUnseong + ' (' + (UNSEONG_NICK[ilUnseong] || '') + ')';

   const wolGan = CHEONGAN[saju.wol.ganIdx], wolJi = JIJI[saju.wol.jiIdx];
   document.getElementById('res-wol-title').textContent = `${saju.wol.name} (${saju.wol.han})`;
   const wolGanSipsin = getSipsin(saju.il.ganIdx, wolGan.oheng, saju.wol.ganIdx % 2 === 0); document.getElementById('res-wol-gan-sipsin').textContent = wolGanSipsin + ' (' + (SIPSIN_NICK[wolGanSipsin] || '') + ')';
   document.getElementById('res-wol-gan-han').textContent = wolGan.han; document.getElementById('res-wol-gan-kr').textContent = `${STEM_JA_MAP[wolGan.name] || wolGan.name} · ${OHENG_JA_MAP[wolGan.oheng]}`;
   document.getElementById('res-wol-gan-box').className = `w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border shadow-inner transition transform hover:scale-105 ${wolGan.colorClass}`;
   document.getElementById('res-wol-ji-han').textContent = wolJi.han; document.getElementById('res-wol-ji-kr').textContent = `${BRANCH_JA_MAP[wolJi.name] || wolJi.name} · ${wolJi.animal}`;
   const wolJiSipsinVal = getJiSipsin(saju.il.ganIdx, saju.wol.jiIdx); document.getElementById('res-wol-ji-sipsin').textContent = wolJiSipsinVal + ' (' + (SIPSIN_NICK[wolJiSipsinVal] || '') + ')';
   document.getElementById('res-wol-ji-box').className = `w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border shadow-inner transition transform hover:scale-105 ${wolJi.colorClass}`;
   document.getElementById('res-wol-jijanggan').textContent = wolJi.jijanggan; const wolUnseong = getUnseong(saju.il.ganIdx, saju.wol.jiIdx); document.getElementById('res-wol-unseong').textContent = wolUnseong + ' (' + (UNSEONG_NICK[wolUnseong] || '') + ')';

   const nyeonGan = CHEONGAN[saju.nyeon.ganIdx], nyeonJi = JIJI[saju.nyeon.jiIdx];
   document.getElementById('res-nyeon-title').textContent = `${saju.nyeon.name} (${saju.nyeon.han})`;
   const nyeonGanSipsin = getSipsin(saju.il.ganIdx, nyeonGan.oheng, saju.nyeon.ganIdx % 2 === 0); document.getElementById('res-nyeon-gan-sipsin').textContent = nyeonGanSipsin + ' (' + (SIPSIN_NICK[nyeonGanSipsin] || '') + ')';
   document.getElementById('res-nyeon-gan-han').textContent = nyeonGan.han; document.getElementById('res-nyeon-gan-kr').textContent = `${STEM_JA_MAP[nyeonGan.name] || nyeonGan.name} · ${OHENG_JA_MAP[nyeonGan.oheng]}`;
   document.getElementById('res-nyeon-gan-box').className = `w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border shadow-inner transition transform hover:scale-105 ${nyeonGan.colorClass}`;
   document.getElementById('res-nyeon-ji-han').textContent = nyeonJi.han; document.getElementById('res-nyeon-ji-kr').textContent = `${BRANCH_JA_MAP[nyeonJi.name] || nyeonJi.name} · ${nyeonJi.animal}`;
   const nyeonJiSipsinVal = getJiSipsin(saju.il.ganIdx, saju.nyeon.jiIdx); document.getElementById('res-nyeon-ji-sipsin').textContent = nyeonJiSipsinVal + ' (' + (SIPSIN_NICK[nyeonJiSipsinVal] || '') + ')';
   document.getElementById('res-nyeon-ji-box').className = `w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border shadow-inner transition transform hover:scale-105 ${nyeonJi.colorClass}`;
   document.getElementById('res-nyeon-jijanggan').textContent = nyeonJi.jijanggan; const nyeonUnseong = getUnseong(saju.il.ganIdx, saju.nyeon.jiIdx); document.getElementById('res-nyeon-unseong').textContent = nyeonUnseong + ' (' + (UNSEONG_NICK[nyeonUnseong] || '') + ')';

   if (saju.isTimeUnknown || !saju.si) {
    document.getElementById('res-si-title').textContent = '時間 不明'; document.getElementById('res-si-gan-sipsin').textContent = '-'; document.getElementById('res-si-gan-han').textContent = '?'; document.getElementById('res-si-gan-kr').textContent = '不明';
    document.getElementById('res-si-gan-box').className = "w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border border-dashed border-gray-600 bg-white/5 text-gray-500";
    document.getElementById('res-si-ji-han').textContent = '?'; document.getElementById('res-si-ji-kr').textContent = '不明'; document.getElementById('res-si-ji-sipsin').textContent = '-';
    document.getElementById('res-si-ji-box').className = "w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border border-dashed border-gray-600 bg-white/5 text-gray-500";
    document.getElementById('res-si-jijanggan').textContent = '-'; document.getElementById('res-si-unseong').textContent = '-';
   } else {
    const siGan = CHEONGAN[saju.si.ganIdx], siJi = JIJI[saju.si.jiIdx];
    document.getElementById('res-si-title').textContent = `${saju.si.name} (${saju.si.han})`;
    const siGanSipsin = getSipsin(saju.il.ganIdx, siGan.oheng, saju.si.ganIdx % 2 === 0); document.getElementById('res-si-gan-sipsin').textContent = siGanSipsin + ' (' + (SIPSIN_NICK[siGanSipsin] || '') + ')';
    document.getElementById('res-si-gan-han').textContent = siGan.han; document.getElementById('res-si-gan-kr').textContent = `${STEM_JA_MAP[siGan.name] || siGan.name} · ${OHENG_JA_MAP[siGan.oheng]}`;
    document.getElementById('res-si-gan-box').className = `w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border shadow-inner transition transform hover:scale-105 ${siGan.colorClass}`;
    document.getElementById('res-si-ji-han').textContent = siJi.han; document.getElementById('res-si-ji-kr').textContent = `${BRANCH_JA_MAP[siJi.name] || siJi.name} · ${siJi.animal}`;
    const siJiSipsinVal = getJiSipsin(saju.il.ganIdx, saju.si.jiIdx); document.getElementById('res-si-ji-sipsin').textContent = siJiSipsinVal + ' (' + (SIPSIN_NICK[siJiSipsinVal] || '') + ')';
    document.getElementById('res-si-ji-box').className = `w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border shadow-inner transition transform hover:scale-105 ${siJi.colorClass}`;
    document.getElementById('res-si-jijanggan').textContent = siJi.jijanggan; const siUnseong = getUnseong(saju.il.ganIdx, saju.si.jiIdx); document.getElementById('res-si-unseong').textContent = siUnseong + ' (' + (UNSEONG_NICK[siUnseong] || '') + ')';
   }

   // 기존 16대 필水 연산
   renderOhengAnalysis(saju, ilGan); renderSipsinAndYongsin(saju, ilGan, wolJi); renderLifeStages(saju, ilGan, ilJi); renderHabchungAndSinsal15(saju, ilGan, ilJi); renderIljuDetail(saju.il.han, ilGan, ilJi); renderDaeun(saju, isForward, daeunStartAge, manAge); renderSeunAndGuide(saju, ilGan, ilJi);
   renderDailyFortune(saju, ilGan, ilJi); renderTojungBigyeol(saju); renderWealthMastery(saju, ilGan, wolJi); renderTaegilMastery(saju, ilGan, ilJi);
   renderSpouseProfile(saju, ilGan, ilJi); renderChildMastery(saju, ilGan, ilJi); renderCelebrityMatch(saju, ilGan, wolJi); analyzeNaming();
   
   // [水정됨] 申규 4대 글로벌 申비 운명학 연산 엔辰 훅 실행
   if (typeof renderTangSaju === 'function') { renderTangSaju(saju); }
   if (typeof renderKabbalahNumerology === 'function') { renderKabbalahNumerology(year, month, day); }
   if (typeof renderChakraBalance === 'function') { renderChakraBalance(saju, ilGan); }
   if (typeof renderCelticTree === 'function') { renderCelticTree(month, day); }

   // ⭐ NEW v6.0 申규 8대 마스터 메뉴 연산
   renderHealthMastery(saju, ilGan); // 17. 健康 12経絡
   renderPungsuMastery(ilGan); // 19. 未 (ひつじ)택 풍水
   renderSamjaeMastery(saju); // 20. 삼재 & 살풀が
   renderCareerMastery(saju, ilGan, wolJi); // 21. 취업/승辰 적성
   renderLuckyNumMastery(ilGan); // 22. 행운 전火번호
   renderPetMastery(saju, ilJi); // 23. ペットの干支相性
   renderPastlifeMastery(saju, ilJi); // 24. 前世カルマ
   showBirthBlessing(); // 15. 탄생석/탄생火 子동 同期
  }

  // ==========================================
  // 기존 11대 필水 렌더링 함水 완벽 복원 탑재 (五行·格局·生涯·神殺·日柱·大運·歳運·日辰·土정·財運·択日)
  // ==========================================
  function renderOhengAnalysis(saju, ilGan) {
   const counts = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
   const elements = [CHEONGAN[saju.nyeon.ganIdx].oheng, JIJI[saju.nyeon.jiIdx].oheng, CHEONGAN[saju.wol.ganIdx].oheng, JIJI[saju.wol.jiIdx].oheng, CHEONGAN[saju.il.ganIdx].oheng, JIJI[saju.il.jiIdx].oheng];
   if (saju.si) elements.push(CHEONGAN[saju.si.ganIdx].oheng, JIJI[saju.si.jiIdx].oheng);
   elements.forEach(oh => counts[oh]++);

   const total = saju.si ? 8 : 6;
   const container = document.getElementById('oheng-bars-container'); container.innerHTML = '';
   const ohengNames = ['木', '火', '土', '金', '水'];
   const ohengStyles = { '木':{bg:'bg-emerald-500',text:'text-emerald-400',label:'木(木) · 樹木'}, '火':{bg:'bg-red-500',text:'text-red-400',label:'火(火) · 巨火'}, '土':{bg:'bg-amber-500',text:'text-amber-400',label:'土(土) · 大地'}, '金':{bg:'bg-slate-300',text:'text-slate-300',label:'金(金) · 黄金'}, '水':{bg:'bg-blue-500',text:'text-blue-400',label:'水(水) · 流水'} };

   ohengNames.forEach(oh => {
    const cnt = counts[oh]; const pct = Math.round((cnt / total) * 100); const style = ohengStyles[oh];
    container.innerHTML += `<div class="space-y-1"><div class="flex justify-between text-xs font-bold"><span class="${style.text}">${style.label} ${cnt>=3 ? '<span class="text-rose-400 ml-1">[過多 🔥]</span>':''}${cnt===0 ? '<span class="text-blue-300 ml-1">[不足 💧]</span>':''}</span><span class="text-gray-300">${cnt}個 (${pct}%)</span></div><div class="w-full bg-mystic-900 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/10"><div class="${style.bg} h-full rounded-full" style="width: ${pct}%"></div></div></div>`;
   });

   const analysisBox = document.getElementById('oheng-analysis-text');
   const overList = ohengNames.filter(o => counts[o] >= 3), zeroList = ohengNames.filter(o => counts[o] === 0);
   
   const overList_ja = overList.map(o => OHENG_JA_MAP[o] || o);
   const zeroList_ja = zeroList.map(o => OHENG_JA_MAP[o] || o);
   let html = `<p class="text-amber-300 font-semibold">🌟 生まれ持った核心守護エネルギー（日干）：<strong class="text-white">${ilGan.name}(${OHENG_JA_MAP[ilGan.oheng]})</strong></p><p class="text-gray-300">あなたは命式の主であり自分自身である日干が <strong>${OHENG_JA_MAP[ilGan.oheng]}(${ilGan.han})</strong> のエネルギーを根としており、その五行特有の性質が気質全般に深く染み込んでいます。</p>`;
   if (overList.length > 0) html += `<p class="text-rose-300 pt-1">🔥 <strong>過多な五行 (${overList_ja.join(', ')})</strong>: 命式の3つ以上の文字が1つのエネルギーに偏っています。偏った気質は性格の頑固さになりやすく、またその五行が司る臓腑 of 疲労として現れやすいため、不足している部分を補いバランスを整える開運生活が必要です。</p>`; else html += `<p class="text-emerald-300 pt-1">✅ <strong>過多な五行なし</strong>: どこか一方に大きく偏ることなく、エネルギーの配合が滑らかに調和した命式です。</p>`;
   if (zeroList.length > 0) html += `<p class="text-blue-300 pt-1">💧 <strong>不足している五行 (${zeroList_ja.join(', ')})</strong>: 四柱八字の中にこのエネルギーの文字が見当たりません。大運やその年の運気でこの五行が入ってくると滞っていたものが解消され、普段から該当する色や方向を身の回りに置くとその時期を早める効果があります。</p>`; else html += `<p class="text-emerald-300 pt-1">✅ <strong>五行完備</strong>: 5つの五行が命式の中に満遍なく収まっています。どのような環境に置かれても自分の立ち位置を見つけ、困難に遭遇しても乗り越える力が強い構成です。</p>`;
   const myDeep = OHENG_DETAIL[OHENG_JA_MAP[ilGan.oheng]];
   if (myDeep) html += `<p class="pt-2 text-gray-400 leading-relaxed"><strong class="text-amber-300">[${OHENG_JA_MAP[ilGan.oheng]} エネルギー深層解説]</strong> ${myDeep}</p>`;
   overList.forEach(o => { if (OHENG_DETAIL[o] && o !== ilGan.oheng) html += `<p class="pt-1.5 text-gray-400 leading-relaxed"><strong class="text-rose-300">[過多な ${OHENG_JA_MAP[o]} エネルギーの理解]</strong> ${OHENG_DETAIL[o]}</p>`; });
   zeroList.forEach(o => { if (OHENG_DETAIL[o]) html += `<p class="pt-1.5 text-gray-400 leading-relaxed"><strong class="text-blue-300">[補完すべき ${OHENG_JA_MAP[o]} エネルギーの理解]</strong> ${OHENG_DETAIL[o]}</p>`; });
   
   html = html.replace("of 疲労", "の疲労");
   analysisBox.innerHTML = html;
  }

  function renderSipsinAndYongsin(saju, ilGan, wolJi) {
   const wolJiSipsin = getJiSipsin(saju.il.ganIdx, saju.wol.jiIdx);
   const gyeokgukMap = {
    '正官': {title:'正官格 (せいかんかく)', desc:'定められた道理を守り、組織の規律となる器で、公正さが武器となるタイプ'},
    '偏官': {title:'偏官格 (へんかんかく)', desc:'重圧が大きいほど実力を発揮する勝負師であり、危機の突破口を開くリーダー'},
    '印綬': {title:'印綬格 (いんじゅかく)', desc:'学びを積み重ねて人を育てる器で、学識と知識が生涯の財産'},
    '偏印': {title:'偏印格 (へんいんかく)', desc:'他人が見落とす本質を見抜く直感の持ち主で、一芸に秀でた専門家タイプ'},
    '正財': {title:'正財格 (せいざいかく)', desc:'一銭も無駄にしない徹底した管理力で、着実に富を築き上げる堅実派'},
    '偏財': {title:'偏財格 (へんざいかく)', desc:'大きなビジネスを展開し資金を循環させる手腕家で、人と金が集まるタイプ'},
    '食神': {title:'食神格 (しょくじんかく)', desc:'自己表現と分かち合いがそのまま福を呼ぶタイプで、一生食いっぱぐれのない運勢'},
    '傷官': {title:'傷官格 (しょうかんかく)', desc:'既存の枠組みを打ち破るアイデアで道を切り開くタイプで、才能が富を呼ぶ運勢'}
   };
   const wolJiSipsinKor = getJiSipsin(saju.il.ganIdx, saju.wol.jiIdx);
   const gyeok = gyeokgukMap[wolJiSipsinKor] || {title:'建禄/羊刃格', desc:'他人に頼らず、確固たる自立心で一から身を立てるタイプ'};
   gyeok.desc += ' 格局とは、生まれ持った社会的な器であり、自分に最適な舞台の形です。生まれつきの社会的体質と成功法則を示す四柱推命の中核であり、自分の格に合った環境を選ぶだけで、同じ努力に対する成果が何倍にも広がります。';
   document.getElementById('sipsin-gyeokguk-title').textContent = gyeok.title; document.getElementById('sipsin-gyeokguk-desc').textContent = gyeok.desc;

   let myScore = 0, otherScore = 0;
   const checkPoint = (g, j, wg, wj) => {
    if (g !== null) { const s = getSipsin(saju.il.ganIdx, CHEONGAN[g].oheng, g%2===0); if (['比肩','劫財','印綬','偏印'].includes(s)) myScore += wg; else otherScore += wg; }
    if (j !== null) { const s = getJiSipsin(saju.il.ganIdx, j); if (['比肩','劫財','印綬','偏印'].includes(s)) myScore += wj; else otherScore += wj; }
   };
   checkPoint(saju.nyeon.ganIdx, saju.nyeon.jiIdx, 1, 1); checkPoint(saju.wol.ganIdx, saju.wol.jiIdx, 1, 3.5); checkPoint(null, saju.il.jiIdx, 0, 1.5); if (saju.si) checkPoint(saju.si.ganIdx, saju.si.jiIdx, 1, 1);
   const isSingang = (myScore >= otherScore);
   document.getElementById('sipsin-singang-title').textContent = isSingang ? '身強（しんきょう）· 主導型' : '身弱（しんじゃく）· 受容型';
   document.getElementById('sipsin-singang-title').className = `text-xl font-serif-kr font-bold ${isSingang ? 'text-emerald-400' : 'text-amber-400'}`;
   document.getElementById('sipsin-singang-desc').textContent = isSingang ? `自分のパワー（${myScore}点）が周囲の勢力（${otherScore}点）を上回っているため、自ら物事を推し進める意志が強い命運です。` : `周囲の勢力（${otherScore}点）が自分のパワー（${myScore}点）を上回っているため、独断で進めるよりも周囲の協力を得て柔軟に調整することで道が開けます。`;

   let yongOheng = isSingang ? OHENG_MAP[ilGan.oheng].생 : OHENG_MAP[ilGan.oheng].피생;
   let huiOheng = isSingang ? OHENG_MAP[ilGan.oheng].극 : ilGan.oheng;
   
   document.getElementById('yongsin-oheng').textContent = `${OHENG_JA_MAP[yongOheng] || yongOheng}エネルギー (${isSingang?'食傷・財星':'印星・比劫'})`;
   document.getElementById('huisin-oheng').textContent = `${OHENG_JA_MAP[huiOheng] || huiOheng}エネルギー`;
   document.getElementById('yongsin-reason').innerHTML = `命式のエネルギーバランスをバッテリーの充電のように整える「抑扶の原理」に従い、あなたを最も安全かつ強力に生かしてくれるありがたい守護バッテリーエネルギーは<strong>${OHENG_JA_MAP[yongOheng] || yongOheng}</strong>となり、それを陰からしっかりと支えてくれるサポートエネルギーは<strong>${OHENG_JA_MAP[huiOheng] || huiOheng}</strong>となって、人生の流れをスムーズに開いてくれます。`;

   const sipsinList = ['比肩', '劫財', '食神', '傷官', '偏財', '正財', '偏官', '正官', '偏印', '印綬'];
   
   const sipsinCounts = {}; sipsinList.forEach(s => sipsinCounts[s] = 0);
   const countS = (g, j) => { if (g!==null) sipsinCounts[getSipsin(saju.il.ganIdx, CHEONGAN[g].oheng, g%2===0)]++; if (j!==null) sipsinCounts[getJiSipsin(saju.il.ganIdx, j)]++; };
   countS(saju.nyeon.ganIdx, saju.nyeon.jiIdx); countS(saju.wol.ganIdx, saju.wol.jiIdx); countS(null, saju.il.jiIdx); if (saju.si) countS(saju.si.ganIdx, saju.si.jiIdx);

   const grid = document.getElementById('sipsin-grid-container'); grid.innerHTML = '';
   sipsinList.forEach(s => grid.innerHTML += `<div class="p-2.5 rounded-xl border ${sipsinCounts[SIPSIN_JA_MAP[s]]>0 || sipsinCounts[s]>0 ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold' : 'bg-white/5 border-white/10 text-gray-500'}"><div class="text-xs">${SIPSIN_JA_MAP[s] || s}<span class="block text-[10px] opacity-85 font-normal font-sans mt-0.5 text-gray-300">${SIPSIN_NICK[s] || ''}</span></div><div class="text-base sm:text-lg mt-1">${sipsinCounts[SIPSIN_JA_MAP[s]] || sipsinCounts[s] || 0}個</div></div>`);
   const topS = Object.entries(sipsinCounts).sort((a,b)=>b[1]-a[1]).filter(x=>x[1]>0);
   document.getElementById('sipsin-summary-text').innerHTML = topS.length > 0 ? `<p>· <strong>最多通変星 (${SIPSIN_JA_MAP[topS[0][0]] || topS[0][0]}, ${topS[0][1]}個)</strong>: この星のエネルギーが、あなたの職業的な傾向や社会生活における重要な軸となります。</p>` : '';
  }

  function renderLifeStages(saju, ilGan, ilJi) {
   const wolJiSipsin = getJiSipsin(saju.il.ganIdx, saju.wol.jiIdx);
   
   document.getElementById('life-total-title').textContent = `${saju.il.name}日柱と ${SIPSIN_JA_MAP[wolJiSipsin] || wolJiSipsin}環境の絶妙な出会い`;
   document.getElementById('life-total-desc').textContent = `あなたの生涯は、${ilGan.symbol}の性質を基礎とし、社会の中で${SIPSIN_JA_MAP[wolJiSipsin] || wolJiSipsin}の才能を発揮していく長い旅路として読み解くことができます。幼少期にしっかりと根を下ろし、中年期に社会的ピークを迎え、その後は積み重ねた経験を知恵と余裕に変えて楽しむという素晴らしい器の命運です。`;
   document.getElementById('life-chonyon-ganji').textContent = `年柱: ${saju.nyeon.name} (${saju.nyeon.han})`;
   document.getElementById('life-chonyon-desc').textContent = `1〜20歳頃の幼少期の区間です。家族や大人の温かい保護のもとで学びの基礎を築き、自分自身の軸を立てていく時期と読み解きます。年柱は先祖や親から受け継いだルーツのエネルギーを示す場所であり、この頃に身につけた習慣や価値観が生涯のベースとなります。この時期の経験が順調であれ紆余曲折であれ、すべては中年期以降に活用できる貴重な資産として蓄積されています。`;
   document.getElementById('life-jungnyon-ganji').textContent = `月柱: ${saju.wol.name} (${saju.wol.han}) · ${SIPSIN_JA_MAP[wolJiSipsin] || wolJiSipsin}`;
   document.getElementById('life-jungnyon-desc').textContent = `20〜45歳の青年・中年期です。仕事場で実力を証明し、活動範囲を広げながら、資産の基盤を着実に築き上げる上昇の時期です。月柱は社会的な舞台や職業環境を映し出す場所であり、この時期の選択の一つ一つが人生全体の方向性を決定づけます。20代で方向性を選び、30代でスピードを上げ、40代初頭で築いたものを守るようにエネルギーを分配すると、この上昇期を十分に活かすことができます。`;
   document.getElementById('life-jangnyon-ganji').textContent = `日柱: ${saju.il.name} (${saju.il.han}) · 配偶者宮`;
   document.getElementById('life-jangnyon-desc').textContent = `45〜60歳の中高年期です。家庭が安定軌道に乗り、配偶者との絆が深まり、人生を見つめる眼差しが一段と成熟する時期です。日柱は自分自身と配偶者宮を共に示す場所であるため、この頃からは外部での成功よりも、身近な人や身体の健康が幸福の重心となります。この時期に夫婦で共有できる趣味やルーチンを作っておくと、晩年まで支え合う強固な柱となるでしょう。`;
   if (saju.si) {
    document.getElementById('life-malnyon-ganji').textContent = `時柱: ${saju.si.name} (${saju.si.han})`;
    document.getElementById('life-malnyon-desc').textContent = `60歳以降の晩年期です。健康と暮らしが共に穏やかで、子孫や周囲の尊敬を集めながら、これまで蒔いてきた種を収穫する時期と読み解きます。時柱は晩年の運勢と子供との縁を示す場所です。この時期の福は突然訪れるものではなく、若い頃の誠実さ、中年の信用、そして壮年期の徳が利子となって返ってくるものです。今どの時期を過ごしていても、その時期の課題にベストを尽くすことこそが、最高の晩年の備えとなります。`;
   } else {
    document.getElementById('life-malnyon-ganji').textContent = `時柱不明 (未適用)`;
    document.getElementById('life-malnyon-desc').textContent = `生まれた時刻が不明なため、時柱の計算は除外しました。誕生時間を正確に入力いただければ、晩年の流れや子供との縁について、さらに深く読み解くことができます。`;
   }
  }

  function renderHabchungAndSinsal15(saju, ilGan, ilJi) {
   const sinsals = []; const jiList = [saju.nyeon.jiIdx, saju.wol.jiIdx, saju.il.jiIdx]; if (saju.si) jiList.push(saju.si.jiIdx);
   const cheonEulMap = { 0:[1,7], 1:[0,8], 2:[11,9], 3:[11,9], 4:[1,7], 5:[0,8], 6:[1,7], 7:[2,6], 8:[3,5], 9:[3,5] }[saju.il.ganIdx];
   if (jiList.some(ji => cheonEulMap.includes(ji))) sinsals.push({ name: '天乙貴人 (てんおつきじん)', type: '最高吉神 🌟', desc: '困難に直面するたびに予期せぬ救いの手が現れ、災い転じて福となす、命理学で最高峰とされる福星です。' });
   const munChangMap = { 0:5, 1:6, 2:8, 3:9, 4:8, 5:9, 6:11, 7:0, 8:2, 9:3 }[saju.il.ganIdx];
   if (jiList.includes(munChangMap)) sinsals.push({ name: '文昌貴人 (もんしょうきじん)', type: '学問吉神 📚', desc: '頭脳明晰で文章力に優れ、学業・資格試験・契約書面に関連する事柄で並外れた才能を発揮する吉星です。' });
   if (jiList.includes(3) || jiList.includes(6) || jiList.includes(9) || jiList.includes(0)) sinsals.push({ name: '桃花殺 (とうかさつ)', type: '魅了の星 🌸', desc: '人の視線を惹きつける天性の魅力を持つ星です。大衆の前に立つ仕事、芸能、クリエイティブ, 美容、接客営業などで絶大な力を発揮します。' });
   if (jiList.includes(2) || jiList.includes(5) || jiList.includes(8) || jiList.includes(11)) sinsals.push({ name: '駅馬殺 (えきばさつ)', type: '移動と発展 ✈️', desc: '一箇所にとどまらず、精力的に動き回ることで成功のチャンスを広げる星です。貿易、流通、出張、またはグローバルな活動で大きな成果を上げられます。' });
   if (jiList.includes(4) || jiList.includes(7) || jiList.includes(10) || jiList.includes(1)) sinsals.push({ name: '華蓋殺 (かがいはつ)', type: '芸術と神秘 🔮', desc: '物事を深く探求する思索と芸術の星です。アート、デザイン、学問、精神世界など、内面を深く探る分野において、独自の素晴らしい世界観を構築します。' });
   const baekhoList = ['무辰','정丑','병戌','을未','갑辰','계丑','임戌'];
   if (baekhoList.includes(saju.il.name) || baekhoList.includes(saju.wol.name)) sinsals.push({ name: '白虎大殺 (びゃっこたいさつ)', type: '強力な闘志 🐯', desc: '一度情熱が燃え上がると、限界までやり遂げる猛烈な勝負強さを持つ星です。強大で圧倒的な専門スキルに変えることで、現代社会においては他を圧倒してトップに立つ原動力となります。' });
   
   sinsals.forEach(s => {
    s.name = s.name.replace("가이巳つ", "がいさつ").replace("대살 (びゃっこたい巳つ", "大殺 (びゃっこたいさつ").replace("駅馬殺 (えき바巳つ)", "駅馬殺 (えきばさつ)").replace("駅馬殺 (에き바巳つ)", "駅馬殺 (えきばさつ)").replace("에키바巳つ", "えきばさつ").replace("에키", "えき").replace("에き", "えき").replace("바巳つ", "ばさつ").replace("에키바巳つ", "えきばさつ").replace("에키바巳つ", "えきばさつ");
    s.name = s.name.replace("駅馬殺 (えきば巳つ)", "駅馬殺 (えきばさつ)");
   });

   const sCont = document.getElementById('sinsal-list-container'); sCont.innerHTML = '';
   sinsals.forEach(s => sCont.innerHTML += `<div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-3"><span class="text-xs font-bold px-2 py-1 rounded bg-amber-500/20 text-amber-300 min-w-max mt-0.5">${s.type}</span><div><div class="text-sm font-bold text-white">${s.name}</div><p class="text-xs text-gray-300 mt-1">${s.desc}</p></div></div>`);

   const habchungList = [];
   const checkJiHab = (j1, j2, name) => { if (jiList.includes(j1) && jiList.includes(j2)) habchungList.push({ title: `地支六合 · ${name}`, desc: '地支同士が互いに結びつき調和する構造のため、運命全体のバランスを守り、波乱や動揺を軽減する強力な安定作用をもたらします。' }); };
   checkJiHab(0, 1, '子丑合'); checkJiHab(2, 11, '寅亥合'); checkJiHab(3, 10, '卯戌合'); checkJiHab(4, 9, '辰酉合'); checkJiHab(5, 8, '巳申合'); checkJiHab(6, 7, '午未合');
   const hCont = document.getElementById('habchung-list-container'); hCont.innerHTML = '';
   if (habchungList.length === 0) hCont.innerHTML = '<p class="text-xs text-gray-400 p-3 bg-white/5 rounded-xl">文字同士が激しく衝突するような配置がなく、全体のバランスが穏やかに整っています。</p>';
   else habchungList.forEach(h => hCont.innerHTML += `<div class="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1"><div class="text-sm font-bold text-amber-300 flex items-center gap-1.5"><i data-lucide="corner-down-right" class="w-4 h-4 text-amber-400"></i> ${h.title}</div><p class="text-xs text-gray-300">${h.desc}</p></div>`);
  }

  function renderIljuDetail(iljuName, ilGan, ilJi) {
   const data = ILJU_DATA[iljuName] || getIljuFallback(ilGan, ilJi);
   document.getElementById('ilju-detail-title').textContent = `${iljuName}日柱 · ${ilGan.symbol}と${ilJi.animal}の結びつき`;
   document.getElementById('ilju-symbol-text').textContent = `${ilGan.symbol} / ${ilJi.animal}`;
   let coreHtml = `<p>${data.desc}</p>`;
   const deep = ILJU_DETAIL[iljuName];
   if (deep) coreHtml += `<p class="pt-2 text-gray-300 leading-relaxed">${deep}</p>`;
   const ganDeep = GAN_DETAIL[ilGan.han], jiDeep = JI_DETAIL[ilJi.han];
   if (ganDeep) coreHtml += `<p class="pt-2 text-gray-400 leading-relaxed"><strong class="text-amber-300">[日干 ${ilGan.name}${ilGan.han} 深層解読]</strong> ${ganDeep}</p>`;
   if (jiDeep) coreHtml += `<p class="pt-2 text-gray-400 leading-relaxed"><strong class="text-amber-300">[日支 ${ilJi.name}${ilJi.han} 深層解読]</strong> ${jiDeep}</p>`;
   document.getElementById('ilju-core-text').innerHTML = coreHtml;
   const strList = document.getElementById('ilju-strengths-list'); strList.innerHTML = ''; data.strengths.forEach(s => strList.innerHTML += `<li>${s}</li>`);
   const weakList = document.getElementById('ilju-weaknesses-list'); weakList.innerHTML = ''; data.weaknesses.forEach(w => weakList.innerHTML += `<li>${w}</li>`);
   document.getElementById('ilju-job-text').textContent = data.job; document.getElementById('ilju-love-text').textContent = data.love; document.getElementById('ilju-health-text').textContent = data.health;
  }

  function renderDaeun(saju, isForward, daeunStartAge, manAge) {
   document.getElementById('daeun-info-badge').textContent = `${isForward ? '順行 (順行)' : '逆行 (逆行)'} · 満 ${daeunStartAge}歳から開始`;
   const timelineGrid = document.getElementById('daeun-timeline-grid'); timelineGrid.innerHTML = '';
   const baseWolGanIdx = saju.wol.ganIdx, baseWolJiIdx = saju.wol.jiIdx; let currentDaeunObj = null;

   for (let i = 1; i <= 8; i++) {
    const step = isForward ? i : -i;
    const ganIdx = (baseWolGanIdx + step + 60) % 10, jiIdx = (baseWolJiIdx + step + 60) % 12;
    const gan = CHEONGAN[ganIdx], ji = JIJI[jiIdx];
    const startAge = daeunStartAge + (i - 1) * 10, endAge = startAge + 9;
    const isCurrent = (manAge >= startAge && manAge <= endAge) || (i === 4 && !currentDaeunObj);
    if (isCurrent) currentDaeunObj = { title: `${gan.name}${ji.name}(${gan.han}${ji.han}) 大運`, ageRange: `満 ${startAge}歳 〜 ${endAge}歳`, ganjiHan: `${gan.han}${ji.han}`, ganSipsin: getSipsin(saju.il.ganIdx, gan.oheng, ganIdx%2===0), jiSipsin: getJiSipsin(saju.il.ganIdx, jiIdx) };

    timelineGrid.innerHTML += `<div class="glass-card rounded-xl p-4 transition border flex flex-col justify-between ${isCurrent ? 'border-2 border-amber-500 bg-amber-500/10 shadow-lg' : 'border-white/10 hover:border-white/30'}"><div class="flex justify-between items-center text-xs pb-2 border-b border-white/10"><span class="font-bold ${isCurrent ? 'text-amber-400 ' : 'text-gray-400'}">${i}大運 (${startAge}~${endAge}歳)</span><span>⭐⭐⭐⭐</span></div><div class="my-3 text-center"><div class="font-serif-kr font-bold text-2xl sm:text-3xl text-white">${gan.han}${ji.han}</div><div class="text-xs font-bold mt-1 ${gan.textClass}">${gan.name}(${gan.oheng}) · ${ji.name}(${ji.oheng})</div></div><div class="text-[11px] bg-white/5 rounded px-2 py-1 flex justify-between text-gray-300"><span>天干: ${getSipsin(saju.il.ganIdx, gan.oheng, ganIdx%2===0)}</span><span>地支: ${getJiSipsin(saju.il.ganIdx, jiIdx)}</span></div></div>`;
   }

   document.getElementById('current-daeun-title').textContent = `${currentDaeunObj.title} · ${currentDaeunObj.ganSipsin}/${currentDaeunObj.jiSipsin}のテーマ`;
   document.getElementById('current-daeun-desc').innerHTML = `現在あなたは、<strong>${currentDaeunObj.ganSipsin}(天干)</strong>がもたらす社会的な機会と、<strong>${currentDaeunObj.jiSipsin}(地支)</strong>が支える現実的なパワーが同時に動き出す貴重な時期を過ごしています。大運とは10年単位で新調する「季節の衣類」のようなものであり、同じ人であってもどの時期を通過するかによって運勢の体感温度は劇的に変化します。今の大運は、温めてきた計画を実行に移し、自己の足場を固めるのにまたとない絶好の跳躍期ですので、決断を先延ばしにせず、この10年の間に勝負をかけることが運気の波に乗る最善の方法です。`;
  }

  function renderSeunAndGuide(saju, ilGan, ilJi) {
   
   document.getElementById('seun-general-text').innerHTML = `<p class="text-amber-300 font-bold mb-1">🔥 2026年 丙午（ひのえうま）歳運核心：火気エネルギーの強力な活性化</p><p>天干と地支の双方に「火」が重なる、情熱的な赤い馬の年です。内に秘めていた才能が一気に開花して表舞台に現れ、活動のステージが大きく広がる躍動的な運気です。</p>`;
   document.getElementById('seun-job-text').textContent = `あなたの実力がスポットライトを浴び、名声が高まる時期です。現在取り組んでいるプロジェクトが実を結び、正当な評価や感謝を受け取る機会が何度も訪れます。目立つ功績ほど、今年は光の当たる場所へと押し上げられます。成果を可視化した資料をあらかじめ用意しておくと、チャンスが巡ってきた際、すぐにそれを掴み取ることができます。上半期の小さな信頼が、下半期の大規模なオファーへとつながりやすい好循環の時期です。発表、プレゼンテーション、面接といった自己表現の場を避けることなく、積極的に手を挙げてください。火のエネルギーが巡る今年は、前に出る人へとあらゆるスポットライトが集まります。`;
   document.getElementById('seun-money-text').textContent = `活動範囲が広がる分、お金の出入りも活発になります。収入が上昇する一方で、活動費や交際費などの支出機会も多くなるため、目先の儲け話に飛びつくより、無駄な出費を手元に抑える堅実な管理が結果的に最も富を築きます。火が燃え盛る今年は、資金の流通スピードが非常に速い傾向があります。まずは固定費を見直し、資金の流出を防ぎましょう。不意の臨時収入があった月は、その一部を確実に貯蓄に回すようにしてください。年末に集計した際、派手に稼いだ人よりも、冷静に資産を守り抜いた人の口座が最も豊かになっている年です。上半期に家計のスマート化を行い、下半期の好機のために投資余力を残しておくのが賢明な戦略です。`;
   document.getElementById('seun-love-text').textContent = `火の熱気が呼び込む「桃花（とうか）」の風により、周囲からの好意や関心が高まり、心通い合う特別な出会いに恵まれる可能性が飛躍的にアップします。シングルの方であれば、紹介やお誘いを拒むことなく、積極的に人の集まる場所へ足を運んでみてください。今年の素晴らしい縁は、家で待つよりも行動した先で見つかります。パートナーがいる方は、周囲の注目を集める分、誤解を招く行動には注意が必要です。日頃からオープンなコミュニケーションを保ち、お互いに隠し事を作らないことが絆を深める鍵となります。感情の温度が高まりやすい時期でもあるため、些細な口論が生じそうなときは、一呼吸置いて対話を一時中断する知恵が求められます。`;
   document.getElementById('seun-rel-text').textContent = `交流の機会が増え、人脈が急速に広がる時期です。今年新しく結ばれる人脈の中には、数年後にあなたの窮地を救ってくれる決定的な「貴人（恩人）」が含まれています。一見、今の自分に直接利益をもたらさない出会いであっても、礼儀正しく大切に対応してください。ただし、火の気が強まる年は、言葉が鋭くなったり先走ったりしがちです。不用意な一言が不要なトラブルを招かぬよう、「三思一言（三度考えてから一度口にする）」を意識することが、今年の人関係の最善の保険となります。`;
   document.getElementById('seun-health-text').textContent = `エネルギーが前向きになり、意欲が空回りする分、肉体的なバッテリーの消耗も早まります。火気が充満する今年は、心臓、血圧、目の疲れ、そして寝不足や睡眠障害が初期シグナルとして現れやすいです。睡眠時間を削ってまで走り続けるのではなく、週に一日は完全な休息日として、スマートフォンの電源を切り、一切のスケジュールを入れずに体を休める時間を作ってください。カフェインを控えめにし、十分な水分補給を心がけ、就寝前のスクリーンタイムを控えるだけで、心身のオーバーヒートを和らげることができます。`;
   document.getElementById('seun-study-text').textContent = `脳がフル回転し、直感が非常に鋭く冴え渡る時期ですので、資格取得、専門的な研究、クリエイティブな学習において期待以上の素晴らしい成果を収めることができます。ただし、火の学習傾向は「短期集中型」になりやすく、持続力が長続きしないという特徴があります。一日中机にしがみつくような学習計画よりも、90分勉強して15分しっかり休むというポモドーロのようなサイクルを取り入れると効率が倍増します。挑戦したい勉強があるなら、今すぐ申し込みを済ませてください。期限が定まることで、今年の強力な運気があなたの背中を後押ししてくれます。一度に複数の分野に手を出さず、一つずつクリアしていく各個撃破の戦略が今年の運気と抜群に調和します。`;
   
   const monthlyGrid = document.getElementById('seun-monthly-grid'); monthlyGrid.innerHTML = '';
   [{m:1,han:'己丑',kr:'己丑 (きちゅう)'},{m:2,han:'庚寅',kr:'庚寅 (こういん)'},{m:3,han:'辛卯',kr:'辛卯 (しんぼう)'},{m:4,han:'壬辰',kr:'壬辰 (じんしん)'},{m:5,han:'癸巳',kr:'癸巳 (きし)'},{m:6,han:'甲午',kr:'甲午 (こうご)'},{m:7,han:'乙未',kr:'乙未 (いつび)'},{m:8,han:'丙申',kr:'丙申 (亥이申)'},{m:9,han:'丁酉',kr:'丁酉 (ていゆう)'},{m:10,han:'戊戌',kr:'戊戌 (ぼじゅつ)'},{m:11,han:'己亥',kr:'己亥 (きがい)'},{m:12,han:'庚子',kr:'庚子 (こうし)'}].forEach(mo => {
    monthlyGrid.innerHTML += `<div class="p-3 rounded-xl border bg-white/5 ${mo.m===6 ? 'border-amber-500/60 bg-amber-500/10' : 'border-white/10'}"><div class="flex justify-between items-center text-xs font-bold text-gray-400"><span>2026年 ${mo.m}月</span><span class="text-amber-400 font-serif-kr">${mo.han}</span></div><div class="text-sm font-bold text-white mt-1">${mo.kr}</div></div>`;
   });
   monthlyGrid.innerHTML = monthlyGrid.innerHTML.replace("亥이申", "へいしん");

   document.getElementById('guide-color').textContent = '赤、ピンク (Red) / 南'; document.getElementById('guide-direction').textContent = '南 (South)'; document.getElementById('guide-number').textContent = '2, 7 (火のエネルギー)'; document.getElementById('guide-food').textContent = '温かいお茶、コーヒー';
   document.getElementById('guide-do-list').innerHTML = `<li><strong>用神エネルギーの積極的活用</strong>：自分を助けてくれるラッキーカラーや吉方位を、衣服、インテリア、オフィスの座席などに積極的に取り入れてみてください。</li><li><strong>明確な目標の文書化</strong>：頭の中の計画を文字や計画書、契約書の形にして目に見えるようにすることで、成果が現実化しやすくなります。</li><li><strong>温かいコミュニケーション</strong>：あなたが周囲に与えた温かい親切は、巡り巡ってあなたのピンチを救う「貴人」からの恩恵として戻ってきます。</li>`;
   document.getElementById('guide-dont-list').innerHTML = `<li><strong>感情的な衝突への警戒</strong>：一時の感情に任せた口論やマウント合いは、勝っても結果的に損失となります。冷静に一呼吸置くのが大人の知恵です。</li><li><strong>過度な投機や保証の回避</strong>：不確かな投資話や金銭の貸し借りなどは避け、守ることに重きを置いた安定的な資産運用が安全です。</li>`;
  }

  function renderDailyFortune(saju, ilGan, ilJi) {
   const today = new Date(); const tYear = today.getFullYear(), tMonth = today.getMonth() + 1, tDay = today.getDate();
   const diffDays = Math.floor((today - new Date(1900, 0, 1)) / (1000 * 60 * 60 * 24));
   let tIlIdx = (40 + diffDays) % 60; if (tIlIdx < 0) tIlIdx += 60;
   const tIlGapja = GAPJA[tIlIdx]; const tGan = CHEONGAN[tIlGapja.ganIdx]; const tJi = JIJI[tIlGapja.jiIdx];

   document.getElementById('daily-date-sub').textContent = `${tYear}年${tMonth}月${tDay}日 今日の日辰`;
   document.getElementById('daily-ganji-text').textContent = `${tIlGapja.name} (${tIlGapja.han})の日 · ${tJi.animal}の日`;

   const todaySipsinGan = getSipsin(saju.il.ganIdx, tGan.oheng, tIlGapja.ganIdx % 2 === 0);
   const todaySipsinJi = getJiSipsin(saju.il.ganIdx, tIlGapja.jiIdx);
   let moneyPct = 78, lovePct = 82, jobPct = 80, relPct = 85;
   let stars = '⭐⭐⭐⭐ (吉日：良い知らせが舞い込みやすい穏やかな一日)';
   let summary = `今日一日は、<strong>${tIlGapja.name}の日 (${todaySipsinGan}/${todaySipsinJi})</strong>の気があなたを導きます。仕事や財産の面で嬉しい収穫や肯定的な結果を得られやすい好調な日です。`;

   if (todaySipsinGan.includes('財') || todaySipsinJi.includes('財')) { moneyPct = 95; jobPct = 90; summary = `財星（自分を豊かにする実利的な財運）が強く影響する日です。滞っていた金運がスムーズに流れ出し、投資や過去の努力から嬉しい知らせが舞い込む流れです。`; }
   else if (todaySipsinGan.includes('官') || todaySipsinJi.includes('官')) { jobPct = 96; relPct = 88; summary = `官星（信頼と社会的名誉、および物事の成立）のエネルギーが最大化する日です。あなたの実力が認められたり、重要な契約や決定が円滑に成立する素晴らしいタイミングです。`; }

   const jiHabPairs = { 0:1, 1:0, 2:11, 11:2, 3:10, 10:3, 4:9, 9:4, 5:8, 8:5, 6:7, 7:6 };
   if (jiHabPairs[ilJi.jiIdx] === tIlGapja.jiIdx) { lovePct = 98; relPct = 96; stars = '⭐⭐⭐⭐⭐ (大吉日：あらゆる障壁が取り除かれる極上の吉日)'; summary += ` 日支が<strong>六合（りくごう）</strong>で結ばれるため、対人関係の調和が非常に高く、恋愛運やパートナーシップにおいても非常に温かい風が吹きます。`; }
   else if (Math.abs(ilJi.jiIdx - tIlGapja.jiIdx) === 6) { relPct = 65; moneyPct = 70; stars = '⭐⭐⭐ (吉凶混合：変化の波が押し寄せるため、慎重な判断が必要な日)'; summary += ` 日支が<strong>相冲（そうちゅう）</strong>となるため、気持ちが少し焦りやすくなります。運転や急な言動の飛び出し、そして発言のトーンが尖らないように意識すると難なく過ごせます。`; }

   
   const ganAdvice = SIPSIN_DAILY[SIPSIN_JA_MAP[todaySipsinGan]], jiAdvice = SIPSIN_DAILY[SIPSIN_JA_MAP[todaySipsinJi]];
   if (ganAdvice) summary += ` <span class="block pt-2 text-gray-300"><strong class="text-amber-300">[天干 ${todaySipsinGan} 解説]</strong> ${ganAdvice}</span>`;
   if (jiAdvice && todaySipsinJi !== todaySipsinGan) summary += ` <span class="block pt-1.5 text-gray-300"><strong class="text-amber-300">[地支 ${todaySipsinJi} 解説]</strong> ${jiAdvice}</span>`;
   document.getElementById('daily-stars').textContent = stars; document.getElementById('daily-summary-text').innerHTML = summary;
   document.getElementById('daily-pct-money').textContent = `${moneyPct}%`; document.getElementById('daily-bar-money').style.width = `${moneyPct}%`;
   document.getElementById('daily-pct-love').textContent = `${lovePct}%`; document.getElementById('daily-bar-love').style.width = `${lovePct}%`;
   document.getElementById('daily-pct-job').textContent = `${jobPct}%`; document.getElementById('daily-bar-job').style.width = `${jobPct}%`;
   document.getElementById('daily-pct-rel').textContent = `${relPct}%`; document.getElementById('daily-bar-rel').style.width = `${relPct}%`;
  }

  function renderTojungBigyeol(saju) {
   const nowYr = new Date().getFullYear(); const age = nowYr - saju.year + 1; const m = saju.month, d = saju.day;
   let sang = (age + m) % 8; if (sang === 0) sang = 8; let jung = (sang + d) % 6; if (jung === 0) jung = 6; let ha = (jung + (saju.timeHour || 12) + age) % 3; if (ha === 0) ha = 3;
   const gwaeNum = `${sang}${jung}${ha}`;
   const tojungNames = {
    '111': '乾天太平（けんてんたいへい）卦',
    '112': '春風和気（しゅんぷうわき）卦',
    '113': '錦衣還郷（きんいかんきょう）卦',
    '211': '明月満開（めいげつまんかい）卦',
    '212': '万事亨通（ばんじこうつう）卦',
    '213': '開運流水（かいうんりゅうすい）卦',
    '311': '日就月将（にっしゅうげっしょう）卦',
    '312': '春風和気（しゅんぷうわき）卦',
    '313': '富貴兼全（ふうきけんぜん）卦',
    '411': '竜門跳躍（りゅうもんちょうやく）卦',
    '412': '柳暗花明（りゅうあんかめい）卦',
    '413': '天降福禄（てんこうふくろく）卦',
    '511': '枯木逢春（こぼくほうしゅん）卦',
    '512': '風雲調和（ふううんちょうわ）卦',
    '513': '財数亨通（ざいすうこうつう）卦'
   };
   const gwaeTitle = tojungNames[gwaeNum] || `第 ${gwaeNum} 卦 · 風雲調和 卦`;

   document.getElementById('tojung-year-label').textContent = `${nowYr}年 正統「土亭秘訣」卦名`;
   document.getElementById('tojung-gwae-name').textContent = gwaeTitle;
   document.getElementById('tojung-calc-detail').textContent = `上卦 ${sang} + 中卦 ${jung} + 下卦 ${ha} = ${gwaeNum} 卦`;
   document.getElementById('tojung-total-desc').innerHTML = `年齢、生月、誕生日を組み合わせて算出する東洋伝統の新年算木法（土亭秘訣）に基づき今年の卦を抽出したところ、<strong>【${gwaeTitle}】</strong>が出ました。これは、これまで長い時間をかけて準備してきた物事がついに形を成し、あなたの懸命な努力に比例して成果という名の実りが蔵に満ちていく大いなる年であることを示しています。`;
   document.getElementById('tojung-half1-desc').textContent = `1月から6月までの上半期は「土壌を整える時期」です。スピードを追い求めるよりも、計画の骨子や細部を見直すことが先決であり、必要な書類、契約、ライセンスが整い、心強い支持者が一人二人と集まります。この時期に築いた関係や書類は、一年の収穫の種となりますので、些細な約束でも必ず明文化し、書類や契約への調印は細部まで徹底的に確認した上で決定してください。春に急いで蒔いた種より、厳選された種こそが秋の大収穫を決定づけます。`;
   document.getElementById('tojung-half2-desc').textContent = `7月から12月までの下半期は「収穫（実りの時期）」です。春夏に蒔き、丹精込めて育ててきた成果が、収入や社会的な信頼となってあなたの手元に戻ってきます。特に秋の入り口において、長く記憶に残るような吉報が舞い込む流れがあります。ただし、収穫の季節こそ、倉庫の戸締まり（防犯）を徹底する必要があります。成果が見えてくると、周囲からの頼まれごとや新たな投資の誘いも増えるものです。喜びは分かち合いつつも、大きなお金が動く決定は年末の浮かれた雰囲気に流されることなく、新年早々の冷静な精神状態まで判断を保留する慎重さこそが、本当の知恵となります。`;
   
   const mList = document.getElementById('tojung-monthly-list'); mList.innerHTML = '';
   [
    '正月(1月)：心身ともに穏やかで、家庭に笑顔と笑い声が溢れる',
    '2月：春風に乗り、花のつぼみが開くように金運が大きく開く',
    '3月：門を叩く「貴人」が現れ、新たな実りある契約が結ばれる',
    '4月：小さく始めた事業や企画が、強固な利益となって成長する',
    '5月：南の方角から喜びの便りが届き、上昇気流に乗る兆しが現れる',
    '6月：水面が穏やかであるように、取り組むすべての事柄が無病息災・無難に進む',
    '7月：精力的に動き回った歩みに比例して、蔵に豊かな穀物（富）が積み上がる',
    '8月：予期せぬ新しい出会いが、あなたの次のステージへの強固な架け橋となる',
    '9月：十五夜の満月のように、あなたの名声や実力が広く周囲を明るく照らす',
    '10月：これまでに増やした資金を、さらに有利な形で運用・投資する好機',
    '11月：家庭内に慶事があり、暮らし向きが一段と豊かで充実したものになる',
    '12月：素晴らしい笑顔で充実した一年の締めくくりを迎え、新たな一歩を準備する'
   ].forEach(msg => {
    const m_name = msg.split('（')[0] || msg.split('(')[0] || msg.split('：')[0] || msg.split(':')[0];
    const m_desc = msg.split('）')[1] || msg.split(')')[1] || msg.split('：')[1] || msg.split(':')[1] || '';
    mList.innerHTML += `<li><strong class="text-amber-400">✅ ${m_name}</strong>: ${m_desc}</li>`;
   });
  }

  function renderWealthMastery(saju, ilGan, wolJi) {
   const wolSipsin = getJiSipsin(saju.il.ganIdx, saju.wol.jiIdx);
   let wType = '食神生財 (しょくじんしょうざい) · 自我開拓型 実業家・資産家タイプ', wDesc = `身に付けた専門技術や独自の才能をそのまま収入源に変える、自活自立の強力な器を持っています。この構造は毎月の給与だけに頼るのではなく、本業の傍らに才能を活かした副収入のパイプラインを構築していくことで、資産の増加曲線がより急速に上昇するでしょう。他人から受け継ぐ運気よりも、自らの手で築き上げる富の方が遥かに大きい宿命ですので、若い頃の苦労はすべて成功のための確固たる基盤を築くプロセスと捉えてください。`, investDesc = `あなたの実力がダイレクトに反映される事業、付加価値の高いサービス業、実務実績の堅実な投資資産との相性が抜群に良いです。`;
   if (wolSipsin === '偏財' || wolSipsin === '正財') { wType = '財気通門（ざいきつうもん） · 資産家・財務マスタータイプ'; wDesc = `お金がどこから来て、どこに行くのかを本能的に読み取る目に乗りました。商売と事業のセンスが体に染み込んでいる実業家型であり、同じ情報を目にしても、他人が見落とす「富の鉱脈」をいち早く嗅ぎ当てます。この才能は、組織内の平凡な仕事にとどめておくには惜しく、すぐに独立・起業をせずとも、予算管理・購買・営業など、お金が直接流れる要衝の業務を担当するほどに自身の市場価値が急上昇します。`; investDesc = `不動産の売買、余剰資金の運用、中長期の価値投資など、規模の大きな資本管理において最大の利益を得るタイプです。`; }
   else if (wolSipsin === '印綬' || wolSipsin === '偏印') { wType = '印綬文書（いんじゅもんじょ） · 不動産・知的財産権保有タイプ'; wDesc = `頭で積んだ知識と手に握る文書・資格・権利がそのまま自身の資産（蔵）となるタイプです。他人のようにがむしゃらに肉体労働をして稼ぐより、学習して得た専門資格、自身の知名度を活用したコンテンツ, 登記簿に記載されるアセットが、眠っている間にも自動的に稼いでくれる構造が適しています。堅実な書面や不動産権利を選択する慎重さこそがこの命式の最大の武器ですので、他人の派手な短期利益に惑わされる必要は一切ありません。`; investDesc = `自身の名前が刻まれる資産、すなわち登記された不動産、著作権や特許権、堅実な高配当株など、書類で証明される堅実なポートフォリオと抜群の相性を示します。`; }
   
   document.getElementById('wealth-type-title').textContent = wType; document.getElementById('wealth-type-desc').textContent = wDesc; document.getElementById('wealth-invest-desc').textContent = investDesc;
   document.getElementById('wealth-golden-desc').textContent = `あなたの才能（食傷）と大切な財産（財星）の運気が美しく重なり合う「30代半ば〜40代後半」、および「50代半ば」の大運区間が、資産規模が階段式に急上昇する最大の黄金期です。この時期の特徴は、「仕事が富を呼び込み、その富が新たな機会を自動的に引き寄せる」という強力な正のループが自然に展開することです。したがって、この幸運な時期が訪れる前に、十分な「種銭（軍資金）」と「確かな実力」という2つの薪をコツコツと準備しておくことが絶対的な戦略となります。運気の扉が開いたときに燃やす薪がなければ、どんなに良い運も単なる不発で終わりますが、豊かに準備しておいた人には、その運気が絶大なブースターとなって燃え上がります。`;
   document.getElementById('wealth-caution-desc').textContent = `比肩（ひけん）・劫財（ごうざい）の運気が入る年は、自分のお金が他人の懐に流れやすい警戒期です。この時期だけは、他者との共同事業の提案、借入の連帯保証、一攫千金を狙う投機的な取引とは絶対に距離を置いてください。比肩・劫財とは、自分と同じエネルギー（ライバル）が多数出現し、自分自身の取り分を分配・略奪されるリスクがある形を意味します。この時期には不思議と「絶対に確実だ」という儲け話や「あなただけに特別に教える」といった情報が集まりやすいですが、断るのが難しい場合は「家族や専門家と相談して決める」という強力な盾を常に用意しておきましょう。守り抜くだけで勝ちとなる時期があることを理解することこそが、本物の富を築く人とそうでない人の決定的な分岐点となります。`;
  }

  function renderTaegilMastery(saju, ilJi) {
   const mList = document.getElementById('taegil-move-list'); mList.innerHTML = '';
   ['2026年7月19日 (吉日 · 手の届かない日 · 大吉)', '2026年8月20日 (吉日 · 手の届かない日 · 相生の日)', '2026年9月29日 (吉日 · 手の 届かない日 · 天乙貴人の日)'].forEach(m => mList.innerHTML += `<li><strong class="text-emerald-400">✅ ${m.split('(')[0]}</strong> (${m.split('(')[1]}</li>`);

   const bList = document.getElementById('taegil-biz-list'); bList.innerHTML = '';
   ['2026年7月24日 (食神生財 吉日)', '2026年8月15日 (官印相生 吉日)', '2026年10月12日 (黄金の金与禄 吉日)'].forEach(b => bList.innerHTML += `<li><strong class="text-amber-400">✅ ${b.split('(')[0]}</strong> (${b.split('(')[1]}</li>`);

   const lList = document.getElementById('taegil-love-list'); lList.innerHTML = '';
   ['2026年7月18日 (日支六合 桃花の日)', '2026年8月8日 (天干合 大吉の日)', '2026年11月20日 (天乙貴人 和合の日)'].forEach(l => lList.innerHTML += `<li><strong class="text-pink-400">✅ ${l.split('(')[0]}</strong> (${l.split('(')[1]}</li>`);
   
   mList.innerHTML = mList.innerHTML.replace("手の 届かない日", "手の届かない日");
  }

  function renderCareerMastery(saju, ilGan, wolJi) {
   const cSipsin = getJiSipsin(saju.il.ganIdx, saju.wol.jiIdx);
   
   
   
   document.getElementById('career-pass-desc').innerHTML = `2026年合格・昇進指数 <strong class="text-emerald-300">89%（大吉）</strong>。今年の丙午（ひのえうま）年がもたらす強力な火のエネルギーが、あなたの日干 ${ilGan.name}(${OHENG_JA_MAP[ilGan.oheng] || ilGan.oheng})と美しく調和し、飛躍の架け橋を架けてくれます。あなたを助ける官星（社会的名誉・昇進）のエネルギーと学問運（資格・試験）が相乗効果を生み出し、実力を最大限に発揮できる素晴らしい時期です。試験においてはこれまでの努力以上の成果が発揮され、人事面においては上役や重要な人物から高い評価を得られます。特に、<strong>火気の高まる5月〜9月</strong>は、面接・発表・昇進審査における決定的な勝負時となります。提出書類の細部まで確認を徹底することが、成功を100%確実にする鍵となります。`;
   document.getElementById('career-org-desc').innerHTML = `あなたの社会運は、<strong class="text-amber-300">${SIPSIN_JA_MAP[cSipsin] || cSipsin}</strong>の気が強く影響しています。月支は社会生活の舞台であり、働き方の傾向を示す場所ですが、この配置から見ると、あなたは指示通りにただ動く環境よりも、<strong>自ら判断し裁量を発揮できる場所</strong>で数倍の成果をあげます。具体的には、大企業の新規タスクフォースやプロジェクトチーム、専門的なスキルが発言権を持つスペシャリスト集団、あるいは個人の裁量が大きい外資系・スタートアップなどが最適な舞台です。逆に行政手続きが多く前例を極重視する硬直した組織では、フラストレーションが溜まり才能を半分も発揮できません。転機を検討する際は、条件だけでなく<strong>「自分自身の裁量が認められる環境か」</strong>を第一の基準とすることをお勧めします。`;
   document.getElementById('career-jobs-desc').innerHTML = `日干 ${ilGan.name}(${OHENG_JA_MAP[ilGan.oheng] || ilGan.oheng})と月支 ${SIPSIN_JA_MAP[cSipsin] || cSipsin}のエネルギーの組み合わせから選定した、最適な職業天職です。<br><strong>① ITサービス・新規事業企画<br>② 資産運用・金融データ分析<br>③ 専門コンサルタント・アドバイザー<br>④ グローバル貿易・海外マーケティング</strong><br>これらはすべて、あなたの先見の明と鋭い分析力が武器となる分野です。現在のお仕事がこのリストにない場合でも焦る必要はありません。今の業務の中で「企画」「分析」「交渉」の比重を少しずつ増やしていくことで、運命の舵を自然に天職の方向へと切ることができます。`;
  }

  function renderLuckyNumMastery(ilGan) {
   const numMap = {
    '木': ['3838', '1388', '8383', '3388', '8833', '1138', '3811', '8311', '3088', '8033'],
    '火': ['2727', '3277', '7272', '2277', '7722', '3722', '2733', '7233', '2077', '7022'],
    '土': ['5050', '2500', '0505', '5500', '0055', '2750', '5027', '0527', '5577', '0022'],
    '金': ['4949', '5499', '9494', '4499', '9944', '5944', '4955', '9455', '4099', '9044'],
    '水': ['1616', '4166', '6161', '1166', '6611', '4611', '1644', '6144', '1066', '6011']
   }[ilGan.oheng] || ['7788', '1234', '5678', '8899', '3344', '1122', '9900', '5566', '7700', '8811'];

   
   const nGrid = document.getElementById('luckynum-grid'); nGrid.innerHTML = '';
   numMap.forEach(num => {
    nGrid.innerHTML += `<div class="p-2.5 rounded-xl bg-mystic-900 border border-emerald-500/40 text-center"><div class="text-base font-serif-kr font-bold text-emerald-300">${num}</div><div class="text-[10px] text-gray-400 mt-0.5">${OHENG_JA_MAP[ilGan.oheng]}気運相生</div></div>`;
   });
  }

  function analyzeMyNumber() {
   const val = document.getElementById('my-number-input').value.trim();
   if (val.length < 4) {
    alert("4桁の数字をすべて入力してください！");
    return;
   }
   document.getElementById('my-number-result').textContent = `鑑定結果：入力された組み合わせ [${val}] をご自身の命式のエネルギーに照らし合わせた結果、運気の流れを損なうことのない「大吉数（88点）」と診断されました。数字にも五行のエネルギーが宿ると考えるのが伝統数理論の観点ですが、この組み合わせはあなたの日干のエネルギーを阻害する相剋がなく、穏やかで調和のとれた流れで繋がっています。電話番号や暗証番号のように日常生活で頻繁に触れ、呼びかける数字はそれ自体が小さな幸運の言霊（マントラ）として作用します。金運や対人運を優しく引き寄せる開運数として、生涯にわたり長くご愛用いただくのに最適です！`;
  }

  function renderPetMastery(saju, ilJi) {
   document.getElementById('pet-match-desc').textContent = `飼い主の配偶者宮である日支（${ilJi.animal}）と三合・六合をなす [${ilJi.animal==='辰 (たつ)'?'子（ねずみ）・申（さる）・酉（とり）':ilJi.animal==='午 (うま)'?'寅（とら）・戌（いぬ）・未（ひつじ）':'犬・猫'}] 系統のペットと深い絆で結ばれます。昔から、相性の良いペットは家の中の不調な気を自ら和らげ、家庭に笑顔と幸福を運んでくれると言われています。相性の良いペットは、飼い主の気が沈んでいる日には不思議と側に寄り添い、その温もりによってストレスを速やかに回復させてくれます。現在一緒に暮らしているペットが推奨干支と異なっていても心配ありません。精一杯注ぐ愛情こそが最高の絆です。`;
   document.getElementById('pet-naming-desc').textContent = `名前には呼びかける人の言霊が込められています。ハッピー、ラッキー、ココ、モモ、チョコ、マル、ソラなど、響きが明るく温かみのある二文字の名前をつけて毎日呼びかけることで、そのポジティブな波動が家庭の財運や全体の気流を優しく活性化してくれます。`;
  }

  function renderPastlifeMastery(saju, ilJi) {
   document.getElementById('pastlife-title').textContent = `「学問と書を愛し、真理を探求した気高き文人の魂」`;
   document.getElementById('pastlife-desc').textContent = `あなたの命式からは、前世において本と筆を愛し、静かに真理を探求し智慧を広げていた高潔な文人（学者）の気質が深く宿っていることが読み取れます。現世に与えられた使命は、生まれ持つ優れた知性と才能を自分一人のためだけに留めるのではなく、広く社会に還元することです。その知恵を周囲のために発揮し始めるとき、取り組むすべての物事に強い追い風が吹き、大きな幸運が舞い込むでしょう。`;
  }

  // ==========================================
  // 姓名判断 命名・改명 마스터
  // ==========================================
  function analyzeNaming() {
   if (!CURRENT_SAJU) return;
   const sung = escapeHtml(document.getElementById('name-sung').value || '金'), given = escapeHtml(document.getElementById('name-given').value || '太郎'), fullName = `${sung}${given}`;
   
   const getSoundOheng = (char) => {
    const code = char.charCodeAt(0) - 44032; if (code < 0 || code > 11171) return '金';
    const choIdx = Math.floor(code / 588);
    if ([0, 15].includes(choIdx)) return '木'; 
    if ([2, 3, 5, 16].includes(choIdx)) return '火'; 
    if ([11, 18].includes(choIdx)) return '土'; 
    if ([7, 9, 12, 13, 14].includes(choIdx)) return '金'; 
    return '水';
   };
   
   
   const ohengs = fullName.split('').map(getSoundOheng), yongOhengStr = document.getElementById('yongsin-oheng').textContent;
   let score = 88; if (yongOhengStr.includes(ohengs[1]) || yongOhengStr.includes(ohengs[2])) score += 8; else score += 3;
   
   document.getElementById('naming-score-num').textContent = `${score}点 / 100点`;
   document.getElementById('naming-score-stars').textContent = score >= 90 ? '⭐⭐⭐⭐⭐ (命式の不足しているエネルギーを補う吉名)' : '⭐⭐⭐⭐ (発音の五行が穏やかに調和する名)';
   document.getElementById('naming-summary-desc').textContent = `入力されたお名前 [${fullName}] の五行配列を解析すると、文字と文字が互いを生かし合う相生の良好な流れを作り、命式に必要な用神（守護）エネルギーを引き寄せる非常に素晴らしいお名前です。`;
   document.getElementById('naming-sound-analysis').innerHTML = `<p>· <strong>発音五行の配列</strong>: ${fullName.split('').map((c, i) => `${c}(${OHENG_JA_MAP[ohengs[i]] || ohengs[i]})`).join(' → ')} の順で穏やかに循環しています。</p><p>· <strong>命式の用神との調和</strong>: 命式に不足している五行をお名前の響きが補うため、呼ばれるほどに対人関係や社会的な運気が高まる好循環の構成です。</p>`;
   document.getElementById('naming-advice-desc').innerHTML = `<p>· <strong>命名および開運のアドバイス</strong>: 戸籍やお名前の漢字を選定される際、以下の <strong>【四柱推命・用神推奨漢字】</strong> の中から意味や画数を考慮して選ぶことで、響きと漢字の双方が運勢を力強くサポートする完璧なお名前が完成します。</p>`;

   const hanjaGrid = document.getElementById('naming-hanja-grid'); hanjaGrid.innerHTML = '';
   const yongKey = yongOhengStr.includes('木') ? '木' : yongOhengStr.includes('火') ? '火' : yongOhengStr.includes('土') ? '土' : yongOhengStr.includes('金') ? '金' : '水';
   document.getElementById('naming-yongsin-label').textContent = `${OHENG_JA_MAP[yongKey] || yongKey}エネルギー`;

   const hanjaPool = {
    '木': [{ h: '根', k: 'こん (ね)' }, { h: '林', k: 'りん (はやし)' }, { h: '榮', k: 'えい (さかえる)' }, { h: '彬', k: 'ひん (うるわしい)' }, { h: '杰', k: 'けつ (すぐれる)' }, { h: '棟', k: 'とう (むね)' }, { h: '森', k: 'しん (もり)' }, { h: '楨', k: 'てい (きにょう)' }, { h: '桂', k: 'けい (かつら)' }, { h: '權', k: 'けん (おもり)' }, { h: '相', k: 'そう (たすける)' }, { h: '松', k: 'しょう (まつ)' }, { h: '栢', k: 'はく (か야)' }, { h: '梓', k: 'し (あずさ)' }, { h: '槿', k: 'きん (むくげ)' }],
    '火': [{ h: '䏚', k: 'しょう (かがやく)' }, { h: '炫', k: 'げん (ひかる)' }, { h: '昭', k: 'しょう (あきらか)' }, { h: '旼', k: 'びん (おだやか)' }, { h: '昱', k: 'いく (あきらか)' }, { h: '㬚', k: 'てつ (あきらか)' }, { h: '暎', k: 'えい (はえる)' }, { h: '煥', k: 'かん (かがやく)' }, { h: '燁', k: 'よう (かがやく)' }, { h: '熹', k: 'き (あたたかい)' }, { h: '熺', k: 'き (さかん)' }, { h: '昇', k: 'しょう (のぼる)' }, { h: '晳', k: 'せき (あきらか)' }, { h: '景', k: 'けい (ひかり)' }, { h: '晶', k: 'しょう (きらめく)' }],
    '土': [{ h: '圭', k: 'けい (かど)' }, { h: '均', k: 'きん (ならす)' }, { h: '堅', k: 'けん (かたい)' }, { h: '坤', k: 'こん (つち)' }, { h: '垣', k: 'えん (かき)' }, { h: '城', k: 'じょう (しろ)' }, { h: '基', k: 'き (もとい)' }, { h: '培', k: 'ばい (つ치かう)' }, { h: '載', k: 'さい (のせる)' }, { h: '聖', k: 'せい (ひじり)' }, { h: '埈', k: 'しゅん (たかい)' }, { h: '在', k: 'ざい (ある)' }, { h: '垠', k: 'ぎん (さかい)' }, { h: '塏', k: 'かい (たかい)' }, { h: '墸', k: 'しょ (つむ)' }],
    '金': [{ h: '鐘', k: 'しょう (かね)' }, { h: '鉉', k: 'げん (かなぐ)' }, { h: '鈞', k: 'きん (おもり)' }, { h: '銳', k: 'えい (するどい)' }, { h: '鎭', k: 'ちん (しずめる)' }, { h: '鎔', k: 'よう (溶かす)' }, { h: '錫', k: 'しゃく (すず)' }, { h: '錦', k: 'きん (にしき)' }, { h: '鍊', k: 'れん (ねる)' }, { h: '鍈', k: 'えい (すず)' }, { h: '鎰', k: 'いつ (おんす)' }, { h: '鏡', k: 'きょう (かがみ)' }, { h: '成', k: 'せい (なる)' }, { h: '星', k: 'せい (ほし)' }, { h: '誠', k: 'せい (まこと)' }],
    '水': [{ h: '浩', k: 'こう (ひろい)' }, { h: '澔', k: 'こう (ひろい)' }, { h: '淳', k: 'じゅん (あつい)' }, { h: '源', k: 'げん (みなもと)' }, { h: '準', k: 'じゅん (なぞらえる)' }, { h: '瀚', k: 'かん (ひろい)' }, { h: '澤', k: 'たく (さわ)' }, { h: '潤', k: 'じゅん (うるおう)' }, { h: '澄', k: 'ちょう (すむ)' }, { h: '澈', k: 'てつ (すむ)' }, { h: '淵', k: 'えん (ふち)' }, { h: '鴻', k: 'こう (おおとり)' }, { h: '泓', k: 'おう (ふかい)' }, { h: '洛', k: 'らく (かわ)' }, { h: '洙', k: 'しゅ (かわばた)' }]
   };
   
   hanjaPool['火'][4].k = "いく (あきらか)";
   hanjaPool['火'][8].k = "よう (かがやく)";
   hanjaPool['土'][7].k = "つちかう";
   hanjaPool['水'][6].k = "たく (さわ)";

   (hanjaPool[yongKey] || hanjaPool['木']).forEach(item => { hanjaGrid.innerHTML += `<div class="p-2.5 rounded-xl bg-mystic-900 border border-cyan-500/40 text-center"><div class="text-xl font-serif-kr font-bold text-cyan-300">${item.h}</div><div class="text-xs text-gray-300 mt-0.5">${item.k}</div></div>`; });
   document.getElementById('naming-result-box').classList.remove('hidden');
  }

  function renderSpouseProfile(saju, ilGan, ilJi) {
   const jiSipsin = getJiSipsin(saju.il.ganIdx, saju.il.jiIdx);
   let ageLook = '同い年または1〜3歳差 / 端正で上品', lookDesc = `配偶者宮である日支（${ilJi.name}）のエネルギーが穏やかに位置しており、優しく誠実で思慮深いお相手と強い縁で結ばれます。派主にアプローチしてくる相手よりも、気づけばいつも側に寄り添ってくれているような存在が、あなたの生涯の伴侶となる可能性が極めて高いです。第一印象だけで判断せず、二度, 三度と会ってみてください。会うたびに魅力が深まるお相手です。`, job = '公務員、教育職、管理職', jobDesc = `与えられた役割を最後まで全うする、堅実な職業のお相手と出会います。配偶者宮に位置する官星（安心感と高い信頼性）は、公務員、大企業、専門職など、社会的信用度の高い組織に所属する人物との深い縁を強く暗示しています。派手さよりも誠実さを重視してお相手を選ぶと、生涯を安心して共にできる素晴らしい結婚生活が約束されます。`;

   if (jiSipsin.includes('상') || jiSipsin.includes('식')) { 
    ageLook = '年下または感覚の合う同い年 / 魅力的で洗練された容姿'; 
    lookDesc = `言葉遣いや表情が活き活きとしており、優れた美的センスと表現力を宿したお相手を迎え入れます。配偶者宮の食傷（才能と豊かな魅力）エネルギーは、会話、料理、アート、クリエイティブ分野に携わる人物との縁を示します。共に過ごすほど笑顔の絶えない明るい関係を構築できます。お互いの個性を尊重し合うことが、この縁を長続きさせる秘訣です。`; 
    job = 'クリエイティブ、デザイン、IT分野'; 
   } else if (jiSipsin.includes('재')) { 
    ageLook = '実力のある同い年・年下 / 活力と行動力に溢れる'; 
    lookDesc = `実務能力や家事能力に長け、どこにいても信頼と実績を勝ち取る、非常に頼もしいお相手と深い縁があります。配偶者宮の財星（実利的な経済感覚と高い生活力）エネルギーは、経済観念が非常に発達し、現実を支える知恵を持った人物との出会いを示します。共に歩むことで資産が大きく増えていく楽しみを共有できます。`; 
    job = '金融、貿易、事業経営職'; 
   } else if (jiSipsin.includes('관') || jiSipsin.includes('寅')) { 
    ageLook = '頼りになる年上または成熟した同い年 / 威厳と包容力'; 
    lookDesc = `心から頼ることができ、尊敬に値する精神的支柱となる、信念の強いお相手と巡り合います。配偶者宮の印星（深い知性と学識）は、思慮深くおとなしい人物、または精神的な成熟度においてあなたを温かく導いてくれる指導的なお相手との深い縁を指しています。困難に直面したときも揺らぐことなくあなたを支えてくれる存在です。`; 
    job = '公職、法曹、専門職、CEO'; 
   }

   document.getElementById('spouse-age').textContent = ageLook; 
   document.getElementById('spouse-look-desc').textContent = lookDesc; 
   document.getElementById('spouse-job').textContent = job;
   document.getElementById('spouse-timing').textContent = `満 ${saju.gender === 'M' ? '30〜34' : '29〜33'}歳の時期`; 
   document.getElementById('spouse-timing-desc').textContent = `配偶者を示す星が巡り、または日支に「合（結びつき）」が生じる年が、結婚の具体的な話を進めるのに最適な時期です。四柱推命において結婚とは、「偶然出会った人と結ばれる」というよりは、「身近にいた縁が自然に成熟し形となる」現象です。したがって、この時期を逃さないために、自分がどのような伴侶とどのような人生を歩みたいかを普段から思い描いておくことが大切です。`;
   document.getElementById('spouse-prob').textContent = `今年 2026年 出会いの確率 92%`; 
   document.getElementById('spouse-prob-desc').textContent = `丙午年の力強く情熱的なエネルギーがあなたの命式と美しく調和し、心を揺り動かす大切な出会いが目前まで迫っている年です。確率が高いというのは、何もしなくても自動的に進むという意味ではなく、少しの努力で何倍もの素晴らしい収穫が得られる時期であることを意味します。紹介やイベントなど、積極的に行動の範囲を広げてみてください。今年の運勢は、自ら積極的に行動する人の味方となります。`;
  }

  function renderChildMastery(saju, ilGan, ilJi) {
   let bTitle = '親の家庭を明るく照らし、気高く成長する子供の福', bDesc = `子供の位置（時柱）が非常に健全であるため、子供は親の気持ちをよく理解し、成長してからは自立して大いなる成果を収める相（そう）です。`, talent = `子供は自立心が強く、きらりと光る優れたアイデアの種を宿して生まれてきます。幼少期から好奇心旺盛で質問が多く、自分の納得する答えを徹底的に探求する傾向がありますが、これは頑固さではなく才能 of 芽です。`, edu = `選択する楽しさを子供の判断に委ねることで、秘められた才能が何倍にも輝き始めます。習い事を選ぶ際も、洋服を一枚購入する際も、いくつかの選択肢を提示した上で、子供に最終決定をさせてみてください。小さな選択の積み重ねが、将来的に困難な局面でも果敢に大きな決定を下せる、自己肯定感の高い大人へと育て上げます。本質的な教育とは正解を強いることではなく、自分で決める筋肉を鍛えることなのです。`;
   
   talent = talent.replace("の ", "の").replace("재능の 싹입니다. 부모가 답을 정亥 주기보다 스스로 답에 닿는 길을 지켜봐 줄 때 가장 크게 子라는 아이입니다.", "才能の芽です。親が答えを決めつけるのではなく、子供が自ら探求する過程を温かく見守ってあげることで、最もスケールの大きい大人へと開花します。");
   talent = talent.replace("の ", "の").replace("재능", "才能").replace("の", "の");

   if (saju.si) {
    const siS = getSipsin(saju.il.ganIdx, CHEONGAN[saju.si.ganIdx].oheng, saju.si.ganIdx % 2 === 0);
    if (siS.includes('관')) { 
     bTitle = '誠実な道を歩み、名声を高める子供'; 
     bDesc = `時柱に位置する官星（責任感と高い信頼性）から見ると、子供は自らの役割の重さを知る実直な性格に育ち、リーダーシップを発揮する素晴らしい大人になる相です。`; 
    } else if (siS.includes('식') || siS.includes('상')) { 
     bTitle = '才能と豊かな器用さで、自らの富を築き上げる子供'; 
     bDesc = `表現力とクリエイティブな感覚が非常に強く、芸術的なセンスやジャンルを超えた斬新なアイデアが、将来的に豊かで安定した生活基盤を築くための貴重なアセットとなるでしょう。`; 
    }
   }
   document.getElementById('child-title').textContent = bTitle; document.getElementById('child-desc').textContent = bDesc; document.getElementById('child-talent-text').textContent = talent; document.getElementById('child-edu-text').textContent = edu;
  }

  function renderCelebrityMatch(saju, ilGan, wolJi) {
   const matches = {
    '木': { name: '聖徳太子・源義経タイプ 👑', desc: '木（木）エネルギーが強い人物に象徴される特徴であり、揺るぎない信念と深い慈愛を持って、多くの人を活かし率いる優れたリーダーシップを意味します。' },
    '火': { name: '織田信長・真田幸村タイプ 🔥', desc: '火（火）エネルギーの象徴は、世界にまだない道を自ら切り開くパイオニアです。困難な状況にあってもその情熱の炎を燃やし、盤そのものを変革する気質を意味します。' },
    '土': { name: '徳川家康・武田信玄タイプ 🏔️', desc: '土（土）エネルギーの象徴は、大地のようにすべての人を包み込む卓越した知恵者です。対立する者同士を和解させ、長期的な視野で全体の調和と安定をもたらす寛大な器を意味します。' },
    '金': { name: '伊達政宗・新選組タイプ ⚔️', desc: '金（金）エネルギーの象徴は、妥協なき原則の勝負師です。一度確立した基準は最後まで守り抜き、引けない局面において最も冷徹かつ的確な決断を下す気質を意味します。' },
    '水': { name: '安倍晴明・紫式部タイプ 🌊', desc: '水（水）エネルギーの象徴は、深淵の底を見通す沈黙の賢者です。表面的な現象にとらわれず、水面下の真の流れを読み解き、決して焦ることなく最適なタイミングを待ち受ける優れた英知を意味します。' }
   }[ilGan.oheng] || { name: '聖徳太子の徳と名君の気相 👑', desc: '柔らかさと強さを兼ね備えた寛大な器です。' };
   document.getElementById('celeb-match-name').textContent = matches.name; document.getElementById('celeb-match-desc').textContent = matches.desc;
  }


  // =========================================================================
  // ⭐ [신규 추가] 32대 글로벌 신비 운명학 및 마스터 렌더링 엔진 (Japanese Complete Pack)
  // =========================================================================

  function selectSajuMenu(tabId) {
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    
    if (!CURRENT_SAJU) {
        // 체험용 샘플 데이터 자동 주입
        const year = 1992, month = 8, day = 15, isLunar = false, isLeapMonth = false, timeHour = 11, isTimeUnknown = false;
        const saju = calculateManseoryeok(year, month, day, isLunar, isLeapMonth, timeHour, isTimeUnknown);
        
        updateResultUI(saju, 'M', 35, 34, true, 8, year, month, day);
        
        document.getElementById('birth-year').value = year;
        document.getElementById('birth-month').value = month;
        document.getElementById('birth-day').value = day;
        document.getElementById('birth-time-sijin').value = timeHour;
        
        document.querySelectorAll('.tab-content-card').forEach(card => {
            let b = card.querySelector('.accordion-body');
            if (b) {
                const oldBanner = b.querySelector('.sample-experience-banner');
                if (oldBanner) oldBanner.remove();
                
                const sampleBanner = document.createElement('div');
                sampleBanner.className = "sample-experience-banner p-4 rounded-xl bg-amber-500/10 border-2 border-dashed border-amber-500/30 text-xs text-amber-300 leading-relaxed mb-5 no-print animate-pulse";
                sampleBanner.innerHTML = `
                    <div class="flex items-center gap-1.5 font-bold text-[13px] text-amber-300 mb-1">
                        <i data-lucide="sparkles" class="w-4 h-4"></i> 💡 現在表示されている内容は【体験用サンプル命式】の解説です！
                    </div>
                    右側の計算機（モバイルは上部）にあなたの生年月日を入力し、<strong>【自分の生涯運命を解読する】</strong>を実行してください！<span class="underline decoration-amber-500/50 font-semibold text-white">あなただけのための1:1精密一生命式鑑定書</span>が0.1초（0.1秒）で瞬時にアンロックされ、安全に稼働します。
                `;
                b.insertBefore(sampleBanner, b.firstChild);
            }
        });
    } else {
        document.querySelectorAll('.tab-content-card').forEach(card => {
            let b = card.querySelector('.accordion-body');
            if (b) {
                const oldBanner = b.querySelector('.sample-experience-banner');
                if (oldBanner) oldBanner.remove();
                
                const oldCert = b.querySelector('.personal-cert-banner');
                if (oldCert) oldCert.remove();
                
                const certBanner = document.createElement('div');
                certBanner.className = "personal-cert-banner p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 leading-relaxed mb-5 no-print flex items-center gap-2";
                certBanner.innerHTML = `<i data-lucide="shield-check" class="w-4 h-4 text-purple-400"></i> <span>あなたの固有エネルギーと連動した <strong>1:1精密一生命式鑑定書</strong> が安全に活性化され、稼働中です。</span>`;
                b.insertBefore(certBanner, b.firstChild);
            }
        });
    }

    ACTIVE_SAJU_TAB_ID = tabId;

    let hallId = 'hall-destiny';
    if (['naming', 'gunghap', 'child', 'celebrity', 'daily', 'tojung', 'wealth', 'taegil'].includes(tabId)) {
        hallId = 'hall-life';
    } else if (['health', 'dream', 'pungsu', 'samjae', 'career', 'luckynum', 'pet', 'pastlife'].includes(tabId)) {
        hallId = 'hall-modern';
    } else if (['tangsaju', 'numerology', 'chakra', 'celtictree', 'guardianbeast', 'cheoneulgwiin'].includes(tabId)) {
        hallId = 'hall-mystic';
    }
    
    const main = document.getElementById('result-section');
    if (main) {
        main.classList.remove('hall-destiny-active', 'hall-life-active', 'hall-modern-active', 'hall-mystic-active');
        main.classList.add(hallId + '-active');
        main.classList.remove('hidden');
    }

    document.querySelectorAll('.hall-btn').forEach(btn => {
        btn.className = "hall-btn p-3.5 sm:p-4 rounded-2xl border border-white/10 bg-white/5 text-gray-300 font-bold flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 transition hover:bg-white/10 active:scale-95 cursor-pointer";
    });
    const activeBtn = document.getElementById('btn-' + hallId);
    if (activeBtn) {
        activeBtn.className = "hall-btn p-3.5 sm:p-4 rounded-2xl border-2 border-amber-500 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-500/20 text-amber-300 font-bold flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer";
    }

    document.querySelectorAll('.toc-list').forEach(list => list.classList.add('hidden'));
    const activeToc = document.getElementById('toc-' + hallId);
    if (activeToc) {
        activeToc.classList.remove('hidden');
    }

    document.querySelectorAll('.tab-content-card').forEach(card => {
        card.classList.add('hidden');
    });
    
    const targetCard = document.getElementById('tab-' + tabId);
    if (targetCard) {
        targetCard.classList.remove('hidden');
        const b = targetCard.querySelector('.accordion-body');
        const ic = targetCard.querySelector('.transform');
        if (b) b.classList.remove('hidden');
        if (ic) ic.classList.add('rotate-180');
    }

    document.querySelectorAll('[id^="side-item-"]').forEach(item => {
        item.className = "py-2.5 flex items-center justify-between cursor-pointer hover:text-purple-300 font-medium text-gray-300 border-l-2 border-transparent pl-1";
    });
    const activeSideItem = document.getElementById('side-item-' + tabId);
    if (activeSideItem) {
        activeSideItem.className = "py-2.5 flex items-center justify-between cursor-pointer text-amber-300 font-bold border-l-2 border-amber-500 pl-2 bg-amber-500/5 rounded-r";
    }

    if (window.lucide && typeof lucide !== 'undefined') { lucide.createIcons(); }

    if (main) {
        setTimeout(() => {
            const yOffset = -70;
            const y = main.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 50);
    }
  }

  function switchPlazaTab(tabId) {
    document.querySelectorAll('.plaza-content').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(tabId);
    if (target) target.classList.remove('hidden');

    const tabIds = ['plaza-tarot', 'plaza-zodiac', 'plaza-mbti', 'plaza-birth', 'plaza-pastlife-game'];
    tabIds.forEach(t => {
        const btn = document.getElementById('btn-' + t);
        if (btn) {
            if (t === tabId) {
                btn.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-purple-500 text-white shadow-lg transition whitespace-nowrap transform scale-105 border border-purple-400";
            } else {
                btn.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-300 hover:bg-white/5 border border-white/10 transition whitespace-nowrap";
            }
        }
    });
  }

  const TAROT_CARDS_DATA = [
    { id: 0, name: "愚者 (The Fool)", emoji: "🃏", keyword: "新しい始まり、冒険、可能性", 
      total: "今日は決まった枠を壊し、新しい気持ちで第一歩を踏み出すのに最適な日です！前途が明確に見えなくても、あなたならではのポジティブな気流と勇気があれば、宇宙があなたを守護してくれるでしょう。迷っていたことがあれば、今日軽やかに始めてみてください。",
      love: "パートナーと新鮮なときめきを満喫できる日です。片思い中なら、計算せず純粋に近づくことで相手の心の扉が開くでしょう。",
      money: "目先の利益よりも、長期的に成長できる新しい勉強やビジネスの提案に投資するのが有利な運気です。" },
    { id: 1, name: "魔術師 (The Magician)", emoji: "🪄", keyword: "能力発揮、主導権、創造", 
      total: "あなたの中に隠された無限の才能と話術、閃くインスピレーションを世に華々しく披露する日です！今日はあなたが場を自ら企画しリードするのに最適な運気が巡っています。自信を持って人々を引っ張ってみてください。あなたの言葉が魔法のように実現します。",
      love: "あなたの魅力が最高潮に達し、好感度が急上昇する日です。ユーモアと洗練された態度で魅力をアピールしてください。",
      money: "奇抜な企画案や独創的なアイデアが利益に直結するスマートな財運です。あなたのスキルを堂々とセールスしてください。" },
    { id: 2, name: "女教皇 (The High Priestess)", emoji: "📖", keyword: "洞察力、学問、直感", 
      total: "心が静かに落ち着き、物事や人の真実を深く見通せる日です。無駄な雑音に惑わされず、静かに勉強したり自分磨きをしたりすることで最高の成果を得られます。今日はあなたの直感と判断力が100%的中する日です。",
      love: "焦る恋は逆効果です。相手の話をじっくり聞き、神秘的な距離感を保つことで魅力が際立ちます。",
      money: "衝動的な投資や衝動買いは絶対に禁物です！細かく帳簿をチェックし、財布の紐を固く締めて実利を守りましょう。" },
    { id: 3, name: "女帝 (The Empress)", emoji: "👑", keyword: "豊かさ、母性、精神的満足", 
      total: "この世の温かい豊かさと祝福があなたの元に豊かに流れ込む最高の一日です！肉体的에도 精神的에도 この上なく快適に過ごせ、周囲の人々に優しさと美味しい食事をご馳走したくなるような寛大な徳が生まれる吉運です。",
      love: "温かく安定した愛情に満ちあふれる日です。お互いへの配慮と信頼が強まり、結婚や深い約束を交わすのに良い時期です。",
      money: "生まれ持った金運がスムーズに上昇する日です。自分を磨くための上質な買い物や美容に、心地よくお金を使っても大吉です。" },
    { id: 4, name: "皇帝 (The Emperor)", emoji: "🏛️", keyword: "安定、権威、責任感", 
      total: "あなたの社会的立場や地位が強固な城壁のようにしっかりと定まる頼もしい日です！職場や家庭であなたの指導力とリーダーシップが認められ、強い責任感を持って難局を乗り越える力が湧き出ます。",
      love: "恋愛において軽い駆け引きよりも、誠実で責任感ある姿を見せることで高い評価を得られます。約束は必ず守りましょう。",
      money: "ブレない堅実な資産ポートフォリオを構築するのに良い日です。実用的で確実な不動産や権利の取得に幸運が伴います。" },
    { id: 5, name: "法王 (The Hierophant)", emoji: "🔔", keyword: "仲裁、メント、合意", 
      total: "葛藤のあった場所に温かい和解の手が差し伸べられ、人生の頼もしい貴人が現れて貴重なアドバイスとサポートを授けてくれる温和な一日です。試験勉強、面接、重要契約の締結などに非常に適した運気です。",
      love: "異なる価値観で対立していたカップルなら、今日、大人のアドバイスや率直な対話を通じて誤解が雪解けのように解決します。",
      money: "条件なしにあなたを支持し投資してくれるスポンサーや貴人の運が開けます。学びや資格取得への支出は大吉です。" },
    { id: 6, name: "恋人 (The Lovers)", emoji: "💞", keyword: "愛、完璧な調和、選択", 
      total: "あなたを理解してくれるパートナーと、目を見るだけで通じ合える最高のコミュニケーションと人徳に満ちた心地よい日です！今日一日は足取りが軽く、誰と協力しても最高のパフォーマンスと満足のいく賛辞を得られます。",
      love: "恋愛運の決定版です！シングルは魅力的なお相手と運命的な縁があり、カップルは深い信頼를 재확인하며 デートを楽しめます。",
      money: "人との強固な信頼関係がそのまま利益となって戻ってくるビジネス契約運です。人脈を得ることが最大の財産になります。" },
    { id: 7, name: "戦車 (The Chariot)", emoji: "🛡️", keyword: "推進力、突破、勝利", 
      total: "もう迷う必要はありません！激しい嵐を突き抜けて猛烈に走る戦車のように、圧倒的な実行力と勝負強さで目標を勝ち取るエネルギッシュな日です。他人の目を気にせず、果敢に企画を推進しましょう。勝利はあなたのものです。",
      love: "好きな人がいるなら、ダラダラせず今日、ストレートに告白してみましょう！相手の心を揺さぶるチャンスです。",
      money: "滞っていた取引や売掛金の回収などの業務が、凄まじい推進力で一気に解決するダイナミックな資金回収運です。" },
    { id: 10, name: "運命の輪 (Wheel of Fortune)", emoji: "🎡", keyword: "ターニングポイント、予期せぬ機会、幸運", 
      total: "停滞していた人生の運気がついに追い風へと180度変わり、上昇するドラマチックなターニングポイントの日です！今日起きる予期せぬ出会いや偶然の連絡、直感はあなたの未来を開く天からのギフトですので逃さないでください。",
      love: "街角の偶然のすれ違いやサークル活動で、一生を共にする運命的なお相手と出会う確率が非常に高い日です。",
      money: "思いがけないボーナス、還付금, 또는 휴면 자산이 내 지갑으로 쏙 들어오는 놀라운 횡재수가 열립니다." },
    { id: 19, name: "太陽 (The Sun)", emoji: "☀️", keyword: "明るい成功、祝福、エネルギー充満", 
      total: "宇宙の温かく輝かしい光があなたを照らし、周囲から拍手と祝福を受ける最高の幸運日です！何もしなくても短所は隠され、長所だけが際立ち、あなたを嫉妬していた人々さえもその明るいエネルギーの前に惹きつけられます。",
      love: "子供のように純粋で愉快な愛が満開になる一日です。カップルは屋外ピクニックなどのデートを強くお勧めします。",
      money: "あなたの価値と名誉が同時に上昇し、昇給、大型案件の落札、または貴重な資産の購入における大きな成功を知らせる大吉運です。" },
    { id: 21, name: "世界 (The World)", emoji: "🗺️", keyword: "完璧な完成、有終의 美, 統合", 
      total: "これまで誠実に築いてきた長期プロジェクトや悩みが、ついに最も完璧で美しい有終の美を飾って一段落する完成の日です！心が大きく満たされ、あなたの能力が完全にプロレベルに達したことを証明できます。",
      love: "長年の交際の末に結婚を発表したり、お互いにとってかけがえのないパートナーであることを確信する幸せな瞬間です。",
      money: "これまでの努力が結実し、確実で大きな金銭的利益が安全に確保される完璧な完成運です。安定した長期投資に適しています。" }
  ];

  let TAROT_DECK = [];
  let SELECTED_TAROT_CARDS = [];

  function resetTarotDeck() {
    TAROT_DECK = [...TAROT_CARDS_DATA];
    for (let i = TAROT_DECK.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [TAROT_DECK[i], TAROT_DECK[j]] = [TAROT_DECK[j], TAROT_DECK[i]];
    }
    SELECTED_TAROT_CARDS = [];
    
    for (let i = 1; i <= 3; i++) {
        const c = document.getElementById('tarot-card-' + i);
        if (c) c.classList.remove('flipped');
        const b = document.getElementById('tarot-badge-' + i);
        if (b) b.className = "text-[10px] font-bold px-2 py-0.5 rounded bg-mystic-950 text-purple-400 inline-block mb-1.5";
        document.getElementById('tarot-name-' + i).textContent = "運命のカード";
        document.getElementById('tarot-emoji-' + i).textContent = "🔮";
    }
    const resBox = document.getElementById('tarot-result-box');
    if (resBox) resBox.classList.add('hidden');
  }

  function handleTarotDraw(idx) {
    if (TAROT_DECK.length === 0) { resetTarotDeck(); }
    const cardIdx = idx - 1;
    if (SELECTED_TAROT_CARDS[cardIdx]) { return; } // 이미 뽑은 카드는 리드로우 방지

    const card = TAROT_DECK.pop();
    SELECTED_TAROT_CARDS[cardIdx] = card;

    const c = document.getElementById('tarot-card-' + idx);
    if (c) c.classList.add('flipped');

    setTimeout(() => {
        document.getElementById('tarot-emoji-' + idx).textContent = card.emoji;
        document.getElementById('tarot-name-' + idx).textContent = card.name.split(' (')[0];
        const b = document.getElementById('tarot-badge-' + idx);
        if (b) b.className = "text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500 text-mystic-900 inline-block mb-1.5";
        
        // 3장을 모두 다 뽑았다면 종합 분석 오픈!
        if (SELECTED_TAROT_CARDS[0] && SELECTED_TAROT_CARDS[1] && SELECTED_TAROT_CARDS[2]) {
            renderTarotAnalysis();
        }
    }, 150);
  }

  function renderTarotAnalysis() {
    const c1 = SELECTED_TAROT_CARDS[0], c2 = SELECTED_TAROT_CARDS[1], c3 = SELECTED_TAROT_CARDS[2];
    
    document.getElementById('tarot-c1-title').innerHTML = `<span class="text-purple-400 font-bold">1. 現在・基盤 [${c1.name}]</span>`;
    document.getElementById('tarot-c1-desc').textContent = c1.total;
    
    document.getElementById('tarot-c2-title').innerHTML = `<span class="text-pink-400 font-bold">2. 恋愛・感情 [${c2.name}]</span>`;
    document.getElementById('tarot-c2-desc').textContent = c2.love;
    
    document.getElementById('tarot-c3-title').innerHTML = `<span class="text-emerald-400 font-bold">3. 未来・金運 [${c3.name}]</span>`;
    document.getElementById('tarot-c3-desc').textContent = c3.money;
    
    const resBox = document.getElementById('tarot-result-box');
    if (resBox) resBox.classList.remove('hidden');
  }

  function initDailyPlaza() {
    resetTarotDeck();
    generateZodiacButtons();
    generateAstrologyButtons();
    generateBloodTypeButtons();
  }

  const ZODIAC_LIST_JA = ["子 (ねずみ)", "丑 (うし)", "寅 (とら)", "卯 (うさぎ)", "辰 (たつ)", "巳 (へび)", "午 (うま)", "未 (ひつじ)", "申 (さる)", "酉 (とり)", "戌 (いぬ)", "亥 (いのしし)"];
  function generateZodiacButtons() {
    const container = document.getElementById('zodiac-btn-grid');
    if (!container) return;
    container.innerHTML = "";
    ZODIAC_LIST_JA.forEach((z, i) => {
        container.innerHTML += `<button type="button" onclick="showZodiacReading(${i})" class="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 text-xs text-gray-300 hover:text-white transition font-bold">${z.split(' ')[0]} ${z.split(' ')[1]}</button>`;
    });
  }

  const ASTROLOGY_LIST_JA = ["牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"];
  function generateAstrologyButtons() {
    const container = document.getElementById('astrology-btn-grid');
    if (!container) return;
    container.innerHTML = "";
    ASTROLOGY_LIST_JA.forEach((a, i) => {
        container.innerHTML += `<button type="button" onclick="showZodiacReading(${(i+4)%12})" class="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 text-xs text-gray-300 hover:text-white transition font-bold">${a}</button>`;
    });
  }

  const BLOOD_LIST_JA = ["A型", "B型", "O型", "AB型"];
  function generateBloodTypeButtons() {
    const container = document.getElementById('blood-btn-grid');
    if (!container) return;
    container.innerHTML = "";
    BLOOD_LIST_JA.forEach((b, i) => {
        container.innerHTML += `<button type="button" onclick="showBloodTypeReading(${i})" class="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 text-sm text-gray-300 hover:text-white transition font-bold">${b}</button>`;
    });
  }

  function showZodiacReading(idx) {
    const titleEl = document.getElementById('plaza-zodiac-title');
    const descEl = document.getElementById('plaza-zodiac-desc');
    const badgeEl = document.getElementById('plaza-zodiac-badge');
    
    const fortunes = [
        "今日は予期せぬ喜びが訪れる最高の一日です。特に人間関係においてあなたの誠実さが認められ、強い信頼を築くことができます。",
        "コツコツと積み重ねてきた努力がようやく実を結ぶ日です。自信を持って目の前の課題に取り組んでください。金運も好調です。",
        "新しい挑戦を始めるのに最適な日です。迷っていたことがあれば、勇気を持って第一歩を踏み出してみましょう。幸運が背中を押してくれます。",
        "周囲との協調が幸運を呼び込む日です。相手の立場に立った優しい配慮を見せることで、何倍もの幸福があなたに戻ってきます。",
        "主導権を握って積極的に行動することで、大いなる成果を得られる日です。あなたのカリスマ性が輝きを放ち、人々を魅了します。",
        "直感力が冴え渡る神秘的な日です。周囲の雑音に惑わされず、自分自身の内なる声を信じて決断すると良い結果に繋がります。"
    ];
    
    titleEl.textContent = `🍀 今日のフォーチュン予報`;
    descEl.textContent = fortunes[idx % fortunes.length];
    badgeEl.textContent = "今日の運勢指数: " + (85 + (idx % 3) * 5) + "%（吉）";
    document.getElementById('plaza-zodiac-result').classList.remove('hidden');
  }

  function showBloodTypeReading(idx) {
    const titleEl = document.getElementById('plaza-blood-title');
    const descEl = document.getElementById('plaza-blood-desc');
    const badgeEl = document.getElementById('plaza-blood-badge');
    
    const readings = [
        "A型のあなた：今日のキーワードは「計画性と調和」です。細かな配慮が光り、周囲から絶大な信頼を得られる日。お勧めカラーはグリーンです。",
        "B型のあなた：今日のキーワードは「個性とインスピレーション」です。枠にとらわれない独創的なアイデアが成功の鍵となります。お勧めカラーはイエローです。",
        "O型のあなた：今日のキーワード는「情熱と実行力」です。目標に向かって力強く突き進むことで、大きな成果を勝ち取れます。お勧めカラーはレッドです。",
        "AB型のあなた：今日のキーワードは「知的分析と冷静さ」です。感情に流されず冷静に状況を判断することで、最も賢い選択ができます。お勧めカラーはブルーです。"
    ];
    
    titleEl.textContent = `🧬 血液型別開運アドバイス`;
    descEl.textContent = readings[idx];
    badgeEl.textContent = "血液型開運指数: " + (88 + (idx % 2) * 4) + "%";
    document.getElementById('plaza-blood-result').classList.remove('hidden');
  }

  function calculateTrendyMatch() {
    const scoreNum = document.getElementById('trendy-score-num');
    const scoreStars = document.getElementById('trendy-score-stars');
    const summaryDesc = document.getElementById('trendy-summary-desc');
    
    const score = 85 + Math.floor(Math.random() * 15);
    scoreNum.textContent = `${score}点 / 100点`;
    scoreStars.textContent = score >= 95 ? "⭐⭐⭐⭐⭐ (ソウルメイト：奇跡的な相性)" : "⭐⭐⭐⭐ (最高の組み合わせ)";
    summaryDesc.textContent = "お二人の気質の配列は互いに補い合い、大いなる成長を促す理想的な相性です。一緒に過ごす時間が長くなるほど絆が深まります。";
    document.getElementById('trendy-result-box').classList.remove('hidden');
  }

  function calculatePastLifeGame() {
    const titleEl = document.getElementById('pastlife-game-title');
    const descEl = document.getElementById('pastlife-game-desc');
    
    const stories = [
        { title: "「王室の書庫を守っていた気高き大賢者」", desc: "前世におけるあなたは、知恵と真理を探求し、国政を左右する貴重な記録を守っていた宮廷の学者でした。現世におけるあなたの驚異的な分析力や優れた学習への情熱は、その魂の記憶が色濃く残っているためです。" },
        { title: "「大自然を旅し、美を表現した風流な芸術家」", desc: "前世におけるあなたは、キャンバスを携えて世界中を巡り、大自然の神秘を詩や絵画で表現していた風流人でした。現世であなたが持つ洗練された感性と自由を愛する美しい心は、前世の魂が放つ輝きそのものです。" }
    ];
    
    const cur = stories[Math.floor(Math.random() * stories.length)];
    titleEl.textContent = cur.title;
    descEl.textContent = cur.desc;
    document.getElementById('pastlife-game-result-box').classList.remove('hidden');
  }

  // 12개월 탄생석/탄생화 처방 데이터
  const BIRTH_BLESSINGS_JA = {
    1: { stone: "ガーネット (友情·真実·情熱)", flower: "スイセン (自己愛·尊重)" },
    2: { stone: "アメジスト (誠実·心の平和)", flower: "スミレ (謙遜·誠実)" },
    3: { stone: "アクアマリン (聡明·勇敢)", flower: "サクラ (精神美·優美)" },
    4: { stone: "ダイヤモンド (永遠の絆·純潔)", flower: "スイートピー (門出·優しい思い出)" },
    5: { stone: "エメラルド (幸運·幸福·愛)", flower: "スズラン (再び幸せが訪れる)" },
    6: { stone: "パール (健康·長寿·富)", flower: "バラ (愛·美·情熱)" },
    7: { stone: "ルビー (情熱·威厳·勇気)", flower: "アジサイ (辛抱強い愛)" },
    8: { stone: "ペリドット (夫婦の幸福·和合)", flower: "グラジオラス (密会·誠実)" },
    9: { stone: "サファイア (慈愛·誠実·徳望)", flower: "ダリア (華麗·感謝)" },
    10: { stone: "オパール (希望·潔白·幸福)", flower: "コスモス (乙女の真心)" },
    11: { stone: "トパーズ (希望·友情·潔白)", flower: "キク (高潔)" },
    12: { stone: "ターコイズ (成功·繁栄·旅の安全)", flower: "ポインセチア (祝福·幸運)" }
  };

  function showBirthBlessing() {
    if (!CURRENT_SAJU) return;
    const m = CURRENT_SAJU.month;
    const b = BIRTH_BLESSINGS_JA[m] || BIRTH_BLESSINGS_JA[1];
    
    document.getElementById('birth-stone-text').textContent = b.stone;
    document.getElementById('birth-flower-text').textContent = b.flower;
  }

  function initSidebarWidgets() {
    const select = document.getElementById('sidebar-ilju-select');
    if (!select) return;
    select.innerHTML = "";
    
    const selectList = [
        { val: "甲子", text: "甲子 (きのえね) - 青い松の木" },
        { val: "乙丑", text: "乙丑 (きのとのうし) - 庭園の牛" },
        { val: "丙寅", text: "丙寅 (ひのえとら) - 太陽の下の虎" },
        { val: "丁卯", text: "丁卯 (ひのとのう) - 月明かりのウサギ" },
        { val: "戊辰", text: "戊辰 (つちのえたつ) - 広大な大地の龍" },
        { val: "己巳", text: "己巳 (つちのとのみ) - 黄金の蛇" },
        { val: "庚午", text: "庚午 (かのえうま) - 白い馬" },
        { val: "辛未", text: "辛未 (かのとのひつじ) - 白い羊" },
        { val: "壬申", text: "壬申 (みずのえさる) - 湖の猿" },
        { val: "癸酉", text: "癸酉 (みずのとのとり) - 澄んだ湧き水の鳥" }
    ];
    
    selectList.forEach(item => {
        select.innerHTML += `<option value="${item.val}">${item.text}</option>`;
    });

    select.addEventListener('change', () => showSidebarIljuDetail(select.value));
    showSidebarIljuDetail("甲子");
  }

  function showSidebarIljuDetail(ilju) {
    const details = {
        "甲子": { desc: "知恵深く、学問を愛する青い松の気性。生涯を通じて穏やかな福に恵まれます。", food: "緑茶、フレッシュハーブ、新鮮な葉物野菜", time: "夜の23時〜深夜1時（子時）", color: "爽やかなフォレストグリーン", dir: "東方（木気）" },
        "乙丑": { desc: "冬を耐え抜いて土地を耕すウシ。着実に富を蓄積する大器晩成型です。", food: "カボチャ、サツマイモ、玄米や雑穀米", time: "深夜1時〜早朝3시（丑時）", color: "温かみのあるベージュ、アースカラー", dir: "中央・南西（土気）" }
    };
    
    const cur = details[ilju] || details["甲子"];
    document.getElementById('sidebar-ilju-title').innerHTML = `<strong class="text-amber-300">${ilju}日柱の基本気質</strong>`;
    document.getElementById('sidebar-ilju-desc').textContent = cur.desc;
    document.getElementById('sidebar-lucky-food').textContent = cur.food;
    document.getElementById('sidebar-lucky-time').textContent = cur.time;
    document.getElementById('sidebar-lucky-color').textContent = cur.color;
    document.getElementById('sidebar-lucky-direction').textContent = cur.dir;
  }

  function updateLuckyPrescription() {
    // 사이드바 처방전 갱신용 (필요시 작동)
  }

  function renderTangSaju(saju) {
    const tMap = {
        0: { name: "천귀성 (天貴星) - 고귀한 품격과 인덕", desc: "하늘이 부여한 고귀한 품격을 나타내는 천귀성이 임합니다. 주변 사람들로부터 존경과 지원을 이끌어내어 귀인의 도움으로 출세하며 안락한 삶을 살게 됨을 상징합니다." },
        1: { name: "천액성 (天厄星) - 위기 극복의 강인함", desc: "인생의 전반에 걸쳐 예상치 못한 시련이 있을 수 있으나, 이를 불굴의 투지로 극복해 내고 끝내 대성공을 움켜쥐는 강인한 반전의 영혼을 상징합니다." },
        2: { name: "천권성 (天權星) - 권력과 리더십", desc: "한 조직이나 단체를 이끌어 나가는 강인한 리더십과 카리스마가 돋보입니다. 사람을 다스리고 다루는 능력이 탁월하여 고위직에 오를 수 있는 기상입니다." },
        3: { name: "천파성 (天破星) - 창조적 파괴와 혁신", desc: "기존의 낡은 관습을 깨부수고 새로운 길을 개척하는 혁신적인 기운입니다. 도전정신을 바탕으로 새로운 사업이나 예술적 분야에서 두각을 나타냅니다." },
        4: { name: "천간성 (天奸星) - 지혜와 책략", desc: "머리 회전이 비상하고 판단력이 빨라 어떤 상황에서도 신속하게 대안을 찾아내는 지혜가 돋보입니다. 금융, 기획, 사업 설계 분야에서 탁월합니다." },
        5: { name: "천문성 (天文星) - 학문과 연구", desc: "문장력이 뛰어나고 학문을 사랑하며 연구에 깊은 자질을 가집니다. 가르치고 지도하는 일에 천직이며, 평생 학자나 고도의 지식 노동자로 존경을 받습니다." }
    };
    
    const idx = saju.nyeon.jiIdx % 6;
    const cur = tMap[idx] || tMap[0];
    
    // 일본어 전용 당사주 렌더링
    const titleEl = document.getElementById('tangsaju-title');
    const descEl = document.getElementById('tangsaju-desc');
    if (titleEl && descEl) {
        titleEl.textContent = `🎨 唐四柱推命 卦(か)の解読 [${cur.name.split(' - ')[0]}]`;
        descEl.innerHTML = `<p class="font-bold text-amber-300 mb-2">[生涯の宿命星: ${cur.name.split(' - ')[0]}]</p><p class="text-gray-300 leading-relaxed text-xs sm:text-sm">${cur.desc}</p>`;
    }
  }

  function renderKabbalahNumerology(year, month, day) {
    const sum = String(year) + String(month) + String(day);
    let total = 0;
    for (let char of sum) {
        if (/[0-9]/.test(char)) total += parseInt(char);
    }
    while (total > 9 && total !== 11 && total !== 22) {
        let temp = 0;
        for (let char of String(total)) {
            temp += parseInt(char);
        }
        total = temp;
    }
    
    const num_map = {
        1: { title: "1. 創造と開拓の先駆者", desc: "強い独立心と意志の力を持っており、誰も歩んだことのない道を切り開く開拓者の資質を持っています。" },
        2: { title: "2. 共感と調和の平和主義者", desc: "他人の感情を深く理解し、仲裁する優れた外交力を持ちます。調和と平和をもたらす人です。" },
        3: { title: "3. 表現力豊かなクリエイター", desc: "芸術的感性とユーモア、優れた話術を持っています。周囲に明るい生命力とエネルギーを広げます。" },
        4: { title: "4. 堅実な構築者と守護者", desc: "高い責任感と安定的な実践力を持っています。システムと規律を好む安全な土台の構築者です。" },
        5: { title: "5. 自由を愛する冒険家", desc: "変化を恐れず、常に新しい経験と学習を求めます。卓越した活動性と知的な好奇心に恵まれます。" },
        6: { title: "6. 無条件の愛を持つ奉仕者", desc: "他人の痛みに共感し、治癒し、面倒を見ることに最大の喜びを感じる、母性にあふれた魂です。" },
        7: { title: "7. 真理を追求する深い賢者", desc: "分析力、直感、精神的な探求が優れています。深く学習し、表面を超えた真実を見通す直感に優れます。" },
        8: { title: "8. 物質と富を掌握する統治者", desc: "強力な実行力と事業家センスを持っています。大いなる物質的成功を構築できるエネルギーを宿します。" },
        9: { title: "9. 世界を癒す人道主義者", desc: "すべての人を包み込む深い包容力を持っています。人類愛と自己犠牲の精神で世界を導く器です。" },
        11: { title: "11. 天上と地上を繋ぐ直感の大師", desc: "驚異的な直感と神秘的な霊能力を持っています。インスピレーションを世界に提示するスピリチュアルな指導者です。" },
        22: { title: "22. 夢を現実化する建築大師", desc: "偉大な夢や理想を、強固な現実として実現する最高の実践家です。スケールの大きい大いなる指導者です。" }
    };
    
    const cur = num_map[total] || num_map[1];
    
    const titleEl = document.getElementById('numerology-title');
    const descEl = document.getElementById('numerology-desc');
    if (titleEl && descEl) {
        titleEl.textContent = `🔢 カバラ数秘術 [運命数: ${total}]`;
        descEl.innerHTML = `<p class="font-bold text-cyan-300 mb-2">[私の誕生運命数: ${cur.title}]</p><p class="text-gray-300 leading-relaxed text-xs sm:text-sm">${cur.desc}</p>`;
    }
  }

  function renderChakraBalance(saju, ilGan) {
    const cMap = {
        '목': { name: "第4チャクラ (アナハタ - ハートチャクラ)", desc: "愛と慈悲、深い共感を司る「ハートチャクラ」があなたのメイン守護チャクラです。木（木）のエナジーを基盤としており、人々を温かく癒し、和合へ導く時に、あなたの霊的エナジーが最大に活性化します。" },
        '화': { name: "第3チャクラ (マニプーラ - 太陽神経叢チャクラ)", desc: "情熱、強固な自尊心、強力な意志力を司る「太陽神経叢チャクラ」です。火（火）のエナジーと同調しており、果敢な推進力で目標を達成し、他者をインスパイアする力を持ちます。" },
        '토': { name: "第1チャクラ (ムーラダーラ - ルートチャクラ)", desc: "現実的な生命の生存、揺るぎない安定性、大地の根を司る「ルートチャクラ」です。土（土）の性質に深く対応しており、どのような試練にも動じないウ직한（揺るぎない）安らぎを提供します。" },
        '금': { name: "第5チャクラ (ヴィシュッダ - スロートチャクラ)", desc: "明確な自己表現、創造的な意思疎通、論理的な決断力を司る「スロートチャクラ」です。金（金）のエナジーに適合しており、本質を突く鋭い言葉や洗練された説得力で周囲を調停します。" },
        '수': { name: "第6チャクラ (アージュニャー - サードアイチャクラ)", desc: "深遠な直感、水面下を見通す超能力、霊的賢明さを司る「サードアイチャクラ」です。水（水）のエナジーに対応しており、焦ることなく物事の決定的な本質を見抜き、賢者のような静寂を提供します。" }
    };
    
    const cur = cMap[ilGan.oheng] || cMap['목'];
    
    const titleEl = document.getElementById('chakra-title');
    const descEl = document.getElementById('chakra-desc');
    if (titleEl && descEl) {
        titleEl.textContent = `🧘 守護チャクラ活性化診断 [${cur.name.split(' (')[0]}]`;
        descEl.innerHTML = `<p class="font-bold text-indigo-300 mb-2">[私の精神の中心: ${cur.name}]</p><p class="text-gray-300 leading-relaxed text-xs sm:text-sm">${cur.desc}</p>`;
    }
  }

  function renderCelticTree(month, day) {
    const trees = [
        { name: "モミの木 (気高き高潔さ)", desc: "洗練された高い気品と非凡な知性を持っています。どのような環境でも自分を失わず、原則を守る姿は気高きモミの木のようです。" },
        { name: "エルムの木 (優しい調和)", desc: "他人の感情を深く思いやり、協調することに優れています。優しさと包容力で周囲に多くの人が集まり、調和をもたらします。" },
        { name: "カバの木 (純粋な始まり)", desc: "生気に満ち、明るく、高い野心と純粋さを持ちます。果敢に人生の道を創造し切り開いていける生命力に富んだ魂です。" },
        { name: "ヤナギの木 (神秘の直感)", desc: "直感に優れ、感受性が豊かです。他人が見落としやすい感情の機微を鋭く感じ取れる、神秘的な芸術家タイプです。" }
    ];
    
    const idx = (month + day) % trees.length;
    const cur = trees[idx];
    
    const titleEl = document.getElementById('celtictree-title');
    const descEl = document.getElementById('celtictree-desc');
    if (titleEl && descEl) {
        titleEl.textContent = `🌲 ケルトの誕生日守護樹木 [${cur.name.split(' (')[0]}]`;
        descEl.innerHTML = `<p class="font-bold text-emerald-400 mb-2">[私を守る森の精霊: ${cur.name}]</p><p class="text-gray-300 leading-relaxed text-xs sm:text-sm">${cur.desc}</p>`;
    }
  }

  function renderHealthMastery(saju, ilGan) {
    const hMap = {
        '목': { title: "肝・胆系 木（木）体質 · 解毒・循環タイプ", weak: "疲労が回復しにくく、目が充血しやすかったり、筋肉が強張ったり緊張性頭痛に見舞われやすい傾向があります。", food: "梅の実やゆずといった酸味のある食べ物と新鮮な青物野菜が体に良く、ウォーキングで足元をほぐすのが推奨されます。" },
        '화': { title: "心・小腸系 火（火）体질 · 熱調整・循環器タイプ", weak: "動悸がしやすく、寝つきが悪くなりがちで、上半身や顔面へ熱気が昇る等の循環器の負担が溜まりやすい傾向です。", food: "緑茶やハーブティー、小豆のような少し苦味のあるものが体内の不要な熱を逃がしてくれ、睡眠前の瞑想が合います。" },
        '토': { title: "脾・胃系 土（土）体質 · 消化・代謝タイプ", weak: "胃腸が張ったり消化がスムーズにいかなかったり、腹部に余剰エネルギーが滞りやすく体が重だるくなりがちです。", food: "カボチャ、山芋、サツマイモなどの優しく自然な甘みを持つものや生姜湯が適しており、食後の軽い散歩が効果的です。" },
        '금': { title: "肺・大腸系 金（金）体質 · 呼吸・皮膚タイプ", weak: "呼吸器や鼻、気管支が過敏で、お肌の乾燥に繋がりやすく、胃腸や大腸のコンディションの波が起こりやすい傾向です。", food: "大根や梨、蜂蜜を少し入れた温かいお湯が非常に良く合います。寝室を乾燥から守り深呼吸するのを意識しましょう。" },
        '수': { title: "腎・膀胱系 水（水）体質 · 水分代謝・疲労蓄積タイプ", weak: "むくみが出やすく腰が重くなったり、慢性的疲労感が抜けにくく泌尿器・免疫系統に過度の負担が蓄積しやすい傾向です。", food: "黒豆や黒ごま、ワカメなどの黒い食材が極めて有益です。温かいお湯を少しずつこまめに飲む習慣が健康をサポートします。" }
    };
    
    const cur = hMap[ilGan.oheng] || hMap['목'];
    document.getElementById('health-type-title').textContent = cur.title;
    document.getElementById('health-type-desc').textContent = `東洋医学の五行体質論に基づき、あなたの日干エネルギーに対応する臓腑経絡の管理ポイントを分析した結果です。健康管理に役立ててください。`;
    document.getElementById('health-weak-desc').textContent = cur.weak;
    document.getElementById('health-food-desc').textContent = cur.food;
  }

  function renderPungsuMastery(ilGan) {
    const pMap = {
        '목': { door: "玄関を入って右側に、青々とした観葉植物や森林の写真を飾ることで、玄関からの入る気が木（木）のエネルギーと同調し、資産運を高めます。", bed: "寝室のカーテンや布団カバーに淡いグリーン系やベージュを取り入れることで、睡眠中の気のバランスを最高に調和します。", desk: "デスクの上に木製のアロマディフューザーを配置したり、植物を置くことで集中力が何倍にもアップします。" },
        '화': { door: "明るい照明を玄関に灯し、華やかで明るい絵画を飾ることで、強力な火のエネルギーが家全体の気の流れを活性化させます。", bed: "オレンジ、ライトピンクなどの温かみのあるカラーを寝室のアクセントに取り入れると、夫婦関係や魅力が高まります。", desk: "デスクの左上部分に赤やピンクの小物を配置し、アイデアや企画力を高めてください。" },
        '토': { door: "玄関に黄色やアースカラーのマットを配置し、陶器の置物を飾ることで、大地の安定的な金運を強力に引き寄せます。", bed: "寝室のカラーを落ち着いたブラウン、ベージュ系で調和することで、究極の安定と安眠を保証します。", desk: "陶器製のペン立てや重厚なデスクマットを愛用すると、責任ある地位をより強固に維持できます。" },
        '금': { door: "玄関に白やシルバー、金属製のベルを配置することで、澄んだ音が邪気を払い、高貴な運気を呼び込みます。", bed: "寝室は白やグレーを基調としたミニマルで清潔感のある空間に仕上げると、エネルギーが極限まで洗練されます。", desk: "金属製の文房具やデジタルデバイスを常にきれいに磨いておくことで、決단력（決断力）と成果を高めます。" },
        '수': { door: "玄関を水が流れるように静かで清潔に保ち、ガラス製のオブジェや鏡を綺麗に保つことで、金運の循環を高めます。", bed: "寝室にネイビーやブルーなどの深い海のカラーを取り入れることで、魂の回復力と知恵を活性化します。", desk: "デスクに綺麗な水を注いだグラスを置いたり、スマートな黒を基調としたアイテムを配すると直感が鋭くなります。" }
    };
    
    const cur = pMap[ilGan.oheng] || pMap['목'];
    document.getElementById('pungsu-door-desc').innerHTML = cur.door;
    document.getElementById('pungsu-bed-desc').innerHTML = cur.bed;
    document.getElementById('pungsu-desk-desc').innerHTML = cur.desk;
  }

  function renderSamjaeMastery(saju) {
    const yrJi = saju.nyeon.jiIdx; // 띠 (지Idx)
    // 삼재 공식: 신자진생은 인묘진년, 사유축생은 해자축년, 인오술생은 신유술년, 해묘미생은 사오미년
    // 2026년은 병오(午)년. 해묘미(돼지, 토끼, 양띠)가 삼재의 해(사오미년) 중 눌삼재(午)에 해당!
    const haemyomi = [11, 3, 7]; // 해(11), 묘(3), 미(7)
    let isSamjae = false;
    let sTitle = "2026年 三災ではありません（平穏無事）";
    let sDesc = "おめでとうございます。2026年丙午年は三災の影響を受けない平穏無事な年です。大いなる幸運があなたを見守っています。自信を持って計画を進めてください。";
    
    if (haemyomi.includes(yrJi)) {
        isSamjae = true;
        sTitle = "2026年 【宿命の三災・中災（눌삼재）】に該当";
        sDesc = "2026年は三災の2年目である『中災（なかさんさい / 눌삼재）』に該当します。この時期は無理に外へ打って出るよりも、現実にしっかりと根を下ろし、これまでの基盤を守ることに徹すると、すべての災いが福へと転じる『福三災（ふくさんさい）』へと変わります。心配せず慎重に行動してください。";
    }
    
    document.getElementById('samjae-status-title').textContent = sTitle;
    document.getElementById('samjae-status-desc').textContent = sDesc;
  }

  function renderGuardianBeast(saju) {
    const titleEl = document.getElementById('beast-destiny-title');
    const descEl = document.getElementById('beast-destiny-desc');
    if (!titleEl || !descEl) return;

    const beast_map = {
        0: { name: "玄武 (げんぶ) - 知識と不老不死を司る霊獣 🐢", desc: "あなたを生涯を通じて護衛し守ってくれる霊獣は、深く静かな北方の夜を司る【玄武】です。陰陽の気の流れを調律する象徴であり、圧倒的な洞察力を授け、危機の局面に直面しても着実に金運と資産を守り抜く強固な盾として作用します。" },
        1: { name: "麒麟 (きりん) - 信義と慈悲深い富貴を司る霊獣 🦄", desc: "あなたを護衛する霊獣は、慈悲深い心と子孫繁栄の祝福を象徴する、東洋の霊験あらたかな霊獣【キリン】です。あなたの実直さと信頼を最高に高め、周囲の人々に優しさを伝える気質を与え、一生涯安楽な富徳と人徳をもたらします。" },
        2: { name: "朱雀 (すざく) - 情熱と栄華の繁栄を司る霊獣 🦅", desc: "あなたを守る霊獣は、天空高く舞い上がり世界を温かく照らす赤い鳳凰【朱雀】です。炎のような情熱と華やかな芸術的スター性を引き出し、危機的な状況をもチャンスに変える、圧倒的なカリスマと名誉の成功を授けます。" },
        3: { name: "獬豸 (へて / カイチ) - 正義と魔除けを司る守護の霊獣 🦁", desc: "あなたを護衛する霊獣は、邪悪な災い（火難・不運）を角で打ち払う伝説の獣【獬豸（ヘテ）】です。鋭い判断力と公平さを与え、組織や社会の中で確固たる名誉と官職、信頼を確立できるよう生涯を強力に守護する防衛壁となります。" },
        4: { name: "青龍 (せいりゅう) - 広大な夢と如意宝珠を司る龍 🐲", desc: "あなたを守る霊獣は、雲を切り裂いて天空へと力強く昇る、五色絢爛なビジュアルのジェ왕（帝王）【青龍】です。圧倒的なスケールの野心と優れた創造的企画力を与え、一生に一度訪れる決定的なチャンスを見事に手中に収める力を授けます。" },
        5: { name: "白虎 (びゃっこ) - 勇猛さと霊妙な威勢を司る百獣の王 🐯", desc: "あなたを護る霊獣は、太陽の強力な西側の正気を帯びて邪悪な不運を一噛みで切り裂く【白虎】です。恐れなき勇気と決断力を授け、他を圧倒するプロフェッショナルな実力で頂点に立つ最強のパワーを与えます。" }
    };

    const cur = beast_map[saju.nyeon.jiIdx % 6] || beast_map[4];
    titleEl.textContent = cur.name;
    descEl.innerHTML = `
        <p class="mb-2"><strong class="text-cyan-200">[生涯の東洋守護霊獣からのメッセージ]</strong></p>
        <p class="mb-3 font-sans text-gray-200 leading-relaxed text-xs sm:text-sm">${cur.desc}</p>
        <p class="pt-2 text-[11px] text-cyan-400 font-serif-jp italic">「あなたが生まれた年の正気が東洋の守護獣と深く結びついており、日々の小さな不調や財物の流出を防ぎ、生涯にわたって家門を保護する盾として作動します。」</p>
    `;
  }

  function renderCheoneulGwiin(saju, ilGan) {
    const titleEl = document.getElementById('gwiin-destiny-title');
    const descEl = document.getElementById('gwiin-destiny-desc');
    if (!titleEl || !descEl) return;

    const gwiin_map = {
        '갑': { animals: "丑 (うし) と 未 (ひつじ)", direction: "北東および南西", desc: "あなたの究極の救世主である天乙貴人は、実直な「丑（牛）」と穏やかな「未（羊）」です。人生の難局や取引・契約の膠着状態に直面した時、この干支に該当する人物が現れ、そっと最善の解決策や金財のヒントを授けてくれるでしょう。" },
        '무': { animals: "丑 (うし) と 未 (ひつじ)", direction: "北東および南西", desc: "あなたの天から授かった守護貴人は、丑（牛）と未（羊）です。重要な決定を前にした時、誠実で信頼に足るこの干支の人物に相談することで、滞っていた運の流れが劇的に開開（好転）します。" },
        '경': { animals: "丑 (うし) と 未 (ひつじ)", direction: "北東および南西", desc: "あなたの生涯の守護貴人は、丑（牛）と未（羊）です。公私の区分が明確なあなたに重厚な信頼を寄せてくれる人脈となり、共同事業や重要な決定を共にする際に、成功確率を何倍にも引き上げてくれます。" },
        '을': { animals: "子 (ねずみ) と 申 (さる)", direction: "真北および南西", desc: "あなたの救世主となる貴人は、聡明な「子（ねずみ）」と多才な「申（さる）」です。ビジネスや書類契約などの停滞期に、機転の利くこの二つの貴人が現れ、素晴らしい突破口を示してくれます。" },
        '기': { animals: "子 (ねずみ) と 申 (さる)", direction: "真北および南西", desc: "あなたの最高の人徳吉星は、子（ねずみ）と申（さる）です。温厚で几帳面なあなたに、柔軟なアドバイスと資産運用の大いなるヒントを与え、生活に活力を注ぎ込んでくれるでしょう。" },
        '병': { animals: "亥 (いのしし) と 酉 (とり)", direction: "北西および真西", desc: "あなたの守護貴人は、深い知恵を持つ「亥（いのしし）」と洗練された几帳面さを持つ「酉（とり）」です。情熱的ですが時に見落としが生じやすいあなたを完璧に補佐し、実利をもたらす最良の協力者となります。" },
        '정': { animals: "亥 (いのしし) と 酉 (とり)", direction: "北西および真西", desc: "あなたの生涯の守護貴人は、亥（いのしし）と酉（とり）です。感受性が豊かで傷つきやすいあなたを豊かな包容力で包み込み、不動産や権利などの堅実な富をもたらすご縁となります。" },
        '임': { animals: "巳 (へび) と 卯 (うさぎ)", direction: "南東および真東", desc: "あなたの生涯の守護貴人は、美しい「巳（へび）」と瑞々しい躍動感を持つ「卯（うさぎ）」です。大きな視点を持つあなたに、洗練されたビジネス感覚や温かな芸術的感性を授け、活躍の舞台を世界に広げるサポートをしてくれます。" },
        '계': { animals: "巳 (へび) と 卯 (うさぎ)", direction: "南東および真東", desc: "あなたの生涯の守護貴人は、巳（へび）と卯（うさぎ）です。知的で思慮深いあなたに、実利ある投資情報や多角的な対人関係を広げ、豊かな実りをもたらしてくれます。" },
        '신': { animals: "午 (うま) と 寅 (とら)", direction: "真南および北東", desc: "あなたに天が遣わした最高の貴人は、力強い「午（うま）」と勇敢な「寅（とら）」です。宝石のように繊細なあなたに、圧倒的な推進力とスケールの大きい事業チャンスをもたらす、最高の相性パートナーです。" }
    };

    const cur = gwiin_map[ilGan.name] || gwiin_map['갑'];
    
    const nowYr = new Date().getFullYear();
    const luckyYears = `${nowYr + 2}年、${nowYr + 5}年`;

    titleEl.textContent = `🤝 私の一生を護衛する天乙貴人（てんおつきじん）秘策`;
    descEl.innerHTML = `
        <div class="space-y-3 text-xs sm:text-sm">
            <p>· <strong>私の守護貴人の干支</strong>: <strong class="text-amber-300">${cur.animals}</strong></p>
            <p>· <strong>貴人がやってくる大吉の方角</strong>: <strong class="text-emerald-300">${cur.direction}</strong></p>
            <p class="text-gray-300 leading-relaxed">${cur.desc}</p>
            <p class="pt-2 text-[11px] text-amber-400 font-serif-jp italic">💡 <strong>【貴人との出会いのゴールデンタイミング】</strong>: 今後、<strong>${luckyYears}</strong>は天乙貴人の気が最高潮に達し、生涯の伴侶や恩師、決定的なメンターに遭遇しやすい最高の幸運周期が訪れます。</p>
        </div>
    `;
  }

  function getIljuFallback(ilGan, ilJi) {
    return {
       desc: '天からは ' + ilGan.name + '(' + OHENG_JA_MAP[ilGan.oheng] + ')の気質が、地からは ' + ilJi.animal + 'の気質が交わり、互いを支え合う素晴らしい宿命の構造です。自立心に満ち、自ら目標を定めて着実に結果を残せる頼もしい実行力に恵まれています。',
       strengths: ['天干 ' + ilGan.name + 'の明確な自尊心', '地支 ' + ilJi.animal + 'の圧倒的な底力', '自分なりのアプローチで成果を出す創造力'],
       weaknesses: ['一つの価値観に偏りやすい時は焦らないこと', '疲労が溜まった時は十分に睡眠をとること'],
       job: ilGan.oheng + 'の気流と ' + ilJi.oheng + 'の気流を共に活かせる、企画・運営、専門職、マネジメントに適しています。自ら意思決定できるポジションで最大の成果を発揮します。',
       love: '互いのプライベートを尊重し、信頼をベースにした関係を築きます。穏やかに深まる愛情が長続きの秘訣です。',
       health: ilGan.oheng + 'とペアを成す臓腑の過労に注意してください。適度な休養と睡眠で十分に健康を維持できます。'
    };
  }

  function toggleAccordion(btn) {
    if (!btn) return;
    const card = btn.closest('.tab-content-card');
    if (!card) return;
    const b = card.querySelector('.accordion-body');
    const ic = card.querySelector('.transform');
    if (b) b.classList.toggle('hidden');
    if (ic) ic.classList.toggle('rotate-180');
  }

  function runFortuneCard() {
    // 운세 플립 카드 작동용 임시
  }

  function openMobileMenu() {
    const modal = document.getElementById('mobile-drawer-modal');
    const panel = document.getElementById('mobile-drawer-panel');
    if (modal && panel) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            panel.classList.remove('translate-x-full');
        }, 10);
    }
  }

  function bg() {} // Dummy to prevent error if old bg calls exist

  function closeMobileMenu() {
    const modal = document.getElementById('mobile-drawer-modal');
    const panel = document.getElementById('mobile-drawer-panel');
    if (modal && panel) {
        panel.classList.add('translate-x-full');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
  }

  // =========================================================================
  // Initialize Widgets and Daily Plaza
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initDailyPlaza();
    initSidebarWidgets();
  });
