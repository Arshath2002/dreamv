/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-07-10 15:04:13
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-07-10 15:58:33
 */
import * as THREE from "three";

export const drawGrid = function (options) {
  let grid = null;
  if (options.show) {
    grid = new THREE.GridHelper(100, 200, options.color, options.color);
    grid.material.opacity =  options.opacity
    grid.material.transparent = true;
    grid.position.set(0, 0, 0);
  }

  return grid;
};
