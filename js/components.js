/* Шкала тревоги */
function renderAnxietyScale(n, v) {
  let h = '<div class="anxiety-scale" data-sn="' + n + '">';
  for (let i = 0; i <= 10; i++)
    h += `<button type="button" class="anxiety-score-button${i === v ? ' is-active' : ''}" data-sn="${n}" data-sv="${i}">${i}</button>`;
  return h + '</div>';
}

/* Блок-пример */
function renderExampleToggle(id, c) {
  return `<button class="example-toggle" data-et="${id}"><i class="fas fa-lightbulb"></i> Показать пример</button><div class="example-box" id="ex-${id}">${c}</div>`;
}
