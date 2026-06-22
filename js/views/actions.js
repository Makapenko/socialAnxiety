/* --- ДЕЙСТВИЯ --- */
let selectedActionId = null;
function renderActionsView() {
  let ih = '';
  appState.actions.forEach((a, i) => {
    const r = a.anxiety >= 3 && a.anxiety <= 4;
    ih += `<div class="action-item${r ? ' is-recommended' : ''}" data-aid="${a.id}"><span class="action-number">${i + 1}</span><span class="action-text">${escapeHtml(a.text)}</span><span class="action-anxiety">${a.anxiety}/10</span><button class="delete-icon-button" data-da="${a.id}"><i class="fas fa-xmark"></i></button></div>`;
  });
  appRoot.innerHTML = `
    <h1 class="screen-title">Мой список действий</h1>
    <p class="screen-subtitle">Оцените тревогу для каждого. Для недель 3–4 выбирайте действия с тревогой 3–4 (выделены).</p>
    <div class="panel"><div class="panel-title"><i class="fas fa-plus-circle"></i> Добавить своё действие</div>
        <input class="text-input" id="na-t" placeholder="Описание действия...">
        <div class="field-label" style="margin-top:10px">Предполагаемая тревога</div>${renderAnxietyScale('na-a', null)}
        <button class="button button-primary button-small" id="add-a" style="margin-top:10px"><i class="fas fa-plus"></i> Добавить</button>
    </div>
    <div style="margin-bottom:8px;display:flex;align-items:center;gap:6px;font-size:.75rem;color:#8fa87a">
        <span style="width:10px;height:10px;border-radius:3px;background:rgba(143,168,122,.2);border:1px solid rgba(143,168,122,.4);display:inline-block"></span>
        Рекомендуемые для недель 3–4 (тревога 3–4)
    </div>
    ${ih}
    <div class="panel" style="margin-top:18px"><div class="panel-title"><i class="fas fa-pencil"></i> Изменить оценку тревоги</div>
        <p style="font-size:.82rem;color:#8a7e74;margin-bottom:10px">Нажмите на действие выше, затем выберите новую оценку:</p>
        <div id="ea-info" style="font-size:.85rem;color:#5a524b;margin-bottom:8px;min-height:20px">Не выбрано</div>
        ${renderAnxietyScale('ea-a', null)}
    </div>`;
  selectedActionId = null;
}
