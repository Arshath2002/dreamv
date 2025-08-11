/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2025-02-21 10:32:44
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-21 18:10:44
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export default class ThreeCylinder {
  constructor(el, isDesign = false) {
    this.el = el;
    this.innerWidth = el.offsetWidth;
    this.innerHeight = el.offsetHeight;

    this.isInitCamera = false;

    // 是否在设计器中
    this.isDesign = !!isDesign;

    this.events = {};
    this.hasStop = false;

    this.group = new THREE.Group();
    // 场景
    this.scene = new THREE.Scene();
    this.scene.add(this.group);

    // 添加视野射线对象
    this.raycaster = new THREE.Raycaster();

    // 初始鼠标位置
    this.pointer = new THREE.Vector2(-100000, -10000);

    this.initCamera();
    this.initRenderer();
    this.initControls();

    const onPointerMove = function (mouseEvent) {
      const { raycaster, scene, innerWidth, innerHeight } = this;
      this.pointer.x = (mouseEvent.offsetX / innerWidth) * 2 - 1;
      this.pointer.y = -(mouseEvent.offsetY / innerHeight) * 2 + 1;

      const intersects = raycaster.intersectObjects(scene.children, true);
      const hasStop = intersects.filter((it) => it.object._type === "PPT");
      this.hasStop = hasStop.length ? true : false;
    };
    this.onPointerMove = onPointerMove.bind(this);

    const mouseOut = function () {
      this.hasStop = false;
    };
    this.mouseOut = mouseOut.bind(this);
    this.el.addEventListener("mousemove", this.onPointerMove);
    this.el.addEventListener("mouseout", this.mouseOut);

    const onPointerClick = function (e) {
      e.stopPropagation();
      e.preventDefault();
      const { raycaster, scene } = this;
      const intersects = raycaster.intersectObjects(scene.children, true);
      const r = intersects.filter((it) => it.object._type === "PPT");
      if (r.length) {
        const mesh = r[0].object;
        const data = mesh._privateData;
        if (this.events["click"]) {
          this.events["click"].forEach((cb) => {
            cb(data);
          });
        }
      }
    };
    this.onPointerClick = onPointerClick.bind(this);
    this.el.addEventListener("mousedown", this.onPointerClick);
  }

  /**
   * @name: 设置对应对象的属性并进行渲染
   * @param {*} config 对象的配置
   * @return {*}
   */
  setOption(config = {}) {
    this.clear(); // 清除资源
    // 默认配置
    const defaultConfig = {
      images: [],
      gap: 10,
      radius: 100,
      height: 80,
      textHeight: 10,
      camera: { x: 0, y: 0, z: 25 },
      rotate: {
        autoRotate: true, // 转动
        autoRotateDirection: "cw", // 顺时针cw,逆时针cww
        autoRotateSpeed: 5, // 转动的速度
      },
      textStyle: {
        show: true,
        fontSize: 60,
        color: "#FFF",
      },
    };
    const options = dsf.mix(true, {}, defaultConfig, config);
    this.options = options;
    const scale = 10;
    let { images, gap, radius, height, textHeight, textStyle } = options;
    const count = images.length;
    if (count === 0) return false;

    radius = radius / scale;
    height = height / scale;
    textHeight = textHeight / scale;

    //幻灯片的弯曲角度
    const avgDeg = (360 - count * gap) / count;
    //幻灯片的弧长
    const width = (avgDeg * Math.PI * radius) / 180;
    //幻灯片平均偏移角度
    const radian = ((360 / count) * Math.PI) / 180;
    // 名称高宽比
    const ratio = textHeight / width;

    const camera = options.camera;
    const { x, y, z } = camera;
    if ((this.isDesign && !this.isInitCamera) || !this.isDesign) {
      this.setCamera(x, y, z);
    }
    this.isInitCamera = true;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    // 幻灯片几何对象
    const geometry = this.constructorGeometry(width, height, radius);
    // 幻灯片名称几何对象
    const textGeometry = textStyle.show ? this.constructorGeometry(width, textHeight, radius) : null;

    for (let i = 0; i < images.length; i++) {
      const data = images[i];
      const texture = new THREE.TextureLoader().load(data.image);
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.y = radian * i;
      mesh._privateData = data;
      mesh._type = "PPT";
      this.group.add(mesh);

      // 名称
      if (textStyle.show && data.name) {
        const textMaterial = new THREE.MeshBasicMaterial({ map: this.getTextCanvas(data.name, ratio, textStyle), side: THREE.DoubleSide, transparent: true, opacity: 1 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.y = -(height / 2 + textHeight / 2);
        textMesh.rotation.y = radian * i;
        textMesh._privateData = data;
        textMesh._type = "PPT";
        this.group.add(textMesh);
      }
    }
  }

  getTextCanvas(text = "", ratio, textStyle = {}, width = 1920) {
    const { fontSize = 60, color = "#FFF" } = textStyle;
    const height = ratio * width;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px bold `;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);
    // 创建纹理
    return new THREE.CanvasTexture(canvas);
  }

  /**
   *  构造曲面顶点数据
   * @param {*} width
   * @param {*} height
   * @param {*} radius
   * @returns
   */
  constructorGeometry(width, height, radius) {
    const widthSegments = 100;
    const heightSegments = 100;
    const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    // 获取几何体的顶点数组
    const vertices = geometry.attributes.position.array;
    // 遍历顶点并将其弯曲成圆柱曲面
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]; // 当前顶点的 X 坐标

      // 根据圆柱的半径计算新的顶点坐标
      const angle = x / radius; // 计算角度（弧度制）
      const newX = radius * Math.sin(angle); // 新的 X 坐标
      const newZ = radius * Math.cos(angle); // 新的 Z 坐标

      // 更新顶点坐标
      vertices[i] = newX; // 更新 X 坐标
      vertices[i + 2] = newZ; // 更新 Z 坐标
    }
    geometry.attributes.position.needsUpdate = true;
    return geometry;
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
    this.camera = new THREE.PerspectiveCamera(45, this.innerWidth / this.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 20);
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

  render() {
    const { pointer, raycaster, camera, options, group } = this;
    //更新射线位置
    raycaster.setFromCamera(pointer, camera);

    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    if (group && options && options.rotate && !this.hasStop) {
      const rotate = options.rotate;
      if (rotate.autoRotateDirection === "cw") {
        // 顺时针
        group.rotation.y -= rotate.autoRotateSpeed / 1000;
      } else {
        group.rotation.y += rotate.autoRotateSpeed / 1000;
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
    this.camera.aspect = this.innerWidth / this.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  /**
   * @name: 清除所有图层
   */
  clear() {
    const group = this.group;
    if (!group) return false;

    group.traverse((obj) => {
      if (obj.type === "Mesh") {
        obj.geometry.dispose?.();
        obj.material.dispose?.();
        if (obj.material.map) {
          obj.material.map.dispose();
        }
      }
    });
    if (group.children.length) {
      group.children = []; //删除所有后代模型对象
    }

    this.scene.remove(this.group);
    this.group = null;
  }

  /**
   * @name: 销毁
   */
  destroy() {
    this.el.removeEventListener("mousemove", this.onPointerMove);
    this.el.removeEventListener("mousedown", this.onPointerClick);
    this.el.removeEventListener("mouseout", this.mouseOut);
    this.clear();
    console.log("测试释放内存");
    const { renderer, scene } = this;
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

    this.controls && this.controls.dispose();
    this.controls = null;
    this.el = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.pointer = null;
    this.raycaster = null;
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
