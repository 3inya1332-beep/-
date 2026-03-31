/* eslint-disable no-use-before-define */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const money = (v) => `${Math.round(v).toLocaleString("ru-RU")} ₽`;

const WIDTH = 1280;
const HEIGHT = 720;
const DAY_DURATION_MS = 30000; // 30 sec real time per day
const PLAYER_SPEED = 230;
const RUN_MULT = 1.55;
const INTERACT_RADIUS = 70;

const FAMILY_ARCHETYPES = [
  {
    title: "Семья учителей",
    suffix: "mixed",
    startMoney: 38000,
    debt: [0, 110000],
    stats: { education: 62, stress: 26, respect: 52, risk: 3 },
    contacts: [{ key: "mentor", lvl: 48 }],
    backstory: "Строгая дисциплина и скромный старт.",
  },
  {
    title: "Семья владельца автосервиса",
    suffix: "mixed",
    startMoney: 76000,
    debt: [0, 160000],
    stats: { education: 43, stress: 33, respect: 49, risk: 7 },
    contacts: [{ key: "mechanic", lvl: 60 }],
    backstory: "С детства рядом с машинами и рынком услуг.",
  },
  {
    title: "Семья регионального чиновника",
    suffix: "official",
    startMoney: 180000,
    debt: [0, 240000],
    stats: { education: 60, stress: 37, respect: 61, risk: 6 },
    contacts: [{ key: "lawyer", lvl: 56 }, { key: "admin", lvl: 52 }],
    backstory: "Ресурсы есть, но публичный прессинг выше.",
  },
  {
    title: "Семья на грани бедности",
    suffix: "poor",
    startMoney: 11000,
    debt: [60000, 320000],
    stats: { education: 33, stress: 46, respect: 34, risk: 8 },
    contacts: [{ key: "yard", lvl: 38 }],
    backstory: "Выживание важнее амбиций на старте.",
  },
  {
    title: "Семья медиков",
    suffix: "mixed",
    startMoney: 92000,
    debt: [0, 140000],
    stats: { education: 66, stress: 28, respect: 57, risk: 3 },
    contacts: [{ key: "clinic", lvl: 58 }],
    backstory: "Поддержка по здоровью и режиму.",
  },
  {
    title: "Семья IT-специалистов",
    suffix: "mixed",
    startMoney: 142000,
    debt: [0, 120000],
    stats: { education: 69, stress: 24, respect: 54, risk: 4 },
    contacts: [{ key: "it", lvl: 64 }],
    backstory: "Техника и знания доступны с ранних лет.",
  },
  {
    title: "Семья бывшего криминального авторитета",
    suffix: "power",
    startMoney: 72000,
    debt: [120000, 450000],
    stats: { education: 36, stress: 55, respect: 41, risk: 23 },
    contacts: [{ key: "street", lvl: 68 }, { key: "lawyer", lvl: 34 }],
    backstory: "Остались старые связи и старые проблемы.",
  },
  {
    title: "Семья предпринимателей",
    suffix: "power",
    startMoney: 240000,
    debt: [0, 210000],
    stats: { education: 54, stress: 35, respect: 59, risk: 9 },
    contacts: [{ key: "biz", lvl: 66 }, { key: "lawyer", lvl: 52 }],
    backstory: "Высокие ожидания и доступ к ресурсам.",
  },
];

const SURNAMES = {
  mixed: ["Калинин", "Мельников", "Корнев", "Логинов", "Брагин"],
  official: ["Смирнов", "Петров", "Иванов", "Титов", "Морозов"],
  poor: ["Фролов", "Синицын", "Буров", "Ершов", "Зуев"],
  power: ["Громов", "Шахов", "Орлов", "Баринов", "Волков"],
};

const FIRST_NAMES = [
  "Артем", "Максим", "Никита", "Илья", "Кирилл", "Даниил",
  "Роман", "Иван", "Тимур", "Егор", "Денис", "Павел",
];

const DISTRICTS = [
  {
    key: "yard",
    title: "Дворы",
    x: 40,
    y: 70,
    w: 260,
    h: 230,
    color: "#2d3a56",
    rentMult: 0.78,
    riskMult: 1.26,
    jobs: ["loader", "delivery", "taxi", "service"],
  },
  {
    key: "industrial",
    title: "Промзона",
    x: 340,
    y: 60,
    w: 280,
    h: 240,
    color: "#3a3b48",
    rentMult: 0.9,
    riskMult: 1.05,
    jobs: ["loader", "factory", "service", "driver"],
  },
  {
    key: "market",
    title: "Рынок",
    x: 660,
    y: 60,
    w: 280,
    h: 240,
    color: "#4a3f3e",
    rentMult: 1.02,
    riskMult: 1.12,
    jobs: ["sales", "delivery", "service", "broker"],
  },
  {
    key: "center",
    title: "Центр",
    x: 980,
    y: 80,
    w: 260,
    h: 220,
    color: "#2f4b62",
    rentMult: 1.38,
    riskMult: 0.96,
    jobs: ["office", "sales", "it-junior", "bar"],
  },
  {
    key: "campus",
    title: "Кампус",
    x: 130,
    y: 340,
    w: 260,
    h: 220,
    color: "#365f4b",
    rentMult: 0.95,
    riskMult: 0.86,
    jobs: ["study", "it-junior", "delivery", "media"],
  },
  {
    key: "midtown",
    title: "Мидтаун",
    x: 430,
    y: 330,
    w: 280,
    h: 230,
    color: "#495a40",
    rentMult: 1.08,
    riskMult: 0.93,
    jobs: ["office", "service", "sales", "it-junior"],
  },
  {
    key: "tech",
    title: "Техпарк",
    x: 760,
    y: 330,
    w: 250,
    h: 230,
    color: "#274d56",
    rentMult: 1.2,
    riskMult: 0.88,
    jobs: ["it-junior", "it-middle", "office", "media"],
  },
  {
    key: "elite",
    title: "Элитный квартал",
    x: 1040,
    y: 340,
    w: 210,
    h: 220,
    color: "#5c4b2e",
    rentMult: 1.62,
    riskMult: 0.82,
    jobs: ["office", "broker", "media", "security"],
  },
];

