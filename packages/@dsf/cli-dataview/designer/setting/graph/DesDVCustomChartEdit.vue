<!--
 * @Description: 自定义图表配置编辑器
 * @Author: zhanghang
 * @Date: 2021-07-21 14:43:48
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-27 14:59:05
-->
<template>
  <div class="des-dv-custom-chart-edit">
    <div
      class="des-dv-custom-chart-edit__header"
      v-if="config.type === 'drawer'"
    >
      <DsfButton
        icon="icon-yunhang"
        size="small"
        @click="runCode"
      >运行</DsfButton
      >
      <span
      ><DsfIcon
        name="dsf-icon-zitidaima"
        @click="formatCode"
        title="格式化"
        class="btn-item"
      /></span>
      <!-- 图表 -->
      <template v-if="vm.componentType === 'chart'">
        <el-popover
          placement="right"
          width="400"
          trigger="hover"
          popper-class="dsf-dv-document-popper"
        >
          <div class="link-list">
            <div
              class="link-item"
              v-for="(item, index) in documentList"
              :key="index"
            >
              <div class="title">{{ item.title }}</div>
              <div class="text-link-wrap">
                <el-link
                  :type="item.colorType"
                  class="text-link-item"
                  v-for="link in item.list"
                  :key="link.href"
                  @click.stop="openDoc(link.href)"
                >{{ link.name }}
                </el-link>
              </div>
            </div>
          </div>
          <DsfIcon
            slot="reference"
            name="dsf-icon-help"
            title="帮助"
            class="btn-item"
            style="position: relative; left: -10px"
          />
        </el-popover>
      </template>
    </div>
    <MonacoEditor
      ref="editor"
      class="des-dv-custom-chart-edit__monaco"
      height="100%"
      width="100%"
      :language="'javascript'"
      @mounted="editorLoaded"
    ></MonacoEditor>
  </div>
</template>
<script>
export default {
  name: "DesDVCustomChartEdit",
  mixins: [$mixins.propertyDialogSetting],
  props: {
    //图表的静态数据使用
    isPartly: {
      type: Boolean,
      default: false,
    },
    // 支持抽屉模式
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    vm() {
      return this.owner.$children[0];
    },
  },
  data() {
    return {
      wholeOptions: {},
      tmp: "",
      documentList: [
        {
          title: "整体文档",
          colorType: "primary",
          list: [
            {
              name: "图表官网",
              href: "https://echarts.apache.org/zh/index.html",
            },
            {
              name: "示例",
              href: "https://echarts.apache.org/examples/zh/index.html",
            },
            {
              name: "配置项总览",
              href: "https://echarts.apache.org/zh/option.html",
            },
          ],
        },
        {
          title: "系列配置",
          colorType: "danger",
          list: [
            {
              name: "折线",
              href: "https://echarts.apache.org/zh/option.html#series-line",
            },
            {
              name: "柱状",
              href: "https://echarts.apache.org/zh/option.html#series-bar",
            },
            {
              name: "饼状",
              href: "https://echarts.apache.org/zh/option.html#series-pie",
            },
            {
              name: "散点",
              href: "https://echarts.apache.org/zh/option.html#series-scatter",
            },
            {
              name: "雷达",
              href: "https://echarts.apache.org/zh/option.html#series-radar",
            },
            {
              name: "树图",
              href: "https://echarts.apache.org/zh/option.html#series-tree",
            },
            {
              name: "矩形树图",
              href: "https://echarts.apache.org/zh/option.html#series-treemap",
            },
            {
              name: "旭日图",
              href: "https://echarts.apache.org/zh/option.html#series-sunburst",
            },
            {
              name: "k线图",
              href:
                "https://echarts.apache.org/zh/option.html#series-candlestick",
            },
            {
              name: "地图",
              href: "https://echarts.apache.org/zh/option.html#series-map",
            },
            {
              name: "平行坐标系",
              href: "https://echarts.apache.org/zh/option.html#series-parallel",
            },
            {
              name: "关系图",
              href: "https://echarts.apache.org/zh/option.html#series-graph",
            },
            {
              name: "桑基图",
              href: "https://echarts.apache.org/zh/option.html#series-sankey",
            },
            {
              name: "漏斗图",
              href: "https://echarts.apache.org/zh/option.html#series-funnel",
            },
            {
              name: "仪表盘",
              href: "https://echarts.apache.org/zh/option.html#series-gauge",
            },
            {
              name: "象形图",
              href:
                "https://echarts.apache.org/zh/option.html#series-pictorialBar",
            },
          ],
        },
        {
          title: "属性",
          colorType: "success",
          list: [
            {
              name: "图例",
              href: "https://echarts.apache.org/zh/option.html#legend",
            },
            {
              name: "坐标系",
              href: "https://echarts.apache.org/zh/option.html#grid",
            },
            {
              name: "x轴",
              href: "https://echarts.apache.org/zh/option.html#xAxis",
            },
            {
              name: "y轴",
              href: "https://echarts.apache.org/zh/option.html#yAxis",
            },
            {
              name: "提示框",
              href: "https://echarts.apache.org/zh/option.html#tooltip",
            },
          ],
        },
      ],
    };
  },
  created() {
    let wholeOptions = dsf.mix(true, {}, this.currentData);

    let chartString = this.owner.chartString;
    //结束线----------------------

    if (this.isPartly) {
      wholeOptions = dsf.dataview.utils.objectToString(wholeOptions, true);
    } else {
      if (chartString) {
        wholeOptions = chartString;
      } else {
        wholeOptions = dsf.dataview.utils.objectToString(wholeOptions, true);
      }
    }

    let tmp = `(function () {
  return ${wholeOptions}
})()`;

    this.tmp = tmp;
  },
  methods: {
    yes() {
      const code = this.$refs["editor"].getContent();
      this.wholeOptions = eval(code);
      //不存在就对整个chart设置
      if (!this.isPartly) {
        setTimeout(() => {
          this.owner.reset();
          this.$nextTick(() => {
            dsf.emit.$emit("updatePropertyChart", {}, [
              this.owner.$children[0],
            ]);
          });
        }, 0);
      }

      return this.wholeOptions;
    },
    runCode() {
      const code = this.$refs["editor"].getContent();
      const chart = eval(code);
      this.owner.chart = chart;
      this.$nextTick(() => {
        this.owner.reset();
        dsf.emit.$emit("updatePropertyChart", {}, [this.owner.$children[0]]);
      });
    },
    formatCode() {
      try {
        let { editor } = this.$refs["editor"];
        editor.trigger("anyString", "editor.action.formatDocument");
      } catch (error) {
        console.log(error);
      }
    },
    editorLoaded() {
      this.$nextTick(() => {
        let str = this.tmp;
        let { editor } = this.$refs["editor"];
        this.$refs["editor"].setContent(str);
        editor.trigger("anyString", "editor.action.formatDocument");
      });
    },
    openDoc(href){
      window.open(href, "_blank");
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVCustomChartEdit.scss";
</style>

