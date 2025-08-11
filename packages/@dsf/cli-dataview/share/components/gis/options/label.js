/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2023-08-17 09:31:09
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-27 19:31:29
 */
export default {
  //标签配置属性
  label: {
    show: true,
    name: "{b}",
    seriesName: "标签",
    position: "center",
    zooms: [2, 20],
    collision: true, //标注是否避让
    allowCollision: true, //标注是否允许其它标注层对它避让
    icon: {
      image: "",
      size: [36, 36],
      position: "center",
      offset: [0, 0],
    },
    
    itemStyle: {
      fontSize: 12,
      color: "#FFF",
      padding: [3, 3, 3, 3],
      strokeColor: "rgba(255,255,255,0)",
      backgroundColor: "rgba(255,255,255,0)",
      borderColor: "rgba(255,255,255,0)",
      borderWidth: 0,
      offset: [0, 0],
    },
    //悬浮样式
    emphasis: {
      show: false, //是否显示
      itemStyle: {
        fontSize: 12,
        color: "#FFF",
        padding: [3, 3, 3, 3],
        strokeColor: "rgba(255,255,255,0)",
        backgroundColor: "rgba(255,255,255,0)",
        borderColor: "rgba(255,255,255,0)",
        borderWidth: 0,
        offset: [0, 0],
      },
    },
  },
};