const PLACES = [
  { key: "gym", title: "Зал", district: "midtown", x: 560, y: 470, type: "life" },
  { key: "club", title: "Клуб", district: "center", x: 1130, y: 210, type: "risk" },
  { key: "clinic", title: "Клиника", district: "center", x: 1060, y: 145, type: "life" },
  { key: "station", title: "Отдел", district: "center", x: 1000, y: 260, type: "law" },
  { key: "uni", title: "Универ", district: "campus", x: 210, y: 430, type: "career" },
  { key: "cowork", title: "Коворкинг", district: "tech", x: 900, y: 470, type: "career" },
  { key: "service", title: "СТО", district: "industrial", x: 500, y: 200, type: "career" },
  { key: "mall", title: "ТЦ", district: "center", x: 1160, y: 145, type: "life" },
  { key: "court", title: "Суд", district: "center", x: 980, y: 210, type: "law" },
  { key: "bank", title: "Банк", district: "elite", x: 1140, y: 450, type: "law" },
  { key: "yard", title: "Двор", district: "yard", x: 190, y: 190, type: "risk" },
];

const JOBS = {
  loader: {
    title: "Грузчик",
    legal: "legal",
    baseIncome: [2600, 4900],
    fatigue: [8, 13],
    stress: [2, 4],
    req: { age: 16, edu: 0, respect: 0 },
  },
  delivery: {
    title: "Курьер",
    legal: "legal",
    baseIncome: [3100, 6200],
    fatigue: [7, 12],
    stress: [2, 5],
    req: { age: 16, edu: 0, respect: 0 },
  },
  service: {
    title: "Помощник в сервисе",
    legal: "legal",
    baseIncome: [3600, 7500],
    fatigue: [8, 13],
    stress: [2, 5],
    req: { age: 16, edu: 15, respect: 5 },
  },
  factory: {
    title: "Смена на производстве",
    legal: "legal",
    baseIncome: [4200, 8400],
    fatigue: [9, 14],
    stress: [3, 6],
    req: { age: 18, edu: 20, respect: 8 },
  },
  taxi: {
    title: "Такси эконом",
    legal: "legal",
    baseIncome: [3900, 9200],
    fatigue: [7, 11],
    stress: [3, 6],
    req: { age: 18, edu: 10, respect: 8 },
  },
  sales: {
    title: "Продавец / менеджер",
    legal: "legal",
    baseIncome: [4800, 12200],
    fatigue: [6, 11],
    stress: [3, 7],
    req: { age: 18, edu: 28, respect: 16 },
  },
  office: {
    title: "Офисная работа",
    legal: "legal",
    baseIncome: [5600, 15100],
    fatigue: [5, 9],
    stress: [3, 6],
    req: { age: 18, edu: 38, respect: 22 },
  },
  study: {
    title: "Учеба + подработка",
    legal: "legal",
    baseIncome: [1900, 4300],
    fatigue: [6, 9],
    stress: [2, 5],
    req: { age: 16, edu: 0, respect: 0 },
  },
  "it-junior": {
    title: "Junior IT",
    legal: "legal",
    baseIncome: [6400, 19600],
    fatigue: [5, 9],
    stress: [3, 5],
    req: { age: 18, edu: 55, respect: 24 },
  },
  "it-middle": {
    title: "Middle IT",
    legal: "legal",
    baseIncome: [13200, 35200],
    fatigue: [5, 8],
    stress: [4, 7],
    req: { age: 21, edu: 72, respect: 36 },
  },
  media: {
    title: "Медиа / контент",
    legal: "legal",
    baseIncome: [0, 22000],
    fatigue: [4, 10],
    stress: [2, 7],
    req: { age: 16, edu: 24, respect: 12 },
  },
  bar: {
    title: "Смена в баре",
    legal: "legal",
    baseIncome: [3600, 10000],
    fatigue: [6, 11],
    stress: [3, 7],
    req: { age: 18, edu: 10, respect: 8 },
  },
  broker: {
    title: "Брокер / риелтор-ассистент",
    legal: "legal",
    baseIncome: [5100, 17000],
    fatigue: [5, 10],
    stress: [4, 8],
    req: { age: 19, edu: 46, respect: 30 },
  },
  security: {
    title: "Охрана",
    legal: "legal",
    baseIncome: [4400, 9200],
    fatigue: [6, 10],
    stress: [2, 5],
    req: { age: 19, edu: 20, respect: 22 },
  },
};

const ILLEGAL_SCENES = [
  {
    key: "grey-deals",
    title: "Серая схема через знакомых",
    reward: [12000, 56000],
    riskAdd: [8, 16],
    stressAdd: [7, 12],
    note: "Быстрый кэш, но растут шансы на дело.",
  },
  {
    key: "gift-fraud",
    title: "Фейк-сделки с цифровыми подарками",
    reward: [9000, 70000],
    riskAdd: [10, 22],
    stressAdd: [9, 14],
    note: "Жалоба может запустить цепочку к уголовке.",
  },
  {
    key: "market-scam",
    title: "Скам на площадке",
    reward: [15000, 92000],
    riskAdd: [12, 24],
    stressAdd: [10, 16],
    note: "Высокая прибыль, но высокий риск идентификации.",
  },
];

const CHARGES = [
  { article: "Ст. 159 УК РФ", sentence: [18, 84], confiscation: 74 },
  { article: "Ст. 187 УК РФ", sentence: [12, 72], confiscation: 61 },
  { article: "Ст. 174.1 УК РФ", sentence: [24, 96], confiscation: 83 },
  { article: "Ст. 272 УК РФ", sentence: [8, 48], confiscation: 45 },
];

const HOUSES = [
  { key: "room-yard", name: "Комната (Дворы)", district: "yard", price: 1700000, rent: 10000 },
  { key: "studio-campus", name: "Студия (Кампус)", district: "campus", price: 2600000, rent: 15000 },
  { key: "flat-midtown", name: "1к (Мидтаун)", district: "midtown", price: 4100000, rent: 23000 },
  { key: "flat-center", name: "1к (Центр)", district: "center", price: 5900000, rent: 32000 },
  { key: "flat-tech", name: "2к (Техпарк)", district: "tech", price: 7600000, rent: 41000 },
  { key: "flat-elite", name: "2к (Элитный)", district: "elite", price: 12400000, rent: 66000 },
];

const STORYLINES = {
  career: {
    title: "Легальная карьера",
    steps: 24,
    progress: 0,
    completeMsg: "Ты построил легальную карьеру и стабильный капитал.",
  },
  risk: {
    title: "Опасный путь",
    steps: 22,
    progress: 0,
    completeMsg: "Ты дошел до критической точки риска и давления.",
  },
  relation: {
    title: "Личная жизнь",
    steps: 20,
    progress: 0,
    completeMsg: "Ты создал стабильные долгие отношения.",
  },
};

