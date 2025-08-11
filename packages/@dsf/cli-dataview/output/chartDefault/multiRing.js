/*
 * @Description: 多圆环
 * @Author: shenah
 * @Date: 2023-09-27 15:18:45
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-07 11:08:52
 */

let data = [
  {
    name: "锦江区",
    value: "40",
    zb: "40",
  },
  {
    name: "成华区",
    value: "35",
    zb: "35",
  },
  {
    name: "武侯区",
    value: "30",
    zb: "30",
  },
  {
    name: "高新区",
    value: "25",
    zb: "25",
  },
];
let maxCount = [];
data.forEach((item) => {
  maxCount.push(Number(item.value));
});
const getPercentValue = function (valueList, idx, precision) {
  // 判断是否为空
  if (!valueList[idx]) {
    return 0;
  }
  // 求和
  let sum = valueList.reduce(function (acc, val) {
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  if (sum === 0) {
    return 0;
  }
  // 10的2次幂是100，用于计算精度。
  let digits = Math.pow(10, precision);
  // 扩大比例100，
  let votesPerQuota = valueList.map(function (val) {
    return ((isNaN(val) ? 0 : val) / sum) * digits * 100;
  });
  // 总数，扩大比例意味的总数要扩大
  let targetSeats = digits * 100;
  // 再向下取值，组成数组
  let seats = votesPerQuota.map(function (votes) {
    return Math.floor(votes);
  });
  // 再新计算合计，用于判断与总数量是否相同，相同则占比会100%
  let currentSum = seats.reduce(function (acc, val) {
    return acc + val;
  }, 0);
  // 余数部分的数组：原先数组减去向下取值的数组，得到余数部分的数组
  let remainder = votesPerQuota.map(function (votes, idx) {
    return votes - seats[idx];
  });
  // 给最大最大的余额加1，凑个占比100%；
  while (currentSum < targetSeats) {
    //  找到下一个最大的余额，给其加1
    let max = Number.NEGATIVE_INFINITY;
    let maxId = null;
    for (let i = 0, len = remainder.length; i < len; ++i) {
      if (remainder[i] > max) {
        max = remainder[i];
        maxId = i;
      }
    }
    // 对最大项余额加1
    ++seats[maxId];
    // 已经增加最大余数加1，则下次判断就可以不需要再判断这个余额数。
    remainder[maxId] = 0;
    // 总的也要加1，为了判断是否总数是否相同，跳出循环。
    ++currentSum;
  }
  // 这时候的seats就会总数占比会100%
  return seats[idx] / digits;
};
let series = [];
let colors = ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc", "#546570", "#c4ccd3"];
let backColors = ["#5470c61A", "#91cc751A", "#fac8581A", "#ee66661A", "#73c0de1A", "#3ba2721A", "#fc84521A", "#9a60b41A", "#ea7ccc1A", "#5465701A", "#c4ccd31A"];
let pieSize = [85, 10, 15];
for (let i = 0; i < data.length; i++) {
  series.push({
    name: "",
    type: "pie",
    clockWise: false, //顺时加载
    hoverAnimation: false, //鼠标移入变大
    radius: [pieSize[0] - i * pieSize[2] + "%", pieSize[0] - pieSize[1] - i * pieSize[2] + "%"],
    center: ["50%", "50%"],
    label: {
      show: false,
    },
    itemStyle: {
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      borderWidth: 5,
    },
    data: [
      {
        value: data[i].zb,
        original: data[i].zb,
        name: data[i].name || "",
        number: data[i].value,
        numberZb: getPercentValue(maxCount, i, 1),
        itemStyle: {
          color: colors[i],
        },
      },
      {
        value: 100 - Number(data[i].zb),
        name: "",
        itemStyle: {
          color: "transparent",
        },
        tooltip: {
          show: false,
          textStyle: {
            align: "left",
          },
          confine: true,
        },

        hoverAnimation: false,
      },
      {
        value: 0,
        name: `${data[i].name}:${data[i].zb}%`,
        itemStyle: {
          color: "transparent",
        },
        label: {
          show: true,
          fontSize: 14,
          color: "#fff",
          position: "inner",
          padding: [0, 0, 0, 85],
        },
        tooltip: {
          show: false,
          textStyle: {
            align: "left",
          },
          confine: true,
        },
      },
    ],
  });
  series.push({
    name: "",
    type: "pie",
    silent: true,
    z: 1,
    clockWise: false, //顺时加载
    hoverAnimation: false, //鼠标移入变大
    radius: [pieSize[0] - i * pieSize[2] + "%", pieSize[0] - pieSize[1] - i * pieSize[2] + "%"],
    center: ["50%", "50%"],
    label: {
      show: false,
    },
    itemStyle: {
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      borderWidth: 5,
    },
    data: [
      {
        value: 7.5,
        itemStyle: {
          color: backColors[i],
        },
        tooltip: {
          show: false,
          textStyle: {
            align: "left",
          },
          confine: true,
        },
        hoverAnimation: false,
      },
      {
        value: 2.5,
        itemStyle: {
          color: "rgba(0,0,0,0)",
          borderWidth: 0,
        },
        tooltip: {
          show: false,
          textStyle: {
            align: "left",
          },
        },
        hoverAnimation: false,
      },
    ],
  });
}
const createMultiRing = function () {
  return {
    backgroundColor: "transparent",
    // 模式：单数据：0 堆叠数据：1
    active: 0,
    // 自动排序
    autoSort: true,
    // 圆环大小，宽度，间隙设置
    pieSize: pieSize,
    // 模式: 占比：0 数值： 1
    countActive: 0,
    //标题配置
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
        fontWeight: "bold",
      },
    },
    labelFormatter: "{a}:{c}",
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
      custom: true, // 自定义位置
      //图例字体
      textStyle: {
        color: "#FFF",
        fontSize: "12",
        fontFamily: "Microsoft Yahei",
      },
      //图例数据对应数据系name属性
      data: [],
    },
    //区域配置
    grid: {
      //可视区域间距
      left: 10,
      top: 10,
      right: 10,
      bottom: 10,
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
    // 映射
    mapOptions: {
      valueRelation: "",
      nameRelation: "",
      percentRelation: "",
      categoryRelation: "",
    },
    // xAxis不显示
    xAxis: [
      {
        show: false,
      },
    ],
    //数据系配置
    series: series,
    //提示配置
    tooltip: {
      trigger: "item",
      textStyle: {
        align: "left",
      },
      confine: true,
      formatter: function (params) {
        var relVal = params.name;
        if (relVal !== "") relVal += "<br/>";
        relVal += params.marker + params.data.value;
        return relVal;
      },
    },
  };
};
export {
  createMultiRing
};
