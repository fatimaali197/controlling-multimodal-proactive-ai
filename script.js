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
  demoUrl: 'https://drive.google.com/file/d/15g0p1GXx7p_DaGdW8b1xDk01mC2Ip-h7/view?usp=sharing',
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


// One shared local state: human settings constrain both AI-side examples.
const defaults = () => ({ signals: { screen: true, speech: true, interactions: true }, initiative: 'ask', writing: true, navigation: true });
let settings = defaults();
let proposal = 'ask';
const $ = id => document.getElementById(id);
const evidence = () => Object.entries(settings.signals).filter(([, allowed]) => allowed).map(([name]) => ({screen: 'Screen: a draft is open', speech: 'Speech: “How can I make this clearer?”', interactions: 'Interactions: a pause after repeated edits'}[name]));
function evaluate(requested) {
  if (requested === 'silence') return {mode:'silence', message:'No intervention. Your writing continues uninterrupted.', reason:'The proposed action is Silence.'};
  if (!evidence().length) return {mode:'silence', message:'No intervention. All perception channels are disabled.', reason:'No permitted perception evidence is available; a writing opportunity cannot be inferred.'};
  if (!settings.writing) return {mode:'silence', message:'No writing intervention. Writing suggestions are outside your allowed support types.', reason:'Writing support is disabled, regardless of navigation permission.'};
  if (settings.initiative === 'silence') return {mode:'silence', message:'No intervention. Your initiative setting requires Silence.', reason:'An opportunity may be inferred, but human configuration suppresses participation.'};
  if (settings.initiative === 'ask' || requested === 'ask') return {mode:'ask', message:'“Would you like a suggestion to clarify this paragraph?”', reason: settings.initiative === 'ask' ? 'Your initiative limit requires permission before help. No rewrite is provided.' : 'The proposed action asks permission before offering help.'};
  return {mode:'assist', message:'Illustrative suggestion: “State the main claim first, then add the supporting detail.”', reason:'Direct assistance and writing suggestions are both allowed by your configuration.'};
}
function updateDecision() {
  const result = evaluate(proposal);
  $('decision-label').textContent = `RESULT / ${result.mode.toUpperCase()}`;
  $('decision-response').textContent = result.message;
  $('decision-boundary').textContent = result.reason;
  document.querySelectorAll('[data-decision]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.decision === proposal)));
}
function runNext() {
  const result = evaluate('assist');
  $('control-result-label').textContent = `NEXT EXAMPLE / ${result.mode.toUpperCase()}`;
  $('control-result').textContent = result.message;
  $('control-evidence').textContent = evidence().join('. ') || 'None. All perception channels are disabled.';
  $('control-situation').textContent = evidence().length ? 'The writer may benefit from help clarifying a paragraph. This is an illustrative inference, not a certainty.' : 'No situation inferred from permitted signals.';
  $('control-rationale').textContent = result.reason;
}
function syncSettings() {
  document.querySelectorAll('[data-signal]').forEach(input => { input.checked = settings.signals[input.dataset.signal]; });
  $('initiative').value = settings.initiative;
  $('writing-support').checked = settings.writing;
  $('navigation-support').checked = settings.navigation;
  const count = evidence().length;
  $('signal-summary').textContent = `${count} of 3 fictional signals allowed. ${count ? 'Only enabled signals contribute to the examples.' : 'No perception evidence is available.'}`;
  updateDecision();
  $('control-result-label').textContent = 'SETTINGS READY';
  $('control-result').textContent = `Initiative limit: ${settings.initiative}. ${count} perception channels allowed. Run the next example to inspect the outcome.`;
  $('control-audit').hidden = true;
}
document.querySelectorAll('[data-signal]').forEach(input => input.addEventListener('change', () => { settings.signals[input.dataset.signal] = input.checked; syncSettings(); }));
$('initiative').addEventListener('change', event => { settings.initiative = event.target.value; syncSettings(); });
$('writing-support').addEventListener('change', event => { settings.writing = event.target.checked; syncSettings(); });
$('navigation-support').addEventListener('change', event => { settings.navigation = event.target.checked; syncSettings(); });
document.querySelectorAll('[data-decision]').forEach(button => button.addEventListener('click', () => { proposal = button.dataset.decision; updateDecision(); }));
$('run-decision').addEventListener('click', () => { runNext(); $('control-audit').hidden = false; });
$('reset-example').addEventListener('click', () => { settings = defaults(); proposal = 'ask'; syncSettings(); });
const auditRecords = {
  intervention: {state:'ASK / Permission request shown', evidence:'Screen: a draft is open. Speech: “How can I make this clearer?”', situation:'The writer may want help clarifying the paragraph.', rationale:'Writing support was allowed, with initiative limited to Ask. The example requests permission instead of changing the draft.'},
  suppressed: {state:'SILENCE / Selected suppressed decision', evidence:'Interactions: a pause after repeated edits. Screen: a draft is open.', situation:'There may be an opportunity to help with writing, but a pause alone does not establish a request.', rationale:'The user had set initiative to Silence. The possible writing intervention was suppressed. This selected record makes that boundary visible.'}
};
function showAudit(key) {
  const record = auditRecords[key];
  ['state','evidence','situation','rationale'].forEach(field => { $(`audit-${field}`).textContent = record[field]; });
  document.querySelectorAll('[data-audit]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.audit === key)));
}
document.querySelectorAll('[data-audit]').forEach(button => button.addEventListener('click', () => showAudit(button.dataset.audit)));
syncSettings(); showAudit('intervention');

const motionToggle = $('motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function syncMotionPreference() { motionToggle.hidden = reducedMotion.matches; }
syncMotionPreference(); reducedMotion.addEventListener('change', syncMotionPreference);
motionToggle.addEventListener('click', () => {
  const paused = document.body.classList.toggle('motion-paused');
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.textContent = paused ? 'Resume animation ▷' : 'Pause animation Ⅱ';
});
// Normal document scrolling, with progressive enhancement and no scroll locking.
const chapters = [...document.querySelectorAll('.chapter')];
const progressLinks = [...document.querySelectorAll('.story-progress a')];
if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('entered'); reveal.unobserve(entry.target); }
  }), {threshold:0.08});
  chapters.forEach(chapter => { chapter.classList.add('reveal-ready'); reveal.observe(chapter); });
  const focusObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) progressLinks.forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current','step'); else link.removeAttribute('aria-current');
    }); });
  }, {rootMargin:'-30% 0px -40% 0px', threshold:0});
  chapters.forEach(chapter => focusObserver.observe(chapter));
}
