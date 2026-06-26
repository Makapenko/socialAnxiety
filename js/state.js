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
function createDefaultPracticesState() {
  return {
    grounding: { step: 0, answers: [], completed: false, history: [] },
    clouds: { entries: [] },
    bodyScan: { current: 0, timeLeft: 15, completed: false, history: [] },
    values: { phase: 'select', selected: [], chosen: {}, completed: false, history: [] },
  };
}
function createDefaultState() {
  return {
    diary: [],
    actions: JSON.parse(JSON.stringify(DEFAULT_ACTIONS)),
    safetyBehaviors: [],
    dailyLogs: {},
    worry: [],
    health: {},
    breathingMode: 'calm',
    assessment: { results: [], repeatAfterDays: 7 },
    practices: createDefaultPracticesState(),
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
      if (!p.assessment.repeatAfterDays) p.assessment.repeatAfterDays = 7;
      if (!Array.isArray(p.actions)) p.actions = d.actions;
      if (!Array.isArray(p.safetyBehaviors)) p.safetyBehaviors = [];
      if (!['calm', 'even'].includes(p.breathingMode)) p.breathingMode = d.breathingMode;
      if (!p.practices || typeof p.practices !== 'object') p.practices = d.practices;
      for (const [practiceName, practiceDefaults] of Object.entries(d.practices)) {
        if (!p.practices[practiceName] || typeof p.practices[practiceName] !== 'object')
          p.practices[practiceName] = practiceDefaults;
        else
          for (const [key, value] of Object.entries(practiceDefaults))
            if (!(key in p.practices[practiceName]))
              p.practices[practiceName][key] = JSON.parse(JSON.stringify(value));
      }
      if (!Array.isArray(p.practices.grounding.answers)) p.practices.grounding.answers = [];
      if (!Array.isArray(p.practices.grounding.history)) p.practices.grounding.history = [];
      p.practices.grounding.step = Math.min(4, Math.max(0, Number(p.practices.grounding.step) || 0));
      p.practices.grounding.completed = Boolean(p.practices.grounding.completed);
      if (!Array.isArray(p.practices.clouds.entries)) p.practices.clouds.entries = [];
      if (!Array.isArray(p.practices.bodyScan.history)) p.practices.bodyScan.history = [];
      p.practices.bodyScan.current = Math.min(
        11,
        Math.max(0, Number(p.practices.bodyScan.current) || 0),
      );
      p.practices.bodyScan.timeLeft = Math.min(
        15,
        Math.max(1, Number(p.practices.bodyScan.timeLeft) || 15),
      );
      p.practices.bodyScan.completed = Boolean(p.practices.bodyScan.completed);
      if (!Array.isArray(p.practices.values.selected)) p.practices.values.selected = [];
      p.practices.values.selected = p.practices.values.selected
        .filter((valueId) =>
          ['family', 'health', 'growth', 'creative', 'nature', 'help', 'freedom', 'peace'].includes(
            valueId,
          ),
        )
        .slice(0, 3);
      if (!p.practices.values.chosen || typeof p.practices.values.chosen !== 'object')
        p.practices.values.chosen = {};
      if (!Array.isArray(p.practices.values.history)) p.practices.values.history = [];
      if (!['select', 'actions'].includes(p.practices.values.phase))
        p.practices.values.phase = 'select';
      p.practices.values.completed = Boolean(p.practices.values.completed);
      return p;
    }
  } catch (e) {}
  return createDefaultState();
}

let appState = loadState();
let activeTab = 'assessment';
let saveTimeout;
function scheduleSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(appState)), 300);
}
