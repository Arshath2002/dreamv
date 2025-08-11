<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-05-16 09:47:06
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-06 11:20:47
-->
<template>
  <MenuEditorList :menuData="menuData" :iconImageType="config.iconImageType || 'both'" :owner="owner" :designer="designer" @changeMenuData="changeMenuData" />
</template>
<script>
import MenuEditorList from "./MenuEditorList.vue";
export default {
  name: "DesDVCommonMenuEditor",
  mixins: [$mixins.propertyDialogSetting],
  components: { MenuEditorList },
  data() {
    return {
      menuData: [],
    };
  },
  created() {
    this.menuData = this.currentData || [];
       
  },
  methods: {
    changeMenuData(data) {
      this.menuData = data;
    },
    yes() {
      return this.menuData;
    },
  },
};
</script>

