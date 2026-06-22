/* --- МЫСЛИ --- */
let worryTimerId = null,
  worrySecondsRemaining = 900,
  worryTotalSeconds = 900;
function renderThoughtsView() {
  let th = '';
  if (!appState.worry.length)
    th =
      '<div class="empty-state"><i class="fas fa-brain"></i>Список мыслей пуст. Запишите тревожную мысль и разделите на категории.</div>';
  else
    for (const t of appState.worry) {
      const badgeClass = t.cat === 'a' ? 'thought-badge-actionable' : 'thought-badge-parked',
        badgeText = t.cat === 'a' ? 'Есть действие' : 'Нельзя сделать';
      th += `<div class="thought-item"><span class="thought-badge ${badgeClass}">${badgeText}</span><div style="flex:1"><div style="font-size:.85rem;line-height:1.5">${escapeHtml(t.text)}</div>${t.act ? `<div style="font-size:.78rem;color:#8fa87a;margin-top:4px"><i class="fas fa-arrow-right" style="font-size:.65rem"></i> ${escapeHtml(t.act)}</div>` : ''}</div><button class="delete-icon-button" data-dt="${t.id}"><i class="fas fa-xmark"></i></button></div>`;
    }
  const minutes = Math.floor(worrySecondsRemaining / 60),
    seconds = worrySecondsRemaining % 60,
    timerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progress = worryTotalSeconds > 0 ? 1 - worrySecondsRemaining / worryTotalSeconds : 0,
    circleLength = 2 * Math.PI * 58,
    progressOffset = circleLength * (1 - progress);
  appRoot.innerHTML = `
    <h1 class="screen-title">Время для тревожных мыслей</h1>
    <p class="screen-subtitle">Выделите 15 минут в одно и то же время, но не перед сном. В течение дня откладывайте мысли.</p>
    <div class="panel" style="text-align:center"><div class="panel-title" style="justify-content:center"><i class="fas fa-clock"></i> Таймер</div>
        <div style="position:relative;width:140px;height:140px;margin:10px auto">
            <svg width="140" height="140" class="timer-ring"><circle class="timer-ring-background" cx="70" cy="70" r="58"></circle><circle class="timer-ring-progress" cx="70" cy="70" r="58" stroke-dasharray="${circleLength}" stroke-dashoffset="${progressOffset}"></circle></svg>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:1.6rem;font-weight:800" id="w-time">${timerText}</div>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:8px">
            <button class="button button-primary button-small" id="w-go"><i class="fas fa-play"></i> Старт</button>
            <button class="button button-ghost button-small" id="w-pa"><i class="fas fa-pause"></i> Пауза</button>
            <button class="button button-ghost button-small" id="w-re"><i class="fas fa-rotate-left"></i> Сброс</button>
        </div>
        <div style="font-size:.72rem;color:#5a524b;margin-top:8px">15 минут</div>
    </div>
    <div class="panel"><div class="panel-title"><i class="fas fa-plus-circle"></i> Записать мысль</div>
        <textarea class="textarea-input" id="wt-t" rows="2" placeholder="Какая тревожная мысль пришла в голову?"></textarea>
        <div class="field-label" style="margin-top:10px">Категория</div>
        <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
            <button class="button button-small worry-category-button is-active" data-wc="a" style="background:rgba(143,168,122,.15);color:#8fa87a;border:1px solid rgba(143,168,122,.3)">Есть действие</button>
            <button class="button button-small worry-category-button" data-wc="c" style="background:transparent;color:#8a7e74;border:1px solid #342e29">Нельзя ничего сделать</button>
        </div>
        <div id="wt-aw"><div class="field-label">Какое конкретное действие</div><input class="text-input" id="wt-a" placeholder="Записаться к врачу, оплатить счёт..."></div>
        <button class="button button-primary button-small" id="add-wt" style="margin-top:10px"><i class="fas fa-plus"></i> Добавить</button>
        ${renderExampleToggle('thought', '<strong>Мысль:</strong> «А вдруг через несколько месяцев уволят»<br><strong>Категория:</strong> Нельзя ничего сделать<br><br><strong>Мысль:</strong> «Нужно позвонить в поликлинику, но страшно»<br><strong>Категория:</strong> Есть действие<br><strong>Действие:</strong> Позвонить завтра в 12:00')}
    </div>
    <h2 style="font-size:1rem;font-weight:700;margin-bottom:12px;color:#8a7e74">Записанные мысли</h2>
    ${th}`;
}
