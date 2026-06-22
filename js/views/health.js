/* --- ЗДОРОВЬЕ --- */
let breathingRunning = false,
  breathingIntervalId = null,
  breathingPhaseIndex = 0,
  breathingStartedAt = null,
  breathingSessionDate = null;
const BREATHING_READY_SECONDS = 120;
const BREATHING_PHASES = [
  { t: 'Вдох', d: 4000 },
  { t: 'Задержка', d: 2000 },
  { t: 'Выдох', d: 6000 },
  { t: 'Задержка', d: 2000 },
];
function renderHealthView() {
  const d = getTodayKey(),
    h = getHealthLog(d),
    l = getDailyLog(d),
    currentBreathingSeconds = breathingRunning ? getBreathingElapsedSeconds() : 0;
  let hh = '';
  for (let i = 6; i >= 0; i--) {
    const dt = new Date();
    dt.setDate(dt.getDate() - i);
    const ds = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    const hi = getHealthLog(ds),
      li = getDailyLog(ds);
    const isT = ds === d;
    const dn = dt.toLocaleDateString('ru', { weekday: 'short' });
    hh += `<div style="min-width:70px;text-align:center;padding:10px 6px;border-radius:10px;background:${isT ? 'rgba(143,168,122,.1)' : '#181412'};border:1px solid ${isT ? 'rgba(143,168,122,.25)' : 'transparent'}"><div style="font-size:.65rem;color:#5a524b;font-weight:700;margin-bottom:6px">${dn}</div><div style="font-size:.7rem;color:#c47a6c;margin-bottom:2px">${hi.caf > 0 ? hi.caf + ' ' : '—'}</div><div style="font-size:.7rem;color:#8fa87a;margin-bottom:2px">${hi.sleep != null ? hi.sleep + 'ч' : '—'}</div><div style="font-size:.7rem;color:#e8e0d6;margin-bottom:2px">${hi.mov > 0 ? hi.mov + 'м' : '—'}</div><div${isT ? ' id="v-breath"' : ''} style="font-size:.7rem;color:#d8b66f">${li.breathingSeconds > 0 ? formatDuration(li.breathingSeconds) : '—'}</div></div>`;
  }
  appRoot.innerHTML = `
    <div class="date-badge"><i class="fas fa-calendar-day"></i> ${formatDate(d)}</div>
    <h1 class="screen-title">Снижение тревожности</h1>
    <p class="screen-subtitle">Физическое состояние влияет на тревогу. Эти простые действия имеют накопительный эффект.</p>
    <div class="panel" style="text-align:center"><div class="panel-title" style="justify-content:center"><i class="fas fa-wind"></i> Дыхательное упражнение</div>
        <p style="font-size:.78rem;color:#8a7e74;margin-bottom:8px">Спокойный вдох, чуть более длинный выдох. 2–3 минуты.</p>
        <div class="breathing-circle-wrap"><div class="breathing-circle${breathingRunning ? ' is-breathing-active' : ''}" id="bc">${breathingRunning ? BREATHING_PHASES[breathingPhaseIndex].t : 'Старт'}</div></div>
        <div class="breathing-timer${currentBreathingSeconds >= BREATHING_READY_SECONDS ? ' is-ready' : ''}${breathingRunning ? ' is-visible' : ''}" id="b-time">${formatTimer(currentBreathingSeconds)}</div>
        <div style="display:flex;gap:8px;justify-content:center"><button class="button button-primary button-small" id="b-tog"><i class="fas fa-${breathingRunning ? 'stop' : 'play'}"></i> ${breathingRunning ? 'Завершить' : 'Начать'}</button></div>
        <p class="breathing-total">Сегодня дыхание: <span id="b-total">${formatDuration(l.breathingSeconds)}</span></p>
        <p style="font-size:.7rem;color:#5a524b;margin-top:10px">Не используйте как обязательный ритуал перед каждым разговором</p>
    </div>
    <div class="panel"><div class="panel-title"><i class="fas fa-mug-saucer"></i> Кофеин сегодня</div>
        <p style="font-size:.78rem;color:#8a7e74;margin-bottom:12px">Кофе, крепкий чай, кола, энергетики усиливают сердцебиение и дрожь. Снижайте постепенно.</p>
        <div class="health-counter"><button class="counter-button" data-hc="caf" data-hd="-1"><i class="fas fa-minus"></i></button><div class="counter-value" style="color:#c47a6c" id="v-caf">${h.caf}</div><button class="counter-button" data-hc="caf" data-hd="1"><i class="fas fa-plus"></i></button><span style="font-size:.8rem;color:#8a7e74;margin-left:4px">порций</span></div>
    </div>
    <div class="panel"><div class="panel-title"><i class="fas fa-bed"></i> Сон прошлой ночью</div>
        <p style="font-size:.78rem;color:#8a7e74;margin-bottom:12px">При 6-дневной неделе сон важнее длинных упражнений. Не сокращайте его.</p>
        <div class="health-counter"><button class="counter-button" data-hc="sleep" data-hd="-0.5"><i class="fas fa-minus"></i></button><div class="counter-value" style="color:#8fa87a" id="v-sleep">${h.sleep != null ? h.sleep : '—'}</div><button class="counter-button" data-hc="sleep" data-hd="0.5"><i class="fas fa-plus"></i></button><span style="font-size:.8rem;color:#8a7e74;margin-left:4px">часов</span></div>
    </div>
    <div class="panel"><div class="panel-title"><i class="fas fa-person-walking"></i> Движение сегодня</div>
        <p style="font-size:.78rem;color:#8a7e74;margin-bottom:12px">Достаточно 10 минут быстрой ходьбы — по пути на работу или в перерыве.</p>
        <div class="health-counter"><button class="counter-button" data-hc="mov" data-hd="-10"><i class="fas fa-minus"></i></button><div class="counter-value" id="v-mov">${h.mov}</div><button class="counter-button" data-hc="mov" data-hd="10"><i class="fas fa-plus"></i></button><span style="font-size:.8rem;color:#8a7e74;margin-left:4px">минут</span></div>
    </div>
    <div class="panel"><div class="panel-title"><i class="fas fa-chart-simple"></i> За последние 7 дней</div><div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px">${hh}</div></div>`;
}
