/*
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-04-15 16:32:53
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-09 17:19:00
 */
const router = [
  {
    path: "/pc/ai/dv-ai",
    meta: {
      title: "大屏AI",
    },
    component: () => import(/* webpackChunkName: "dataview_iagent" */ "../../AI-Agent/DsfDataViewAiChart.vue"),
  }
];

export default router;
