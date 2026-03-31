const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const CITIES = [
  "Москва", "Санкт-Петербург", "Казань", "Екатеринбург", "Новосибирск",
  "Краснодар", "Ростов-на-Дону", "Нижний Новгород", "Самара", "Челябинск",
  "Тюмень", "Уфа", "Пермь", "Воронеж",
];

const MALE_NAMES = [
  "Артем", "Максим", "Никита", "Илья", "Даниил", "Кирилл", "Тимур", "Егор", "Иван", "Алексей",
  "Сергей", "Павел", "Роман", "Михаил", "Олег", "Глеб", "Руслан", "Денис", "Владислав", "Константин",
];

const FAMILY_NAME_PARTS = {
  powerful: ["Волков", "Соколов", "Орлов", "Громов", "Лебедев", "Козлов", "Шахов", "Разумов", "Баринов"],
  official: ["Смирнов", "Петров", "Иванов", "Кузнецов", "Морозов", "Белов", "Крылов", "Титов"],
  poor: ["Ершов", "Колесников", "Синицын", "Зуев", "Буров", "Савельев", "Фролов", "Устинов"],
  mixed: ["Калинин", "Доронин", "Логинов", "Брагин", "Мельников", "Горшков", "Жуков", "Корнев"],
};

const FAMILY_ARCHETYPES = [
  {
    key: "deputy",
    title: "Семья регионального депутата",
    suffix: "official",
    story: "Публичная семья: любые скандалы бьют по репутации, но доступ к ресурсам выше среднего.",
    startMoney: 220000,
    education: 62,
    stress: 38,
    lawRisk: 6,
    contacts: [
      { type: "municipal", level: 45, note: "администрация района" },
      { type: "lawyer", level: 52, note: "семейный юрист" },
    ],
    traitMods: { charisma: 8, discipline: 5, street: -8 },
    pressure: 8,
    legalShield: 16,
  },
  {
    key: "late-crime-boss",
    title: "Семья бывшего криминального авторитета (отец умер)",
    suffix: "powerful",
    story: "Остались связи и старые долги. Любой выбор в серую зону резко повышает риск.",
    startMoney: 90000,
    education: 38,
    stress: 58,
    lawRisk: 24,
    contacts: [
      { type: "street", level: 55, note: "старые знакомые отца" },
      { type: "lawyer", level: 35, note: "адвокат по знакомству" },
    ],
    traitMods: { charisma: 3, discipline: -5, street: 14 },
    pressure: 20,
    legalShield: 4,
  },
  {
    key: "teacher",
    title: "Семья учителей",
    suffix: "mixed",
    story: "Скромный быт, сильный упор на учебу и дисциплину.",
    startMoney: 35000,
    education: 70,
    stress: 22,
    lawRisk: 2,
    contacts: [{ type: "education", level: 58, note: "директор школы" }],
    traitMods: { charisma: 2, discipline: 10, street: -12 },
    pressure: 4,
    legalShield: 3,
  },
  {
    key: "police-chief",
    title: "Семья офицера МВД",
    suffix: "official",
    story: "Можно получать защиту в конфликтных ситуациях, но это портит общественную репутацию.",
    startMoney: 120000,
    education: 57,
    stress: 32,
    lawRisk: 5,
    contacts: [
      { type: "police", level: 65, note: "отец-офицер" },
      { type: "lawyer", level: 40, note: "ведомственный адвокат" },
    ],
    traitMods: { charisma: 1, discipline: 9, street: -3 },
    pressure: 7,
    legalShield: 22,
  },
  {
    key: "doctor",
    title: "Семья врачей",
    suffix: "mixed",
    story: "Выше доступ к медицине и рекомендательным связям.",
    startMoney: 80000,
    education: 66,
    stress: 25,
    lawRisk: 2,
    contacts: [{ type: "medicine", level: 64, note: "частная клиника" }],
    traitMods: { charisma: 3, discipline: 8, street: -8 },
    pressure: 10,
    legalShield: 5,
  },
  {
    key: "poor-rural",
    title: "Семья на грани бедности",
    suffix: "poor",
    story: "Ресурсов мало, но мотивация выбраться в люди огромная.",
    startMoney: 12000,
    education: 34,
    stress: 44,
    lawRisk: 6,
    contacts: [{ type: "neighbor", level: 30, note: "локальные подработки" }],
    traitMods: { charisma: -2, discipline: 3, street: 8 },
    pressure: 12,
    legalShield: 0,
  },
  {
    key: "it-family",
    title: "Семья айтишников",
    suffix: "mixed",
    story: "Ранний доступ к технологиям и digital-навыкам.",
    startMoney: 130000,
    education: 72,
    stress: 26,
    lawRisk: 3,
    contacts: [{ type: "it", level: 62, note: "тех-комьюнити" }],
    traitMods: { charisma: 0, discipline: 7, street: -7 },
    pressure: 6,
    legalShield: 4,
  },
  {
    key: "business",
    title: "Семья предпринимателей",
    suffix: "powerful",
    story: "Есть стартовый капитал и бизнес-связи, но высокое давление семьи.",
    startMoney: 300000,
    education: 55,
    stress: 34,
    lawRisk: 8,
    contacts: [
      { type: "business", level: 68, note: "партнеры семьи" },
      { type: "lawyer", level: 56, note: "корпоративный юрист" },
    ],
    traitMods: { charisma: 9, discipline: 5, street: 3 },
    pressure: 12,
    legalShield: 12,
  },
];

