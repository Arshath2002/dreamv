/*
 * @Description: 半透明风格
 * @Author: shenah
 * @Date: 2024-03-15 10:28:06
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 18:52:32
 */
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import { createSelectStyleVar } from "_dataview/output/config/select";
import threeTool from "_dataview/output/utils/threeTool.js";
const styleVarConfig = createSelectStyleVar().bantouming;
export default {
  name: "半透明风格",
  value: "bantouming",
  picture: "",
  style: {
    //gis
    gis: {
      label: {
        itemStyle: {
          backgroundColor: "#19C2FF",
          color: "#FFF",
        },
      },
      theme: {
        AMap: "amap://styles/darkblue",
        BMap: "dark",
        MineMap: "11002",
      },
    },
    // 时间轴详情
    dataviewTimeInfo: {
      lineConfig: {
        color: "rgba(25,194,255,1)",
      },
      pointConfig: {
        color: "rgba(25,194,255,1)",
      },
      timeConfigStyle: {
        color: "rgba(25,194,255,1)",
      },
      textContentBorderConfig: {
        commonBorderColor: "#317AFF",
      },
      contentTextStyle: {
        color: "rgba(255,255,255,0.5)",
      },
      fieldsStyleRules: {
        color: "#FFFFFF",
      },
      textContentBackground: {
        active: "color",
        color: {
          type: "color",
          value: "rgba(3,8,19,0.20)",
        },
      },
    },
    // 区域级联
    areaCascader: {
      nameTextStyle: {
        color: "rgba(255,255,255,1)",
      },
    },
    // 选项卡
    dataviewNavTab: {
      //未选中
      noSelectStyle: {
        color: "rgba(255,255,255,0.7)",
        borderConfig: {
          commonBorderWidth: 0,
          commonBorderColor: "#077abd",
          commonBorderStyle: "solid",
        },
        $borderRadius: [4, 4, 4, 4],
        bgConfig: {
          active: "pattern",
          imageType: "nav",
          color: {
            // 选色方式 默认为空 单色色盘选择 color  线性渐变 linear  径向渐变 radial
            type: "color",
            //提供给渐变使用
            image: "",
            isTheme: false,
            theme: "main",
            value: "",
          },
          pattern: {
            image: "/dataview/file/sdk/download?files=bd959214c7ff42b79c9f52015b1add6a",
            size: "100% 100%",
            repeat: "no-repeat",
            position: "center",
            customW: "100%",
            customH: "100%",
            customX: "center",
            customY: "center",
            isCustomPosition: false,
            animation: {
              name: [],
              attrList: [], // 属性list
            },
          },
        },
      },
      //选中
      selectStyle: {
        color: "rgba(255,255,255,1)",
        borderConfig: {
          commonBorderWidth: 0,
          commonBorderColor: "#077abd",
          commonBorderStyle: "solid",
        },
        $borderRadius: [4, 4, 4, 4],
        bgConfig: {
          active: "pattern",
          imageType: "nav",
          color: {
            // 选色方式 默认为空 单色色盘选择 color  线性渐变 linear  径向渐变 radial
            type: "color",
            //提供给渐变使用
            image: "",
            isTheme: false,
            theme: "main",
            value: "",
          },
          pattern: {
            image: "/dataview/file/sdk/download?files=98bc5f5e30104bbfbee2bf3fe8c9f77c",
            size: "100% 100%",
            repeat: "no-repeat",
            position: "center",
            customW: "100%",
            customH: "100%",
            customX: "center",
            customY: "center",
            isCustomPosition: false,
            animation: {
              name: [],
              attrList: [], // 属性list
            },
          },
        },
      },
    },
    // 导航菜单
    dataviewNavMenu: {
      // 默认一级菜单背景
      defaultBackgroundConfig: {
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=d9b93fa83e874c44b68ee33ce6529fed",
          size: "100% 100%",
          repeat: "no-repeat",
          position: "center",
        },
      },
      // 菜单点击背景
      clickBackgroundConfig: {
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=c1f8753b0f3e4733baa3f19c4725f11a",
          size: "100% 100%",
          repeat: "no-repeat",
          position: "center",
        },
      },
      navTextStyle: {
        color: "rgba(255,255,255,0.7)",
      },
      clickTextStyle: {
        color: "#FFFFFF",
      },
      hoverTextStyle: {
        color: "#FFFFFF",
      },
      // inferior 菜单默认背景
      subDefaultBackgroundConfig: {
        active: "color",
        color: {
          type: "color",
          value: "transparent",
        },
      },
      subHoverBackgroundConfig: {
        active: "color",
        color: {
          type: "color",
          value: "rgba(255,255,255,0.1)",
        },
      },
      subNavTextStyle: {
        color: "rgba(255,255,255,1)",
      },
      subHoverTextStyle: {
        color: "rgba(255,255,255,1)",
      },
    },
    //页面
    dataviewPage: {
      //字体颜色
      fontColor: "rgba(255,255,255,1)",
      //页面背景
      backgroundConfig: {
        active: "pattern",
        color: {
          type: "color",
          image: "",
          value: "#0e3350",
        },
        pattern: {
          image: "/dataview/file/sdk/download?files=30da2930917047e3b3264d8b49831473",
          size: "100% 100%",
          repeat: "no-repeat",
          position: "center",
        },
      },
    },
    dialogConfig: {
      background: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "#0E3350",
        },
      },
      titleBackground: {
        active: "pattern",
        color: {
          type: "color",
          image: "",
          value: "",
        },
        imageType: "model",
        pattern: {
          image: "/dataview/file/sdk/download?files=c43ecfcc20da48cb967540ff1870b5f9",
          size: "contain",
          repeat: "no-repeat",
          position: ["left", "center"],
        },

      },
      iconPosition: ["auto", "auto", "auto", "auto"],
      relativeStyle: true,
      titleHeight: 60,
      align: "left",
      vectorAlign: "center",
      iconColor: "#FFF",
      iconSize: "16",
      padding: ["10", "20", "20", "20"],
      titlePadding: [0, "15", 0, "70"],
      borderWidth: "1",
      borderColor: "rgba(127, 191, 255, 0.3)",
      borderRadius: 4,
      textStyle: {
        color: "#fff",

        fontFamily: "Alibaba-PuHuiTi-Regular",
        fontSize: "20",
      },
    },
    popupConfig: {
      background: {
        active: "color",
        color: {
          type: "color",
          image: "",
  
          value: "rgba(0, 64, 127, 0.96)",
        },
      },
      placement: "right",
      relativeStyle: true,
      arrow: {
        show: false,
        size: 10,
      },
      shadowShow: false,
      shadowColor: "rgba(255, 255, 255, 1)",
      offsetFormat: 0,
      padding: ["16", "16", "16", "16"],
      
      borderRadius: 4,
      borderWidth: 0,
      borderColor: "rgba(0, 64, 127, 1)",
    },
    // 选中与未选中的样式
    dataViewSelectStyle: {
      defaultColor: "rgba(255,255,255,0.5)",
      clickColor: "rgba(255,255,255,1)",
    },
    dataViewExport: {
      controlBackgroundConfig: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(25,194,255,1)",
        },
      },
      textStyle: { color: "#FFF" },
    },
    dataviewCircleMenu: {
      defaultBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(25,194,255,0.6) 0%,rgba(25,194,255,1) 100%)",
          value: "#222",
        },
      },
      activeBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(72,237,255,0.6) 0%,rgba(72,237,255,1) 100%)",
          value: "#FFD37E",
        },
      },
      borderColor: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(255,255,255,1) 0%,rgba(25,194,255,1) 100%)",
          value: "#222",
        },
      },
      textStyle: createCommonTextStyle({ color: "#FFF" }),
      activeTextStyle: createCommonTextStyle({ color: "#FFF" }),
    },
    //轮播排名
    scrollRankingBoard: {
      barBackground: "rgba(71, 71, 71, 0.3)",
      colors: [
        "linear-gradient(90deg, rgba(25, 194, 255, 0.6) 0%, rgb(25, 194, 255) 100%)",
        "linear-gradient(90deg, rgba(72, 237, 255, 0.6) 0%, rgb(72, 237, 255) 100%)",
        "linear-gradient(90deg, rgba(49, 122, 255, 0.6) 0%, rgb(49, 122, 255) 100%)",
        "linear-gradient(90deg, rgba(255, 227, 36, 0.6) 0%, rgb(255, 227, 36) 100%)",
        "linear-gradient(90deg, rgba(61, 234, 185, 0.6) 0%, rgb(61, 234, 185) 100%)",
        "linear-gradient(90deg, rgba(255, 121, 62, 0.6) 0%, rgb(255, 121, 62) 100%)",
        "linear-gradient(90deg, rgba(25, 194, 255, 0.6) 0%, rgb(25, 194, 255) 100%)",
      ],
      titleTextStyle: createCommonTextStyle({
        color: "rgba(255,255,255,1)",
        fontSize: "18",
      }),
      valueTextStyle: createCommonTextStyle({
        color: "rgba(255,255,255,1)",
        fontSize: "18", // 字号
      }),
    },
    //圆环组
    ringGroup: {
      colors: ["rgba(25,194,255,1)", "rgba(72,237,255,1)", "rgba(49,122,255,1)", "rgba(255,227,36,1)", "rgba(61,234,185,1)", "rgba(255,121,62,1)"],
      titleTextStyle: createCommonTextStyle({
        fontSize: 16,
        color: "rgba(255,255,255,1)",
      }),
      valueTextStyle: createCommonTextStyle({
        fontSize: 30,
        color: "rgba(255,255,255,1)",
      }),
      unitTextStyle: createCommonTextStyle({
        fontSize: 14,
        color: "rgba(255,255,255,1)",
      }),
    },

    //面板标题
    dataviewPanelText: {
      backgroundConfig: {
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=36ec207167d54022a01e1d5119f35c93",
          size: "contain",
          repeat: "no-repeat",
          position: "left top",
        },
      },
      titlePadding: [0, 0, 0, 50],
      titleTextStyle: createCommonTextStyle({
        color: "rgba(255,255,255,1)",
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(255,255,255,1)",
        fontSize: "16", // 字号
      }),
    },
    //面板组件
    dataviewPanel: {
      //标题背景
      titleBackgroundConfig: {
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=c43ecfcc20da48cb967540ff1870b5f9",
          size: "contain",
          repeat: "no-repeat",
          position: "left top",
        },
      },
      titlePadding: [0, 0, 0, 50],
      totalBackgroundConfig: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(255,255,255,0)",
        },
      },
      titleTextStyle: createCommonTextStyle({
        color: "rgba(255,255,255,1)",
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(255,255,255,1)",
        fontSize: "16", // 字号
      }),
      //边框颜色
      borderColor: "#FFDC4C",
    },
    //头部横栏
    dataviewHeaderContent: {
      //标题背景
      titleBackgroundConfig: {
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=9141cc738d15416d9d1a8649483c6896",
          size: "100% 100%",
          repeat: "no-repeat",
          position: "center",
        },
      },
      titleTextAlign: {
        vAlign: "middle",
        hAlign: "center",
      },
      titleTextStyle: createCommonTextStyle({
        color: "rgba(220,240,255,1)",
        fontSize: "46", // 字号
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(220,240,255,1)",
        fontSize: "16", // 字号
      }),
      //边框颜色
      borderColor: "#FFDC4C",
    },
    //表格组件
    dataviewTable: {
      newHeaderConfig: {
        bgColor: "", // 统一的表头背景色
        color: "rgba(255,255,255,1)", // 统一的表头颜色
      },
      newContentConfig: {
        color: "rgba(255,255,255,0.7)", // 内容颜色
      },
      backgroundColor: "rgba(255,255,255,0)", // 整体的背景色
      indexAttrConfig: {
        bgColors: ["#F28E48", "#FFC32B", "#358FF8", "#385376"],
      },
      selectTheme: "bantouming",
    },
    //下拉框组件
    select: {
      selectTheme: "bantouming",
      borderConfig: {
        commonBorderColor: styleVarConfig["--input-border-color"],
      },
      borderRadius: styleVarConfig["--input-border-radius"],
    },
    //时间范围组件
    timeRange: {
      selectTheme: "bantouming",
    },
    // 高级查询
    advancedQuery: {
      selectTheme: "bantouming",
    },
    // 3d 地图
    threeMap: {
      itemStyle: {
        range: {
          color: ["#1583B9", "#1A75B9"],
        },
        topColor: "#1E8DA0", //面的顶面颜色
        sideColor: "#1583B9", //侧边颜色
        uColor: "#1A75B9", //侧边动画颜色
      },
      lineStyle: {
        color: "#f4f4f4",
      },
      outLineStyle: {
        color: "#B7C0D5",
      },
      label: {
        itemStyle: {
          textStyle: {
            color: "#FFF",
          },
        },
      },
    },
    //图表组件
    dataviewGraph: {
      // 标题
      title: {
        labelColor: "rgba(255,255,255,1)",
      },
      // 图例
      legend: {
        labelColor: "rgba(255,255,255,1)",
      },
      // 坐标系颜色控制
      axis: {
        labelColor: "rgba(255,255,255,1)",
        lineColor: "rgba(255,255,255,0.3)",
      },
      // 地图颜色设置
      map: {
        colors: ["rgba(22, 161, 185, 1)"], // 地图区域颜色
        labelColor: "rgba(255,255,255,1)", // 地图文字颜色
        borderColor: "rgba(255,255,255,1)", // 地图边线文字
      },
      // 图形颜色设置
      commonStyle: {
        colors: [
          ["rgba(25,194,255,0.2)", "rgba(25,194,255,0.6)", "rgba(25,194,255,1)"],
          ["rgba(72,237,255,0.2)", "rgba(72,237,255,0.6)", "rgba(72,237,255,1)"],
          ["rgba(49,122,255,0.2)", "rgba(49,122,255,0.6)", "rgba(49,122,255,1)"],
          ["rgba(255,227,36,0.2)", "rgba(255,227,36,0.6)", "rgba(255,227,36,1)"],
          ["rgba(61,234,185,0.2)", "rgba(61,234,185,0.6)", "rgba(61,234,185,1)"],
          ["rgba(255,121,62,0.2)", "rgba(255,121,62,0.6)", "rgba(255,121,62,1)"],
        ],
        labelColor: "rgba(245,252,255,1)",
      },
      // 热力图
      visualMap: {
        colors: ["#A05F2A", "#B45931"],
        textStyle: {
          color: "#ededed",
        },
      },
    },
    //图文组件
    dataviewKeyTrades: {
      backgroundConfigs: [
        {
          bgImgObj: {
            active: "pattern",
            imageType: "board",
            pattern: {
              image: "/dataview/file/sdk/download?files=3544bc4ccaf84205ac687b83217922b1",
              size: "100% 100%",
              repeat: "no-repeat",
              position: ["center", "center"],
            },
          },
        },
      ], // 单个背景(里面对象则为背景的通用对象)
      attachObj: {
        // 统一
        nameColor: "#FFF", // 名称颜色
        valueColor: "#48EDFF", // 值颜色
        unitColor: "#FFF", // 单位颜色
      },
    },
    // 数据看板
    dataviewDataPlane: {
      backgroundConfigs: [
        {
          bgImgObj: {
            active: "pattern",
            imageType: "board",
            pattern: {
              image: "/dataview/file/sdk/download?files=3544bc4ccaf84205ac687b83217922b1",
              size: "100% 100%",
              repeat: "no-repeat",
              position: ["center", "center"],
            },
          },
        },
      ], // 单个背景(里面对象则为背景的通用对象)
      nameTextStyle: {
        color: "rgba(255,255,255,1)",
      },
      valueTextStyle: {
        color: "#48EDFF",
      },
      unitTextStyle: {
        color: "#FFF",
      },
    },
    // 图标排名
    dataviewIconRate: {
      nameTextStyle: {
        color: "rgba(255,255,255,1)",
      },
      valueTextStyle: {
        color: "rgba(49,122,255,1)",
      },
      colors: function (theme) {
        let colors = [...theme.commonConfig.colorList];
        return colors;
      },
    },
    // 输入框
    dataviewTextBox: {
      fontColor: "rgba(255, 255, 255,1)",
      contentTextStyle: {
        color: "rgba(255, 255, 255,1)",
      },
      popoverStyleEffect: "dark",
    },
    dataviewSlideNavMenu: {
      arrowStyle: {
        color: "rgba(220,240,255,1)",
      },
      textStyle: {
        color: "rgba(220,240,255,1)",
      },
    },
    // 时间天气
    dataviewDateTimeWeather: {
      defaultStyle: { color: "rgba(255, 255, 255,1)" },
    },
    // 单选多选
    dataviewRadioGroup: {
      textColor: "rgba(255, 255, 255,1)",
      textStyle: {
        color: "rgba(255, 255, 255,1)",
      },
    },
    // 搜索组件
    dataviewTextSearch: {
      selectTheme: "bantouming",
      color: "rgba(255,255,255,1)",
      borderConfig: {
        border: "1px solid rgba(72,237,255,1)",
        commonBorderColor: "rgba(72,237,255,1)",
      },
    },
    // 占比条
    dataviewRatioBar: {
      titleTextStyle: {
        color: "rgba(255,255,255,1)",
      },
      barBackgroundColorList: ["rgba(25,194,255,1)", "rgba(72,237,255,1)", "rgba(49,122,255,1)", "rgba(255,227,36,1)", "rgba(61,234,185,1)", "rgba(255,121,62,1)"],
    },
    // 进度池
    dataviewPercentPond: {
      config: {
        colors: ["rgba(25,194,255,1)", "rgba(72,237,255,1)"],
      },
    },
    // 进度条
    dataviewProgressBar: {
      titleTextStyle: {
        color: "rgba(255,255,255,1)",
      },
      subTitleTextStyle: {
        color: "rgba(255,255,255,1)",
      },
    },
    // 多彩圆环
    moreRingColor: {
      titleTextStyle: {
        color: "rgba(25,194,255,1)",
      },
      valueTextStyle: {
        color: "rgba(25,194,255,1)",
      },
      config: {
        bigCircleStrokeArr: [
          ["rgba(25,194,255,0.6)", "rgba(25,194,255,1)", "rgba(25,194,255,0.6)", "rgba(25,194,255,0.4)"],
          ["rgba(72,237,255,0.6)", "rgba(72,237,255,1)", "rgba(72,237,255,0.6)", "rgba(72,237,255,0.4)"],
          ["rgba(49,122,255,0.6)", "rgba(49,122,255,1)", "rgba(49,122,255,0.6)", "rgba(49,122,255,0.4)"],
          ["rgba(255,227,36,0.6)", "rgba(255,227,36,1)", "rgba(255,227,36,0.6)", "rgba(255,227,36,0.4)"],
          ["rgba(61,234,185,0.6)", "rgba(61,234,185,1)", "rgba(61,234,185,0.6)", "rgba(61,234,185,0.4)"],
          ["rgba(255,121,62,0.6)", "rgba(255,121,62,1)", "rgba(255,121,62,0.6)", "rgba(255,121,62,0.4)"],
        ],
        nodeCircleStrokeArr: ["rgba(25,194,255,1)", "rgba(72,237,255,1)", "rgba(49,122,255,1)", "rgba(255,227,36,1)", "rgba(61,234,185,1)", "rgba(255,121,62,1)"],
        linesColors: [
          "linear-gradient(0deg, rgba(25,194,255,1) 0%,rgba(25,194,255,0.5) 100%)",
          "linear-gradient(0deg, rgba(72,237,255,1) 0%,rgba(72,237,255,0.5) 100%)",
          "linear-gradient(0deg, rgba(49,122,255,1) 0%,rgba(49,122,255,0.5) 100%)",
          "linear-gradient(0deg, rgba(255,227,36,1) 0%,rgba(255,227,36,0.5) 100%)",
          "linear-gradient(0deg, rgba(61,234,185,1) 0%,rgba(61,234,185,0.5) 100%)",
          "linear-gradient(0deg, rgba(255,121,62,1) 0%,rgba(255,121,62,0.5) 100%)",
        ],
      },
    },
    //3D字符云
    runeClouds: {
      colors: function (theme) {
        let colors = [...theme.commonConfig.colorList];
        return colors;
      },
    },
    //圆三棱锥
    threePyramid: {
      config: {
        itemColorArr: function (theme) {
          let colors = [...theme.commonConfig.colorList];
          return colors;
        },
        itemCircleColorArr: function (theme) {
          let arr = [...theme.commonConfig.colorList];
          arr.shift();
          return arr.map((str) => threeTool.changeColorDepth(str, "darken", 20));
        },
      },
    },
    // 排名组件
    rankProgress: {
      processColorList: [
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(25, 194, 255) 100%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(72, 237, 255) 100%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(49, 122, 255) 100%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(255, 227, 36) 100%)",
      ],
      indexAttrConfig: {
        fontColors: ["rgba(255,255,255,0.7)"],
        bgColors: [
          "linear-gradient(90deg, rgb(25, 194, 255) 0%, rgba(226, 74, 59, 0) 100%)",
          "linear-gradient(90deg, rgb(72, 237, 255) 0%, rgba(255, 119, 0, 0) 100%)",
          "linear-gradient(90deg, rgb(49, 122, 255) 0%, rgba(227, 178, 47, 0) 100%)",
          "linear-gradient(90deg, rgb(255, 227, 36) 0%, rgba(24, 190, 118, 0) 100%)",
        ],
      },
      nameTextStyle: {
        color: "rgba(255,255,255,0.7)",
      },
      valueTextStyle: {
        color: "rgba(25,194,255,1)",
      },
      unitTextStyle: {
        color: "rgba(255,255,255,0.7)",
      },
    },
  },
  // 公用的属性
  commonConfig: {
    // 系列色(后面的统一使用这种,前面的有时间再改)
    colorList: ["rgba(25,194,255,1)", "rgba(72,237,255,1)", "rgba(49,122,255,1)", "rgba(255,227,36,1)", "rgba(61,234,185,1)", "rgba(255,121,62,1)"],
  },
};
