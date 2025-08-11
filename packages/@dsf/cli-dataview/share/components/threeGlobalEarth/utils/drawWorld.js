/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-09-04 11:10:54
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-16 09:33:45
 */
import { lon2xyz } from "./tools.js";
import Delaunator from "delaunator";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

import utils from "_dataview/output/utils/gis.js";
import { drawLabel } from "./drawLabel.js";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import * as THREE from "three";
import { Vector3 } from "three";

export const drawWorld = async function (options, config) {
  const data = options.data || [];
  const radius = config.radius;
  const R = radius + 0.1;

  const itemStyle = options.itemStyle;
  const emphasis = options.emphasis;
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

    dataMap.set(it.district, it);
  });
  const lineStyle = itemStyle.lineStyle;
  const lineColor = lineStyle.color;
  const areaColor = itemStyle.color;
  const lineMaterial = new THREE.LineBasicMaterial({
    color: lineColor,
    transparent: true,
    opacity: tinycolor(lineColor).getAlpha(),
  });

  const mesh = [];
  const markers = [];

  const res = await dsf.http.get(dsf.url.getWebPath("static/js/libs/three/geoJson/world.json", __DSF_DATAVIEW_PATH__));
  let features = [];
  if (res && res.status === 200) {
    features = res.data.features;
  } else {
    dsf.layer.message("加载世界坐标报错", false);
    return { mesh, markers };
  }

  features.forEach(({ geometry, properties }) => {
    const item = dataMap.get(properties.name);
    //混合属性
    properties = dsf.mix(true, {}, item || {}, properties);
    let { coordinates } = geometry;
    //处理单环数据
    if (geometry.type === "Polygon") {
      if (!properties.centroid) {
        const centroid = utils.centroid(utils.polygon(coordinates));
        properties.centroid = centroid ? centroid.geometry.coordinates : [];
      }
      coordinates = [coordinates];
    } else if (geometry.type === "MultiPolygon") {
      if (!properties.centroid) {
        let max = coordinates.reduce((sum, cur) => sum.concat(cur), []);
        const centroid = utils.centroid(utils.polygon(max));
        properties.centroid = centroid ? centroid.geometry.coordinates : [];
      }
    }

    const label = drawDistrictName.call(this, options.label, properties, R, options);

    const color = item && item.color ? item.color : areaColor;
    //添加地区名称
    label && markers.push(label);
    const mergeGeometries = [];
    coordinates.forEach((multiPolygon) => {
      multiPolygon.forEach((polygon) => {
        const { linePoints, points, usefulIndexArr } = gridPoint(polygon, R);
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(linePoints);
        // 设置几何体顶点位置坐标
        geometry.attributes.position = new THREE.BufferAttribute(vertices, 3);
        const line = new THREE.Line(geometry, lineMaterial);

        // 绘制国家面
        const shapeGeometry = new THREE.BufferGeometry(); //创建一个几何体
        // 设置几何体顶点索引
        shapeGeometry.index = new THREE.BufferAttribute(new Uint16Array(usefulIndexArr), 1);
        // 设置几何体顶点位置坐标
        shapeGeometry.attributes.position = new THREE.BufferAttribute(new Float32Array(points), 3);
        mergeGeometries.push(shapeGeometry);
        mesh.push(line);
      });
    });
    let shapeGeometry = null;
    if (mergeGeometries.length > 1) {
      shapeGeometry = mergeBufferGeometries(mergeGeometries);
    } else {
      shapeGeometry = mergeGeometries[0];
    }

    const { rgb, opacity } = dsf.dataview.utils.transformRgb(color);

    const material = new THREE.MeshBasicMaterial({ color: rgb, side: THREE.DoubleSide, transparent: true, opacity });
    const district = new THREE.Mesh(shapeGeometry, material);

    district._type = "district";

    district._privateData = {
      ...properties,
      deriveColor: color,
      textStyle: options.label.itemStyle.textStyle,
    };
    if (emphasis.show) {
      district._privateData["emphasisColor"] = emphasis.color;
      district._privateData["emphasisText"] = emphasis.textStyle;
    } else {
      Reflect.deleteProperty(district._privateData, "emphasisColor");
      Reflect.deleteProperty(district._privateData, "emphasisText");
    }
    label && (district._label = label.element);
    mesh.push(district);
  });
  return { mesh, markers };
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

    if (mesh._type === "district") {
      const { deriveColor, textStyle } = mesh._privateData;
      const { rgb, opacity } = dsf.dataview.utils.transformRgb(deriveColor);
      mesh.material.opacity = opacity;
      mesh.material.color.set(rgb);
      if (mesh._label) {
        const ele = mesh._label.children[0];
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
  const r = intersects.filter((it) => it.object._type === "district");

  if (r.length && r[0].object._type === "district") {
    this.pickDistrictMesh = r[0];
    const mesh = this.pickDistrictMesh.object;
    // 记录透明度
    mesh.material._opacity = mesh.material.opacity;

    const { emphasisColor, emphasisText } = mesh._privateData;
    if (emphasisColor) {
      const { rgb, opacity } = dsf.dataview.utils.transformRgb(emphasisColor);
      mesh.material.color.set(rgb);
      mesh.material.opacity = opacity;
    }

    if (emphasisText && mesh._label) {
      const ele = mesh._label.children[0];
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
function drawDistrictName(options, properties, radius, config) {
  const { labelScale: scale, seriesName } = config;
  const center = properties.centroid;
  if (center && options.show) {
    const { x, y, z } = lon2xyz(radius * 1.001, center[0], center[1]);
    const label = drawLabel(options, { ...properties, seriesName });
    // 解决css3dObject reverse 问题
    label.style.transform += `rotateY(180deg)`;
    const marker = document.createElement("div");
    marker.appendChild(label);
    const sprite = new CSS3DObject(marker);
    sprite.position.set(x, y, z);

    sprite.quaternion.copy(this.camera.quaternion);
    sprite.scale.set(scale / 100, scale / 100, scale / 100);
    sprite._type = "label";
    sprite._isDistrict = true;
    sprite.lookAt(new Vector3(0, 0, 0));
    return sprite;
  }
}
function gridPoint(polygon, radius) {
  const linePoints = [];
  const points = [];
  const lonArr = []; //polygon的所有经度坐标
  const latArr = []; //polygon的所有纬度坐标
  polygon.forEach((item) => {
    lonArr.push(item[0]);
    latArr.push(item[1]);
    const coord_line = lon2xyz(radius + 0.01, item[0], item[1]);
    const coord_point3d = lon2xyz(radius, item[0], item[1]);
    linePoints.push(coord_line.x, coord_line.y, coord_line.z);
    points.push(coord_point3d.x, coord_point3d.y, coord_point3d.z);
  });

  // minMax()计算polygon所有经纬度返回的极大值、极小值
  const [lonMin, lonMax] = minMax(lonArr);
  const [latMin, latMax] = minMax(latArr);

  // 经纬度极小值和极大值构成一个矩形范围，可以包裹多边形polygon，在矩形范围内生成等间距顶点
  //  设置均匀填充点的间距
  const span = 6;
  const row = Math.ceil((lonMax - lonMin) / span);
  const col = Math.ceil((latMax - latMin) / span);

  const rectPointsArr = []; //polygon对应的矩形轮廓内生成均匀间隔的矩形网格数据rectPointsArr

  for (let i = 0; i < row + 1; i++) {
    for (let j = 0; j < col + 1; j++) {
      //两层for循环在矩形范围内批量生成等间距的网格顶点数据
      rectPointsArr.push([lonMin + i * span, latMin + j * span]);
    }
  }

  //除去边界线外的矩阵点位 只保留边界线内的矩阵点位（不包含边界线）
  const polygonPointsArr = [];
  rectPointsArr.forEach((coord) => {
    //coord:点经纬度坐标
    if (pointInPolygon(coord, polygon)) {
      //判断点coord是否位于多边形中 位于多边形之中的点放在一起
      polygonPointsArr.push(coord);
      //把符合条件的点位 放到集合里
      const point3D = lon2xyz(radius + 0.1, coord[0], coord[1]);
      const { x, y, z } = point3D;
      // 填充到3d polygon 点数组
      points.push(x, y, z);
    }
  });

  //渲染国家边界线
  const geographyPoints = [...polygon, ...polygonPointsArr];
  const usefulIndexArr = trianglePlan(geographyPoints, polygon);
  return {
    usefulIndexArr,
    points,
    linePoints,
  };
}

function minMax(arr) {
  // 数组元素排序
  arr.sort(function (num1, num2) {
    if (num1 < num2) {
      return -1;
    } else if (num1 > num2) {
      return 1;
    } else {
      return 0;
    }
  });
  // 通过向两侧取整，把经纬度的方位稍微扩大
  return [Math.floor(arr[0]), Math.ceil(arr[arr.length - 1])];
}
function pointInPolygon(point, polygon) {
  const x = point[0],
    y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0],
      yi = polygon[i][1];
    const xj = polygon[j][0],
      yj = polygon[j][1];
    const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function trianglePlan(polygonPointsArr, polygon) {
  // 三角剖分
  //.from(pointsArr).triangles：平面上一系列点集三角剖分，并获取三角形索引值
  const indexArr = Delaunator.from(polygonPointsArr).triangles;
  /**三角剖分获得的三角形索引indexArr需要进行二次处理，删除多边形polygon轮廓外面的三角形对应索引 */
  const usefulIndexArr = []; //二次处理后三角形索引，也就是保留多边形polygon内部三角形对应的索引
  // 删除多边形polygon外面三角形，判断方法非常简单，判断一个三角形的质心是否在多边形轮廓内部
  for (let i = 0; i < indexArr.length; i += 3) {
    // 三角形三个顶点坐标p1, p2, p3
    const p1 = polygonPointsArr[indexArr[i]];
    const p2 = polygonPointsArr[indexArr[i + 1]];
    const p3 = polygonPointsArr[indexArr[i + 2]];
    // 三角形重心坐标计算
    const gravityCenter = [(p1[0] + p2[0] + p3[0]) / 3, (p1[1] + p2[1] + p3[1]) / 3];
    if (pointInPolygon(gravityCenter, polygon)) {
      //pointInPolygon()函数判断三角形的重心是在多边形polygon内
      // 保留复合条件三角形对应的索引：indexArr[i], indexArr[i+1],indexArr[i+2]
      usefulIndexArr.push(indexArr[i], indexArr[i + 1], indexArr[i + 2]); //这种情况需要设置three.js材质背面可见THREE.BackSide才能看到球面国家Mesh
    }
  }
  return usefulIndexArr;
}
