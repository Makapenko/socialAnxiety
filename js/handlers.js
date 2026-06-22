/* ========== ОБРАБОТЧИКИ ========== */
function bindCurrentViewEvents() {
  /* Шкалы */
  document.querySelectorAll('.anxiety-score-button').forEach((d) =>
    d.addEventListener('click', function () {
      const scaleName = this.dataset.sn,
        scaleValue = +this.dataset.sv;
      this.parentElement
        .querySelectorAll('.anxiety-score-button')
        .forEach((x) => x.classList.remove('is-active'));
      this.classList.add('is-active');
      handleAnxietyScaleChange(scaleName, scaleValue);
    }),
  );

  /* Примеры */
  document.querySelectorAll('.example-toggle').forEach((b) =>
    b.addEventListener('click', function () {
      const bl = byId('ex-' + this.dataset.et);
      bl.classList.toggle('is-expanded');
      this.innerHTML = bl.classList.contains('is-expanded')
        ? '<i class="fas fa-lightbulb"></i> Скрыть пример'
        : '<i class="fas fa-lightbulb"></i> Показать пример';
    }),
  );

  /* Оценка состояния */
  document.querySelectorAll('.assessment-option').forEach((button) =>
    button.addEventListener('click', function () {
      document
        .querySelectorAll(`[data-assessment-scale="${this.dataset.assessmentScale}"]`)
        .forEach((option) => option.classList.remove('is-active'));
      this.classList.add('is-active');
    }),
  );
  const startAssessmentButton = byId('start-assessment');
  if (startAssessmentButton)
    startAssessmentButton.addEventListener('click', () => {
      assessmentMode = 'form';
      renderAssessmentView();
      bindCurrentViewEvents();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  const cancelAssessmentButton = byId('cancel-assessment');
  if (cancelAssessmentButton)
    cancelAssessmentButton.addEventListener('click', () => {
      assessmentMode = 'overview';
      renderAssessmentView();
      bindCurrentViewEvents();
    });
  const skipGadButton = byId('skip-gad');
  if (skipGadButton)
    skipGadButton.addEventListener('click', () => {
      gadAssessmentSkipped = true;
      const questions = byId('gad-questions');
      if (questions) questions.style.display = 'none';
      skipGadButton.innerHTML = '<i class="fas fa-check"></i> GAD-7 пропущен';
      skipGadButton.classList.remove('button-ghost');
      skipGadButton.classList.add('button-primary');
    });
  const saveAssessmentButton = byId('save-assessment');
  if (saveAssessmentButton)
    saveAssessmentButton.addEventListener('click', () => {
      saveAssessmentResult();
    });

  /* Поля ввода — автосохранение */
  document.querySelectorAll('[data-f]').forEach((el) =>
    el.addEventListener('input', function () {
      handleDailyFieldInput(this.dataset.f, this.value);
    }),
  );

  /* Чекбоксы */
  document.querySelectorAll('[data-ck]').forEach((el) =>
    el.addEventListener('click', function () {
      const l = getDailyLog(getTodayKey());
      if (this.dataset.ck === 'b1') l.b1.done = !l.b1.done;
      else l.b2.done = !l.b2.done;
      scheduleSave();
      this.classList.toggle('is-active');
    }),
  );

  /* Добавить запись дневника */
  const addDiaryButton = byId('add-d');
  if (addDiaryButton)
    addDiaryButton.addEventListener('click', function () {
      const diaryWhat = byId('d-what').value.trim(),
        diaryFear = byId('d-fear').value.trim(),
        diaryAction = byId('d-did').value.trim(),
        diaryFact = byId('d-fact').value.trim();
      const selectedAnxietyButton = document.querySelector('[data-sn="d-anx"] .anxiety-score-button.is-active');
      if (!diaryWhat) {
        showToast('Укажите, что произошло');
        return;
      }
      appState.diary.push({
        id: Date.now(),
        date: getTodayKey(),
        what: diaryWhat,
        fear: diaryFear,
        anx: selectedAnxietyButton ? +selectedAnxietyButton.dataset.sv : null,
        did: diaryAction,
        fact: diaryFact,
      });
      scheduleSave();
      showToast('Запись добавлена');
      renderDiaryView();
      bindCurrentViewEvents();
    });

  /* Удалить запись дневника */
  document.querySelectorAll('[data-dd]').forEach((b) =>
    b.addEventListener('click', function () {
      appState.diary = appState.diary.filter((e) => e.id !== +this.dataset.dd);
      scheduleSave();
      showToast('Удалено');
      renderDiaryView();
      bindCurrentViewEvents();
    }),
  );

  /* Добавить действие */
  const addActionButton = byId('add-a');
  if (addActionButton)
    addActionButton.addEventListener('click', function () {
      const actionText = byId('na-t').value.trim(),
        selectedAnxietyButton = document.querySelector('[data-sn="na-a"] .anxiety-score-button.is-active');
      if (!actionText) {
        showToast('Введите описание');
        return;
      }
      appState.actions.push({
        id: Date.now(),
        text: actionText,
        anxiety: selectedAnxietyButton ? +selectedAnxietyButton.dataset.sv : 5,
      });
      scheduleSave();
      showToast('Добавлено');
      renderActionsView();
      bindCurrentViewEvents();
    });

  /* Удалить действие */
  document.querySelectorAll('[data-da]').forEach((b) =>
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      appState.actions = appState.actions.filter((a) => a.id !== +this.dataset.da);
      scheduleSave();
      renderActionsView();
      bindCurrentViewEvents();
    }),
  );

  /* Клик по действию для редактирования */
  document.querySelectorAll('[data-aid]').forEach((el) =>
    el.addEventListener('click', function (e) {
      if (e.target.closest('.delete-icon-button')) return;
      const id = +this.dataset.aid,
        a = appState.actions.find((x) => x.id === id);
      if (!a) return;
      document.querySelectorAll('.action-item').forEach((x) => {
        x.style.outline = 'none';
      });
      this.style.outline = '2px solid rgba(143,168,122,.5)';
      this.style.outlineOffset = '1px';
      selectedActionId = id;
      const info = byId('ea-info');
      if (info) {
        info.innerHTML = `<span style="color:#e8e0d6">«${escapeHtml(a.text)}»</span> — сейчас: <span style="color:#8fa87a;font-weight:700">${a.anxiety}/10</span>`;
      }
      document
        .querySelectorAll('[data-sn="ea-a"] .anxiety-score-button')
        .forEach((d) => d.classList.toggle('is-active', +d.dataset.sv === a.anxiety));
    }),
  );

  /* Категории мыслей */
  document.querySelectorAll('.worry-category-button').forEach((b) =>
    b.addEventListener('click', function () {
      document.querySelectorAll('.worry-category-button').forEach((x) => {
        x.style.background = 'transparent';
        x.style.color = '#8a7e74';
        x.style.borderColor = '#342e29';
        x.classList.remove('is-active');
      });
      this.classList.add('is-active');
      const c = this.dataset.wc;
      if (c === 'a') {
        this.style.background = 'rgba(143,168,122,.15)';
        this.style.color = '#8fa87a';
        this.style.borderColor = 'rgba(143,168,122,.3)';
        byId('wt-aw').style.display = 'block';
      } else {
        this.style.background = 'rgba(196,122,108,.15)';
        this.style.color = '#c47a6c';
        this.style.borderColor = 'rgba(196,122,108,.3)';
        byId('wt-aw').style.display = 'none';
      }
    }),
  );

  /* Добавить мысль */
  const addWorryThoughtButton = byId('add-wt');
  if (addWorryThoughtButton)
    addWorryThoughtButton.addEventListener('click', function () {
      const thoughtText = byId('wt-t').value.trim();
      if (!thoughtText) {
        showToast('Запишите мысль');
        return;
      }
      const selectedCategoryButton = document.querySelector('.worry-category-button.is-active'),
        thoughtCategory = selectedCategoryButton ? selectedCategoryButton.dataset.wc : 'c';
      const actionStep = thoughtCategory === 'a' ? byId('wt-a').value.trim() : '';
      appState.worry.push({ id: Date.now(), text: thoughtText, cat: thoughtCategory, act: actionStep });
      scheduleSave();
      showToast('Добавлено');
      renderThoughtsView();
      bindCurrentViewEvents();
    });

  /* Удалить мысль */
  document.querySelectorAll('[data-dt]').forEach((b) =>
    b.addEventListener('click', function () {
      appState.worry = appState.worry.filter((t) => t.id !== +this.dataset.dt);
      scheduleSave();
      renderThoughtsView();
      bindCurrentViewEvents();
    }),
  );

  /* Таймер мыслей */
  const worryStartButton = byId('w-go'),
    worryPauseButton = byId('w-pa'),
    worryResetButton = byId('w-re');
  if (worryStartButton)
    worryStartButton.addEventListener('click', () => {
      if (worryTimerId) return;
      worryTimerId = setInterval(() => {
        worrySecondsRemaining--;
        if (worrySecondsRemaining <= 0) {
          worrySecondsRemaining = 0;
          clearInterval(worryTimerId);
          worryTimerId = null;
          showToast('Время вышло. Оставьте мысли до завтра.');
        }
        updateWorryTimerDisplay();
      }, 1000);
    });
  if (worryPauseButton)
    worryPauseButton.addEventListener('click', () => {
      if (worryTimerId) {
        clearInterval(worryTimerId);
        worryTimerId = null;
      }
    });
  if (worryResetButton)
    worryResetButton.addEventListener('click', () => {
      clearInterval(worryTimerId);
      worryTimerId = null;
      worrySecondsRemaining = worryTotalSeconds;
      updateWorryTimerDisplay();
    });

  /* Дыхание */
  const breathingToggleButton = byId('b-tog');
  if (breathingToggleButton)
    breathingToggleButton.addEventListener('click', () => {
      breathingRunning ? stopBreathingExercise() : startBreathingExercise();
    });

  /* Счётчики здоровья — обновляем без полного перерендера */
  document.querySelectorAll('[data-hc]').forEach((b) =>
    b.addEventListener('click', function () {
      const k = this.dataset.hc,
        d = parseFloat(this.dataset.hd),
        h = getHealthLog(getTodayKey());
      if (k === 'caf') h.caf = Math.max(0, h.caf + d);
      else if (k === 'sleep')
        h.sleep =
          h.sleep == null
            ? Math.max(0, d)
            : Math.max(0, Math.min(16, +(h.sleep + d).toFixed(1)));
      else if (k === 'mov') h.mov = Math.max(0, h.mov + d);
      scheduleSave();
      /* Обновляем только цифру */
      const ve = byId('v-' + k);
      if (ve)
        ve.textContent =
          k === 'sleep' ? (h.sleep != null ? h.sleep : '—') : h[k];
    }),
  );
}

