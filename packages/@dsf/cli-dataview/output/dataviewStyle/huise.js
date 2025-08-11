/*
 * @Description: 灰色风格
 * @Author: shenah
 * @Date: 2024-03-15 11:07:22
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 18:21:05
 */

import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import { createSelectStyleVar } from "_dataview/output/config/select";
import threeTool from "_dataview/output/utils/threeTool.js";
const styleVarConfig = createSelectStyleVar().huise;
export default {
  name: "灰色风格",
  value: "huise",
  picture: "",
  style: {
    //gis
    gis: {
      label: {
        itemStyle: {
          backgroundColor: "#4B5F89",
          color: "#FFF",
        },
      },
      theme: {
        AMap: "amap://styles/grey",
        BMap: "dark",
        MineMap: "11003",
      },
    },

    // 时间轴详情
    dataviewTimeInfo: {
      lineConfig: {
        color: "#99ADCD",
      },
      pointConfig: {
        color: "#99ADCD",
      },
      timeConfigStyle: {
        color: "#DCF0FF",
      },
      textContentBorderConfig: {
        commonBorderColor: "#C7D5EF",
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
          value: "#1D2539",
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
            image: "/dataview/file/sdk/download?files=7c6437b57ffb41c09bcd94d48df1f8b7",
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
            image: "/dataview/file/sdk/download?files=747958ee2b874e14a3eebf7b6e707a9a",
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
          image: "/dataview/file/sdk/download?files=cf0da2d9d1d34bde8117092c8331798e",
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
        active: "color",
        pattern: {
          image: "",
        },
        color: {
          type: "color",
          image: "",
          isTheme: false,
          theme: "main",
          value: "rgba(21, 24, 36, 1)",
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
          image: "/dataview/file/sdk/download?files=95971d27507b401cbea8c5e47e6a3ff5",
          size: "100% 100%",
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
      titlePadding: [0, "20", 0, "20"],
      borderWidth: 1,
      borderColor: "rgba(145, 164, 196, 1)",
      borderRadius: 0,
      textStyle: {
        color: "rgba(255, 255, 255, 1)",
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
          isTheme: false,
          theme: "main",
          value: "rgba(28, 39, 55, 0.9)",
        },
      },
      placement: "right",
      relativeStyle: true,
      arrow: {
        show: false,
        size: 10,
      },
      shadowShow: true,
      shadowColor: "rgba(167, 199, 255, 1)",
      offsetFormat: 0,
      padding: ["16", "16", "16", "16"],
      borderRadius: 4,
      borderWidth: 0,
      borderColor: "rgba(28, 39, 55, 0.9)",
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
          value: "rgba(153,173,205,1)",
        },
      },
      textStyle: { color: "#FFF" },
    },
    dataviewCircleMenu: {
      defaultBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg,rgba(153,173,205,0.6) 0%,rgba(153,173,205,1) 100%)",
          isTheme: false,
          theme: "main",
          value: "#222",
        },
      },
      activeBackground: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, rgba(244,84,77,0.6) 0%,rgba(244,84,77,1) 100%)",
          isTheme: false,
          theme: "main",
          value: "#FFD37E",
        },
      },
      borderColor: {
        active: "color",
        color: {
          type: "linear",
          image: "linear-gradient(90deg, #222 0%,rgba(153,173,205,1) 100%)",
          isTheme: false,
          theme: "main",
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
        "linear-gradient(90deg, rgba(244, 84, 77, 0.6) 0%, rgb(244, 84, 77) 100%)",
        "linear-gradient(90deg, rgba(255, 206, 96, 0.6) 0%, rgb(255, 206, 96) 100%)",
        "linear-gradient(90deg, rgba(253, 136, 66, 0.6) 0%, rgb(253, 136, 66) 100%)",
        "linear-gradient(90deg, rgba(180, 143, 142, 0.6) 0%, rgb(180, 143, 142) 100%)",
        "linear-gradient(90deg, rgba(153, 173, 205, 0.6) 0%, rgb(153, 173, 205) 100%)",
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
      colors: ["rgba(153,173,205,1)", "rgba(244,84,77,1)", "rgba(255,206,96,1)", "rgba(253,136,66,1)", "rgba(180,143,142,1)", "rgba(102,127,169,1)"],
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
          image: "/dataview/file/sdk/download?files=95971d27507b401cbea8c5e47e6a3ff5",
          size: "cover",
          repeat: "no-repeat",
          position: "left top",
        },
      },
      titlePadding: [0, 0, 0, 20],
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
          image: "/dataview/file/sdk/download?files=95971d27507b401cbea8c5e47e6a3ff5",
          size: "cover",
          repeat: "no-repeat",
          position: "left top",
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
          image: "/dataview/file/sdk/download?files=1be99b605ca44a618e1f858b4664ea13",
          size: "100% 100%",
          repeat: "no-repeat",
          position: "center",
        },
      },
      titleTextAlign: {
        vAlign: "middle",
        hAlign: "left",
      },
      titlePadding: [0, 0, 0, 10],
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
        color: "rgba(220,240,255,0.6)", // 统一的表头颜色
      },
      newContentConfig: {
        color: "rgba(255,255,255,1)", // 内容颜色
      },
      indexAttrConfig: {
        bgColors: ["#F4544D", "#BD9948", "#AB6236", "#4E5B66"],
      },
      backgroundColor: "rgba(255,255,255,0)", // 整体的背景色
      selectTheme: "huise",
    },
    //下拉框组件
    select: {
      selectTheme: "huise",
      borderConfig: {
        commonBorderColor: styleVarConfig["--input-border-color"],
      },
      borderRadius: styleVarConfig["--input-border-radius"],
    },
    //时间范围组件
    timeRange: {
      selectTheme: "huise",
    },
    // 高级查询
    advancedQuery: {
      selectTheme: "huise",
    },
    // 3d 地图
    threeMap: {
      itemStyle: {
        range: {
          color: ["#95A8C4", "#567DCE"],
        },
        topColor: "rgba(66, 76, 94, 0.8)", //面的顶面颜色
        sideColor: "#95A8C4", //侧边颜色
        uColor: "#4B5F89", //侧边动画颜色
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
        labelColor: "rgba(220,240,255,1)",
      },
      // 坐标系颜色控制
      axis: {
        labelColor: "rgba(220,240,255,1)",
        lineColor: "rgba(220,240,255,0.3)",
      },
      // 地图颜色设置
      map: {
        colors: ["#4B5F89"], // 地图区域颜色
        labelColor: "#fff", // 地图文字颜色
        borderColor: "#f4f4f4", // 地图边线文字
      },
      // 图形颜色设置
      commonStyle: {
        colors: [
          ["rgba(153,173,205,0.2)", "rgba(153,173,205,0.6)", "rgba(153,173,205,1)"],
          ["rgba(244,84,77,0.2)", "rgba(244,84,77,0.6)", "rgba(244,84,77,1)"],
          ["rgba(255,206,96,0.2)", "rgba(255,206,96,0.6)", "rgba(255,206,96,1)"],
          ["rgba(253,136,66,0.2)", "rgba(253,136,66,0.6)", "rgba(253,136,66,1)"],
          ["rgba(180,143,142,0.2)", "rgba(180,143,142,0.6)", "rgba(180,143,142,1)"],
          ["rgba(102,127,169,0.2)", "rgba(102,127,169,0.6)", "rgba(102,127,169,1)"],
        ],
        labelColor: "rgba(245,252,255,1)",
      },
      visualMap: {
        colors: ["#805F4B", "#C7C6C5"],
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
              image: "/dataview/file/sdk/download?files=8aa84b3d77f449888b5d5e17115fb367",
              size: "100% 100%",
              repeat: "no-repeat",
              position: ["center", "center"],
            },
          },
        },
      ], // 单个背景(里面对象则为背景的通用对象)
      attachObj: {
        // 统一
        nameColor: "rgba(153,173,205,1)", // 名称颜色
        valueColor: "#FFF", // 值颜色
        unitColor: "rgba(153,173,205,1)", // 单位颜色
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
              image: "/dataview/file/sdk/download?files=8aa84b3d77f449888b5d5e17115fb367",
              size: "100% 100%",
              repeat: "no-repeat",
              position: ["center", "center"],
            },
          },
        },
      ], // 单个背景(里面对象则为背景的通用对象)
      nameTextStyle: {
        color: "rgba(153,173,205,1)",
      },
      valueTextStyle: {
        color: "#FFF",
      },
      unitTextStyle: {
        color: "rgba(153,173,205,1)",
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
      selectTheme: "huise",
      color: "rgba(255, 255, 255, 1)",
      borderConfig: {
        border: "1px solid rgba(153, 173, 205, 0.5)",
        commonBorderColor: "rgba(153, 173, 205, 0.5)",
      },
    },
    // 占比条
    dataviewRatioBar: {
      titleTextStyle: {
        color: "rgba(255,255,255,1)",
      },
      barBackgroundColorList: ["rgba(153,173,205,1)", "rgba(244,84,77,1)", "rgba(255,206,96,1)", "rgba(253,136,66,1)", "rgba(180,143,142,1)", "rgba(102,127,169,1)"],
    },
    // 进度池
    dataviewPercentPond: {
      config: {
        colors: ["rgba(153,173,205,1)", "rgba(244,84,77,1)"],
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
        color: "rgba(153,173,205,1)",
      },
      valueTextStyle: {
        color: "rgba(153,173,205,1)",
      },
      config: {
        bigCircleStrokeArr: [
          ["rgba(153,173,205,0.6)", "rgba(153,173,205,1)", "rgba(153,173,205,0.6)", "rgba(153,173,205,0.4)"],
          ["rgba(244,84,77,0.6)", "rgba(244,84,77,1)", "rgba(244,84,77,0.6)", "rgba(244,84,77,0.4)"],
          ["rgba(255,206,96,0.6)", "rgba(255,206,96,1)", "rgba(255,206,96,0.6)", "rgba(255,206,96,0.4)"],
          ["rgba(253,136,66,0.6)", "rgba(253,136,66,1)", "rgba(253,136,66,0.6)", "rgba(253,136,66,0.4)"],
          ["rgba(180,143,142,0.6)", "rgba(180,143,142,1)", "rgba(180,143,142,0.6)", "rgba(180,143,142,0.4)"],
          ["rgba(102,127,169,0.6)", "rgba(102,127,169,1)", "rgba(102,127,169,0.6)", "rgba(102,127,169,0.4)"],
        ],
        nodeCircleStrokeArr: ["rgba(153,173,205,1)", "rgba(244,84,77,1)", "rgba(255,206,96,1)", "rgba(253,136,66,1)", "rgba(180,143,142,1)", "rgba(102,127,169,1)"],
        linesColors: [
          "linear-gradient(0deg, rgba(153,173,205,1) 0%,rgba(153,173,205,0.5) 100%)",
          "linear-gradient(0deg, rgba(244,84,77,1) 0%,rgba(244,84,77,0.5) 100%)",
          "linear-gradient(0deg, rgba(255,206,96,1) 0%,rgba(255,206,96,0.5) 100%)",
          "linear-gradient(0deg, rgba(253,136,66,1) 0%,rgba(253,136,66,0.5) 100%)",
          "linear-gradient(0deg, rgba(180,143,142,1) 0%,rgba(180,143,142,0.5) 100%)",
          "linear-gradient(0deg, rgba(102,127,169,1) 0%,rgba(102,127,169,0.5) 100%)",
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
        "linear-gradient(90deg, rgba(255, 119, 0, 0) 0%, rgb(244, 84, 77) 100%)",
        "linear-gradient(90deg, rgba(226, 74, 59, 0) 0%, rgb(255, 206, 96) 100%)",
        "linear-gradient(90deg, rgba(253, 136, 66, 0) 0%, rgb(209, 197, 159) 100%)",
        "linear-gradient(90deg, rgba(255, 119, 0, 0) 0%, rgb(153, 173, 205) 100%))",
      ],
      indexAttrConfig: {
        fontColors: ["rgba(255,255,255,1)"],
        bgColors: [
          "linear-gradient(90deg, rgb(244, 84, 77) 0%, rgba(255, 119, 0, 0) 100%)",
          "linear-gradient(90deg, rgb(255, 206, 96) 0%, rgba(255, 119, 0, 0) 100%)",
          "linear-gradient(90deg, rgb(253, 136, 66) 0%, rgba(255, 119, 0, 0) 100%)",
          "linear-gradient(90deg, rgb(153, 173, 205) 0%, rgba(255, 119, 0, 0) 100%)",
        ],
      },
      nameTextStyle: {
        color: "rgba(255,255,255,1)",
      },
      valueTextStyle: {
        color: "#FFF",
      },
      unitTextStyle: {
        color: "#FFF",
      },
    },
  },
  // 公用的属性
  commonConfig: {
    // 系列色(后面的统一使用这种,前面的有时间再改)
    colorList: ["rgba(153,173,205,1)", "rgba(244,84,77,1)", "rgba(255,206,96,1)", "rgba(253,136,66,1)", "rgba(180,143,142,1)", "rgba(102,127,169,1)"],
  },
};
