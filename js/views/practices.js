/* --- ПРАКТИКИ --- */
let practicesViewScreen = 'catalog';
let practicesAnimationId = null;
let practicesResizeHandler = null;
let bodyScanIntervalId = null;
let activeThoughtClouds = [];

const GROUNDING_STEPS = [
  {
    sense: 'Зрение',
    count: 5,
    prompt: 'Назовите 5 вещей, которые вы сейчас видите вокруг себя.',
    placeholder: 'Например: лампа на столе',
  },
  {
    sense: 'Осязание',
    count: 4,
    prompt: 'Назовите 4 вещи, которые вы можете потрогать.',
    placeholder: 'Например: ткань одежды',
  },
  {
    sense: 'Слух',
    count: 3,
    prompt: 'Назовите 3 звука, которые вы слышите прямо сейчас.',
    placeholder: 'Например: шум за окном',
  },
  {
    sense: 'Обоняние',
    count: 2,
    prompt: 'Назовите 2 запаха, которые вы можете почувствовать.',
    placeholder: 'Например: запах кофе',
  },
  {
    sense: 'Вкус',
    count: 1,
    prompt: 'Назовите 1 вкус, который ощущаете сейчас.',
    placeholder: 'Например: привкус чая',
  },
];

const BODY_SCAN_ZONES = [
  ['Верхняя часть головы', 'Почувствуйте вес головы, контакт с воздухом и температуру кожи.'],
  ['Лоб и лицо', 'Обратите внимание на лоб, челюсть и глаза. Могут ли они немного расслабиться?'],
  ['Шея и затылок', 'Замечайте напряжение без необходимости немедленно его менять.'],
  ['Плечи', 'Заметьте, приподняты они или опущены, напряжены или свободны.'],
  ['Грудная клетка', 'Следите, как грудная клетка расширяется и сжимается при дыхании.'],
  ['Живот', 'Позвольте ощущениям в животе быть такими, какие они есть сейчас.'],
  ['Спина и поясница', 'Почувствуйте поверхность, которая поддерживает спину.'],
  ['Руки до локтей', 'Заметьте тепло, прохладу, покалывание или пульсацию.'],
  ['Предплечья и кисти', 'Переведите внимание на ладони, пальцы и кончики пальцев.'],
  ['Бёдра', 'Заметьте давление, температуру и контакт с поверхностью.'],
  ['Голени', 'Пройдите вниманием от коленей до щиколоток.'],
  ['Стопы', 'Почувствуйте опору и поверхность под стопами.'],
];

const PRACTICE_VALUES = [
  ['family', 'Семья и близкие', 'fa-people-roof', ['Напишите короткое сообщение близкому человеку', 'Вспомните тёплое воспоминание и поблагодарите за него', 'Запланируйте 15 минут на разговор без телефона']],
  ['health', 'Здоровье', 'fa-heart-pulse', ['Выпейте стакан воды прямо сейчас', 'Сделайте 5 минут лёгкой растяжки', 'Запланируйте время для сна сегодня']],
  ['growth', 'Развитие', 'fa-seedling', ['Прочитайте одну страницу давно отложенной книги', 'Запишите один вопрос, над которым хотите подумать', 'Послушайте лекцию или подкаст 10 минут']],
  ['creative', 'Творчество', 'fa-palette', ['Рисуйте что угодно в течение 3 минут', 'Напишите 3 строки о том, что видите', 'Подберите музыку для своего текущего состояния']],
  ['nature', 'Связь с природой', 'fa-leaf', ['Найдите за окном 3 природных оттенка', 'Выйдите на улицу хотя бы на 2 минуты', 'Заметьте землю, воду или воздух вокруг себя']],
  ['help', 'Помощь другим', 'fa-hand-holding-heart', ['Подумайте, кому вы можете немного помочь', 'Сделайте маленькое доброе дело', 'Напишите кому-нибудь слова благодарности']],
  ['freedom', 'Свобода и честность', 'fa-dove', ['Запишите дело, которое откладываете из страха', 'Честно назовите одно своё ощущение', 'Спросите себя: «Что бы я сделал, если бы не боялся?»']],
  ['peace', 'Внутренний покой', 'fa-spa', ['Две минуты наблюдайте за естественным дыханием', 'Скажите себе: «Мне не нужно всё решать прямо сейчас»', 'Найдите вокруг одну вещь, вызывающую спокойствие']],
];

