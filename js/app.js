/* ========== РЕНДЕР ========== */
function renderApp() {
  if (!hasAssessmentResults()) activeTab = 'assessment';
  syncNavigationActiveState();
  switch (activeTab) {
    case 'assessment':
      renderAssessmentView();
      break;
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
if (!hasAssessmentResults()) activeTab = 'assessment';
initializeNavigation();
renderApp();
window.addEventListener('beforeunload', () => {
  if (breathingRunning) saveBreathingSession();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
});
