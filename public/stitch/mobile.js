// Interface enhancements only: preserve the existing simulator and outbound links.
const menuButton = document.querySelector('.mobile-menu-toggle');
const mobileNavigation = document.querySelector('#mobile-navigation');
function closeMenu(returnFocus = false) {
  mobileNavigation.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const opening = mobileNavigation.hidden;
  mobileNavigation.hidden = !opening;
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
});
mobileNavigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNavigation.hidden) closeMenu(true);
});
matchMedia('(min-width: 1024px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

// Attach real labels and mobile keyboards without changing field values or validation.
const autocomplete = { 'calc-name': 'name', 'calc-phone': 'tel', 'calc-email': 'email', 'calc-city': 'address-level2' };
document.querySelectorAll('#estimator-form input[id]').forEach(input => {
  const label = input.parentElement.querySelector('label');
  if (label) label.htmlFor = input.id;
  input.name ||= input.id;
  if (autocomplete[input.id]) input.autocomplete = autocomplete[input.id];
});
document.querySelector('#calc-area-input').setAttribute('aria-label', 'Área construída em metros quadrados');
document.querySelector('#calc-area-input').inputMode = 'decimal';
document.querySelector('#calc-area-range').setAttribute('aria-label', 'Ajustar área construída em metros quadrados');
document.querySelector('#summary-total').setAttribute('aria-live', 'polite');
document.querySelectorAll('.material-symbols-outlined').forEach(icon => icon.setAttribute('aria-hidden', 'true'));
document.querySelector('#portfolio-filter-buttons')?.addEventListener('click', event => {
  const button = event.target.closest('.portfolio-tab');
  if (!button) return;
  document.querySelectorAll('.portfolio-tab').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
});
document.querySelector('.hero-visual img').fetchPriority = 'high';
