const icons = {
  home: '⌂',
  upload: '⇧',
  summary: '✓',
  risk: '⚠',
  ask: '✦',
  terms: 'अ',
  dashboard: '▦',
  settings: '⚙',
  logo: '⚖',
  file: '▤',
  calendar: '◷',
  moon: '◐',
  bot: 'AI',
};

const screens = [
  { id: 'home', label: 'Home', icon: icons.home },
  { id: 'upload', label: 'Upload', icon: icons.upload },
  { id: 'summary', label: 'Summary', icon: icons.summary },
  { id: 'risk', label: 'Risk Analysis', icon: icons.risk },
  { id: 'ask', label: 'Ask AI', icon: icons.ask },
  { id: 'terms', label: 'Legal Terms', icon: icons.terms },
  { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
];

const summaryData = {
  overview:
    'This sample services agreement explains how the vendor will provide software support, how payments are handled, and what happens if either party ends the contract. Most terms are standard, but renewal, fee, and liability clauses deserve attention before signing.',
  keyPoints: [
    'Monthly subscription fee is due within 15 days of each invoice.',
    'The contract renews automatically unless notice is sent before the deadline.',
    'The vendor may suspend service after late payment and written notice.',
    'Confidential information must be protected for three years after termination.',
    'Liability is capped at fees paid in the previous 12 months.',
  ],
  dates: [
    { label: 'Effective date', value: '1 August 2026' },
    { label: 'Renewal notice deadline', value: '30 June 2027' },
    { label: 'Initial term ends', value: '31 July 2027' },
  ],
  obligations: [
    'Pay invoices on time and keep billing details current.',
    'Give 30 days written notice to terminate for convenience.',
    'Do not share login credentials or confidential product information.',
  ],
};

const risks = [
  {
    title: 'High-risk clauses',
    level: 'High',
    icon: '⚠',
    explanation:
      'Broad indemnity language may require you to cover third-party claims even when responsibility is shared.',
  },
  {
    title: 'Hidden fees',
    level: 'Medium',
    icon: '💳',
    explanation:
      'Implementation and late-payment charges are referenced in an appendix, so total cost may be higher than the headline price.',
  },
  {
    title: 'Automatic renewal',
    level: 'High',
    icon: '↻',
    explanation:
      'The agreement renews for another year unless written notice is provided at least 30 days before the current term ends.',
  },
  {
    title: 'Termination clauses',
    level: 'Medium',
    icon: '✕',
    explanation:
      'Early termination is possible, but prepaid fees are generally non-refundable unless the vendor materially breaches.',
  },
  {
    title: 'Liability clauses',
    level: 'Low',
    icon: '⚖',
    explanation: 'Liability is capped and excludes indirect damages, which is common for software service contracts.',
  },
];

const terms = [
  {
    term: 'Indemnity',
    en: 'A promise to cover losses or claims for another person.',
    hi: 'किसी दूसरे व्यक्ति के नुकसान या दावों को कवर करने का वादा।',
  },
  {
    term: 'Force Majeure',
    en: 'Unexpected events outside anyone’s control, such as natural disasters.',
    hi: 'ऐसी अप्रत्याशित घटनाएँ जो किसी के नियंत्रण में नहीं होतीं, जैसे प्राकृतिक आपदा।',
  },
  {
    term: 'Arbitration',
    en: 'A private process for resolving disputes instead of going to court.',
    hi: 'अदालत जाने के बजाय विवाद सुलझाने की निजी प्रक्रिया।',
  },
  {
    term: 'Governing Law',
    en: 'The state or country laws used to interpret the contract.',
    hi: 'अनुबंध को समझने के लिए लागू राज्य या देश के कानून।',
  },
  {
    term: 'Auto-renewal',
    en: 'The contract continues automatically unless you cancel on time.',
    hi: 'समय पर रद्द न करने पर अनुबंध अपने आप जारी रहता है।',
  },
];

const quickQuestions = [
  'What are my responsibilities?',
  'Are there any hidden charges?',
  'Can the contract be terminated early?',
  'What is the notice period?',
];

let state = {
  screen: getInitialScreen(),
  dark: window.matchMedia('(prefers-color-scheme: dark)').matches,
  file: 'Sample_Service_Agreement.pdf',
  loading: false,
  hindi: false,
  deferredInstallPrompt: null,
  messages: [{ role: 'ai', text: 'Ask me anything about the uploaded document.' }],
};

function getInitialScreen() {
  const hashScreen = window.location.hash.replace('#', '');
  return screens.some((screen) => screen.id === hashScreen) ? hashScreen : 'home';
}

function icon(value, className = '') {
  return `<span class="icon ${className}" aria-hidden="true">${value}</span>`;
}

function setState(patch) {
  state = { ...state, ...patch };
  render();
}

function navigate(screenId) {
  window.location.hash = screenId;
  setState({ screen: screenId });
}

function send(question) {
  const input = document.querySelector('#chatText');
  const text = (question || input?.value || '').trim();
  if (!text) return;

  setState({
    messages: [
      ...state.messages,
      { role: 'user', text },
      {
        role: 'ai',
        text: 'Based on the sample document, review the related clause before signing and confirm the notice, fee, and liability details.',
      },
    ],
  });
}

async function installApp() {
  if (!state.deferredInstallPrompt) return;
  state.deferredInstallPrompt.prompt();
  await state.deferredInstallPrompt.userChoice;
  setState({ deferredInstallPrompt: null });
}

window.navigate = navigate;
window.setState = setState;
window.send = send;
window.installApp = installApp;

window.addEventListener('hashchange', () => setState({ screen: getInitialScreen() }));
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  setState({ deferredInstallPrompt: event });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}

