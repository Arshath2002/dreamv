/*
 * @Editor: zhanghang
 * @Description: 绘制区域
 * @Date: 2024-06-18 10:42:30
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-24 17:04:43
 */
import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import utils from "_dataview/output/utils/gis.js";
import gisUtils from "_dataview/output/utils/gis.js";
import { drawLabel } from "./drawLabel.js";
import china from "../asset/china.png";
const staticTexture = new THREE.TextureLoader().load(china);

const outputFragment = function (depth) {
  return `
  vec3 outgoingLight = reflectedLight.indirectDiffuse;
  vec3 gradient = mix(vec3(0,0,0),vec3(0.9,0.9,1.0), vPosition.z/${depth}.0);
  outgoingLight = outgoingLight*gradient;
  // 开始的位置
  float y = uStart + uTime * uSpeed;
  // 高度
  float h = uHeight / 1.0;
  if(vPosition.z > y && vPosition.z < y + h * 1.0) {
      float per = 0.0;
      if(vPosition.z < y + h){
          per = (vPosition.z - y) / h;
          outgoingLight = mix(outgoingLight,uColor,per);
      }else{
          per = (vPosition.z - y - h) / h;
          outgoingLight = mix(uColor,outgoingLight,per);
      }
  }
  
  diffuseColor = vec4( outgoingLight, diffuseColor.a );
  `;
};

/**
 * @Description 构建有厚度的面数据
 * @param {*} shapeData
 * @param {Number} offsetScale
 * @param {Boolean} refresh 是否是刷新数据，如果不是刷新数据则，则认为是下钻数据，该数据需要计算中心偏移量和缩放比例
 * @returns
 */
const drawShapeAssist = function (shapeData) {
  const group = new THREE.Group();
  shapeData.forEach((item) => {
    const { shape, extrudeSettings, material, materialSide, _privateData, label, scale } = item;
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const district = new THREE.Mesh(geometry, [material, materialSide]);
    district._type = "district";
    district._privateData = _privateData;
    district.rotation.x = -0.5 * Math.PI;
    district.scale.set(1, 1, 2 / scale);
    label && (district._label = label.element);
    group.add(district);
  });

  return group;
};
const createSideMaterial = function (color, uColor, config) {
  const { depth } = config;
  const mapUf = {
    uTime: { value: 0.0 },
    uHeight: { value: depth / 2 },
    uColor: { value: new THREE.Color(uColor) },
    uStart: { value: -depth / 2 },
    uSpeed: { value: Math.ceil(depth / 4) },
  };
  const format = tinycolor(color);
  const { r, g, b } = format.toRgb();
  const materialSide = new THREE.MeshBasicMaterial({
    color: `rgb(${r},${g},${b})`,
    transparent: true,
    opacity: format.getAlpha(),
  });
  materialSide.onBeforeCompile = (shader) => {
    shader.uniforms = {
      ...shader.uniforms,
      ...mapUf,
    };
    shader.vertexShader = shader.vertexShader.replace(
      "void main() {",
      `
          varying vec3 vPosition;
          void main() {
            vPosition = position;
        `
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "void main() {",
      `
          varying vec3 vPosition;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uSpeed;
          uniform float uStart;
          uniform float uHeight;
          void main() {
        `
    );
    const depth = parseInt(config.depth / 2);
    shader.fragmentShader = shader.fragmentShader.replace("vec3 outgoingLight = reflectedLight.indirectDiffuse;", outputFragment(depth));
  };
  return { mapUf, materialSide };
};
/**
 * @description 构建区域数据
 * @param {Array} data 传递的数据
 * @param {Array} features 地理信息
 * @param {Object} options => 图层配置
 * @param {Object} config =>  scale 转换比例 默认100 depth 25 地图深度
 * @return {Array} mesh 数组
 */
