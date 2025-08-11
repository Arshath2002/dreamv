/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2025-01-23 11:04:51
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-19 14:52:53
 */

// const DsfDataViewExtra = dsf.defineAsyncComponent("DsfDataViewExtra", ()=>{
//   return $mixins.dataView().then(() => import(/* webpackChunkName: "dataview_pc_extra_module" */ "./components/DsfDataViewExtra"))
// });

import DsfDataViewExtra from "./components/DsfDataViewExtra"

function install(Vue) {
  const installComponents = dsf.createDsfVueInstall("dataview", {
    DsfDataViewExtra,
  });
  installComponents(Vue);
}
export default install;

export { install };
