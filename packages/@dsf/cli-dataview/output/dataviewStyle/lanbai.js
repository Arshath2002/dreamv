/*
 * @Description: 蓝白风格
 * @Author: shenah
 * @Date: 2024-03-15 10:28:06
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-18 10:24:09
 */
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import { createSelectStyleVar } from "_dataview/output/config/select";
import threeTool from "_dataview/output/utils/threeTool.js";
const styleVarConfig = createSelectStyleVar().lanbai;
export default {
  name: "蓝白风格",
  value: "lanbai",
  picture: "",
  style: {
    //gis
    gis: {
      label: {
        itemStyle: {
          backgroundColor: "#1D69C9",
          color: "#FFF",
        },
      },
      theme: {
        AMap: "amap://styles/normal",
        BMap: "",
        MineMap: "11004",
      },
    },
    // 时间轴详情
    dataviewTimeInfo: {
      lineConfig: {
        color: "rgba(199,218,238,1)",
      },
      pointConfig: {
        color: "rgba(29,105,201,1)",
      },
      timeConfigStyle: {
        color: "#333333",
      },
      textContentBorderConfig: {
        commonBorderColor: "rgba(160,192,233,1)",
      },
      contentTextStyle: {
        color: "#999999",
      },
      fieldsStyleRules: {
        color: "#333333",
      },
      textContentBackground: {
        active: "color",
        color: {
          type: "color",
          value: "#DCEEFF",
        },
      },
    },
    // 区域级联
    areaCascader: {
      nameTextStyle: {
        color: "rgba(51,51,51,1)",
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
            image: "/dataview/file/sdk/download?files=d78f561a70644b9fb6e85e2edbe38c1a",
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
            image: "/dataview/file/sdk/download?files=f288d1c6605b407aa1668b03a5720452",
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
          image: "/dataview/file/sdk/download?files=dc1368b041834c56b26c73de7dd2d153",
          size: "100% 100%",
          repeat: "no-repeat",
          position: "center",
        },
      },
      navTextStyle: {
        color: "#476D97",
      },
      clickTextStyle: {
        color: "#0561C3",
      },
      hoverTextStyle: {
        color: "#0561C3",
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
      fontColor: "rgba(51,51,51,1)",
      //页面背景
      backgroundConfig: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "#f4f4f4",
        },
      },
    },
    dialogConfig: {
      background: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "#EAF4FC",
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
          image: "/dataview/file/sdk/download?files=a7b2f20dc60640ebbabe41bea172cde9",
          size: "left 100%",
          repeat: "no-repeat",
          position: ["left", "center"],
        },
      },
      iconPosition: ["auto", "auto", "auto", "auto"],
      relativeStyle: true,
      titleHeight: 40,
      align: "left",
      vectorAlign: "center",
      iconColor: "rgba(153, 153, 153, 1)",
      iconSize: 13,
      padding: ["20", "20", "20", "20"],
      titlePadding: [0, "15", 0, "49"],
      borderWidth: 0,
      borderColor: "rgba(255, 255, 255, 0)",
      borderRadius: 4,
      textStyle: {
        color: "rgba(51, 51, 51, 1)",
        fontFamily: "Alibaba-PuHuiTi-Medium",
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
          value: "#FFFFFF",
        },
      },
      placement: "right",
      relativeStyle: true,
      arrow: {
        show: false,
        size: 10,
      },
      shadowShow: true,
      shadowColor: "rgba(53, 75, 92, 0.1)",
      offsetFormat: 0,
      padding: ["16", "16", "16", "16"],
      borderRadius: 4,
      borderWidth: 0,
      borderColor: "rgba(255, 255, 255, 1)",
    },
    // 选中与未选中的样式
    dataViewSelectStyle: {
      defaultColor: "rgba(102,102,102,0.5)",
      clickColor: "rgba(51,51,51,1)",
    },
    dataViewExport: {
      controlBackgroundConfig: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(29,105,201,1)",
        },
      },
      textStyle: { color: "#FFF" },
    },
    dataviewCircleMenu: {
      defaultBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(255,255,255,0.6) 0%,rgba(50,197,255,1) 100%)",
          value: "#222",
        },
      },
      activeBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(250,100,0,0.6) 0%,rgba(250,100,0,1) 100%)",
  
          value: "#FFD37E",
        },
      },
      borderColor: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg,rgba(50,197,255,0.2) 0%,rgba(50,197,255,1) 100%)",
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
        "linear-gradient(90deg, rgba(29, 105, 201, 0.6) 0%, rgb(29, 105, 201) 100%)",
        "linear-gradient(90deg, rgba(250, 100, 0, 0.6) 0%, rgb(250, 100, 0) 100%)",
        "linear-gradient(90deg, rgba(50, 197, 255, 0.6) 0%, rgb(50, 197, 255) 100%)",
        "linear-gradient(90deg, rgba(255, 173, 56, 0.6) 0%, rgb(255, 173, 56) 100%)",
        "linear-gradient(90deg, rgba(109, 212, 0, 0.6) 0%, rgb(109, 212, 0) 100%)",
        "linear-gradient(90deg, rgba(16, 137, 230, 0.6) 0%, rgb(16, 137, 230) 100%)",
      ],
      titleTextStyle: createCommonTextStyle({
        color: "rgba(51,51,51,1)",
        fontSize: "18",
      }),
      valueTextStyle: createCommonTextStyle({
        color: "rgba(51,51,51,1)",
        fontSize: "18", // 字号
      }),
    },
    //圆环组
    ringGroup: {
      colors: ["rgba(29,105,201,1)", "rgba(250,100,0,1)", "rgba(50,197,255,1)", "rgba(255,173,56,1)", "rgba(109,212,0,1)", "rgba(16,137,230,1)"],
      titleTextStyle: createCommonTextStyle({
        fontSize: 16,
        color: "rgba(51,51,51,1)",
      }),
      valueTextStyle: createCommonTextStyle({
        fontSize: 30,
        color: "rgba(51,51,51,1)",
      }),
      unitTextStyle: createCommonTextStyle({
        fontSize: 14,
        color: "rgba(51,51,51,1)",
      }),
    },
    //面板标题
    dataviewPanelText: {
      backgroundConfig: {
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=a7b2f20dc60640ebbabe41bea172cde9",
          size: "contain",
          repeat: "no-repeat",
          position: "left center",
        },
      },
      titlePadding: [0, 0, 0, 35],
      titleTextStyle: createCommonTextStyle({
        color: "rgba(51,51,51,1)",
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(51,51,51,1)",
        fontSize: "16", // 字号
      }),
    },
    //面板组件
    dataviewPanel: {
      //标题背景
      titleBackgroundConfig: {
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=a7b2f20dc60640ebbabe41bea172cde9",
          size: "contain",
          repeat: "no-repeat",
          position: "left center",
        },
      },
      titlePadding: [0, 0, 0, 35],
      totalBackgroundConfig: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(255,255,255,1)",
        },
      },
      titleTextStyle: createCommonTextStyle({
        color: "rgba(51,51,51,1)",
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(51,51,51,1)",
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
          image: "/dataview/file/sdk/download?files=c5b235bd9b7a427bbfa9aea521f97fbe",
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
        bgColor: "rgba(220,238,255,1)", // 统一的表头背景色
        color: "rgba(51,51,51,1)", // 统一的表头颜色
      },
      newContentConfig: {
        color: "rgba(29,105,201,1)", // 内容颜色
      },
      backgroundColor: "rgba(255,255,255,0)", // 整体的背景色
      indexAttrConfig: {
        bgColors: ["#FFC32B", "#BCC6CA", "#D09160", "rgba(16, 137, 230, 0.7)"],
      },
      selectTheme: "lanbai",
    },
    //下拉框组件
    select: {
      selectTheme: "lanbai",
      borderConfig: {
        commonBorderColor: styleVarConfig["--input-border-color"],
      },
      borderRadius: styleVarConfig["--input-border-radius"],
    },
    //时间范围组件
    timeRange: {
      selectTheme: "baise",
    },
    // 高级查询
    advancedQuery: {
      selectTheme: "baise",
    },
    // 3d 地图
    threeMap: {
      itemStyle: {
        range: {
          color: ["#C6A47E", "#C87013"],
        },
        topColor: "rgba(57, 127, 209, 1)", //面的顶面颜色
        sideColor: "rgba(87, 129, 181, 1)", //侧边颜色
        uColor: "rgba(108, 153, 189, 1)", //侧边动画颜色
      },
      lineStyle: {
        color: "#f4f4f4",
      },
      outLineStyle: {
        color: "rgba(18, 101, 147, 1)",
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
        labelColor: "rgba(51,51,51,1)",
      },
      // 图例
      legend: {
        labelColor: "rgba(51,51,51,1)",
      },
      // 坐标系颜色控制
      axis: {
        labelColor: "rgba(0,0,0,0.45)",
        lineColor: "rgba(0,0,0,0.3)",
      },
      // 地图颜色设置
      map: {
        colors: ["#2390E3"], // 地图区域颜色
        labelColor: "#333333", // 地图文字颜色
        borderColor: "rgba(140,194,235,1)", // 地图边线文字
      },
      // 图形颜色设置
      commonStyle: {
        colors: [
          ["rgba(29,105,201,0.2)", "rgba(29,105,201,0.6)", "rgba(29,105,201,1)"],
          ["rgba(250,100,0,0.2)", "rgba(250,100,0,0.6)", "rgba(250,100,0,1)"],
          ["rgba(50,197,255,0.2)", "rgba(50,197,255,0.6)", "rgba(50,197,255,1)"],
          ["rgba(255,173,56,0.2)", "rgba(255,173,56,0.6)", "rgba(255,173,56,1)"],
          ["rgba(109,212,0,0.2)", "rgba(109,212,0,0.6)", "rgba(109,212,0,1)"],
          ["rgba(16,137,230,0.2)", "rgba(16,137,230,0.6)", "rgba(16,137,230,1)"],
        ],
        labelColor: "rgba(0,0,0,0.45)",
      },
      visualMap: {
        colors: ["#C87013", "#C6A47E"],
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
        nameColor: "rgba(51,51,51,1)", // 名称颜色
        valueColor: "rgba(29,105,201,1)", // 值颜色
        unitColor: "rgba(29,105,201,1)", // 单位颜色
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
        color: "rgba(51,51,51,1)",
      },
      valueTextStyle: {
        color: "rgba(29,105,201,1)",
      },
      unitTextStyle: {
        color: "rgba(29,105,201,1)",
      },
    },
    // 图标排名
    dataviewIconRate: {
      nameTextStyle: {
        color: "rgba(51,51,51,1)",
      },
      valueTextStyle: {
        color: "rgba(29,105,201,1)",
      },
      colors: function (theme) {
        let colors = [...theme.commonConfig.colorList];
        return colors;
      },
    },
    // 输入框
    dataviewTextBox: {
      fontColor: "rgba(51,51,51,1)",
      contentTextStyle: {
        color: "rgba(51,51,51,1)",
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
      defaultStyle: { color: "rgba(51,51,51,1)" },
    },
    // 单选多选
    dataviewRadioGroup: {
      textColor: "rgba(51,51,51,1)",
      textStyle: {
        color: "rgba(51,51,51,1)",
      },
    },
    // 搜索组件
    dataviewTextSearch: {
      selectTheme: "lanbai",
      color: "rgba(51, 51, 51, 1)",
      borderConfig: {
        border: "1px solid rgba(160, 192, 233, 1)",
        commonBorderColor: "rgba(160, 192, 233, 1)",
      },
    },
    // 占比条
    dataviewRatioBar: {
      titleTextStyle: {
        color: "rgba(51,51,51,1)",
      },
      barBackgroundColorList: ["rgba(29,105,201,1)", "rgba(250,100,0,1)", "rgba(50,197,255,1)", "rgba(255,173,56,1)", "rgba(109,212,0,1)", "rgba(16,137,230,1)"],
    },
    // 进度池
    dataviewPercentPond: {
      config: {
        colors: ["rgba(29,105,201,1)", "rgba(250,100,0,1)"],
      },
    },
    // 进度条
    dataviewProgressBar: {
      titleTextStyle: {
        color: "rgba(51,51,51,1)",
      },
      subTitleTextStyle: {
        color: "rgba(51,51,51,1)",
      },
    },
    // 多彩圆环
    moreRingColor: {
      titleTextStyle: {
        color: "rgba(29,105,201,1)",
      },
      valueTextStyle: {
        color: "rgba(29,105,201,1)",
      },
      config: {
        bigCircleStrokeArr: [
          ["rgba(29,105,201,0.6)", "rgba(29,105,201,1)", "rgba(29,105,201,0.6)", "rgba(29,105,201,0.4)"],
          ["rgba(250,100,0,0.6)", "rgba(250,100,0,1)", "rgba(250,100,0,0.6)", "rgba(250,100,0,0.4)"],
          ["rgba(50,197,255,0.6)", "rgba(50,197,255,1)", "rgba(50,197,255,0.6)", "rgba(50,197,255,0.4)"],
          ["rgba(255,173,56,0.6)", "rgba(255,173,56,1)", "rgba(255,173,56,0.6)", "rgba(255,173,56,0.4)"],
          ["rgba(109,212,0,0.6)", "rgba(109,212,0,1)", "rgba(109,212,0,0.6)", "rgba(109,212,0,0.4)"],
          ["rgba(16,137,230,0.6)", "rgba(16,137,230,1)", "rgba(16,137,230,0.6)", "rgba(16,137,230,0.4)"],
        ],
        nodeCircleStrokeArr: ["rgba(29,105,201,1)", "rgba(250,100,0,1)", "rgba(50,197,255,1)", "rgba(255,173,56,1)", "rgba(109,212,0,1)", "rgba(16,137,230,1)"],
        linesColors: [
          "linear-gradient(0deg, rgba(29,105,201,1) 0%,rgba(29,105,201,0.5) 100%)",
          "linear-gradient(0deg, rgba(250,100,0,1) 0%,rgba(250,100,0,0.5) 100%)",
          "linear-gradient(0deg, rgba(50,197,255,1) 0%,rgba(50,197,255,0.5) 100%)",
          "linear-gradient(0deg, rgba(255,173,56,1) 0%,rgba(255,173,56,0.5) 100%)",
          "linear-gradient(0deg, rgba(109,212,0,1) 0%,rgba(109,212,0,0.5) 100%)",
          "linear-gradient(0deg, rgba(16,137,230,1) 0%,rgba(16,137,230,0.5) 100%)",
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
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(29, 105, 201) 100%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(250, 100, 0) 100%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(50, 197, 255) 100%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(255, 173, 56) 100%)",
      ],
      indexAttrConfig: {
        fontColors: ["rgb(78, 91, 102)"],
        bgColors: [
          "linear-gradient(90deg, rgb(29, 105, 201) 0%, rgba(226, 74, 59, 0) 100%)",
          "linear-gradient(90deg, rgb(250, 100, 0) 0%, rgba(255, 119, 0, 0) 100%)",
          "linear-gradient(90deg, rgb(50, 197, 255) 0%, rgba(227, 178, 47, 0) 100%)",
          "linear-gradient(90deg, rgb(255, 173, 56) 0%, rgba(24, 190, 118, 0) 100%)",
        ],
      },
      nameTextStyle: {
        color: "rgb(78, 91, 102)",
      },
      valueTextStyle: {
        color: "rgb(29, 105, 201)",
      },
      unitTextStyle: {
        color: "rgb(78, 91, 102)",
      },
    },
  },
  // 公用的属性
  commonConfig: {
    // 系列色(后面的统一使用这种,前面的有时间再改)
    colorList: ["rgba(29,105,201,1)", "rgba(250,100,0,1)", "rgba(50,197,255,1)", "rgba(255,173,56,1)", "rgba(109,212,0,1)", "rgba(16,137,230,1)"],
  },
};
