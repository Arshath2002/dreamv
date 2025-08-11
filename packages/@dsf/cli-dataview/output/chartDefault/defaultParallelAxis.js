export default function (name, color) {
  return {
    inverse: false,
    nameLocation: "end",
    nameTextStyle: {
      fontSize: 12,
    },
    // 坐标轴线设置
    axisLine: {
      show: true,
      lineStyle: {
        color: "rgba(220,240,255,0.6)",
      },
    },
    // 坐标刻度设置
    axisTick: {
      show: true,
      //刻度对齐数据系
      alignWithLabel: false,
    },
    // 坐标标签设置
    axisLabel: {
      show: true,
      fontSize: 12,
      rotate: 0,
      color: "#A5C9FF",
      interval: 0, //强制显示文字
    },
  };
}
