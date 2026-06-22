/* --- ДНЕВНИК --- */
function renderDiaryView() {
  let eh = '';
  if (!appState.diary.length)
    eh =
      '<div class="empty-state"><i class="fas fa-book-open"></i>Записей пока нет. Начните наблюдать за ситуациями.</div>';
  else
    for (const e of [...appState.diary].reverse())
      eh += `<div class="diary-entry"><div class="diary-entry-date">${formatDate(e.date)}</div><div class="diary-entry-row"><span class="diary-entry-label">Что произошло: </span>${escapeHtml(e.what)}</div><div class="diary-entry-row"><span class="diary-entry-label">Чего боялся: </span>${escapeHtml(e.fear)}</div><div class="diary-entry-row"><span class="diary-entry-label">Тревога: </span><span style="color:#8fa87a;font-weight:700">${e.anx != null ? e.anx : '—'}/10</span></div><div class="diary-entry-row"><span class="diary-entry-label">Что сделал: </span>${escapeHtml(e.did)}</div><div class="diary-entry-row"><span class="diary-entry-label">Фактически: </span>${escapeHtml(e.fact)}</div><div style="text-align:right;margin-top:6px"><button class="delete-icon-button" data-dd="${e.id}"><i class="fas fa-trash-alt"></i></button></div></div>`;
  appRoot.innerHTML = `
    <h1 class="screen-title">Дневник ситуаций</h1>
    <p class="screen-subtitle">Недели 1–2: каждый день записывайте одну социальную ситуацию. Это поможет увидеть паттерны.</p>
    <div class="panel"><div class="panel-title"><i class="fas fa-plus-circle"></i> Новая запись</div>
        <div class="field-label">Что произошло</div><textarea class="textarea-input" id="d-what" rows="2" placeholder="Коллеги разговаривали на перерыве"></textarea>
        <div class="field-label" style="margin-top:10px">Чего я боялся</div><textarea class="textarea-input" id="d-fear" rows="2" placeholder="Что не смогу ничего сказать"></textarea>
        <div class="field-label" style="margin-top:10px">Тревога в моменте</div>${renderAnxietyScale('d-anx', null)}
        <div class="field-label" style="margin-top:10px">Что я сделал</div><textarea class="textarea-input" id="d-did" rows="2" placeholder="Смотрел в телефон и молчал"></textarea>
        <div class="field-label" style="margin-top:10px">Что произошло фактически</div><textarea class="textarea-input" id="d-fact" rows="2" placeholder="Никто меня не критиковал"></textarea>
        <div style="margin-top:14px"><button class="button button-primary" id="add-d"><i class="fas fa-scheduleSave"></i> Сохранить</button></div>
        ${renderExampleToggle('diary', '<strong>Что произошло:</strong> Коллеги разговаривали на перерыве<br><strong>Чего боялся:</strong> Что не смогу ничего сказать, буду выглядеть странно<br><strong>Тревога:</strong> 7/10<br><strong>Что сделал:</strong> Смотрел в телефон и молчал<br><strong>Фактически:</strong> Никто меня не критиковал, разговор шёл без меня, но это было нормально')}
    </div>
    <h2 style="font-size:1rem;font-weight:700;margin-bottom:12px;color:#8a7e74">Предыдущие записи</h2>
    ${eh}`;
}
