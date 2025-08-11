/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-08-21 09:24:17
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-09-07 16:59:27
 */
export default {
  line: {
    show: true,
    seriesName: "线",
    zIndex: 120,
    opacity: 1,
    zooms: [2, 20],

    itemStyle: {
      color: "#FFF",
      lineWidth: 1,
      borderColor: "rgba(255,255,255,0)",
      borderWidth: 0,
      dash: [10, 0, 10, 0],
      altitude: 0
    },
    //悬浮样式
    emphasis: {
      show: false,//是否有效
      itemStyle: {
        color: "#FFF",
      }
    }
  }
}