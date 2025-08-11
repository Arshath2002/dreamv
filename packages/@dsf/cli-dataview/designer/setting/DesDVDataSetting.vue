<!--
 * @Description: 只有数据设置
 * @Author: shenah
 * @Date: 2023-10-26 10:33:53
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-05-13 14:32:37
-->

<template>
  <div class="data-view-data-setting">
    <SettingDataOrigin
      class="data-setting"
      :owner="owner"
      :isShowIcon="false"
    ></SettingDataOrigin>
  </div>
</template>
<script>
export default {
  name: "DesDVDataSetting",
  mixins: [$mixins.propertyDialogSetting],
  components: { SettingDataOrigin:Vue.defineAsyncComponent(() =>
      import(
        /* webpackChunkName: "dataview_design_private" */ "./settingDataOrigin.vue"
      )
    ) },
  methods: {
    yes() {
      let vm = this.owner.$children[0];
      vm.middleWareData(vm.serviceData);
    },
  },
};
</script>
