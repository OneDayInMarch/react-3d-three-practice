import * as THREE from "three"; // 引入Three.js库
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Stats from "three/examples/jsm/libs/stats.module.js"; // 引入性能监控库
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
export class ThreeTool {
  public camera: THREE.PerspectiveCamera; // 相机对象
  public scene: THREE.Scene; // 场景对象
  public renderer: THREE.WebGLRenderer; // 渲染器对象

  // 构造函数，初始化Three.js工具
  constructor() {
    this.renderer = this.initRenderer(); // 初始化渲染器
    this.scene = this.initScene(); // 初始化场景
    this.camera = this.initCamera(); // 初始化相机
    this.initOrbitControls();
  }
  public rendererContainer() {
    this.renderer.render(this.scene, this.camera); // 渲染场景和相机
  }
  // 初始化场景的方法
  public initScene(): THREE.Scene {
    const scene = new THREE.Scene();
    return scene;
  }

  // 初始化渲染器的方法
  public initRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    return renderer;
  }

  // 初始化相机的方法
  public initCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    return camera;
  }
  public initOrbitControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    controls.update();
  }

  // 初始化性能监控的方法
  public initStats(container: HTMLElement) {
    const stats = new Stats();
    stats.dom.style.position = "absolute";
    stats.dom.style.left = "0";
    stats.dom.style.zIndex = "100";
    container.appendChild(stats.dom); // 将性能监控DOM元素添加到容器中
  }
  public initAxisHelper(axesLength: number = 150, showText: boolean = true) {
    const helper = new THREE.AxesHelper(axesLength);
    if (showText) {
      const loader = new FontLoader();
      let meshX = new THREE.Mesh();
      let meshY = new THREE.Mesh();
      let meshZ = new THREE.Mesh();
      loader.load("fonts/optimer_regular.typeface.json", (font) => {
        meshX = this.createText("X", font);
        meshY = this.createText("Y", font);
        meshZ = this.createText("Z", font);
        meshX.position.x = 12;
        meshY.position.y = 12;
        meshZ.position.z = 12;
        this.scene.add(meshX);
        this.scene.add(meshY);
        this.scene.add(meshZ);
      });
    }
    this.scene.add(helper);
  }
  private createText(content: string, font: any) {
    const textGeometry = new TextGeometry(content, {
      font: font,
      size: 1,
      depth: 0.1,
      curveSegments: 1,
    });
    textGeometry.center();
    const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }); // front
    const mesh = new THREE.Mesh(textGeometry, textMaterial);
    return mesh;
  }
}