const ADDITIONAL_SCENARIOS = [
  "семья таксистов", "семья дальнобойщика", "семья военного пенсионера", "семья бывшего спортсмена",
  "семья менеджеров банка", "семья мигрантов-предпринимателей", "семья с долгами по кредитам", "семья владельцев автосервиса",
  "семья охранника ТЦ", "семья нотариуса", "семья владельцев кафе", "семья госслужащих",
  "семья артистов", "семья судьи в отставке", "семья программиста-фрилансера", "семья риелторов",
  "семья работников завода", "семья из военного гарнизона", "семья фермеров", "семья с приемными детьми",
  "семья стартаперов", "семья работников порта", "семья логистической компании", "семья с частыми переездами",
  "семья с наследственным бизнесом", "семья предпринимателя-банкрота", "семья из криминального района", "семья владельца автомойки",
  "семья юриста и бухгалтера", "семья где мать — врач, отец — водитель", "семья мелкого чиновника", "семья с религиозными традициями",
  "семья кондитеров", "семья автомехаников", "семья охотников и рыболовов", "семья спортсменов",
  "семья блогеров", "семья ипотечников", "семья владельца шиномонтажа", "семья без отца",
  "семья без матери", "семья после развода", "семья военного медика", "семья полицейского патруля",
  "семья владельца мини-отеля", "семья автомалярного цеха", "семья продавцов электроники", "семья работников МФЦ",
  "семья с домом в пригороде", "семья со съемной квартирой", "семья студентов, ставших родителями рано", "семья с родственником в администрации",
  "семья с родственником в суде", "семья автоюриста", "семья ветеринаров", "семья со строгими традициями",
  "семья с финансовой подушкой", "семья в долговой яме", "семья с опытом эмиграции", "семья социального работника",
  "семья репетиторов", "семья малого застройщика", "семья диджея и фотографа", "семья владельца хостела",
  "семья инженеров", "семья работников аэропорта", "семья пожарного", "семья следователя",
  "семья из деревни, переехавшая в город", "семья предпринимателя в e-commerce", "семья с хроническими болезнями", "семья с высоким статусом в городе",
  "семья после потери бизнеса", "семья с радикальной экономией", "семья с несколькими квартирами", "семья судебного пристава",
  "семья владельца ларьков", "семья фотографов свадеб", "семья из музыкальной школы", "семья дальних родственников-опекунов",
  "семья с частыми конфликтами", "семья с сильной поддержкой бабушки", "семья без собственного жилья", "семья с успешным старшим братом",
  "семья с судимостью у родственника", "семья с опытом госзакупок", "семья с культурным капиталом", "семья бывшего офицера ФСИН",
  "семья строителей", "семья владельца ломбарда", "семья с опытом арбитражных судов", "семья топ-менеджера",
  "семья охотника за скидками и кэшбэком", "семья с мощными семейными связями", "семья со скрытыми активами", "семья с обремененным наследством",
  "семья с влиятельным крестным", "семья с постоянной нехваткой времени", "семья патологоанатома", "семья реставраторов авто",
  "семья пригородных перевозчиков", "семья собственников складов", "семья мастера ногтевого сервиса", "семья владельца магазина автозапчастей",
];

const CAR_LIST = [
  ["BMW M5 F90", 9800000, 22], ["BMW M5 F10", 4300000, 19], ["BMW M4 G82", 9300000, 21], ["BMW F30 320i", 2300000, 13],
  ["Mercedes E63 AMG", 8700000, 20], ["Mercedes C63 AMG", 7600000, 19], ["Mercedes CLS 53", 6900000, 17], ["Mercedes G63", 16500000, 28],
  ["Audi RS6 C8", 13200000, 24], ["Audi RS7", 10800000, 22], ["Audi S5", 5200000, 16], ["Porsche Panamera", 12300000, 24],
  ["Porsche Cayenne", 9800000, 21], ["Toyota Camry 3.5", 3500000, 10], ["Toyota Land Cruiser 200", 7800000, 20], ["Lexus LX570", 8400000, 22],
  ["Lexus ES250", 4600000, 12], ["Kia K5 GT Line", 2900000, 10], ["Hyundai Sonata", 2700000, 9], ["Volkswagen Passat B8", 2600000, 11],
  ["Skoda Octavia RS", 3100000, 12], ["Tesla Model 3", 4200000, 8], ["Tesla Model Y", 5200000, 9], ["Nissan GT-R R35", 9700000, 23],
  ["Infiniti Q50", 2800000, 13], ["Range Rover Sport", 9800000, 23], ["BMW X5 G05", 8800000, 19], ["BMW X6 G06", 9100000, 20],
  ["Mercedes GLE Coupe", 8900000, 19], ["Audi Q8", 8600000, 18], ["Lada Vesta Sport", 1500000, 7], ["Lada Niva Travel", 1350000, 7],
  ["Toyota Corolla", 2200000, 8], ["Honda Accord", 3000000, 10], ["Mazda 6", 2800000, 10], ["Subaru WRX", 3900000, 14],
  ["Mitsubishi Pajero", 3400000, 12], ["Jeep Grand Cherokee", 5600000, 16], ["Chevrolet Tahoe", 7200000, 20], ["Cadillac Escalade", 12000000, 25],
  ["Bentley Bentayga", 27000000, 34], ["BMW 530d G30", 5800000, 14], ["BMW 340i", 5200000, 15], ["Mercedes E200", 5000000, 13],
  ["Audi A6 3.0", 6100000, 14], ["Genesis G80", 5500000, 13], ["Volvo S90", 4900000, 11], ["Jaguar XF", 4300000, 13],
  ["Land Rover Defender", 9300000, 20], ["Toyota Supra A90", 7600000, 18], ["Ford Mustang GT", 6800000, 18], ["Dodge Challenger", 6400000, 19],
  ["Nissan 370Z", 4200000, 15], ["Alfa Romeo Giulia", 5400000, 14], ["Kia Stinger", 3700000, 12], ["Volkswagen Tiguan", 3100000, 10],
];

const PLACES = [
  { name: "Тренажерный зал", cost: 4500, health: 4, mood: 3, network: 1, risk: -1 },
  { name: "Коворкинг", cost: 3500, health: 0, mood: 2, network: 4, risk: -1 },
  { name: "Клуб", cost: 12000, health: -4, mood: 7, network: 2, risk: 4 },
  { name: "Ресторан", cost: 9000, health: 1, mood: 6, network: 2, risk: 0 },
  { name: "Кино", cost: 2200, health: 0, mood: 4, network: 1, risk: 0 },
  { name: "Дом / отдых", cost: 0, health: 2, mood: 1, network: -1, risk: -2 },
  { name: "Поездка за город", cost: 6000, health: 3, mood: 5, network: 0, risk: -1 },
  { name: "Вечеринка у знакомых", cost: 8000, health: -2, mood: 5, network: 4, risk: 3 },
  { name: "Образовательный курс", cost: 15000, health: 0, mood: 1, network: 3, risk: -2 },
  { name: "Волонтерство", cost: 1000, health: 1, mood: 3, network: 3, risk: -2 },
  { name: "Свидание в центре", cost: 7500, health: 0, mood: 7, network: 1, risk: 0 },
  { name: "Загородный спа", cost: 18000, health: 5, mood: 6, network: 0, risk: -1 },
];

