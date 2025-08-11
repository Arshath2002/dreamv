/*
 * @Description: 青黑色风格
 * @Author: shenah
 * @Date: 2024-03-15 11:07:22
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 18:10:59
 */
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import { createSelectStyleVar } from "_dataview/output/config/select";
import threeTool from "_dataview/output/utils/threeTool.js";
const styleVarConfig = createSelectStyleVar().qingheise;
export default {
  name: "青黑色风格",
  value: "qingheise",
  picture: "",
  style: {
    //gis
    gis: {
      label: {
        itemStyle: {
          backgroundColor: "#1AE9C6",
          color: "#FFF",
        },
      },
      theme: {
        AMap: "amap://styles/fresh",
        BMap: "dark",
        MineMap: "11003",
      },
    },
    // 时间轴详情
    dataviewTimeInfo: {
      lineConfig: {
        color: "#1AE9C6",
      },
      pointConfig: {
        color: "#1AE9C6",
      },
      timeConfigStyle: {
        color: "#1AE9C6",
      },
      textContentBorderConfig: {
        commonBorderColor: "transparent",
      },
      contentTextStyle: {
        color: "rgba(255,255,255,0.5)",
      },
      fieldsStyleRules: {
        color: "rgba(255,255,255,1)",
      },
      textContentBackground: {
        active: "color",
        color: {
          type: "color",
          value: "rgba(26,233,198,0.12)",
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
            image: "/dataview/file/sdk/download?files=d12e1e0096ef414c969004163ff50a2e",
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
            value: "",
          },
          pattern: {
            image: "/dataview/file/sdk/download?files=436684a8650d4643b8056cb837d62f8b",
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
          image: "",
          value: "transparent",
        },
      },
      // 菜单点击背景
      clickBackgroundConfig: {
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=a0c5cde0b4e04897a1f121486dafd089",
          size: "100% 100%",
          repeat: "no-repeat",
          position: "center",
        },
      },
      navTextStyle: {
        color: "#DCF0FF",
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
      backgroundConfig: {
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=37ddcb2a85764df5b7d475e967fd96d1",
          size: "100% 100%",
          repeat: "no-repeat",
          position: ["center", "center"],
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
          image: "/dataview/file/sdk/download?files=fbcd1648e23548aeb9589d1bde63ddc7",
          size: "contain",
          repeat: "no-repeat",
          position: ["left", "center"],
        },
      },
      iconPosition: ["auto", "auto", "auto", "auto"],
      relativeStyle: true,
      titleHeight: 40,
      align: "left",
      vectorAlign: "center",
      iconColor: "rgba(255, 255, 255, 1)",
      iconSize: 13,
      padding: ["20", "20", "20", "20"],
      titlePadding: [0, "20", 0, "34"],
      borderWidth: 1,
      borderColor: "rgba(26, 233, 198, 0.5)",
      borderRadius: 0,
      textStyle: {
        color: "rgba(255, 255, 255, 1)",
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
          value: "#00241B",
        },
      },
      placement: "right",
      relativeStyle: true,
      arrow: {
        show: false,
        size: 10,
      },
      shadowShow: true,
      shadowColor: "rgba(3, 255, 213, 0.8)",
      offsetFormat: 0,
      padding: ["16", "16", "16", "16"],
      borderRadius: 4,
      borderWidth: 0,
      borderColor: "rgba(0, 36, 27, 1)",
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
          value: "rgba(26,233,198,1)",
        },
      },
      textStyle: { color: "#FFF" },
    },
    dataviewCircleMenu: {
      defaultBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(26,233,198,0.6) 0%,rgba(26,233,198,1) 100%)",
          value: "#222",
        },
      },
      activeBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(238,188,16,0.6) 0%,rgba(238,188,16,1) 100%)",
          value: "#FFD37E",
        },
      },
      borderColor: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(26,233,198,0.2) 0%,rgba(26,233,198,1) 100%)",
          value: "#222",
        },
      },
      textStyle: createCommonTextStyle({ color: "rgba(255,255,255,0.7)" }),
      activeTextStyle: createCommonTextStyle({ color: "#FFF" }),
    },
    //轮播排名
    scrollRankingBoard: {
      barBackground: "rgba(71, 71, 71, 0.3)",
      colors: [
        "linear-gradient(90deg, rgba(26, 233, 198, 0.6) 0%, rgb(26, 233, 198) 100%)",
        "linear-gradient(90deg, rgba(238, 188, 16, 0.6) 0%, rgb(238, 188, 16) 100%)",
        "linear-gradient(90deg, rgba(14, 113, 228, 0.6) 0%, rgb(14, 113, 228) 100%)",
        "linear-gradient(90deg, rgba(213, 252, 241, 0.6) 0%, rgb(213, 252, 241) 100%)",
        "linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0%, rgb(255, 255, 255) 100%)",
        "linear-gradient(90deg, rgba(220, 240, 255, 0.6) 0%, rgb(220, 240, 255) 100%)",
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
      colors: ["rgba(26,233,198,1)", "rgba(238,188,16,1)", "rgba(14,113,228,1)", "rgba(213,252,241,1)", "rgba(255,255,255,1)", "rgba(220,240,255,1)"],
      titleTextStyle: createCommonTextStyle({
        fontSize: 16,
        color: "rgba(255, 255, 255,1)",
      }),
      valueTextStyle: createCommonTextStyle({
        fontSize: 30,
        color: "rgba(255, 255, 255,1)",
      }),
      unitTextStyle: createCommonTextStyle({
        fontSize: 14,
        color: "rgba(255, 255, 255,1)",
      }),
    },
    //面板标题
    dataviewPanelText: {
      backgroundConfig: {
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=fbcd1648e23548aeb9589d1bde63ddc7",
          size: "contain",
          repeat: "no-repeat",
          position: "left center",
        },
      },
      titlePadding: [0, 0, 0, 20],
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
          image: "/dataview/file/sdk/download?files=fbcd1648e23548aeb9589d1bde63ddc7",
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
        imageType: "title",
        pattern: {
          image: "/dataview/file/sdk/download?files=af418d1d75b14542a53166184e069e8e",
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
        color: "rgba(255,255,255,1)",
        fontSize: "46", // 字号
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(255,255,255,1)",
        fontSize: "16", // 字号
      }),
      //边框颜色
      borderColor: "#FFDC4C",
    },
    //表格组件
    dataviewTable: {
      newHeaderConfig: {
        bgColor: "rgba(26,233,198,0.14)", // 统一的表头背景色
        color: "rgba(255,255,255,0.5)", // 统一的表头颜色
      },
      newContentConfig: {
        color: "rgba(255,255,255,1)", // 内容颜色
      },
      indexAttrConfig: {
        bgColors: ["#385376", "#385376", "#385376", "#385376"],
      },
      backgroundColor: "rgba(255,255,255,0)", // 整体的背景色
      selectTheme: "qingheise",
    },
    //下拉框组件
    select: {
      selectTheme: "qingheise",
      borderConfig: {
        commonBorderColor: styleVarConfig["--input-border-color"],
      },
      borderRadius: styleVarConfig["--input-border-radius"],
    },
    //时间范围组件
    timeRange: {
      selectTheme: "qingheise",
    },
    // 高级查询
    advancedQuery: {
      selectTheme: "qingheise",
    },
    // 3d 地图
    threeMap: {
      itemStyle: {
        range: {
          color: ["#4CAF50", "#072E26"],
        },
        topColor: "rgba(1, 118, 95, 0.72)", //面的顶面颜色
        sideColor: "#2E7D32", //侧边颜色
        uColor: "rgba(91, 142, 92, 1)", //侧边动画颜色
      },
      lineStyle: {
        color: "rgba(196, 196, 196, 1)",
      },
      outLineStyle: {
        color: "rgba(21, 87, 24, 1)",
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
        labelColor: "rgba(220,240,255,1)",
        lineColor: "rgba(220,240,255,0.3)",
      },
      // 地图颜色设置
      map: {
        colors: ["rgba(1, 118, 95, 1)"], // 地图区域颜色
        labelColor: "#fff", // 地图文字颜色
        borderColor: "rgba(63,255,220,0.47)", // 地图边线文字
      },
      // 图形颜色设置
      commonStyle: {
        colors: [
          ["rgba(26,233,198,0.2)", "rgba(26,233,198,0.6)", "rgba(26,233,198,1)"],
          ["rgba(238,188,16,0.2)", "rgba(238,188,16,0.6)", "rgba(238,188,16,1)"],
          ["rgba(14,113,228,0.2)", "rgba(14,113,228,0.6)", "rgba(14,113,228,1)"],
          ["rgba(213,252,241,0.2)", "rgba(213,252,241,0.6)", "rgba(213,252,241,1)"],
          ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.6)", "rgba(255,255,255,1)"],
          ["rgba(220,240,255,0.2)", "rgba(220,240,255,0.6)", "rgba(220,240,255,1)"],
        ],
        labelColor: "rgba(220,240,255,1)",
      },
      visualMap: {
        colors: ["#6C6C35", "#765F42"],
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
              image: "/dataview/file/sdk/download?files=c52e8af17e114c298ff0492c1e70dfb4",
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
        valueColor: "#FFF", // 值颜色
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
              image: "/dataview/file/sdk/download?files=c52e8af17e114c298ff0492c1e70dfb4",
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
        color: "#FFF",
      },
      unitTextStyle: {
        color: "#FFF",
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
      fontColor: "rgba(255,255,255,1)",
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
      defaultStyle: { color: "rgba(255,255,255,1)" },
    },
    // 单选多选
    dataviewRadioGroup: {
      textColor: "rgba(255,255,255,1)",
      textStyle: {
        color: "rgba(255,255,255,1)",
      },
    },
    // 搜索组件
    dataviewTextSearch: {
      selectTheme: "qingheise",
      color: "rgba(255, 255, 255, 1)",
      borderConfig: {
        border: "1px solid rgba(26, 233, 198, 0.5)",
        commonBorderColor: "rgba(26, 233, 198, 0.5)",
      },
    },
    // 占比条
    dataviewRatioBar: {
      titleTextStyle: {
        color: "rgba(255,255,255,1)",
      },
      barBackgroundColorList: ["rgba(26,233,198,1)", "rgba(238,188,16,1)", "rgba(14,113,228,1)", "rgba(213,252,241,1)", "rgba(255,255,255,1)", "rgba(220,240,255,1)"],
    },
    // 进度池
    dataviewPercentPond: {
      config: {
        colors: ["rgba(26,233,198,1)", "rgba(238,188,16,1)"],
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
        color: "rgba(26,233,198,1)",
      },
      valueTextStyle: {
        color: "rgba(26,233,198,1)",
      },
      config: {
        bigCircleStrokeArr: [
          ["rgba(26,233,198,0.6)", "rgba(26,233,198,1)", "rgba(26,233,198,0.6)", "rgba(26,233,198,0.4)"],
          ["rgba(238,188,16,0.6)", "rgba(238,188,16,1)", "rgba(238,188,16,0.6)", "rgba(238,188,16,0.4)"],
          ["rgba(14,113,228,0.6)", "rgba(14,113,228,1)", "rgba(14,113,228,0.6)", "rgba(14,113,228,0.4)"],
          ["rgba(213,252,241,0.6)", "rgba(213,252,241,1)", "rgba(213,252,241,0.6)", "rgba(213,252,241,0.4)"],
          ["rgba(255,255,255,0.6)", "rgba(255,255,255,1)", "rgba(255,255,255,0.6)", "rgba(255,255,255,0.4)"],
          ["rgba(220,240,255,0.6)", "rgba(220,240,255,1)", "rgba(220,240,255,0.6)", "rgba(220,240,255,0.4)"],
        ],
        nodeCircleStrokeArr: ["rgba(26,233,198,1)", "rgba(238,188,16,1)", "rgba(14,113,228,1)", "rgba(213,252,241,1)", "rgba(255,255,255,1)", "rgba(220,240,255,1)"],
        linesColors: [
          "linear-gradient(0deg, rgba(26,233,198,1) 0%,rgba(26,233,198,0.5) 100%)",
          "linear-gradient(0deg, rgba(238,188,16,1) 0%,rgba(238,188,16,0.5) 100%)",
          "linear-gradient(0deg, rgba(14,113,228,1) 0%,rgba(14,113,228,0.5) 100%)",
          "linear-gradient(0deg, rgba(213,252,241,1) 0%,rgba(213,252,241,0.5) 100%)",
          "linear-gradient(0deg, rgba(255,255,255,1) 0%,rgba(255,255,255,0.5) 100%)",
          "linear-gradient(0deg, rgba(220,240,255,1) 0%,rgba(220,240,255,0.5) 100%)",
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
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(26, 233, 198) 100%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(238, 188, 16) 100%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(14, 113, 228) 100%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(213, 252, 241) 100%)",
      ],
      indexAttrConfig: {
        fontColors: ["rgba(255,255,255,1)"],
        bgColors: [
          "linear-gradient(90deg, rgb(26, 233, 198) 0%, rgba(226, 74, 59, 0) 100%)",
          "linear-gradient(90deg, rgb(238, 188, 16) 0%, rgba(255, 119, 0, 0) 100%)",
          "linear-gradient(90deg, rgb(14, 113, 228) 0%, rgba(227, 178, 47, 0) 100%)",
          "linear-gradient(90deg, rgb(99, 123, 116) 0%, rgba(24, 190, 118, 0) 100%)",
        ],
      },
      nameTextStyle: {
        color: "rgba(255,255,255,1)",
      },
      valueTextStyle: {
        color: "rgba(26,233,198,1)",
      },
      unitTextStyle: {
        color: "rgba(255,255,255,1)",
      },
    },
  },
  // 公用的属性
  commonConfig: {
    // 系列色(后面的统一使用这种,前面的有时间再改)
    colorList: ["rgba(26,233,198,1)", "rgba(238,188,16,1)", "rgba(14,113,228,1)", "rgba(213,252,241,1)", "rgba(255,255,255,1)", "rgba(220,240,255,1)"],
  },
};