function getPracticeValue(valueId) {
  return PRACTICE_VALUES.find((value) => value[0] === valueId);
}

function renderPracticesView() {
  if (practicesViewScreen === 'grounding') renderGroundingPractice();
  else if (practicesViewScreen === 'clouds') renderCloudsPractice();
  else if (practicesViewScreen === 'body-scan') renderBodyScanPractice();
  else if (practicesViewScreen === 'values') renderValuesPractice();
  else renderPracticesCatalog();
}

function renderPracticesCatalog() {
  practicesViewScreen = 'catalog';
  const cards = [
    ['grounding', 'fa-hand', 'Заземление 5‑4‑3‑2‑1', 'Вернитесь в настоящий момент через органы чувств.', 'Экстренное'],
    ['clouds', 'fa-cloud', 'Облака мыслей', 'Наблюдайте за мыслями, не отождествляясь с ними.', 'Дефузия'],
    ['body-scan', 'fa-person', 'Сканирование тела', 'Пройдите вниманием по телу, замечая ощущения без оценки.', 'Осознанность'],
    ['values', 'fa-compass', 'Ценности в действии', 'Выберите важное направление и небольшой шаг к нему.', 'Действие'],
  ];
  appRoot.innerHTML = `
    <h1 class="screen-title">Практики</h1>
    <p class="screen-subtitle">Выберите одну практику под текущую задачу. Не нужно проходить всё сразу.</p>
    <div class="practice-grid">
      ${cards
        .map(
          ([id, icon, title, description, tag]) => `
            <button type="button" class="practice-card" data-open-practice="${id}">
              <span class="practice-card-head"><span class="practice-card-icon"><i class="fas ${icon}"></i></span><span class="practice-tag">${tag}</span></span>
              <strong>${title}</strong>
              <span>${description}</span>
            </button>`,
        )
        .join('')}
    </div>
    <p class="practice-catalog-note"><i class="fas fa-lock"></i> Записи хранятся только в этом браузере.</p>`;
}

function renderPracticeHeader(title, subtitle) {
  return `
    <button type="button" class="practice-back" data-practice-back><i class="fas fa-arrow-left"></i> Все практики</button>
    <h1 class="screen-title">${title}</h1>
    <p class="screen-subtitle">${subtitle}</p>`;
}

function renderGroundingPractice() {
  const state = appState.practices.grounding;
  if (state.completed) {
    appRoot.innerHTML = `
      ${renderPracticeHeader('Заземление 5‑4‑3‑2‑1', 'Возвращение к настоящему через органы чувств.')}
      <div class="panel practice-complete">
        <i class="fas fa-circle-check"></i>
        <h2>Вы здесь</h2>
        <p>Вы провели внимание через то, что видите, ощущаете и слышите прямо сейчас.</p>
        <button type="button" class="button button-primary" data-grounding-new>Начать новую практику</button>
      </div>
      ${renderPracticeHistory('Прошлые завершения', state.history)}`;
    return;
  }
  const stepIndex = Math.min(Math.max(0, state.step), GROUNDING_STEPS.length - 1);
  state.step = stepIndex;
  const step = GROUNDING_STEPS[stepIndex];
  const answers = Array.isArray(state.answers[stepIndex]) ? state.answers[stepIndex] : [];
  appRoot.innerHTML = `
    ${renderPracticeHeader('Заземление 5‑4‑3‑2‑1', 'Не торопитесь: замечайте конкретные детали вокруг себя.')}
    <div class="practice-step-meta"><span>Шаг ${stepIndex + 1} из ${GROUNDING_STEPS.length}</span><span>${step.sense}</span></div>
    <div class="practice-progress"><span style="width:${((stepIndex + 1) / GROUNDING_STEPS.length) * 100}%"></span></div>
    <div class="panel">
      <div class="panel-title"><i class="fas fa-location-dot"></i> ${step.prompt}</div>
      <div class="practice-input-list">
        ${Array.from(
          { length: step.count },
          (_, index) => `
            <label class="practice-numbered-input">
              <span>${index + 1}</span>
              <input class="text-input" data-grounding-answer="${index}" value="${escapeHtml(answers[index] || '')}" placeholder="${step.placeholder}">
            </label>`,
        ).join('')}
      </div>
    </div>
    <div class="practice-actions">
      <button type="button" class="button button-ghost" data-grounding-prev ${stepIndex === 0 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i> Назад</button>
      <button type="button" class="button button-primary" data-grounding-next>${stepIndex === GROUNDING_STEPS.length - 1 ? 'Завершить' : 'Далее'} <i class="fas fa-chevron-right"></i></button>
    </div>`;
}