function shell(content) {
  const active = screens.find((screen) => screen.id === state.screen) || screens[0];
  const installButton = state.deferredInstallPrompt
    ? '<button class="install" onclick="installApp()">Install app</button>'
    : '';

  return `
    <div class="app ${state.dark ? 'dark' : ''}">
      <aside class="sidebar">
        <div class="brand">
          <div class="logo">${icons.logo}</div>
          <div><strong>LegalLens AI</strong><span>Smart Reader</span></div>
        </div>
        <nav aria-label="Primary navigation">
          ${screens
            .map(
              (screen) => `
                <button class="nav ${state.screen === screen.id ? 'active' : ''}" onclick="navigate('${screen.id}')">
                  ${icon(screen.icon)} ${screen.label}
                </button>`
            )
            .join('')}
        </nav>
        ${installButton}
        <button class="mode" onclick="setState({dark:${!state.dark}})">${icon(icons.moon)} Dark mode</button>
      </aside>
      <main>
        <header class="topbar">
          <div><p>${active.label}</p><h1>LegalLens AI – Smart Contract & Document Reader</h1></div>
          <span class="settings" aria-hidden="true">${icons.settings}</span>
        </header>
        ${content}
      </main>
    </div>`;
}

function home() {
  return `
    <section class="hero card">
      <div>
        <div class="eyebrow">${icon('✦')} AI-powered legal clarity</div>
        <h2>LegalLens AI</h2>
        <p>Upload legal documents and understand them instantly using AI.</p>
        <button class="primary" onclick="navigate('upload')">Get Started ›</button>
      </div>
      <div class="hero-panel"><span class="big-icon">${icons.file}</span><span>Contracts • PDFs • Policies</span></div>
      <div class="feature-grid">
        ${['Simple summaries', 'Risk detection', 'Ask document questions']
          .map((title) => `<div class="mini-card">${icon('✓')} <b>${title}</b></div>`)
          .join('')}
      </div>
    </section>`;
}

