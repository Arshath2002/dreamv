<!--
 * @Editor: zhanghang
 * @Description: 大屏选择地址
 * @Date: 2024-11-08 17:34:42
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-22 11:22:18
-->
<template>
  <el-input v-model="value" class="dsf-input-url" placeholder="请输入地址" size="small" @change="change">
    <el-button slot="append" icon="el-icon-search" @click="openDialog" />
  </el-input>
</template>
<script>
export default {
  name: "DesDVInputUrl",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  methods: {
    openDialog() {
      let self = this;
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
                self.change(url);
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
    change(val) {
      this.$emit("update:value", val);
      this.$emit("change", val);
    },
  },
};
</script>
