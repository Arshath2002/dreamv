/*
 * @Description: 黑金风格
 * @Author: shenah
 * @Date: 2024-03-15 10:28:06
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-24 17:18:47
 */
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import { createSelectStyleVar } from "_dataview/output/config/select";
import threeTool from "_dataview/output/utils/threeTool.js";
const styleVarConfig = createSelectStyleVar().heijin;
export default {
  name: "黑金风格",
  value: "heijin",
  picture: "",
  style: {
    //gis
    gis: {
      label: {
        itemStyle: {
          backgroundColor: "#ECBD63",
          color: "#000",
        },
      },
      theme: {
        AMap: "amap://styles/dark",
        BMap: "dark",
        MineMap: "11002",
      },
    },
    // 时间轴详情
    dataviewTimeInfo: {
      lineConfig: {
        color: "#FFD37E",
      },
      pointConfig: {
        color: "#FFD37E",
      },
      timeConfigStyle: {
        color: "#FFD37E",
      },
      textContentBorderConfig: {
        commonBorderColor: "#FFD37E",
      },
      contentTextStyle: {
        color: "#D1C59F",
      },
      fieldsStyleRules: {
        color: "#FFFFFF",
      },
      textContentBackground: {
        active: "color",
        color: {
          type: "color",
          value: "",
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
        $borderRadius: [50, 50, 50, 50],
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
            image: "/dataview/file/sdk/download?files=4e56d1505d424535934cae1a3116a7c4",
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
        $borderRadius: [50, 50, 50, 50],
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
            image: "/dataview/file/sdk/download?files=30f023b25b1148b9935335494e1d59bf",
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
          image: "/dataview/file/sdk/download?files=c8bf9ef56b7847f88cf7552ad6f50ec4",
          size: "contain",
          repeat: "no-repeat",
          position: "center",
        },
      },
      // 菜单点击背景
      clickBackgroundConfig: {
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=2aa464039d2a4b1ebe8fcbe0ab6961dc",
          size: "contain",
          repeat: "no-repeat",
          position: "center",
        },
      },
      navTextStyle: {
        color: "#ECBD63",
      },
      clickTextStyle: {
        color: "#000000",
      },
      hoverTextStyle: {
        color: "#000000",
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
        active: "color",
        pattern: {
          image: "",
        },
        color: {
          type: "color",
          image: "",
          value: "rgba(0, 0, 0, 1)",
        },
      },
    },
    dialogConfig: {
      background: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgb(31, 27, 20)",
        },
      },
      titleBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(180deg, rgba(162, 130, 67, 1) 0%,rgba(116, 90, 25, 1) 99%)",
          value: "",
        },
      },
      relativeStyle: true,
      iconPosition: ["auto", "auto", "auto", "auto"],
      titleHeight: 40,
      align: "left",
      vectorAlign: "center",
      iconColor: "rgba(255, 255, 255, 1)",
      iconSize: 13,
      padding: ["20", "20", "20", "20"],
      titlePadding: [0, "20", 0, "34"],
      borderWidth: 1,
      borderColor: "rgba(255, 211, 126, 0.5)",
      borderRadius: 0,
      textStyle: {
        color: "rgba(255, 255, 255, 1)",
        fontFamily: "Alibaba-PuHuiTi-Medium",
        fontSize: "18",
      },
      fontSize: "18",
      fontFamily: "Microsoft Yahei",
      color: "#FFF",
    },
    popupConfig: {
      background: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(57, 54, 48, 0.96)",
        },
      },
      placement: "right",
      relativeStyle: true,
      arrow: {
        show: false,
        size: 10,
      },
      shadowShow: false,
      shadowColor: "#FFF",
      offsetFormat: 0,
      padding: ["16", "16", "16", "16"],
      borderColor: "rgba(57, 54, 48, 0.96)",
      borderRadius: 4,
      borderWidth: 0,
    },
    // 选中与未选中的样式
    dataViewSelectStyle: {
      defaultColor: "#fff",
      clickColor: "rgba(255,211,126,1)",
    },
    dataViewExport: {
      controlBackgroundConfig: {
        active: "color",
        color: {
          type: "color",
          image: "",
          isTheme: false,
          theme: "",
          value: "rgba(255,211,126,1)",
        },
      },
      textStyle: { color: "#FFF" },
    },
    dataviewCircleMenu: {
      defaultBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, #222 0%,#222 100%)",
          isTheme: false,
          theme: "main",
          value: "#222",
        },
      },
      activeBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, #8A5B00 0%,#FFD37E 100%)",
          isTheme: false,
          theme: "main",
          value: "#FFD37E",
        },
      },
      borderColor: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, #666 0%,#222 100%)",
          isTheme: false,
          theme: "main",
          value: "#222",
        },
      },
      textStyle: createCommonTextStyle({ color: "#ffd480" }),
      activeTextStyle: createCommonTextStyle({ color: "#FFF" }),
    },
    //轮播排名
    scrollRankingBoard: {
      barBackground: "rgba(71, 71, 71, 0.3)",
      colors: [
        "linear-gradient(90deg, rgba(255, 211, 126, 0.6) 0%, rgb(255, 211, 126) 100%)",
        "linear-gradient(90deg, rgba(148, 186, 93, 0.6) 0%, rgb(148, 186, 93) 100%)",
        "linear-gradient(90deg, rgba(213, 129, 79, 0.6) 0%, rgb(213, 129, 79) 100%)",
        "linear-gradient(90deg, rgba(207, 124, 124, 0.6) 0%, rgb(207, 124, 124) 100%)",
        "linear-gradient(90deg, rgba(209, 197, 159, 0.6) 0%, rgb(209, 197, 159) 100%)",
        "linear-gradient(90deg, rgba(106, 118, 150, 0.6) 0%, rgb(106, 118, 150) 100%)",
      ],

      titleTextStyle: createCommonTextStyle({
        color: "rgba(255, 255, 255,1)",
        fontSize: "18",
      }),
      valueTextStyle: createCommonTextStyle({
        color: "rgba(255, 255, 255,1)",
        fontSize: "18", // 字号
      }),
    },
    //圆环组
    ringGroup: {
      colors: ["rgba(255,211,126,1)", "rgba(148,186,93,1)", "rgba(213,129,79,1)", "rgba(207,124,124,1)", "rgba(209,197,159,1)", "rgba(106,118,150,1)"],
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
          image: "/dataview/file/sdk/download?files=bc5c2edd96e44ce69bb79aaf15d4f672",
          size: "contain",
          repeat: "no-repeat",
          position: "left top",
        },
      },
      titlePadding: [0, 0, 0, 35],
      titleTextStyle: createCommonTextStyle({
        color: "rgba(255, 255, 255,1)",
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(255, 255, 255,1)",
        fontSize: "16", // 字号
      }),
    },
    //面板组件
    dataviewPanel: {
      //标题背景
      titleBackgroundConfig: {
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=bc5c2edd96e44ce69bb79aaf15d4f672",
          size: "contain",
          repeat: "no-repeat",
          position: "left top",
        },
      },
      titlePadding: [0, 0, 0, 30],
      totalBackgroundConfig: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(255,255,255,0)",
        },
      },
      titleTextStyle: createCommonTextStyle({
        color: "rgba(255, 255, 255,1)",
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(255, 255, 255,1)",
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
        imageType: "title",
        pattern: {
          image: "/dataview/file/sdk/download?files=16ab67d6ecc74d62a3281876baa26c4c",
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
        color: "rgba(255, 255, 255,1)",
        fontSize: "46", // 字号
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(255, 255, 255,1)",
        fontSize: "16", // 字号
      }),
      //边框颜色
      borderColor: "#FFDC4C",
    },
    //表格组件
    dataviewTable: {
      newHeaderConfig: {
        bgColor: "", // 统一的表头背景色
        color: "rgba(255,211,126,1)", // 统一的表头颜色
      },
      newContentConfig: {
        color: "rgba(255,255,255,1)", // 内容颜色
      },
      indexAttrConfig: {
        bgColors: ["#695C14", "#695C14", "#695C14", "#695C14"],
      },
      selectTheme: "heijin",
    },
    //下拉框组件
    select: {
      selectTheme: "heijin",
      borderConfig: {
        commonBorderColor: styleVarConfig["--input-border-color"],
      },
      borderRadius: styleVarConfig["--input-border-radius"],
    },
    //时间范围组件
    timeRange: {
      selectTheme: "heijin",
    },
    // 高级查询
    advancedQuery: {
      selectTheme: "heijin",
    },
    // 3d 地图
    threeMap: {
      itemStyle: {
        range: {
          color: ["#897143", "#6A4704"],
        },
        topColor: "rgba(174, 156, 111, 0.8)", //面的顶面颜色
        sideColor: "rgba(118, 100, 64, 1)", //侧边颜色
        uColor: "rgba(163, 140, 76, 1)", //侧边动画颜色
      },
      lineStyle: {
        color: "rgba(160, 172, 103, 1)",
      },
      outLineStyle: {
        color: "#DCD1B1",
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
        lineColor: "rgba(255,211,126,0.3)",
      },
      // 地图颜色设置
      map: {
        colors: ["#BAA770"], // 地图区域颜色
        labelColor: "#fff", // 地图文字颜色
        borderColor: "#E4D7B4", // 地图边线文字
      },
      // 图形颜色设置
      commonStyle: {
        colors: [
          ["rgba(255,211,126,0.2)", "rgba(255,211,126,0.6)", "rgba(255,211,126,1)"],
          ["rgba(148,186,93,0.2)", "rgba(148,186,93,0.6)", "rgba(148,186,93,1)"],
          ["rgba(213,129,79,0.2)", "rgba(213,129,79,0.6)", "rgba(213,129,79,1)"],
          ["rgba(207,124,124,0.2)", "rgba(207,124,124,0.6)", "rgba(207,124,124,1)"],
          ["rgba(209,197,159,0.2)", "rgba(209,197,159,0.6)", "rgba(209,197,159,1)"],
          ["rgba(106,118,150,0.2)", "rgba(106,118,150,0.6)", "rgba(106,118,150,1)"],
        ],
        labelColor: "rgba(245,252,255,1)",
      },
      visualMap: {
        colors: ["#806007", "#978349"],
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
              image: "/dataview/file/sdk/download?files=1c2f3cdf8db84f05877adf1880db1c2c",
              size: "100% 100%",
              repeat: "no-repeat",
              position: ["center", "center"],
            },
          },
        },
      ], // 单个背景(里面对象则为背景的通用对象)
      attachObj: {
        // 统一
        nameColor: "rgba(255,211,126,1)", // 名称颜色
        valueColor: "#FFF", // 值颜色
        unitColor: "rgba(255,255,255,1)", // 单位颜色
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
              image: "/dataview/file/sdk/download?files=1c2f3cdf8db84f05877adf1880db1c2c",
              size: "100% 100%",
              repeat: "no-repeat",
              position: ["center", "center"],
            },
          },
        },
      ], // 单个背景(里面对象则为背景的通用对象)
      nameTextStyle: {
        color: "rgba(255,211,126,1)",
      },
      valueTextStyle: {
        color: "#FFF",
      },
      unitTextStyle: {
        color: "rgba(255,255,255,1)",
      },
    },
    // 图标排名
    dataviewIconRate: {
      nameTextStyle: {
        color: "rgba(255,211,126,1)",
      },
      valueTextStyle: {
        color: "rgba(255,255,255,1)",
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
        color: "rgba(255, 255, 255,1)",
      },
      textStyle: {
        color: "rgba(255, 255, 255,1)",
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
      selectTheme: "heijin",
      color: "rgba(255, 255, 255, 1)",
      borderConfig: {
        border: "1px solid rgba(247, 181, 0, 0.5)",
        commonBorderColor: "rgba(247, 181, 0, 0.5)",
      },
    },
    // 占比条
    dataviewRatioBar: {
      titleTextStyle: {
        color: "rgba(255,255,255,1)",
      },
      barBackgroundColorList: ["rgba(255,211,126,1)", "rgba(148,186,93,1)", "rgba(213,129,79,1)", "rgba(207,124,124,1)", "rgba(209,197,159,1)", "rgba(106,118,150,1)"],
    },
    // 进度池
    dataviewPercentPond: {
      config: {
        colors: ["rgba(255,211,126,1)", "rgba(148,186,93,1)"],
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
        color: "rgba(255,211,126,1)",
      },
      valueTextStyle: {
        color: "rgba(255,211,126,1)",
      },
      config: {
        bigCircleStrokeArr: [
          ["rgba(255,211,126,0.6)", "rgba(255,211,126,1)", "rgba(255,211,126,0.6)", "rgba(255,211,126,0.4)"],
          ["rgba(148,186,93,0.6)", "rgba(148,186,93,1)", "rgba(148,186,93,0.6)", "rgba(148,186,93,0.4)"],
          ["rgba(213,129,79,0.6)", "rgba(213,129,79,1)", "rgba(213,129,79,0.6)", "rgba(213,129,79,0.4)"],
          ["rgba(207,124,124,0.6)", "rgba(207,124,124,1)", "rgba(207,124,124,0.6)", "rgba(207,124,124,0.4)"],
          ["rgba(209,197,159,0.6)", "rgba(209,197,159,1)", "rgba(209,197,159,0.6)", "rgba(209,197,159,0.4)"],
          ["rgba(106,118,150,0.6)", "rgba(106,118,150,1)", "rgba(106,118,150,0.6)", "rgba(106,118,150,0.4)"],
        ],
        nodeCircleStrokeArr: ["rgba(255,211,126,1)", "rgba(148,186,93,1)", "rgba(213,129,79,1)", "rgba(207,124,124,1)", "rgba(209,197,159,1)", "rgba(106,118,150,1)"],
        linesColors: [
          "linear-gradient(0deg, rgba(255,211,126,1) 0%,rgba(255,211,126,0.5) 100%)",
          "linear-gradient(0deg, rgba(148,186,93,1) 0%,rgba(148,186,93,0.5) 100%)",
          "linear-gradient(0deg, rgba(213,129,79,1) 0%,rgba(213,129,79,0.5) 100%)",
          "linear-gradient(0deg, rgba(207,124,124,1) 0%,rgba(207,124,124,0.5) 100%)",
          "linear-gradient(0deg, rgba(209,197,159,1) 0%,rgba(209,197,159,0.5) 100%)",
          "linear-gradient(0deg, rgba(106,118,150,1) 0%,rgba(106,118,150,0.5) 100%)",
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
        "linear-gradient(90deg, rgba(255, 119, 0, 0) 0%, rgb(209, 197, 159) 100%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(255, 119, 0) 100%)",
        "linear-gradient(90deg, rgba(255, 119, 0, 0) 0%, rgb(209, 197, 159) 100%)",
        "linear-gradient(90deg, rgba(255, 119, 0, 0) 0%, rgb(146, 130, 82) 100%)",
      ],
      indexAttrConfig: {
        fontColors: ["rgba(255,255,255,1)"],
        bgColors: [
          "linear-gradient(90deg, rgb(255, 211, 126) 0%, rgba(255, 119, 0, 0) 100%)",
          "linear-gradient(90deg, rgb(213, 129, 79) 0%, rgba(255, 119, 0, 0) 100%)",
          "linear-gradient(90deg, rgb(209, 197, 159) 0%, rgba(255, 119, 0, 0) 100%)",
          "linear-gradient(90deg, rgb(146, 130, 82) 0%, rgba(255, 119, 0, 0) 100%)",
        ],
      },
      nameTextStyle: {
        color: "#FFF",
      },
      valueTextStyle: {
        color: "rgba(255,211,126,1)",
      },
      unitTextStyle: {
        color: "#FFF",
      },
    },
  },
  // 公用的属性
  commonConfig: {
    // 系列色(后面的统一使用这种,前面的有时间再改)
    colorList: ["rgba(255,211,126,1)", "rgba(148,186,93,1)", "rgba(213,129,79,1)", "rgba(207,124,124,1)", "rgba(209,197,159,1)", "rgba(106,118,150,1)"],
  },
};
