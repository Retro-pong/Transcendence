import { Modal } from 'bootstrap';

const ModalComponent = ({ title, modalId, content, buttons }) => {
  return `
    <div class="modal fade modal-lg" id="${modalId}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog rounded">
        <div class="modal-content bg-black">
          <div class="modal-header border-0 d-flex flex-column bg-dark">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            <h1 class="modal-title" id="exampleModalLabel">${title}</h1>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          <div class="modal-footer border-0">
            ${buttons.map((button) => button).join('')}
          </div>
        </div>
      </div>
    </div>`;
};

export default ModalComponent;
