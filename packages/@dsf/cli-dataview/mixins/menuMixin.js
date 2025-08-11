import { commonEvents } from "_dataview/output/utils/commonEvent.js";
export default {
  computed: {
    includeEvents() {
      return [... Object.keys(commonEvents), ...this.otherEvents];
    },
    commonMenuWrapStyle(){
      let style = {
        ...this.controlStyle,
        ...this.getCommonEnterAnimateStyle,
      }
      return style;
    },
  },
  methods: {
    commonLink(item) {
      if (this.isDesign) return false;
      if (item.interactType == 4 && (!item.viewPartUrl || !item.viewPart)) return false;
      if (item.interactType != 4 && !item.url) return false;
      const params = this.$expressParams();
      let url = this.dataviewAnalysisSpecialVar(item.url);
      url = this.$replace(url, params);
      const outer = item.isOuter;
      const dialogWidth = item.dialogWidth || "50%";
      const dialogHeight = item.dialogHeight || "500";
      const dialogTitle = item.dialogTitle || "";
      const dialogType = item.dialogType || "default";

      switch (item.interactType) {
        case "1":
          if (outer) {
            window.open(url, new Date().getTime());
          } else {
            url = url.replace(/^(\/)?#/g, "");
            this.$router.push({ path: url });
          }
          break;
        case "2":
          if (outer) {
            window.open(url, new Date().getTime());
          } else {
            window.location.href = url;
          }
          break;
        case "3":
          this.handleOpenDataViewDialog(url, dialogWidth, dialogHeight, dialogTitle, dialogType);
          break;
        case "4":
          if (this.$page && this.$page.$parent) {
            const viewProxy = this.$page.$parent;
            let viewPartUrl = this.dataviewAnalysisSpecialVar(item.viewPartUrl);
            viewProxy.$refs[item.viewPart].pathChange(viewPartUrl);
          }

          break;
      }
    },
  },
};
