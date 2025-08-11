if (window.$$serverModulesConfig) {
  dsf.init.loadRemoteModule(Vue, "designer", window.$$serverModulesConfig || []).then(() => {
    require("./createApp.js");
  });
} else {
  require("./createApp.js");
}