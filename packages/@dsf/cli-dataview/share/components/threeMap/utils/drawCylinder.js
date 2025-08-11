/*
 * @Editor: zhanghang
 * @Description: 绘制3d 圆柱
 * @Date: 2024-07-23 14:04:33
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-13 11:46:40
 */
import * as THREE from "three";
import { drawLabel } from "./drawLabel.js";
import light from "../asset/default_light.png";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

const createCylinderMaterial = function (color1, color2) {
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
  });
  // 材质渲染前更改shader代码
  material.onBeforeCompile = (shader) => {
    shader.uniforms = {
      ...shader.uniforms,
      color1: {
        value: new THREE.Color(color1),
      },
      color2: {
        value: new THREE.Color(color2),
      },
    };

    shader.vertexShader = shader.vertexShader.replace(
      `void main() {`,
      `
        varying vec2 vUv;
        void main() {
            vUv = uv;
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `void main() {`,
      `
        varying vec2 vUv;
        uniform vec3 color1;
        uniform vec3 color2;
        void main() {
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <dithering_fragment>`,
      `
        vec3 color = mix(color1, color2, vUv.y);
        gl_FragColor = vec4(color,0.9);
        #include <dithering_fragment>
        `
    );
  };
  return material;
};
export const drawCylinder = function (options, config) {
  const projection = this.projection;
  const seriesName = options.seriesName;
  const modelScale = this.scale;
  let data = options.data || [];
  const cylinderGroup = new THREE.Group();
  let maxValue = 0;

  data = data.filter((it) => it.value != undefined && it.value != null);

  data.forEach((it) => {
    maxValue = Math.max(maxValue, it.value);
    maxValue = isNaN(maxValue) ? 1 : maxValue;
  });

  const { depth, scale } = config;
  const z = (depth + 1) / scale;

  const { mode, size, maxHeight, minHeight, towerColor, color, separate, label, offset } = options;
  let texture = null;
  if (mode === "tower") {
    texture = new THREE.TextureLoader().load(light);
  }

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
    let h = (it.value * maxHeight) / maxValue;
    h = h < minHeight ? minHeight : h;
    h = h / scale;

    let labelMesh = null;
    if (label.show) {
      const labelDom = drawLabel(label, it);

      labelMesh = new CSS2DObject(labelDom);
      labelMesh._type = "label";
      const offset = label.offset || [0, 20];
      const offsetX = offset[0] / scale;
      const offsetY = offset[1] / scale;
      labelMesh.position.x = labelMesh.position.x + offsetX;
      labelMesh.position.y = labelMesh.position.y + offsetY + h / 2;
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
    //圆柱
    if (mode === "cylinder") {
      const geometry = new THREE.CylinderGeometry(size / (scale * 5), size / (scale * 5), h, separate);
      const mesh = new THREE.Mesh(geometry, createCylinderMaterial(color[0], color[1]));
      let [offsetX, offsetY] = offset;
      offsetX = offsetX / scale;
      offsetY = offsetY / scale;
      mesh._privateData = it;
      mesh._type = "cylinder";
      mesh.position.set(x + offsetX, h / 2 + z, y + offsetY);
      mesh.scale.set(1 / modelScale, 1, 1 / modelScale);
      labelMesh && mesh.add(labelMesh);
      cylinderGroup.add(mesh);
      //光柱
    } else if (mode === "tower") {
      const lightGeometry = new THREE.PlaneGeometry(size / scale, h);
      const MeshBasicMaterial = new THREE.MeshBasicMaterial({
        color: towerColor,
        map: texture,
        transparent: true, //使用背景透明的png贴图，注意开启透明计算
        side: THREE.DoubleSide, //双面可见
        depthWrite: false, //禁止写入深度缓冲区数据
      });

      const mesh = new THREE.Mesh(lightGeometry, MeshBasicMaterial);
      mesh._privateData = it;
      mesh._type = "cylinder";
      mesh.position.set(x, h / 2 + z, y);
      mesh.scale.set(1 / modelScale, 1, 1 / modelScale);
      mesh.renderOrder = 89;
      const _mesh = mesh.clone().rotateY(Math.PI / 2);
     
      labelMesh && mesh.add(labelMesh);
      cylinderGroup.add(mesh, _mesh);
    }
  });
  cylinderGroup._category = "cylinder";
  return cylinderGroup;
};