/* Логика шкал */
function handleAnxietyScaleChange(scaleName, scaleValue) {
  const l = getDailyLog(getTodayKey());
  if (scaleName === 'bw-a') l.bw.a = scaleValue;
  else if (scaleName === 'aw-a') l.aw.a = scaleValue;
  else if (scaleName === 'ea-a' && selectedActionId != null) {
    const a = appState.actions.find((x) => x.id === selectedActionId);
    if (a) {
      a.anxiety = scaleValue;
      const info = byId('ea-info');
      if (info)
        info.innerHTML = `<span style="color:#e8e0d6">«${escapeHtml(a.text)}»</span> — сейчас: <span style="color:#8fa87a;font-weight:700">${scaleValue}/10</span>`;
      const item = document.querySelector(`[data-aid="${a.id}"] .action-anxiety`);
      if (item) item.textContent = scaleValue + '/10';
      document.querySelectorAll('.action-item').forEach((el) => {
        const id = +el.dataset.aid,
          act = appState.actions.find((x) => x.id === id);
        if (act)
          el.classList.toggle('is-recommended', act.anxiety >= 3 && act.anxiety <= 4);
      });
    }
  }
  scheduleSave();
}

/* Логика полей */
function handleDailyFieldInput(fieldName, fieldValue) {
  const l = getDailyLog(getTodayKey());
  const map = {
    'bw-act': 'bw.act',
    'bw-pred': 'bw.pred',
    'b1-n': 'b1.notes',
    'b2-n': 'b2.notes',
    'aw-did': 'aw.did',
    'aw-fact': 'aw.fact',
    'aw-prot': 'aw.prot',
    'aw-next': 'aw.next',
  };
  const path = map[fieldName];
  if (!path) return;
  const parts = path.split('.');
  l[parts[0]][parts[1]] = fieldValue;
  scheduleSave();
}

