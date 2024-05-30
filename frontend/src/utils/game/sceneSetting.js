import * as THREE from 'three';

function sceneSetting(scene) {
  {
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 2;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }
  {
    const color = 0xffffff;
    const intensity = 2.5;
    const light1 = new THREE.DirectionalLight(color, intensity);
    const light2 = new THREE.DirectionalLight(color, intensity);
    light1.position.set(-40, 0, 0);
    light2.position.set(40, 0, 0);
    scene.add(light1);
    scene.add(light2);
    scene.add(light1.target);
    scene.add(light2.target);
  }
}

export default sceneSetting;
