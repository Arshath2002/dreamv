/*
 * @Description: 白色风格
 * @Author: shenah
 * @Date: 2024-03-15 11:07:22
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-22 16:36:50
 */
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import { createSelectStyleVar } from "_dataview/output/config/select";
import threeTool from "_dataview/output/utils/threeTool.js";
const styleVarConfig = createSelectStyleVar().baise;
let styleConfig = {
  name: "白色风格",
  value: "baise",
  picture: "",
  style: {
    //gis
    gis: {
      label: {
        itemStyle: {
          backgroundColor: "#87B5ED",
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
        color: "#3288F0",
      },
      pointConfig: {
        color: "#3288F0",
      },
      timeConfigStyle: {
        color: "#606266",
      },
      textContentBorderConfig: {
        commonBorderColor: "#DDDDDD",
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
          value: "#fff",
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
            image:
              "/dataview/file/sdk/download?files=e50035d034304385ad5a2bd258204723",
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
            image:
              "/dataview/file/sdk/download?files=fdb719c996e946ad96abe2c45162af02",
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
          image:
            "/dataview/file/sdk/download?files=dc1368b041834c56b26c73de7dd2d153",
          size: "100% 100%",
          repeat: "no-repeat",
          position: "center",
        },
      },
      navTextStyle: {
        color: "#606266",
      },
      clickTextStyle: {
        color: "#333333",
      },
      hoverTextStyle: {
        color: "#333333",
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
          value: "rgba(243,243,243,1)",
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
        pattern: {
          image: "",
        },
        color: {
          type: "color",
          image: "",
          isTheme: false,
          theme: "main",
          value: "rgba(242,246,253,1)",
        },
      },
    },
    // 弹框
    dialogConfig: {
      background: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "#ffffff",
        },
      },
      titleBackground: {
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "",
        },
      },
      relativeStyle: true,
      iconPosition: ["auto", "auto", "auto", "auto"],
      titleHeight: "60",
      align: "left",
      vectorAlign: "center",
      iconColor: "rgba(51, 51, 51, 1)",
      iconSize: 13,
      padding: ["0", "20", "20", "20"],
      titlePadding: [0, "20", 0, "20"],
      borderWidth: 0,
      borderColor: "rgba(255, 255, 255, 1)",
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
          isTheme: false,
          theme: "main",
          value: "rgba(0, 0, 0, 0.7)",
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
      borderRadius: 6,
      borderWidth: 0,
      borderColor: "rgba(0, 0, 0, 0.7)",
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
          isTheme: false,
          theme: "",
          value: "rgba(51,51,51,0.5)",
        },
      },
      textStyle: { color: "#FFF" },
    },
    dataviewCircleMenu: {
      defaultBackground: {
        active: "color",
        color: {
          type: "linear",
          image:
            "linear-gradient(90deg, rgba(183,224,125,0.6) 0%,rgba(183,224,125,1) 100%)",
          isTheme: false,
          theme: "main",
          value: "#222",
        },
      },
      activeBackground: {
        active: "color",
        color: {
          type: "linear",
          image:
            "linear-gradient(90deg, rgba(124,169,249,0.6) 0%,rgba(124,169,249,1) 100%)",
          isTheme: false,
          theme: "main",
          value: "#FFD37E",
        },
      },
      borderColor: {
        active: "color",
        color: {
          type: "linear",
          image:
            "linear-gradient(90deg,rgba(255,255,255,1) 0%,rgba(183,224,125,1) 100%)",
          isTheme: false,
          theme: "main",
          value: "#222",
        },
      },
      textStyle: createCommonTextStyle({ color: "rgba(51,51,51,1)" }),
      activeTextStyle: createCommonTextStyle({ color: "#FFF" }),
    },
    //轮播排名
    scrollRankingBoard: {
      barBackground: "rgba(71, 71, 71, 0.3)",
      colors: [
        "linear-gradient(90deg, rgba(50, 136, 240, 0.6) 0%, rgb(50, 136, 240) 100%)",
        "linear-gradient(90deg, rgba(183, 224, 125, 0.6) 0%, rgb(183, 224, 125) 100%)",
        "linear-gradient(90deg, rgba(124, 169, 249, 0.6) 0%, rgb(124, 169, 249) 100%)",
        "linear-gradient(90deg, rgba(118, 203, 237, 0.6) 0%, rgb(118, 203, 237) 100%)",
        "linear-gradient(90deg, rgba(185, 155, 234, 0.6) 0%, rgb(185, 155, 234) 100%)",
        "linear-gradient(90deg, rgba(65, 206, 151, 0.6) 0%, rgb(65, 206, 151) 100%)",
      ],
      titleTextStyle: createCommonTextStyle({
        color: "rgba(51,51,51,1)",
        fontSize: 18,
      }),
      valueTextStyle: createCommonTextStyle({
        color: "rgba(51,51,51,1)",
        fontSize: 18,
      }),
    },
    //圆环组
    ringGroup: {
      colors: [
        "rgba(50,136,240,1)",
        "rgba(183,224,125,1)",
        "rgba(124,169,249,1)",
        "rgba(118,203,237,1)",
        "rgba(185,155,234,1)",
        "rgba(65,206,151,1)",
      ],
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
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(255,255,255,1)",
        },
      },
      titlePadding: [0, 0, 0, 20],
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
        active: "color",
        color: {
          type: "color",
          image: "",
          value: "rgba(255,255,255,1)",
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
        active: "color",
        color: {
          type: "color",
          image: "",
          isTheme: false,
          theme: "main",
          value: "rgba(255,255,255,1)",
        },
      },
      titleTextAlign: {
        vAlign: "middle",
        hAlign: "center",
      },
      titleTextStyle: createCommonTextStyle({
        color: "rgba(51,51,51,1)",
        fontSize: "46", // 字号
      }),
      subTitleTextStyle: createCommonTextStyle({
        color: "rgba(51,51,51,1)",
        fontSize: "16", // 字号
      }),
      //边框颜色
      borderColor: "#FFDC4C",
    },
    //表格组件
    dataviewTable: {
      newHeaderConfig: {
        bgColor: "rgba(245,245,245,1)", // 统一的表头背景色
        color: "rgba(51,51,51,1)", // 统一的表头颜色
      },
      newContentConfig: {
        color: "rgba(102,102,102,1)", // 内容颜色
      },
      backgroundColor: "rgba(255,255,255,0)", // 整体的背景色
      indexAttrConfig: {
        bgColors: ["#F28E48", "#FFC32B", "#358FF8", "rgba(56, 83, 118, 0.525)"],
      },
      selectTheme: "baise",
    },
    //下拉框组件
    select: {
      selectTheme: "baise",
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
          color: ["#95B1C7", "#378CCD"],
        },
        topColor: "rgba(178, 215, 244, 1)", //面的顶面颜色
        sideColor: "rgba(100, 135, 163, 1)", //侧边颜色
        uColor: "rgba(143, 183, 213, 1)", //侧边动画颜色
      },
      lineStyle: {
        color: "rgba(115, 115, 115, 1)",
      },
      outLineStyle: {
        color: "rgba(108, 108, 108, 1)",
      },
      label: {
        itemStyle: {
          textStyle: {
            color: "#333333",
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
        labelColor: "rgba(102,102,102,1)",
      },
      // 坐标系颜色控制
      axis: {
        labelColor: "rgba(153,153,153,1)",
        lineColor: "rgba(238,238,238,0.3)",
      },
      // 地图颜色设置
      map: {
        colors: ["rgba(145, 190, 242, 1)"], // 地图区域颜色
        labelColor: "rgba(51,51,51,1)", // 地图文字颜色
        borderColor: "#f4f4f4", // 地图边线文字
      },
      // 图形颜色设置
      commonStyle: {
        colors: [
          [
            "rgba(50,136,240,0.2)",
            "rgba(50,136,240,0.6)",
            "rgba(50,136,240,1)",
          ],
          [
            "rgba(183,224,125,0.2)",
            "rgba(183,224,125,0.6)",
            "rgba(183,224,125,1)",
          ],
          [
            "rgba(124,169,249,0.2)",
            "rgba(124,169,249,0.6)",
            "rgba(124,169,249,1)",
          ],
          [
            "rgba(118,203,237,0.2)",
            "rgba(118,203,237,0.6)",
            "rgba(118,203,237,1)",
          ],
          [
            "rgba(185,155,234,0.2)",
            "rgba(185,155,234,0.6)",
            "rgba(185,155,234,1)",
          ],
          [
            "rgba(65,206,151,0.2)",
            "rgba(65,206,151,0.6)",
            "rgba(65,206,151,1)",
          ],
        ],
        labelColor: "rgba(153,153,153,1)",
      },
      // 热力图
      visualMap: {
        colors: ["#E5F0E1", "#F7EFDD"],
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
              image:
                "/dataview/file/sdk/download?files=f003af3e29fd460e81c0cd39629bc9a8",
              size: "100% 100%",
              repeat: "no-repeat",
              position: ["center", "center"],
            },
          },
        },
      ], // 单个背景(里面对象则为背景的通用对象)
      attachObj: {
        // 统一
        nameColor: "rgba(102,102,102,1)", // 名称颜色
        valueColor: "#005CD1", // 值颜色
        unitColor: "rgba(51,51,51,1)", // 单位颜色
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
              image:
                "/dataview/file/sdk/download?files=f003af3e29fd460e81c0cd39629bc9a8",
              size: "100% 100%",
              repeat: "no-repeat",
              position: ["center", "center"],
            },
          },
        },
      ], // 单个背景(里面对象则为背景的通用对象)
      nameTextStyle: {
        color: "rgba(102,102,102,1)",
      },
      valueTextStyle: {
        color: "#005CD1",
      },
      unitTextStyle: {
        color: "rgba(51,51,51,1)",
      },
    },
    // 图标排名
    dataviewIconRate: {
      nameTextStyle: {
        color: "rgba(102,102,102,1)",
      },
      valueTextStyle: {
        color: "rgba(51,51,51,1)",
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
        color: "rgba(51,51,51,1)",
      },
      textStyle: {
        color: "rgba(51,51,51,1)",
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
      selectTheme: "baise",
      color: "rgba(51, 51, 51, 1)",
      borderConfig: {
        border: "1px solid rgba(221, 221, 221, 1)",
        commonBorderColor: "rgba(221, 221, 221, 1)",
      },
    },
    // 占比条
    dataviewRatioBar: {
      titleTextStyle: {
        color: "rgba(51,51,51,1)",
      },
      barBackgroundColorList: [
        "rgba(50,136,240,1)",
        "rgba(183,224,125,1)",
        "rgba(124,169,249,1)",
        "rgba(118,203,237,1)",
        "rgba(185,155,234,1)",
        "rgba(65,206,151,1)",
      ],
    },
    // 进度池
    dataviewPercentPond: {
      config: {
        colors: ["rgba(50,136,240,1)", "rgba(183,224,125,1)"],
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
        color: "rgba(50,136,240,1)",
      },
      valueTextStyle: {
        color: "rgba(50,136,240,1)",
      },
      config: {
        bigCircleStrokeArr: [
          [
            "rgba(50,136,240,0.6)",
            "rgba(50,136,240,1)",
            "rgba(50,136,240,0.6)",
            "rgba(50,136,240,0.4)",
          ],
          [
            "rgba(183,224,125,0.6)",
            "rgba(183,224,125,1)",
            "rgba(183,224,125,0.6)",
            "rgba(183,224,125,0.4)",
          ],
          [
            "rgba(124,169,249,0.6)",
            "rgba(124,169,249,1)",
            "rgba(124,169,249,0.6)",
            "rgba(124,169,249,0.4)",
          ],
          [
            "rgba(118,203,237,0.6)",
            "rgba(118,203,237,1)",
            "rgba(118,203,237,0.6)",
            "rgba(118,203,237,0.4)",
          ],
          [
            "rgba(185,155,234,0.6)",
            "rgba(185,155,234,1)",
            "rgba(185,155,234,0.6)",
            "rgba(185,155,234,0.4)",
          ],
          [
            "rgba(65,206,151,0.6)",
            "rgba(65,206,151,1)",
            "rgba(65,206,151,0.6)",
            "rgba(65,206,151,0.4)",
          ],
        ],
        nodeCircleStrokeArr: [
          "rgba(50,136,240,1)",
          "rgba(183,224,125,1)",
          "rgba(124,169,249,1)",
          "rgba(118,203,237,1)",
          "rgba(185,155,234,1)",
          "rgba(65,206,151,1)",
        ],
        linesColors: [
          "linear-gradient(0deg, rgba(50,136,240,1) 0%,rgba(50,136,240,0.5) 100%)",
          "linear-gradient(0deg, rgba(183,224,125,1) 0%,rgba(183,224,125,0.5) 100%)",
          "linear-gradient(0deg, rgba(124,169,249,1) 0%,rgba(124,169,249,0.5) 100%)",
          "linear-gradient(0deg, rgba(118,203,237,1) 0%,rgba(118,203,237,0.5) 100%)",
          "linear-gradient(0deg, rgba(185,155,234,1) 0%,rgba(185,155,234,0.5) 100%)",
          "linear-gradient(0deg, rgba(65,206,151,1) 0%,rgba(65,206,151,0.5) 100%)",
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
          return arr.map((str) =>
            threeTool.changeColorDepth(str, "darken", 20)
          );
        },
      },
    },
    // 排名组件
    rankProgress: {
      processColorList: [
        "linear-gradient(90deg, rgba(226,74,59,0.00) 0%, rgba(50,136,240,1) 100%)",
        "linear-gradient(90deg, rgba(226,74,59,0.00) 0%, rgba(183,224,125,1) 100%)",
        "linear-gradient(90deg, rgba(226,74,59,0.00) 0%, rgba(124,169,249,1) 100%)",
        "linear-gradient(90deg, rgba(226,74,59,0.00) 0%, rgba(118,203,237,1) 100%)",
      ],
      indexAttrConfig: {
        fontColors: ["rgba(102,102,102,1)"],
        bgColors: [
          "linear-gradient(90deg, rgba(50,136,240,1) 0%, rgba(226,74,59,0.00) 67%)",
          "linear-gradient(90deg, rgba(183,224,125,1) 0%, rgba(255,119,0,0.00) 67%)",
          "linear-gradient(90deg, rgba(124,169,249,1) 0%, rgba(227,178,47,0.00) 67%)",
          "linear-gradient(90deg, rgba(118,203,237,1) 0%, rgba(24,190,118,0.00) 67%)",
        ],
      },
      nameTextStyle: {
        color: "rgba(102,102,102,1)",
      },
      valueTextStyle: {
        color: "rgba(50,136,240,1)",
      },
      unitTextStyle: {
        color: "rgba(102,102,102,1)",
      },
    },
  },
  // 公用的属性
  commonConfig: {
    // 系列色(后面的统一使用这种,前面的有时间再改)
    colorList: [
      "rgba(50,136,240,1)",
      "rgba(183,224,125,1)",
      "rgba(124,169,249,1)",
      "rgba(118,203,237,1)",
      "rgba(185,155,234,1)",
      "rgba(65,206,151,1)",
    ],
  },
};
export default styleConfig;
