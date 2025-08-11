<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-11-11 13:36:19
 * @LastEditors: shenah
 * @LastEditTime: 2024-05-08 17:42:45
-->
<template>
  <div class="des-dv-map-relation-setting">
    <SettingDataOrigin
      class="data-setting"
      :owner="owner"
      @update-field-list="clearMapFieldList"
    ></SettingDataOrigin>
    <MapRelationTableTM
      ref="mapRelationTableTMRef"
      class="map-relation-table-tm"
      v-model="optionsList"
      :owner="owner"
      :config="config"
      @clearMapFieldList="clearMapFieldList"
    ></MapRelationTableTM>
  </div>
</template>
<script>

const SettingDataOrigin = Vue.defineAsyncComponent(() =>
  import(/* webpackChunkName: "dataview_design_private" */ "../settingDataOrigin.vue")
)
const MapRelationTableTM = Vue.defineAsyncComponent(() =>
  import(/* webpackChunkName: "dataview_design_private" */ "./mapRelationTableTM.vue")
)

export default {
  name: "DesDVMapRelationSetting",
  mixins: [$mixins.propertyDialogSetting],
  components: { SettingDataOrigin, MapRelationTableTM },
  data() {
    return {
      optionsList: [],
    };
  },
  mounted() {
    this.handleData();
  },
  methods: {
    handleData() {
      this.$nextTick(() => {
        this.optionsList = this.currentData;
        this.oldDataType = this.owner.dataType;
      });
    },
    yes() {
      const mapRelationTableTMRef = this.$refs.mapRelationTableTMRef;
      if (mapRelationTableTMRef) {
        mapRelationTableTMRef.beforeYes();
      }
      dsf.emit.$remove("reloadFields", this.owner.$children[0]);
      return [...this.optionsList];
    },
    clearMapFieldList() {
      let vm = this.owner.$children[0];
      console.log(this.optionsList)
      this.optionsList.forEach((item) => {
        item.map = "";
        item.value = "";
      });
      vm.mapRelations.forEach((item) => {
        item.map = "";
        item.value = "";
      });
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapRelationSetting.scss";
</style>