function renderCloudsPractice() {
  const entries = appState.practices.clouds.entries;
  appRoot.innerHTML = `
    ${renderPracticeHeader('Облака мыслей', 'Позвольте мысли проплыть мимо, не споря с ней и не пытаясь её удалить.')}
    <canvas id="practice-clouds-canvas" class="practice-clouds-canvas" aria-label="Анимация облаков с отпускаемыми мыслями"></canvas>
    <div class="practice-cloud-form">
      <input class="text-input" id="practice-thought-input" maxlength="80" placeholder="Какая мысль сейчас тревожит?">
      <button type="button" class="button button-primary" id="practice-release-thought"><i class="fas fa-wind"></i> Отпустить</button>
    </div>
    <div class="practice-cloud-meta">
      <span>Мыслей отпущено: <strong>${entries.length}</strong></span>
      <button type="button" class="button button-ghost button-small" id="practice-clear-sky">Очистить небо</button>
    </div>
    <div class="practice-info"><i class="fas fa-circle-info"></i><span>Мысль — это событие в сознании, а не приказ и не факт. Сохранённая история доступна ниже.</span></div>
    ${renderCloudHistory(entries)}`;
}

function renderCloudHistory(entries) {
  if (!entries.length)
    return '<div class="empty-state practice-history-empty"><i class="fas fa-cloud"></i>Здесь появится история отпущенных мыслей.</div>';
  return `
    <div class="practice-history">
      <h2>История</h2>
      ${entries
        .slice()
        .reverse()
        .slice(0, 20)
        .map(
          (entry) => `
            <div class="practice-history-item">
              <span>${escapeHtml(entry.text)}</span>
              <time datetime="${escapeHtml(entry.createdAt)}">${formatDateTime(entry.createdAt)}</time>
            </div>`,
        )
        .join('')}
    </div>`;
}

function renderBodyScanPractice() {
  const state = appState.practices.bodyScan;
  if (state.completed) {
    appRoot.innerHTML = `
      ${renderPracticeHeader('Сканирование тела', 'Осознанное внимание к ощущениям без оценки.')}
      <div class="panel practice-complete">
        <i class="fas fa-heart-pulse"></i>
        <h2>Сканирование завершено</h2>
        <p>Заметьте, изменилось ли что-нибудь между началом и концом — даже совсем немного.</p>
        <button type="button" class="button button-primary" data-body-scan-new>Начать заново</button>
      </div>
      ${renderPracticeHistory('Прошлые завершения', state.history)}`;
    return;
  }
  state.current = Math.min(Math.max(0, state.current), BODY_SCAN_ZONES.length - 1);
  if (!Number.isFinite(state.timeLeft) || state.timeLeft < 1 || state.timeLeft > 15)
    state.timeLeft = 15;
  appRoot.innerHTML = `
    ${renderPracticeHeader('Сканирование тела', 'На каждую область отведено 15 секунд. Можно двигаться вручную.')}
    <div class="practice-step-meta"><span>Зона ${state.current + 1} из ${BODY_SCAN_ZONES.length}</span><span id="body-scan-status">Пауза</span></div>
    <div class="practice-progress"><span style="width:${((state.current + 1) / BODY_SCAN_ZONES.length) * 100}%"></span></div>
    <div class="body-scan-list">
      ${BODY_SCAN_ZONES.map(
        ([name, hint], index) => `
          <div class="body-scan-zone${index < state.current ? ' is-done' : ''}${index === state.current ? ' is-active' : ''}">
            <span class="body-scan-dot"></span>
            <div><strong>${name}</strong>${index === state.current ? `<span>${hint}</span>` : ''}</div>
            ${index === state.current ? `<time id="body-scan-time">${state.timeLeft}с</time>` : ''}
          </div>`,
      ).join('')}
    </div>
    <div class="practice-actions practice-actions-three">
      <button type="button" class="button button-ghost" data-body-scan-prev ${state.current === 0 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>
      <button type="button" class="button button-primary" data-body-scan-toggle><i class="fas fa-play"></i> Начать</button>
      <button type="button" class="button button-ghost" data-body-scan-next aria-label="Следующая зона"><i class="fas fa-chevron-right"></i></button>
    </div>`;
}

