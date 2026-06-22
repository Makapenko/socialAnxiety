/* --- ОЦЕНКА --- */
const SPIN_ITEMS = [
  'Я избегаю действий, при которых могу оказаться в центре внимания.',
  'Я боюсь выглядеть неловко или глупо.',
  'Я избегаю разговаривать с незнакомыми людьми.',
  'Я боюсь, что другие заметят мое волнение.',
  'Я избегаю делать что-то, когда на меня смотрят.',
  'Я боюсь критики или неодобрения.',
  'Я избегаю людей, которые могут оценивать меня.',
  'Я чувствую сильное напряжение перед социальными ситуациями.',
  'Я избегаю говорить с авторитетными людьми.',
  'Я боюсь покраснеть, вспотеть или задрожать при людях.',
  'Я избегаю вечеринок, встреч или групповых разговоров.',
  'Я боюсь сказать что-то не то.',
  'Я избегаю звонков или разговоров, где нужно быстро отвечать.',
  'Я переживаю из-за будущих социальных ситуаций заранее.',
  'После общения я долго разбираю, как выглядел и что сказал.',
  'Мое тело мешает мне в общении: голос, руки, лицо, дыхание.',
  'Из-за социальной тревоги я упускаю важные для себя дела.',
];
const GAD_ITEMS = [
  'Чувство нервозности, тревоги или напряжения.',
  'Невозможность остановить или контролировать беспокойство.',
  'Чрезмерное беспокойство о разных вещах.',
  'Трудности с расслаблением.',
  'Такое беспокойство, что трудно усидеть на месте.',
  'Легкая раздражительность.',
  'Ощущение, что может случиться что-то плохое.',
];
const LIKERT_5 = ['Нет', 'Немного', 'Умеренно', 'Сильно', 'Очень сильно'];
const GAD_4 = ['Ни разу', 'Несколько дней', 'Больше половины дней', 'Почти каждый день'];
const IMPAIRMENT_ITEMS = [
  { key: 'work', label: 'Работа / учеба' },
  { key: 'sleep', label: 'Сон' },
  { key: 'communication', label: 'Общение' },
  { key: 'avoidance', label: 'Избегание' },
];

let assessmentMode = 'overview';
let gadAssessmentSkipped = false;

