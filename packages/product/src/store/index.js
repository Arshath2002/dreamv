
import Vuex from "vuex";
import mutations from './mutation';
import actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    route: {}
  },
  mutations,
  actions,
  modules: {
    ...$platformStore
  }
});