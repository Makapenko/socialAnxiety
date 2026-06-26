/* --- ДЕЙСТВИЯ --- */
let selectedActionId = null;
let actionsViewSection = 'situations';
let draggedActionId = null;

const SAFETY_BEHAVIOR_EXAMPLES = [
  'Избегаю взгляда',
  'Заранее репетирую фразы',
  'Говорю тише обычного',
  'Прячусь в телефоне',
  'Стою ближе к выходу',
  'Слишком много извиняюсь',
  'Чрезмерно объясняю себя',
  'Проверяю лицо, руки или голос',
  'Молчу, чтобы не ошибиться',
  'Преждевременно завершаю разговор',
];

function renderActionsEducation() {
  return `
    <div class="actions-education">
      <div class="actions-education-title"><i class="fas fa-route"></i> Для чего нужна эта карта</div>
      <p>Ситуации показывают, где тревога ограничивает жизнь. Защитные поведения показывают, что вы делаете, чтобы не допустить предполагаемой неловкости.</p>
      <p>Сейчас задача — замечать и записывать паттерны, а не заставлять себя резко отказываться от них. Позже эта карта поможет выбирать небольшие и реалистичные упражнения.</p>
    </div>`;
}

function renderSituationProgress() {
  const target = 15,
    count = appState.actions.length,
    levels = [
      { label: '1–2', found: appState.actions.some((a) => a.anxiety >= 1 && a.anxiety <= 2) },
      { label: '3–4', found: appState.actions.some((a) => a.anxiety >= 3 && a.anxiety <= 4) },
      { label: '5–7', found: appState.actions.some((a) => a.anxiety >= 5 && a.anxiety <= 7) },
      { label: '8–10', found: appState.actions.some((a) => a.anxiety >= 8 && a.anxiety <= 10) },
    ];
  return `
    <div class="actions-progress" id="situation-progress">
      <div class="actions-progress-head"><strong>Собрано ${count} из ${target}</strong><span>${Math.min(100, Math.round((count / target) * 100))}%</span></div>
      <div class="actions-progress-track"><span style="width:${Math.min(100, (count / target) * 100)}%"></span></div>
      <div class="actions-levels">
        ${levels.map((level) => `<span class="${level.found ? 'is-filled' : ''}"><i class="fas ${level.found ? 'fa-check' : 'fa-minus'}"></i> ${level.label}/10</span>`).join('')}
      </div>
    </div>`;
}

function renderSituationList() {
  if (!appState.actions.length)
    return '<div class="empty-state"><i class="fas fa-list-check"></i>Список пока пуст. Добавьте первую избегаемую ситуацию.</div>';
  return appState.actions
    .map(
      (action, index) => `
        <div class="action-item" data-aid="${action.id}" draggable="true">
          <button type="button" class="action-drag-handle" aria-label="Перетащить ситуацию" title="Перетащить"><i class="fas fa-grip-vertical"></i></button>
          <span class="action-number">${index + 1}</span>
          <span class="action-text">${escapeHtml(action.text)}</span>
          <span class="action-anxiety">${action.anxiety}/10</span>
          <div class="action-order-buttons" aria-label="Изменить порядок">
            <button type="button" data-move-action="${action.id}" data-direction="-1" aria-label="Переместить выше" ${index === 0 ? 'disabled' : ''}><i class="fas fa-chevron-up"></i></button>
            <button type="button" data-move-action="${action.id}" data-direction="1" aria-label="Переместить ниже" ${index === appState.actions.length - 1 ? 'disabled' : ''}><i class="fas fa-chevron-down"></i></button>
          </div>
          <button class="delete-icon-button" data-da="${action.id}" aria-label="Удалить ситуацию"><i class="fas fa-xmark"></i></button>
        </div>`,
    )
    .join('');
}

function renderSituationsSection() {
  return `
    <p class="actions-section-intro">Запишите ситуации, которые вы избегаете, откладываете или переносите только с сильным напряжением. Для рабочей лестницы полезны ситуации разной сложности.</p>
    ${renderSituationProgress()}
    <div class="panel">
      <div class="panel-title"><i class="fas fa-plus-circle"></i> Добавить ситуацию</div>
      <input class="text-input" id="na-t" placeholder="Например: высказать своё мнение">
      <div class="field-label actions-field-spacing">Предполагаемая тревога</div>
      ${renderAnxietyScale('na-a', null)}
      <button class="button button-primary button-small actions-add-button" id="add-a"><i class="fas fa-plus"></i> Добавить</button>
      ${renderExampleToggle('situations', '<strong>Примеры:</strong> позвонить по бытовому вопросу; поесть рядом с коллегами; попросить о помощи; войти в уже разговаривающую группу; высказать своё мнение.')}
    </div>
    <div class="actions-list-heading">
      <div><strong>Лестница ситуаций</strong><span>Перетаскивайте пункты, чтобы задать удобный порядок.</span></div>
      <i class="fas fa-arrow-down-short-wide"></i>
    </div>
    <div id="actions-sortable-list">${renderSituationList()}</div>
    <div class="panel actions-edit-panel">
      <div class="panel-title"><i class="fas fa-pencil"></i> Изменить оценку тревоги</div>
      <p class="actions-help-text">Нажмите на ситуацию выше, затем выберите новую оценку:</p>
      <div id="ea-info" class="actions-edit-info">Не выбрано</div>
      ${renderAnxietyScale('ea-a', null)}
    </div>`;
}

