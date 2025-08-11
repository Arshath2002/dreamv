/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-08-27 16:02:45
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-08-30 16:39:27
 */
import markerImage from "../asset/arrow.png";

import { CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { lon2xyz } from "./tools.js";
import { drawLabel } from "./drawLabel.js";
import { Vector3 } from "three";
export const drawMarker = function (options, config) {
  const { symbolSize, symbolSizeFormatter, symbol = "default", seriesName, data, scale, label, className } = options;
  const radius = config.radius;
  // 标签纹理
  const markerPath = symbol === "default" || !symbol ? markerImage : symbol;
  const markers = [];
  for (let i = 0; i < data.length; i++) {
    const it = data[i];
    const district = it.district;
    const point = lon2xyz(radius * 1.001, district[0], district[1]);

    const marker = document.createElement("div");
    let [width, height] = symbolSize;
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
    marker.className = `three-earth-tag ${className}`;
    marker.style.userSelect = "none";
    marker.style.pointerEvents = "auto";
    marker.style.cursor = "pointer";
    marker.appendChild(icon);

    if (label.show) {
      const labelDom = drawLabel(label, { ...it, seriesName });
      marker.appendChild(labelDom);
    }

    const sprite = new CSS3DSprite(marker);
    sprite.scale.set(scale / 100, scale / 100, scale / 100);

    sprite.position.set(point.x, point.y, point.z);
    sprite._type = "marker";
    sprite._privateData = it;
    markers.push(sprite);

    const { markerTooltip, camera, markerTooltipDom, el } = this;

    marker.onmousemove = function (e) {
      e.stopPropagation();
      e.preventDefault();
      if (markerTooltip) {
        markerTooltip._hide();
      }

      const worldPosition = new Vector3();
      sprite.getWorldPosition(worldPosition);
      const innerWidth = el.offsetWidth;
      const innerHeight = el.offsetHeight;
      const standardVector = worldPosition.project(camera); //世界坐标转标准设备坐标

      const a = innerWidth / 2;
      const b = innerHeight / 2;
      const left = Math.round(standardVector.x * a + a); //标准设备坐标转屏幕坐标
      const top = Math.round(-standardVector.y * b + b); 
      
      //隐藏
      if (markerTooltip) {
        markerTooltip._hide();
        markerTooltipDom.style.left = left + "px";
        markerTooltipDom.style.top = top - sprite.element.offsetHeight/2 + "px";
        markerTooltip._show(sprite._privateData);
      }
    };
    marker.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.events["click"].forEach((cb) => {
        cb({ ...it, seriesName });
      });
    };
  }

  return markers;
};