const SOCIAL_MOVES = [
  { name: "Прокачивать дружбу с обычными знакомыми", contact: "street", gain: 3, rep: 1 },
  { name: "Поддерживать связь с юристом", contact: "lawyer", gain: 2, rep: 0 },
  { name: "Знакомиться с предпринимателями", contact: "business", gain: 3, rep: 1 },
  { name: "Держать контакт с ДПС знакомым", contact: "dps", gain: 2, rep: -1 },
  { name: "Укреплять связь с полицейским знакомым", contact: "police", gain: 2, rep: -1 },
  { name: "Вкладываться в IT-комьюнити", contact: "it", gain: 4, rep: 1 },
  { name: "Развивать связь с госструктурами", contact: "municipal", gain: 2, rep: 0 },
  { name: "Ничего не делать в сети знакомств", contact: "none", gain: 0, rep: 0 },
];

const LEGAL_TEMPLATES = [
  ["Учеба и легальная подработка", [25000, 65000], [8000, 25000], [0, 2], { education: 4, stress: 1, rep: 2, energy: -2 }],
  ["Курьер / доставка", [50000, 120000], [9000, 30000], [1, 3], { education: 0, stress: 2, rep: 1, energy: -4 }],
  ["Работа в автосервисе", [60000, 160000], [12000, 40000], [1, 4], { education: 1, stress: 2, rep: 1, energy: -3 }],
  ["Продажи / маркетинг", [70000, 220000], [20000, 70000], [2, 4], { education: 1, stress: 3, rep: 2, energy: -3 }],
  ["Стажировка в кибербезопасности", [90000, 280000], [15000, 60000], [0, 2], { education: 5, stress: 2, rep: 3, energy: -3 }],
  ["Логистика / диспетчер", [65000, 180000], [14000, 45000], [1, 3], { education: 1, stress: 3, rep: 1, energy: -3 }],
  ["Фриланс-дизайн", [40000, 210000], [10000, 50000], [1, 3], { education: 2, stress: 2, rep: 2, energy: -2 }],
  ["Техподдержка", [55000, 140000], [9000, 28000], [0, 2], { education: 2, stress: 2, rep: 1, energy: -3 }],
  ["Монтаж видео", [45000, 230000], [10000, 60000], [1, 3], { education: 1, stress: 3, rep: 2, energy: -2 }],
  ["SMM-ведение проектов", [60000, 250000], [12000, 65000], [1, 4], { education: 1, stress: 3, rep: 2, energy: -2 }],
  ["Открыть кофе-точку", [-90000, 380000], [60000, 230000], [3, 5], { education: 2, stress: 5, rep: 2, energy: -5 }],
  ["Запуск e-commerce магазина", [-120000, 420000], [70000, 250000], [3, 5], { education: 2, stress: 5, rep: 2, energy: -5 }],
  ["Риелторская практика", [70000, 350000], [25000, 90000], [2, 4], { education: 1, stress: 3, rep: 2, energy: -3 }],
  ["Сервис детейлинга авто", [80000, 320000], [30000, 130000], [2, 4], { education: 1, stress: 3, rep: 2, energy: -3 }],
  ["Ремонт техники", [55000, 210000], [14000, 50000], [1, 3], { education: 2, stress: 2, rep: 2, energy: -2 }],
  ["Контент и стримы", [0, 400000], [10000, 90000], [1, 4], { education: 0, stress: 2, rep: 3, energy: -2 }],
  ["Преподавание / репетиторство", [50000, 190000], [8000, 35000], [0, 2], { education: 3, stress: 2, rep: 3, energy: -2 }],
  ["Работа в медиа", [45000, 180000], [10000, 45000], [1, 3], { education: 2, stress: 3, rep: 2, energy: -2 }],
  ["Организация мероприятий", [60000, 300000], [25000, 110000], [2, 4], { education: 1, stress: 4, rep: 3, energy: -4 }],
  ["Строительный подряд", [90000, 350000], [35000, 150000], [2, 4], { education: 1, stress: 4, rep: 2, energy: -5 }],
];

const GREY_TEMPLATES = [
  ["Агрессивный арбитраж трафика", [-120000, 450000], [40000, 200000], [5, 10], { education: 1, stress: 5, rep: -1, energy: -3 }],
  ["Высокорисковый трейдинг", [-350000, 500000], [15000, 70000], [4, 9], { education: 1, stress: 4, rep: -1, energy: -2 }],
  ["Серый посреднический ресейл", [-80000, 320000], [30000, 150000], [4, 8], { education: 0, stress: 4, rep: -1, energy: -3 }],
  ["Перепродажа дефицитных товаров", [-70000, 280000], [25000, 120000], [3, 7], { education: 0, stress: 3, rep: 0, energy: -3 }],
  ["Опасный микрокредитный бизнес", [-100000, 420000], [30000, 170000], [6, 11], { education: 0, stress: 6, rep: -2, energy: -4 }],
  ["Серый консалтинг", [30000, 260000], [10000, 90000], [3, 6], { education: 1, stress: 3, rep: -1, energy: -2 }],
  ["Сомнительные рекламные интеграции", [20000, 300000], [10000, 100000], [4, 8], { education: 0, stress: 3, rep: -2, energy: -2 }],
  ["Теневой cash-flow посредник", [90000, 430000], [30000, 180000], [6, 12], { education: -1, stress: 6, rep: -3, energy: -4 }],
];

const ILLEGAL_TEMPLATES = [
  ["Серая P2P-схема (высокий риск)", [130000, 650000], [50000, 240000], [18, 40], { education: -1, stress: 8, rep: -6, energy: -5 }],
  ["Мошенническая онлайн-схема (крайний риск)", [180000, 900000], [90000, 420000], [25, 55], { education: -2, stress: 11, rep: -10, energy: -6 }],
  ["Поддельные сервисные услуги", [90000, 520000], [35000, 180000], [16, 38], { education: -1, stress: 8, rep: -6, energy: -4 }],
  ["Обман с цифровыми подарками", [80000, 460000], [25000, 150000], [15, 35], { education: -1, stress: 7, rep: -6, energy: -4 }],
  ["Фальшивые гарантийные сделки", [100000, 600000], [40000, 230000], [18, 42], { education: -1, stress: 8, rep: -7, energy: -5 }],
  ["Серая работа через подставных лиц", [110000, 580000], [50000, 220000], [18, 43], { education: -1, stress: 8, rep: -7, energy: -5 }],
];

