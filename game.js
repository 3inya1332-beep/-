const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const MALE_NAMES = [
  "Артем", "Максим", "Никита", "Илья", "Даниил", "Кирилл", "Тимур", "Егор",
  "Иван", "Алексей", "Сергей", "Павел", "Роман", "Михаил", "Олег", "Глеб",
];

const SURNAME_PARTS = {
  official: ["Смирнов", "Петров", "Иванов", "Морозов", "Крылов", "Титов"],
  powerful: ["Волков", "Соколов", "Орлов", "Громов", "Шахов", "Баринов"],
  mixed: ["Калинин", "Доронин", "Логинов", "Брагин", "Корнев", "Жуков"],
  poor: ["Ершов", "Колесников", "Синицын", "Зуев", "Фролов", "Устинов"],
};

const DISTRICTS = {
  north: {
    name: "Север",
    style: "спальный район",
    rent: [25000, 45000],
    danger: 8,
    jobs: ["courier", "service", "factory"],
    leisure: "тихий район и бюджетные места",
    marker: [110, 75],
  },
  university: {
    name: "Университетский",
    style: "студенческий кластер",
    rent: [30000, 55000],
    danger: 7,
    jobs: ["study", "it-junior", "barista"],
    leisure: "кампусы, библиотеки, коворкинги",
    marker: [310, 75],
  },
  tech: {
    name: "Технопарк",
    style: "офисы и стартапы",
    rent: [40000, 70000],
    danger: 9,
    jobs: ["it-junior", "it-middle", "product"],
    leisure: "нетворкинг и профессиональные события",
    marker: [510, 75],
  },
  west: {
    name: "Запад",
    style: "старый жилой фонд",
    rent: [22000, 42000],
    danger: 12,
    jobs: ["service", "sales", "repair"],
    leisure: "дворовые активности и локальные бары",
    marker: [110, 210],
  },
  center: {
    name: "Центр",
    style: "дорого и престижно",
    rent: [50000, 110000],
    danger: 11,
    jobs: ["sales", "product", "real-estate", "media"],
    leisure: "клубы, рестораны, встречи",
    marker: [310, 210],
  },
  east: {
    name: "Восток",
    style: "плотная коммерция",
    rent: [30000, 60000],
    danger: 14,
    jobs: ["sales", "logistics", "repair"],
    leisure: "рынки, ТЦ, трафик и суета",
    marker: [510, 210],
  },
  industrial: {
    name: "Промзона",
    style: "склады и производство",
    rent: [18000, 38000],
    danger: 18,
    jobs: ["factory", "logistics", "driver"],
    leisure: "минимум развлечений",
    marker: [110, 345],
  },
  suburb: {
    name: "Пригород",
    style: "домики и новостройки",
    rent: [26000, 52000],
    danger: 6,
    jobs: ["driver", "service", "repair"],
    leisure: "спорт и отдых на природе",
    marker: [310, 345],
  },
  elite: {
    name: "Элитный квартал",
    style: "высокий чек и статус",
    rent: [70000, 180000],
    danger: 10,
    jobs: ["real-estate", "media", "product"],
    leisure: "дорогие заведения и закрытые мероприятия",
    marker: [510, 345],
  },
};

const FAMILY_ARCHETYPES = [
  {
    title: "Семья регионального чиновника",
    suffix: "official",
    story: "Публичная фамилия, постоянное давление репутации.",
    startMoney: 190000,
    debt: [0, 120000],
    stats: { education: 63, stress: 34, discipline: 58, charisma: 56, street: 32 },
    legalShield: 16,
    contacts: [{ type: "municipal", level: 52, note: "администрация" }],
  },
  {
    title: "Семья бывшего авторитета (отец умер)",
    suffix: "powerful",
    story: "Остались долги и токсичные связи, вокруг много давления.",
    startMoney: 70000,
    debt: [80000, 320000],
    stats: { education: 40, stress: 56, discipline: 39, charisma: 54, street: 66 },
    legalShield: 4,
    contacts: [{ type: "street", level: 58, note: "люди прошлого" }],
  },
  {
    title: "Семья учителей",
    suffix: "mixed",
    story: "Стабильность и дисциплина, но ограниченные ресурсы.",
    startMoney: 35000,
    debt: [0, 90000],
    stats: { education: 70, stress: 24, discipline: 64, charisma: 45, street: 26 },
    legalShield: 3,
    contacts: [{ type: "education", level: 56, note: "школа" }],
  },
  {
    title: "Семья офицера МВД",
    suffix: "official",
    story: "Есть защита, но шаг в сторону быстро бьет по образу.",
    startMoney: 110000,
    debt: [0, 150000],
    stats: { education: 57, stress: 33, discipline: 61, charisma: 47, street: 34 },
    legalShield: 20,
    contacts: [{ type: "police", level: 64, note: "семейная линия" }],
  },
  {
    title: "Семья на грани бедности",
    suffix: "poor",
    story: "Мало старта, много бытовых проблем и кредитов.",
    startMoney: 12000,
    debt: [50000, 280000],
    stats: { education: 35, stress: 47, discipline: 43, charisma: 38, street: 49 },
    legalShield: 0,
    contacts: [{ type: "neighbor", level: 28, note: "локальные знакомые" }],
  },
  {
    title: "Семья предпринимателей среднего бизнеса",
    suffix: "powerful",
    story: "Деньги есть, но риск обрушения бизнеса всегда рядом.",
    startMoney: 260000,
    debt: [0, 260000],
    stats: { education: 56, stress: 38, discipline: 53, charisma: 62, street: 41 },
    legalShield: 10,
    contacts: [{ type: "business", level: 60, note: "партнеры" }],
  },
  {
    title: "Семья айтишников",
    suffix: "mixed",
    story: "Хорошая образовательная база и ранний доступ к технике.",
    startMoney: 130000,
    debt: [0, 100000],
    stats: { education: 74, stress: 28, discipline: 57, charisma: 44, street: 24 },
    legalShield: 5,
    contacts: [{ type: "it", level: 62, note: "сообщество" }],
  },
];

