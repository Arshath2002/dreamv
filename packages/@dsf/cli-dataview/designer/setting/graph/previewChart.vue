<!--
 * @Description: 供配置预览
 * @Author: zhanghang
 * @Date: 2021-07-21 17:05:39
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-04-08 14:28:11
-->
<template>
  <div class="pre-chart" :style="getPreChartStyle">
    <div class="chart" ref="prechart" style="height: 100%"></div>
  </div>
</template>
<script>
export default {
  props: {
    bg: {
      type: String,
      default: "rgba(14, 85, 205, 0.1)",
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    getPreChartStyle() {
      return {
        backgroundColor: this.bg,
      };
    },
  },
  watch: {
    options: {
      handler(val) {
        if (this.chart) {
          // 清除之前的图形重新绘制
          this.chart.clear();
          this.chart.setOption(this.options, true);
        }
      },
      deep: true,
    },
  },
  mounted() {
    let charts = window.$echarts || window.echarts;
    this.chart = charts.init(this.$refs["prechart"]);
    let chart = this.chart;
    chart.setOption(this.options, true);

    try {
      chart.off("georoam");
    } catch (error) {
      console.log(error);
    }

    const _this = this;
    //geo 同步缩放
    chart.on("georoam", (params) => {
      var option = chart.getOption(); //获得option对象

      if (params.zoom != null && params.zoom != undefined) {
        //捕捉到缩放时
        option.geo[0].zoom = option.series[0].zoom; //下层geo的缩放等级跟着上层的map一起改变
        option.geo[0].center = option.series[0].center; //下层的geo的中心位置随着上层map一起改变
      } else {
        //捕捉到拖曳时
        option.geo[0].center = option.series[0].center; //下层的geo的中心位置随着上层map一起改变
      }
      if (this.options.series[0].isDrag) {
        const debounceFc = _.debounce(() => {
          this.$emit("georoam-center", option);
        }, 500);
        debounceFc();
      }
      chart.setOption(option); //设置option
    });
  },
};
</script>
