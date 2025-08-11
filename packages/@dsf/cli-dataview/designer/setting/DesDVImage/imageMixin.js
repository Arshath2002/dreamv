/*
 * @Description: 图片公用混入
 * @Author: shenah
 * @Date: 2025-02-21 10:46:59
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-19 11:13:55
 */
import createBackground from "_dataview/output/config/backgroundExtend.js";
export default {
  props: {
    //页面背景类型 默认是页面背景
    backgroundTypes: {
      type: Array,
      default() {
        return ["page"];
      },
    },
  },
  data() {
    return {
      form: createBackground(),
    };
  },
  created() {
    const form = this.form;
    const currentData = this.currentData;
    try {
      dsf.mix(true, form, currentData);
    } catch (error) {
      console.error(error);
    }

    if (form.custom) {
      this.positionFormat(form.custom);
    }
    if (this.form.pattern) {
      this.positionFormat(form.pattern);
    }
  },
  methods: {
    positionFormat(opt) {
      if (opt.position && dsf.isString(opt.position)) {
        if (opt.position == "center") {
          opt.position = "center center";
        }
        opt.position = opt.position.split(" ");
      }
    },
  },
};
