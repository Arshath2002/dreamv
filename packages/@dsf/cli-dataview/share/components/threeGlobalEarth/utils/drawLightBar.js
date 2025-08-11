/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-09-06 10:52:03
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-06 14:47:18
 */
import lightImage from "../../threeMap/asset/default_light.png";
import {  CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { Vector3, Mesh, DoubleSide, Group, MeshBasicMaterial, TextureLoader, PlaneBufferGeometry } from "three";
import { lon2xyz } from "./tools.js";
import { drawLabel } from "./drawLabel.js";

import circleImage from "../asset/circle.png";
const texture = new TextureLoader().load(lightImage);
const circleTexture = new TextureLoader().load(circleImage);
export const drawLightBar = (options, config) => {
  let { seriesName, color, offset, data = [], size, scale, maxHeight, minHeight, className, label } = options;
  const { radius } = config;
  const cylinder = [];
  const labels = [];
  let maxValue = 0;
  data = data.filter((it) => it.value != undefined && it.value != null);
  data.forEach((it) => {
    maxValue = Math.max(maxValue, it.value);
    maxValue = isNaN(maxValue) ? 1 : maxValue;
  });
  data.forEach((it) => {
    const district = it.district;
    const SphereCoord = lon2xyz(radius + Number(offset), district[0], district[1]);

    let h = (it.value * maxHeight) / maxValue;
    h = h < minHeight ? minHeight : h;
    h = h / scale;

    const geometry = new PlaneBufferGeometry(size / scale, h);
    geometry.rotateX(Math.PI / 2);
    geometry.translate(0, 0, h / 2);
    const group = new Group();
    const material = new MeshBasicMaterial({
      map: texture,
      color: color,
      transparent: true,
      side: DoubleSide,
      opacity: tinycolor(color).getAlpha(),
      depthWrite: false, //是否对深度缓冲区有任何的影响
    });
    const mesh = new Mesh(geometry, material);
    mesh._type = "lightBar";
    mesh.renderOrder = 80;
    group.add(mesh, mesh.clone().rotateZ(Math.PI / 2));

    group.position.set(SphereCoord.x, SphereCoord.y, SphereCoord.z); //设置mesh位置
    const coordVec3 = new Vector3(SphereCoord.x, SphereCoord.y, SphereCoord.z).normalize();
    const meshNormal = new Vector3(0, 0, 1);
    group.quaternion.setFromUnitVectors(meshNormal, coordVec3);

    const foundationGeometry = new PlaneBufferGeometry(size / scale, size / scale); //默认在XOY平面上
    const foundationMaterial = new MeshBasicMaterial({
      color,
      map: circleTexture,
      opacity: 0.8,
      transparent: true, //使用背景透明的png贴图，注意开启透明计算
      depthWrite: false, //禁止写入深度缓冲区数据
    });
    const foundation = new Mesh(foundationGeometry, foundationMaterial);
    group.add(foundation);

    //构建标签
    const wrapper = document.createElement("div");
    wrapper.className = `three-earth-tag ${className}`;
    wrapper.style.userSelect = "none";
    wrapper.style.pointerEvents = "auto";
    wrapper.style.cursor = "pointer";
    if (label.show) {
      const labelDom = drawLabel(label, { ...it, seriesName });
      wrapper.appendChild(labelDom);
    }

    const { x, y, z } = lon2xyz(radius + h, district[0], district[1]);
    const sprite = new CSS3DSprite(wrapper);
    sprite.scale.set(0.05, 0.05, 0.05);
    sprite.position.set(x, y, z);
    sprite._type = "label";
    sprite._privateData = it;
    labels.push(sprite);
    cylinder.push(group);
  });
  return {cylinder,labels};
};
