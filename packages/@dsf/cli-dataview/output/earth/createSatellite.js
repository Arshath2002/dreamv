/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-09-02 15:51:56
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-09-02 15:51:57
 */
export default function () {
  return {
    autoRotateDirection: "cw", // 顺时针cw,逆时针cww
    autoRotateSpeed: 8, // 转动的速度
    // 卫星环
    ring: {
      texture: "default",
      color: "#00c2ff",
      radius: 55,
      degree: [90, -20, 0],
    },
    planet: {
      num: 3,
      size: 10,
      texture: "default",
    },
  };
}
