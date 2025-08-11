/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2022-07-20 10:21:43
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 15:25:48
 */
import setting from "./setting";
import components from "./common/components";

// 设计器提示框
import designerGridTooltip from "./common/components/designerGridTooltip/install";
function install(Vue) {
  Vue.use(setting);
  Vue.use(components);

  Vue.use(designerGridTooltip);
}
export default install;
export { install };
