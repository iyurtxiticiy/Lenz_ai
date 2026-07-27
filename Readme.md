ation
Diff
Logs

index.html
index.html
New
+13
-0

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LegalLens AI</title>
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
package.json
package.json
New
+9
-0

{
  "scripts": {
    "dev": "python3 -m http.server 5173",
    "build": "node --check src/main.js",
    "preview": "python3 -m http.server 4173"
  },
  "dependencies": {},
  "devDependencies": {}
}
src/main.js
src/main.js
New
+49
-0

const icons = {
  home: '⌂', upload: '⇧', summary: '✓', risk: '⚠', ask: '✦', terms: 'अ', dashboard: '▦', settings: '⚙', logo: '⚖', file: '▤', calendar: '◷', moon: '◐', bot: 'AI'
};
const screens = [
  ['home', 'Home', icons.home], ['upload', 'Upload', icons.upload], ['summary', 'Summary', icons.summary],
  ['risk', 'Risk Analysis', icons.risk], ['ask', 'Ask AI', icons.ask], ['terms', 'Legal Terms', icons.terms], ['dashboard', 'Dashboard', icons.dashboard]
];
const summaryData = {
  overview: 'This sample services agreement explains how the vendor will provide software support, how payments are handled, and what happens if either party ends the contract. Most terms are standard, but renewal, fee, and liability clauses deserve attention before signing.',
  keyPoints: ['Monthly subscription fee is due within 15 days of each invoice.', 'The contract renews automatically unless notice is sent before the deadline.', 'The vendor may suspend service after late payment and written notice.', 'Confidential information must be protected for three years after termination.', 'Liability is capped at fees paid in the previous 12 months.'],
  dates: [['Effective date', '1 August 2026'], ['Renewal notice deadline', '30 June 2027'], ['Initial term ends', '31 July 2027']],
  obligations: ['Pay invoices on time and keep billing details current.', 'Give 30 days written notice to terminate for convenience.', 'Do not share login credentials or confidential product information.']
};
const risks = [
  ['High-risk clauses', 'High', '⚠', 'Broad indemnity language may require you to cover third-party claims even when responsibility is shared.'],
  ['Hidden fees', 'Medium', '💳', 'Implementation and late-payment charges are referenced in an appendix, so total cost may be higher than the headline price.'],
  ['Automatic renewal', 'High', '↻', 'The agreement renews for another year unless written notice is provided at least 30 days before the current term ends.'],
  ['Termination clauses', 'Medium', '✕', 'Early termination is possible, but prepaid fees are generally non-refundable unless the vendor materially breaches.'],
  ['Liability clauses', 'Low', '⚖', 'Liability is capped and excludes indirect damages, which is common for software service contracts.']
];
const terms = [
  ['Indemnity', 'A promise to cover losses or claims for another person.', 'किसी दूसरे व्यक्ति के नुकसान या दावों को कवर करने का वादा।'],
  ['Force Majeure', 'Unexpected events outside anyone’s control, such as natural disasters.', 'ऐसी अप्रत्याशित घटनाएँ जो किसी के नियंत्रण में नहीं होतीं, जैसे प्राकृतिक आपदा।'],
  ['Arbitration', 'A private process for resolving disputes instead of going to court.', 'अदालत जाने के बजाय विवाद सुलझाने की निजी प्रक्रिया।'],
  ['Governing Law', 'The state or country laws used to interpret the contract.', 'अनुबंध को समझने के लिए लागू राज्य या देश के कानून।'],
  ['Auto-renewal', 'The contract continues automatically unless you cancel on time.', 'समय पर रद्द न करने पर अनुबंध अपने आप जारी रहता है।']
];
const quickQuestions = ['What are my responsibilities?', 'Are there any hidden charges?', 'Can the contract be terminated early?', 'What is the notice period?'];
let state = { screen: 'home', dark: false, file: 'Sample_Service_Agreement.pdf', loading: false, hindi: false, messages: [{ role: 'ai', text: 'Ask me anything about the uploaded document.' }] };