const state = {
  started: false,
  dayTimer: 0,
  selectedDistrict: null,
  player: null,
  world: {
    nowWeek: 1,
    nowDay: 1,
    season: "spring",
    weather: "clear",
    policeHeat: 0,
    activeCase: null,
    prisonWeeks: 0,
    gameOver: false,
  },
  history: [],
  storyline: JSON.parse(JSON.stringify(STORYLINES)),
};

const el = {
  setupScreen: document.getElementById("setupScreen"),
  gameScreen: document.getElementById("gameScreen"),
  firstNameInput: document.getElementById("firstNameInput"),
  difficultySelect: document.getElementById("difficultySelect"),
  familyPreview: document.getElementById("familyPreview"),
  startBtn: document.getElementById("startBtn"),
  profileBlock: document.getElementById("profileBlock"),
  statsBlock: document.getElementById("statsBlock"),
  jobBlock: document.getElementById("jobBlock"),
  housingBlock: document.getElementById("housingBlock"),
  contactsBlock: document.getElementById("contactsBlock"),
  districtInfo: document.getElementById("districtInfo"),
  travelBtn: document.getElementById("travelBtn"),
  nextWeekBtn: document.getElementById("nextWeekBtn"),
  casePanel: document.getElementById("casePanel"),
  timeBlock: document.getElementById("timeBlock"),
  actionsList: document.getElementById("actionsList"),
  housingMarketSelect: document.getElementById("housingMarketSelect"),
  rentBtn: document.getElementById("rentBtn"),
  mortgageBtn: document.getElementById("mortgageBtn"),
  housingInfo: document.getElementById("housingInfo"),
  timeline: document.getElementById("timeline"),
  canvas: document.getElementById("gameCanvas"),
};

const ctx = el.canvas.getContext("2d");
let keys = new Set();
let lastTs = 0;

function addLog(text, type = "info", stamp = "") {
  const t = stamp || `Н${state.world.nowWeek} Д${state.world.nowDay}`;
  state.history.unshift({ t, text, type });
  el.timeline.innerHTML = state.history
    .slice(0, 160)
    .map((e) => `<div class="event ${e.type}"><span class="time">${e.t}</span> ${e.text}</div>`)
    .join("");
}

function randomFamily() {
  return pick(FAMILY_ARCHETYPES);
}

function prehistory(p) {
  const events = [
    { txt: "В 6 лет начались кружки, выросла дисциплина.", mod: () => (p.discipline += 3) },
    { txt: "В 9 лет семья переехала, вырос стресс.", mod: () => (p.stress += 5) },
    { txt: "В 12 лет была первая подработка.", mod: () => (p.money += 9000) },
    { txt: "В 13 лет конфликт в семье снизил настроение.", mod: () => (p.mood -= 8) },
    { txt: "В 15 лет появился наставник.", mod: () => (p.education += 6) },
    { txt: "В 15 лет спорт улучшил здоровье.", mod: () => (p.health += 7) },
  ];
  const count = rand(2, 4);
  for (let i = 0; i < count; i += 1) {
    const e = pick(events);
    e.mod();
    addLog(e.txt, "info", `${rand(6, 15)} лет`);
  }
}

function initHousingMarket() {
  el.housingMarketSelect.innerHTML = "";
  HOUSES.forEach((h) => {
    const d = DISTRICTS.find((x) => x.key === h.district);
    const op = document.createElement("option");
    op.value = h.key;
    op.textContent = `${h.name} (${d.title}) | ${money(h.price)} | аренда ${money(h.rent)}/мес`;
    el.housingMarketSelect.appendChild(op);
  });
}

function setSelectedDistrict(key) {
  state.selectedDistrict = key;
  renderDistrictInfo();
  renderActions();
}

function createPlayer(name, family, diff) {
  const district = pick(DISTRICTS);
  const surname = pick(SURNAMES[family.suffix] || SURNAMES.mixed);
  const debt = rand(family.debt[0], family.debt[1]);
  const hard = diff === "hard";
  const p = {
    name: `${name} ${surname}`,
    family: family.title,
    age: 16,
    x: district.x + district.w / 2,
    y: district.y + district.h / 2,
    district: district.key,
    money: Math.max(3000, family.startMoney - (hard ? 15000 : 0)),
    debt: debt + (hard ? 70000 : 0),
    health: clamp(75 + rand(-8, 10), 25, 100),
    stamina: clamp(74 + rand(-10, 12), 20, 100),
    mood: clamp(67 + rand(-11, 10), 20, 100),
    stress: clamp(family.stats.stress + rand(-4, 7), 5, 95),
    education: clamp(family.stats.education + rand(-6, 8), 10, 95),
    respect: clamp(family.stats.respect + rand(-9, 8), 10, 95),
    risk: clamp(family.stats.risk + rand(0, 5), 0, 100),
    wanted: 0,
    contacts: family.contacts.map((c) => ({ ...c })),
    activeJob: null,
    home: {
      mode: "with-family",
      rentPerWeek: 0,
      mortgagePerWeek: 0,
      homeKey: null,
      principalLeft: 0,
    },
    relation: {
      status: "нет",
      trust: 0,
    },
    prisonHistory: 0,
    alive: true,
    diff,
  };
  return p;
}

function start() {
  const firstName = el.firstNameInput.value.trim() || pick(FIRST_NAMES);
  const fam = randomFamily();
  const diff = el.difficultySelect.value;
  state.player = createPlayer(firstName, fam, diff);
  state.world = {
    nowWeek: 1,
    nowDay: 1,
    season: "spring",
    weather: "clear",
    policeHeat: state.player.risk,
    activeCase: null,
    prisonWeeks: 0,
    gameOver: false,
  };
  state.history = [];
  state.storyline = JSON.parse(JSON.stringify(STORYLINES));
  prehistory(state.player);
  addLog(`Случайная семья: ${fam.title}. ${fam.backstory}`, "good");
  if (state.player.debt > 0) {
    addLog(`Стартовый долг семьи: ${money(state.player.debt)}.`, "bad");
  }
  setSelectedDistrict(state.player.district);
  initHousingMarket();
  el.setupScreen.classList.add("hidden");
  el.gameScreen.classList.remove("hidden");
  state.started = true;
  renderAll();
}

function getDistrictByPos(x, y) {
  return DISTRICTS.find((d) => x >= d.x && x <= d.x + d.w && y >= d.y && y <= d.y + d.h);
}

function districtAtPlayer() {
  return DISTRICTS.find((d) => d.key === state.player.district);
}