function buildActivities() {
  const out = [];
  let idx = 0;
  LEGAL_TEMPLATES.forEach((t) => {
    out.push({
      key: `legal-${idx++}`,
      name: t[0],
      legality: "legal",
      income: t[1],
      expense: t[2],
      risk: t[3],
      stats: t[4],
      details: "Легальная траектория: стабильнее, но обычно медленнее разгон по доходу.",
    });
  });
  GREY_TEMPLATES.forEach((t) => {
    out.push({
      key: `grey-${idx++}`,
      name: t[0],
      legality: "grey",
      income: t[1],
      expense: t[2],
      risk: t[3],
      stats: t[4],
      details: "Серая зона: доход может быть выше, но риски и нестабильность резко возрастают.",
    });
  });
  ILLEGAL_TEMPLATES.forEach((t) => {
    out.push({
      key: `illegal-${idx++}`,
      name: t[0],
      legality: "illegal",
      income: t[1],
      expense: t[2],
      risk: t[3],
      stats: t[4],
      details: "Нелегальная деятельность приводит к высокой вероятности уголовных последствий.",
    });
  });
  const copies = [];
  for (let i = 0; i < 3; i += 1) {
    out.forEach((a) => {
      copies.push({
        ...a,
        key: `${a.key}-v${i}`,
        name: `${a.name} / сценарий ${i + 1}`,
        income: [a.income[0] + rand(-20000, 30000), a.income[1] + rand(-30000, 40000)],
        expense: [Math.max(0, a.expense[0] + rand(-10000, 12000)), a.expense[1] + rand(-10000, 20000)],
        risk: [Math.max(0, a.risk[0] + rand(-2, 2)), Math.max(a.risk[1], a.risk[1] + rand(-2, 4))],
      });
    });
  }
  return [...out, ...copies];
}

const ACTIVITIES = buildActivities();

const LEGAL_CHARGES = [
  { article: "Ст. 159 УК РФ (мошенничество)", min: 24, max: 84, confiscationChance: 78 },
  { article: "Ст. 187 УК РФ (неправомерный оборот средств платежей)", min: 18, max: 72, confiscationChance: 62 },
  { article: "Ст. 174.1 УК РФ (легализация преступных доходов)", min: 20, max: 96, confiscationChance: 82 },
  { article: "Ст. 272 УК РФ (неправомерный доступ к компьютерной информации)", min: 12, max: 48, confiscationChance: 40 },
  { article: "Ст. 291 УК РФ (дача взятки)", min: 12, max: 60, confiscationChance: 55 },
];

const RELATION_EVENTS = [
  "Вы познакомились с интересным человеком в кофейне.",
  "Появилась симпатия через общих друзей.",
  "Свидание прошло отлично, отношения укрепились.",
  "Ссора из-за нехватки времени снизила близость.",
  "Совместная поездка добавила доверия.",
  "Ревность и слухи ударили по отношениям.",
];

const PREHISTORY_EVENTS = [
  { text: "Семья вложилась в кружки и развитие.", mods: { education: 4, discipline: 3, stress: -1 }, type: "good" },
  { text: "В детстве были частые переезды и стресс.", mods: { stress: 4, mood: -3, networkValue: -2 }, type: "bad" },
  { text: "Появился наставник, который помог с самооценкой.", mods: { charisma: 3, discipline: 2 }, type: "good" },
  { text: "Подростковый конфликт с семьей испортил отношения дома.", mods: { stress: 3, mood: -4 }, type: "bad" },
  { text: "Регулярный спорт укрепил здоровье.", mods: { health: 6, discipline: 2 }, type: "good" },
  { text: "Ранняя подработка дала опыт ответственности.", mods: { money: 15000, discipline: 2, networkValue: 2 }, type: "good" },
  { text: "Была травма и длительное восстановление.", mods: { health: -8, stress: 4 }, type: "bad" },
];

const state = {
  initialized: false,
  player: null,
  history: [],
  activeCase: null,
  inPrison: false,
  prisonMonthsLeft: 0,
};

const el = {
  setupScreen: document.getElementById("setupScreen"),
  gameScreen: document.getElementById("gameScreen"),
  firstNameInput: document.getElementById("firstNameInput"),
  citySelect: document.getElementById("citySelect"),
  familySelect: document.getElementById("familySelect"),
  familyPreview: document.getElementById("familyPreview"),
  startBtn: document.getElementById("startBtn"),
  profileBlock: document.getElementById("profileBlock"),
  statsBlock: document.getElementById("statsBlock"),
  contactsBlock: document.getElementById("contactsBlock"),
  relationBlock: document.getElementById("relationBlock"),
  scenarioCount: document.getElementById("scenarioCount"),
  activitySelect: document.getElementById("activitySelect"),
  activityInfo: document.getElementById("activityInfo"),
  placeSelect: document.getElementById("placeSelect"),
  networkSelect: document.getElementById("networkSelect"),
  advanceBtn: document.getElementById("advanceBtn"),
  securityBtn: document.getElementById("securityBtn"),
  familyHelpBtn: document.getElementById("familyHelpBtn"),
  casePanel: document.getElementById("casePanel"),
  timeline: document.getElementById("timeline"),
  carMarketSelect: document.getElementById("carMarketSelect"),
  ownedCarsSelect: document.getElementById("ownedCarsSelect"),
  buyCarBtn: document.getElementById("buyCarBtn"),
  sellCarBtn: document.getElementById("sellCarBtn"),
  carInfo: document.getElementById("carInfo"),
};

function generateFamilyScenarios() {
  const list = [...FAMILY_ARCHETYPES];
  for (let i = 0; i < ADDITIONAL_SCENARIOS.length; i += 1) {
    const base = pick(FAMILY_ARCHETYPES);
    const title = ADDITIONAL_SCENARIOS[i];
    list.push({
      ...base,
      key: `generated-${i}`,
      title: title[0].toUpperCase() + title.slice(1),
      story: `Вариация: ${title}. База: ${base.title.toLowerCase()}.`,
      startMoney: Math.max(5000, base.startMoney + rand(-40000, 50000)),
      education: clamp(base.education + rand(-12, 12), 15, 90),
      stress: clamp(base.stress + rand(-12, 12), 10, 80),
      lawRisk: clamp(base.lawRisk + rand(-4, 8), 0, 45),
      traitMods: {
        charisma: base.traitMods.charisma + rand(-4, 4),
        discipline: base.traitMods.discipline + rand(-4, 4),
        street: base.traitMods.street + rand(-5, 5),
      },
      pressure: clamp(base.pressure + rand(-6, 8), 0, 28),
      legalShield: clamp(base.legalShield + rand(-10, 10), 0, 30),
      suffix: pick(["powerful", "official", "poor", "mixed"]),
    });
  }
  return list;
}