function hasAssessmentResults() {
  return !!(appState.assessment && appState.assessment.results && appState.assessment.results.length);
}
function getAssessmentResults() {
  if (!appState.assessment) appState.assessment = { results: [], repeatAfterDays: 14 };
  if (!appState.assessment.results) appState.assessment.results = [];
  if (!appState.assessment.repeatAfterDays) appState.assessment.repeatAfterDays = 14;
  return appState.assessment.results;
}
function getLastAssessmentResult() {
  const results = getAssessmentResults();
  return results.length ? results[results.length - 1] : null;
}
function getAssessmentRepeatInfo() {
  const last = getLastAssessmentResult();
  if (!last) return null;
  const repeatAfterDays = appState.assessment.repeatAfterDays || 14,
    dueDate = addDaysToDateKey(last.date, repeatAfterDays),
    daysSince = daysBetweenDateKeys(last.date, getTodayKey()),
    daysLeft = repeatAfterDays - daysSince;
  return { dueDate, daysLeft, isDue: daysLeft <= 0, overdueDays: Math.abs(daysLeft) };
}
function getSpinLevel(score) {
  if (score >= 51) return 'очень выраженная';
  if (score >= 41) return 'выраженная';
  if (score >= 31) return 'умеренная';
  if (score >= 21) return 'легкая';
  return 'низкая';
}
function getGadLevel(score) {
  if (score >= 15) return 'тяжелая';
  if (score >= 10) return 'умеренная';
  if (score >= 5) return 'легкая';
  return 'минимальная';
}
function renderAssessmentOptions(name, count, labels, selectedValues) {
  let html = '<div class="assessment-options">';
  for (let i = 0; i < count; i++)
    html += `<button type="button" class="assessment-option${selectedValues === i ? ' is-active' : ''}" data-assessment-scale="${name}" data-assessment-value="${i}"><span>${i}</span>${labels[i]}</button>`;
  return html + '</div>';
}
function renderAssessmentQuestionList(prefix, items, labels, maxValue) {
  return items
    .map(
      (item, index) => `
        <div class="assessment-question">
          <div class="assessment-question-text"><span>${index + 1}</span>${escapeHtml(item)}</div>
          ${renderAssessmentOptions(`${prefix}-${index}`, maxValue + 1, labels, null)}
        </div>`,
    )
    .join('');
}
function renderImpairmentInputs() {
  return IMPAIRMENT_ITEMS.map(
    (item) => `
      <div class="assessment-question">
        <div class="assessment-question-text"><span>${escapeHtml(item.label)}</span>Насколько тревога мешала в этой области?</div>
        ${renderAnxietyScale(`imp-${item.key}`, null)}
      </div>`,
  ).join('');
}
function renderAssessmentNotice() {
  const info = getAssessmentRepeatInfo();
  if (!info) return '';
  if (info.isDue)
    return `<div class="assessment-alert is-due"><i class="fas fa-triangle-exclamation"></i><div><strong>Пора повторить оценку</strong><br>Рекомендуемая дата была ${formatDate(info.dueDate)}. Тест можно пройти сейчас.</div></div>`;
  return `<div class="assessment-alert"><i class="fas fa-calendar-check"></i><div><strong>Следующий повтор через ${info.daysLeft} дн.</strong><br>Рекомендуемая дата: ${formatDate(info.dueDate)}. Повторить можно и раньше.</div></div>`;
}
function renderAssessmentDueReminder() {
  const info = getAssessmentRepeatInfo();
  if (!info || !info.isDue) return '';
  return `<div class="assessment-alert is-due"><i class="fas fa-triangle-exclamation"></i><div><strong>Пора повторить оценку</strong><br>Прошло 14 дней или больше с последнего теста. Откройте вкладку «Оценка».</div></div>`;
}
function renderAssessmentResultCard(result, index) {
  const isBaseline = index === 0,
    gadText = result.gadSkipped
      ? 'GAD-7 пропущен'
      : `GAD-7: ${result.gadTotal}/21 (${escapeHtml(result.gadLevel)})`;
  return `
    <div class="assessment-result-card">
      <div class="assessment-result-head">
        <div>
          <div class="assessment-result-title">${isBaseline ? 'Точка отсчета' : 'Повторная оценка'}</div>
          <div class="assessment-result-date">${formatDateTime(result.createdAt)}</div>
        </div>
        <span class="thought-badge ${isBaseline ? 'thought-badge-actionable' : 'thought-badge-parked'}">${isBaseline ? 'baseline' : 'repeat'}</span>
      </div>
      <div class="assessment-score-grid">
        <div><strong>${result.spinTotal}/68</strong><span>SPIN-17: ${escapeHtml(result.spinLevel)}</span></div>
        <div><strong>${result.gadSkipped ? '—' : result.gadTotal + '/21'}</strong><span>${gadText}</span></div>
      </div>
      <div class="assessment-impairment">
        <span>Работа: ${result.impairment.work}/10</span>
        <span>Сон: ${result.impairment.sleep}/10</span>
        <span>Общение: ${result.impairment.communication}/10</span>
        <span>Избегание: ${result.impairment.avoidance}/10</span>
      </div>
    </div>`;
}
function renderAssessmentOverview() {
  const results = getAssessmentResults();
  appRoot.innerHTML = `
    <h1 class="screen-title">Оценка состояния</h1>
    <p class="screen-subtitle">Это самонаблюдение, а не диагноз. Сравнивайте результаты с собственными прошлыми замерами.</p>
    ${renderAssessmentNotice()}
    <div class="panel">
      <div class="panel-title"><i class="fas fa-clipboard-check"></i> Повторная оценка</div>
      <p style="font-size:.82rem;color:#8a7e74;margin-bottom:12px;line-height:1.5">Тест можно пройти в любой день. Все результаты сохраняются отдельно, даже если пройти оценку дважды за один день.</p>
      <button class="button button-primary" id="start-assessment"><i class="fas fa-rotate"></i> Повторить оценку</button>
    </div>
    <div class="panel">
      <div class="panel-title"><i class="fas fa-circle-info"></i> Что делать с результатом</div>
      <p style="font-size:.82rem;color:#8a7e74;line-height:1.6">Высокий балл не означает диагноз, а низкий не отменяет трудности, если избегание мешает жизни. Если есть суицидальные мысли, самоповреждение, злоупотребление алкоголем или веществами, резкое ухудшение сна или работы, лучше обратиться к специалисту.</p>
    </div>
    <h2 style="font-size:1rem;font-weight:700;margin-bottom:12px;color:#8a7e74">История оценок</h2>
    ${results.length ? results.map(renderAssessmentResultCard).reverse().join('') : '<div class="empty-state"><i class="fas fa-clipboard-list"></i>Оценок пока нет.</div>'}`;
}
function renderAssessmentForm() {
  const isFirst = !hasAssessmentResults();
  gadAssessmentSkipped = false;
  appRoot.innerHTML = `
    <h1 class="screen-title">${isFirst ? 'Стартовая оценка' : 'Повторная оценка'}</h1>
    <p class="screen-subtitle">Оцените последние 7 дней для социальной тревоги. GAD-7 про общую тревогу можно пропустить.</p>
    <div class="assessment-alert"><i class="fas fa-shield-heart"></i><div><strong>Не диагноз</strong><br>Это ориентировочная самопроверка для отслеживания изменений.</div></div>
    <div class="panel">
      <div class="panel-title"><i class="fas fa-people-arrows"></i> Социальная тревожность — 17 пунктов</div>
      <p style="font-size:.78rem;color:#8a7e74;margin-bottom:12px">0 — нет, 4 — очень сильно.</p>
      ${renderAssessmentQuestionList('spin', SPIN_ITEMS, LIKERT_5, 4)}
    </div>
    <div class="panel" id="gad-panel">
      <div class="panel-title"><i class="fas fa-cloud"></i> Общая тревога — GAD-7</div>
      <p style="font-size:.78rem;color:#8a7e74;margin-bottom:12px">Необязательный блок. Оцените последние 2 недели.</p>
      <button class="button button-ghost button-small" id="skip-gad" style="margin-bottom:12px"><i class="fas fa-forward"></i> Пропустить GAD-7</button>
      <div id="gad-questions">${renderAssessmentQuestionList('gad', GAD_ITEMS, GAD_4, 3)}</div>
    </div>
    <div class="panel">
      <div class="panel-title"><i class="fas fa-chart-line"></i> Как тревога мешала</div>
      <p style="font-size:.78rem;color:#8a7e74;margin-bottom:12px">0 — не мешала, 10 — очень сильно мешала.</p>
      ${renderImpairmentInputs()}
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      <button class="button button-primary" id="save-assessment"><i class="fas fa-check"></i> Сохранить оценку</button>
      ${isFirst ? '' : '<button class="button button-ghost" id="cancel-assessment"><i class="fas fa-xmark"></i> Отмена</button>'}
    </div>`;
}
function renderAssessmentView() {
  assessmentMode === 'form' || !hasAssessmentResults() ? renderAssessmentForm() : renderAssessmentOverview();
}