function upload() {
  return `
    <section class="card upload-card">
      <div class="drop">
        ${icon(icons.upload, 'jumbo')}
        <h2>Drag and drop your PDF here</h2>
        <p>Securely upload contracts, leases, policies, or legal notices.</p>
        <label class="primary">Choose PDF<input type="file" accept="application/pdf" onchange="setState({file:this.files[0]?.name||state.file})" hidden></label>
      </div>
      <button class="secondary" onclick="setState({loading:true});setTimeout(()=>setState({loading:false}),1200)">Upload button</button>
      <div class="file-name">${icon(icons.file)} Uploaded file: <b>${state.file}</b></div>
      ${state.loading ? '<div class="loader"><span></span> Processing document with AI...</div>' : ''}
    </section>`;
}

function summary() {
  return `
    <section class="grid-two">
      <div class="card"><h2>AI-generated summary in simple English</h2><p class="lead">${summaryData.overview}</p></div>
      <div class="card"><h2>Key points</h2><ul class="clean-list">${summaryData.keyPoints
        .map((point) => `<li>${icon('✓')} ${point}</li>`)
        .join('')}</ul></div>
      <div class="card"><h2>Important dates</h2>${summaryData.dates
        .map((date) => `<div class="date-row">${icon(icons.calendar)} <span>${date.label}</span><b>${date.value}</b></div>`)
        .join('')}</div>
      <div class="card"><h2>Obligations</h2>${summaryData.obligations
        .map((obligation, index) => `<div class="obligation"><span>${index + 1}</span>${obligation}</div>`)
        .join('')}</div>
    </section>`;
}

function risk() {
  return `<section class="risk-grid">${risks
    .map(
      (riskItem) => `
        <article class="card risk">
          <div class="risk-head">${icon(riskItem.icon)}<span class="pill ${riskItem.level.toLowerCase()}">${riskItem.level}</span></div>
          <h2>${riskItem.title}</h2>
          <p>${riskItem.explanation}</p>
        </article>`
    )
    .join('')}</section>`;
}

function ask() {
  return `
    <section class="card chat">
      <div class="suggestions">${quickQuestions
        .map((question) => `<button onclick="send('${question.replaceAll("'", "\\'")}')">${question}</button>`)
        .join('')}</div>
      <div class="messages">${state.messages
        .map((message) => `<div class="bubble ${message.role}">${message.role === 'ai' ? icon(icons.bot) : ''} ${message.text}</div>`)
        .join('')}</div>
      <div class="chat-input"><input id="chatText" onkeydown="if(event.key==='Enter')send()" placeholder="Ask a question about your contract..."><button onclick="send()">Send</button></div>
    </section>`;
}

function legalTerms() {
  return `
    <section class="card">
      <div class="section-title">
        <h2>Difficult legal terms in simple English</h2>
        <label class="toggle"><input type="checkbox" ${state.hindi ? 'checked' : ''} onchange="setState({hindi:this.checked})"> Display explanations in Hindi</label>
      </div>
      <div class="terms-grid">${terms
        .map((term) => `<div class="term"><h3>${term.term}</h3><p>${state.hindi ? term.hi : term.en}</p></div>`)
        .join('')}</div>
    </section>`;
}

function dashboard() {
  const stats = [
    ['Number of pages', '14', icons.file],
    ['Word count', '4,850', '▥'],
    ['Estimated reading time', '19 min', '◷'],
    ['Overall risk score', '62/100', '⚠'],
  ];

  return `
    <section>
      <div class="stats">${stats
        .map(([label, value, statIcon]) => `<div class="card stat">${icon(statIcon)}<span>${label}</span><b>${value}</b></div>`)
        .join('')}</div>
      <div class="card score">
        <div><h2>Overall document risk score</h2><p>Medium Risk — review renewal, fee, and indemnity sections.</p></div>
        <span class="pill medium">Medium</span>
        <div class="progress"><i style="width:62%"></i></div>
        <button class="primary" onclick="navigate('summary')">View Full Summary</button>
      </div>
    </section>`;
}

function render() {
  const routes = { home, upload, summary, risk, ask, terms: legalTerms, dashboard };
  document.querySelector('#root').innerHTML = shell(routes[state.screen]());
}

render();
