
import router from '../mobile/router'
import install from '../mobile';
import "../assets/styles/mobile/index.scss";

!function (global) {
  Vue.use(install);
  global.$platformRouter.mobile.push(...router)
}(dsf.global || (dsf.global = {}))
