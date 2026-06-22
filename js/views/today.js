/* --- СЕГОДНЯ --- */
function renderTodayView() {
  const d = getTodayKey(),
    l = getDailyLog(d);
  appRoot.innerHTML = `
    <div class="date-badge"><i class="fas fa-calendar-day"></i> ${formatDate(d)}</div>
    <h1 class="screen-title">Ежедневная рутина</h1>
    <p class="screen-subtitle">Не превращайте перерывы в «лечение». Вам нужны еда и отдых. Выполняйте по одному маленькому действию.</p>
    <div class="panel"><div class="panel-title"><i class="fas fa-sun"></i> Перед работой — 5 минут</div>
        <div class="field-label">Общая тревога сейчас</div>${renderAnxietyScale('bw-a', l.bw.a)}
        <div class="field-label" style="margin-top:12px">Одно небольшое социальное действие</div>
        <input class="text-input" data-f="bw-act" value="${escapeHtml(l.bw.act)}" placeholder="Например: поздороваться с коллегой">
        <div class="field-label" style="margin-top:12px">Тревожное предсказание</div>
        <textarea class="textarea-input" data-f="bw-pred" rows="2" placeholder="Что, как мне кажется, произойдёт?">${escapeHtml(l.bw.pred)}</textarea>
        <p style="font-size:.78rem;color:#8fa87a;margin-top:8px;font-style:italic">«Моя задача сегодня — не чувствовать себя идеально, а сделать выбранное действие»</p>
        ${renderExampleToggle('bw', '<strong>Тревога:</strong> 7 из 10<br><strong>Действие:</strong> Сказать коллеге «привет» и спросить, как прошли выходные<br><strong>Предсказание:</strong> «Он ответит сухо и поймёт, что я напряжён»')}
    </div>
    <div class="panel"><div class="panel-title"><i class="fas fa-mug-hot"></i> Первый перерыв — 20 минут</div>
        <p style="font-size:.78rem;color:#8a7e74;margin-bottom:12px">10–12 мин — еда и отдых, 3 мин — разминка, 2–5 мин — упражнение.</p>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <div class="check-toggle${l.b1.done ? ' is-active' : ''}" data-ck="b1"><i class="fas fa-check"></i></div>
            <span style="font-size:.85rem;font-weight:600">Выполнил упражнение</span>
        </div>
        <div class="field-label">Что сделал</div>
        <textarea class="textarea-input" data-f="b1-n" rows="2" placeholder="Поздоровался, задал вопрос, сел ближе...">${escapeHtml(l.b1.notes)}</textarea>
        ${renderExampleToggle('b1', '<strong>Выполнил:</strong> да<br><strong>Что сделал:</strong> Поздоровался с двумя коллегами, спросил «Как смена?» — один ответил коротко, другой улыбнулся')}
    </div>
    <div class="panel"><div class="panel-title"><i class="fas fa-eye"></i> Второй перерыв — 20 минут</div>
        <p style="font-size:.78rem;color:#8a7e74;margin-bottom:12px">Большая часть — восстановление. 3–5 мин — внимание наружу или короткое действие.</p>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <div class="check-toggle${l.b2.done ? ' is-active' : ''}" data-ck="b2"><i class="fas fa-check"></i></div>
            <span style="font-size:.85rem;font-weight:600">Выполнил упражнение</span>
        </div>
        <div class="field-label">Заметки (на что обращал внимание / что сделал)</div>
        <textarea class="textarea-input" data-f="b2-n" rows="2" placeholder="Один звук, один предмет, содержание слов...">${escapeHtml(l.b2.notes)}</textarea>
        ${renderExampleToggle('b2', '<strong>Выполнил:</strong> да<br><strong>Заметки:</strong> Обратил внимание на голос коллеги (низкий, спокойный), цвет куртки (тёмно-синяя), звук кофемашины. Когда внимание вернулось к «как я выгляжу» — спокойно вернул наружу.')}
    </div>
    <div class="panel"><div class="panel-title"><i class="fas fa-moon"></i> После работы — 5–10 минут</div>
        <div class="field-label">Что я сделал сегодня</div>
        <textarea class="textarea-input" data-f="aw-did" rows="2" placeholder="Какое действие выполнил">${escapeHtml(l.aw.did)}</textarea>
        <div class="field-label" style="margin-top:12px">Максимальная тревога</div>${renderAnxietyScale('aw-a', l.aw.a)}
        <div class="field-label" style="margin-top:12px">Что случилось фактически</div>
        <textarea class="textarea-input" data-f="aw-fact" rows="2" placeholder="Без догадок — только факты">${escapeHtml(l.aw.fact)}</textarea>
        <div class="field-label" style="margin-top:12px">Какое защитное действие удалось уменьшить</div>
        <input class="text-input" data-f="aw-prot" value="${escapeHtml(l.aw.prot)}" placeholder="Например: не доставал телефон 2 минуты">
        <div class="field-label" style="margin-top:12px">Следующий маленький шаг</div>
        <input class="text-input" data-f="aw-next" value="${escapeHtml(l.aw.next)}" placeholder="Завтра попробую...">
        ${renderExampleToggle('aw', '<strong>Что сделал:</strong> Поздоровался с коллегой, задал вопрос про задачу<br><strong>Макс. тревога:</strong> 6<br><strong>Фактически:</strong> Коллега ответил нормально, показал на экран<br><strong>Защитное поведение:</strong> Не прятал руки в карманы<br><strong>Следующий шаг:</strong> Завтра попробую не репетировать первую фразу')}
    </div>`;
}