const EXTRA_FAMILY_STORIES = [
  "семья таксистов", "семья дальнобойщика", "семья госслужащих", "семья владельца автомойки",
  "семья после развода", "семья ипотечников", "семья строителей", "семья владельца кафе",
  "семья следователя", "семья врача и продавца", "семья из военного гарнизона",
  "семья инженеров", "семья с долгами по кредитам", "семья владельца хостела",
  "семья работника аэропорта", "семья логистической компании", "семья риелторов",
  "семья с мощной бабушкой-опорой", "семья с конфликтным бытом", "семья соцработника",
  "семья собственника складов", "семья автомехаников", "семья пожарного",
];

const JOBS = {
  study: {
    key: "study",
    title: "Учеба + подработка",
    districtFit: ["university", "north"],
    salary: [28000, 60000],
    stress: 1,
    education: 3,
    req: { education: 20, reputation: 20 },
    risk: 1,
  },
  courier: {
    key: "courier",
    title: "Курьер",
    districtFit: ["north", "west", "east"],
    salary: [45000, 90000],
    stress: 2,
    education: 0,
    req: { discipline: 25, energy: 25 },
    risk: 2,
  },
  barista: {
    key: "barista",
    title: "Бариста / сервис",
    districtFit: ["center", "university"],
    salary: [45000, 85000],
    stress: 2,
    education: 1,
    req: { charisma: 35, reputation: 25 },
    risk: 1,
  },
  service: {
    key: "service",
    title: "Сервисные услуги",
    districtFit: ["west", "suburb", "north"],
    salary: [55000, 120000],
    stress: 2,
    education: 0,
    req: { discipline: 30, charisma: 25 },
    risk: 2,
  },
  factory: {
    key: "factory",
    title: "Рабочий на производстве",
    districtFit: ["industrial", "north"],
    salary: [65000, 130000],
    stress: 3,
    education: 0,
    req: { health: 40, discipline: 30 },
    risk: 3,
  },
  logistics: {
    key: "logistics",
    title: "Логистика / диспетчер",
    districtFit: ["industrial", "east", "center"],
    salary: [70000, 150000],
    stress: 3,
    education: 1,
    req: { education: 35, discipline: 35 },
    risk: 2,
  },
  repair: {
    key: "repair",
    title: "Ремонт техники / авто",
    districtFit: ["east", "west", "suburb"],
    salary: [70000, 180000],
    stress: 3,
    education: 1,
    req: { discipline: 40, street: 25 },
    risk: 2,
  },
  driver: {
    key: "driver",
    title: "Водитель / развоз",
    districtFit: ["suburb", "industrial"],
    salary: [65000, 160000],
    stress: 3,
    education: 0,
    req: { discipline: 35, energy: 35 },
    risk: 3,
  },
  sales: {
    key: "sales",
    title: "Продажи",
    districtFit: ["center", "east", "west"],
    salary: [80000, 220000],
    stress: 3,
    education: 1,
    req: { charisma: 45, reputation: 35 },
    risk: 3,
  },
  media: {
    key: "media",
    title: "Контент / медиа",
    districtFit: ["center", "elite"],
    salary: [30000, 260000],
    stress: 3,
    education: 1,
    req: { charisma: 45, discipline: 35 },
    risk: 3,
  },
  "real-estate": {
    key: "real-estate",
    title: "Риелтор",
    districtFit: ["center", "elite"],
    salary: [90000, 320000],
    stress: 4,
    education: 1,
    req: { charisma: 55, reputation: 45 },
    risk: 3,
  },
  "it-junior": {
    key: "it-junior",
    title: "Junior IT",
    districtFit: ["tech", "university"],
    salary: [85000, 210000],
    stress: 2,
    education: 3,
    req: { education: 55, discipline: 40 },
    risk: 1,
  },
  "it-middle": {
    key: "it-middle",
    title: "Middle IT",
    districtFit: ["tech"],
    salary: [170000, 420000],
    stress: 3,
    education: 2,
    req: { education: 70, discipline: 55, reputation: 45 },
    risk: 1,
  },
  product: {
    key: "product",
    title: "Продукт / менеджмент",
    districtFit: ["tech", "center", "elite"],
    salary: [140000, 360000],
    stress: 4,
    education: 2,
    req: { education: 60, charisma: 50, discipline: 45 },
    risk: 2,
  },
};

const HOUSING_MARKET = [
  { id: "room-north", title: "Комната, Север", district: "north", rent: 22000, price: 3300000, quality: 38 },
  { id: "studio-west", title: "Студия, Запад", district: "west", rent: 34000, price: 5200000, quality: 48 },
  { id: "flat-east", title: "1к, Восток", district: "east", rent: 42000, price: 6900000, quality: 56 },
  { id: "flat-university", title: "1к, Университетский", district: "university", rent: 45000, price: 7600000, quality: 62 },
  { id: "flat-center", title: "1к, Центр", district: "center", rent: 70000, price: 11800000, quality: 72 },
  { id: "house-suburb", title: "Дом, Пригород", district: "suburb", rent: 68000, price: 10600000, quality: 74 },
  { id: "flat-elite", title: "Апартаменты, Элитный", district: "elite", rent: 130000, price: 24500000, quality: 88 },
];