const ALL_FAMILIES = generateFamilyScenarios();

function generateSurname(family) {
  return pick(FAMILY_NAME_PARTS[family.suffix] || FAMILY_NAME_PARTS.mixed);
}

function formatMoney(num) {
  return `${Math.round(num).toLocaleString("ru-RU")} ₽`;
}

function addHistoryAt(stamp, text, type = "neutral") {
  state.history.unshift({ stamp, text, type });
  renderTimeline();
}

function addHistory(text, type = "neutral") {
  const stamp = `${state.player.ageYears} г ${state.player.ageMonths} мес`;
  addHistoryAt(stamp, text, type);
}

function getContactLevel(type) {
  const c = state.player.contacts.find((x) => x.type === type);
  return c ? c.level : 0;
}

function upsertContact(type, delta, note = "") {
  if (type === "none") return;
  const existing = state.player.contacts.find((x) => x.type === type);
  if (existing) {
    existing.level = clamp(existing.level + delta, 0, 100);
    if (note) existing.note = note;
  } else {
    state.player.contacts.push({ type, level: clamp(delta, 0, 100), note });
  }
}

function careerScore() {
  const p = state.player;
  return (
    p.education * 1.4 +
    p.reputation * 1.2 +
    p.charisma * 1.1 +
    p.discipline * 1.1 +
    p.networkValue * 1.5 +
    p.street * 0.4 +
    p.assetsValue / 300000
  );
}

function estimateScenarioCount() {
  return ACTIVITIES.length * PLACES.length * SOCIAL_MOVES.length * ALL_FAMILIES.length * (CAR_LIST.length + 1);
}

function initSetup() {
  CITIES.forEach((city) => {
    const o = document.createElement("option");
    o.value = city;
    o.textContent = city;
    el.citySelect.appendChild(o);
  });
  el.citySelect.value = pick(CITIES);

  ALL_FAMILIES.forEach((f) => {
    const o = document.createElement("option");
    o.value = f.key;
    o.textContent = f.title;
    el.familySelect.appendChild(o);
  });
  el.familySelect.selectedIndex = rand(0, ALL_FAMILIES.length - 1);
  el.firstNameInput.value = pick(MALE_NAMES);

  el.familySelect.addEventListener("change", renderFamilyPreview);
  el.startBtn.addEventListener("click", startGame);
  renderFamilyPreview();
}

function renderFamilyPreview() {
  const family = ALL_FAMILIES.find((f) => f.key === el.familySelect.value);
  if (!family) return;
  const surname = generateSurname(family);
  const name = el.firstNameInput.value.trim() || "Игрок";
  el.familyPreview.innerHTML = `
    <strong>${name} ${surname}</strong><br />
    ${family.story}<br />
    Старт: ${formatMoney(family.startMoney)} • Образование: ${family.education} • Базовый правовой риск семьи: ${family.lawRisk}%
  `;
}

function generatePrehistory() {
  const p = state.player;
  for (let age = 0; age <= 15; age += 1) {
    if (rand(1, 100) <= 34) {
      const ev = pick(PREHISTORY_EVENTS);
      Object.entries(ev.mods).forEach(([k, v]) => {
        if (typeof p[k] === "number") p[k] = clamp(p[k] + v, k === "money" ? -1000000 : 0, 10000000);
      });
      addHistoryAt(`${age} лет`, ev.text, ev.type);
    }
  }
}

function startGame() {
  const family = ALL_FAMILIES.find((f) => f.key === el.familySelect.value);
  if (!family) return;
  const firstName = (el.firstNameInput.value.trim() || pick(MALE_NAMES)).slice(0, 24);
  const surname = generateSurname(family);

  state.player = {
    firstName,
    surname,
    city: el.citySelect.value,
    ageYears: 16,
    ageMonths: 0,
    money: family.startMoney,
    debt: Math.max(0, rand(-50000, 250000)),
    health: clamp(78 + rand(-12, 8), 20, 100),
    energy: clamp(80 + rand(-12, 8), 20, 100),
    mood: clamp(68 + rand(-15, 10), 15, 100),
    stress: family.stress,
    education: family.education,
    reputation: clamp(50 + rand(-10, 10), 5, 95),
    networkValue: clamp(35 + rand(-8, 10), 0, 100),
    riskHeat: family.lawRisk,
    legalShield: family.legalShield,
    familyPressure: family.pressure,
    charisma: clamp(45 + family.traitMods.charisma + rand(-5, 8), 5, 95),
    discipline: clamp(45 + family.traitMods.discipline + rand(-6, 8), 5, 95),
    street: clamp(40 + family.traitMods.street + rand(-8, 8), 0, 100),
    relation: { status: "нет отношений", trust: 0 },
    contacts: family.contacts.map((c) => ({ ...c })),
    familyTitle: family.title,
    assets: [],
    prisonRecord: 0,
    isAlive: true,
  };

  state.history = [];
  state.activeCase = null;
  state.inPrison = false;
  state.prisonMonthsLeft = 0;

  generatePrehistory();
  addHistory("К 16 годам стартовая история сформирована. Начинается самостоятельная жизнь.", "good");
  addHistory(`Текущая фамилия по семье: ${state.player.firstName} ${state.player.surname}.`, "neutral");
  if (state.player.debt > 0) addHistory(`Есть стартовый долг: ${formatMoney(state.player.debt)}.`, "bad");

  populateSelectors();
  el.setupScreen.classList.add("hidden");
  el.gameScreen.classList.remove("hidden");
  bindGameActions();
  renderAll();
}

