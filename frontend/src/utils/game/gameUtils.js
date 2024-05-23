import * as THREE from 'three';

class gameUtils {
  // 객체의 월드 포지션을 구하는 함수
  static getAbsolutePosition(object) {
    const position = new THREE.Vector3();
    object.getWorldPosition(position);
    return position;
  }

  // 객체의 월드 크기를 구하는 함수
  static getObjectWorldSize(object) {
    // 객체의 바운딩 박스를 구합니다.
    const boundingBox = new THREE.Box3().setFromObject(object);

    // 객체의 바운딩 박스의 크기를 반환합니다.
    return boundingBox.getSize(new THREE.Vector3());
  }
}

export default gameUtils;