function getSelectedAssessmentValue(scaleName) {
  const button = document.querySelector(`[data-assessment-scale="${scaleName}"].assessment-option.is-active`);
  return button ? +button.dataset.assessmentValue : null;
}
function getSelectedAnxietyValue(scaleName) {
  const button = document.querySelector(`[data-sn="${scaleName}"] .anxiety-score-button.is-active`);
  return button ? +button.dataset.sv : null;
}
function saveAssessmentResult() {
  const spinAnswers = SPIN_ITEMS.map((_, index) => getSelectedAssessmentValue(`spin-${index}`));
  if (spinAnswers.some((value) => value == null)) {
    showToast('Ответьте на все 17 пунктов социальной тревоги');
    return;
  }
  let gadAnswers = [],
    gadTotal = null,
    gadLevel = '',
    gadSkipped = gadAssessmentSkipped;
  if (!gadSkipped) {
    gadAnswers = GAD_ITEMS.map((_, index) => getSelectedAssessmentValue(`gad-${index}`));
    if (gadAnswers.some((value) => value == null)) {
      showToast('Пройдите GAD-7 или нажмите «Пропустить GAD-7»');
      return;
    }
    gadTotal = gadAnswers.reduce((sum, value) => sum + value, 0);
    gadLevel = getGadLevel(gadTotal);
  }
  const impairment = {};
  for (const item of IMPAIRMENT_ITEMS) {
    const value = getSelectedAnxietyValue(`imp-${item.key}`);
    if (value == null) {
      showToast('Оцените, как тревога мешала в 4 областях');
      return;
    }
    impairment[item.key] = value;
  }
  const results = getAssessmentResults(),
    spinTotal = spinAnswers.reduce((sum, value) => sum + value, 0),
    now = new Date();
  results.push({
    id: `${Date.now()}-${Math.round(Math.random() * 100000)}`,
    createdAt: now.toISOString(),
    date: getTodayKey(),
    spinTotal,
    spinAnswers,
    spinLevel: getSpinLevel(spinTotal),
    gadTotal,
    gadAnswers,
    gadLevel,
    gadSkipped,
    impairment,
    kind: results.length ? 'repeat' : 'baseline',
  });
  assessmentMode = 'overview';
  scheduleSave();
  showToast(results.length === 1 ? 'Точка отсчета сохранена' : 'Повторная оценка сохранена');
  renderAssessmentView();
  bindCurrentViewEvents();
}

