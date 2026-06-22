/* ========== РЕНДЕР ========== */
function renderApp() {
  switch (activeTab) {
    case 'today':
      renderTodayView();
      break;
    case 'diary':
      renderDiaryView();
      break;
    case 'actions':
      renderActionsView();
      break;
    case 'thoughts':
      renderThoughtsView();
      break;
    case 'health':
      renderHealthView();
      break;
  }
  bindCurrentViewEvents();
}

/* ========== СТАРТ ========== */
initializeNavigation();
renderApp();
window.addEventListener('beforeunload', () => {
  if (breathingRunning) saveBreathingSession();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
});
