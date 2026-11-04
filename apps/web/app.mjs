const defaults = { name: 'Basic retry and DLQ', messageCount: 10, maxAttempts: 3, failureProbability: 15, duplicateProbability: 10, seed: 42 };
const fieldNames = ['messageCount', 'maxAttempts', 'failureProbability', 'duplicateProbability', 'seed'];
const q = (selector) => document.querySelector(selector);
const state = { result: null, showAll: false, view: 'simulator' };

function setScenario(s) {
  for (const field of fieldNames) q(`#${field}`).value = String(s[field]);
  q('#form-error').hidden = true;
}

function collectScenario() {
  const data = Object.fromEntries(fieldNames.map((field) => [field, Number(q(`#${field}`).value)]));
  return { ...data, name: 'Custom simulation' };
}

function createCell(value, className = '') {
  const td = document.createElement('td');
  td.textContent = value;
  if (className) td.className = className;
  return td;
}

function renderTrace() {
  const rows = state.result?.trace || [];
  const visible = state.showAll ? rows : rows.slice(0, 12);
  const body = q('#trace-body');
  body.replaceChildren();
  for (const e of visible) {
    const tr = document.createElement('tr');
    tr.append(
      createCell(`+${String(e.timeMs).padStart(4, '0')} ms`, 'trace-time'),
      createCell(e.description),
      createCell(e.outcome, `outcome outcome-${e.outcome}`),
    );
    body.append(tr);
  }
  q('#trace-count').textContent = `${rows.length} events`;
  q('#toggle-trace').hidden = rows.length <= 12;
  q('#toggle-trace').textContent = state.showAll ? 'Show fewer events' : `Show all ${rows.length} events`;
}

function renderResult(result) {
  state.result = result;
  state.showAll = false;
  const m = result.metrics;
  q('#metric-delivered').textContent = m.delivered;
  q('#metric-retries').textContent = m.retriesScheduled;
  q('#metric-dlq').textContent = m.deadLettered;
  q('#metric-unique').textContent = m.uniqueDelivered;
  q('#metric-duplicates').textContent = m.duplicateCopies;
  q('#workspace-summary').textContent = `${m.delivered} successful deliveries`;
  renderTrace();
}

async function runSimulation() {
  const button = q('.run-button');
  button.disabled = true;
  button.textContent = 'Running…';
  q('#form-error').hidden = true;
  try {
    const response = await fetch('/api/simulate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(collectScenario()),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'Simulation failed');
    renderResult(payload);
  } catch (error) {
    q('#form-error').textContent = error.message;
    q('#form-error').hidden = false;
  } finally {
    button.disabled = false;
    button.innerHTML = '<span aria-hidden="true">▷</span> Run simulation';
  }
}

const titles = {
  simulator: ['Message flow simulator', 'Explore retries, duplicates and dead-letter behavior before production.'],
  workspace: ['Workspace', 'A safe environment for exploring asynchronous failure modes.'],
  scenarios: ['Scenario library', 'Start from a reproducible example and customize the model.'],
};

function showView(view) {
  if (!titles[view]) return;
  state.view = view;
  for (const name of Object.keys(titles)) q(`#${name}-view`).hidden = view !== name;
  for (const button of document.querySelectorAll('[data-view]')) {
    const selected = button.dataset.view === view;
    button.classList.toggle('active', selected);
    if (selected) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  }
  q('#page-title').textContent = titles[view][0];
  q('#page-subtitle').textContent = titles[view][1];
  q('#header-actions').hidden = view !== 'simulator';
}

async function loadScenarios() {
  try {
    const response = await fetch('/api/scenarios');
    if (!response.ok) throw new Error('Could not load scenario presets');
    const { scenarios } = await response.json();
    const list = q('#scenario-list');
    list.replaceChildren();
    for (const scenario of scenarios) {
      const row = document.createElement('div');
      row.className = 'scenario-row';
      const details = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = scenario.name;
      const hint = document.createElement('span');
      hint.textContent = `${scenario.messageCount} messages · ${scenario.failureProbability}% failures · ${scenario.duplicateProbability}% duplicates`;
      details.append(title, hint);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'secondary-button';
      button.textContent = 'Load preset';
      button.addEventListener('click', async () => {
        setScenario(scenario);
        showView('simulator');
        await runSimulation();
      });
      row.append(details, button);
      list.append(row);
    }
  } catch (error) {
    q('#scenario-list').textContent = error.message;
  }
}

q('#simulation-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  await runSimulation();
});
q('#load-example').addEventListener('click', async () => { setScenario(defaults); await runSimulation(); });
q('#reset').addEventListener('click', () => {
  setScenario(defaults);
  state.result = null;
  q('#metric-delivered').textContent = '—';
  q('#metric-retries').textContent = '—';
  q('#metric-dlq').textContent = '—';
  q('#metric-unique').textContent = '—';
  q('#metric-duplicates').textContent = '—';
  q('#workspace-summary').textContent = 'Not started';
  renderTrace();
});
q('#toggle-trace').addEventListener('click', () => { state.showAll = !state.showAll; renderTrace(); });
for (const button of document.querySelectorAll('[data-view]')) button.addEventListener('click', () => showView(button.dataset.view));
q('.go-simulator').addEventListener('click', () => showView('simulator'));
await loadScenarios();
await runSimulation();