function movePlayer(dt) {
  if (!state.player || state.world.prisonWeeks > 0 || state.world.gameOver) return;
  let vx = 0;
  let vy = 0;
  if (keys.has("KeyW") || keys.has("ArrowUp")) vy -= 1;
  if (keys.has("KeyS") || keys.has("ArrowDown")) vy += 1;
  if (keys.has("KeyA") || keys.has("ArrowLeft")) vx -= 1;
  if (keys.has("KeyD") || keys.has("ArrowRight")) vx += 1;
  if (vx === 0 && vy === 0) return;
  const len = Math.hypot(vx, vy) || 1;
  const run = keys.has("ShiftLeft") || keys.has("ShiftRight");
  const speed = PLAYER_SPEED * (run ? RUN_MULT : 1);
  const nx = state.player.x + (vx / len) * speed * dt;
  const ny = state.player.y + (vy / len) * speed * dt;
  state.player.x = clamp(nx, 14, WIDTH - 14);
  state.player.y = clamp(ny, 14, HEIGHT - 14);
  const d = getDistrictByPos(state.player.x, state.player.y);
  if (d && d.key !== state.player.district) {
    state.player.district = d.key;
    setSelectedDistrict(d.key);
  }
}

function drawWorld() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  const grd = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  grd.addColorStop(0, "#1a2340");
  grd.addColorStop(1, "#0a0f1e");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  DISTRICTS.forEach((d) => {
    const isCurrent = state.player && state.player.district === d.key;
    const isSelected = state.selectedDistrict === d.key;
    ctx.fillStyle = d.color;
    ctx.fillRect(d.x, d.y, d.w, d.h);
    ctx.strokeStyle = isCurrent ? "#64ffd4" : isSelected ? "#8fbaff" : "#2f4467";
    ctx.lineWidth = isCurrent || isSelected ? 3 : 2;
    ctx.strokeRect(d.x, d.y, d.w, d.h);
    ctx.fillStyle = "#d8e7ff";
    ctx.font = "600 17px Inter, sans-serif";
    ctx.fillText(d.title, d.x + 12, d.y + 24);
  });

  PLACES.forEach((p) => {
    const hovered = state.player && Math.hypot(state.player.x - p.x, state.player.y - p.y) <= INTERACT_RADIUS;
    ctx.beginPath();
    ctx.arc(p.x, p.y, hovered ? 10 : 7, 0, Math.PI * 2);
    ctx.fillStyle = p.type === "law" ? "#ff8a8a" : p.type === "risk" ? "#ffce6a" : "#89ffe1";
    ctx.fill();
    ctx.font = "12px Inter, sans-serif";
    ctx.fillStyle = "#e6f0ff";
    ctx.fillText(p.title, p.x + 11, p.y + 4);
  });

  if (state.player) {
    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, 11, 0, Math.PI * 2);
    ctx.fillStyle = "#57f5c1";
    ctx.fill();
    ctx.strokeStyle = "#f0fffb";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function tickTime(dtMs) {
  if (!state.player || state.world.gameOver) return;
  state.dayTimer += dtMs;
  if (state.dayTimer >= DAY_DURATION_MS) {
    state.dayTimer = 0;
    nextDay();
  }
}

function nextDay() {
  state.world.nowDay += 1;
  state.player.stamina = clamp(state.player.stamina + 6, 0, 100);
  state.player.stress = clamp(state.player.stress - 1, 0, 100);
  if (state.world.nowDay > 7) {
    state.world.nowDay = 1;
    nextWeek();
  }
  randomDailyEvent();
  renderAll();
}

function housingWeeklyCost() {
  const p = state.player;
  return p.home.rentPerWeek + p.home.mortgagePerWeek;
}

function nextWeek() {
  const p = state.player;
  state.world.nowWeek += 1;
  if (state.world.nowWeek % 52 === 0) p.age += 1;
  if (state.world.prisonWeeks > 0) {
    state.world.prisonWeeks -= 1;
    p.health = clamp(p.health - rand(0, 2), 0, 100);
    p.stamina = clamp(p.stamina - rand(0, 2), 0, 100);
    p.stress = clamp(p.stress + rand(0, 3), 0, 100);
    p.money = Math.max(0, p.money - rand(2500, 7000));
    if (state.world.prisonWeeks === 0) {
      addLog("Освобождение после срока. Связи и репутация просели.", "bad");
      p.respect = clamp(p.respect - rand(8, 20), 0, 100);
      p.risk = clamp(p.risk - 16, 0, 100);
    }
    renderAll();
    return;
  }

  let weeklyCost = rand(11000, 23000);
  weeklyCost += housingWeeklyCost();
  if (p.relation.status === "в отношениях") weeklyCost += rand(4000, 12000);
  if (p.diff === "hard") weeklyCost = Math.round(weeklyCost * 1.22);
  p.money -= weeklyCost;
  if (p.money < 0) {
    p.debt += Math.abs(p.money);
    p.money = 0;
    p.stress = clamp(p.stress + 4, 0, 100);
  }

  if (p.debt > 0 && p.money > 8000 && rand(1, 100) <= 35) {
    const pay = Math.min(p.debt, rand(3000, 12000));
    p.debt -= pay;
    p.money -= pay;
    addLog(`Погашена часть долга: ${money(pay)}.`, "good");
  }

  if (p.home.principalLeft > 0 && p.home.mortgagePerWeek > 0) {
    p.home.principalLeft = Math.max(0, p.home.principalLeft - p.home.mortgagePerWeek * 0.63);
    if (p.home.principalLeft === 0) {
      p.home.mortgagePerWeek = 0;
      addLog("Ипотека полностью закрыта. Жилье твое.", "good");
    }
  }

  if (p.health <= 0 || p.stress >= 100) {
    state.world.gameOver = true;
    addLog("Критический срыв. Жизненный путь завершен.", "bad");
  }
  if (rand(1, 1000) <= Math.max(1, Math.round(p.risk * 0.08))) {
    openCaseByRisk();
  }
  renderAll();
}