const MAIN_STORY_CHAIN = [
  {
    stage: 1,
    text: "Ты входишь во взрослую жизнь без права на ошибку. Нужен стабильный доход минимум 2 недели подряд.",
    check: (p) => p.stabilityWeeks >= 2,
    effect: (p) => { p.reputation = clamp(p.reputation + 2, 0, 100); },
  },
  {
    stage: 2,
    text: "К тебе присматриваются работодатели: нужна дисциплина и отсутствие жестких долговых просрочек.",
    check: (p) => p.discipline >= 45 && p.debtLateWeeks < 4,
    effect: (p) => { p.network = clamp(p.network + 3, 0, 100); },
  },
  {
    stage: 3,
    text: "Чтобы двигаться выше, нужно выйти на репутацию 45+ и иметь хотя бы один надежный контакт.",
    check: (p) => p.reputation >= 45 && p.contacts.some((x) => x.level >= 45),
    effect: (p) => { p.salaryBoost += 0.04; },
  },
  {
    stage: 4,
    text: "Порог взрослой ответственности: жилье должно быть не ниже качества 50 и без критических срывов по здоровью.",
    check: (p) => p.housing.quality >= 50 && p.health >= 35,
    effect: (p) => { p.stress = clamp(p.stress - 3, 0, 100); },
  },
  {
    stage: 5,
    text: "Выбор пути: либо карьерный рост (образование 65+), либо сильная предпринимательская репутация (55+).",
    check: (p) => p.education >= 65 || p.reputation >= 55,
    effect: (p) => { p.charisma = clamp(p.charisma + 2, 0, 100); },
  },
  {
    stage: 6,
    text: "Высокий уровень: удерживай риск ниже 35 на протяжении 8 недель.",
    check: (p) => p.lowRiskStreak >= 8,
    effect: (p) => { p.legalShield = clamp(p.legalShield + 4, 0, 100); },
  },
  {
    stage: 7,
    text: "Стабильная взрослая жизнь: активы + деньги должны превышать 12 млн.",
    check: (p) => p.money + p.homeEquity >= 12000000,
    effect: (p) => { p.storyCompleted = true; },
  },
];

const PREHISTORY_EVENTS = [
  { text: "В детстве приходилось рано помогать семье делом.", mods: { discipline: 3, stress: 2 } },
  { text: "Были сильные школьные успехи.", mods: { education: 4, reputation: 1 } },
  { text: "Частые конфликты дома.", mods: { stress: 4, mood: -3 } },
  { text: "Спорт дал хорошую выносливость.", mods: { health: 5, discipline: 2 } },
  { text: "Подростковая подработка укрепила самостоятельность.", mods: { money: 12000, discipline: 2 } },
  { text: "Болезнь в семье оставила эмоциональный след.", mods: { stress: 3, mood: -2 } },
  { text: "Переезд в новый район развил адаптацию.", mods: { charisma: 2, network: 2 } },
];

const LEGAL_CHARGES = [
  { article: "Ст. 159 УК РФ (мошенничество)", min: 24, max: 84, confiscationChance: 78 },
  { article: "Ст. 187 УК РФ (неправомерный оборот средств платежей)", min: 18, max: 72, confiscationChance: 62 },
  { article: "Ст. 174.1 УК РФ (легализация преступных доходов)", min: 20, max: 96, confiscationChance: 82 },
  { article: "Ст. 272 УК РФ (неправомерный доступ к информации)", min: 12, max: 48, confiscationChance: 40 },
];

const state = {
  initialized: false,
  player: null,
  history: [],
  activeCase: null,
  inPrison: false,
  prisonWeeksLeft: 0,
  selectedDistrict: null,
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
  cityMap: document.getElementById("cityMap"),
  playerMarker: document.getElementById("playerMarker"),
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
};

function formatMoney(num) {
  return `${Math.round(num).toLocaleString("ru-RU")} ₽`;
}

function addHistory(text, type = "info") {
  const p = state.player;
  const stamp = `${p.ageYears} лет, нед ${p.weekOfYear}`;
  state.history.unshift({ stamp, text, type });
  renderTimeline();
}

function addHistoryAt(stamp, text, type = "info") {
  state.history.unshift({ stamp, text, type });
}

function generateFamilies() {
  const full = [...FAMILY_ARCHETYPES];
  EXTRA_FAMILY_STORIES.forEach((story, i) => {
    const base = pick(FAMILY_ARCHETYPES);
    full.push({
      ...base,
      title: story[0].toUpperCase() + story.slice(1),
      story: `Вариант старта: ${story}. Базовая модель — ${base.title.toLowerCase()}.`,
      startMoney: Math.max(7000, base.startMoney + rand(-30000, 50000)),
      debt: [Math.max(0, base.debt[0] + rand(-20000, 20000)), base.debt[1] + rand(0, 80000)],
      stats: {
        education: clamp(base.stats.education + rand(-10, 10), 20, 90),
        stress: clamp(base.stats.stress + rand(-8, 12), 12, 80),
        discipline: clamp(base.stats.discipline + rand(-10, 8), 20, 85),
        charisma: clamp(base.stats.charisma + rand(-8, 8), 20, 90),
        street: clamp(base.stats.street + rand(-8, 8), 10, 85),
      },
      legalShield: clamp(base.legalShield + rand(-6, 6), 0, 30),
      key: `generated-family-${i}`,
    });
  });
  return full;
}

