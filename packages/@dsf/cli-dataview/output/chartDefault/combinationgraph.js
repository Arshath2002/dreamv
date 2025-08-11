/*
 * @Description: 饼状图默认配置项
 * @Author: zhanghang
 * @Date: 2021-07-28 13:48:57
 * @LastEditors: zhanghang
 * @LastEditTime: 2022-11-10 14:38:18
 */
const color = [
  "#E28411",
  "#E25711",
  "#FFF325",
  "#2BEC64",
  "#189C6E",
  "#6B49FF",
  "#11C3E2",
  "#1167E2",
  "#9E4FDE",
  "#454CFF",
  "#5098FF",
  "#0F90AC",
  "#2F7EFF",
  "#FFE7D40",
  "#EDADFF",
  "#FA5151",
  "#44D7B6",
];
const rich = {};
color.forEach((it, index) => {
  rich[`color_${index}`] = {
    color: it,
    align: "center",
    padding: [5, 0],
    fontSize: 15,
    fontWeight: 600,
  };
});
export default function cre(
  scaleData,
  op = {
    borderWidth: 2,
    shadowBlur: 20,
    bgColor: "rgb(0, 12, 31)",
    center: ["50%", "50%"],
    radius: ["95%", "100%"],
  }
) {
  let { borderWidth, shadowBlur, bgColor, center, radius } = op;

  var placeHolderStyle = {
    normal: {
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      color: "rgba(0, 0, 0, 0)",
      borderColor: "rgba(0, 0, 0, 0)",
      borderWidth: 0,
    },
  };
  var total = 0;
  for (var i = 0; i < scaleData.length; i++) {
    total += scaleData[i].value;
  }
  var data = [];
  for (var i = 0; i < scaleData.length; i++) {
    data.push(
      {
        value: scaleData[i].value,
        name: scaleData[i].name,
        itemStyle: {
          normal: {
            color: bgColor,
            borderWidth: borderWidth,
            shadowBlur: shadowBlur,

            borderColor: color[i],
            shadowColor: color[i],
          },
        },
        label: {
          fontSize: 16,
        },
        // 标签引导线
        labelLine: {
          show: true,
          lineStyle: {
            length: 30,
            length2: 40,
            color: "#DCF0FF",
          },
        },
      },
      {
        value: total * 0.01,
        name: "",
        itemStyle: placeHolderStyle,
      }
    );
  }
  return {
    color,
    backgroundColor: bgColor,
    tooltip: {
      show: false,
      textStyle: {
        align: "left",
      },
      confine:true
    },
    toolbox: {
      show: false,
    },
    //数据系配置
    series: [
      {
        name: "",
        type: "pie",
        //饼图位置
        center,
        //饼图内外环
        radius,
        // 防止标签重叠
        avoidLabelOverlap: true,
        //是否展示成南丁格尔
        roseType: false,
        // 标签
        label: {
          show: true,
          position: "outside",
          color: "#FFF",
          formatter: function (params) {
            var percent = 0;
            percent = ((params.value / total) * 100).toFixed(0);
            if (params.name !== "") {
              let index = scaleData.findIndex((it) => it.name === params.name);
              let colorName = `color_${index % color.length}`;
              return params.name + "\n{" + colorName + "|" + percent + "%}";
            } else {
              return "";
            }
          },

          rich: rich,
        },
        data: data,
      },
    ],

    title: {
      show: true,
      //主标题
      text: "",
      //副标题
      subtext: "",
      //主标题与副标题间距
      itemGap: 10,
      //位置
      left: "auto",
      top: "auto",
      right: "auto",
      bottom: "auto",
      // 标题大小设置
      textStyle: {
        color: "#333",
        fontSize: 18,
      },
    },
    //图例配置
    legend: {
      show: false,
      //位置
      left: "auto",
      top: "auto",
      right: "center",
      bottom: "auto",
      //朝向
      orient: "horizontal",
      //图例形状
      icon: "",
      //图例字体
      textStyle: {
        color: "#FFF",
        fontSize: "12",
      },
      //图例数据对应数据系name属性
      data: [],
    },
    //区域配置
    grid: {
      //可视区域间距
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      //是否包含坐标轴
      containLabel: true,
      //背景色
      backgroundColor: "transparent",
      //网格的边框颜色
      borderColor: "#ccc",
      //网格的边框宽度
      borderWidth: 1,

      show: false,
    },
  };
}
