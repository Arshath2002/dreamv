/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-07-05 14:33:55
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-10-29 11:12:21
 */
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { Group } from "three";
import markerImage from "../asset/arrow.png";
import { drawLabel } from "./drawLabel.js";

/**
 * @description 绘制marker
 * @param {Object} options => 图标配置
 * @param {Object} config =>  scale 转换比例 默认100 depth 20 地图深度
 * @return {Array} mesh 数组
 */
export const drawMarker = function (options, config) {
  const projection = this.projection;
  const seriesName = options.seriesName;
  const data = options.data || [];
  const markerGroup = new Group()
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
        it = { ...district, ...it };
        const point = projection(center);
        x = point[0];
        y = point[1];
      } else {
        return false;
      }
    }

    const marker = document.createElement("div");
    marker.ondragstart = function () {
      return false;
    };
    let now = new Date().getTime();
    let isDbl = false;
    marker.addEventListener("pointerdown", (e) => {
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

    const { symbolSize, symbolSizeFormatter, symbol = "default", offset = [0, 0], className, label } = options;
    let [width, height] = symbolSize;
    let [offsetX, offsetY] = offset;
    let markerPath = symbol === "default" ? markerImage : symbol;
    //存在函数设置
    if (typeof symbolSizeFormatter == "function") {
      const size = symbolSizeFormatter(data);
      width = size[0];
      height = size[1];
    }
    const icon = document.createElement("div");
    icon.style.width = dsf.dataview.utils.transformPx(width);
    icon.style.height = dsf.dataview.utils.transformPx(height);
    icon.style.backgroundImage = `url(${markerPath})`;
    icon.style.backgroundSize = "100% 100%";

    marker.appendChild(icon);
    marker.className = `three-point-tag ${className}`;
    marker.setAttribute("series", `three-point-tag_${seriesName}`);
    marker.style.userSelect = "none";
    marker.style.pointerEvents = "auto";
    marker.style.cursor = "pointer";

    const markerMesh = new CSS2DObject(marker);
    const { depth, scale } = config;
    const z = (depth + 1) / scale;
    offsetX = offsetX / scale;
    offsetY = offsetY / scale;
    const offsetZ = 12 / scale;
    markerMesh.position.set(x + offsetX, z + offsetZ, y + offsetY);
    markerMesh._type = "marker";

    if (label.show) {
      const labelDom = drawLabel(label, { ...it, seriesName });
      marker.appendChild(labelDom);
    }
    markerGroup.add(markerMesh)
  });
  markerGroup._category = "marker"
  return markerGroup;
};
