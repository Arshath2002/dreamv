/*
 * @Description: select、组合组件等主题风格
 * @Author: shenah
 * @Date: 2024-01-25 15:42:03
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-04 13:39:13
 */

export default {
  props: {
    popperAppendToBody: {
      type: Boolean,
      default: true,
    },
    relationStyle: {
      type: Boolean,
      default: true,
    },
    customVariable: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    let uuid = dsf.uuid();
    let themeStyleName = "dv-theme-style_" + uuid;
    return {
      themeStyleName,
      styleList: {},
    };
  },
  created() {
    this.initCreateThemeVar();
  },
  methods: {
    //动态添加的标签
    addStyle(selectStyle) {
      let _styleVariable = "";
      let keys = Object.keys(selectStyle);
      let len = keys.length;
      keys.forEach((key, index) => {
        const value = selectStyle[key];
        if (index === 0) {
          _styleVariable += `{${key}:${value};`;
        } else if (index === len - 1) {
          _styleVariable += `${key}:${value};}`;
        } else {
          _styleVariable += `${key}:${value};`;
        }
      });
      const innerHTML = "." + this.themeStyleName + _styleVariable;
      let styleDom = document.getElementById(this.themeStyleName);

      if (!styleDom) {
        styleDom = document.createElement("style");
        styleDom.setAttribute("id", this.themeStyleName);
        document.head.appendChild(styleDom);
      }
      styleDom.innerHTML = innerHTML;
    },
    initCreateThemeVar() {
      import(/* webpackChunkName: "dataview_theme_form",webpackMode: "lazy" */ "_dataview/output/config/select.js").then((res) => {
        const defaultTheme = res.createSelectStyleVar();
        const theme = this.$page?.theme;
        const themeVarConfig = dsf.mix(true, {}, defaultTheme, dsf.dataview.extendSelectThemeConfig);
        this.styleList = themeVarConfig[theme];
        const style = dsf.mix(true, {}, this.styleList, this.customVariable);
        if (typeof this.specialAddStyle === "function" && !this.relationStyle) {
          this.specialAddStyle();
        } else {
          if (this.popperAppendToBody) {
            this.addStyle(style);
          }
        }
      });
    },
  },
};
