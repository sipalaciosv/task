export function showToast(title, message, type = 'primary') {
  const area = document.getElementById('toastArea');
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          <strong class="me-2">${title}</strong>${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>`;
  const toastEl = wrapper.firstElementChild;
  area.appendChild(toastEl);
  const bsToast = new bootstrap.Toast(toastEl, { delay: 2500 });
  bsToast.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}