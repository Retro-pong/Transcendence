import * as THREE from 'three';

class gameUtils {
  // 객체의 월드 포지션을 구하는 함수
  static getAbsolutePosition(object) {
    const position = new THREE.Vector3();
    object.getWorldPosition(position);
    return position;
  }

  // 마우스 좌표를 객체의 월드 좌표로 변환하는 함수
  static getMouseWorldPositionInObject(mouseX, mouseY, camera, object) {
    // 마우스 클릭 위치를 뷰포트 좌표로 변환합니다.
    const mouseVector = new THREE.Vector3(
      (mouseX / window.innerWidth) * 2 - 1,
      -(mouseY / window.innerHeight) * 2 + 1,
      0.5
    );

    // 뷰포트 좌표를 월드 좌표로 변환합니다.
    mouseVector.unproject(camera);
    // 카메라 위치와 방향을 기반으로 ray 생성합니다.
    const rayCaster = new THREE.Raycaster(
      camera.position,
      mouseVector.sub(camera.position).normalize()
    );
    // ray 교차하는 객체들을 찾습니다.
    const intersects = rayCaster.intersectObject(object, true);
    // 가장 가까운 객체와의 교차점을 반환합니다.
    if (intersects.length > 0) {
      return intersects[0].point;
    }
    return null;
  }
}

export default gameUtils;
