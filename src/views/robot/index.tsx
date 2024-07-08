import { useEffect, useRef } from "react";
import * as THREE from "three";
import { generateRobot, generateStarts } from "./generate";
import { ThreeTool } from "../../BasicThree";
import Stats from "three/examples/jsm/libs/stats.module.js";

/**
 * 创建一个Three.js场景，包括相机和渲染器
 */
function Robot() {
  // 创建一个div容器，用于存放渲染的Three.js场景
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<Stats>(); // 创建用于引用统计信息的 ref

  // 创建 ThreeTool 实例
  const instance = new ThreeTool();

  // 初始化相机位置和朝向
  instance.camera.position.set(15, 12, 8);
  instance.camera.lookAt(0, 0, 0);

  // 添加坐标系
  instance.initAxisHelper();

  // 生成机器人和星星
  const robot = generateRobot();
  const robot2 = generateRobot();
  robot2.position.x = 6;
  robot2.position.z = 6;
  const starts = generateStarts(200);

  // 将物体添加到场景
  instance.scene.add(robot, robot2, starts);

  // 创建并设置方向光
  const straightLight = new THREE.DirectionalLight(0xffffff, 5);
  straightLight.position.set(20, 20, 20);
  instance.scene.add(straightLight);
  // 动画函数
  const animate = () => {
    requestAnimationFrame(animate);
    robot.rotation.z -= 0.005;
    robot2.rotation.y -= 0.005;
    starts.rotation.y -= 0.001;
    starts.rotation.z += 0.001;
    starts.rotation.x += 0.001;
    instance.renderer.render(instance.scene, instance.camera);
    statsRef.current && statsRef.current.update(); // 更新统计信息
  };

  // 监听组件挂载和卸载
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.appendChild(instance.renderer.domElement);
      instance.renderer.render(instance.scene, instance.camera);
      statsRef.current = instance.initStats(containerRef.current); // 初始化统计信息
      // 启动动画循环
      animate();
    }
  }, [containerRef]);

  // 返回div容器，用于存放渲染的Three.js场景
  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}></div>;
}

// 导出Robot组件
export default Robot;
