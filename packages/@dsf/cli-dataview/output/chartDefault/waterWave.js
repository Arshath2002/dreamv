// 水波图配置
import common from "./common";
export default dsf.mix(
  true,
  {
    tooltip: {
      show: false,
      textStyle: {
        align: "left",
      },
      confine:true
    },
    series: [
      {
        name: "",
        type: "liquidFill", //设置图表类型
        //数据名称映射
        nameRelation: "",
        //数据值映射
        valueRelation: "",
        //值小数位数
        decimals: "",
        //保留小数0
        keepZero: "",
        //系列名称映射
        seriesRelation: "",
        // data: [0.49, 0.2], //设置水位，可以写多个值，用来设置多个水位
        data: [
          {
            value: "0.55", // 图形数据写法二
            name: "剩余水量",
            percent: "55",
          },
        ],

        waveAnimation: true, //是否开启水波动画,
        amplitude: 10, // 波浪高度，值越大波形越尖
        waveLength: 200, //水波的长度，值越大水波越长
        shape: "circle", //设置形状，可选为'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
        _isShapeCustom: false, //是否自定义形状
        _shapeSvgHtml: "",
        direction: "right", //设置方向，可选为'left', 'right', 'top', 'bottom',
        radius: "80%", // 设置图的大小  默认为50%
        color: ["#156ACF"], // 设置颜色，可以设置多个值，用来设置多个水位
        center: ["50%", "50%"], //中心点的位置
        animationEasing: "linear",
        outline: {
          borderDistance: 4, // 外边框距离
          itemStyle: {
            borderWidth: 2, // 外边框宽度
            borderColor: "#156ACF", // 外边框颜色
          },
        },
        // 水波样式
        itemStyle: {
          color: "#156ACF", // 统一配置水波的颜色
        //   cssColor:"#156ACF" // css格式的颜色
        },
        backgroundStyle: {
          color: "rgba(255,255,255,0)", // 背景色
        },
        label: {
          show: true,
          color: "#ffffff",
          insideColor: "#ffffff",
          fontFamily: "",
          fontSize: 40,
          position: "inside",
        },
      },
    ],
  },
  common,
  {
    title: {
      show: false,
      text: "示例",
      left: "center",
      top: "60%",
      right: "auto",
      bottom: "auto",
      textStyle: {
        color: "#ffffff",
        fontSize: 25,
        fontFamily: "",
      },
    },
  }
);
