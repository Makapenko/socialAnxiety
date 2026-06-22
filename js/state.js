/* ========== СОСТОЯНИЕ ========== */
const STORAGE_KEY = 'calm_path_v2';
const DEFAULT_ACTIONS = [
  { id: 1, text: 'Кивнуть незнакомому человеку', anxiety: 1 },
  { id: 2, text: 'Сказать коллеге «привет»', anxiety: 2 },
  { id: 3, text: 'Посмотреть в глаза две секунды', anxiety: 3 },
  { id: 4, text: 'Спросить: «Как проходит смена?»', anxiety: 4 },
  { id: 5, text: 'Сказать одну фразу во время общего разговора', anxiety: 5 },
  { id: 6, text: 'Поесть рядом с коллегами', anxiety: 5 },
  { id: 7, text: 'Позвонить по простому бытовому вопросу', anxiety: 6 },
  { id: 8, text: 'Попросить объяснить непонятную задачу', anxiety: 6 },
  { id: 9, text: 'Первым начать короткий разговор', anxiety: 7 },
  { id: 10, text: 'Высказать своё мнение', anxiety: 7 },
  { id: 11, text: 'Вежливо не согласиться', anxiety: 8 },
  { id: 12, text: 'Присоединиться к группе людей', anxiety: 8 },
  { id: 13, text: 'Познакомиться с новым человеком', anxiety: 9 },
  { id: 14, text: 'Предложить кому-нибудь встретиться', anxiety: 9 },
  { id: 15, text: 'Выступить или говорить перед группой', anxiety: 10 },
];
function createDefaultState() {
  return {
    diary: [],
    actions: JSON.parse(JSON.stringify(DEFAULT_ACTIONS)),
    dailyLogs: {},
    worry: [],
    health: {},
    assessment: { results: [], repeatAfterDays: 14 },
  };
}
function loadState() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (r) {
      const p = JSON.parse(r);
      const d = createDefaultState();
      for (const k of Object.keys(d)) if (!(k in p)) p[k] = d[k];
      if (!p.assessment) p.assessment = d.assessment;
      if (!p.assessment.results) p.assessment.results = [];
      if (!p.assessment.repeatAfterDays) p.assessment.repeatAfterDays = 14;
      return p;
    }
  } catch (e) {}
  return createDefaultState();
}

let appState = loadState();
let activeTab = 'today';
let saveTimeout;
function scheduleSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(appState)), 300);
}
