/*
 * @Description: 地球相关类
 * @Author: shenah
 * @Date: 2024-08-22 09:07:49
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-21 17:43:05
 */

import * as THREE from "three";

import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { addTooltip } from "./utils/addTooltip.js";
import { createEarth } from "./utils/drawEarth.js";

import { drawScatters, waveAnimate } from "./utils/drawScatters.js";
import { drawFlight } from "./utils/drawFlight.js";
import { drawMarker } from "./utils/drawMarker.js";
import { drawSatellite } from "./utils/drawSatellite.js";
import { drawWorld, districtRender } from "./utils/drawWorld.js";
import { drawLightBar } from "./utils/drawLightBar.js";
export default class ThreeEarth {
  constructor(el, { markerTooltip, isDesign = false }) {
    this.el = el;
    this.innerWidth = el.offsetWidth;
    this.innerHeight = el.offsetHeight;
    // marker 提示框
    this.markerTooltipDom = markerTooltip;

    // 是否在设计器中
    this.isDesign = !!isDesign;
    this.isInitCamera = false;

    this.markerTooltip = null;

    this.events = {};

    // 灯光
    this.lights = [];

    //标签
    this.markers = [];

    // 渲染器
    this.renderer = null;
    // 相机
    this.camera = null;
    // 场景
    this.scene = null;
    // 光环
    this.aureola = null;
    // 卫星
    this.satellites = [];

    // 添加视野射线对象
    this.raycaster = new THREE.Raycaster();

    // 初始鼠标位置
    this.pointer = new THREE.Vector2(-100000, -10000);

    // 轨道控制器
    this.controls = null;

    this.waves = [];
    this.flight = [];
    // 球体
    this.earthGroup = new THREE.Group();
    // 卫星
    this.satelliteGroup = new THREE.Group();

    //停止旋转
    this.hasStop = false;

    this.scene = new THREE.Scene();

    this.scene.add(this.earthGroup);
    this.scene.add(this.satelliteGroup);

    this.init(); // 初始化

    this.mouseEvent = null;
    const onPointerMove = function (mouseEvent) {
      const { raycaster, scene, markerTooltip, innerWidth, innerHeight } = this;
      if (markerTooltip) {
        markerTooltip._hide();
      }
      this.pointer.x = (mouseEvent.offsetX / innerWidth) * 2 - 1;
      this.pointer.y = -(mouseEvent.offsetY / innerHeight) * 2 + 1;
      this.mouseEvent = mouseEvent;

      const intersects = raycaster.intersectObjects(scene.children, true);
      const hasStop = intersects.filter((it) => it.object._type === "earth");
      this.hasStop = hasStop.length ? true : false;
    };
    this.onPointerMove = onPointerMove.bind(this);
    this.el.addEventListener("mousemove", this.onPointerMove);

    const mouseOut = function () {
      this.hasStop = false;
    };
    this.mouseOut = mouseOut.bind(this);
    this.el.addEventListener("mouseout", this.mouseOut);
  }
  init() {
    this.initRenderer(); // 初始化渲染器
    this.initCamera(); // 初始化相机
    this.initControls(); // 初始化用户操作
    this.setCssRenderer();
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
   * @description css2d渲染器--用于标签显示
   * @param {无}
   * @return Promise
   */
  setCssRenderer() {
    this.CSS3DRenderer = new CSS3DRenderer();
    this.CSS3DRenderer.setSize(this.innerWidth, this.innerHeight);
    this.CSS3DRenderer.domElement.style.position = "absolute";

    this.CSS3DRenderer.domElement.style.top = "0px";
    this.CSS3DRenderer.domElement.style.pointerEvents = "none";
    this.el.appendChild(this.CSS3DRenderer.domElement);
  }

  /**
   * @name: 初始化相机
   */
  initCamera() {
    // 模拟人眼所看到的景象
    this.camera = new THREE.PerspectiveCamera(45, this.innerWidth / this.innerHeight, 1, 10000);
    this.camera.position.set(-17, 47, -120);

    const { x, y, z } = this.camera.position;

    const startRatio = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    this.startRatio = startRatio;
    this.camera.lookAt(0, 0, 0);
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
   * @param {*} options 球体等对象的配置
   * @return {*}
   */
  setOption(options) {
    this.options = options;
    this.clear(); // 清除资源
    const camera = options.camera;
    const { x, y, z } = camera;
    if ((this.isDesign && !this.isInitCamera) || !this.isDesign) {
      this.setCamera(x, y, z);
    }
    this.isInitCamera = true;

    this.earthGroup = new THREE.Group();
    this.scene.add(this.earthGroup);
    this.satelliteGroup = new THREE.Group();
    this.scene.add(this.satelliteGroup);

    this.sphere = createEarth(options.earth, options.config);
    this.earthGroup.add(this.sphere);

    this.addMarkerTooltip();

    if (options.world && options.world.show) {
      this.addWordData(options.world);
    }

    if (options.satellite.show) {
      this.addSatellite(options.satellite);
    }

    const series = options.series;
    series.forEach((item) => {
      switch (item.type) {
        case "scatter":
          this.addScatterLayer(item);
          break;
        case "marker":
          this.addMarkerLayer(item);
          break;
        case "flight":
          this.addFlightLayer(item);
          break;
        case "lightBar":
          this.addLightBar(item);
          break;
      }
    });
  }
  /**
   * @name: 添加世界轮廓
   * @param {*} options 配置
   * @return {*}
   */
  async addWordData(options) {
    const { mesh, markers } = await drawWorld.call(this, options, this.options.config);
    if (mesh.length) {
      this.earthGroup.add(...mesh, ...markers);
      this.markers.push(...markers);
    }
  }
  /**
   * @name: 添加光柱
   * @param {*} options 配置
   * @return {*}
   */
  addLightBar(options) {
    const { cylinder, labels } = drawLightBar(options, this.options.config);
    if (cylinder.length) {
      this.earthGroup.add(...cylinder, ...labels);
      this.markers.push(...labels);
    }
  }
  /**
   * @name: 添加卫星
   * @param {*} options 配置
   * @return {*}
   */
  addSatellite(options) {
    const res = drawSatellite(options);
    if (res.length) {
      this.satellites.push(...res);
      this.satelliteGroup.add(...res);
    }
  }

  addMarkerTooltip() {
    const tooltip = addTooltip.call(this, this.options.markerTooltip, this.markerTooltipDom);
    if (tooltip) {
      this.markerTooltip = tooltip;
      this.markerTooltip._hide();
    } else {
      this.markerTooltip = null;
    }
  }
  /**
   * @name: 添加标注图层
   * @param {*} options 配置
   * @return {*}
   */
  addMarkerLayer(options) {
    const markers = drawMarker.call(this, options, this.options.config);
    if (markers.length) {
      this.markers.push(...markers);
      this.earthGroup.add(...markers);
    }
  }
  /**
   * @name: 添加飞行线图层
   * @param {*} options 配置
   * @return {*}
   */
  addFlightLayer(options) {
    const { flightLine } = drawFlight(options, this.options.config);

    if (flightLine.length) {
      this.flight.push(...flightLine);
      this.earthGroup.add(...flightLine);
    }
  }
  /**
   * @name: 添加扩散点图层
   * @param {*} options 配置
   * @return {*}
   */
  addScatterLayer(options) {
    const { pointMeshCollect, waveMeshCollect } = drawScatters(options, this.options.config);
    if (pointMeshCollect.length && waveMeshCollect.length) {
      //缓存动效点
      this.waves.push(...waveMeshCollect);
      this.earthGroup.add(...waveMeshCollect, ...pointMeshCollect);
    }
  }
  /**
   * @name: 初始化用户操作
   */
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
    this.controls.autoRotate = false;
    this.controls.enablePan = true;

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
    const { pointer, raycaster, camera, scene } = this;
    //更新射线位置
    raycaster.setFromCamera(pointer, camera);

    this.CSS3DRenderer.render(scene, camera);
    // 撒点动画
    waveAnimate(this.waves);
    //区域渲染
    districtRender.call(this);

    // 飞行动画
    this.flight.forEach((it) => {
      const flyLine = it.userData["flyLine"];
      flyLine.rotation.z += flyLine._speed; // 调节飞线速度
      if (flyLine.rotation.z >= flyLine.flyEndAngle) flyLine.rotation.z = 0;
    });

    this.markers.forEach((it) => {
      const worldPosition = new THREE.Vector3();
      it.getWorldPosition(worldPosition);

      const distanceToCamera = worldPosition.distanceTo(camera.position);
      const cameraDistance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
      const maxDistance = Math.sqrt(cameraDistance ** 2 + 40 ** 2);
      if (distanceToCamera > maxDistance) {
        it.element.classList.add("marker-hidden");
      } else {
        it.element.classList.remove("marker-hidden");
      }
    });

    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);

    // 地球光圈
    if (this.sphere) {
      const uniforms = this.sphere._uniforms;
      uniforms.time.value = uniforms.time.value < -this.sphere._uTime ? this.sphere._uTime : uniforms.time.value - 1;
    }
    // 卫星
    if (this.satellites.length) {
      this.satellites.forEach((res) => {
        const autoRotateDirection = res._direction;
        const autoRotateSpeed = res._speed;
        if (autoRotateDirection === "cww") {
          // 顺时针
          res.rotation.z -= autoRotateSpeed / 1000;
        } else {
          res.rotation.z += autoRotateSpeed / 1000;
        }
      });
    }

    // 地球旋转控制
    if (this.options && this.options.viewControl.autoRotate && !this.hasStop) {
      let viewControl = this.options.viewControl;
      if (viewControl.autoRotateDirection === "cw") {
        // 顺时针
        this.earthGroup.rotation.y -= viewControl.autoRotateSpeed / 1000;
      } else {
        this.earthGroup.rotation.y += viewControl.autoRotateSpeed / 1000;
      }
    }
    if (this.controls) {
      this.controls.update();
    }
  }
  resize() {
    const el = this.el;
    this.innerWidth = el.offsetWidth;
    this.innerHeight = el.offsetHeight;
    this.renderer.setSize(this.innerWidth, this.innerHeight);
    this.CSS3DRenderer.setSize(this.innerWidth, this.innerHeight);
    this.camera.aspect = this.innerWidth / this.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  /**
   * @name: 清除所有图层
   */
  clear() {
    this.waves = [];
    this.flight = [];
    this.markers = [];
    this.satellites = [];
    this.aureola = null;

    const earthGroup = this.earthGroup;
    earthGroup.traverse((obj) => {
      if (obj.type === "Mesh" || obj.type === "Points" || obj.type === "Line") {
        obj.geometry.dispose?.();
        obj.material.dispose?.();
        if (obj.material.map) {
          obj.material.map.dispose();
        }
      } else if (obj._type === "marker" || obj._type === "label") {
        obj.element.remove();
      }
    });
    if (earthGroup.children.length) {
      earthGroup.children = []; //删除所有后代模型对象
    }
    const satelliteGroup = this.satelliteGroup;
    satelliteGroup.traverse((obj) => {
      if (obj.type === "Mesh" || obj.type === "Points" || obj.type === "Line") {
        obj.geometry.dispose?.();
        obj.material.dispose?.();
        if (obj.material.map) {
          obj.material.map.dispose();
        }
      }
    });
    if (satelliteGroup.children.length) {
      satelliteGroup.children = []; //删除所有后代模型对象
    }

    this.scene.remove(this.satelliteGroup);
    this.scene.remove(this.earthGroup);
    this.earthGroup = null;
    this.satelliteGroup = null;
  }

  /**
   * @name: 销毁地球
   */
  destroyMap() {
    this.clear();
    console.log("测试释放地球内存");
    this.el.removeEventListener("mousemove", this.onPointerMove);
    this.el.removeEventListener("mouseout", this.mouseOut);
    this.lights.forEach((light) => {
      this.scene.remove(light);
    });
    this.lights = [];

    const { renderer, scene, CSS3DRenderer } = this;

    scene.traverse((child) => {
      if (child.material) {
        child.material.dispose();
        if (child.material.map) {
          child.material.map.dispose();
        }
      }

      if (child.geometry) {
        child.geometry.dispose();
      }
      child = null;
    });
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss();

    renderer.content = null;
    renderer.domElement = null;
    CSS3DRenderer.domElement = null;

    this.controls && this.controls.dispose();
    this.controls = null;
    this.el = null;
    this.markerTooltipDom = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.pointer = null;
    this.raycaster = null;
    this.CSS3DRenderer = null;
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