const ALL_FAMILIES = generateFamilies();

function generateSurname(family) {
  return pick(SURNAME_PARTS[family.suffix] || SURNAME_PARTS.mixed);
}

function getContactLevel(type) {
  const c = state.player.contacts.find((x) => x.type === type);
  return c ? c.level : 0;
}

function upsertContact(type, delta, note) {
  const target = state.player.contacts.find((x) => x.type === type);
  if (target) {
    target.level = clamp(target.level + delta, 0, 100);
    if (note) target.note = note;
    return;
  }
  state.player.contacts.push({ type, level: clamp(delta, 0, 100), note: note || "" });
}

function initSetup() {
  el.firstNameInput.value = pick(MALE_NAMES);
  el.familyPreview.textContent = "Семья и район старта будут сгенерированы случайно.";
  el.startBtn.addEventListener("click", startGame);
}

function applyPrehistory() {
  const p = state.player;
  for (let age = 0; age < 16; age += 1) {
    if (rand(1, 100) <= 36) {
      const ev = pick(PREHISTORY_EVENTS);
      Object.entries(ev.mods).forEach(([k, v]) => {
        if (typeof p[k] === "number") {
          p[k] = clamp(p[k] + v, k === "money" ? -999999 : 0, 100000000);
        }
      });
      addHistoryAt(`${age} лет`, ev.text, vToType(ev.mods));
    }
  }
}

function vToType(mods) {
  const sum = Object.values(mods).reduce((acc, v) => acc + v, 0);
  if (sum > 0) return "good";
  if (sum < 0) return "bad";
  return "info";
}

function startGame() {
  const family = pick(ALL_FAMILIES);
  const firstName = (el.firstNameInput.value.trim() || pick(MALE_NAMES)).slice(0, 24);
  const surname = generateSurname(family);
  const districtKey = pick(Object.keys(DISTRICTS));
  const housing = pick(HOUSING_MARKET.filter((h) => h.district === districtKey));
  const hard = el.difficultySelect.value === "hard";

  state.player = {
    firstName,
    surname,
    difficulty: hard ? "hard" : "normal",
    ageYears: 16,
    weekOfYear: 1,
    totalWeeks: 0,
    familyTitle: family.title,
    familyStory: family.story,
    district: districtKey,
    selectedDistrict: districtKey,
    money: family.startMoney,
    debt: rand(family.debt[0], family.debt[1]),
    debtLateWeeks: 0,
    health: clamp(76 + rand(-8, 8), 20, 100),
    energy: clamp(74 + rand(-8, 10), 20, 100),
    mood: clamp(62 + rand(-10, 10), 20, 100),
    stress: family.stats.stress + (hard ? 6 : 0),
    education: family.stats.education,
    reputation: clamp(45 + rand(-8, 8), 10, 90),
    network: clamp(34 + rand(-6, 8), 0, 100),
    riskHeat: clamp(8 + rand(-2, 8), 0, 100),
    legalShield: family.legalShield,
    charisma: family.stats.charisma,
    discipline: family.stats.discipline,
    street: family.stats.street,
    contacts: family.contacts.map((c) => ({ ...c })),
    currentJobKey: null,
    salaryBoost: 0,
    stabilityWeeks: 0,
    lowRiskStreak: 0,
    homeEquity: 0,
    housing: {
      mode: "rent",
      itemId: housing.id,
      district: housing.district,
      quality: housing.quality,
      weeklyRent: Math.round(housing.rent / 4.33),
      mortgageWeekly: 0,
      mortgageLeft: 0,
      mortgageTotal: 0,
    },
    storyStage: 1,
    storyCompleted: false,
    isAlive: true,
    prisonRecord: 0,
  };

  state.history = [];
  state.activeCase = null;
  state.inPrison = false;
  state.prisonWeeksLeft = 0;
  state.selectedDistrict = districtKey;

  applyPrehistory();
  addHistory(`Случайная семья: ${family.title}.`, "info");
  addHistory(`Стартовый район: ${DISTRICTS[districtKey].name}.`, "info");
  addHistory("Ты не выбирал стартовые условия — придется адаптироваться.", "bad");

  if (state.player.debt > 0) {
    addHistory(`Стартовый долг: ${formatMoney(state.player.debt)}.`, "bad");
  }

  populateHousingMarket();
  initMap();
  bindGameActions();
  el.setupScreen.classList.add("hidden");
  el.gameScreen.classList.remove("hidden");
  renderAll();
}

function bindGameActions() {
  if (state.initialized) return;
  state.initialized = true;
  el.travelBtn.addEventListener("click", travelToDistrict);
  el.nextWeekBtn.addEventListener("click", nextWeek);
  el.rentBtn.addEventListener("click", rentHousing);
  el.mortgageBtn.addEventListener("click", mortgageHousing);
}

function initMap() {
  const rects = Array.from(el.cityMap.querySelectorAll("rect[data-district]"));
  rects.forEach((rect) => {
    rect.addEventListener("click", () => {
      state.selectedDistrict = rect.dataset.district;
      updateMapStyles();
      renderDistrictInfo();
      renderActions();
    });
  });
  updateMapStyles();
  renderDistrictInfo();
  moveMarkerTo(state.player.district);
}

function updateMapStyles() {
  const rects = Array.from(el.cityMap.querySelectorAll("rect[data-district]"));
  rects.forEach((rect) => {
    rect.classList.remove("selected", "current");
    if (rect.dataset.district === state.selectedDistrict) rect.classList.add("selected");
    if (rect.dataset.district === state.player.district) rect.classList.add("current");
  });
}

