const password = document.querySelector('#password');
const toggle = document.querySelector('#toggle-password');
toggle?.addEventListener('click', () => {
  const visible = password.type === 'password';
  password.type = visible ? 'text' : 'password';
  toggle.textContent = visible ? 'Ocultar' : 'Mostrar';
  toggle.setAttribute('aria-pressed', String(visible));
});
const dialog = document.querySelector('#approval-dialog');
document.querySelectorAll('.approve').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#approval-code').textContent = button.dataset.code;
  document.querySelector('#approval-name').textContent = button.dataset.name;
  document.querySelector('#approval-token').value = button.dataset.token;
  document.querySelector('#approval-form').action = button.dataset.action;
  dialog.showModal();
}));
document.querySelector('#cancel-approval')?.addEventListener('click', () => dialog.close());
document.querySelectorAll('form').forEach(form => form.addEventListener('submit', () => {
  const button = form.querySelector('button[type="submit"]');
  if (button) { button.disabled = true; if (button.classList.contains('primary')) button.textContent = 'Un momento…'; }
}));
