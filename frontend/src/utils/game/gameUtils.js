import * as THREE from 'three';

class gameUtils {
  // 객체의 월드 포지션을 구하는 함수
  static getAbsolutePosition(object) {
    const position = new THREE.Vector3();
    object.getWorldPosition(position);
    return position;
  }
}

export default gameUtils;
