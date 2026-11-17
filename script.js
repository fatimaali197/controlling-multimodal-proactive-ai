/* EDIT PROJECT METADATA HERE. No build step or framework is required.
   The paper URL is a temporary submission preview, not a public permalink.
   Keep citationText aligned with metadata when replacing it. */
const CONFIG = {
  projectName: 'SpotMe',
  projectTitle: 'Controlling Multimodal Proactive AI',
  paperTitle: 'Sensing Without Speaking? Controlling Proactive Multimodal AI',
  authors: ['Muawiz Feroze Khan', 'Fatima Ali', 'Yun Huang'],
  affiliation: 'University of Illinois Urbana-Champaign',
  paperUrl: 'https://arxiv.org/submit/8385311/view', // Temporary submission preview; replace with public URL when available.
  paperLinkNote: 'Temporary submission preview · not a public arXiv permalink.',
  year: 2026,
  demoUrl: 'https://drive.google.com/file/d/1JZbzhX6aCmeMzF1BxajLPb4oEQe8QSfq/view?usp=drive_link',
  citationText: `% PROVISIONAL CITATION — update when public publication metadata is available.
@misc{spotme_provisional,
  title = {Sensing Without Speaking? Controlling Proactive Multimodal AI},
  author = {Khan, Muawiz Feroze and Ali, Fatima and Huang, Yun},
  year = {2026},
  howpublished = {Preprint},
  url = {https://arxiv.org/submit/8385311/view},
  note = {Provisional; temporary submission preview, not a public arXiv permalink}
}`
};

document.title = `${CONFIG.projectTitle} — ${CONFIG.projectName}`;
document.getElementById('authors').textContent = CONFIG.authors.join(' · ');
document.getElementById('affiliation').textContent = CONFIG.affiliation;
document.getElementById('citation-text').textContent = CONFIG.citationText;

document.querySelectorAll('[data-demo]').forEach(link => { link.href = CONFIG.demoUrl; });
document.querySelectorAll('[data-paper]').forEach(link => {
  if (CONFIG.paperUrl.trim()) {
    link.href = CONFIG.paperUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  } else {
    link.setAttribute('aria-label', `${link.textContent.trim()} — preprint link to be added`);
  }
});
document.getElementById('paper-placeholder').textContent = CONFIG.paperLinkNote;
document.querySelectorAll('[data-paper]').forEach(link => link.setAttribute('aria-label', `${link.textContent.trim()} — temporary submission preview, not a public arXiv permalink`));

const dialog = document.getElementById('citation-dialog');
const copyStatus = document.getElementById('copy-status');
let citationTrigger;
document.querySelectorAll('[data-cite]').forEach(button => {
  button.addEventListener('click', () => {
    citationTrigger = button;
    copyStatus.textContent = '';
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
});
document.getElementById('close-citation').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  citationTrigger?.focus();
});

document.getElementById('copy-citation').addEventListener('click', async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(CONFIG.citationText);
    } else {
      // Supports direct file previews and browsers without the Clipboard API.
      const field = document.createElement('textarea');
      field.value = CONFIG.citationText;
      field.style.cssText = 'position:fixed;left:0;top:0;opacity:0;';
      dialog.appendChild(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      document.getElementById('copy-citation').focus();
      if (!copied) throw new Error('Clipboard unavailable');
    }
    copyStatus.textContent = 'BibTeX copied.';
  } catch {
    copyStatus.textContent = 'Copy unavailable. Select and copy the citation above.';
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('citation-text'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
});