function renderSafetyProgress() {
  const count = appState.safetyBehaviors.length,
    target = 5;
  return `
    <div class="actions-progress">
      <div class="actions-progress-head"><strong>Найдено ${count} из ${target}</strong><span>ориентир: 5–10</span></div>
      <div class="actions-progress-track"><span style="width:${Math.min(100, (count / target) * 100)}%"></span></div>
    </div>`;
}

function renderSafetyBehaviorsList() {
  if (!appState.safetyBehaviors.length)
    return '<div class="empty-state"><i class="fas fa-shield-halved"></i>Пока ничего не записано. Начните с поведения, которое замечаете чаще всего.</div>';
  return appState.safetyBehaviors
    .map(
      (behavior) => `
        <div class="safety-behavior-item">
          <i class="fas fa-shield"></i>
          <span>${escapeHtml(behavior.text)}</span>
          <button class="delete-icon-button" data-dsb="${behavior.id}" aria-label="Удалить защитное поведение"><i class="fas fa-xmark"></i></button>
        </div>`,
    )
    .join('');
}

function renderSafetyBehaviorsSection() {
  const existing = new Set(appState.safetyBehaviors.map((behavior) => behavior.text.toLocaleLowerCase('ru')));
  return `
    <p class="actions-section-intro">Защитные поведения дают краткое облегчение, но могут поддерживать ощущение, что общение опасно без специальных мер. Пока достаточно научиться их замечать.</p>
    <div class="preparation-note"><i class="fas fa-binoculars"></i><div><strong>Режим наблюдения</strong><span>Не нужно убирать все защитные действия сразу. Записывайте то, что действительно происходит.</span></div></div>
    ${renderSafetyProgress()}
    <div class="panel">
      <div class="panel-title"><i class="fas fa-plus-circle"></i> Добавить своё поведение</div>
      <input class="text-input" id="nsb-t" placeholder="Например: заранее репетирую ответ">
      <button class="button button-primary button-small actions-add-button" id="add-sb"><i class="fas fa-plus"></i> Добавить</button>
    </div>
    <div class="actions-list-heading"><div><strong>Мои защитные поведения</strong><span>Ориентир для карты — 5–10 повторяющихся действий.</span></div><i class="fas fa-shield-halved"></i></div>
    <div id="safety-behaviors-list">${renderSafetyBehaviorsList()}</div>
    <div class="panel actions-examples-panel">
      <div class="panel-title"><i class="fas fa-lightbulb"></i> Примеры</div>
      <p class="actions-help-text">Нажмите на подходящий пример, чтобы добавить его в свой список.</p>
      <div class="safety-example-chips">
        ${SAFETY_BEHAVIOR_EXAMPLES.map((example) => {
          const isAdded = existing.has(example.toLocaleLowerCase('ru'));
          return `<button type="button" data-safety-example="${escapeHtml(example)}" class="${isAdded ? 'is-added' : ''}" ${isAdded ? 'disabled' : ''}><i class="fas ${isAdded ? 'fa-check' : 'fa-plus'}"></i> ${escapeHtml(example)}</button>`;
        }).join('')}
      </div>
    </div>`;
}

function renderActionsView() {
  appRoot.innerHTML = `
    <h1 class="screen-title">Моя карта тревоги</h1>
    <p class="screen-subtitle">Соберите две части карты: ситуации, которых вы избегаете, и способы, которыми стараетесь чувствовать себя безопаснее.</p>
    ${renderActionsEducation()}
    <div class="actions-section-tabs" role="tablist" aria-label="Раздел карты тревоги">
      <button type="button" role="tab" data-actions-section="situations" aria-selected="${actionsViewSection === 'situations'}" class="${actionsViewSection === 'situations' ? 'is-active' : ''}"><i class="fas fa-list-ol"></i><span>Ситуации</span><small>${appState.actions.length}</small></button>
      <button type="button" role="tab" data-actions-section="safety" aria-selected="${actionsViewSection === 'safety'}" class="${actionsViewSection === 'safety' ? 'is-active' : ''}"><i class="fas fa-shield-halved"></i><span>Защитные поведения</span><small>${appState.safetyBehaviors.length}</small></button>
    </div>
    <div role="tabpanel">${actionsViewSection === 'situations' ? renderSituationsSection() : renderSafetyBehaviorsSection()}</div>`;
  selectedActionId = null;
  draggedActionId = null;
}
