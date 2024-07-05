import { useEffect, useRef } from "react";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// 初始化渲染器的函数
/**
 * 初始化 WebGL 渲染器
 * @returns {THREE.WebGLRenderer} 创建并配置好的渲染器实例
 */
// 初始化渲染
function initRender(): THREE.WebGLRenderer {
  // 创建一个WebGL渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  // 根据设备像素比设置渲染器像素比
  renderer.setPixelRatio(window.devicePixelRatio);
  // 设置渲染器大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
}

// 初始化场景的函数
/**
 * 初始化场景
 * @param {THREE.WebGLRenderer} renderer - 渲染器实例
 * @returns {THREE.Scene} 创建并配置好的场景实例
 */
function initScene(renderer: THREE.WebGLRenderer) {
  // 创建 PMREM 生成器
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  // 创建场景
  const scene = new THREE.Scene();
  // 设置场景背景
  scene.background = new THREE.Color(0xbfe3dd);
  // 设置场景环境
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  return scene;
}

// 初始化相机的函数
/**
 * 初始化相机
 * @param {number} x - 相机在 x 轴的位置
 * @param {number} y - 相机在 y 轴的位置
 * @param {number} z - 相机在 z 轴的位置
 * @returns {THREE.PerspectiveCamera} 创建并配置好位置的相机实例
 */
function initCamera(x: number, y: number, z: number) {
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
  camera.position.set(x, y, z);
  return camera;
}

// 初始化控制器的函数
/**
 * 初始化轨道控制器
 * @param {THREE.PerspectiveCamera} camera - 相机实例
 * @param {THREE.WebGLRenderer} renderer - 渲染器实例
 * @returns {OrbitControls} 创建并配置好的轨道控制器实例
 */
function initControls(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;
  return controls;
}

/**
 * Keyframes 组件函数
 */
function Keyframes() {
  const containerRef = useRef<HTMLDivElement>(null); // 创建用于引用 HTML 元素的 ref
  const clock = new THREE.Clock(); // 创建时钟实例
  const statsRef = useRef<Stats>(); // 创建用于引用统计信息的 ref
  const mixerRef = useRef<THREE.AnimationMixer>(); // 创建用于引用动画混合器的 ref

  const renderer = initRender(); // 初始化渲染器
  const scene = initScene(renderer); // 初始化场景
  const camera = initCamera(5, 2, 10); // 初始化相机
  const controls = initControls(camera, renderer); // 初始化控制器
  controls.target.set(0, 0.5, 0); // 设置控制器的目标

  const dracoLoader = new DRACOLoader(); // 创建 Draco 加载器
  dracoLoader.setDecoderPath("jsm/libs/draco/gltf/"); // 设置 Draco 解码器路径

  const loader = new GLTFLoader(); // 创建 GLTF 加载器
  loader.setDRACOLoader(dracoLoader); // 为 GLTF 加载器设置 Draco 加载器

  // 加载 GLTF 模型
  loader.load(
    "models/gltf/LittlestTokyo.glb",
    (gltf: GLTF) => {
      const model = gltf.scene; // 获取模型的场景
      model.position.set(1, 1, 0); // 设置模型的位置
      model.scale.set(0.01, 0.01, 0.01); // 设置模型的缩放
      scene.add(model); // 将模型添加到场景

      mixerRef.current = new THREE.AnimationMixer(model); // 创建动画混合器
      mixerRef.current.clipAction(gltf.animations[0]).play(); // 播放动画
      renderer.setAnimationLoop(animate); // 设置渲染循环
    },
    undefined,
    (e) => {
      console.error(e); // 处理加载错误
    },
  );

  // 渲染循环函数
  /**
   * 每一帧的更新和渲染逻辑
   */
  function animate() {
    const delta = clock.getDelta(); // 获取时间间隔
    mixerRef.current && mixerRef.current.update(delta); // 更新动画混合器
    controls.update(); // 更新控制器
    statsRef.current && statsRef.current.update(); // 更新统计信息
    renderer.render(scene, camera); // 渲染场景和相机
  }

  // 处理窗口大小改变的函数
  /**
   * 处理窗口大小改变时的相机和渲染器更新
   */
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight; // 更新相机的宽高比
    camera.updateProjectionMatrix(); // 更新相机的投影矩阵
    controls.update(); // 更新控制器
    renderer.setSize(window.innerWidth, window.innerHeight); // 更新渲染器的大小
  }

  // 使用 useEffect 钩子
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.appendChild(renderer.domElement); // 将渲染器的 DOM 元素添加到引用的元素中

    statsRef.current = new Stats(); // 创建统计信息实例

    containerRef.current.appendChild(statsRef.current.dom); // 将统计信息的 DOM 元素添加到引用的元素中

    window.addEventListener("resize", onWindowResize); // 添加窗口大小改变的监听事件
    return () => {
      window.removeEventListener("resize", onWindowResize); // 清除窗口大小改变的监听事件
      renderer.setAnimationLoop(null); // 清除渲染循环
    };
  }, []);

  return <div ref={containerRef}></div>; // 返回一个带有 ref 的 div 元素
}

export default Keyframes; // 导出 Keyframes 组件
