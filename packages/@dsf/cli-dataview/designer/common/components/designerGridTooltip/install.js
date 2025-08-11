/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-10-21 13:39:44
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-10-29 15:22:35
 */
import DesignerGridTooltip from "./index.vue";
export default {
  install: function (Vue) {
    const DesignerGridTooltipComponent = Vue.extend(DesignerGridTooltip);
    const instance = new DesignerGridTooltipComponent();
    let isMounted = false;
    Vue.prototype.$dvGridTooltip = function (opt) {
      const { x, y, options, } = opt;
      // 公用一个挂载Dom
      if (!isMounted) {
        instance.$mount();
        isMounted = true;
        document.body.appendChild(instance.$el);
      }
      instance.show(x, y, options);
      return instance;
    };
    Vue.prototype.$dvGridTooltipHide = function () {
      instance.hide();
    };
  },
};
