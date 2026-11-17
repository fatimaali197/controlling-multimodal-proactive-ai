/* EDIT PROJECT METADATA HERE. No build step or framework is required.
   Replace bracketed placeholders with verified metadata when available.
   Set paperUrl to a real preprint URL to activate all paper links. */
const CONFIG = {
  projectName: 'SpotMe',
  projectTitle: 'Controlling Multimodal Proactive AI',
  paperTitle: 'Sensing Without Speaking? Controlling Proactive Multimodal AI',
  authors: ['[Author One]', '[Author Two]', '[Author Three]'],
  affiliation: '[Affiliation / Research Lab]',
  paperUrl: '', // TODO: https://… (arXiv or other preprint URL)
  demoUrl: 'https://drive.google.com/file/d/15g0p1GXx7p_DaGdW8b1xDk01mC2Ip-h7/view?usp=sharing',
  citationText: `% EDITABLE PROVISIONAL CITATION — replace placeholders before use.
@misc{spotme_provisional,
  title = {Sensing Without Speaking? Controlling Proactive Multimodal AI},
  author = {[Author One] and [Author Two] and [Author Three]},
  howpublished = {Preprint},
  url = {[PREPRINT URL]},
  note = {Provisional entry; publication metadata to be added}
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
if (CONFIG.paperUrl.trim()) document.getElementById('paper-placeholder').hidden = true;

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

const motionToggle = document.getElementById('motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function syncMotionPreference() {
  motionToggle.hidden = reducedMotion.matches;
}
syncMotionPreference();
reducedMotion.addEventListener('change', syncMotionPreference);
motionToggle.addEventListener('click', () => {
  const paused = document.body.classList.toggle('motion-paused');
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.innerHTML = paused ? 'Resume animation <span aria-hidden="true">▷</span>' : 'Pause animation <span aria-hidden="true">Ⅱ</span>';
});