function icon(value, cls = '') { return `<span class="icon ${cls}">${value}</span>`; }
function setState(patch) { state = { ...state, ...patch }; render(); }
function navTo(id) { setState({ screen: id }); }
function send(q) { const text = (q || document.querySelector('#chatText')?.value || '').trim(); if (!text) return; setState({ messages: [...state.messages, { role: 'user', text }, { role: 'ai', text: 'Based on the sample document, the relevant clause should be reviewed carefully before signing.' }] }); }
window.navTo = navTo; window.setState = setState; window.send = send;

function shell(content) {
  const active = screens.find(([id]) => id === state.screen);
  return `<div class="app ${state.dark ? 'dark' : ''}"><aside class="sidebar"><div class="brand"><div class="logo">${icons.logo}</div><div><strong>LegalLens AI</strong><span>Smart Reader</span></div></div><nav>${screens.map(([id, label, ic]) => `<button class="nav ${state.screen === id ? 'active' : ''}" onclick="navTo('${id}')">${icon(ic)} ${label}</button>`).join('')}</nav><button class="mode" onclick="setState({dark:${!state.dark}})">${icon(icons.moon)} Dark mode</button></aside><main><header class="topbar"><div><p>${active[1]}</p><h1>LegalLens AI – Smart Contract & Document Reader</h1></div><span class="settings">${icons.settings}</span></header>${content}</main></div>`;
}
function home() { return `<section class="hero card"><div><div class="eyebrow">${icon('✦')} AI-powered legal clarity</div><h2>LegalLens AI</h2><p>Upload legal documents and understand them instantly using AI.</p><button class="primary" onclick="navTo('upload')">Get Started ›</button></div><div class="hero-panel"><span class="big-icon">${icons.file}</span><span>Contracts • PDFs • Policies</span></div><div class="feature-grid">${['Simple summaries','Risk detection','Ask document questions'].map(t=>`<div class="mini-card">${icon('✓')} <b>${t}</b></div>`).join('')}</div></section>`; }
function upload() { return `<section class="card upload-card"><div class="drop">${icon(icons.upload,'jumbo')}<h2>Drag and drop your PDF here</h2><p>Securely upload contracts, leases, policies, or legal notices.</p><label class="primary">Choose PDF<input type="file" accept="application/pdf" onchange="setState({file:this.files[0]?.name||state.file})" hidden></label></div><button class="secondary" onclick="setState({loading:true});setTimeout(()=>setState({loading:false}),1200)">Upload button</button><div class="file-name">${icon(icons.file)} Uploaded file: <b>${state.file}</b></div>${state.loading ? '<div class="loader"><span></span> Processing document with AI...</div>' : ''}</section>`; }
function summary() { return `<section class="grid-two"><div class="card"><h2>AI-generated summary in simple English</h2><p class="lead">${summaryData.overview}</p></div><div class="card"><h2>Key points</h2><ul class="clean-list">${summaryData.keyPoints.map(p=>`<li>${icon('✓')} ${p}</li>`).join('')}</ul></div><div class="card"><h2>Important dates</h2>${summaryData.dates.map(([l,v])=>`<div class="date-row">${icon(icons.calendar)} <span>${l}</span><b>${v}</b></div>`).join('')}</div><div class="card"><h2>Obligations</h2>${summaryData.obligations.map((o,i)=>`<div class="obligation"><span>${i+1}</span>${o}</div>`).join('')}</div></section>`; }
function risk() { return `<section class="risk-grid">${risks.map(([t,l,ic,e])=>`<article class="card risk"><div class="risk-head">${icon(ic)}<span class="pill ${l.toLowerCase()}">${l}</span></div><h2>${t}</h2><p>${e}</p></article>`).join('')}</section>`; }
function ask() { return `<section class="card chat"><div class="suggestions">${quickQuestions.map(q=>`<button onclick="send('${q.replaceAll("'", "\\'")}')">${q}</button>`).join('')}</div><div class="messages">${state.messages.map(m=>`<div class="bubble ${m.role}">${m.role==='ai'?icon(icons.bot):''} ${m.text}</div>`).join('')}</div><div class="chat-input"><input id="chatText" onkeydown="if(event.key==='Enter')send()" placeholder="Ask a question about your contract..."><button onclick="send()">Send</button></div></section>`; }
function legalTerms() { return `<section class="card"><div class="section-title"><h2>Difficult legal terms in simple English</h2><label class="toggle"><input type="checkbox" ${state.hindi?'checked':''} onchange="setState({hindi:this.checked})"> Display explanations in Hindi</label></div><div class="terms-grid">${terms.map(([t,en,hi])=>`<div class="term"><h3>${t}</h3><p>${state.hindi?hi:en}</p></div>`).join('')}</div></section>`; }
function dashboard() { const stats=[['Number of pages','14',icons.file],['Word count','4,850','▥'],['Estimated reading time','19 min','◷'],['Overall risk score','62/100','⚠']]; return `<section><div class="stats">${stats.map(([l,v,ic])=>`<div class="card stat">${icon(ic)}<span>${l}</span><b>${v}</b></div>`).join('')}</div><div class="card score"><div><h2>Overall document risk score</h2><p>Medium Risk — review renewal, fee, and indemnity sections.</p></div><span class="pill medium">Medium</span><div class="progress"><i style="width:62%"></i></div><button class="primary" onclick="navTo('summary')">View Full Summary</button></div></section>`; }
function render() { const map = { home, upload, summary, risk, ask, terms: legalTerms, dashboard }; document.querySelector('#root').innerHTML = shell(map[state.screen]()); }
render();
src/styles.css
src/styles.css
New
+1
-0

:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#14213d;background:#eef5ff}*{box-sizing:border-box}body{margin:0}.app{min-height:100vh;display:flex;background:linear-gradient(135deg,#eef5ff,#fff);color:#14213d;transition:.3s}.dark{background:linear-gradient(135deg,#08111f,#10233b);color:#eef6ff}.sidebar{width:280px;padding:24px;background:rgba(255,255,255,.82);backdrop-filter:blur(18px);border-right:1px solid #d9e7fb;display:flex;flex-direction:column;gap:24px;position:sticky;top:0;height:100vh}.dark .sidebar,.dark .card{background:rgba(13,29,52,.82);border-color:#254869}.brand{display:flex;align-items:center;gap:12px}.logo{height:50px;width:50px;border-radius:16px;background:#1e3a5f;color:#fff;display:grid;place-items:center;box-shadow:0 12px 24px #1e3a5f38}.brand strong{display:block;font-size:1.25rem}.brand span{font-size:.85rem;color:#5d7290}.dark .brand span,.dark p{color:#bad0ea}nav{display:grid;gap:8px}.nav,.mode{border:0;border-radius:14px;padding:13px 14px;background:transparent;color:inherit;text-align:left;display:flex;gap:10px;align-items:center;cursor:pointer;font-weight:700;transition:.2s}.nav:hover,.nav.active{background:#e5f0ff;color:#1b5fbf;transform:translateX(4px)}.dark .nav:hover,.dark .nav.active{background:#17365e;color:#8fc4ff}.mode{margin-top:auto;background:#f3f7fd}main{flex:1;padding:28px;max-width:1220px;margin:0 auto;width:100%}.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}.topbar p{margin:0;color:#3372bd;font-weight:800}.topbar h1{margin:4px 0 0;font-size:clamp(1.35rem,2.5vw,2.35rem)}.settings{color:#4270a3}.card{background:rgba(255,255,255,.9);border:1px solid #dce9fb;border-radius:28px;padding:28px;box-shadow:0 24px 70px #1e3a5f18;animation:rise .45s ease}.hero{min-height:560px;display:grid;grid-template-columns:1.2fr .8fr;gap:24px;align-items:center;overflow:hidden}.eyebrow{display:inline-flex;gap:8px;align-items:center;background:#e6f1ff;color:#1b5fbf;border-radius:999px;padding:8px 12px;font-weight:800}.hero h2{font-size:clamp(3rem,8vw,6rem);margin:18px 0 10px;color:#1e3a5f}.dark .hero h2{color:#92c8ff}.hero p,.lead{font-size:1.2rem;line-height:1.8;color:#4d607b}.primary,.secondary{border:0;border-radius:16px;padding:14px 20px;font-weight:900;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:.2s}.primary{background:#1e5fb8;color:#fff;box-shadow:0 16px 28px #1e5fb83d}.primary:hover,.secondary:hover{transform:translateY(-2px)}.secondary{background:#e7f1ff;color:#1e5fb8}.hero-panel{min-height:280px;border-radius:28px;background:linear-gradient(135deg,#1e3a5f,#1f76d2);color:white;display:grid;place-items:center;text-align:center;font-weight:900}.feature-grid{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.mini-card{background:#f5f9ff;border-radius:18px;padding:18px;display:flex;gap:10px;align-items:center}.dark .mini-card,.dark .mode{background:#132d4d}.grid-two{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}.clean-list{padding:0;margin:0;list-style:none;display:grid;gap:14px}.clean-list li,.date-row,.file-name,.obligation{display:flex;align-items:center;gap:12px;padding:14px;border-radius:16px;background:#f5f9ff}.dark .clean-list li,.dark .date-row,.dark .file-name,.dark .obligation,.dark .term{background:#102944}.clean-list svg{color:#18a66a}.date-row b{margin-left:auto}.obligation span{height:30px;width:30px;border-radius:50%;background:#1e5fb8;color:white;display:grid;place-items:center;font-weight:900;flex:none}.drop{border:2px dashed #91b9e9;border-radius:24px;padding:48px;text-align:center;background:#f7fbff}.upload-card{display:grid;gap:18px}.loader{font-weight:900;color:#1e5fb8}.loader span{display:inline-block;width:14px;height:14px;border-radius:50%;border:3px solid #b8d5f7;border-top-color:#1e5fb8;animation:spin .8s linear infinite;margin-right:8px}.risk-grid,.stats,.terms-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:20px}.risk{min-height:230px}.risk-head{display:flex;justify-content:space-between;align-items:center}.risk svg,.stat svg{color:#1e5fb8}.pill{border-radius:999px;padding:7px 12px;font-size:.78rem;font-weight:900}.high{background:#ffe8e8;color:#bd1f1f}.medium{background:#fff4d7;color:#9c6500}.low{background:#e1f8ed;color:#137247}.suggestions{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px}.suggestions button{border:1px solid #b9d6f8;background:#f6fbff;border-radius:999px;padding:10px 14px;color:#1e5fb8;font-weight:800;cursor:pointer}.messages{display:grid;gap:12px;min-height:280px}.bubble{max-width:72%;padding:14px 16px;border-radius:18px;background:#eef5ff}.bubble.user{justify-self:end;background:#1e5fb8;color:#fff}.chat-input{display:flex;gap:10px;margin-top:16px}.chat-input input{flex:1;border:1px solid #bdd5f2;border-radius:16px;padding:14px;background:#fff;color:#14213d}.chat-input button{border:0;border-radius:16px;padding:0 20px;background:#1e5fb8;color:#fff;font-weight:900}.section-title{display:flex;justify-content:space-between;gap:16px;align-items:center}.toggle{font-weight:800}.term{padding:18px;border-radius:18px;background:#f5f9ff}.term h3{margin-top:0;color:#1e5fb8}.stat{display:grid;gap:10px}.stat b{font-size:2rem;color:#1e3a5f}.dark .stat b{color:#92c8ff}.score{margin-top:20px;display:grid;gap:14px}.progress{height:14px;background:#e6effb;border-radius:999px;overflow:hidden}.progress i{height:100%;display:block;background:linear-gradient(90deg,#2f80ed,#f7b731);border-radius:999px}h2{margin-top:0}@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:800px){.app{display:block}.sidebar{position:relative;width:100%;height:auto}.hero,.grid-two{grid-template-columns:1fr}.feature-grid{grid-template-columns:1fr}.topbar{align-items:flex-start}.section-title,.chat-input{flex-direction:column}.chat-input button{padding:14px}.bubble{max-width:100%}}
