/*
 * @Description: 黑色风格
 * @Author: shenah
 * @Date: 2024-03-15 11:07:22
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 18:27:48
 */
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import { createSelectStyleVar } from "_dataview/output/config/select";
import threeTool from "_dataview/output/utils/threeTool.js";
const styleVarConfig = createSelectStyleVar().chunheise;
export default {
  name: "黑色风格",
  value: "chunheise",
  picture: "",
  style: {
    //gis
    gis: {
      label: {
        itemStyle: {
          backgroundColor: "#2BD8E1",
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
        color: "#2086DE",
      },
      pointConfig: {
        color: "#2086DE",
      },
      timeConfigStyle: {
        color: "#DCF0FF",
      },
      textContentBorderConfig: {
        commonBorderColor: "#2CD7E2",
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
            image: "/dataview/file/sdk/download?files=c685686bf82e43e79c9fa739ac909579",
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
            image: "/dataview/file/sdk/download?files=2a478c247faa47cba4333b2d0f28a173",
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
        active: "color",
        color: {
          type: "color",
          value: "transparent",
        },
      },
      // 菜单点击背景
      clickBackgroundConfig: {
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=6ba1c68e0a5c4d039447849209a1adc3",
          size: "100% 100%",
          repeat: "no-repeat",
          position: "center",
        },
      },
      navTextStyle: {
        color: "rgba(255,255,255,0.7)",
      },
      clickTextStyle: {
        color: "#1DECFF",
      },
      hoverTextStyle: {
        color: "#1DECFF",
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
          isTheme: false,
          theme: "main",
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
          value: "rgba(8, 19, 46, 0.96)",
        },
      },
      titleBackground: {
        active: "pattern",
        color: {
          type: "color",
          image: "",
          value: "rgba(255, 255, 255, 0)",
        },
        imageType: "model",
        pattern: {
          image: "/dataview/file/sdk/download?files=36ec207167d54022a01e1d5119f35c93",
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
      iconColor: "rgba(255, 255, 255, 1)",
      iconSize: 13,
      padding: ["0", "20", "20", "20"],
      titlePadding: [0, "20", 0, "48"],
      borderWidth: 2,
      borderColor: "rgba(78, 129, 251, 1)",
      borderRadius: 4,
      textStyle: {
        color: "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%,rgba(43, 216, 225, 1) 100%)",
        fontFamily: "youshe",
        fontSize: "24",
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
          value: "rgba(1, 49, 125, 0.96)",
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
      borderRadius: 4,
      borderWidth: 1,
      borderColor: "rgba(32, 134, 222, 0.3)",
    },
    // 选中与未选中的样式
    dataViewSelectStyle: {
      defaultColor: "rgba(255,255,255,0.7)",
      clickColor: "rgba(255,255,255,1)",
    },
    dataViewExport: {
      controlBackgroundConfig: {
        active: "color",
        color: {
          type: "color",
          image: "",
          isTheme: false,
          theme: "",
          value: "rgba(32,134,222,1)",
        },
      },
      textStyle: { color: "#FFF" },
    },
    dataviewCircleMenu: {
      defaultBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(32,134,222,0.6) 0%,rgba(32,134,222,1) 100%)",
          isTheme: false,
          theme: "main",
          value: "#222",
        },
      },
      activeBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(43,216,225,0.6) 0%,rgba(43,216,225,1) 100%)",
          isTheme: false,
          theme: "main",
          value: "#FFD37E",
        },
      },
      borderColor: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg,rgba(32,134,222,0.6) 0%,rgba(32,134,222,1) 100%)",
          isTheme: false,
          theme: "main",
          value: "#222",
        },
      },
      textStyle: createCommonTextStyle({ color: "rgba(255,255,255,0.5)" }),
      activeTextStyle: createCommonTextStyle({ color: "#FFF" }),
    },
    //轮播排名
    scrollRankingBoard: {
      barBackground: "rgba(71, 71, 71, 0.3)",
      colors: [
        "linear-gradient(90deg, rgba(43, 216, 225, 0.6) 0%, rgb(43, 216, 225) 100%)",
        "linear-gradient(90deg, rgba(32, 134, 222, 0.6) 0%, rgb(32, 134, 222) 100%)",
        "linear-gradient(90deg, rgba(120, 141, 241, 0.6) 0%, rgb(120, 141, 241) 100%)",
        "linear-gradient(90deg, rgba(251, 117, 156, 0.6) 0%, rgb(251, 117, 156) 100%)",
        "linear-gradient(90deg, rgba(231, 202, 95, 0.6) 0%, rgb(231, 202, 95) 100%)",
        "linear-gradient(90deg, rgba(245, 152, 121, 0.6) 0%, rgb(245, 152, 121) 100%)",
      ],
      titleTextStyle: createCommonTextStyle({
        color: "rgba(196,252,255,1)",
        fontSize: "18",
      }),
      valueTextStyle: createCommonTextStyle({
        color: "rgba(196,252,255,1)",
        fontSize: "18", // 字号
      }),
    },
    //圆环组
    ringGroup: {
      colors: ["rgba(43,216,225,1)", "rgba(32,134,222,1)", "rgba(120,141,241,1)", "rgba(251,117,156,1)", "rgba(231,202,95,1)", "rgba(245,152,121,1)"],
      titleTextStyle: createCommonTextStyle({
        fontSize: 16,
        color: "rgba(196,252,255,1)",
      }),
      valueTextStyle: createCommonTextStyle({
        fontSize: 30,
        color: "rgba(196,252,255,1)",
      }),
      unitTextStyle: createCommonTextStyle({
        fontSize: 14,
        color: "rgba(196,252,255,1)",
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
      titlePadding: [0, 0, 0, 20],
      titleTextStyle: createCommonTextStyle({
        color: "rgba(196,252,255,1)",
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(196,252,255,1)",
        fontSize: "16", // 字号
      }),
    },
    //面板组件
    dataviewPanel: {
      //标题背景
      titleBackgroundConfig: {
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=36ec207167d54022a01e1d5119f35c93",
          size: "contain",
          repeat: "no-repeat",
          position: "left center",
        },
      },
      titlePadding: [0, 0, 0, 20],
      totalBackgroundConfig: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(255,255,255,0)",
        },
      },
      titleTextStyle: createCommonTextStyle({
        color: "rgba(196,252,255,1)",
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(196,252,255,1)",
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
          image: "/dataview/file/sdk/download?files=da8bab08f73f4fdda55c5c23388bc080",
          size: "100% 100%",
          repeat: "no-repeat",
          position: "center",
        },
      },
      titleTextAlign: {
        vAlign: "middle",
        hAlign: "center",
      },
      titlePadding: [0, 0, 0, 0],
      titleTextStyle: createCommonTextStyle({
        color: "rgba(196,252,255,1)",
        fontSize: "46", // 字号
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(196,252,255,1)",
        fontSize: "16", // 字号
      }),
      //边框颜色
      borderColor: "#FFDC4C",
    },
    //表格组件
    dataviewTable: {
      newHeaderConfig: {
        bgColor: "", // 统一的表头背景色
        color: "rgba(255,255,255,0.5)", // 统一的表头颜色
      },
      newContentConfig: {
        color: "rgba(255,255,255,1)", // 内容颜色
      },
      backgroundColor: "rgba(255,255,255,0)", // 整体的背景色
      indexAttrConfig: {
        bgColors: ["#FB759C", "#2BD8E1", "#2086DE", "#4F5EA5"],
      },
      selectTheme: "chunheise",
    },
    //下拉框组件
    select: {
      selectTheme: "chunheise",
      borderConfig: {
        commonBorderColor: styleVarConfig["--input-border-color"],
      },
      borderRadius: styleVarConfig["--input-border-radius"],
    },
    //时间范围组件
    timeRange: {
      selectTheme: "chunheise",
    },
    // 高级查询
    advancedQuery: {
      selectTheme: "chunheise",
    },
    // 3d 地图
    threeMap: {
      itemStyle: {
        range: {
          color: ["#2B91B7", "#064EA2"],
        },
        topColor: "rgba(6, 78, 162, 0.8)", //面的顶面颜色
        sideColor: "#2B91B7", //侧边颜色
        uColor: "#23AFB7", //侧边动画颜色
      },
      lineStyle: {
        color: "#FFF",
      },
      outLineStyle: {
        color: "#DCD1B1",
      },
      label: {
        itemStyle: {
          textStyle: {
            color: "#F5F5F0",
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
        labelColor: "rgba(255,255,255,0.75)",
        lineColor: "rgba(221,221,221,0.3)",
      },
      // 地图颜色设置
      map: {
        colors: ["#064EA2"], // 地图区域颜色
        labelColor: "#fff", // 地图文字颜色
        borderColor: "#f4f4f4", // 地图边线文字
      },
      // 图形颜色设置
      commonStyle: {
        colors: [
          ["rgba(43,216,225,0.2)", "rgba(43,216,225,0.6)", "rgba(43,216,225,1)"],
          ["rgba(32,134,222,0.2)", "rgba(32,134,222,0.6)", "rgba(32,134,222,1)"],
          ["rgba(120,141,241,0.2)", "rgba(120,141,241,0.6)", "rgba(120,141,241,1)"],
          ["rgba(251,117,156,0.2)", "rgba(251,117,156,0.6)", "rgba(251,117,156,1)"],
          ["rgba(231,202,95,0.2)", "rgba(231,202,95,0.6)", "rgba(231,202,95,1)"],
          ["rgba(245,152,121,0.2)", "rgba(245,152,121,0.6)", "rgba(245,152,121,1)"],
        ],
        labelColor: "rgba(255,255,255,1)",
      },
      // 热力图
      visualMap: {
        colors: ["#F59879", "#E26A8D"],
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
              image: "/dataview/file/sdk/download?files=be1b714f33bd477fb8509059c5d62646",
              size: "100% 100%",
              repeat: "no-repeat",
              position: ["center", "center"],
            },
          },
        },
      ], // 单个背景(里面对象则为背景的通用对象)
      attachObj: {
        // 统一
        nameColor: "rgba(255,255,255,0.5)", // 名称颜色
        valueColor: "rgba(255,255,255,1)", // 值颜色
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
              image: "/dataview/file/sdk/download?files=be1b714f33bd477fb8509059c5d62646",
              size: "100% 100%",
              repeat: "no-repeat",
              position: ["center", "center"],
            },
          },
        },
      ], // 单个背景(里面对象则为背景的通用对象)
      nameTextStyle: {
        color: "rgba(255,255,255,0.5)",
      },
      valueTextStyle: {
        color: "rgba(255,255,255,1)",
      },
      unitTextStyle: {
        color: "rgba(255,255,255,1)",
      },
    },
    // 图标排名
    dataviewIconRate: {
      nameTextStyle: {
        color: "rgba(255,255,255,0.5)",
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
      fontColor: "rgba(196,252,255,1)",
      contentTextStyle: {
        color: "rgba(196,252,255,1)",
      },
      popoverStyleEffect: "dark",
    },
    dataviewSlideNavMenu: {
      arrowStyle: {
        color: "rgba(196,252,255,1)",
      },
      textStyle: {
        color: "rgba(196,252,255,1)",
      },
    },
    // 时间天气
    dataviewDateTimeWeather: {
      defaultStyle: { color: "rgba(196,252,255,1)" },
    },
    // 单选多选
    dataviewRadioGroup: {
      textColor: "rgba(196,252,255,1)",
      textStyle: {
        color: "rgba(196,252,255,1)",
      },
    },
    // 搜索组件
    dataviewTextSearch: {
      selectTheme: "chunheise",
      color: "rgba(255, 255, 255, 1)",
      borderConfig: {
        border: "1px solid rgba(43, 216, 225, 0.5)",
        commonBorderColor: "rgba(43, 216, 225, 0.5)",
      },
    },
    // 占比条
    dataviewRatioBar: {
      titleTextStyle: {
        color: "rgba(196,252,255,1)",
      },
      barBackgroundColorList: ["rgba(43,216,225,1)", "rgba(32,134,222,1)", "rgba(120,141,241,1)", "rgba(251,117,156,1)", "rgba(231,202,95,1)", "rgba(245,152,121,1)"],
    },
    // 进度池
    dataviewPercentPond: {
      config: {
        colors: ["rgba(43,216,225,1)", "rgba(32,134,222,1)"],
      },
    },
    // 进度条
    dataviewProgressBar: {
      titleTextStyle: {
        color: "rgba(196,252,255,1)",
      },
      subTitleTextStyle: {
        color: "rgba(196,252,255,1)",
      },
    },
    // 多彩圆环
    moreRingColor: {
      titleTextStyle: {
        color: "rgba(43,216,225,1)",
      },
      valueTextStyle: {
        color: "rgba(43,216,225,1)",
      },
      config: {
        bigCircleStrokeArr: [
          ["rgba(43,216,225,0.6)", "rgba(43,216,225,1)", "rgba(43,216,225,0.6)", "rgba(43,216,225,0.4)"],
          ["rgba(32,134,222,0.6)", "rgba(32,134,222,1)", "rgba(32,134,222,0.6)", "rgba(32,134,222,0.4)"],
          ["rgba(120,141,241,0.6)", "rgba(120,141,241,1)", "rgba(120,141,241,0.6)", "rgba(120,141,241,0.4)"],
          ["rgba(251,117,156,0.6)", "rgba(251,117,156,1)", "rgba(251,117,156,0.6)", "rgba(251,117,156,0.4)"],
          ["rgba(231,202,95,0.6)", "rgba(231,202,95,1)", "rgba(231,202,95,0.6)", "rgba(231,202,95,0.4)"],
          ["rgba(245,152,121,0.6)", "rgba(245,152,121,1)", "rgba(245,152,121,0.6)", "rgba(245,152,121,0.4)"],
        ],
        nodeCircleStrokeArr: ["rgba(43,216,225,1)", "rgba(32,134,222,1)", "rgba(120,141,241,1)", "rgba(251,117,156,1)", "rgba(231,202,95,1)", "rgba(245,152,121,1)"],
        linesColors: [
          "linear-gradient(0deg, rgba(43,216,225,1) 0%,rgba(43,216,225,0.5) 100%)",
          "linear-gradient(0deg, rgba(32,134,222,1) 0%,rgba(32,134,222,0.5) 100%)",
          "linear-gradient(0deg, rgba(120,141,241,1) 0%,rgba(120,141,241,0.5) 100%)",
          "linear-gradient(0deg, rgba(251,117,156,1) 0%,rgba(251,117,156,0.5) 100%)",
          "linear-gradient(0deg, rgba(231,202,95,1) 0%,rgba(231,202,95,0.5) 100%)",
          "linear-gradient(0deg, rgba(245,152,121,1) 0%,rgba(245,152,121,0.5) 100%)",
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
        "linear-gradient(90deg, rgba(255, 119, 0, 0) 0%, rgb(251, 117, 156) 99%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(43, 216, 225) 100%)",
        "linear-gradient(90deg, rgba(253, 136, 66, 0) 0%, rgb(32, 134, 222) 100%)",
        "linear-gradient(90deg, rgba(255, 119, 0, 0) 0%, rgb(120, 141, 241) 100%)",
      ],
      indexAttrConfig: {
        fontColors: ["rgba(255,255,255,1)"],
        bgColors: [
          "linear-gradient(90deg, rgb(251, 117, 156) 0%, rgba(255, 119, 0, 0) 100%)",
          "linear-gradient(90deg, rgb(43, 216, 225) 0%, rgba(255, 119, 0, 0) 100%)",
          "linear-gradient(90deg, rgb(32, 134, 222) 0%, rgba(255, 119, 0, 0) 100%)",
          "linear-gradient(90deg, rgb(68, 82, 147) 0%, rgba(255, 119, 0, 0) 100%)",
        ],
      },
      nameTextStyle: {
        color: "rgba(255,255,255,1)",
      },
      valueTextStyle: {
        color: "rgba(43,216,225,1)",
      },
      unitTextStyle: {
        color: "rgba(255,255,255,1)",
      },
    },
  },
  // 公用的属性
  commonConfig: {
    // 系列色(后面的统一使用这种,前面的有时间再改)
    colorList: ["rgba(43,216,225,1)", "rgba(32,134,222,1)", "rgba(120,141,241,1)", "rgba(251,117,156,1)", "rgba(231,202,95,1)", "rgba(245,152,121,1)"],
  },
};