function randomDailyEvent() {
  const p = state.player;
  const roll = rand(1, 100);
  if (roll <= 10) {
    const bonus = rand(1000, 7000);
    p.money += bonus;
    addLog(`Неожиданная подработка принесла ${money(bonus)}.`, "good");
  } else if (roll <= 18) {
    const out = rand(1500, 9000);
    p.money = Math.max(0, p.money - out);
    p.stress = clamp(p.stress + 2, 0, 100);
    addLog(`Непредвиденный расход: ${money(out)}.`, "bad");
  } else if (roll <= 25) {
    p.health = clamp(p.health - rand(1, 6), 0, 100);
    addLog("Усталость и недосып ударили по здоровью.", "bad");
  } else if (roll <= 30 && p.relation.status === "нет" && rand(1, 100) <= 40) {
    p.relation.status = "в отношениях";
    p.relation.trust = rand(18, 36);
    addLog("Новые отношения: появился близкий человек.", "good");
  } else if (roll <= 34 && p.relation.status === "в отношениях") {
    p.relation.trust = clamp(p.relation.trust - rand(3, 9), 0, 100);
    addLog("Ссора в отношениях. Доверие просело.", "bad");
    if (p.relation.trust <= 5) {
      p.relation.status = "нет";
      p.relation.trust = 0;
      addLog("Отношения закончились.", "bad");
    }
  }
}

function canWork(jobKey) {
  const p = state.player;
  const j = JOBS[jobKey];
  if (!j) return { ok: false, why: "Работа не найдена" };
  if (p.age < j.req.age) return { ok: false, why: `Нужен возраст ${j.req.age}+` };
  if (p.education < j.req.edu) return { ok: false, why: `Нужно образование ${j.req.edu}+` };
  if (p.respect < j.req.respect) return { ok: false, why: `Нужна репутация ${j.req.respect}+` };
  if (p.stamina < 12) return { ok: false, why: "Слишком мало энергии" };
  return { ok: true, why: "" };
}

function doWork(jobKey) {
  const p = state.player;
  const j = JOBS[jobKey];
  const check = canWork(jobKey);
  if (!check.ok) {
    addLog(`Не удалось выйти на смену "${j.title}": ${check.why}.`, "bad");
    renderAll();
    return;
  }
  const d = districtAtPlayer();
  const incomeBase = rand(j.baseIncome[0], j.baseIncome[1]);
  const zoneMult = d ? clamp(1 + (d.rentMult - 1) * 0.3, 0.82, 1.24) : 1;
  const relationMult = p.relation.status === "в отношениях" ? 1.03 : 1;
  const skillMult = clamp(0.84 + p.education * 0.0035 + p.respect * 0.0018, 0.82, 1.54);
  const income = Math.round(incomeBase * zoneMult * relationMult * skillMult);

  p.money += income;
  p.stamina = clamp(p.stamina - rand(j.fatigue[0], j.fatigue[1]), 0, 100);
  p.stress = clamp(p.stress + rand(j.stress[0], j.stress[1]), 0, 100);
  p.education = clamp(p.education + (jobKey.includes("study") ? rand(1, 3) : rand(0, 1)), 0, 100);
  p.respect = clamp(p.respect + rand(0, 2), 0, 100);
  p.mood = clamp(p.mood + rand(-2, 3), 0, 100);
  state.player.activeJob = jobKey;
  progressStory("career", rand(1, 2));
  addLog(`Смена "${j.title}" принесла ${money(income)}.`, "good");
  renderAll();
}

function doIllegal(sceneKey) {
  const p = state.player;
  const scene = ILLEGAL_SCENES.find((s) => s.key === sceneKey);
  if (!scene) return;
  if (p.stamina < 20) {
    addLog("Ты слишком вымотан для рискованной схемы.", "bad");
    return;
  }
  const gain = rand(scene.reward[0], scene.reward[1]);
  p.money += gain;
  p.stamina = clamp(p.stamina - rand(8, 15), 0, 100);
  p.stress = clamp(p.stress + rand(scene.stressAdd[0], scene.stressAdd[1]), 0, 100);
  const riskAdd = rand(scene.riskAdd[0], scene.riskAdd[1]);
  p.risk = clamp(p.risk + riskAdd, 0, 100);
  state.world.policeHeat = clamp(state.world.policeHeat + riskAdd, 0, 100);
  p.respect = clamp(p.respect - rand(2, 8), 0, 100);
  progressStory("risk", rand(1, 3));
  addLog(`${scene.title}: +${money(gain)}. ${scene.note}`, "bad");
  if (rand(1, 100) <= Math.max(8, Math.round(state.world.policeHeat * 0.35))) {
    openCaseByRisk();
  }
  renderAll();
}

function doLife(placeKey) {
  const p = state.player;
  const map = {
    gym: () => {
      const cost = 1200;
      if (p.money < cost) return fail("Не хватает денег на зал.");
      p.money -= cost;
      p.health = clamp(p.health + rand(2, 6), 0, 100);
      p.stamina = clamp(p.stamina + rand(1, 5), 0, 100);
      p.stress = clamp(p.stress - rand(1, 4), 0, 100);
      p.mood = clamp(p.mood + rand(1, 5), 0, 100);
      addLog("Тренировка в зале улучшила состояние.", "good");
      progressStory("career", 1);
      return true;
    },
    clinic: () => {
      const cost = rand(1800, 7000);
      if (p.money < cost) return fail("Не хватает денег на медобслуживание.");
      p.money -= cost;
      p.health = clamp(p.health + rand(5, 13), 0, 100);
      p.stress = clamp(p.stress - rand(1, 5), 0, 100);
      addLog(`Клиника: потрачено ${money(cost)}, здоровье улучшено.`, "good");
      return true;
    },
    uni: () => {
      const cost = rand(1000, 4200);
      if (p.money < cost) return fail("Не хватает денег на учебный модуль.");
      p.money -= cost;
      p.education = clamp(p.education + rand(2, 6), 0, 100);
      p.stamina = clamp(p.stamina - rand(2, 5), 0, 100);
      p.mood = clamp(p.mood + rand(0, 3), 0, 100);
      addLog(`Учебный день в кампусе. Расход ${money(cost)}.`, "info");
      progressStory("career", rand(1, 2));
      return true;
    },
    cowork: () => {
      const cost = 900;
      if (p.money < cost) return fail("Не хватает денег на рабочее место.");
      p.money -= cost;
      p.education = clamp(p.education + rand(1, 3), 0, 100);
      p.respect = clamp(p.respect + rand(1, 2), 0, 100);
      p.stress = clamp(p.stress - rand(0, 2), 0, 100);
      addLog("Коворкинг: новые контакты и рост навыков.", "good");
      return true;
    },
    mall: () => {
      const cost = rand(1200, 6500);
      if (p.money < cost) return fail("Не хватает денег на досуг.");
      p.money -= cost;
      p.mood = clamp(p.mood + rand(2, 8), 0, 100);
      p.stress = clamp(p.stress - rand(1, 4), 0, 100);
      addLog(`Досуг в ТЦ: -${money(cost)}, настроение выше.`, "info");
      progressStory("relation", 1);
      return true;
    },
    yard: () => {
      p.stress = clamp(p.stress + rand(-1, 3), 0, 100);
      p.mood = clamp(p.mood + rand(-2, 2), 0, 100);
      addLog("Время во дворах: непредсказуемая среда.", "info");
      return true;
    },
    club: () => {
      const cost = rand(2400, 11000);
      if (p.money < cost) return fail("Не хватает денег на клуб.");
      p.money -= cost;
      p.mood = clamp(p.mood + rand(3, 9), 0, 100);
      p.health = clamp(p.health - rand(0, 3), 0, 100);
      p.stress = clamp(p.stress + rand(-2, 4), 0, 100);
      if (rand(1, 100) <= 24) {
        p.risk = clamp(p.risk + rand(2, 8), 0, 100);
        state.world.policeHeat = clamp(state.world.policeHeat + rand(2, 8), 0, 100);
      }
      addLog(`Ночной выезд: -${money(cost)}.`, "info");
      progressStory("relation", rand(1, 2));
      return true;
    },
    bank: () => {
      if (p.debt <= 0) {
        addLog("В банке: долгов нет, кредитная история стабильна.", "good");
      } else {
        const pay = Math.min(p.debt, Math.min(p.money, rand(3000, 22000)));
        if (pay <= 0) return fail("Нет денег на платеж в банк.");
        p.debt -= pay;
        p.money -= pay;
        p.respect = clamp(p.respect + rand(0, 2), 0, 100);
        addLog(`Банк: досрочное погашение ${money(pay)}.`, "good");
      }
      return true;
    },
    station: () => {
      if (!state.world.activeCase) {
        addLog("В отделе: пока к тебе вопросов нет.", "info");
        return true;
      }
      solveCaseByContacts();
      return true;
    },
    court: () => {
      if (!state.world.activeCase) {
        addLog("В суде по твоей линии дел нет.", "info");
        return true;
      }
      processCase(true);
      return true;
    },
    service: () => {
      doWork("service");
      return true;
    },
  };

  if (!map[placeKey]) return;
  map[placeKey]();
  renderAll();
}