// Local deterministic replay. Records are copied snapshots, never recomputed history.
const $ = id => document.getElementById(id);
const supportTypes = ['Orientation','Interaction Repair','Dashboard Scope Disclosure','Data Meaning and Provenance','Misreading Correction','Interpretation','Exploration Expansion','Social Repair'];
const defaults = () => ({signals:{screen:true,speech:true,interactions:true}, initiative:'assist', support:Object.fromEntries(supportTypes.map(type => [type,type !== 'Interpretation']))});
let settings = defaults();
let proposal = 'assist';
const auditHistory = [];
function evidenceFor(config, opportunity) {
  const items = [];
  if (config.signals.screen) items.push(opportunity === 'correction' ? 'Eyes: Black civilians 1,437 (35%); unable to classify by race 39%.' : 'Eyes: a later dashboard view concerning Pulaski County. No additional values are reproduced here.');
  if (config.signals.speech && opportunity === 'correction') items.push('Ears: “So 70% of these incidents involved Black people.”');
  if (config.signals.interactions) items.push(opportunity === 'correction' ? 'Mouse + Keyboard: hovering over the Race Breakdown chart.' : 'Mouse + Keyboard: interaction context in the later Pulaski County exploration.');
  return items;
}
function evaluate(requested, opportunity = 'correction', config = settings) {
  const correction = opportunity === 'correction';
  const support = correction ? 'Misreading Correction' : 'Interpretation';
  // Hover context is useful but cannot substitute for either the claim or chart.
  const enough = correction ? config.signals.screen && config.signals.speech : config.signals.screen;
  let mode = requested;
  let reason;
  if (!enough) { mode = 'silence'; reason = correction ? 'The replay requires both Eyes and Ears to compare the spoken claim with the visible chart. Remaining channels cannot establish that discrepancy.' : 'Eyes are disabled; this replay cannot ground an interpretation opportunity in the dashboard context.'; }
  else if (requested === 'silence') { mode = 'silence'; reason = 'The AI proposal is Silence: the possible benefit does not require participation.'; }
  else if (!config.support[support]) { mode = 'silence'; reason = `${support} support is disabled. The relevant opportunity is withheld, regardless of the maximum initiative.`; }
  else if (config.initiative === 'silence') { mode = 'silence'; reason = 'The maximum allowed initiative is Silence. No intervention is permitted.'; }
  else if (config.initiative === 'ask' && requested === 'assist') { mode = 'ask'; reason = 'The AI proposed Assist, but the human limit allows only Silence or Ask. Permission must be requested first.'; }
  else { reason = `The ${requested === 'assist' ? 'direct assistance' : 'permission request'} proposal is within the configured initiative limit and ${support} is enabled. This is one illustrative choice, not a rule that intervention is always appropriate.`; }
  const message = mode === 'silence' ? 'No assistant message is shown.' : mode === 'ask' ? (correction ? '“May I point out a possible discrepancy between your statement and the chart?”' : '“Would you like help interpreting the Pulaski County view?”') : (correction ? '“The visible chart shows Black civilians as 1,437 (35%), rather than 70%. It also shows 39% unable to classify by race.”' : 'Interpretation assistance is permitted here. The replay stops at the participation decision; it does not invent an interpretation of the county data.');
  return {opportunity, support, proposal:requested, mode, reason, message, evidence:evidenceFor(config,opportunity), situation: enough ? (correction ? 'Possible misreading: the spoken 70% conflicts with the visible 35%. The 39% unclassified category is relevant context.' : 'A later opportunity to support interpretation of the Pulaski County view. No specific conclusion is asserted.') : 'Insufficient permitted evidence to infer the target opportunity.', costs:correction ? 'Intervening may clarify a discrepancy but interrupt exploration or correct a tentative thought too quickly. Staying silent may leave a possible misreading unaddressed.' : 'Intervening may support sensemaking but impose an unwanted interpretation or interrupt the user. Staying silent may leave a useful exploration opportunity unsupported.', config:JSON.parse(JSON.stringify(config))};
}
function renderAudit() {
  const container = $('audit-records');
  container.replaceChildren();
  [...auditHistory].reverse().forEach((record,index) => {
    const details = document.createElement('details'); details.className = 'audit-record'; details.open = false;
    const summary = document.createElement('summary');
    summary.textContent = `${record.id} / ${record.mode.toUpperCase()} · ${record.support}${record.mode === 'silence' ? ' · Selected silent decision' : ''}`;
    details.append(summary);
    const caption = document.createElement('p'); caption.className = 'fine-print'; caption.textContent = record.origin; details.append(caption);
    const list = document.createElement('dl'); list.className = 'audit-detail';
    const entries = [['Perceived evidence',record.evidence.join(' ') || 'None: all relevant perception channels were disabled.'],['Inferred situation',record.situation],['Support considered',record.support],['Participation tradeoff',record.costs],['Configuration at this decision',`Maximum initiative: ${record.config.initiative}. ${record.support}: ${record.config.support[record.support] ? 'enabled' : 'disabled'}. Allowed channels: ${Object.entries(record.config.signals).filter(([,v])=>v).map(([k])=>({screen:'Eyes',speech:'Ears',interactions:'Mouse + Keyboard'}[k])).join(', ') || 'none'}.`],['Final decision',`Proposed ${record.proposal}; final ${record.mode}. ${record.reason}`],['Assistant output',record.message]];
    entries.forEach(([term,value]) => { const dt = document.createElement('dt'); dt.textContent = term; const dd = document.createElement('dd'); dd.textContent = value; list.append(dt,dd); });
    details.append(list); container.append(details);
  });
}
function saveRecord(result, origin) {
  const record = {...JSON.parse(JSON.stringify(result)), id:String(auditHistory.length+1).padStart(2,'0'),origin};
  auditHistory.push(record); renderAudit(); return record;
}
function updateDecision() {
  const result = evaluate(proposal);
  $('decision-evidence').textContent = result.evidence.join(' ') || 'No perception evidence available.';
  $('decision-permissions').textContent = `Human maximum: ${settings.initiative.toUpperCase()} · Misreading Correction: ${settings.support['Misreading Correction'] ? 'enabled' : 'disabled'}`;
  $('decision-label').textContent = `AI PROPOSAL: ${proposal.toUpperCase()} → FINAL: ${result.mode.toUpperCase()}`;
  $('decision-response').textContent = result.message;
  $('decision-boundary').textContent = result.reason;
  document.querySelectorAll('[data-decision]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.decision === proposal)));
}
function syncSettings() {
  document.querySelectorAll('[data-signal]').forEach(input => { input.checked = settings.signals[input.dataset.signal]; });
  document.querySelectorAll('[data-support]').forEach(input => { input.checked = settings.support[input.dataset.support]; });
  document.querySelectorAll('[data-channel]').forEach(node => { node.hidden = !settings.signals[node.dataset.channel]; });
  $('eyes-off').hidden = settings.signals.screen;
  $('initiative').value = settings.initiative;
  $('support-count').textContent = `${Object.values(settings.support).filter(Boolean).length} / 8 enabled`;
  $('signal-summary').textContent = `${Object.values(settings.signals).filter(Boolean).length} of 3 channels allowed. Only visible enabled signals contribute to subsequent replays.`;
  $('control-result-label').textContent = 'SETTINGS READY / NEXT DECISION';
  $('control-result').textContent = 'Run the next opportunity to apply these boundaries. Earlier Audit snapshots remain unchanged.';
  $('record-status').textContent = '';
  updateDecision();
}
document.querySelectorAll('[data-signal]').forEach(input => input.addEventListener('change',()=>{settings.signals[input.dataset.signal]=input.checked;syncSettings();}));
document.querySelectorAll('[data-support]').forEach(input => input.addEventListener('change',()=>{settings.support[input.dataset.support]=input.checked;syncSettings();}));
$('initiative').addEventListener('change',event=>{settings.initiative=event.target.value;syncSettings();});
document.querySelectorAll('[data-decision]').forEach(button => button.addEventListener('click',()=>{proposal=button.dataset.decision;updateDecision();$('record-status').textContent='';}));
$('record-decision').addEventListener('click',()=>{const record=saveRecord(evaluate(proposal),'Visitor replay / Race Breakdown. Snapshot captured with the settings shown below.');$('record-status').textContent=`Audit record ${record.id} saved. Open Understand to inspect it.`;});
$('run-decision').addEventListener('click',()=>{const result=evaluate('assist',$('opportunity').value);const record=saveRecord(result,'Visitor replay / subsequent opportunity. Snapshot captured with the settings shown below.');$('control-result-label').textContent=`FINAL: ${result.mode.toUpperCase()} / AUDIT ${record.id}`;$('control-result').textContent=`${result.message} ${result.reason}`;});
$('opportunity').addEventListener('change',()=>{$('control-result-label').textContent='NEXT OPPORTUNITY SELECTED';$('control-result').textContent='Replay to evaluate this opportunity under the current settings.';});
$('reset-example').addEventListener('click',()=>{settings=defaults();proposal='assist';syncSettings();});
syncSettings();
saveRecord(evaluate('assist','correction',defaults()),'Initial manuscript-adapted illustration / correction. Eyes and Ears available; Misreading Correction enabled.');
saveRecord(evaluate('assist','interpretation',defaults()),'Initial manuscript-adapted illustration / later Pulaski County opportunity. Interpretation disabled.');

const motionToggle = $('motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function syncMotionPreference() { motionToggle.hidden = reducedMotion.matches; }
syncMotionPreference(); reducedMotion.addEventListener('change', syncMotionPreference);
motionToggle.addEventListener('click', () => {
  const paused = document.body.classList.toggle('motion-paused');
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.textContent = paused ? 'Resume animation ▷' : 'Pause animation Ⅱ';
});
// Compact workspace: progressive enhancement keeps all panels readable without JS.
const tabs = [...document.querySelectorAll('[data-panel]')];
const panels = [...document.querySelectorAll('.chapter')];
const tabList = document.querySelector('.explore-tabs');
tabList.setAttribute('role', 'tablist');
function openPanel(id, focus = false) {
  tabs.forEach(tab => {
    const active = tab.dataset.panel === id;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  panels.forEach(panel => { panel.hidden = panel.id !== id; });
}
tabs.forEach((tab, index) => {
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', tab.dataset.panel);
  const panel = $(tab.dataset.panel);
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', tab.id);
  panel.removeAttribute('aria-label');
  panel.tabIndex = 0;
  tab.addEventListener('click', () => openPanel(tab.dataset.panel));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); openPanel(tabs[next].dataset.panel, true); }
  });
});
document.querySelectorAll('[data-open-panel]').forEach(button => button.addEventListener('click', () => openPanel(button.dataset.openPanel, true)));
function syncPanelHash() {
  const id = location.hash.slice(1);
  if (panels.some(panel => panel.id === id)) openPanel(id);
}
openPanel('perceive'); syncPanelHash();
window.addEventListener('hashchange', syncPanelHash);

// A single active top-nav section, measured below the sticky header.
const navLinks = [...document.querySelectorAll('.primary-nav a')];
const pageSections = [...document.querySelectorAll('.page-section')];
let scheduled = false;
function updateNavigation() {
  const offset = document.querySelector('.site-header').getBoundingClientRect().height + 32;
  let current = pageSections[0];
  pageSections.forEach(section => { if (section.getBoundingClientRect().top <= offset) current = section; });
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = pageSections[pageSections.length - 1];
  navLinks.forEach(link => {
    if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); }
}, {passive:true});
window.addEventListener('resize', updateNavigation);
updateNavigation();