function renderValuesPractice() {
  const state = appState.practices.values;
  if (state.completed) {
    const latest = state.history[state.history.length - 1];
    appRoot.innerHTML = `
      ${renderPracticeHeader('Ценности в действии', 'Маленькие шаги в сторону того, что действительно важно.')}
      <div class="panel practice-complete">
        <i class="fas fa-compass"></i>
        <h2>Намерение сохранено</h2>
        <p>Направление важнее идеального выполнения.</p>
      </div>
      ${latest ? renderValueCommitment(latest.actions) : ''}
      <div class="practice-actions practice-actions-center"><button type="button" class="button button-primary" data-values-new>Выбрать новые ценности</button></div>
      ${renderPracticeHistory('Прошлые намерения', state.history)}`;
    return;
  }
  if (state.phase === 'actions') renderValueActions();
  else renderValueSelection();
}

function renderValueSelection() {
  const state = appState.practices.values;
  appRoot.innerHTML = `
    ${renderPracticeHeader('Ценности в действии', 'Выберите 2–3 направления, которые сейчас откликаются больше всего.')}
    <div class="value-practice-grid">
      ${PRACTICE_VALUES.map(
        ([id, name, icon]) => `
          <button type="button" class="value-practice-card${state.selected.includes(id) ? ' is-selected' : ''}" data-practice-value="${id}" aria-pressed="${state.selected.includes(id)}">
            <i class="fas ${icon}"></i><span>${name}</span>
          </button>`,
      ).join('')}
    </div>
    <div class="practice-selection-footer">
      <span>Выбрано: <strong>${state.selected.length}</strong> из 2–3</span>
      <button type="button" class="button button-primary" data-values-actions ${state.selected.length < 2 ? 'disabled' : ''}>Выбрать действия <i class="fas fa-chevron-right"></i></button>
    </div>`;
}

function renderValueActions() {
  const state = appState.practices.values;
  const selectedValues = state.selected.map(getPracticeValue).filter(Boolean);
  appRoot.innerHTML = `
    ${renderPracticeHeader('Один маленький шаг', 'Для каждой ценности выберите одно реалистичное действие на сегодня.')}
    ${selectedValues
      .map(
        ([id, name, icon, actions]) => `
          <fieldset class="panel value-action-group">
            <legend><i class="fas ${icon}"></i> ${name}</legend>
            ${actions
              .map(
                (action, index) => `
                  <label class="value-action-choice">
                    <input type="radio" name="value-action-${id}" value="${index}" data-value-action="${id}" ${String(state.chosen[id]) === String(index) ? 'checked' : ''}>
                    <span class="value-action-choice-body">
                      <i class="fas fa-check"></i>
                      <span>${action}</span>
                    </span>
                  </label>`,
              )
              .join('')}
          </fieldset>`,
      )
      .join('')}
    <div class="practice-actions">
      <button type="button" class="button button-ghost" data-values-reselect><i class="fas fa-chevron-left"></i> Перевыбрать</button>
      <button type="button" class="button button-primary" data-values-commit>Сохранить намерение</button>
    </div>`;
}

function renderValueCommitment(actions) {
  return `
    <div class="value-commitment-list">
      ${actions
        .map(
          (item) => `
            <div class="panel">
              <strong>${escapeHtml(item.value)}</strong>
              <span>${escapeHtml(item.action)}</span>
            </div>`,
        )
        .join('')}
    </div>`;
}

