<!--
 * @Editor: zhanghang
 * @Description:多级菜单 
 * @Date: 2024-10-17 10:44:50
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-06 16:04:16
-->
<template>
  <div class="des-dv-cascade-menu-editor">
    <div class="left">
      <div class="design-column-edit">
        <dsf-virtual-scroll>
          <el-tree
            ref="tree"
            :data="treeData"
            :highlight-current="true"
            :expand-on-click-node="false"
            :render-after-expand="true"
            :default-expand-all="true"
            node-key="id"
            :props="defaultProps"
            @node-click="nodeClick"
          >
            <span slot-scope="{ node, data }" class="dv-custom-tree-node">
              <span :class="{ 'tree-label-root': data.isRoot }">
                <template v-if="data.valueShowType === 'img'">
                  <img
                    class="dv-custom-tree-node__img"
                    v-if="data.valueImgObj && data.valueImgObj.defaultValue"
                    :style="handleImgAn(data.valueImgObj.defaultValue)"
                    :src="handleImgSrcStr(data.valueImgObj.defaultValue)"
                  />
                </template>
                <DsfIcon v-if="data.valueShowType === 'icon' && data.valueIconObj" :name="data.valueIconObj.defaultValue" />

                {{ node.label }}
              </span>
              <span>
                <dsf-button title="添加子项" size="small" btn-style="icon-text" icon="hao" @click.stop="append(data)" />
                <template v-if="!data.isRoot">
                  <dsf-button title="删除" size="small" btn-style="icon-text" icon="guanbi2" @click.stop="remove(node)" />
                  <dsf-button title="上移" size="small" btn-style="icon-text" icon="shang" @click.stop="up(node)" />
                  <dsf-button title="下移" size="small" btn-style="icon-text" icon="xia" @click.stop="down(node)" />
                </template>
                <template v-else>
                  <dsf-button title="删除" size="small" btn-style="icon-text" icon="guanbi2" style="color: #c0c0c0" />
                  <dsf-button title="上移" size="small" btn-style="icon-text" icon="shang" style="color: #c0c0c0" />
                  <dsf-button title="下移" size="small" btn-style="icon-text" icon="xia" style="color: #c0c0c0" />
                </template>
              </span>
            </span>
          </el-tree>
        </dsf-virtual-scroll>
      </div>
    </div>
    <div class="right">
      <MenuEditorList :menuData="subMenuList" :menuType="menuType" :hasIcon="menuType != 'gauge'" :owner="owner" :designer="designer" @changeMenuData="changeMenuData" />
    </div>
  </div>
</template>
<script>
import { createMenuItem } from "_dataview/output/config/commonConfig";
import menuEditorMixin from "./menuEditorMixin.js";
import MenuEditorList from "./MenuEditorList.vue";
export default {
  name: "DesDVCascadeMenuEditor",
  mixins: [$mixins.propertyDialogSetting, menuEditorMixin],
  components: { MenuEditorList },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
      treeData: [
        {
          id: "root",
          name: "菜单设置",
          isRoot: true,
          children: [],
        },
      ],
      // 子级菜单列表
      subMenuList: [],
      rootId: null,
      menuType: "nav",
    };
  },

  created() {
    this.treeData[0].children = this.currentData;
    this.subMenuList = this.currentData;
    this.rootId = this.treeData[0].id;
    this.menuType = this.config.menuType || "nav";

  },
  mounted() {
    this.$refs.tree.setCurrentKey("root");
  },
  methods: {
    yes() {
      return this.treeData[0].children;
    },
    changeMenuData(data) {
      const id = this.rootId;
      const _private = (list) => {
        for (let i = 0; i < list.length; i++) {
          const it = list[i];
          if (it.id === id) {
            this.$set(it, "children", data);
            break;
          } else if (it.children) {
            _private(it.children);
          }
        }
      };
      _private(this.treeData);
      this.subMenuList = data;
    },
    nodeClick(data, node) {
      if (!data.children) {
        this.$set(data, "children", []);
      }
      this.rootId = data.id;
      this.subMenuList = data.children;
    },
    append(parentData = this.treeData[0]) {
      const column = createMenuItem({ name: "新建" }, this.menuType);
      if (!parentData.children) {
        this.$set(parentData, "children", []);
      }
      parentData.children.push(column);
    },
    remove(node) {
      let parentNode = node.parent;
      dsf.array.remove(parentNode.data.children, node.data);
      this.$forceUpdate();
    },
    up(node) {
      sort.call(this, node, "up");
    },
    down(node) {
      sort.call(this, node, "down");
    },
    handleImgSrcStr(obj) {
      return dsf.dataview.utils.compatiblePathToExtendShowImg(obj);
    },
    handleImgAn(obj) {
      return dsf.dataview.utils.getBgAnimation(obj);
    },
  },
};
function sort(node, type) {
  let parentNode = node.parent;
  let index = parentNode.childNodes.indexOf(node);
  let mark = type == "up" ? index > 0 : index <= parentNode.childNodes.length - 1;
  if (mark) {
    let targetIndex = type == "up" ? index - 1 : index + 1;
    let target = parentNode.childNodes[targetIndex];
    this.$set(parentNode.data.children, targetIndex, node.data);
    this.$set(parentNode.data.children, index, target.data);
    this.$set(parentNode.childNodes, targetIndex, node);
    this.$set(parentNode.childNodes, index, target);
  }
}
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVCascadeMenuEditor.scss";
</style>