function moveMarkerTo(districtKey) {
  const district = DISTRICTS[districtKey];
  if (!district) return;
  const [x, y] = district.marker;
  el.playerMarker.style.left = `${(x / 620) * 100}%`;
  el.playerMarker.style.top = `${(y / 420) * 100}%`;
}

function renderDistrictInfo() {
  const d = DISTRICTS[state.selectedDistrict];
  if (!d) return;
  el.districtInfo.innerHTML = `
    <strong>${d.name}</strong> — ${d.style}<br/>
    Риски района: ${d.danger}/100 • Аренда: ${formatMoney(d.rent[0])} - ${formatMoney(d.rent[1])}<br/>
    ${d.leisure}
  `;
}

function travelToDistrict() {
  const p = state.player;
  if (state.inPrison || !p.isAlive) return;
  if (!state.selectedDistrict || state.selectedDistrict === p.district) return;
  const baseCost = rand(300, 1600);
  const longTripPenalty = DISTRICTS[state.selectedDistrict].danger > 14 ? 1.3 : 1;
  const cost = Math.round(baseCost * longTripPenalty);
  if (p.money < cost) {
    addHistory("Не хватило денег на перемещение.", "bad");
    return;
  }
  p.money -= cost;
  p.energy = clamp(p.energy - rand(3, 8), 0, 100);
  p.district = state.selectedDistrict;
  moveMarkerTo(p.district);
  updateMapStyles();
  renderDistrictInfo();
  renderActions();
  addHistory(`Перемещение в район: ${DISTRICTS[p.district].name}. Потрачено ${formatMoney(cost)}.`, "info");
  renderAll();
}

function availableJobsForDistrict(key) {
  const district = DISTRICTS[key];
  if (!district) return [];
  return district.jobs
    .map((jobKey) => JOBS[jobKey])
    .filter(Boolean);
}

function checkReq(job, p) {
  const req = job.req || {};
  const pairs = Object.entries(req);
  return pairs.every(([k, v]) => (p[k] || 0) >= v);
}

function buildActionCards() {
  const p = state.player;
  const jobs = availableJobsForDistrict(state.selectedDistrict);
  const cards = [];

  jobs.forEach((job) => {
    const pass = checkReq(job, p);
    const reqLine = Object.entries(job.req || {})
      .map(([k, v]) => `${k} ${v}+`)
      .join(", ");
    cards.push({
      key: `job-${job.key}`,
      title: job.title,
      meta: `${pass ? "Доступно" : "Недоступно"} • Доход/нед: ${formatMoney(job.salary[0] / 4.33)} - ${formatMoney(job.salary[1] / 4.33)} • Требования: ${reqLine}`,
      disabled: !pass,
      action: () => {
        p.currentJobKey = job.key;
        addHistory(`Ты закрепился в сфере: ${job.title}.`, "good");
        renderAll();
      },
    });
  });

  cards.push({
    key: "act-study",
    title: "Самообучение (вечером)",
    meta: "Цена: 2 000 - 8 000 ₽ • +образование • -энергия",
    disabled: false,
    action: () => {
      const cost = rand(2000, 8000);
      if (p.money < cost) {
        addHistory("Не хватило денег на обучение.", "bad");
        return;
      }
      p.money -= cost;
      p.education = clamp(p.education + rand(1, 3), 0, 100);
      p.energy = clamp(p.energy - rand(3, 7), 0, 100);
      p.discipline = clamp(p.discipline + 1, 0, 100);
      addHistory(`Самообучение завершено. Минус ${formatMoney(cost)}.`, "good");
      renderAll();
    },
  });

  cards.push({
    key: "act-social",
    title: "Социальный выход",
    meta: "Цена: 1 000 - 15 000 ₽ • шанс на контакт • влияние на настроение/репутацию",
    disabled: false,
    action: () => {
      const cost = rand(1000, 15000);
      if (p.money < cost) {
        addHistory("Не хватило денег на выход в город.", "bad");
        return;
      }
      p.money -= cost;
      p.mood = clamp(p.mood + rand(-2, 6), 0, 100);
      p.reputation = clamp(p.reputation + rand(-1, 3), 0, 100);
      p.network = clamp(p.network + rand(0, 3), 0, 100);
      if (rand(1, 100) <= 20) {
        const contactType = pick(["business", "lawyer", "it", "police", "street"]);
        upsertContact(contactType, rand(3, 8), "новое знакомство");
        addHistory("Новый контакт в окружении может пригодиться позже.", "good");
      } else {
        addHistory("Обычный выход в город без особых последствий.", "info");
      }
      renderAll();
    },
  });

  return cards;
}

function renderActions() {
  const cards = buildActionCards();
  el.actionsList.innerHTML = "";
  cards.forEach((card) => {
    const wrap = document.createElement("div");
    wrap.className = "action-card";
    wrap.innerHTML = `
      <h5>${card.title}</h5>
      <div class="meta">${card.meta}</div>
    `;
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = card.disabled ? "Недоступно" : "Сделать";
    btn.disabled = card.disabled;
    btn.addEventListener("click", card.action);
    wrap.appendChild(btn);
    el.actionsList.appendChild(wrap);
  });
}

function populateHousingMarket() {
  el.housingMarketSelect.innerHTML = "";
  HOUSING_MARKET.forEach((h) => {
    const o = document.createElement("option");
    o.value = h.id;
    o.textContent = `${h.title} — аренда ${formatMoney(h.rent)} / цена ${formatMoney(h.price)}`;
    el.housingMarketSelect.appendChild(o);
  });
  renderHousingInfo();
}

