/*
 * @Description: 深蓝色风格
 * @Author: shenah
 * @Date: 2023-10-23 17:17:33
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 18:06:13
 */
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import { createSelectStyleVar } from "_dataview/output/config/select";
import threeTool from "_dataview/output/utils/threeTool.js";
const styleVarConfig = createSelectStyleVar().lanse;
export default {
  name: "深蓝风格",
  value: "lanse",
  picture: "",
  style: {
    //gis
    gis: {
      label: {
        itemStyle: {
          backgroundColor: "#3c8ddb",
          color: "#FFF",
        },
      },
      theme: {
        AMap: "amap://styles/darkblue",
        BMap: "dark",
        MineMap: "11003",
      },
    },
    // 时间轴详情
    dataviewTimeInfo: {
      lineConfig: {
        color: "#1DECFF",
      },
      pointConfig: {
        color: "#1DECFF",
      },
      timeConfigStyle: {
        color: "#DCF0FF",
      },
      textContentBorderConfig: {
        commonBorderColor: "#1DECFF",
      },
      contentTextStyle: {
        color: "#DCF0FF",
      },
      fieldsStyleRules: {
        color: "#1DECFF",
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
        color: "rgba(118,153,205,1)",
        borderConfig: {
          commonBorderWidth: 0,
          commonBorderColor: "#077abd",
          commonBorderStyle: "solid",
        },
        $borderRadius: [2, 2, 2, 2],
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
            image: "/dataview/file/sdk/download?files=34a0b4932c24434699e663696c0b6659",
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
        $borderRadius: [2, 2, 2, 2],
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
            image: "/dataview/file/sdk/download?files=b23816ef548f42788b7ab8ae7307a21d",
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
          image: "/dataview/file/sdk/download?files=21a498cc89a141f2b1cae3cea9d63c6f",
          size: "100% 100%",
          repeat: "no-repeat",
          position: "center",
        },
      },
      navTextStyle: {
        color: "#FFFFFF",
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
      pageFontFamily: "Alibaba-PuHuiTi-Regular",
      //页面背景
      backgroundConfig: {
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=25a2e422051a414098d0012d8634dd56",
          size: "100% 100%",
          repeat: "no-repeat",
          position: ["center", "center"],
        },
        color: {
          type: "color",
          image: "",
          value: "rgba(3, 16, 48, 1)",
        },
      },
    },
    dialogConfig: {
      background: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(8, 19, 51, 1)",
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
          image: "/dataview/file/sdk/download?files=9960d25010704530b8b6d731ab761a38",
          size: "auto 100%",
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
      padding: ["15", "20", "20", "20"],
      titlePadding: [0, "20", 0, "34"],
      borderWidth: 1,
      borderColor: "rgba(53, 143, 248, 0.5)",
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
          theme: "main",
          value: "#052E72",
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
      borderColor: "#052E72",
      borderRadius: 4,
      borderWidth: 0,
    },
    // 选中与未选中的样式
    dataViewSelectStyle: {
      defaultColor: "#fff",
      clickColor: "rgba(165, 201, 255,1)",
    },
    dataViewExport: {
      controlBackgroundConfig: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(53,143,248,1)",
        },
      },
      textStyle: { color: "#FFF" },
    },
    dataviewCircleMenu: {
      defaultBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(53,143,248,0.6) 0%,rgba(53,143,248,1) 100%)",
          value: "#222",
        },
      },
      activeBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(62,215,230,0.6) 0%,rgba(62,215,230,1) 100%)",
          value: "#FFD37E",
        },
      },
      borderColor: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(53,143,248,0.2) 0%,rgba(53,143,248,1) 100%)",
          value: "#222",
        },
      },
      textStyle: createCommonTextStyle({ color: "rgba(220,240,255,1)" }),
      activeTextStyle: createCommonTextStyle({ color: "#FFF" }),
    },
    //轮播排名
    scrollRankingBoard: {
      barBackground: "rgba(71, 71, 71, 0.3)",
      colors: [
        "linear-gradient(90deg, rgba(53, 143, 248, 0.6) 0%, rgb(53, 143, 248) 100%)",
        "linear-gradient(90deg, rgba(62, 215, 230, 0.6) 0%, rgb(62, 215, 230) 100%)",
        "linear-gradient(90deg, rgba(91, 214, 149, 0.6) 0%, rgb(91, 214, 149) 100%)",
        "linear-gradient(90deg, rgba(125, 133, 229, 0.6) 0%, rgb(125, 133, 229) 100%)",
        "linear-gradient(90deg, rgba(242, 142, 72, 0.6) 0%, rgb(242, 142, 72) 100%)",
        "linear-gradient(90deg, rgba(255, 195, 43, 0.6) 0%, rgb(255, 195, 43) 100%)",
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
      colors: ["rgba(53,143,248,1)", "rgba(62,215,230,1)", "rgba(91,214,149,1)", "rgba(125,133,229,1)", "rgba(242,142,72,1)", "rgba(255,195,43,1)"],
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
          image: "/dataview/file/sdk/download?files=8f615900e6974d0c94806aaf69d201bf",
          size: "contain",
          repeat: "no-repeat",
          position: "left center",
        },
      },
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
          image: "/dataview/file/sdk/download?files=8f615900e6974d0c94806aaf69d201bf",
          size: "contain",
          repeat: "no-repeat",
          position: "left center",
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
          image: "/dataview/file/sdk/download?files=1c3fa123ba8846a896b90c9dfed0e577",
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
        color: "#FFF", // 统一的表头颜色
      },
      newContentConfig: {
        color: "#FFF", // 统一的表头颜色
      },
      indexAttrConfig: {
        bgColors: ["#F28E48", "#FFC32B", "#358FF8", "#385376"],
      },
      backgroundColor: "rgba(255,255,255,0)", // 整体的背景色
      selectTheme: "lanse",
    },
    //下拉框组件
    select: {
      selectTheme: "lanse",
      borderConfig: {
        commonBorderColor: styleVarConfig["--input-border-color"],
      },
      borderRadius: styleVarConfig["--input-border-radius"],
    },
    //时间范围组件
    timeRange: {
      selectTheme: "lanse",
    },
    // 高级查询
    advancedQuery: {
      selectTheme: "lanse",
    },
    // 3d 地图
    threeMap: {
      itemStyle: {
        range: {
          color: ["#15B3D6", "#0047B3"],
        },
        topColor: "rgba(26, 116, 195, 0.74)", //面的顶面颜色
        sideColor: "rgba(65, 123, 212, 1)", //侧边颜色
        uColor: "rgba(45, 89, 156, 1)", //侧边动画颜色
      },
      label: {
        itemStyle: {
          textStyle: {
            color: "#FFF",
          },
        },
      },
      //线条颜色
      lineStyle: {
        color: "#A5D0ED",
      },
      //轮廓样式
      outLineStyle: {
        color: "rgba(90, 148, 168, 1)",
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
        colors: ["rgba(15, 122, 209, 1)"], // 地图区域颜色
        labelColor: "#fff", // 地图文字颜色
        borderColor: "rgba(255,255,255,1)", // 地图边线文字
      },
      // 图形颜色设置
      commonStyle: {
        colors: [
          ["rgba(53,143,248,0.2)", "rgba(53,143,248,0.6)", "rgba(53,143,248,1)"],
          ["rgba(62,215,230,0.2)", "rgba(62,215,230,0.6)", "rgba(62,215,230,1)"],
          ["rgba(91,214,149,0.2)", "rgba(91,214,149,0.6)", "rgba(91,214,149,1)"],
          ["rgba(125,133,229,0.2)", "rgba(125,133,229,0.6)", "rgba(125,133,229,1)"],
          ["rgba(242,142,72,0.2)", "rgba(242,142,72,0.6)", "rgba(242,142,72,1)"],
          ["rgba(255,195,43,0.2)", "rgba(255,195,43,0.6)", "rgba(255,195,43,1)"],
        ],
        labelColor: "rgba(245,252,255,1)",
      },
      visualMap: {
        colors: ["#C86413", "#C89F8E"],
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
              image: "/dataview/file/sdk/download?files=f2f8398021cd4091a92b9ec7985bf761",
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
        valueColor: "#FFC32B", // 值颜色
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
              image: "/dataview/file/sdk/download?files=f2f8398021cd4091a92b9ec7985bf761",
              size: "100% 100%",
              repeat: "no-repeat",
              position: ["center", "center"],
            },
          },
        },
      ], // 单个背景(里面对象则为背景的通用对象)
      nameTextStyle: {
        color: "#FFF",
      },
      valueTextStyle: {
        color: "#FFC32B",
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
        color: "rgba(220,240,255,1)",
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
      selectTheme: "lanse",
      color: "rgba(255, 255, 255, 1)",
      borderConfig: {
        border: "1px solid rgba(53, 143, 248, 0.5)",
        commonBorderColor: "rgba(53, 143, 248, 0.5)",
      },
    },
    // 占比条
    dataviewRatioBar: {
      titleTextStyle: {
        color: "rgba(255,255,255,1)",
      },
      barBackgroundColorList: ["rgba(53,143,248,1)", "rgba(62,215,230,1)", "rgba(91,214,149,1)", "rgba(125,133,229,1)", "rgba(242,142,72,1)", "rgba(255,195,43,1)"],
    },
    // 进度池
    dataviewPercentPond: {
      config: {
        colors: ["rgba(53,143,248,1)", "rgba(62,215,230,1)"],
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
        color: "rgba(53,143,248,1)",
      },
      valueTextStyle: {
        color: "rgba(53,143,248,1)",
      },
      config: {
        bigCircleStrokeArr: [
          ["rgba(53,143,248,0.6)", "rgba(53,143,248,1)", "rgba(53,143,248,0.6)", "rgba(53,143,248,0.4)"],
          ["rgba(62,215,230,0.6)", "rgba(62,215,230,1)", "rgba(62,215,230,0.6)", "rgba(62,215,230,0.4)"],
          ["rgba(91,214,149,0.6)", "rgba(91,214,149,1)", "rgba(91,214,149,0.6)", "rgba(91,214,149,0.4)"],
          ["rgba(125,133,229,0.6)", "rgba(125,133,229,1)", "rgba(125,133,229,0.6)", "rgba(125,133,229,0.4)"],
          ["rgba(242,142,72,0.6)", "rgba(242,142,72,1)", "rgba(242,142,72,0.6)", "rgba(242,142,72,0.4)"],
          ["rgba(255,195,43,0.6)", "rgba(255,195,43,1)", "rgba(255,195,43,0.6)", "rgba(255,195,43,0.4)"],
        ],
        nodeCircleStrokeArr: ["rgba(53,143,248,1)", "rgba(62,215,230,1)", "rgba(91,214,149,1)", "rgba(125,133,229,1)", "rgba(242,142,72,1)", "rgba(255,195,43,1)"],
        linesColors: [
          "linear-gradient(0deg, rgba(53,143,248,1) 0%,rgba(53,143,248,0.5) 100%)",
          "linear-gradient(0deg, rgba(62,215,230,1) 0%,rgba(62,215,230,0.5) 100%)",
          "linear-gradient(0deg, rgba(91,214,149,1) 0%,rgba(91,214,149,0.5) 100%)",
          "linear-gradient(0deg, rgba(125,133,229,1) 0%,rgba(125,133,229,0.5) 100%)",
          "linear-gradient(0deg, rgba(242,142,72,1) 0%,rgba(242,142,72,0.5) 100%)",
          "linear-gradient(0deg, rgba(255,195,43,1) 0%,rgba(255,195,43,0.5) 100%)",
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
        "linear-gradient(90deg, rgba(255, 119, 0, 0) 0%, rgb(255, 119, 0) 67%)",
        "linear-gradient(90deg, rgba(227, 178, 47, 0) 0%, rgb(227, 178, 47) 67%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(53, 143, 248) 67%)",
        "linear-gradient(90deg, rgb(3, 82, 147) 0%, rgb(125, 133, 229) 100%)",
      ],
      indexAttrConfig: {
        fontColors: ["rgba(220,240,255,1)"],
        bgColors: [
          "linear-gradient(90deg, rgb(255, 119, 0) 0%, rgba(226, 74, 59, 0) 100%)",
          "linear-gradient(90deg, rgb(227, 178, 47) 0%, rgba(255, 119, 0, 0) 100%)",
          "linear-gradient(90deg, rgb(25, 131, 216) 0%, rgba(227, 178, 47, 0) 99%)",
          "linear-gradient(90deg, rgb(8, 73, 126) 0%, rgba(0, 0, 0, 0) 100%)",
        ],
      },
      nameTextStyle: {
        color: "#FFF",
      },
      valueTextStyle: {
        color: "#FFC32B",
      },
      unitTextStyle: {
        color: "#FFF",
      },
    },
  },
  // 公用的属性
  commonConfig: {
    // 系列色(后面的统一使用这种,前面的有时间再改)
    colorList: ["rgba(53,143,248,1)", "rgba(62,215,230,1)", "rgba(91,214,149,1)", "rgba(125,133,229,1)", "rgba(242,142,72,1)", "rgba(255,195,43,1)"],
  },
};
