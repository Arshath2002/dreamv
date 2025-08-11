/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-11-05 14:02:22
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-22 11:48:37
 */
export default {
  data() {
    return {
      // 弹框列表
      dialogConfig: [],
      //视图列表
      viewPartList: [],
      interactTypes: [
        {
          label: "打开页面",
          value: "1",
        },
        {
          label: "打开外部链接",
          value: "2",
        },
        {
          label: "打开大屏弹框",
          value: "3",
        },
        {
          label: "切换视图路径",
          value: "4",
        },
        {
          label: "无",
          value: "-1",
        },
      ],
    };
  },
  created() {
    const vm = this.owner.$children[0];
    let dialogConfig = vm.$page ? vm.$page.dialogConfig : vm.dialogConfig;
    dialogConfig.forEach((it) => {
      this.dialogConfig.push({
        label: it.id,
        value: it.id,
      });
    });
    // 页面视图列表
    const viewPartList = [];
    dsf.designer.recursionLayoutTree(this.designer.$refs.viewProxy, null, null, (it) => {
      if (it.ctrlName === "DsfDataviewViewPart") {
        const value = it.caption;
        const label = it.fakeCodeName;
        viewPartList.push({
          label,
          value,
        });
      }
    });
    this.viewPartList = viewPartList;
  },
  methods: {
    openDialog(it, key = "url") {
      const gid = dsf.config.setting_dataview_page_gid || "e31357e71e2e43d5b1205fccdcd9d83b.868b115a7ef04f6b872e30ba9d986e0a.e4a5ae5871c64872adc3795b9c1c31df";
      const url = `rm/list?type=directory,bigScreen&rmGid=${gid}`;
      const params = {
        value: "",
        type: "pc",
        URL_MAP: {
          pc: ["页面", url],
        },
      };
      dsf.layer.pc.openDialog(
        {
          title: "设置链接",
          width: "1300px",
          height: "500px",
          content: "DsfUrlDialog",
          showClose: false,
          params,
          btns: [
            {
              text: "确定",
              handler: (res) => {
                let url = res.yes();
                it[key] = url;
              },
            },
            {
              text: "取消",
            },
          ],
        },
        () => {}
      );
    },
  },
};