function selectedHousingItem() {
  return HOUSING_MARKET.find((x) => x.id === el.housingMarketSelect.value) || HOUSING_MARKET[0];
}

function rentHousing() {
  const p = state.player;
  const h = selectedHousingItem();
  const deposit = h.rent;
  if (p.money < deposit) {
    addHistory("Не хватает денег на депозит за аренду.", "bad");
    return;
  }
  p.money -= deposit;
  p.housing = {
    mode: "rent",
    itemId: h.id,
    district: h.district,
    quality: h.quality,
    weeklyRent: Math.round(h.rent / 4.33),
    mortgageWeekly: 0,
    mortgageLeft: 0,
    mortgageTotal: 0,
  };
  addHistory(`Арендовано жилье: ${h.title}. Депозит ${formatMoney(deposit)}.`, "good");
  renderAll();
}

function mortgageHousing() {
  const p = state.player;
  const h = selectedHousingItem();
  const downPayment = Math.round(h.price * 0.2);
  if (p.money < downPayment) {
    addHistory("Недостаточно денег на первоначальный взнос 20%.", "bad");
    return;
  }
  const baseRate = p.difficulty === "hard" ? 0.19 : 0.15;
  const periodWeeks = 20 * 52;
  const total = Math.round(h.price * (1 + baseRate * 0.75));
  const weekly = Math.round((total - downPayment) / periodWeeks);
  p.money -= downPayment;
  p.housing = {
    mode: "mortgage",
    itemId: h.id,
    district: h.district,
    quality: h.quality,
    weeklyRent: 0,
    mortgageWeekly: weekly,
    mortgageLeft: total - downPayment,
    mortgageTotal: total,
  };
  p.homeEquity += downPayment;
  addHistory(`Оформлена ипотека на ${h.title}. Взнос ${formatMoney(downPayment)}.`, "info");
  renderAll();
}

function getWeeklyBaseCost() {
  const p = state.player;
  const hardMul = p.difficulty === "hard" ? 1.25 : 1;
  let cost = rand(9000, 18000) * hardMul;
  if (p.ageYears >= 20) cost += rand(1000, 5000);
  return Math.round(cost);
}

function runJobWeek() {
  const p = state.player;
  if (!p.currentJobKey) {
    p.stabilityWeeks = 0;
    addHistory("Неделя прошла без стабильной работы.", "bad");
    return;
  }
  const job = JOBS[p.currentJobKey];
  if (!job) {
    p.currentJobKey = null;
    return;
  }
  if (!checkReq(job, p)) {
    addHistory(`Ты не удержал позицию "${job.title}" из-за провала требований.`, "bad");
    p.currentJobKey = null;
    p.stabilityWeeks = 0;
    return;
  }
  const districtPenalty = job.districtFit.includes(p.district) ? 1 : 0.86;
  const gross = rand(Math.round(job.salary[0] / 4.33), Math.round(job.salary[1] / 4.33));
  const finalIncome = Math.round(gross * districtPenalty * (1 + p.salaryBoost));
  const taxAndCosts = Math.round(finalIncome * rand(8, 20) / 100);
  const net = finalIncome - taxAndCosts;
  p.money += net;
  p.education = clamp(p.education + job.education + rand(-1, 1), 0, 100);
  p.stress = clamp(p.stress + job.stress + rand(-1, 2), 0, 100);
  p.energy = clamp(p.energy - rand(4, 9), 0, 100);
  p.reputation = clamp(p.reputation + rand(-1, 2), 0, 100);
  p.stabilityWeeks += 1;
  p.riskHeat = clamp(p.riskHeat + job.risk + DISTRICTS[p.district].danger * 0.03 - p.discipline * 0.025, 0, 100);
  addHistory(`Работа "${job.title}": чистый доход ${formatMoney(net)}.`, net > 0 ? "good" : "bad");
}

function payWeeklyBills() {
  const p = state.player;
  const baseCost = getWeeklyBaseCost();
  p.money -= baseCost;
  let homeCost = 0;
  if (p.housing.mode === "rent") {
    homeCost = p.housing.weeklyRent;
    p.money -= homeCost;
  } else if (p.housing.mode === "mortgage") {
    homeCost = p.housing.mortgageWeekly;
    p.money -= homeCost;
    p.housing.mortgageLeft = Math.max(0, p.housing.mortgageLeft - p.housing.mortgageWeekly);
    p.homeEquity += Math.round(p.housing.mortgageWeekly * 0.65);
    if (p.housing.mortgageLeft <= 0) {
      p.housing.mode = "owned";
      p.housing.mortgageWeekly = 0;
      addHistory("Ипотека полностью закрыта. Жилье теперь твое.", "good");
    }
  }
  addHistory(`Бытовые расходы недели: ${formatMoney(baseCost + homeCost)}.`, "info");
}

function processDebt() {
  const p = state.player;
  if (p.debt <= 0) return;
  const minPay = Math.max(4000, Math.round(p.debt * 0.01));
  if (p.money >= minPay) {
    p.money -= minPay;
    p.debt = Math.max(0, p.debt - minPay);
    if (p.debtLateWeeks > 0) p.debtLateWeeks -= 1;
    addHistory(`Платеж по долгу: ${formatMoney(minPay)}. Остаток ${formatMoney(p.debt)}.`, "info");
    return;
  }
  p.debtLateWeeks += 1;
  p.debt = Math.round(p.debt * 1.015);
  p.reputation = clamp(p.reputation - 2, 0, 100);
  p.stress = clamp(p.stress + 3, 0, 100);
  addHistory("Просрочка по долгам: растут проценты и падает репутация.", "bad");
}

