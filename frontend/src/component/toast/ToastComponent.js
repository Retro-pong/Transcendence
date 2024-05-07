function ToastComponent({ id, message }) {
  return `
  <div class="toast-container position-fixed bottom-0 start-50 translate-middle-x p-5">
    <div id="${id}" class="toast text-bg-dark align-items-center" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="2500">
      <div class="d-flex px-4">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-toast-close" data-bs-dismiss="toast" aria-label="Close">X</button>
      </div>
    </div>
  </div>`;
}

export default ToastComponent;