function renderPracticeHistory(title, history) {
  if (!history.length) return '';
  return `
    <div class="practice-history practice-simple-history">
      <h2>${title}</h2>
      ${history
        .slice()
        .reverse()
        .slice(0, 10)
        .map((item) => `<div class="practice-history-item"><span>${item.actions ? `${item.actions.length} действия` : 'Практика завершена'}</span><time datetime="${escapeHtml(item.completedAt)}">${formatDateTime(item.completedAt)}</time></div>`)
        .join('')}
    </div>`;
}

function bindPracticesViewEvents() {
  document.querySelectorAll('[data-open-practice]').forEach((button) =>
    button.addEventListener('click', () => openPractice(button.dataset.openPractice)),
  );
  const backButton = document.querySelector('[data-practice-back]');
  if (backButton) backButton.addEventListener('click', returnToPracticesCatalog);

  bindGroundingPracticeEvents();
  bindCloudsPracticeEvents();
  bindBodyScanPracticeEvents();
  bindValuesPracticeEvents();
}

function openPractice(screen) {
  cleanupPracticesView();
  practicesViewScreen = screen;
  renderPracticesView();
  bindCurrentViewEvents();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function returnToPracticesCatalog() {
  cleanupPracticesView();
  practicesViewScreen = 'catalog';
  renderPracticesView();
  bindCurrentViewEvents();
}

function bindGroundingPracticeEvents() {
  document.querySelectorAll('[data-grounding-answer]').forEach((input) =>
    input.addEventListener('input', function () {
      const state = appState.practices.grounding;
      if (!Array.isArray(state.answers[state.step])) state.answers[state.step] = [];
      state.answers[state.step][+this.dataset.groundingAnswer] = this.value;
      scheduleSave();
    }),
  );
  const previousButton = document.querySelector('[data-grounding-prev]');
  if (previousButton)
    previousButton.addEventListener('click', () => {
      appState.practices.grounding.step--;
      scheduleSave();
      renderPracticesView();
      bindCurrentViewEvents();
    });
  const nextButton = document.querySelector('[data-grounding-next]');
  if (nextButton)
    nextButton.addEventListener('click', () => {
      const state = appState.practices.grounding;
      if (state.step < GROUNDING_STEPS.length - 1) state.step++;
      else {
        state.history.push({
          completedAt: new Date().toISOString(),
          answers: JSON.parse(JSON.stringify(state.answers)),
        });
        state.completed = true;
        showToast('Заземление завершено');
      }
      scheduleSave();
      renderPracticesView();
      bindCurrentViewEvents();
    });
  const newButton = document.querySelector('[data-grounding-new]');
  if (newButton)
    newButton.addEventListener('click', () => {
      Object.assign(appState.practices.grounding, { step: 0, answers: [], completed: false });
      scheduleSave();
      renderPracticesView();
      bindCurrentViewEvents();
    });
}

function bindCloudsPracticeEvents() {
  const canvas = byId('practice-clouds-canvas');
  if (!canvas) return;
  resizeCloudCanvas();
  practicesResizeHandler = () => resizeCloudCanvas();
  window.addEventListener('resize', practicesResizeHandler);
  animateThoughtClouds();
  const input = byId('practice-thought-input');
  const releaseButton = byId('practice-release-thought');
  const release = () => {
    const text = input.value.trim();
    if (!text) {
      showToast('Напишите мысль, которую хотите отпустить');
      return;
    }
    const entry = { id: Date.now(), text, createdAt: new Date().toISOString() };
    appState.practices.clouds.entries.push(entry);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    activeThoughtClouds.push({
      text,
      x: reducedMotion ? canvas.getBoundingClientRect().width / 2 : -120,
      y: 55 + Math.random() * 180,
      speed: 0.35 + Math.random() * 0.35,
      opacity: 1,
      scale: 0.75 + Math.random() * 0.25,
    });
    if (reducedMotion) animateThoughtClouds();
    input.value = '';
    scheduleSave();
    const count = document.querySelector('.practice-cloud-meta strong');
    if (count) count.textContent = appState.practices.clouds.entries.length;
    const oldHistory = document.querySelector('.practice-history, .practice-history-empty');
    if (oldHistory) oldHistory.outerHTML = renderCloudHistory(appState.practices.clouds.entries);
    input.focus();
  };
  releaseButton.addEventListener('click', release);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') release();
  });
  byId('practice-clear-sky').addEventListener('click', () => {
    activeThoughtClouds = [];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) animateThoughtClouds();
  });
}

