/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2025-03-24 09:31:53
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-19 16:37:17
 */

const DsfDataViewMdComponents = dsf.defineAsyncComponent("DsfDataViewMdComponents",() =>
  $mixins.smartCard().then(() => import(/*webpackChunkName:"dataview_iagent"*/ "./DsfDataViewMdComponent/DsfDataViewMdComponents.vue"))
);

const DsfDataViewMdPageComponent = dsf.defineAsyncComponent("DsfDataViewMdPageComponent",() =>
  $mixins.smartCard().then(() => import(/*webpackChunkName:"dataview_iagent"*/ "./DsfDataViewMdComponent/DsfDataViewMdPageComponent.vue"))
);


const components = {
  DsfDataViewMdComponents,
  DsfDataViewMdPageComponent,
};
const install = dsf.createDsfVueInstall("iagent", components);
export default install;

export { install };
