/*
 * @Description: 页面样式整体修改---目前只有字体
 * @Author: shenah
 * 特殊属性^_^array代表原来的属性为数组需要循环
 * 例如:fontFamily 是指代的是更新字体,这个字段但是在不同的组件中不一定叫fontFamily所以要取fontFamily里面的对应的值来循环
 * @Date: 2024-09-09 10:13:59
 * @LastEditors: shenah
 * @LastEditTime: 2024-09-10 18:39:19
 */

export default {
  name: "所有组件样式整体修改",
  props: {
    // 枚举可能会出现的情况
    titleTextStyle: {
      fontFamily: ["fontFamily"],
    },
    subTitleTextStyle: {
      fontFamily: ["fontFamily"],
    },
    navTextStyle: {
      fontFamily: ["fontFamily"],
    },
    clickTextStyle: {
      fontFamily: ["fontFamily"],
    },
    hoverTextStyle: {
      fontFamily: ["fontFamily"],
    },
    textStyle: {
      fontFamily: ["fontFamily"],
    },
    activeTextStyle: {
      fontFamily: ["fontFamily"],
    },
    newHeaderConfig: {
      fontFamily: ["fontFamily"],
    },
    newContentConfig: {
      fontFamily: ["fontFamily"],
    },
    indexAttrConfig: {
      fontFamily: ["fontFamily"],
    },
    "headData^_^array": {
      fontFamily: ["fontFamily", "headerFontFamily"],
      prefixConfig: {
        defaultConfig: {
          text: {
            fontFamily: ["fontFamily"],
          },
        },
      },
      suffixConfig: {
        defaultConfig: {
          text: {
            fontFamily: ["fontFamily"],
          },
        },
      },
    },
    nameTextStyle: {
      fontFamily: ["fontFamily"],
    },
    valueTextStyle: {
      fontFamily: ["fontFamily"],
    },
    unitTextStyle: {
      fontFamily: ["fontFamily"],
    },
    configMapRelations: {
      "attachArr^_^array": {
        style: {
          fontFamily: ["nameFontFamily", "valueFontFamily", "unitFontFamily"],
        },
      },
      imgText: {
        "attachArr^_^array": {
          style: {
            fontFamily: ["nameFontFamily", "valueFontFamily", "unitFontFamily"],
          },
        },
      }
    },
    mainMapRelations: {
      "attachArr^_^array": {
        style: {
          fontFamily: ["nameFontFamily", "valueFontFamily", "unitFontFamily"],
        },
      },
    },
    digitalStyle: {
      fontFamily: ["fontFamily"],
    },
    prefixConfig: {
      defaultConfig: {
        text: {
          fontFamily: ["fontFamily"],
        },
      },
    },
    suffixConfig: {
      defaultConfig: {
        text: {
          fontFamily: ["fontFamily"],
        },
      },
    },
    selectStyle: {
      fontFamily: ["fontFamily"]
    },
    noSelectStyle: {
      fontFamily: ["fontFamily"]
    },
    "layouts^_^array": {
      style: {
        fontFamily: ["fontFamily"]
      },
    },
    contentTextStyle: {
      fontFamily: ["fontFamily"]
    },
    timeTextStyle: {
      fontFamily: ["fontFamily"]
    },
    labelTextStyle: {
      fontFamily: ["fontFamily"]
    },
    labelActiveTextStyle: {
      fontFamily: ["fontFamily"]
    },
    selectTextStyle: {
      fontFamily: ["fontFamily"]
    },
    fullTextStyle: {
      fontFamily: ["fontFamily"]
    },
    chart: {
      legend: {
        textStyle: {
          fontFamily: ["fontFamily"]
        }
      },
      "series^_^array": {
        label: {
          fontFamily: ["fontFamily"]
        },
      },
      "xAxis^_^array": {
        axisLabel: {
          fontFamily: ["fontFamily"]
        },
        nameTextStyle: {
          fontFamily: ["fontFamily"]
        },
      },
      "yAxis^_^array": {
        axisLabel: {
          fontFamily: ["fontFamily"]
        },
        nameTextStyle: {
          fontFamily: ["fontFamily"]
        },
      },
    },
  },
};