function fail(msg) {
  addLog(msg, "bad");
  return false;
}

function nearestPlace() {
  const p = state.player;
  let best = null;
  let bestD = 1e9;
  PLACES.forEach((pl) => {
    const d = Math.hypot(p.x - pl.x, p.y - pl.y);
    if (d < bestD) {
      bestD = d;
      best = pl;
    }
  });
  return { place: best, dist: bestD };
}

function interactNearest() {
  const n = nearestPlace();
  if (!n.place || n.dist > INTERACT_RADIUS) {
    addLog("Подойди ближе к точке интереса (E).", "info");
    renderAll();
    return;
  }
  doLife(n.place.key);
}

function openCaseByRisk() {
  if (state.world.activeCase) return;
  const c = pick(CHARGES);
  state.world.activeCase = {
    article: c.article,
    severity: rand(35, 98),
    sentence: c.sentence,
    confiscation: c.confiscation,
    stage: "investigation",
  };
  addLog(`Запущена проверка: ${c.article}.`, "bad");
  renderAll();
}

function solveCaseByContacts() {
  const p = state.player;
  const c = state.world.activeCase;
  if (!c) return;
  const law = (p.contacts.find((x) => x.key === "lawyer")?.lvl || 0);
  const adm = (p.contacts.find((x) => x.key === "admin")?.lvl || 0);
  const police = (p.contacts.find((x) => x.key === "street")?.lvl || 0);
  const power = law * 0.8 + adm * 0.6 + police * 0.4 + p.education * 0.2 + p.respect * 0.2;
  const cost = rand(30000, 180000);
  if (p.money < cost) {
    addLog("Не хватает денег на защиту по делу.", "bad");
    return;
  }
  p.money -= cost;
  if (rand(1, 100) <= clamp(12 + power * 0.35 - c.severity * 0.25, 3, 80)) {
    addLog(`Удалось снизить давление по делу за ${money(cost)}.`, "good");
    c.severity = Math.max(5, c.severity - rand(18, 40));
    if (c.severity <= 16) {
      addLog("Проверка прекращена.", "good");
      state.world.activeCase = null;
      p.risk = clamp(p.risk - 12, 0, 100);
    }
  } else {
    addLog(`Защита за ${money(cost)} не сработала.`, "bad");
    c.severity = clamp(c.severity + rand(8, 18), 0, 100);
    p.respect = clamp(p.respect - rand(3, 9), 0, 100);
  }
}

function processCase(forceCourt = false) {
  const p = state.player;
  const c = state.world.activeCase;
  if (!c) return;
  if (c.stage === "investigation" && !forceCourt) {
    if (rand(1, 100) <= clamp(20 + p.education * 0.2 + p.respect * 0.15 - c.severity * 0.4, 2, 82)) {
      addLog("Материал недостаточен: дело закрыто.", "good");
      state.world.activeCase = null;
      p.risk = clamp(p.risk - 15, 0, 100);
      return;
    }
    c.stage = "court";
    addLog("Материалы ушли в суд.", "bad");
    return;
  }

  const roll = rand(1, 100) + c.severity * 0.5 - (p.education * 0.2 + p.respect * 0.25);
  if (roll < 48) {
    const fine = rand(20000, 400000);
    p.money = Math.max(0, p.money - fine);
    p.risk = clamp(p.risk - 10, 0, 100);
    p.respect = clamp(p.respect - 6, 0, 100);
    addLog(`Суд: условный срок и штраф ${money(fine)}.`, "bad");
    state.world.activeCase = null;
    return;
  }
  const weeks = rand(c.sentence[0], c.sentence[1]);
  if (rand(1, 100) <= c.confiscation) {
    p.money = Math.max(0, Math.round(p.money * rand(0, 25) / 100));
    p.home = { mode: "with-family", rentPerWeek: 0, mortgagePerWeek: 0, homeKey: null, principalLeft: 0 };
    addLog("По делу конфискована часть активов.", "bad");
  }
  p.prisonHistory += 1;
  state.world.prisonWeeks = weeks;
  state.world.activeCase = null;
  p.risk = clamp(p.risk - 24, 0, 100);
  p.stress = clamp(p.stress + 10, 0, 100);
  addLog(`Реальный срок: ${Math.floor(weeks / 52)} лет ${Math.floor((weeks % 52) / 4)} мес.`, "bad");
}

