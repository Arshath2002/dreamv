/*
 * @Editor: zhanghang
 * @Description: 绘制底座
 * @Date: 2024-07-25 11:48:26
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-10-30 14:24:15
 */
import * as THREE from "three";
import defaultImage from "../asset/foundation.png";

export const drawFoundation = function (options, config) {
  if (!options) return false;
  let foundation = null;
  let { show, size, speed, image } = options;
  const { scale } = config;

  if (show && image) {
    if (image === "default") {
      image = defaultImage;
    }
    const texture = new THREE.TextureLoader().load(image);
    const planeGeometry = new THREE.PlaneGeometry(size / scale, size / scale);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    foundation = new THREE.Mesh(planeGeometry, material);
    foundation.rotation.x = -0.5 * Math.PI;
    foundation._speed = speed / scale;
    foundation._type = "foundation";
  }
  return foundation;
};
