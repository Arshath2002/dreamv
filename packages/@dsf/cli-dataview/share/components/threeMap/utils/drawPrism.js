/*
 * @Editor: zhanghang
 * @Description:绘制棱柱
 * @Date: 2024-07-08 11:28:42
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-10-24 17:32:07
 */
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { Group } from "three";
import { drawLabel } from "./drawLabel.js";

export const drawPrism = function (options, config) {
  const projection = this.projection;
  const offsetScale = this.scale;
  const refresh = this.refresh;
  const seriesName = options.seriesName;
  let data = options.data || [];
  const prismsGroup = new Group();

  let maxValue = 0;

  data = data.filter((it) => it.value != undefined && it.value != null);

  data.forEach((it) => {
    maxValue = Math.max(maxValue, it.value);
    maxValue = isNaN(maxValue) ? 1 : maxValue;
  });
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
    const prism = document.createElement("div");
    prism.ondragstart = function () {
      return false;
    };
    let now = new Date().getTime();
    let isDbl = false;
    prism.addEventListener("pointerdown", (e) => {
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

    let { size, maxHeight, minHeight, itemStyle, offset = [0, 0], className, label } = options;
    const { color } = itemStyle;
    const [front, right, top] = color;
    let [offsetX, offsetY] = offset;

    const width = size;
    let realHeight = (maxHeight * it.value) / maxValue;
    const height = realHeight < minHeight ? minHeight : realHeight;
    prism.className = `three-prism-tag ${className}`;
    prism.setAttribute("series", `three-prism_${seriesName}`);
    prism.style.userSelect = "none";
    prism.style.pointerEvents = "auto";
    prism.style.cursor = "pointer";

    const type = options.prismType;
    switch (type) {
      //平面柱体
      case 1:
        const platHtml = `<div style="background:${front};width:${width}px;height:${height}px" class="three-plat-perceive">
      </div>`;
        prism.innerHTML = platHtml;
        break;
      //圆柱体
      case 2:
        const cylinderHtml = `<div style="background:${front};width:${width}px;height:${height}px" class="three-cylinder-perceive">
          <div class="top-cy" style="background:${right};width:${width}px;height:${width * 0.6}px;"></div>
          <div class="bottom-cy" style="background:${right};width:${width}px;height:${width * 0.6}px;"></div>
        </div>`;
        prism.innerHTML = cylinderHtml;
        break;
      //棱柱
      case 3:
        const prismHtml = `<div class="three-prism-perceive" >
        <div class="prism"   style="width:${width}px;height:${height}px">
          <div style="background:${front}; transform: translateZ(${width / 2}px);"></div>
          <div style="background:${right};transform: rotateY(90deg) translateZ(${width / 2}px);"></div>
          <div style="background:${top};bottom:0;height:${width}px; transform: rotateX(90deg) translateZ(${height - width / 2}px) "></div>
        </div>
      </div>`;
        prism.innerHTML = prismHtml;
        break;
    }

    const prismMesh = new CSS2DObject(prism);
    const { depth, scale } = config;
    const z = (depth + 1) / scale;
    offsetX = offsetX / scale;
    offsetY = offsetY / scale;
    prismMesh.position.set(x + offsetX, z, y + offsetY);
    prismMesh._type = "prism";

    if (label.show) {
      const labelDom = drawLabel(label, it);
      prism.appendChild(labelDom);
    }
    prismsGroup.add(prismMesh);
  });
  prismsGroup._category = "prism"
  return prismsGroup;
};
