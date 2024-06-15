import gameUtils from '@/utils/game/utils/gameUtils';
import socketManager from '@/utils/SocketManager';

function multiEventHandler(canvas, scene, camera) {
  const map = scene.getObjectByName('map');

  canvas.focus();

  // 마우스 컨트롤
  canvas.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    const mousePosition = gameUtils.getMouseWorldPositionInObject(
      x,
      y,
      camera.multi,
      map
    );
    if (!mousePosition) return;

    const message = {
      type: 'move',
      y: mousePosition.y,
      z: mousePosition.z,
    };
    if (socketManager.gameSocket.readyState === WebSocket.OPEN) {
      socketManager.gameSocket.send(JSON.stringify(message));
    }
  });
}

export default multiEventHandler;