function resizeCloudCanvas() {
  const canvas = byId('practice-clouds-canvas');
  if (!canvas) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(280, canvas.getBoundingClientRect().width);
  const height = 300;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.height = `${height}px`;
  const context = canvas.getContext('2d');
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function animateThoughtClouds() {
  const canvas = byId('practice-clouds-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  const width = canvas.getBoundingClientRect().width;
  const height = 300;
  context.clearRect(0, 0, width, height);
  context.fillStyle = 'rgba(143,168,122,.2)';
  for (let index = 0; index < 24; index++) {
    context.beginPath();
    context.arc((index * 97) % width, (index * 61) % height, 1, 0, Math.PI * 2);
    context.fill();
  }
  activeThoughtClouds.forEach((cloud) => {
    cloud.x += cloud.speed;
    if (cloud.x > width * 0.65) cloud.opacity = Math.max(0, 1 - (cloud.x - width * 0.65) / (width * 0.3));
    drawThoughtCloud(context, cloud);
  });
  activeThoughtClouds = activeThoughtClouds.filter((cloud) => cloud.opacity > 0.01 && cloud.x < width + 160);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    practicesAnimationId = requestAnimationFrame(animateThoughtClouds);
}

function drawThoughtCloud(context, cloud) {
  const circles = [[0, 0, 28], [-24, 5, 20], [24, 5, 22], [-10, -13, 19], [13, -11, 20]];
  context.save();
  context.globalAlpha = cloud.opacity;
  context.fillStyle = '#514943';
  circles.forEach(([dx, dy, radius]) => {
    context.beginPath();
    context.arc(cloud.x + dx * cloud.scale, cloud.y + dy * cloud.scale, radius * cloud.scale, 0, Math.PI * 2);
    context.fill();
  });
  context.fillStyle = '#e8e0d6';
  context.font = `${Math.round(12 * cloud.scale)}px Nunito, sans-serif`;
  context.textAlign = 'center';
  let text = cloud.text;
  while (text.length > 1 && context.measureText(`${text}…`).width > 120 * cloud.scale)
    text = text.slice(0, -1);
  context.fillText(text === cloud.text ? text : `${text}…`, cloud.x, cloud.y + 42 * cloud.scale);
  context.restore();
}

function bindBodyScanPracticeEvents() {
  const toggleButton = document.querySelector('[data-body-scan-toggle]');
  if (toggleButton)
    toggleButton.addEventListener('click', () => {
      if (bodyScanIntervalId) pauseBodyScan();
      else startBodyScan();
    });
  const previousButton = document.querySelector('[data-body-scan-prev]');
  if (previousButton) previousButton.addEventListener('click', () => moveBodyScan(-1));
  const nextButton = document.querySelector('[data-body-scan-next]');
  if (nextButton) nextButton.addEventListener('click', () => moveBodyScan(1));
  const newButton = document.querySelector('[data-body-scan-new]');
  if (newButton)
    newButton.addEventListener('click', () => {
      Object.assign(appState.practices.bodyScan, { current: 0, timeLeft: 15, completed: false });
      scheduleSave();
      renderPracticesView();
      bindCurrentViewEvents();
    });
}

function startBodyScan() {
  if (bodyScanIntervalId) return;
  const button = document.querySelector('[data-body-scan-toggle]');
  const status = byId('body-scan-status');
  if (button) button.innerHTML = '<i class="fas fa-pause"></i> Пауза';
  if (status) status.textContent = 'Идёт';
  bodyScanIntervalId = setInterval(() => {
    const state = appState.practices.bodyScan;
    state.timeLeft--;
    if (state.timeLeft <= 0) moveBodyScan(1, true);
    else {
      const timer = byId('body-scan-time');
      if (timer) timer.textContent = `${state.timeLeft}с`;
      scheduleSave();
    }
  }, 1000);
}

function pauseBodyScan() {
  clearInterval(bodyScanIntervalId);
  bodyScanIntervalId = null;
  const button = document.querySelector('[data-body-scan-toggle]');
  const status = byId('body-scan-status');
  if (button) button.innerHTML = '<i class="fas fa-play"></i> Продолжить';
  if (status) status.textContent = 'Пауза';
  scheduleSave();
}

function moveBodyScan(offset, continueRunning = false) {
  const wasRunning = Boolean(bodyScanIntervalId);
  clearInterval(bodyScanIntervalId);
  bodyScanIntervalId = null;
  const state = appState.practices.bodyScan;
  const nextIndex = state.current + offset;
  if (nextIndex >= BODY_SCAN_ZONES.length) {
    state.history.push({ completedAt: new Date().toISOString() });
    state.completed = true;
    showToast('Сканирование тела завершено');
  } else state.current = Math.max(0, nextIndex);
  state.timeLeft = 15;
  scheduleSave();
  renderPracticesView();
  bindCurrentViewEvents();
  if (!state.completed && continueRunning && wasRunning) startBodyScan();
}

function bindValuesPracticeEvents() {
  document.querySelectorAll('[data-practice-value]').forEach((button) =>
    button.addEventListener('click', function () {
      const state = appState.practices.values;
      const id = this.dataset.practiceValue;
      if (state.selected.includes(id)) state.selected = state.selected.filter((valueId) => valueId !== id);
      else if (state.selected.length < 3) state.selected.push(id);
      else {
        showToast('Можно выбрать не больше трёх ценностей');
        return;
      }
      scheduleSave();
      renderPracticesView();
      bindCurrentViewEvents();
    }),
  );
  const actionsButton = document.querySelector('[data-values-actions]');
  if (actionsButton)
    actionsButton.addEventListener('click', () => {
      appState.practices.values.phase = 'actions';
      scheduleSave();
      renderPracticesView();
      bindCurrentViewEvents();
    });
  document.querySelectorAll('[data-value-action]').forEach((radio) =>
    radio.addEventListener('change', function () {
      appState.practices.values.chosen[this.dataset.valueAction] = +this.value;
      scheduleSave();
    }),
  );
  const reselectButton = document.querySelector('[data-values-reselect]');
  if (reselectButton)
    reselectButton.addEventListener('click', () => {
      appState.practices.values.phase = 'select';
      scheduleSave();
      renderPracticesView();
      bindCurrentViewEvents();
    });
  const commitButton = document.querySelector('[data-values-commit]');
  if (commitButton) commitButton.addEventListener('click', commitValueActions);
  const newButton = document.querySelector('[data-values-new]');
  if (newButton)
    newButton.addEventListener('click', () => {
      Object.assign(appState.practices.values, {
        phase: 'select',
        selected: [],
        chosen: {},
        completed: false,
      });
      scheduleSave();
      renderPracticesView();
      bindCurrentViewEvents();
    });
}

function commitValueActions() {
  const state = appState.practices.values;
  if (state.selected.some((id) => !Number.isInteger(state.chosen[id]))) {
    showToast('Выберите действие для каждой ценности');
    return;
  }
  const actions = state.selected.map((id) => {
    const value = getPracticeValue(id);
    return { value: value[1], action: value[3][state.chosen[id]] };
  });
  state.history.push({ completedAt: new Date().toISOString(), actions });
  state.completed = true;
  scheduleSave();
  showToast('Намерение сохранено');
  renderPracticesView();
  bindCurrentViewEvents();
}

function cleanupPracticesView() {
  if (practicesAnimationId) cancelAnimationFrame(practicesAnimationId);
  practicesAnimationId = null;
  if (practicesResizeHandler) window.removeEventListener('resize', practicesResizeHandler);
  practicesResizeHandler = null;
  if (bodyScanIntervalId) clearInterval(bodyScanIntervalId);
  bodyScanIntervalId = null;
  activeThoughtClouds = [];
}