export const drawDistrict = function (data = [], options, features, config) {
  const projection = this.projection;
  const itemStyle = options.itemStyle;
  const emphasis = options.emphasis;
  const seriesName = options.seriesName;
  const range = itemStyle.range;

  let sc = null;
  let ec = null;
  let min = Number.MIN_SAFE_INTEGER;
  let max = Number.MAX_SAFE_INTEGER;
  if (range.show) {
    sc = range.color[0];
    ec = range.color[1];
    min = range.min;
    max = range.max;
  }

  const dataMap = new Map();
  data.forEach((it) => {
    // 开启了色阶
    if (sc != null && ec != null) {
      let value = it.value;
      let color = ec;
      if (range.mode === "separate") {
        color = utils.separateColor(value, range.rules, ec);
      } else {
        color = utils.rangeColor(sc, ec, min, max, value);
      }
      it.color = color;
    } else {
      it.color = null;
    }

    dataMap.set(it.district + "", it);
  });

  const lineStyle = options.lineStyle;
  const topColor = itemStyle.topColor; //顶部颜色
  const sideColor = itemStyle.sideColor; //侧边颜色
  const uColor = itemStyle.uColor; //侧边动画颜色

  const lineColor = lineStyle.color; //区域边线颜色
  const lineFormat = tinycolor(lineColor);
  const lineRgb = lineFormat.toRgb();
  const lineOpacity = lineFormat.getAlpha();
  const _lineColor = `rgb(${lineRgb.r},${lineRgb.g},${lineRgb.b})`;

  //侧边着色器+材质
  const { mapUf, materialSide } = createSideMaterial(sideColor, uColor, config);
  let mapTexture = null;
  // 地区label+line
  const meshGroup = new THREE.Group();
  // 渐进地区组
  const advanceMeshGroup = new THREE.Group();

  const { depth, scale } = config;
  const z = (depth + 1) / scale;
  const districtData = [];
  // 区域shape 对象
  const shapeData = [];

  features.forEach((feature) => {
    let { geometry, properties } = feature;

    districtData.push(properties);
    properties.seriesName = seriesName;
    const item = dataMap.get(properties.adcode + "");

    let { coordinates } = geometry;

    //混合属性
    properties = dsf.mix(true, {}, properties, item || {});
    const label = drawDistrictName.call(this, item ? item : undefined, options.label, properties, feature, options.config);
    //添加地区名称
    label && meshGroup.add(label);
    //处理单环数据
    if (geometry.type === "Polygon") {
      coordinates = [coordinates];
    }
    coordinates.forEach((multiPolygon) => {
      multiPolygon.forEach((polygon) => {
        const shape = new THREE.Shape();
        const lineMaterial = new THREE.LineBasicMaterial({
          color: _lineColor,
          transparent: true,
          opacity: lineOpacity,
        });
        const points = [];
        for (let i = 0; i < polygon.length; i++) {
          const [x, y] = projection(polygon[i]);
          if (i === 0) {
            shape.moveTo(x, -y);
          }
          //过滤掉缺失的点位
          if (x && y) {
            shape.lineTo(x, -y);
            points.push(new THREE.Vector3(x, -y, z));
          }
        }

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

        const extrudeSettings = {
          depth: depth / 2,
          bevelEnabled: true,
          bevelSegments: 10,
          bevelThickness: 0.1,
        };

        const color = item && item.color ? item.color : topColor;
        const polygonFormat = tinycolor(color);
        const { r, g, b } = polygonFormat.toRgb();
        const material = new THREE.MeshBasicMaterial({
          color: `rgb(${r},${g},${b})`,
          transparent: true,
          opacity: polygonFormat.getAlpha(),
        });

        const _privateData = {
          ...properties,
          deriveColor: color,
          textStyle: options.label.itemStyle.textStyle,
        };
        if (emphasis.show) {
          _privateData["emphasisColor"] = emphasis.topColor;
          _privateData["emphasisText"] = emphasis.textStyle;
        } else {
          Reflect.deleteProperty(_privateData, "emphasisColor");
          Reflect.deleteProperty(_privateData, "emphasisText");
        }

        shapeData.push({
          shape,
          extrudeSettings,
          material,
          materialSide,
          label,
          scale,
          _privateData,
        });

        const geometry = new THREE.ShapeGeometry(shape);
        const district = new THREE.Mesh(geometry, material);
        district._type = "shape_district";
        district._privateData = _privateData;

        district.rotation.x = -0.5 * Math.PI;

        district.position.y = depth / scale;

        label && (district._label = label.element);
        advanceMeshGroup.add(district);

        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.rotation.x = -0.5 * Math.PI;
        line._type = "districtLine";
        lineOpacity > 0 && meshGroup.add(line);
      });
    });
  });
  // 地图纹理
  if (options.texture && options.texture.show) {
    const box = new THREE.Box3().setFromObject(advanceMeshGroup);
    // 盒子边界
    const boxMin = box.min;
    const boxMax = box.max;

    // 计算UV的缩放比例
    const uvScale = new THREE.Vector2(1 / (boxMax.x - boxMin.x), 1 / (boxMax.z - boxMin.z));

    // 每次更新坐标系重置纹理nv坐标比例
    if (this.refresh) {
      this.uvScale = uvScale;
    }
    if (!mapTexture) {
      let scaleX = 1;
      let scaleY = 1;

      const { repeat, autoRepeat, offset } = options.texture;
      if (options.texture.image != "default") {
        const image = options.texture.image;
        const texture = new THREE.TextureLoader().load(image);
        mapTexture = texture;
      } else {
        mapTexture = staticTexture;
      }
      // 自定义重复纹理放大比例
      if (autoRepeat) {
        const { x, y } = repeat;
        scaleX = x;
        scaleY = y;
      } else {
        scaleX = this.uvScale.x;
        scaleY = this.uvScale.y;
      }

      mapTexture.flipY = true;
      mapTexture.wrapS = THREE.RepeatWrapping;
      mapTexture.wrapT = THREE.RepeatWrapping;
      mapTexture.repeat.set(scaleX, scaleY);
      mapTexture.offset.set(offset.x, offset.y);
    }

    advanceMeshGroup.children.forEach((district) => {
      district.material.map = mapTexture;
      district.material.needsUpdate = true;
    });
  }

  const _realShape = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.isClear) {
          const group = drawShapeAssist(shapeData);
          resolve(group);
        } else {
          resolve([]);
        }
      }, 17);
    });
  };
  // 将纹理导出 方便摧毁
  return { mapUf, meshGroup, advanceMeshGroup, districtData, _realShape, mapTexture };
};