function populateSelectors() {
  el.activitySelect.innerHTML = "";
  ACTIVITIES.forEach((a) => {
    const o = document.createElement("option");
    o.value = a.key;
    o.textContent = `${a.name} [${a.legality}]`;
    el.activitySelect.appendChild(o);
  });
  el.activitySelect.selectedIndex = 0;

  el.placeSelect.innerHTML = "";
  PLACES.forEach((p) => {
    const o = document.createElement("option");
    o.value = p.name;
    o.textContent = `${p.name} (${formatMoney(p.cost)})`;
    el.placeSelect.appendChild(o);
  });

  el.networkSelect.innerHTML = "";
  SOCIAL_MOVES.forEach((m) => {
    const o = document.createElement("option");
    o.value = m.name;
    o.textContent = m.name;
    el.networkSelect.appendChild(o);
  });

  el.carMarketSelect.innerHTML = "";
  CAR_LIST.forEach(([model, price]) => {
    const o = document.createElement("option");
    o.value = model;
    o.textContent = `${model} — ${formatMoney(price)}`;
    el.carMarketSelect.appendChild(o);
  });

  refreshOwnedCars();
  renderActivityInfo();
}

function bindGameActions() {
  if (state.initialized) return;
  state.initialized = true;
  el.advanceBtn.addEventListener("click", playMonth);
  el.securityBtn.addEventListener("click", buySecurity);
  el.familyHelpBtn.addEventListener("click", familyHelp);
  el.buyCarBtn.addEventListener("click", buyCar);
  el.sellCarBtn.addEventListener("click", sellCar);
  el.ownedCarsSelect.addEventListener("change", renderCarInfo);
  el.activitySelect.addEventListener("change", renderActivityInfo);
}

function renderActivityInfo() {
  const activity = ACTIVITIES.find((a) => a.key === el.activitySelect.value) || ACTIVITIES[0];
  if (!activity || !el.activityInfo) return;
  const legalLabel = activity.legality === "legal" ? "Легально" : activity.legality === "grey" ? "Серая зона" : "Нелегально";
  el.activityInfo.textContent =
    `${legalLabel} • Доход: ${formatMoney(activity.income[0])}...${formatMoney(activity.income[1])} • ` +
    `Расход: ${formatMoney(activity.expense[0])}...${formatMoney(activity.expense[1])} • ` +
    `Риск: ${activity.risk[0]}-${activity.risk[1]} • ${activity.details}`;
}

function buySecurity() {
  if (state.player.money < 5000) {
    addHistory("Не хватило денег на усиление личной безопасности.", "bad");
    renderAll();
    return;
  }
  state.player.money -= 5000;
  state.player.riskHeat = clamp(state.player.riskHeat - rand(1, 4), 0, 100);
  state.player.legalShield = clamp(state.player.legalShield + rand(1, 3), 0, 100);
  addHistory("Потрачено на цифровую и юридическую гигиену. Риски снижены.", "good");
  renderAll();
}

function familyHelp() {
  const p = state.player;
  const influence = p.legalShield + getContactLevel("police") + getContactLevel("municipal") + getContactLevel("dps");
  const cost = rand(30000, 180000);
  if (p.money < cost) {
    addHistory("Семейный ресурс есть, но не хватило денег на решение вопроса.", "bad");
    renderAll();
    return;
  }
  p.money -= cost;
  p.reputation = clamp(p.reputation - rand(4, 10), 0, 100);

  if (state.activeCase) {
    const chance = clamp(20 + influence * 0.7 - state.activeCase.severity * 0.45, 5, 85);
    if (rand(1, 100) <= chance) {
      addHistory(`Семья помогла смягчить дело за ${formatMoney(cost)}. Но репутация просела.`, "neutral");
      state.activeCase = null;
      p.riskHeat = clamp(p.riskHeat - 15, 0, 100);
    } else {
      addHistory(`Попытка семейного влияния за ${formatMoney(cost)} провалилась и вызвала лишнее внимание.`, "bad");
      p.riskHeat = clamp(p.riskHeat + 8, 0, 100);
    }
  } else {
    p.riskHeat = clamp(p.riskHeat - rand(3, 10), 0, 100);
    addHistory(`Семья закрыла мелкие вопросы за ${formatMoney(cost)}. Репутация немного пострадала.`, "neutral");
  }
  renderAll();
}

function buyCar() {
  const info = CAR_LIST.find((x) => x[0] === el.carMarketSelect.value);
  if (!info) return;
  const [name, price, monthlyCost] = info;
  if (state.player.money < price) {
    addHistory(`Не хватило денег на ${name}.`, "bad");
    renderAll();
    return;
  }
  state.player.money -= price;
  state.player.assets.push({ model: name, buyPrice: price, monthlyCost, condition: rand(70, 98) });
  state.player.reputation = clamp(state.player.reputation + rand(0, 3), 0, 100);
  addHistory(`Куплен автомобиль ${name} за ${formatMoney(price)}.`, "good");
  refreshOwnedCars();
  renderAll();
}

function sellCar() {
  const idx = Number(el.ownedCarsSelect.value);
  if (Number.isNaN(idx) || !state.player.assets[idx]) return;
  const car = state.player.assets[idx];
  const sellPrice = Math.max(150000, Math.round(car.buyPrice * (car.condition / 100) * rand(72, 86) / 100));
  state.player.money += sellPrice;
  state.player.assets.splice(idx, 1);
  addHistory(`Продан ${car.model} за ${formatMoney(sellPrice)}.`, "neutral");
  refreshOwnedCars();
  renderAll();
}

function refreshOwnedCars() {
  el.ownedCarsSelect.innerHTML = "";
  state.player?.assets?.forEach((car, idx) => {
    const o = document.createElement("option");
    o.value = String(idx);
    o.textContent = `${car.model} (${car.condition}%)`;
    el.ownedCarsSelect.appendChild(o);
  });
  renderCarInfo();
}

function renderCarInfo() {
  const idx = Number(el.ownedCarsSelect.value);
  const car = state.player?.assets?.[idx];
  if (!car) {
    el.carInfo.textContent = "Пока нет автомобилей.";
    return;
  }
  el.carInfo.textContent = `${car.model}: состояние ${car.condition}%, ежемесячные траты ~ ${formatMoney(car.monthlyCost * 1000)}.`;
}

