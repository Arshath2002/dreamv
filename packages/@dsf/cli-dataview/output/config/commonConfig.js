/*
 * @Description: 公用配置项
 * @Author: shenah
 * @Date: 2023-08-10 15:02:19
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-24 15:52:41
 */
// 字体列表选择
export const fontList = [
  {
    text: "微软雅黑",
    value: "Microsoft Yahei",
  },
  {
    text: "阿里巴巴普惠-常规",
    value: "Alibaba-PuHuiTi-Regular",
  },
  {
    text: "阿里巴巴普惠-中粗",
    value: "Alibaba-PuHuiTi-Medium",
  },
  {
    text: "阿里巴巴普惠-粗体",
    value: "Alibaba-PuHuiTi-Bold",
  },
  {
    text: "液晶数字",
    value: "DIGIT",
  },
];

// 值的转化列表
export const unitValueMap = {
  10: "十",
  100: "百",
  1000: "千",
  10000: "万",
  100000: "十万",
  1000000: "百万",
  10000000: "千万",
  100000000: "亿",
};

// 字相关的样式
export const createCommonTextStyle = (options) => {
  return dsf.mix(
    {
      // 采用单色,渐变等
      color: "#fff",
      fontWeight: "normal", // 是否加粗
      fontStyle: "normal", // 是否斜体
      textDecoration: "none", // 是否下划线
      fontFamily: "Microsoft Yahei", // 字体
      fontSize: "20", // 字号
    },
    options
  );
};
// 边框默认样式
export const createCommonBorderConfig = (options, color = "#DCDFE6") => {
  return dsf.mix(
    {
      commonBorderColor: color,
      commonBorderStyle: "solid",
      commonBorderWidth: 1,
      border: `1px solid ${color}`,
    },
    options
  );
};

export const ColorRegexp = /^.*?((rgba?\(.+?\))|(#[A-Fa-f\d]{6})|(#[A-Fa-f\d]{3})).*$/;

// 颜色对象处理
export const handleColor = (value) => {
  if (value && typeof value === "object") {
    let { color, linear, radial } = value;
    let type = color?.type || value.active;
    switch (type) {
      case "linear":
        let angle = parseFloat(linear.angle);
        let linearStr = linear.point
          .map((it) => `${it.color} ${it.length}%`)
          .join();
        return `linear-gradient(${
          isFinite(angle) ? angle : 90
        }deg, ${linearStr})`;
      case "radial":
        let radialStr = radial.point
          .map((it) => `${it.color} ${it.length}%`)
          .join();
        return `linear-gradient(90deg, ${radialStr})`;
      case "color":
      default:
        return color?.value || "#fff";
    }
  } else {
    return value || "inherit";
  }
};

//  动画相关的
export const createCommonAnimateCss = (options) => {
  return dsf.mix(
    {
      animation: [], // 动画名称
      duration: 2, // 持续时间
      delay: 0, // 延迟时间
      repeat: 1, // 重复次数
      isOrder: true, // 是否按序展示(只用于页面动画)
    },
    options
  );
};
/**
 * @Description 菜单相关配置项目
 * @param {*} options
 * @param {*} type common 普通菜单 simple 简单菜单
 * @returns
 */
export const createMenuItem = (options = {}, type = "nav") => {
  const base = {
    url: "",
    id: dsf.uuid(),
    interactType: "-1", //交互类型
    // 弹框配置
    dialogWidth: "50%",
    dialogHeight: "500",
    dialogTitle: "",
    dialogType: "default",
    // 视图配置
    viewPart: null,
    viewPartUrl: "",
    isOuter: false,
    isHide: "false",
  };
  const extra =
    type == "nav"
      ? {
          // 图标配置项
          valueIconObj: {
            defaultValue: null,
            ruleList: [],
          },
          valueColorObj: {
            defaultValue: null,
            ruleList: [],
          },
          valueImgObj: {
            defaultValue: { active: "custom" },
            imgWidth: "20",
            imgHeight: "auto",
            ruleList: [],
          },
          valueShowType: "icon",
          valueShowPosition: "before",

          transformX: 0,
          transformY: 0,
          subTransformX: 0,
          subTransformY: 0,
        }
      : {};
  return dsf.mix(base, extra, options);
};

export const createBoxShadow = (insetFlag = false) => ({
  flag: false,
  boxShadow: insetFlag ? "inset 0px 0px 10px 0px red" : "0px 0px 10px 0px red",
});

// 字段字体样式规则
export const createFieldFontStyleRules = (options) => {
  return dsf.mix(
    {
      valueName: "",
      rule: "none",
      threshold: "",
      style: {
        fontFamily: "Microsoft Yahei",
        fontSize: "16px",
        color: "#333",
        fontStyle: "normal",
        fontWeight: "normal",
      },
      uuid: dsf.uuid(),
    },
    options
  );
};
