/*
 * @Editor: zhanghang
 * @Description:绘制扩散点
 * @Date: 2024-07-09 11:22:35
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-13 11:19:52
 */
import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { drawLabel } from "./drawLabel.js";
/**
 * @description 绘制扩散点
 * @param {Object} options => 配置
 * @param {Object} config =>  scale 转换比例 默认100 depth 20 地图深度
 * @return {Array} mesh 数组
 */
export const drawScatter = function (options, config) {
  const projection = this.projection;
  const modelScale = this.scale;
  const seriesName = options.seriesName;
  const data = options.data || [];
  const scatterGroup = new THREE.Group();
  const { depth, scale } = config;
  const z = (depth + 1) / scale;
  let { spotColor, spotSize, spotSizeFormatter, spotSeparate, ringColor, ringRatio, ringSeparate, offset, label } = options;

  const spotFormat = tinycolor(spotColor);
  const spotOpacity = spotFormat.getAlpha();
  const spotRgb = spotFormat.toRgb();
  spotColor = `rgb(${spotRgb.r},${spotRgb.g},${spotRgb.b})`;

  const ringFormat = tinycolor(ringColor);
  const ringOpacity = ringFormat.getAlpha();
  const ringRgb = ringFormat.toRgb();
  ringColor = `rgb(${ringRgb.r},${ringRgb.g},${ringRgb.b})`;

  data.forEach((it) => {
    let x = 0,
      y = 0;
    //经纬度
    if (Array.isArray(it.district)) {
      const point = projection(it.district);
      x = point[0];
      y = point[1];
      //行政编码
    } else {
      const district = this.districtData.find((city) => city.adcode == it.district);
      if (district) {
        const center = district.centroid || district.center;
        const point = projection(center);
        it = { ...district, ...it };
        x = point[0];
        y = point[1];
      } else {
        return false;
      }
    }
    let size = spotSize;

    //存在函数设置
    if (typeof spotSizeFormatter == "function") {
      size = spotSizeFormatter(data);
    }
    let ringSize = (size * ringRatio) / scale;
    size = size / scale;

    const spotGeometry = new THREE.CircleGeometry(size, spotSeparate);
    const spotMaterial = new THREE.MeshBasicMaterial({
      color: spotColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: spotOpacity,
    });

    const spotMesh = new THREE.Mesh(spotGeometry, spotMaterial);
    let [offsetX, offsetY] = offset;
    offsetX = offsetX / scale;
    offsetY = offsetY / scale;
    spotMesh.position.set(x + offsetX, z, y + offsetY);
    spotMesh.scale.set(1 / modelScale, 1 / modelScale, 1 / modelScale);
    spotMesh.rotation.x = -Math.PI / 2;

    let RingGeometry = new THREE.RingGeometry(size, ringSize, ringSeparate);
    let ringMaterial = new THREE.MeshBasicMaterial({
      color: ringColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: ringOpacity,
    });
    const ringMesh = new THREE.Mesh(RingGeometry, ringMaterial);
    ringMesh._scale = 1;
    ringMesh.renderOrder = 85;
    spotMesh.add(ringMesh);
    spotMesh._privateData = it;
    spotMesh._type = "scatter";

    if (label.show) {
      const labelDom = drawLabel(label, it);
      const labelMesh = new CSS2DObject(labelDom);
      labelMesh._type = "label";
      spotMesh.add(labelMesh);

      let now = new Date().getTime();
      let isDbl = false;
      labelDom.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const clickTime = new Date().getTime();
        if (clickTime - now < 300) {
          isDbl = true;
          if (this.events["dblclick"]) {
            this.events["dblclick"].forEach((cb) => {
              cb({ ...it, seriesName });
            });
          }
        } else {
          setTimeout(() => {
            if (!isDbl && this.events["click"]) {
              this.events["click"].forEach((cb) => {
                cb({ ...it, seriesName });
              });
            }
            isDbl = false;
          }, 300);
        }
        now = clickTime;
      });
    }
   
    scatterGroup.add(spotMesh);
  });
  scatterGroup._category = "scatter";
  return scatterGroup;
};