/* Таймер мыслей — обновление дисплея */
function updateWorryTimerDisplay() {
  const minutes = Math.floor(worrySecondsRemaining / 60),
    seconds = worrySecondsRemaining % 60,
    timerTextElement = byId('w-time');
  if (timerTextElement)
    timerTextElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progress = worryTotalSeconds > 0 ? 1 - worrySecondsRemaining / worryTotalSeconds : 0,
    circleLength = 2 * Math.PI * 58,
    progressCircle = document.querySelector('.timer-ring-progress');
  if (progressCircle) progressCircle.setAttribute('stroke-dashoffset', circleLength * (1 - progress));
}

/* Дыхание */
function getBreathingElapsedSeconds() {
  return breathingStartedAt ? Math.floor((Date.now() - breathingStartedAt) / 1000) : 0;
}
function updateBreathingTimerDisplay() {
  const elapsedSeconds = getBreathingElapsedSeconds(),
    timerTextElement = byId('b-time');
  if (timerTextElement) {
    timerTextElement.textContent = formatTimer(elapsedSeconds);
    timerTextElement.classList.toggle('is-ready', elapsedSeconds >= BREATHING_READY_SECONDS);
    timerTextElement.classList.add('is-visible');
  }
}
function getBreathingPhaseIndex(elapsedSeconds) {
  const cycleDuration = BREATHING_PHASES.reduce((sum, phase) => sum + phase.d, 0) / 1000;
  let cycleSeconds = elapsedSeconds % cycleDuration;
  for (let i = 0; i < BREATHING_PHASES.length; i++) {
    const phaseSeconds = BREATHING_PHASES[i].d / 1000;
    if (cycleSeconds < phaseSeconds) return i;
    cycleSeconds -= phaseSeconds;
  }
  return 0;
}
function updateBreathingExerciseDisplay() {
  const elapsedSeconds = getBreathingElapsedSeconds(),
    nextPhaseIndex = getBreathingPhaseIndex(elapsedSeconds),
    breathingCircle = byId('bc');
  breathingPhaseIndex = nextPhaseIndex;
  if (breathingCircle) breathingCircle.textContent = BREATHING_PHASES[breathingPhaseIndex].t;
  updateBreathingTimerDisplay();
}
function saveBreathingSession() {
  const elapsedSeconds = getBreathingElapsedSeconds();
  if (elapsedSeconds <= 0) return;
  const dailyLog = getDailyLog(breathingSessionDate || getTodayKey());
  dailyLog.breathingSeconds += elapsedSeconds;
  scheduleSave();
  const totalElement = byId('b-total');
  if (totalElement && (breathingSessionDate || getTodayKey()) === getTodayKey())
    totalElement.textContent = formatDuration(dailyLog.breathingSeconds);
  const weeklyTotalElement = byId('v-breath');
  if (weeklyTotalElement && (breathingSessionDate || getTodayKey()) === getTodayKey())
    weeklyTotalElement.textContent = formatDuration(dailyLog.breathingSeconds);
}
function startBreathingExercise() {
  if (breathingRunning) return;
  breathingRunning = true;
  breathingPhaseIndex = 0;
  breathingStartedAt = Date.now();
  breathingSessionDate = getTodayKey();
  const breathingCircle = byId('bc');
  if (breathingCircle) {
    breathingCircle.classList.add('is-breathing-active');
    breathingCircle.textContent = BREATHING_PHASES[0].t;
  }
  updateBreathingExerciseDisplay();
  breathingIntervalId = setInterval(() => {
    updateBreathingExerciseDisplay();
  }, 1000);
  const breathingToggleButton = byId('b-tog');
  if (breathingToggleButton) breathingToggleButton.innerHTML = '<i class="fas fa-stop"></i> Завершить';
}
function stopBreathingExercise() {
  if (!breathingRunning) return;
  saveBreathingSession();
  breathingRunning = false;
  clearInterval(breathingIntervalId);
  breathingIntervalId = null;
  breathingStartedAt = null;
  breathingSessionDate = null;
  const breathingCircle = byId('bc');
  if (breathingCircle) {
    breathingCircle.classList.remove('is-breathing-active');
    breathingCircle.textContent = 'Старт';
  }
  const timerTextElement = byId('b-time');
  if (timerTextElement) {
    timerTextElement.textContent = formatTimer(0);
    timerTextElement.classList.remove('is-visible', 'is-ready');
  }
  const breathingToggleButton = byId('b-tog');
  if (breathingToggleButton) breathingToggleButton.innerHTML = '<i class="fas fa-play"></i> Начать';
}

/* ========== НАВИГАЦИЯ ========== */
function initializeNavigation() {
  document.querySelectorAll('#bottom-nav button').forEach((navButton) =>
    navButton.addEventListener('click', function () {
      const nextTab = this.dataset.tab;
      if (nextTab === activeTab) return;
      if (!hasAssessmentResults() && nextTab !== 'assessment') {
        showToast('Сначала сохраните стартовую оценку');
        syncNavigationActiveState();
        return;
      }
      if (worryTimerId) {
        clearInterval(worryTimerId);
        worryTimerId = null;
      }
      if (breathingRunning) stopBreathingExercise();
      activeTab = nextTab;
      syncNavigationActiveState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderApp();
    }),
  );
}
function syncNavigationActiveState() {
  document
    .querySelectorAll('#bottom-nav button')
    .forEach((button) => button.classList.toggle('is-active', button.dataset.tab === activeTab));
}
