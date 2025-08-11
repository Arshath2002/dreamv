export default {
  show: false,
  type: "continuous",
  calculable: true,
  min: 0,
  max: 1000,
  left: "left",
  bottom: "auto",
  right: "auto",
  top: "top",
  showLabel: true,
  seriesIndex: [],
  orient: "vertical",
  text: ["高", "低"],
  textStyle: {
    color: "#ededed",
    fontSize: 12,
  },
  inRange: {
    color: ["#04387b", "#467bc0"], // 蓝绿
  },
  pieces: [
    {
      gte: 0,
      lt: 50,
      color: "#ff8c71",
    },
    {
      gte: 50,
      lt: 100,
      color: "#ff5428",
    },
    {
      gte: 100,
      color: "#7f1100",
    },
  ],
  outOfRange: {
    color: "#333",
  },
};