function progressStory(key, value) {
  const s = state.storyline[key];
  if (!s) return;
  if (s.progress >= s.steps) return;
  s.progress = Math.min(s.steps, s.progress + value);
  if (s.progress >= s.steps) {
    addLog(s.completeMsg, "good");
  }
}

function travelToSelected() {
  if (!state.selectedDistrict) return;
  const d = DISTRICTS.find((x) => x.key === state.selectedDistrict);
  if (!d) return;
  if (state.world.prisonWeeks > 0) {
    addLog("Перемещение невозможно: ты под стражей.", "bad");
    return;
  }
  const dist = Math.hypot(state.player.x - (d.x + d.w / 2), state.player.y - (d.y + d.h / 2));
  const cost = Math.round(300 + dist * 0.8);
  if (state.player.money < cost) {
    addLog("Не хватает денег на перемещение.", "bad");
    return;
  }
  state.player.money -= cost;
  state.player.x = d.x + rand(40, d.w - 40);
  state.player.y = d.y + rand(40, d.h - 40);
  state.player.district = d.key;
  state.player.stamina = clamp(state.player.stamina - rand(2, 5), 0, 100);
  addLog(`Перемещение в район "${d.title}" за ${money(cost)}.`, "info");
  renderAll();
}

function rentHousing() {
  const p = state.player;
  const h = HOUSES.find((x) => x.key === el.housingMarketSelect.value);
  if (!h) return;
  const weekly = Math.round((h.rent / 4) * (p.diff === "hard" ? 1.14 : 1));
  const deposit = Math.round(h.rent * 1.5);
  if (p.money < deposit) {
    addLog(`Не хватает денег на депозит: ${money(deposit)}.`, "bad");
    return;
  }
  p.money -= deposit;
  p.home = {
    mode: "rent",
    rentPerWeek: weekly,
    mortgagePerWeek: 0,
    homeKey: h.key,
    principalLeft: 0,
  };
  addLog(`Аренда оформлена: ${h.name}. Депозит ${money(deposit)}.`, "good");
  renderAll();
}

function mortgageHousing() {
  const p = state.player;
  const h = HOUSES.find((x) => x.key === el.housingMarketSelect.value);
  if (!h) return;
  const initial = Math.round(h.price * 0.2);
  if (p.money < initial) {
    addLog(`Нужен первоначальный взнос ${money(initial)}.`, "bad");
    return;
  }
  if (p.respect < 28 || p.education < 28) {
    addLog("Банк отказал: слабый профиль заемщика.", "bad");
    return;
  }
  p.money -= initial;
  const principal = h.price - initial;
  const weekly = Math.round((principal * 1.38) / (15 * 52));
  p.home = {
    mode: "mortgage",
    rentPerWeek: 0,
    mortgagePerWeek: weekly,
    homeKey: h.key,
    principalLeft: principal,
  };
  addLog(`Ипотека одобрена: ${h.name}. Взнос ${money(initial)}.`, "good");
  renderAll();
}

function renderDistrictInfo() {
  const d = DISTRICTS.find((x) => x.key === state.selectedDistrict);
  if (!d) return;
  const jobs = d.jobs.map((j) => JOBS[j]?.title || j).join(", ");
  el.districtInfo.innerHTML =
    `<strong>${d.title}</strong><br>` +
    `Стоимость жизни: x${d.rentMult.toFixed(2)} | Риск среды: x${d.riskMult.toFixed(2)}<br>` +
    `Доступные направления: ${jobs}`;
}

function renderActions() {
  const d = DISTRICTS.find((x) => x.key === state.player?.district);
  if (!d || !state.player) return;
  const cards = [];

  d.jobs.forEach((jk) => {
    const j = JOBS[jk];
    if (!j) return;
    const c = canWork(jk);
    const disabled = c.ok ? "" : "disabled";
    const why = c.ok ? "" : `<span class="meta">Недоступно: ${c.why}</span>`;
    cards.push(
      `<div class="action-card">
         <h5>${j.title}</h5>
         <div class="meta">Доход/день: ${money(j.baseIncome[0])}...${money(j.baseIncome[1])}</div>
         <div class="meta">Режим: ${j.legal}</div>
         ${why}
         <button class="btn" data-action="work" data-key="${jk}" ${disabled}>Отработать день</button>
       </div>`
    );
  });

  ILLEGAL_SCENES.forEach((s) => {
    cards.push(
      `<div class="action-card">
         <h5>${s.title}</h5>
         <div class="meta">Прибыль: ${money(s.reward[0])}...${money(s.reward[1])}</div>
         <div class="meta">Риск: +${s.riskAdd[0]}...+${s.riskAdd[1]}</div>
         <button class="btn danger" data-action="illegal" data-key="${s.key}">Рискнуть</button>
       </div>`
    );
  });

  cards.push(
    `<div class="action-card">
       <h5>Взаимодействие рядом (E)</h5>
       <div class="meta">Подойди к точке на карте и нажми E</div>
       <button class="btn" data-action="interact">Взаимодействовать</button>
     </div>`
  );

  el.actionsList.innerHTML = cards.join("");
}

function renderProfile() {
  const p = state.player;
  const status = state.world.gameOver ? "Игра окончена" : state.world.prisonWeeks > 0 ? `В заключении (${state.world.prisonWeeks} нед)` : "На свободе";
  el.profileBlock.innerHTML =
    `<div><strong>${p.name}</strong></div>` +
    `<div>Возраст: ${p.age}</div>` +
    `<div>Семья: ${p.family}</div>` +
    `<div>Район: ${DISTRICTS.find((d) => d.key === p.district)?.title || "-"}</div>` +
    `<div>Статус: ${status}</div>` +
    `<div>Судимостей: ${p.prisonHistory}</div>`;
}

function renderStats() {
  const p = state.player;
  const rows = [
    ["Деньги", money(p.money)],
    ["Долг", money(p.debt)],
    ["Здоровье", p.health],
    ["Энергия", p.stamina],
    ["Настроение", p.mood],
    ["Стресс", p.stress],
    ["Образование", p.education],
    ["Репутация", p.respect],
    ["Риск", p.risk],
    ["Heat полиции", state.world.policeHeat],
  ];
  el.statsBlock.innerHTML = rows
    .map(([k, v]) => `<div class="stat-row"><span>${k}</span><strong>${v}</strong></div>`)
    .join("");
}