function applyRandomLifeEvent() {
  const p = state.player;
  const roll = rand(1, 100);
  if (roll <= 10) {
    const bonus = rand(10000, 120000);
    p.money += bonus;
    addHistory(`Неожиданный плюс: разовый доход ${formatMoney(bonus)}.`, "good");
  } else if (roll <= 20) {
    const cost = rand(10000, 80000);
    p.money -= cost;
    p.stress = clamp(p.stress + 4, 0, 100);
    addHistory(`Неожиданный расход: ${formatMoney(cost)}.`, "bad");
  } else if (roll <= 28) {
    p.health = clamp(p.health - rand(4, 12), 0, 100);
    p.stress = clamp(p.stress + rand(2, 7), 0, 100);
    addHistory("Проблемы со здоровьем: нужен отдых.", "bad");
  } else if (roll <= 36) {
    p.relation.trust = clamp(p.relation.trust + rand(-8, 12), 0, 100);
    if (p.relation.trust > 12 && p.relation.status === "нет отношений") p.relation.status = "в отношениях";
    addHistory(`Личная жизнь: ${pick(RELATION_EVENTS)}`, p.relation.trust >= 50 ? "good" : "neutral");
  }
}

function tryOpenCase(activity) {
  if (activity.legality !== "illegal" && state.player.riskHeat < 35) return;
  const baseChance = activity.legality === "illegal" ? rand(18, 45) : activity.legality === "grey" ? rand(8, 20) : rand(2, 10);
  const chance = baseChance + Math.round(state.player.riskHeat * 0.35) - Math.round(state.player.legalShield * 0.25);
  if (rand(1, 100) > clamp(chance, 1, 90)) return;
  const charge = pick(LEGAL_CHARGES);
  state.activeCase = {
    article: charge.article,
    severity: rand(1, 100),
    monthsMin: charge.min,
    monthsMax: charge.max,
    confiscationChance: charge.confiscationChance,
    stage: "investigation",
  };
  addHistory(`Началась проверка: ${charge.article}.`, "bad");
}

function processCase() {
  if (!state.activeCase) return;
  const p = state.player;
  const c = state.activeCase;
  const defensePower =
    getContactLevel("lawyer") * 0.7 +
    getContactLevel("police") * 0.3 +
    p.education * 0.2 +
    p.legalShield;

  if (c.stage === "investigation") {
    const roll = rand(1, 100) + c.severity * 0.25 - defensePower * 0.35;
    if (roll < 35) {
      addHistory("Дело развалилось на стадии проверки.", "good");
      state.activeCase = null;
      p.riskHeat = clamp(p.riskHeat - 15, 0, 100);
      return;
    }
    c.stage = "court";
    addHistory("Материалы ушли в суд.", "bad");
    return;
  }

  const sentenceRoll = rand(1, 100) + c.severity * 0.45 - defensePower * 0.5;
  if (sentenceRoll < 40) {
    const fine = rand(120000, 900000);
    p.money -= fine;
    p.reputation = clamp(p.reputation - 10, 0, 100);
    p.riskHeat = clamp(p.riskHeat - 10, 0, 100);
    addHistory(`Суд: условный срок и штраф ${formatMoney(fine)}.`, "neutral");
    state.activeCase = null;
    return;
  }

  const jailMonths = rand(c.monthsMin, c.monthsMax);
  const confiscated = rand(1, 100) <= c.confiscationChance;
  if (confiscated) {
    p.money = Math.max(0, Math.round(p.money * rand(0, 20) / 100));
    p.assets = [];
  }
  state.inPrison = true;
  state.prisonMonthsLeft = jailMonths;
  p.prisonRecord += 1;
  p.reputation = clamp(p.reputation - rand(10, 25), 0, 100);
  addHistory(
    `Суд: реальный срок ${Math.floor(jailMonths / 12)} лет ${jailMonths % 12} мес (${c.article}).` +
    (confiscated ? " Часть имущества конфискована." : ""),
    "bad"
  );
  state.activeCase = null;
}

function prisonMonth() {
  const p = state.player;
  state.prisonMonthsLeft -= 1;
  p.health = clamp(p.health - rand(0, 2), 0, 100);
  p.energy = clamp(p.energy - rand(0, 1), 0, 100);
  p.stress = clamp(p.stress + rand(0, 2), 0, 100);
  p.money -= rand(3000, 9000);
  if (state.prisonMonthsLeft <= 0) {
    state.inPrison = false;
    p.riskHeat = clamp(p.riskHeat - 25, 0, 100);
    p.discipline = clamp(p.discipline + rand(1, 8), 0, 100);
    p.street = clamp(p.street + rand(2, 9), 0, 100);
    p.networkValue = clamp(p.networkValue + rand(-5, 4), 0, 100);
    addHistory("Освобождение: часть связей потеряна, жизнь изменилась.", "neutral");
  } else if (state.prisonMonthsLeft % 6 === 0) {
    addHistory(`Отбывание срока: осталось ${state.prisonMonthsLeft} мес.`, "neutral");
  }
}

function tickAge() {
  state.player.ageMonths += 1;
  if (state.player.ageMonths >= 12) {
    state.player.ageMonths = 0;
    state.player.ageYears += 1;
    addHistory(`День рождения: теперь ${state.player.ageYears}.`, "neutral");
  }
}

function applyMonthlyExpenses() {
  const p = state.player;
  let base = rand(18000, 52000);
  base += p.assets.reduce((sum, car) => sum + car.monthlyCost * 1000, 0);
  if (p.relation.status === "в отношениях") base += rand(7000, 28000);
  if (p.ageYears >= 22) base += rand(8000, 25000);
  p.money -= base;
  if (p.money < 0) {
    p.debt += Math.abs(p.money);
    p.money = 0;
    p.stress = clamp(p.stress + 4, 0, 100);
  }
}

function maybeDeath() {
  const p = state.player;
  let chance = 0.1;
  if (p.health < 20) chance += 4;
  if (p.stress > 85) chance += 1.8;
  if (p.riskHeat > 80) chance += 3.5;
  if (state.inPrison) chance += 0.6;
  if (rand(1, 1000) <= Math.round(chance * 10)) {
    p.isAlive = false;
    addHistory("Критический финал жизни. Можно начать заново.", "bad");
  }
}

function evaluateRelation() {
  const p = state.player;
  if (p.mood > 60 && p.networkValue > 45 && p.relation.status === "нет отношений" && rand(1, 100) <= 8) {
    p.relation.status = "в отношениях";
    p.relation.trust = rand(18, 40);
    addHistory("Начались новые отношения.", "good");
  }
  if (p.relation.status === "в отношениях") {
    const drift = rand(-6, 5) + Math.round((p.mood - p.stress) * 0.04);
    p.relation.trust = clamp(p.relation.trust + drift, 0, 100);
    if (p.relation.trust <= 5) {
      p.relation.status = "нет отношений";
      p.relation.trust = 0;
      addHistory("Отношения завершились.", "bad");
    }
  }
}

