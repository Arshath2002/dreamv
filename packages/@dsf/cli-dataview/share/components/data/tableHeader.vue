<template>
  <div class="header" v-if="isShowHeader && header.length && config" :style="[getHeaderWrapItem, getHeaderColor]">
    <div class="header-item" v-show="!it.hide" v-for="(it, i) in header" :key="it.id" :style="[getHeaderItem(it, i, header)]">
      <template v-if="it.children && it.children.length > 0">
        <slot :name="it.headerSlotName" :header="it">
          <span class="header-name" :title="it.label" :style="getHeaderNameStyle(it)">{{ it.label }}</span>
        </slot>
        <TableHeader
          :header="it.children"
          :isChildren="true"
          :themeStyleName="themeStyleName"
          :isShowHeader="isShowHeader"
          :getHeaderWrapItem="getHeaderWrapItem"
          :getFilterItemStyle="getFilterItemStyle"
          :getHeaderNameStyle="getHeaderNameStyle"
          :getHeaderItem="getHeaderItem"
          :config="config"
          :handleSort="handleSort"
          :headerBGC="headerBGC"
          :getIconFilterItemStyle="getIconFilterItemStyle"
        >
          <template v-for="slotName in Object.keys($slots)"  v-slot:[slotName]>
            <slot :name="slotName"></slot>
          </template>
        </TableHeader>
      </template>
      <template v-else>
        <slot :name="it.headerSlotName" :header="it">
          <span class="header-name" :title="it.label" :style="getHeaderNameStyle(it)">{{ it.label }}</span>
          <el-dropdown trigger="click" v-if="componentType === 'largeTable' && it.isSort && it.filterIcon === 'filter'" class="filter-list-btn">
            <span class="el-dropdown-link">
              <DsfIcon name="filter" class="common-icon-btn" :style="getFilterItemStyle(it)"/>
            </span>
            <el-dropdown-menu slot="dropdown" :class="[themeStyleName, 'data-view-select-theme']">
              <el-dropdown-item>
                <div @click="handleSort('asc', it)">升序</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="handleSort('desc', it)">降序</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="handleSort('default', it)">默认</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="sort" v-else-if="it.isSort && it.filterIcon === 'arrow'">
            <i class="el-icon-caret-top common-sort-icon sort-top" :style="getIconFilterItemStyle(it, 'asc')" @click="handleSort('asc', it)"></i>
            <i class="el-icon-caret-bottom common-sort-icon sort-down" :style="getIconFilterItemStyle(it, 'desc')" @click="handleSort('desc', it)"></i>
          </div>
        </slot>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableHeader",
  props: {
    isChildren: {
      type: Boolean,
      default: false,
    },
    themeStyleName: {
      type: String,
      default: "",
    },
    componentType: {
      type: String,
      default: "largeTable",
    },
    header: {
      type: Array,
      default: () => {
        return [];
      },
    },
    headerBGC: {
      type: String,
      default: "",
    },
    handleSort: {
      type: Function,
      default: null,
    },
    widths: {
      type: Array,
      default: () => {
        return [];
      },
    },
    getHeaderWrapItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
    getFilterItemStyle: {
      type: Function,
      default: null,
    },
    getIconFilterItemStyle: {
      type: Function,
      default: null,
    },
    getHeaderNameStyle: {
      type: Function,
      default: null,
    },
    isShowHeader: {
      type: Boolean,
      default: true,
    },
    getHeaderItem: {
      type: Function,
      default: null,
    },
    config: {
      type: Object,
      default() {
        return {
          rowNum: 5,
          fixEachRowHeight: 132,
          waitTime: 2000,
          headerHeight: 35,
          slotHeight: 0,
          fixEachRowType: "rowNum",
          index: false,
          indexHeader: "序号",
          indexWidth: 50,
          carousel: "single",
          hoverPause: true,
          fixEachRowHeightFlag: true,
        };
      },
    },
  },
  computed: {
    getHeaderColor() {
      let obj = {};
      !this.isChildren && (obj["background"] = this.headerBGC);
      return obj;
    },
  },
  mounted() {
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped></style>
