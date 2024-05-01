import { Modal } from 'bootstrap';

const ModalComponent = ({ title, modalId, content, buttons }) => {
  return `
    <div class="modal fade modal-lg" id="${modalId}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog rounded">
        <div class="modal-content vh-75 bg-black">
          <div class="modal-header border-0 d-flex flex-column bg-black">
          <button type="button" class="btn-close d-flex align-items-center justify-content-center fs-16" data-bs-dismiss="modal" aria-label="Close">X</button>
            <h1 class="modal-title fs-15" id="exampleModalLabel">${title}</h1>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          <div class="modal-footer bg-black h-25 border-0 d-flex justify-content-center align-items-center">
            ${buttons.map((button) => button).join('')}
          </div>
        </div>
      </div>
    </div>`;
};

export default ModalComponent;
