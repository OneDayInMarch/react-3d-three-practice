import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
export function createHead() {
  //SphereGeometry创建球形几何体
  const head = new THREE.SphereGeometry(4, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const headMaterial = new THREE.MeshStandardMaterial({
    color: 0x43b988,
    roughness: 0.5,
    metalness: 1.0,
  });
  const headMesh = new THREE.Mesh(head, headMaterial);
  return headMesh;
}
//触角
export function generateHorn(y: number, z: number, angle: number) {
  //触角 CapsuleGeometry 创建胶囊形状的几何体。胶囊形状可以看作是一个圆柱体两端加上半球体
  const line = new THREE.CapsuleGeometry(0.1, 2);
  const lineMaterial = new THREE.MeshStandardMaterial({
    color: 0x43b988,
    roughness: 0.5,
    metalness: 1.0,
  });
  const lineMesh = new THREE.Mesh(line, lineMaterial);
  lineMesh.position.y = y;
  lineMesh.position.z = z;
  lineMesh.rotation.x = angle;
  return lineMesh;
}
//机器人眼睛
export function generateEye(x: number, y: number, z: number) {
  //SphereGeometry创建球形几何体
  const eye = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 2);
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x212121,
    roughness: 0.5,
    metalness: 1.0,
  });
  const eyeMesh = new THREE.Mesh(eye, eyeMaterial);
  eyeMesh.position.x = x;
  eyeMesh.position.y = y;
  eyeMesh.position.z = z;
  return eyeMesh;
}
//机器人身体
export function generateBody() {
  //CylinderGeometry第一个参数是上部分圆的半径，第二个参数是下部分圆的半径，第三个参数是高度，材质使用的跟腿一样
  const body = new THREE.CylinderGeometry(4, 4, 6);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x43b988,
    roughness: 0.5,
    metalness: 1.0,
  });
  const bodyMesh = new THREE.Mesh(body, bodyMaterial);
  return bodyMesh;
}
//胳膊、腿
export function generateLegs(y: number, z: number) {
  const leg1 = new THREE.CapsuleGeometry(1, 4);
  const legMaterial1 = new THREE.MeshStandardMaterial({
    color: 0x43b988,
    roughness: 0.5,
    metalness: 1.0,
  });
  const leg1Mesh = new THREE.Mesh(leg1, legMaterial1);
  leg1Mesh.position.y = y;
  leg1Mesh.position.z = z;
  return leg1Mesh;
}
//创建机器人
export function generateRobot() {
  // 创建一个Three.js对象，用于存放机器人
  const robot = new THREE.Object3D();
  const headMesh = createHead();
  headMesh.position.y = 6.5;
  robot.add(headMesh);
  //眼睛
  const leftEye = generateEye(3, 8, -2);
  const rightEye = generateEye(3, 8, 2);
  robot.add(leftEye);
  robot.add(rightEye);
  const leftHorn = generateHorn(11, -1, (-Math.PI * 30) / 180);
  const rightHorn = generateHorn(11, 1, (Math.PI * 30) / 180);
  robot.add(leftHorn);
  robot.add(rightHorn);
  const body = generateBody();
  body.position.y = 4;
  robot.add(body);

  // 生成机器人左腿
  robot.add(generateLegs(0, -2));
  // 生成机器人右腿
  robot.add(generateLegs(0, 2));
  //胳膊
  robot.add(generateLegs(3, 5));

  robot.add(generateLegs(3, -5));
  //物体缩放
  robot.scale.x = 0.3;
  robot.scale.y = 0.3;
  robot.scale.z = 0.3;
  return robot;
}
//创建粒子星星
export function generateStarts(num: number) {
  //制作粒子特效
  const starts = new THREE.Object3D();
  const obj = new THREE.SphereGeometry(0.2, 3, 3);
  const material = new THREE.MeshStandardMaterial({
    color: 0x43b988,
    roughness: 0.5,
    metalness: 5,
  });
  const mesh = new THREE.Mesh(obj, material);
  for (let i = 0; i < num; i++) {
    const target = new THREE.Mesh();
    target.copy(mesh);
    target.position.x = Math.floor(Math.random() * 18 + Math.floor(Math.random() * -18));
    target.position.y = Math.floor(Math.random() * 18 + Math.floor(Math.random() * -18));
    target.position.z = Math.floor(Math.random() * 18 + Math.floor(Math.random() * -18));
    starts.add(target);
  }
  return starts;
}
//创建文本
export function createText(content: string, font: any) {
  const textGeometry = new TextGeometry(content, {
    font: font,
    size: 1,
    height: 0.1,
    curveSegments: 1,
  });
  textGeometry.center();
  const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }); // front
  const mesh = new THREE.Mesh(textGeometry, textMaterial);
  return mesh;
}
