/* ========== УТИЛИТЫ ========== */
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function formatDate(s) {
  const d = new Date(s + 'T12:00:00');
  const m = [
    'янв',
    'фев',
    'мар',
    'апр',
    'май',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек',
  ];
  const w = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return `${w[d.getDay()]}, ${d.getDate()} ${m[d.getMonth()]}`;
}
function getDailyLog(d) {
  if (!appState.dailyLogs[d])
    appState.dailyLogs[d] = {
      bw: { a: null, act: '', pred: '' },
      b1: { done: false, notes: '' },
      b2: { done: false, notes: '' },
      aw: { did: '', a: null, fact: '', prot: '', next: '' },
      breathingSeconds: 0,
    };
  if (appState.dailyLogs[d].breathingSeconds == null) appState.dailyLogs[d].breathingSeconds = 0;
  return appState.dailyLogs[d];
}
function getHealthLog(d) {
  if (!appState.health[d]) appState.health[d] = { caf: 0, sleep: null, mov: 0 };
  return appState.health[d];
}
function formatDuration(seconds) {
  const totalSeconds = Math.max(0, Math.floor(seconds || 0)),
    minutes = Math.floor(totalSeconds / 60),
    restSeconds = totalSeconds % 60;
  if (minutes <= 0) return `${restSeconds} сек`;
  if (restSeconds === 0) return `${minutes} мин`;
  return `${minutes} мин ${String(restSeconds).padStart(2, '0')} сек`;
}
function formatTimer(seconds) {
  const totalSeconds = Math.max(0, Math.floor(seconds || 0)),
    minutes = Math.floor(totalSeconds / 60),
    restSeconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(restSeconds).padStart(2, '0')}`;
}
function escapeHtml(s) {
  return s
    ? s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
    : '';
}
function showToast(m) {
  const t = document.getElementById('toast');
  t.textContent = m;
  t.classList.add('is-visible');
  setTimeout(() => t.classList.remove('is-visible'), 2200);
}

const byId = (id) => document.getElementById(id);
const appRoot = byId('app');
