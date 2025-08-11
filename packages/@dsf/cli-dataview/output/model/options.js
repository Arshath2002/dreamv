/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-12-30 11:04:07
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-12-30 16:08:24
 */
export default {
  camera: {
    x: -17,
    y: 47,
    z: -120,
  },
  lights: [
    {
      key: "AmbientLight",
      intensity: 1,
      color: "#FFFFFF",
    },
  ],
  model: {
    url: "",
    callback: null,
  },
  viewControl: {
    autoRotate: true, // 转动
    autoRotateDirection: "cww", // 顺时针cw,逆时针cww
    autoRotateSpeed: 1, // 转动的速度
  },
};
