/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-20 10:28:31
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-30 14:54:52
 */
let router = [
  {
    path: "/pc/ai/dv-ai",
    meta: {
      title: "大屏AI",
    },
    component: () => import(/* webpackChunkName: "dataview_iagent" */ "../../AI-Agent/DsfDataViewAiChart.vue"),
  },
  // 大屏设计器
  {
    path: "/dataViewDesign403",
    name: "dataViewDesign403",
    meta: {
      title: "大屏设计器403"
    },
    component: () => import( /* webpackChunkName: "dataview" */ "../views/403.vue")
  },
  // 大屏设计器
  {
    path: "/dataViewDesign",
    name: "DsfDataViewDesigner",
    meta: {
      title: "大屏设计器"
    },
    component: () => import( /* webpackChunkName: "dataview" */ "../views/DsfDataViewDesigner.vue"),
    props: route => {
      return {
        business: route.query.B,
        module: route.query.M,
        pageName: route.query.pname,
        pageTitle: route.query.title,
        mobile: false,
        isPrototype: route.query._prototype == 1 ? true : false,
        tpl: route.query.tpl == 1 ? true : false,
        tplId: route.query.tplId,
        tplCode: route.query.tplcode,
        templateType: route.query.templateType,
        layoutType: 'dataview'
      };
    }
  },
]
export default router;