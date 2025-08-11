import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
export default class ThreeModel {
  constructor(el, isDesign) {
    this.el = el;
    // 是否在设计器中
    this.isDesign = !!isDesign;
    this.isInitCamera = false;

    this.innerWidth = el.offsetWidth;
    this.innerHeight = el.offsetHeight;

    this.events = {}

    this.url = "";

    // 灯光
    this.lights = [];

    this.model = null;
    // 模型加载器
    this.loader = null;

    // 渲染器
    this.renderer = null;
    // 相机
    this.camera = null;
    // 场景
    this.scene = null;

    // 轨道控制器
    this.controls = null;

    //停止旋转
    this.hasStop = false;

    this.scene = new THREE.Scene();

    const dracoLoader = new DRACOLoader();
   
    dracoLoader.setDecoderPath(dsf.url.getWebPath("static/js/libs/three/draco/gltf/", __DSF_DATAVIEW_PATH__));
    this.dracoLoader = dracoLoader;

    this.init(); // 初始化
  }

  init() {
    this.initRenderer(); // 初始化渲染器
    this.initCamera(); // 初始化相机
    this.initControls(); // 初始化用户操作
  }
  /**
   * @name: 初始化渲染器
   */
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿
      alpha: true, // 是否透明
      preserveDrawingBuffer: true, // 是否保留缓直到手动清除或被覆盖
    });
    this.renderer.setSize(this.innerWidth, this.innerHeight); // 设置画布大小
    this.renderer.setPixelRatio(window.devicePixelRatio); // 设置像素比
    this.renderer.setAnimationLoop(this.animate.bind(this));
    this.renderer.setClearAlpha(0);

    this.el.appendChild(this.renderer.domElement);
  }

  /**
   * @name: 初始化相机
   */
  initCamera() {
    // 模拟人眼所看到的景象
    this.camera = new THREE.PerspectiveCamera(45, this.innerWidth / this.innerHeight, 1, 10000);
    this.camera.position.set(-17, 47, -120);
    this.camera.lookAt(0, 0, 0);
  }
  /**
   * @name: 初始化用户操作
   */
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
    this.controls.autoRotate = false;
    this.controls.enablePan = false;

    this.controls.addEventListener("change", () => {
      const events = this.events["change"];
      events &&
        events.forEach((callback) => {
          callback(this.camera);
        });
    });
  }
  animate() {
    this.render();
  }
  /**
   * @name: 进行渲染
   */
  render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // 地球旋转控制
    if (this.model && this.options && this.options.viewControl.autoRotate && !this.hasStop) {
      let viewControl = this.options.viewControl;
      if (viewControl.autoRotateDirection === "cw") {
        // 顺时针
        this.model.rotation.y -= viewControl.autoRotateSpeed / 1000;
      } else {
        this.model.rotation.y += viewControl.autoRotateSpeed / 1000;
      }
    }

    if (this.controls) {
      this.controls.update();
    }
  }
  /**
   * @description 设置相机
   * @param {x}
   * @param {y}
   * @param {z}
   * @return Promise
   */
  setCamera(x, y, z) {
    this.camera && this.camera.position.set(x, y, z);
  }
  getCamera() {
    if (this.camera) {
      return this.camera.position;
    }
  }
  /**
   * @name: 设置对应对象的属性并进行渲染
   * @param {*} options 配置
   * @return {*}
   */
  setOptions(options) {
    this.options = options;
    this.clear(); // 清除资源
    const { model, camera, lights } = options;
    const { x, y, z } = camera;
    if ((this.isDesign && !this.isInitCamera) || !this.isDesign) {
      this.setCamera(x, y, z);
    }
    this.isInitCamera = true;
    // 处理光源
    const AmbientLightConfig = lights[0];
    const { color, intensity } = AmbientLightConfig;
    const AmbientLight = new THREE.AmbientLight(color, intensity);

    this.lights.push(AmbientLight);

    try {
      lights.slice(1).forEach((item) => {
        const { key, intensity, color, position } = item;
        const light = new THREE[key](color, intensity);
        position && light.position.set(...position);
        this.lights.push(light);
      });
    } catch (error) {
      console.warn(`error:${error}`);
    }
    this.lights.forEach((it) => {
      this.scene.add(it);
    });
    // 处理模型
    const { url, callback } = model;

    if (!url || this.url === url) return false;
    this.url = url;
    const loader = new GLTFLoader();
    this.loader = loader;
   

    loader.setDRACOLoader(this.dracoLoader);
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        this.model = model;
        this.scene.add(model);
        if (typeof callback === "function") {
          callback(model);
        }
      },
      undefined,
      function (error) {
        console.warn(error);
      }
    );
  }
  resize() {
    const el = this.el;
    this.innerWidth = el.offsetWidth;
    this.innerHeight = el.offsetHeight;
    this.renderer.setSize(this.innerWidth, this.innerHeight);
    this.camera.aspect = this.innerWidth / this.innerHeight;
    this.camera.updateProjectionMatrix();
  }
  clear() {
    // this.loader && this.loader.dispose();
    const { model } = this.options;
    this.lights.forEach((light) => {
      this.scene.remove(light);
    });
    this.lights = [];
    if (model.url !== this.url) {
      this.model && this.scene.remove(this.model);
    }
  }

  /**
   * @name: 销毁
   */
  destroy() {
    this.clear();
    console.log("测试释放内存");
    const { renderer, scene, CSS3DRenderer } = this;
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss();

    renderer.content = null;
    renderer.domElement = null;

    this.controls && this.controls.dispose();
    this.controls = null;
    this.el = null;

    this.renderer = null;
    this.scene = null;
    this.camera = null;
  }
  off(eventName) {
    if (eventName) {
      Reflect.deleteProperty(this.events, eventName);
    } else {
      this.events = {};
    }
  }
  on(eventName, cb) {
    if (this.events[eventName]) {
      this.events[eventName].push(cb);
    } else {
      this.events[eventName] = [cb];
    }
  }
}
