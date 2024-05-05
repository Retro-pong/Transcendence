import { Tooltip } from 'bootstrap';

const initTooltip = () => {
  console.log('initTooltip');
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
  );
};

export default initTooltip;
