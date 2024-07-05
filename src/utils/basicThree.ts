import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export class ThreeTool {
  public canvas: HTMLCanvasElement;
  public container: HTMLElement;
  public camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  constructor(threeToolParams: { canvas: HTMLCanvasElement; container: HTMLElement }) {
    this.canvas = canvas;
  }
  public initScene(): THREE.Scene {
    this.scene = new THREE.Scene();
    return this.scene;
  }
}
