import { Toast } from 'bootstrap';

class ToastHandler {
  static #toast = Toast.getOrCreateInstance('#toast');

  static #toastMessage = document.getElementById('toast-message');

  static setToast(message) {
    this.#toastMessage.innerText = message;
    this.#toast.show();
  }

  static hideToast() {
    this.#toast.hide();
  }
}

export default ToastHandler;