/**
 * @description 侧边动画
 * @return 无
 */
export const districtAnimate = function (mapUf) {
  if (!mapUf) return false;
  let deltaTime = this.clock.getDelta();
  mapUf.uTime.value += deltaTime;
  if (mapUf.uTime.value >= 2) {
    mapUf.uTime.value = 0.0;
  }
};
/**
 * @description 区域渲染
 * @return 无
 */
export const districtRender = function () {
  const { raycaster, scene } = this;
  // 恢复上一次清空的
  if (this.pickDistrictMesh) {
    const mesh = this.pickDistrictMesh.object;
    // 恢复透明度
    mesh.material[0].opacity = mesh.material[0]._opacity;
    if (mesh._type === "district") {
      const { deriveColor, textStyle } = mesh._privateData;

      const polygonFormat = tinycolor(deriveColor);
      const { r, g, b } = polygonFormat.toRgb();

      mesh.material[0].color.set(`rgb(${r},${g},${b})`);

      if (mesh._label) {
        const ele = mesh._label;
        Object.keys(textStyle).forEach((key) => {
          if (dsf.isNumber(textStyle[key])) {
            ele.style[key] = textStyle[key] + "px";
          } else if (Array.isArray(textStyle[key])) {
            ele.style[key] = textStyle[key].join("px ") + "px";
          } else {
            ele.style[key] = textStyle[key];
          }
        });
      }
    }
  }
  this.pickDistrictMesh = null;
  const intersects = raycaster.intersectObjects(scene.children, true);
  const r = intersects.filter((it) => it.object._type === "district" || it.object._type === "scatter");

  if (r.length && r[0].object._type === "district") {
    this.pickDistrictMesh = r[0];
    const mesh = this.pickDistrictMesh.object;
    console.log('show')
    // 记录透明度
    mesh.material[0]._opacity = mesh.material[0].opacity;

    const { emphasisColor, emphasisText } = mesh._privateData;
    emphasisColor && mesh.material[0].color.set(emphasisColor);
    if (emphasisText && mesh._label) {
      const ele = mesh._label;
      Object.keys(emphasisText).forEach((key) => {
        if (dsf.isNumber(emphasisText[key])) {
          ele.style[key] = emphasisText[key] + "px";
        } else if (Array.isArray(emphasisText[key])) {
          ele.style[key] = emphasisText[key].join("px ") + "px";
        } else {
          ele.style[key] = emphasisText[key];
        }
      });
    }
  }
};

/**
 * @description 绘制区域名称
 * @return 无
 */
function drawDistrictName(data = {}, options, properties, feature, config) {
  const projection = this.projection;
  let center = properties.centroid || properties.center;

  if (options.show) {
    if (!Array.isArray(center)) {
      console.time("计算区域中心点");
      center = gisUtils.centerOfMass(feature).geometry.coordinates;
      console.timeEnd("计算区域中心点");
    }
    const [x, y] = projection(center);
    const label = drawLabel(options, { ...properties, ...data });
    const name = new CSS2DObject(label);
    const { depth, scale } = config;
    const z = (depth + 1) / scale;
    name.position.set(x, z, y);
    name._type = "label";
    name._isDistrict = true;
    return name;
  }
}