function processDebtAndGrowth() {
  const p = state.player;
  if (p.debt > 0 && p.money > 60000 && rand(1, 100) <= 35) {
    const payment = Math.min(p.debt, rand(20000, 90000));
    p.debt -= payment;
    p.money -= payment;
    addHistory(`Погашен долг на ${formatMoney(payment)}.`, "good");
  }
  if (careerScore() > 360 && rand(1, 100) <= 12) {
    const boom = rand(90000, 400000);
    p.money += boom;
    p.reputation = clamp(p.reputation + 3, 0, 100);
    addHistory(`Карьерный рывок: +${formatMoney(boom)}.`, "good");
  }
}

function degradeCars() {
  state.player.assets.forEach((car) => {
    car.condition = clamp(car.condition - rand(0, 2), 35, 100);
  });
}

function playMonth() {
  if (!state.player || !state.player.isAlive) {
    resetToMenu();
    return;
  }
  tickAge();
  const p = state.player;

  if (state.inPrison) {
    prisonMonth();
    applyMonthlyExpenses();
    maybeDeath();
    renderAll();
    return;
  }

  const activity = ACTIVITIES.find((a) => a.key === el.activitySelect.value) || ACTIVITIES[0];
  const place = PLACES.find((x) => x.name === el.placeSelect.value) || PLACES[0];
  const move = SOCIAL_MOVES.find((m) => m.name === el.networkSelect.value) || SOCIAL_MOVES[0];

  const income = rand(activity.income[0], activity.income[1]);
  const expense = rand(activity.expense[0], activity.expense[1]) + place.cost;
  p.money += income - expense;

  p.education = clamp(p.education + activity.stats.education + rand(-1, 1), 0, 100);
  p.stress = clamp(p.stress + activity.stats.stress + rand(-2, 2), 0, 100);
  p.reputation = clamp(p.reputation + activity.stats.rep + rand(-2, 2), 0, 100);
  p.energy = clamp(p.energy + activity.stats.energy + rand(-2, 2), 0, 100);
  p.health = clamp(p.health + place.health + rand(-1, 1), 0, 100);
  p.mood = clamp(p.mood + place.mood + rand(-2, 2), 0, 100);
  p.networkValue = clamp(p.networkValue + place.network + move.gain + rand(-1, 2), 0, 100);

  p.riskHeat = clamp(
    p.riskHeat + rand(activity.risk[0], activity.risk[1]) + place.risk + p.familyPressure * 0.08 - p.discipline * 0.03,
    0,
    100
  );

  upsertContact(move.contact, move.gain, "укрепление связи");
  p.reputation = clamp(p.reputation + move.rep, 0, 100);

  addHistory(
    `${activity.name}: доход ${formatMoney(income)}, расход ${formatMoney(expense)}, итог ${formatMoney(income - expense)}.`,
    income - expense >= 0 ? "good" : "bad"
  );
  if (activity.legality === "illegal") {
    addHistory("Нелегальная активность резко увеличивает риск уголовных последствий.", "bad");
  }

  applyRandomLifeEvent();
  tryOpenCase(activity);
  processCase();
  applyMonthlyExpenses();
  processDebtAndGrowth();
  degradeCars();
  maybeDeath();
  evaluateRelation();
  renderAll();
}

function resetToMenu() {
  el.gameScreen.classList.add("hidden");
  el.setupScreen.classList.remove("hidden");
}

function renderProfile() {
  const p = state.player;
  const status = p.isAlive ? (state.inPrison ? `В тюрьме (${state.prisonMonthsLeft} мес)` : "На свободе") : "Погиб";
  el.profileBlock.innerHTML = `
    <div><strong>${p.firstName} ${p.surname}</strong></div>
    <div>Возраст: ${p.ageYears} лет ${p.ageMonths} мес</div>
    <div>Город: ${p.city}</div>
    <div>Семья: ${p.familyTitle}</div>
    <div>Статус: ${status}</div>
    <div>Судимостей: ${p.prisonRecord}</div>
  `;
}

function renderStats() {
  const p = state.player;
  const stats = [
    ["Деньги", formatMoney(p.money)],
    ["Долг", formatMoney(p.debt)],
    ["Здоровье", p.health],
    ["Энергия", p.energy],
    ["Настроение", p.mood],
    ["Стресс", p.stress],
    ["Образование", p.education],
    ["Репутация", p.reputation],
    ["Связи", p.networkValue],
    ["Риск-профиль", Math.round(p.riskHeat)],
    ["Юр. защита", Math.round(p.legalShield)],
    ["Харизма", p.charisma],
    ["Дисциплина", p.discipline],
    ["Улица", p.street],
  ];
  el.statsBlock.innerHTML = stats.map(([k, v]) => `<div class="stat-row"><span>${k}</span><strong>${v}</strong></div>`).join("");
}

function renderContacts() {
  const contacts = state.player.contacts
    .sort((a, b) => b.level - a.level)
    .map((c) => `<div>${c.type}: <strong>${c.level}</strong> <span class="small">${c.note || ""}</span></div>`)
    .join("");
  el.contactsBlock.innerHTML = contacts || "<div class='small'>Связей пока нет.</div>";
}

function renderRelation() {
  const r = state.player.relation;
  el.relationBlock.innerHTML = `<div>Статус: <strong>${r.status}</strong></div><div>Доверие: <strong>${r.trust}</strong></div>`;
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

function renderTimeline() {
  el.timeline.innerHTML = state.history
    .slice(0, 200)
    .map((item) => `<div class="event ${item.type}"><span class="time">${item.stamp}</span> — ${item.text}</div>`)
    .join("");
}

function getAssetsValue() {
  return state.player.assets.reduce((sum, car) => sum + car.buyPrice * (car.condition / 100), 0);
}

function renderAll() {
  if (!state.player) return;
  state.player.assetsValue = getAssetsValue();
  renderProfile();
  renderStats();
  renderContacts();
  renderRelation();
  renderCasePanel();
  refreshOwnedCars();
  renderActivityInfo();
  el.scenarioCount.textContent = `Комбинаций на один ход: ${estimateScenarioCount().toLocaleString("ru-RU")}+ (семьи × темы × места × связи × авто)`;
  el.advanceBtn.textContent = state.player.isAlive ? "Прожить месяц" : "Начать новую жизнь";
}

initSetup();
