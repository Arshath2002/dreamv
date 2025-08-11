export default {
  install(Vue) {
    Vue.filter("imgDVFormat", function (val, isStatic = true) {
      try {
        if (dsf.type(val) === "string") {
          if (val.indexOf("relativePath") == -1) {
            return val;
          }
          const result = JSON.parse(val);
          const files = dsf.isArray(result) ? result : [result];
          return dsf.url.getFilePath(files, isStatic);
        }
      } catch (error) {
        console.error(error);
      }
      return "";
    });
  },
};