function randomLifeEvent() {
  const p = state.player;
  const roll = rand(1, 100);
  if (roll <= 9) {
    const cost = rand(5000, 60000);
    p.money -= cost;
    p.stress = clamp(p.stress + 3, 0, 100);
    addHistory(`Незапланированная трата: ${formatMoney(cost)}.`, "bad");
  } else if (roll <= 16) {
    const bonus = rand(5000, 50000);
    p.money += bonus;
    addHistory(`Разовый бонус: ${formatMoney(bonus)}.`, "good");
  } else if (roll <= 22) {
    p.health = clamp(p.health - rand(3, 10), 0, 100);
    p.stress = clamp(p.stress + 2, 0, 100);
    addHistory("Проблемы со здоровьем: неделя вышла тяжелой.", "bad");
  }
}

function maybeOpenCase() {
  const p = state.player;
  const danger = DISTRICTS[p.district].danger;
  const chance = clamp(Math.round(p.riskHeat * 0.28 + danger * 0.6 - p.legalShield * 0.2), 1, 85);
  if (state.activeCase || rand(1, 100) > chance * 0.12) return;
  const charge = pick(LEGAL_CHARGES);
  state.activeCase = {
    article: charge.article,
    stage: "investigation",
    severity: rand(20, 90),
    monthsMin: charge.min,
    monthsMax: charge.max,
    confiscationChance: charge.confiscationChance,
  };
  addHistory(`Открыта проверка: ${charge.article}.`, "bad");
}

function processCase() {
  if (!state.activeCase) return;
  const p = state.player;
  const c = state.activeCase;
  const defense = p.legalShield + getContactLevel("lawyer") * 0.7 + getContactLevel("police") * 0.35;

  if (c.stage === "investigation") {
    const roll = rand(1, 100) + c.severity * 0.32 - defense * 0.45;
    if (roll < 28) {
      addHistory("Проверка закрыта без суда.", "good");
      state.activeCase = null;
      p.riskHeat = clamp(p.riskHeat - 8, 0, 100);
      return;
    }
    c.stage = "court";
    addHistory("Материалы переданы в суд.", "bad");
    return;
  }

  const sentenceRoll = rand(1, 100) + c.severity * 0.45 - defense * 0.5;
  if (sentenceRoll < 38) {
    const fine = rand(80000, 700000);
    p.money -= fine;
    p.reputation = clamp(p.reputation - 8, 0, 100);
    addHistory(`Условный срок и штраф ${formatMoney(fine)}.`, "bad");
    state.activeCase = null;
    return;
  }

  const months = rand(c.monthsMin, c.monthsMax);
  state.inPrison = true;
  state.prisonWeeksLeft = months * 4;
  p.prisonRecord += 1;
  p.reputation = clamp(p.reputation - rand(12, 24), 0, 100);
  if (rand(1, 100) <= c.confiscationChance) {
    p.money = Math.max(0, Math.round(p.money * rand(0, 30) / 100));
    p.homeEquity = Math.round(p.homeEquity * rand(20, 60) / 100);
    addHistory("Часть активов конфискована.", "bad");
  }
  addHistory(`Назначен срок: ${Math.floor(months / 12)} лет ${months % 12} мес (${c.article}).`, "bad");
  state.activeCase = null;
}

function prisonTick() {
  const p = state.player;
  state.prisonWeeksLeft -= 1;
  p.health = clamp(p.health - rand(0, 2), 0, 100);
  p.energy = clamp(p.energy - rand(0, 1), 0, 100);
  p.stress = clamp(p.stress + rand(1, 3), 0, 100);
  p.money -= rand(1500, 4500);

  if (state.prisonWeeksLeft <= 0) {
    state.inPrison = false;
    p.riskHeat = clamp(p.riskHeat - 18, 0, 100);
    p.discipline = clamp(p.discipline + rand(1, 6), 0, 100);
    p.street = clamp(p.street + rand(2, 7), 0, 100);
    addHistory("Освобождение после срока. Жизнь придется собирать заново.", "info");
  }
}

function processStory() {
  const p = state.player;
  if (p.storyCompleted) return;
  const current = MAIN_STORY_CHAIN.find((x) => x.stage === p.storyStage);
  if (!current) return;
  if (current.check(p)) {
    current.effect(p);
    addHistory(`Сюжетный прогресс ${p.storyStage}/7: ${current.text}`, "good");
    p.storyStage += 1;
  }
}

function maybeDeath() {
  const p = state.player;
  let chance = 0.08;
  if (p.health < 20) chance += 2.4;
  if (p.stress > 86) chance += 1.6;
  if (p.riskHeat > 80) chance += 1.8;
  if (state.inPrison) chance += 0.8;
  if (rand(1, 1000) <= Math.round(chance * 10)) {
    p.isAlive = false;
    addHistory("Критический жизненный исход. Начни новую жизнь.", "bad");
  }
}

function nextWeek() {
  const p = state.player;
  if (!p || !p.isAlive) {
    resetToMenu();
    return;
  }
  p.totalWeeks += 1;
  p.weekOfYear += 1;
  if (p.weekOfYear > 52) {
    p.weekOfYear = 1;
    p.ageYears += 1;
    addHistory(`День рождения: ${p.ageYears} лет.`, "info");
  }

  if (state.inPrison) {
    prisonTick();
    payWeeklyBills();
    processDebt();
    maybeDeath();
    renderAll();
    return;
  }

  runJobWeek();
  payWeeklyBills();
  processDebt();
  randomLifeEvent();
  maybeOpenCase();
  processCase();
  processStory();

  p.energy = clamp(p.energy + rand(2, 6), 0, 100);
  p.mood = clamp(p.mood + rand(-2, 3) - Math.round(p.stress * 0.02), 0, 100);
  p.health = clamp(p.health + rand(-1, 2), 0, 100);
  if (p.riskHeat < 35) p.lowRiskStreak += 1;
  else p.lowRiskStreak = 0;

  if (p.money < 0) {
    p.debt += Math.abs(p.money);
    p.money = 0;
  }

  maybeDeath();
  renderAll();
}

