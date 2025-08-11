/*
 * @Description: 紫色风格
 * @Author: shenah
 * @Date: 2024-03-15 10:28:06
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 18:44:53
 */
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import { createSelectStyleVar } from "_dataview/output/config/select";
import threeTool from "_dataview/output/utils/threeTool.js";
const styleVarConfig = createSelectStyleVar().zise;
export default {
  name: "紫色风格",
  value: "zise",
  picture: "",
  style: {
    //gis
    gis: {
      label: {
        itemStyle: {
          backgroundColor: "#9776FF",
          color: "#FFF",
        },
      },
      theme: {
        AMap: "amap://styles/whitesmoke",
        BMap: "",
        MineMap: "11004",
      },
    },
    // 时间轴详情
    dataviewTimeInfo: {
      lineConfig: {
        color: "rgba(89,112,225,1)",
      },
      pointConfig: {
        color: "rgba(89,112,225,1)",
      },
      timeConfigStyle: {
        color: "rgba(92,115,229,1)",
      },
      textContentBorderConfig: {
        commonBorderColor: "rgba(70,98,233,1)",
      },
      contentTextStyle: {
        color: "rgba(255,255,255,1)",
      },
      fieldsStyleRules: {
        color: "rgba(92,115,229,1)",
      },
      textContentBackground: {
        active: "color",
        color: {
          type: "color",
          value: "rgba(10,29,175,0.16)",
        },
      },
    },
    // 区域级联
    areaCascader: {
      nameTextStyle: {
        color: "rgba(77,57,238,1)",
      },
    },
    // 选项卡
    dataviewNavTab: {
      //未选中
      noSelectStyle: {
        color: "rgba(96,98,102,1)",
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
            image: "/dataview/file/sdk/download?files=eb1945cfb7f547849d850f90f68887f0",
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
            image: "/dataview/file/sdk/download?files=b74ffe765e7e4656bb34b8977c129314",
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
          image: "/dataview/file/sdk/download?files=3d78d5698fe14fcab0db7552bca695e5",
          size: "100% 100%",
          repeat: "no-repeat",
          position: "center",
        },
      },
      navTextStyle: {
        color: "#4E2EE7",
      },
      clickTextStyle: {
        color: "#4E2EE7",
      },
      hoverTextStyle: {
        color: "#4E2EE7",
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
          value: "rgba(241, 242, 244, 1)",
        },
      },
      subNavTextStyle: {
        color: "rgba(51, 51, 51, 1)",
      },
      subHoverTextStyle: {
        color: "rgba(51, 51, 51, 1)",
      },
    },
    //页面
    dataviewPage: {
      //字体颜色
      fontColor: "rgba(90,216,166,1)",
      //页面背景
      backgroundConfig: {
        active: "color",

        color: {
          type: "color",
          image: "",
          value: "#e3e8fe",
        },
      },
    },
    dialogConfig: {
      background: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(226, 227, 255, 1)",
        },
      },
      titleBackground: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(255, 255, 255, 1)",
        },
      },
      iconPosition: ["auto", "auto", "auto", "auto"],
      relativeStyle: true,
      titleHeight: 40,
      align: "left",
      vectorAlign: "center",
      iconColor: "rgba(92, 115, 229, 1)",
      iconSize: 13,
      padding: ["20", "20", "20", "20"],
      titlePadding: [0, "20", 0, "20"],
      borderWidth: 1,
      borderColor: "rgba(70, 98, 233, 1)",
      borderRadius: 4,
      textStyle: {
        color: "rgb(92, 115, 229)",
        fontWeight: "bold",
        fontFamily: "Alibaba-PuHuiTi-Regular",
        fontSize: "20",
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
          value: "rgba(239, 244, 255, 0.96)",
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
      borderColor: "rgba(239, 244, 255, 1)",
    },
    // 选中与未选中的样式
    dataViewSelectStyle: {
      defaultColor: "rgba(78,46,231,0.5)",
      clickColor: "rgba(78,46,231,1)",
    },
    dataViewExport: {
      controlBackgroundConfig: {
        active: "color",
        color: {
          type: "color",
          image: "",
          isTheme: false,
          theme: "",
          value: "rgba(92,115,229,1)",
        },
      },
      textStyle: { color: "#FFF" },
    },
    dataviewCircleMenu: {
      defaultBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(151,118,255,0.2) 0%,rgba(151,118,255,1) 100%)",
          value: "#222",
        },
      },
      activeBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(124,169,249,0.6) 0%,rgba(124,169,249,1) 100%)",
          value: "#FFD37E",
        },
      },
      borderColor: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(90,216,166,1) 0%,rgba(151,118,255,0.8) 100%)",
          value: "#222",
        },
      },
      textStyle: createCommonTextStyle({ color: "rgb(92, 115, 229)" }),
      activeTextStyle: createCommonTextStyle({ color: "#FFF" }),
    },
    //轮播排名
    scrollRankingBoard: {
      barBackground: "rgba(71, 71, 71, 0.3)",
      colors: [
        "linear-gradient(90deg, rgba(92, 115, 229, 0.6) 0%, rgb(92, 115, 229) 100%)",
        "linear-gradient(90deg, rgba(68, 126, 245, 0.6) 0%, rgb(68, 126, 245) 100%)",
        "linear-gradient(90deg, rgba(151, 118, 255, 0.6) 0%, rgb(151, 118, 255) 100%)",
        "linear-gradient(90deg, rgba(255, 130, 95, 0.6) 0%, rgb(255, 130, 95) 100%)",
        "linear-gradient(90deg, rgba(90, 216, 166, 0.6) 0%, rgb(90, 216, 166) 100%)",
        "linear-gradient(90deg, rgba(255, 166, 141, 0.6) 0%, rgb(255, 166, 141) 100%)",
      ],
      titleTextStyle: createCommonTextStyle({
        color: "rgba(92,115,229,1)",
        fontSize: "18",
      }),
      valueTextStyle: createCommonTextStyle({
        color: "rgba(92,115,229,1)",
        fontSize: "18", // 字号
      }),
    },
    //圆环组
    ringGroup: {
      colors: ["rgba(92,115,229,1)", "rgba(68,126,245,1)", "rgba(151,118,255,1)", "rgba(255,130,95,1)", "rgba(90,216,166,1)", "rgba(255,166,141,1)"],
      titleTextStyle: createCommonTextStyle({
        fontSize: 16,
        color: "rgba(92,115,229,1)",
      }),
      valueTextStyle: createCommonTextStyle({
        fontSize: 30,
        color: "rgba(92,115,229,1)",
      }),
      unitTextStyle: createCommonTextStyle({
        fontSize: 14,
        color: "rgba(92,115,229,1)",
      }),
    },
    //面板标题
    dataviewPanelText: {
      backgroundConfig: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(255, 255, 255,0)",
        },
      },
      titlePadding: [0, 0, 0, 20],
      titleTextStyle: createCommonTextStyle({
        color: "rgba(92,115,229,1)",
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(92,115,229,1)",
        fontSize: "16", // 字号
      }),
    },
    //面板组件
    dataviewPanel: {
      //标题背景
      titleBackgroundConfig: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(255, 255, 255,0)",
        },
      },
      titlePadding: [0, 0, 0, 20],
      totalBackgroundConfig: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(255,255,255,1)",
        },
      },
      titleTextStyle: createCommonTextStyle({
        color: "rgba(92,115,229,1)",
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(92,115,229,1)",
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
          image: "/dataview/file/sdk/download?files=e2439d4fe52b441eaa379b94075f2582",
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
        color: "#FBFBFB",
        fontSize: "46", // 字号
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(193,189,255,1)",
        fontSize: "16", // 字号
      }),
      //边框颜色
      borderColor: "#FFDC4C",
    },
    //表格组件
    dataviewTable: {
      newHeaderConfig: {
        bgColor: "#E0EAFF", // 统一的表头背景色
        color: "#5C73E5", // 统一的表头颜色
      },
      newContentConfig: {
        color: "#6C6C6C", // 内容颜色
      },
      backgroundColor: "rgba(90,216,166,0)", // 整体的背景色
      indexAttrConfig: {
        bgColors: ["#3AB98F", "#825DD2", "#447AEA", "#B3BCE6"],
      },
      selectTheme: "zise",
    },
    //下拉框组件
    select: {
      selectTheme: "zise",
      borderConfig: {
        commonBorderColor: styleVarConfig["--input-border-color"],
      },
      borderRadius: styleVarConfig["--input-border-radius"],
    },
    //时间范围组件
    timeRange: {
      selectTheme: "zise",
    },
    // 高级查询
    advancedQuery: {
      selectTheme: "zise",
    },
    // 3d 地图
    threeMap: {
      itemStyle: {
        range: {
          color: ["#F4F6FF", "#5C73E5"],
        },
        topColor: "rgba(182, 190, 244, 1)", //面的顶面颜色
        sideColor: "#5C73E5", //侧边颜色
        uColor: "#959EE8", //侧边动画颜色
      },
      lineStyle: {
        color: "#3B7276",
      },
      outLineStyle: {
        color: "#104EDF",
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
        labelColor: "rgba(109,127,214,1)",
      },
      // 图例
      legend: {
        labelColor: "rgba(109,127,214,1)",
      },
      // 坐标系颜色控制
      axis: {
        labelColor: "rgba(109,127,214,1)",
        lineColor: "rgba(68,126,245,0.3)",
      },
      // 地图颜色设置
      map: {
        colors: ["rgba(206, 211, 252, 1)"], // 地图区域颜色
        labelColor: "rgba(51,51,51,1)", // 地图文字颜色
        borderColor: "rgba(90,216,166,1)", // 地图边线文字
      },
      // 图形颜色设置
      commonStyle: {
        colors: [
          ["rgba(92,115,229,0.2)", "rgba(92,115,229,0.6)", "rgba(92,115,229,1)"],
          ["rgba(68,126,245,0.2)", "rgba(68,126,245,0.6)", "rgba(68,126,245,1)"],
          ["rgba(151,118,255,0.2)", "rgba(151,118,255,0.6)", "rgba(151,118,255,1)"],
          ["rgba(255,130,95,0.2)", "rgba(255,130,95,0.6)", "rgba(255,130,95,1)"],
          ["rgba(90,216,166,0.2)", "rgba(90,216,166,0.6)", "rgba(90,216,166,1)"],
          ["rgba(255,166,141,0.2)", "rgba(255,166,141,0.6)", "rgba(255,166,141,1)"],
        ],
        labelColor: "rgba(109,127,214,1)",
      },
      visualMap: {
        colors: ["#662FF7", "#BBB0F4"],
        textStyle: {
          color: "#333",
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
              image: "/dataview/file/sdk/download?files=f003af3e29fd460e81c0cd39629bc9a8",
              size: "100% 100%",
              repeat: "no-repeat",
              position: ["center", "center"],
            },
          },
        },
      ], // 单个背景(里面对象则为背景的通用对象)
      attachObj: {
        // 统一
        nameColor: "#6D7FD6", // 名称颜色
        valueColor: "#3AB98F", // 值颜色
        unitColor: "#6D7FD6", // 单位颜色
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
              image: "/dataview/file/sdk/download?files=f003af3e29fd460e81c0cd39629bc9a8",
              size: "100% 100%",
              repeat: "no-repeat",
              position: ["center", "center"],
            },
          },
        },
      ], // 单个背景(里面对象则为背景的通用对象)
      nameTextStyle: {
        color: "#6D7FD6",
      },
      valueTextStyle: {
        color: "#3AB98F",
      },
      unitTextStyle: {
        color: "#6D7FD6",
      },
    },
    // 图标排名
    dataviewIconRate: {
      nameTextStyle: {
        color: "rgba(90,216,166,1)",
      },
      valueTextStyle: {
        color: "rgba(77,57,238,1)",
      },
      colors: function (theme) {
        let colors = [...theme.commonConfig.colorList];
        return colors;
      },
    },
    // 输入框
    dataviewTextBox: {
      fontColor: "rgba(92,115,229,1)",
      contentTextStyle: {
        color: "rgba(92,115,229,1)",
      },
      popoverStyleEffect: "light",
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
      defaultStyle: { color: "rgba(92,115,229,1)" },
    },
    // 单选多选
    dataviewRadioGroup: {
      textColor: "rgba(92,115,229,1)",
      textStyle: {
        color: "rgba(92,115,229,1)",
      },
    },
    // 搜索组件
    dataviewTextSearch: {
      selectTheme: "zise",
      color: "rgba(70,98,233,1)",
      borderConfig: {
        border: "1px solid rgba(70,98,233,1)",
        commonBorderColor: "rgba(70,98,233,1)",
      },
    },
    // 占比条
    dataviewRatioBar: {
      titleTextStyle: {
        color: "rgba(92,115,229,1)",
      },
      barBackgroundColorList: ["rgba(92,115,229,1)", "rgba(68,126,245,1)", "rgba(151,118,255,1)", "rgba(255,130,95,1)", "rgba(90,216,166,1)", "rgba(255,166,141,1)"],
    },
    // 进度池
    dataviewPercentPond: {
      config: {
        colors: ["rgba(92,115,229,1)", "rgba(68,126,245,1)"],
      },
    },
    // 进度条
    dataviewProgressBar: {
      titleTextStyle: {
        color: "rgba(92,115,229,1)",
      },
      subTitleTextStyle: {
        color: "rgba(92,115,229,1)",
      },
    },
    // 多彩圆环
    moreRingColor: {
      titleTextStyle: {
        color: "rgba(92,115,229,1)",
      },
      valueTextStyle: {
        color: "rgba(92,115,229,1)",
      },
      config: {
        bigCircleStrokeArr: [
          ["rgba(92,115,229,0.6)", "rgba(92,115,229,1)", "rgba(92,115,229,0.6)", "rgba(92,115,229,0.4)"],
          ["rgba(68,126,245,0.6)", "rgba(68,126,245,1)", "rgba(68,126,245,0.6)", "rgba(68,126,245,0.4)"],
          ["rgba(151,118,255,0.6)", "rgba(151,118,255,1)", "rgba(151,118,255,0.6)", "rgba(151,118,255,0.4)"],
          ["rgba(255,130,95,0.6)", "rgba(255,130,95,1)", "rgba(255,130,95,0.6)", "rgba(255,130,95,0.4)"],
          ["rgba(90,216,166,0.6)", "rgba(90,216,166,1)", "rgba(90,216,166,0.6)", "rgba(90,216,166,0.4)"],
          ["rgba(255,166,141,0.6)", "rgba(255,166,141,1)", "rgba(255,166,141,0.6)", "rgba(255,166,141,0.4)"],
        ],
        nodeCircleStrokeArr: ["rgba(92,115,229,1)", "rgba(68,126,245,1)", "rgba(151,118,255,1)", "rgba(255,130,95,1)", "rgba(90,216,166,1)", "rgba(255,166,141,1)"],
        linesColors: [
          "linear-gradient(0deg, rgba(92,115,229,1) 0%,rgba(92,115,229,0.5) 100%)",
          "linear-gradient(0deg, rgba(68,126,245,1) 0%,rgba(68,126,245,0.5) 100%)",
          "linear-gradient(0deg, rgba(151,118,255,1) 0%,rgba(151,118,255,0.5) 100%)",
          "linear-gradient(0deg, rgba(255,130,95,1) 0%,rgba(255,130,95,0.5) 100%)",
          "linear-gradient(0deg, rgba(90,216,166,1) 0%,rgba(90,216,166,0.5) 100%)",
          "linear-gradient(0deg, rgba(255,166,141,1) 0%,rgba(255,166,141,0.5) 100%)",
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
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(92, 115, 229) 100%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(68, 126, 245) 100%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(151, 118, 255) 100%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(198, 198, 198) 100%)",
      ],
      indexAttrConfig: {
        fontColors: ["rgb(70, 98, 231)"],
        bgColors: [
          "linear-gradient(90deg, rgb(92, 115, 229) 0%, rgba(226, 74, 59, 0) 100%)",
          "linear-gradient(90deg, rgb(68, 126, 245) 0%, rgba(255, 119, 0, 0) 100%)",
          "linear-gradient(90deg, rgb(151, 118, 255) 0%, rgba(227, 178, 47, 0) 100%)",
          "linear-gradient(90deg, rgb(206, 204, 204) 0%, rgba(24, 190, 118, 0) 100%)",
        ],
      },
      nameTextStyle: {
        color: "rgb(120, 141, 241)",
      },
      valueTextStyle: {
        color: "rgb(58, 185, 143)",
      },
      unitTextStyle: {
        color: "rgb(120, 141, 241)",
      },
    },
  },
  // 公用的属性
  commonConfig: {
    // 系列色(后面的统一使用这种,前面的有时间再改)
    colorList: ["rgba(92,115,229,1)", "rgba(68,126,245,1)", "rgba(151,118,255,1)", "rgba(255,130,95,1)", "rgba(90,216,166,1)", "rgba(255,166,141,1)"],
  },
};
