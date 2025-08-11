<template>
  <div class="dv-designer-left-tools">
    <el-tabs v-model="$layout.toolsBox.activeName" stretch class="dv-designer-left-tools-tabs" :class="{ 'hide-tabs': $layoutTabs.length == 1 }">
      <el-tab-pane v-for="tab in $layoutTabs" :key="tab.name" :label="tab.label" :name="tab.name">
        <template v-slot:label>
          <div style="padding-left: 4px" class="tab-label" :class="{ 'is-active': tab.name === $layout.toolsBox.activeName }">{{ tab.label }}</div>
        </template>

        <div class="dv-design-search-box">
          <el-input size="small" v-model="leftSearchInput" class="design-search-input" clearable> </el-input>
        </div>
        <div class="dv-design-ctrl-box">
          <div class="dv-design-ctrl-box-inner">
            <!--控件组-->
            <dsf-virtual-scroll v-if="tab.name === 'controls' && $layout.toolsBox.activeName == 'controls'">
              <el-collapse v-for="(group, $index) in $useControlsGroup" :key="$index" v-model="controlActiveName" accordion>
                <el-collapse-item :name="group.title">
                  <template slot="title">
                    <div :title="group.title" class="ellipsis">
                      {{ group.title }}
                    </div>
                    <DsfIcon name="dsf-icon-close" class="remove-item-icon" @click.stop="removeControlGroup(group)"></DsfIcon>
                  </template>
                  <div class="ds-tools-group-content" v-if="controlActiveName === group.title">
                    <designer-drag-item-business v-for="(item, index) in group.items" v-show="isShow(item)" :key="index" :data="item"></designer-drag-item-business>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </dsf-virtual-scroll>
            <!-- 业务组件 -->
            <dsf-virtual-scroll v-else-if="tab.name === 'business' && $layout.toolsBox.activeName == 'business'">
              <el-collapse v-for="(group, $index) in $useBusinessControlGroup" :key="$index" v-model="businessActiveName" accordion>
                <el-collapse-item :name="group.title">
                  <template slot="title">
                    <div :title="group.title" class="ellipsis">
                      {{ group.title }}
                    </div>
                    <DsfIcon name="dsf-icon-close" class="remove-item-icon" @click.stop="removeControlGroup(group)"></DsfIcon>
                  </template>
                  <div class="ds-tools-group-content" v-if="businessActiveName === group.title">
                    <designer-drag-item-business v-for="(item, index) in group.items" v-show="isShow(item)" :key="index" :data="item"></designer-drag-item-business>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </dsf-virtual-scroll>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DesignerDragItemBusiness from "./DsfDragItemBusiness.vue";

export default {
  name: "DsfDataViewDesignerLeftTools",

  inject: {
    $designer: {
      default: null,
    },
  },
  updated() {
    this.$designer.initToolDrag();
  },
  props: {
    layout: {
      type: Object,
    },
  },
  components: { DesignerDragItemBusiness },
  computed: {
    showControlGroup() {
      return this.$designer.showControlGroup;
    },
    $layout() {
      return this.layout;
    },
    $layoutTabs() {
      let tabs = this.$layout.toolsBox.tabs || [];
      return this.showControlGroup ? tabs : [];
    },

    // 基本控件组
    $useControlsGroup() {
      return this.getFilterResult(this.$designer.getUseControlsGroup);
    },
    // 业务控件组
    $useBusinessControlGroup() {
      return this.getFilterResult(this.$designer.getBusinessControlGroup);
    },
  },
  data() {
    return {
      leftSearchInput: "",
      controlActiveName: "",
      businessActiveName: "",
    };
  },

  methods: {
    isShow(item) {
      let prototype = this.$designer.currPageMode == dsf.enums.viewMode.PROTOTYPE;
      let name = item.name;
      let isMatchName = false;
      if (!this.leftSearchInput) {
        isMatchName = true;
      } else {
        isMatchName = name ? name.indexOf(this.leftSearchInput) >= 0 : item?.id?.indexOf(this.leftSearchInput) >= 0;
      }
      let isMatchMode = false;
      if (item.mode) {
        if (prototype) {
          isMatchMode = (item.mode || []).indexOf("原型模式") >= 0;
        } else {
          isMatchMode = (item.mode || []).indexOf("研发模式") >= 0;
        }
      } else {
        isMatchMode = true;
      }

      return isMatchName && isMatchMode;
    },

    /**
     * @param {Array} list 组件列表
     *
     */
    getFilterResult(list) {
      const groups = [];
      _.each(list, (g) => {
        let ng = dsf.mix(true, {}, g);
        ng.items = [];
        _.each(g.items, (it) => {
          if (this.isShow(it)) {
            ng.items.push(it);
          }
        });
        if (ng.items.length) {
          groups.push(ng);
        }
      });
      return groups;
    },
    removeControlGroup(group) {
      this.$designer.removeControlGroup(group);
    },
  },
};
</script>