function resetToMenu() {
  el.gameScreen.classList.add("hidden");
  el.setupScreen.classList.remove("hidden");
}

function renderProfile() {
  const p = state.player;
  const status = p.isAlive ? (state.inPrison ? `Лишение свободы (${state.prisonWeeksLeft} нед)` : "Свободен") : "Погиб";
  el.profileBlock.innerHTML = `
    <div><strong>${p.firstName} ${p.surname}</strong></div>
    <div>Возраст: ${p.ageYears}</div>
    <div>Семья: ${p.familyTitle}</div>
    <div>Текущий район: ${DISTRICTS[p.district].name}</div>
    <div>Статус: ${status}</div>
    <div>Сюжет: этап ${Math.min(p.storyStage, 7)}/7 ${p.storyCompleted ? "(завершен)" : ""}</div>
  `;
}

function renderStats() {
  const p = state.player;
  const rows = [
    ["Деньги", formatMoney(p.money)],
    ["Долг", formatMoney(p.debt)],
    ["Здоровье", p.health],
    ["Энергия", p.energy],
    ["Настроение", p.mood],
    ["Стресс", p.stress],
    ["Образование", p.education],
    ["Репутация", p.reputation],
    ["Связи", p.network],
    ["Риск", Math.round(p.riskHeat)],
    ["Юр. защита", p.legalShield],
    ["Дисциплина", p.discipline],
    ["Харизма", p.charisma],
    ["Улица", p.street],
  ];
  el.statsBlock.innerHTML = rows
    .map(([k, v]) => `<div class="stat-row"><span>${k}</span><strong>${v}</strong></div>`)
    .join("");
}

function renderJobBlock() {
  const p = state.player;
  const job = p.currentJobKey ? JOBS[p.currentJobKey] : null;
  el.jobBlock.innerHTML = job
    ? `<strong>${job.title}</strong><br/>Недельный диапазон: ${formatMoney(job.salary[0] / 4.33)} - ${formatMoney(job.salary[1] / 4.33)}`
    : "Пока нет закрепленной работы.";
}

function renderHousingBlock() {
  const p = state.player;
  const h = HOUSING_MARKET.find((x) => x.id === p.housing.itemId);
  if (!h) {
    el.housingBlock.textContent = "Жилье не определено.";
    return;
  }
  let extra = "";
  if (p.housing.mode === "rent") {
    extra = `Аренда/нед: ${formatMoney(p.housing.weeklyRent)}`;
  } else if (p.housing.mode === "mortgage") {
    extra = `Платеж/нед: ${formatMoney(p.housing.mortgageWeekly)} • Остаток: ${formatMoney(p.housing.mortgageLeft)}`;
  } else {
    extra = "Собственность";
  }
  el.housingBlock.innerHTML = `
    <strong>${h.title}</strong><br/>
    Район: ${DISTRICTS[h.district].name} • Качество: ${p.housing.quality}<br/>
    ${extra}
  `;
}

function renderContacts() {
  const sorted = [...state.player.contacts].sort((a, b) => b.level - a.level);
  el.contactsBlock.innerHTML = sorted.length
    ? sorted.map((c) => `<div>${c.type}: <strong>${c.level}</strong> <span class="small">${c.note}</span></div>`).join("")
    : "<div class='small'>Связи пока слабые.</div>";
}

function renderHousingInfo() {
  const h = selectedHousingItem();
  const mortgageFirst = Math.round(h.price * 0.2);
  el.housingInfo.textContent = `${h.title}: аренда ${formatMoney(h.rent)}, цена ${formatMoney(h.price)}, первый взнос ${formatMoney(mortgageFirst)}.`;
}

function renderCasePanel() {
  if (!state.activeCase) {
    el.casePanel.classList.add("hidden");
    return;
  }
  const c = state.activeCase;
  el.casePanel.classList.remove("hidden");
  el.casePanel.innerHTML = `<strong>Активное дело:</strong> ${c.article}<br/>Стадия: ${c.stage}<br/>Тяжесть: ${Math.round(c.severity)}`;
}

function renderTime() {
  const p = state.player;
  el.timeBlock.innerHTML = `
    Неделя: ${p.weekOfYear}/52 • Возраст: ${p.ageYears}<br/>
    Старт случайный: ${p.familyStory}<br/>
    Недель стабильности: ${p.stabilityWeeks} • Низкий риск подряд: ${p.lowRiskStreak}
  `;
}

function renderTimeline() {
  el.timeline.innerHTML = state.history
    .slice(0, 180)
    .map((x) => `<div class="event ${x.type || "info"}"><span class="time">${x.stamp}</span> ${x.text}</div>`)
    .join("");
}

function renderAll() {
  if (!state.player) return;
  renderProfile();
  renderStats();
  renderJobBlock();
  renderHousingBlock();
  renderContacts();
  renderDistrictInfo();
  renderActions();
  renderHousingInfo();
  renderCasePanel();
  renderTime();
  updateMapStyles();
  moveMarkerTo(state.player.district);
}

initSetup();
