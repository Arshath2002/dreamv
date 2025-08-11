<!--
 * @Description: 大屏分页组件
 * @Author: shenah
 * @Date: 2024-01-31 15:39:50
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-03 15:23:22
-->

<template>
  <div
    class="data-view-pagination data-view-select-theme"
    :style="paginationStyle"
  >
    <!-- 常规 -->
    <div class="default-page" v-if="config.selectStyle === 'default'">
      <el-pagination
        background
        :layout="pageBtnList"
        :current-page="current"
        :total="total"
        :page-size="config.pageSize"
        @current-change="currentChange"
      >
        <div class="page-slot">
          <DsfIcon name="revoke" @click="reset"></DsfIcon>
          <DsfIcon
            name="shuaxin1"
            @click="refresh"
            v-if="allowPageDataType"
          ></DsfIcon>
        </div>
      </el-pagination>
    </div>
    <!-- 简约 -->
    <div v-else-if="config.selectStyle === 'simple'" class="simple-page">
      <!-- 上一页 -->
      <div class="prev-page" @click="prevPage" :class="prevPageClass">
        上一页
      </div>
      <el-dropdown trigger="click">
        <div class="current-page">
          <span> {{ currentLabel }} </span>
          <DsfIcon name="xiajiantou"></DsfIcon>
        </div>
        <el-dropdown-menu
          slot="dropdown"
          :class="[
            'data-view-select-theme__popper',
            themeStyleName,
            'data-view-pagination-dropdown',
          ]"
        >
          <div class="scroller">
            <el-dropdown-item v-for="(row, index) in pageList" :key="index">
              <div
                class="page-item"
                @click="pageClick(row)"
                :style="pageItemStyle"
              >
                {{ row.label }}
              </div>
            </el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 下一页 -->
      <div class="next-page" @click="nextPage" :class="nextPageClass">
        下一页
      </div>
    </div>
    <!-- 箭头 -->
    <div
      class="arrow-page"
      v-else-if="config.selectStyle === 'arrow'"
      :style="arrowPageStyle"
    >
      <div
        class="common-page prev-page"
        :style="getCommonPageStyle"
        :class="getCommonPageClass('prev')"
        @click="prevPage"
      >
        <DsfIcon :name="getArrowTypeClass"></DsfIcon>
      </div>
      <div
        class="common-page next-page"
        :style="nextPageStyle"
        :class="getCommonPageClass('next')"
        @click="nextPage"
      >
        <DsfIcon  :name="getArrowTypeClass"></DsfIcon>
      </div>
    </div>
  </div>
</template>

<script>
import themeMixin from "_dataview/mixins/moreThemeMixin.js";
export default {
  name: "pagination",
  components: {},
  mixins: [themeMixin],
  data() {
    return {
      current: 1,
      pageList: [],
    };
  },
  props: {
    queryParam: {
      type: Object,
    },
    config: {
      type: Object,
    },
    total: {
      type: Number,
    },
    allowPageDataType: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    prevPageDisable() {
      if (!this.pageList.length) {
        return true;
      }
      return this.current <= 1;
    },
    nextPageDisable() {
      if (!this.pageList.length) {
        return true;
      }
      return this.current === this.pageList.length;
    },
    prevPageClass() {
      return this.prevPageDisable ? "disabled" : "";
    },
    nextPageClass() {
      return this.nextPageDisable ? "disabled" : "";
    },
    pageBtnList() {
      if (!this.config.btnList) {
        return "";
      }
      return this.config.btnList
        .filter((item) => item.show)
        .map((item) => item.value)
        .join(", ");
    },
    paginationStyle() {
      let margin = dsf.dataview.utils.transformArrayPx(this.config.margin);
      let padding = dsf.dataview.utils.transformArrayPx(this.config.padding);
      return {
        margin,
        padding,
        height: dsf.dataview.utils.transformPx(this.config.height),
        justifyContent: this.config.hAlign,
        alignItems: this.config.vAlign,
        fontFamily: this.config.fontFamily,
      };
    },
    currentLabel() {
      let obj =
        this.pageList.find((item) => item.value === this.current)?.label ||
        "第0页";
      return obj;
    },
    pageItemStyle() {
      return {
        fontFamily: this.config.fontFamily,
      };
    },
    arrowPageStyle() {
      let style = {
        flexDirection: this.config.arrowDirection,
      };
      return style;
    },
    getCommonPageClass: (self) => {
      return (type) => {
        let str = self.config.arrowType;
        let nowStr = type === "prev" ? self.prevPageClass : self.nextPageClass;
        return `${str} ${nowStr}`;
      };
    },
    getArrowTypeClass() {
      let icon =
        this.config.arrowType === "circle"
          ? "weibiaoti34"
          : "arrow-right";
      return icon;
    },
    getCommonPageStyle() {
      let style = {
        borderRadius: this.config.arrowType === "circle" ? "50%" : "4px",
      };
      return style;
    },
    nextPageStyle() {
      let style = {
        ...this.getCommonPageStyle,
      };
      let arrowDistance = dsf.dataview.utils.transformPx(
        this.config.arrowDistance
      );
      if (this.config.arrowDirection === "row") {
        style.marginLeft = arrowDistance;
      } else {
        style.marginTop = arrowDistance;
      }
      return style;
    },
  },
  watch: {
    "config.pageSize"() {
      this.sizeChange();
      this.calcPage();
    },
    "config.selectStyle"() {
      this.calcPage();
      this.$emit("pageChange", this.getQueryParam());
    },
    total() {
      this.calcPage();
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.calcPage();
    },
    calcPage() {
      this.current = this.total ? 1 : 0;
      if (this.config.selectStyle !== "default") {
        let total = this.total;
        let pageSize = this.config.pageSize;
        let pageCount = Math.ceil(total / pageSize);
        let list = [];
        for (let i = 1; i <= pageCount; i++) {
          list.push({
            value: i,
            label: `第${i}页`,
          });
        }
        this.pageList = list;
      }
    },
    pageClick(item) {
      // 页码改变
      this.current = item.value;
      this.$emit("pageChange", this.getQueryParam());
    },
    currentChange(page) {
      // 页码改变
      this.current = page;
      this.$emit("pageChange", this.getQueryParam());
    },
    sizeChange() {
      this.current = 1;
      this.$emit("pageChange", this.getQueryParam());
    },
    // 重置
    reset() {
      this.current = 1;
      this.$emit("pageChange", this.getQueryParam());
    },
    // 刷新
    refresh() {
      this.$emit("pageChange", this.getQueryParam());
    },
    prevPage() {
      if (!this.prevPageDisable) {
        this.current -= 1;
        this.$emit("pageChange", this.getQueryParam());
      }
    },
    nextPage() {
      if (!this.nextPageDisable) {
        this.current += 1;
        this.$emit("pageChange", this.getQueryParam());
      }
    },
    getQueryParam() {
      let queryParam = {
        pageNum: this.current,
        pageSize: this.config.pageSize,
      };
      return queryParam;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/pagination.scss";
</style>
