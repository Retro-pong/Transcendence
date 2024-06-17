import gameUtils from '@/utils/game/utils/gameUtils';
import socketManager from '@/utils/SocketManager';

function multiEventHandler(canvas, scene, camera) {
  const map = scene.getObjectByName('map');

  canvas.focus();

  // 마우스 이벤트 핸들러 함수
  function handleMouseMove(e) {
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
  }

  // 마우스 이벤트 리스너 등록
  canvas.focus();
  canvas.addEventListener('mousemove', handleMouseMove);

  // 애플리케이션 종료 시 이벤트 리스너 제거
  function removeEventListener() {
    canvas.removeEventListener('mousemove', handleMouseMove);
    // 추가 자원 해제 코드
  }
  return removeEventListener;
}

export default multiEventHandler;
