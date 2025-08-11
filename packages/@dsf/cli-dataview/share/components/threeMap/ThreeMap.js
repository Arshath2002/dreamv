/*
 * @Editor: zhanghang
 * @Description:three 地图类
 * @Date: 2024-06-11 11:10:03
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-19 19:44:15
 */
import * as THREE from "three";
import { geoMercator } from "d3-geo";

import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { drawDistrict, districtRender, districtAnimate } from "./utils/drawDistrict.js";
import { drawOutline } from "./utils/drawOutLine.js";
import { drawGlow } from "./utils/drawGlow.js";
import { drawMirror, drawGradientPlane } from "./utils/drawPlane.js";
import { drawMarker } from "./utils/drawMarker.js";
import { drawPrism } from "./utils/drawPrism.js";
import { drawFlight, updateMiniFly } from "./utils/drawFlight.js";
import { drawScatter } from "./utils/drawScatter.js";
import { drawCylinder } from "./utils/drawCylinder.js";

import { addTooltip, tooltipRender } from "./utils/addTooltip.js";
import { drawGrid } from "./utils/drawGrid.js";
import { drawFoundation } from "./utils/drawFoundation.js";

import { register } from "./utils/register.js";

import gisUtils from "_dataview/output/utils/gis.js";

export default class ThreeMap {
  constructor(el, tooltipDom, options = {}) {
    this.el = el;
    this.innerWidth = el.offsetWidth;
    this.innerHeight = el.offsetHeight;

    // 是否在设计器中
    this.isDesign = !!options.isDesign;
    this.isInitCamera = false;
    //注册的地图对象
    this.registerList = new Map();
    //场景
    this.scene = null;
    //渲染器
    this.renderer = null;
    //相机
    this.camera = null;
    //tooltip
    this.tooltipDom = tooltipDom;
    this.tooltip = null;

    this.events = {};

    // 纹理数组
    this.mapTextures = [];

    //墨卡托投影-在加载地图数据时候转换
    this.projection = null;
    //辅助
    this.axesHelper = null;
    //用来缓存不辉光对象辉光前的材质
    this.cacheMaterials = {};
    //将不辉光对象按照类型缓存黑色材质
    this.cacheDarkMaterials = {};

    //地区数据
    this.districtData = [];
    //系类分组
    this.seriesGroup = new THREE.Group();

    //环境分组
    this.environmentGroup = new THREE.Group();
    //强制刷新
    this.refresh = true;

    // 下转地图缩放比 默认是1
    this.scale = 1;

    //缓存的模型--每次刷新清空
    this.cacheModel = {
      modelScale: [],
      modelBox: null,
      code: null,
    };

    this.foundationIns = [];

    // 是否清除地图
    this.isClear = false;

    //初始鼠标位置
    this.pointer = new THREE.Vector2(-100000, -10000);

    this.mouseEvent = null;
    const onPointerMove = function (mouseEvent) {
      this.pointer.x = (mouseEvent.offsetX / this.innerWidth) * 2 - 1;
      this.pointer.y = -(mouseEvent.offsetY / this.innerHeight) * 2 + 1;
      this.mouseEvent = mouseEvent;
    };
    this.onPointerMove = onPointerMove.bind(this);

    const onPointerClick = function (e) {
      e.stopPropagation();
      e.preventDefault();
      const { raycaster, scene } = this;
      const intersects = raycaster.intersectObjects(scene.children, true);
      const r = intersects.filter((it) => it.object._type === "cylinder" || it.object._type === "district" || it.object._type === "scatter");
      if (r.length) {
        const mesh = r[0].object;
        const { deriveColor, ...properties } = mesh._privateData;
        if (this.events["click"]) {
          this.events["click"].forEach((cb) => {
            cb(properties);
          });
        }
      }
    };
    this.onPointerClick = onPointerClick.bind(this);
    this.el.addEventListener("mousemove", this.onPointerMove);
    this.el.addEventListener("mousedown", this.onPointerClick);

    const onDblClick = function (e) {
      e.stopPropagation();
      e.preventDefault();
      const { raycaster, scene } = this;
      const intersects = raycaster.intersectObjects(scene.children, true);
      const r = intersects.filter((it) => it.object._type === "cylinder" || it.object._type === "district" || it.object._type === "scatter");
      if (r.length) {
        const mesh = r[0].object;
        const { deriveColor, ...properties } = mesh._privateData;
        if (this.events["dblclick"]) {
          this.events["dblclick"].forEach((cb) => {
            cb(properties);
          });
        }
      }
    };
    this.onDblClick = onDblClick.bind(this);
    this.el.addEventListener("dblclick", this.onDblClick);

    this.scene = new THREE.Scene();

    this.scene.add(this.seriesGroup);
    this.scene.add(this.environmentGroup);

    this.clock = new THREE.Clock();
    // 添加射线对象
    this.raycaster = new THREE.Raycaster();

    this.lights = this.setLight();
    this.initCamera();
    this.setRenderer();
    this.setCssRenderer();

    this.addHelper();
    this.setController();
  }
  //设置地图的options
  /**
   * @Description 设置配置项
   * @param {Object} options 地图配置项
   * @param {Boolean} refresh  是否刷新
   */
  setOption(options, refresh = true) {
    // 保存构建区域异步状态，冗余添加
    this.mapKey = dsf.uuid();

    //清除地图上系列
    this.clearMap();
    this.isClear = false;
    this.seriesGroup = new THREE.Group();
    this.scene.add(this.seriesGroup);
    this.environmentGroup = new THREE.Group();
    this.scene.add(this.environmentGroup);
    this.options = options;
    const code = options.map.toString();
    const camera = options.camera;
    const { x, y, z } = camera;
    this.setEnvironment(options);
    this.setFoundation(options);

    if ((this.isDesign && !this.isInitCamera) || !this.isDesign) {
      this.setCamera(x, y, z);
    }
    this.isInitCamera = true;

    const { autoRotate, config } = options;
    const { disableRotate = false, disableZoom = false } = config;

    if (autoRotate && this.controls) {
      this.controls.autoRotate = autoRotate.autoRotate;
      this.controls.autoRotateSpeed = autoRotate.autoRotateSpeed;
    }
    if (this.controls) {
      this.controls.enableRotate = !disableRotate;
      this.controls.enableZoom = !disableZoom;
    }

    this.addTooltip();
    if (this.registerList.get(code)) {
      const [boundary, full, projection] = this.registerList.get(code);
      this.refresh = refresh;
      // 刷新需要更新投影坐标系---切换不需要更新投影坐标系
      if (refresh) {
        this.projection = projection;
        this.scale = 1;
        // 清空cacheModel
        this.cacheModel = {
          modelScale: [],
          modelBox: null,
          code: code,
        };
      } else {
        try {
          //全模型
          if (code === this.cacheModel.code) {
            this.scale = 1;
          } else {
            const item = this.cacheModel.modelScale.find((it) => it.code == code);
            // 获取模型的缩放比例
            this.scale = item.scale;
          }
        } catch (error) {
          console.warn(`abstain model failed ${error}`);
          this.refresh = true;
          this.projection = projection;
          this.scale = 1;
        }
      }

      console.time("绘制地图区域");
      this.drawDistrictArea(options.data, full.features, options);
      console.timeEnd("绘制地图区域");
      console.time("绘制地图边界");
      this.drawDistrictOutline(boundary.features, options);
      console.timeEnd("绘制地图边界");
      const series = options.series;

      series.forEach((item) => {
        switch (item.type) {
          case "marker":
            this.addMarkerLayer(item);
            break;
          case "prism":
            this.addPrismLayer(item);
            break;
          case "flight":
            this.addLinkLayer(item);
            break;
          case "scatter":
            this.addSCatterLayer(item);
            break;
          case "cylinder":
            this.addCylinderLayer(item);
            break;
        }
      });
    } else {
      throw Error("请先注册地图", code);
    }
  }
  //设置环境
  setEnvironment(options) {
    //设置辉光
    const { bloomComposer, finalComposer } = drawGlow.call(this, options);
    this.bloomComposer = bloomComposer;
    this.finalComposer = finalComposer;
    if (options.mirror.show) {
      //倒影进行镜像
      const mirror = drawMirror.call(this, this.innerWidth, this.innerHeight, options.config);
      const gradientPlane = drawGradientPlane.call(this, options.mirror.color);
      this.environmentGroup.add(mirror);
      this.environmentGroup.add(gradientPlane);
    }
  }
  setFoundation(options) {
    const grid = options.grid;
    const foundation = options.foundation;
    if (grid.show) {
      const gridIns = drawGrid.call(this, grid);
      this.environmentGroup.add(gridIns);
    }
    if (foundation && foundation.show) {
      const foundationIns = drawFoundation.call(this, foundation, options.config);
      foundationIns && this.environmentGroup.add(foundationIns);
      this.foundationIns = [foundationIns];
    }
  }
  //注册地图
  registerMap(code = "100000", config) {
    code = code.toString();
    return register(code).then(([boundary, full]) => {
      // 计算区域质心
      let center = gisUtils.centerOfMass(boundary.features[0]).geometry.coordinates;
      let scale = 10;

      if (boundary.features[0]) {
        if (config.autoScale) {
          // 获取geo界框，根据经纬度差值映射到容器内
          let box = gisUtils.bbox(boundary.features[0]);
          // 有岛屿-地图显得小
          if (code == "100000") {
            box = gisUtils.bbox(gisUtils.featureCollection(full.features));
          }


          const { innerHeight, innerWidth } = this;
          // 维度差值
          const latDelta = Math.abs(box[1] - box[3]);
          // 1维度等于多少像素
          const latProperty = innerHeight / latDelta;

          //经度差值
          const lngDelta = Math.abs(box[0] - box[2]);
          // 1 经度等于多少像素
          const lngProperty = innerWidth / lngDelta;
          // 有个容器的大小系数
          const ratio = 550 / Math.max(innerHeight, innerWidth);
         // config.autoScaleFactor 修正系数 默认1 
          scale = Math.floor(Math.min(lngProperty, latProperty)) * ratio*config.autoScaleFactor;

        } else {
          // 根据geo预设的层级设置缩放
          const properties = boundary.features[0].properties;
          const level = properties.level;
          switch (level) {
            case "country":
              scale = 10;
              break;
            case "province":
              scale = 50;
              break;
            //没测试过区县大小，先给随便给一个缩放大小
            default:
              scale = 80;
              break;
          }
        }
      }

      const projection = geoMercator().center(center).scale(scale).translate([0, 0]);
      this.registerList.set(code, [boundary, full, projection]);
      return full;
    });
  }