function renderJob() {
  const p = state.player;
  const active = p.activeJob ? (JOBS[p.activeJob]?.title || p.activeJob) : "Нет стабильной работы";
  const c1 = state.storyline.career;
  const c2 = state.storyline.risk;
  const c3 = state.storyline.relation;
  el.jobBlock.innerHTML =
    `<div>Текущее направление: <strong>${active}</strong></div>` +
    `<div>Сюжет "карьера": ${c1.progress}/${c1.steps}</div>` +
    `<div>Сюжет "риск": ${c2.progress}/${c2.steps}</div>` +
    `<div>Сюжет "отношения": ${c3.progress}/${c3.steps}</div>`;
}

function renderHousing() {
  const p = state.player;
  let mode = "Живешь с семьей";
  if (p.home.mode === "rent") mode = "Аренда";
  if (p.home.mode === "mortgage") mode = "Ипотека";
  const house = HOUSES.find((h) => h.key === p.home.homeKey);
  el.housingBlock.innerHTML =
    `<div>Формат: <strong>${mode}</strong></div>` +
    `<div>Объект: ${house ? house.name : "-"}</div>` +
    `<div>Платеж/нед: ${money(p.home.rentPerWeek + p.home.mortgagePerWeek)}</div>` +
    `<div>Остаток ипотеки: ${money(p.home.principalLeft)}</div>`;
  el.housingInfo.textContent = house
    ? `${house.name}: цена ${money(house.price)}, аренда ${money(house.rent)}/мес`
    : "Выбери объект рынка жилья.";
}

function renderContacts() {
  const arr = state.player.contacts
    .slice()
    .sort((a, b) => b.lvl - a.lvl)
    .map((c) => `<div>${c.key}: <strong>${c.lvl}</strong></div>`)
    .join("");
  el.contactsBlock.innerHTML = arr || "<div class='small'>Контактов нет.</div>";
}

function renderCase() {
  const c = state.world.activeCase;
  if (!c) {
    el.casePanel.classList.add("hidden");
    return;
  }
  el.casePanel.classList.remove("hidden");
  el.casePanel.innerHTML =
    `<strong>Активное дело:</strong> ${c.article}<br>` +
    `Стадия: ${c.stage}<br>` +
    `Тяжесть: ${Math.round(c.severity)}`;
}

function renderTime() {
  const p = state.player;
  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  el.timeBlock.innerHTML =
    `Неделя ${state.world.nowWeek}, ${dayNames[state.world.nowDay - 1]}<br>` +
    `Сезон: ${state.world.season}, Погода: ${state.world.weather}<br>` +
    `Рядом: ${nearestPlace().place?.title || "-"} | Нажми E для взаимодействия.<br>` +
    `Управление: WASD, Shift, E`;
  if (!p.alive || state.world.gameOver) {
    el.timeBlock.innerHTML += "<br><strong>Игра окончена. Нажми R для новой жизни.</strong>";
  }
}

function renderAll() {
  if (!state.player) return;
  renderProfile();
  renderStats();
  renderJob();
  renderHousing();
  renderContacts();
  renderCase();
  renderTime();
  renderActions();
}

function handleActionClick(ev) {
  const btn = ev.target.closest("button");
  if (!btn) return;
  const action = btn.dataset.action;
  const key = btn.dataset.key;
  if (action === "work") doWork(key);
  if (action === "illegal") doIllegal(key);
  if (action === "interact") interactNearest();
}

function bindInputs() {
  document.addEventListener("keydown", (e) => {
    keys.add(e.code);
    if (e.code === "KeyE" && state.started) {
      interactNearest();
    }
    if (e.code === "KeyR" && state.world.gameOver) {
      reset();
    }
  });
  document.addEventListener("keyup", (e) => keys.delete(e.code));
}

function bindUI() {
  el.startBtn.addEventListener("click", start);
  el.travelBtn.addEventListener("click", travelToSelected);
  el.nextWeekBtn.addEventListener("click", nextWeek);
  el.rentBtn.addEventListener("click", rentHousing);
  el.mortgageBtn.addEventListener("click", mortgageHousing);
  el.actionsList.addEventListener("click", handleActionClick);
  el.canvas.addEventListener("click", (e) => {
    if (!state.player) return;
    const rect = el.canvas.getBoundingClientRect();
    const sx = (e.clientX - rect.left) * (WIDTH / rect.width);
    const sy = (e.clientY - rect.top) * (HEIGHT / rect.height);
    const d = DISTRICTS.find((x) => sx >= x.x && sx <= x.x + x.w && sy >= x.y && sy <= x.y + x.h);
    if (d) setSelectedDistrict(d.key);
  });
}

function updateWeather() {
  const arr = ["clear", "rain", "cloudy", "windy"];
  if (rand(1, 100) <= 20) state.world.weather = pick(arr);
  if (state.world.nowWeek % 13 === 0) {
    const seasons = ["spring", "summer", "autumn", "winter"];
    const idx = Math.floor((state.world.nowWeek / 13) % 4);
    state.world.season = seasons[idx];
  }
}

function updateByWeather() {
  if (!state.player) return;
  if (state.world.weather === "rain") {
    state.player.stamina = clamp(state.player.stamina - 0.02, 0, 100);
  }
  if (state.world.weather === "winter") {
    state.player.health = clamp(state.player.health - 0.01, 0, 100);
  }
}

function gameLoop(ts) {
  if (!lastTs) lastTs = ts;
  const dtMs = ts - lastTs;
  const dt = dtMs / 1000;
  lastTs = ts;

  if (state.started) {
    movePlayer(dt);
    tickTime(dtMs);
    updateWeather();
    updateByWeather();
    drawWorld();
  } else {
    drawWorld();
    ctx.fillStyle = "#e7f0ff";
    ctx.font = "600 24px Inter, sans-serif";
    ctx.fillText("Real Life Open City", 480, 342);
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText("Заполни имя и нажми 'Начать в 16 лет'", 495, 370);
  }
  requestAnimationFrame(gameLoop);
}

function reset() {
  state.started = false;
  state.player = null;
  state.history = [];
  state.world.gameOver = false;
  el.setupScreen.classList.remove("hidden");
  el.gameScreen.classList.add("hidden");
}

function initPreview() {
  const sample = randomFamily();
  el.familyPreview.innerHTML =
    `Семья генерируется случайно.<br>` +
    `Пример возможного старта: <strong>${sample.title}</strong><br>` +
    `Деньги: ${money(sample.startMoney)} | Бэкграунд: ${sample.backstory}`;
  el.firstNameInput.value = pick(FIRST_NAMES);
}

function init() {
  bindInputs();
  bindUI();
  initPreview();
  renderAll();
  requestAnimationFrame(gameLoop);
}

init();