  setLight() {
    const front = new THREE.DirectionalLight(0xe8eaeb, 0.8);
    front.position.set(0, 15, 25);
    const back = front.clone();
    back.position.set(0, 15, -25);
    const left = front.clone();
    left.position.set(-25, 15, 0);
    const right = front.clone();
    right.position.set(25, 15, 0);

    this.scene.add(front);
    this.scene.add(back);
    this.scene.add(left);
    this.scene.add(right);

    return [front, back, left, right];
  }
  /**
   * @description 初始化相机
   * @param {无}
   * @return Promise
   */
  initCamera() {
    // 第二参数就是 长度和宽度比 默认采用浏览器  返回以像素为单位的窗口的内部宽度和高度
    this.camera = new THREE.PerspectiveCamera(75, this.innerWidth / this.innerHeight, 0.1, 1000);
    this.camera.position.set(1, 5, 5);
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
   * @description 设置渲染器
   * @param {无}
   * @return Promise
   */
  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });

    // 设置画布的大小
    this.renderer.setSize(this.innerWidth, this.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMapSoft = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setAnimationLoop(this.animate.bind(this));

    //canvas 画布  renderer.domElement
    this.renderer.setClearAlpha(0);
    this.el.appendChild(this.renderer.domElement);
  }
  /**
   * @description css2d渲染器--用于标签显示
   * @param {无}
   * @return Promise
   */
  setCssRenderer() {
    this.CSS2DRenderer = new CSS2DRenderer();
    this.CSS2DRenderer.setSize(this.innerWidth, this.innerHeight);
    this.CSS2DRenderer.domElement.style.position = "absolute";
    this.CSS2DRenderer.domElement.style.top = "0px";
    // this.CSS2DRenderer.domElement.style.pointerEvents = "none";
    this.el.appendChild(this.CSS2DRenderer.domElement);
  }

  animate() {
    this.render();
  }
  //渲染场景
  render() {
    const { cacheDarkMaterials, cacheMaterials, controls, pointer, camera, raycaster, scene, bloomComposer, finalComposer } = this;
    // 更新控制器
    controls.update();

    //更新射线位置
    raycaster.setFromCamera(pointer, camera);

    // 飞行线动分组
    const flightGroup = this.seriesGroup.children.filter((it) => it._category === "flight");
    flightGroup.forEach((group) => {
      updateMiniFly(group.children);
    });

    this.CSS2DRenderer.render(scene, camera);

    scene.traverse((mesh) => {
      if (mesh instanceof THREE.Scene) {
        cacheDarkMaterials.scene = mesh.background;
        mesh.background = null;
      }

      const material = mesh.material;
      if (material && !mesh._isGlow && material.type != "ShaderMaterial") {
        cacheMaterials[mesh.uuid] = material;

        if (!cacheDarkMaterials[material.type]) {
          const Proto = Object.getPrototypeOf(material).constructor;
          cacheDarkMaterials[material.type] = new Proto({ color: 0x000000 });
        }
        mesh.material = cacheDarkMaterials[material.type];
      }
    });
    // 2. 用 bloomComposer 产生辉光
    bloomComposer && bloomComposer.render();

    // 3. 将转成黑色材质的物体还原成初始材质
    scene.traverse((mesh) => {
      if (cacheMaterials[mesh.uuid]) {
        mesh.material = cacheMaterials[mesh.uuid];
        delete cacheMaterials[mesh.uuid];
      }
      if (mesh instanceof THREE.Scene) {
        mesh.background = cacheMaterials.scene;
        delete cacheMaterials.scene;
      }
    });
    // 4. 用 finalComposer 作最后渲染
    finalComposer && finalComposer.render();
    //区域渲染
    districtRender.call(this);

    tooltipRender.call(this);

    // 动效点分组
    const scatterGroup = this.seriesGroup.children.filter((it) => it._category === "scatter");
    scatterGroup.forEach((group) => {
      group.children.forEach((mesh) => {
        const ring = mesh.children[0];
        ring._scale += 0.01;
        ring.scale.set(1 * ring._scale, 1 * ring._scale, 1 * ring._scale);
        if (ring._scale <= 2) {
          ring.material.opacity = 2 - ring._scale;
        } else {
          ring._scale = 1;
        }
      });
    });

    this.foundationIns.forEach((mesh) => {
      mesh && (mesh.rotation.z -= mesh._speed || 0.003);
    });
    // 地图模型侧边渐变效果
    const mapUf = this.mapUf;
    districtAnimate.call(this, mapUf);
  }
  /**
   * @description 构建区域边界线
   * @param {string} source
   * @param {object} options => 图层配置
   * @return {无}
   */
  drawDistrictOutline(features, options) {
    const { outline, drawWall, wallTexture } = drawOutline.call(this, features, options, options.config);
    this.seriesGroup.add(outline);
    this.mapTextures.push(wallTexture);
    drawWall().then((group) => {
      this.seriesGroup && this.seriesGroup.add(group);
    });
  }
  /**
   * @description 构建区域数据
   * @param {string} source
   * @param {object} options => 图层配置
   * @return {无}
   */
  drawDistrictArea(data = [], features, options) {
    const { meshGroup, advanceMeshGroup, mapUf, districtData, _realShape, mapTexture } = drawDistrict.call(this, data, options, features, options.config);
    this.mapTextures.push(mapTexture);
    this.mapUf = mapUf;
    this.districtData = districtData;

    // 不是强刷新需要计算偏移量
    if (!this.refresh) {
      advanceMeshGroup.scale.set(this.scale, 1, this.scale);
      const scaledBox = new THREE.Box3().setFromObject(advanceMeshGroup);
      advanceMeshGroup.scale.set(1, 1, 1);
      const center = new THREE.Vector3();
      // 获取放大后模型的中心点
      scaledBox.getCenter(center);
      // 将模型的位置调整，使缩放后的中心位于原点
      this.seriesGroup.position.sub(center);
      this.seriesGroup.scale.set(this.scale, 1, this.scale);

      this.seriesGroup.add(advanceMeshGroup);
      this.seriesGroup.add(meshGroup);
    } else {
      this.seriesGroup.add(advanceMeshGroup);
      this.seriesGroup.add(meshGroup);
    }
    const mapKey = this.mapKey;
    _realShape().then((group) => {
      this.seriesGroup.remove(advanceMeshGroup);

      if (mapKey != this.mapKey) return false;

      const res = group.children;
      this.seriesGroup.add(group);

      // 如果是刷新--需要更新缓存模型
      if (this.refresh) {
        // 全模型包围盒子
        const modelBox = new THREE.Box3();
        res.forEach((district) => {
          const itemBox = new THREE.Box3().setFromObject(district);
          modelBox.union(itemBox);
        });
        this.cacheModel.modelBox = modelBox;
      }
      const modelBox = this.cacheModel.modelBox;
      const modelScale = [];
      res.forEach((mesh) => {
        const code = mesh._privateData.adcode;
        const model = mesh.clone();
        model.scale.set(1, 1, 1);
        const currentModel = new THREE.Box3().setFromObject(model);
        // 计算宽度和高度
        const widthA = modelBox.max.x - modelBox.min.x;
        const heightA = modelBox.max.z - modelBox.min.z;
        const widthB = currentModel.max.x - currentModel.min.x;
        const heightB = currentModel.max.z - currentModel.min.z;
        // 计算宽度和高度的比例
        const widthRatio = widthA / widthB;
        const heightRatio = heightA / heightB;
        // 当前模型与全模型大小的缩放值
        const scale = (widthRatio + heightRatio) / 2;
        modelScale.push({ code, scale });
      });
      this.cacheModel.modelScale.push(...modelScale);
    });
  }
  addTooltip() {
    const tooltip = addTooltip.call(this, this.options.tooltip);
    if (tooltip) {
      this.tooltip = tooltip;
      this.tooltip._hide();
    } else {
      this.tooltip = null;
    }
  }
  /**
   * @description 加载点图层
   * @param {object} options 图层配置
   * @return {无}
   */
  addMarkerLayer(options) {
    const config = this.options.config;
    const markerGroup = drawMarker.call(this, options, config);
    this.seriesGroup.add(markerGroup);
  }
  /**
   * @description 加载平面棱柱图层
   * @param {Array} data
   * @return {无}
   */
  addPrismLayer(options) {
    const config = this.options.config;
    const prismsGroup = drawPrism.call(this, options, config);
    this.seriesGroup.add(prismsGroup);
  }
  /**
   * @description 加载飞行线图层
   * @param {string} source
   * @return {无}
   */
  addLinkLayer(options) {
    const config = this.options.config;
    const group = drawFlight.call(this, options, config);
    this.seriesGroup.add(group);
  }
  /**
   * @description 加载3D圆柱图层
   * @param {Array} data
   * @return {无}
   */
  addCylinderLayer(options) {
    const config = this.options.config;
    const cylinderGroup = drawCylinder.call(this, options, config);
    this.seriesGroup.add(cylinderGroup);
  }
  /**
   * @description 加载动效点图层
   * @param {string} source
   * @return {无}
   */
  addSCatterLayer(options) {
    const config = this.options.config;
    const scatterGroup = drawScatter.call(this, options, config);
    this.seriesGroup.add(scatterGroup);
  }
  /**
   * @description 摧毁地图
   * @return {无}
   */
  destroyMap() {
    console.log("释放three内存");
    this.el.removeEventListener("mousemove", this.onPointerMove);
    this.el.removeEventListener("mousedown", this.onPointerClick);
    this.el.removeEventListener("dblclick", this.onDblClick);
    //摧毁纹理
    this.mapTextures.forEach((texture) => {
      texture && texture.dispose();
    });

    this.lights.forEach((light) => {
      this.scene.remove(light);
    });

    this.lights = [];
    this.clearMap();
    this.cacheModel = null;

    const { renderer, scene, CSS2DRenderer } = this;

    scene.traverse((child) => {
      if (child.material) {
        child.material.dispose();
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

    CSS2DRenderer.domElement = null;

    this.bloomComposer && this.bloomComposer.dispose();
    this.finalComposer && this.finalComposer.dispose();
    this.axesHelper && this.axesHelper.dispose();

    this.controls && this.controls.dispose();
    this.controls = null;

    this.seriesGroup = null;
    this.environmentGroup = null;
    this.cacheMaterials = {};
    this.cacheDarkMaterials = {};
    this.clock = null;
    this.raycaster = null;
    this.districtData = [];
    this.el = null;
    this.tooltipDom = null;
    this.axesHelper = null;
    this.finalComposer = null;
    this.bloomComposer = null;
    this.CSS2DRenderer = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.pointer = null;
  }
  /**
   * @description 清除地图上所有图层
   * @return {无}
   */
  clearMap() {
    this.isClear = true;
    const environmentGroup = this.environmentGroup;
    environmentGroup.traverse((obj) => {
      if (obj.type === "Mesh") {
        obj.geometry.dispose?.();
        obj.material.dispose?.();
        obj.material.map && obj.material.map.dispose();
      }
    });
    if (environmentGroup.children.length) {
      environmentGroup.children = []; //删除所有后代模型对象
    }
    const seriesGroup = this.seriesGroup;
    seriesGroup.traverse((obj) => {
      if (obj.type === "Mesh") {
        obj.geometry.dispose?.();
        obj.material.dispose?.();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((material) => {
            material.dispose?.();
            if (material.map) material.map.dispose();
          });
        }
      } else if (["label", "marker", "prism"].includes(obj._type)) {
        obj.element.remove();
      }
    });
    if (seriesGroup.children.length) {
      seriesGroup.children = []; //删除所有后代模型对象
    }

    this.foundationIns = [];

    this.scene.remove(this.seriesGroup);

    this.scene.remove(this.environmentGroup);
  }
  resize() {
    const el = this.el;
    this.innerWidth = el.offsetWidth;
    this.innerHeight = el.offsetHeight;
    // cnavas画布宽高度重新设置
    this.renderer.setSize(this.innerWidth, this.innerHeight);
    this.CSS2DRenderer.setSize(this.innerWidth, this.innerHeight);
    this.camera.aspect = this.innerWidth / this.innerHeight;
    this.camera.updateProjectionMatrix();
  }
  addHelper() {
    const axesHelper = new THREE.AxesHelper(0);
    axesHelper.layers.enableAll();
    this.axesHelper = axesHelper;
    this.scene.add(axesHelper);
  }
  setController() {
    const controls = new OrbitControls(this.camera, this.el);

    controls.enableDamping = true;

    //上下翻转的最大角度
    controls.maxPolarAngle = 1.2;
    //上下翻转的最小角度
    controls.minPolarAngle = 0;
    // 禁止相机平移
    controls.enablePan = false;
    this.controls = controls;

    this.controls.addEventListener("change", () => {
      const events = this.events["change"];
      events &&
        events.forEach((callback) => {
          callback(this.camera);
        });
    });
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
