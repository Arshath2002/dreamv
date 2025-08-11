/*
 * @Description:
 * @Author: shenah
 * @Date: 2024-05-08 14:46:42
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 17:06:10
 */
export default {
  provide() {
    return {
      owner: this.owner,
    };
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    owner: {
      type: Object,
      require: true,
    },
    mapFieldList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    config() {
      let config = this.data.config;
      return config || {};
    },
  },
  data() {
    return {
      chart: this.owner.chart,
    };
  },
  created() {
    this._updateChart = _.debounce(this.updateChart, 500);
  },
  mounted() {
    //在数据配置完成时候，接受一次最新的chart
    dsf.emit.$on(
      "updatePropertyChart",
      () => {
        this.chart = this.owner.chart;
        this.updatePropertyChartCallBack();
      },
      this.owner.$children[0]
    );
  },
  beforeDestroy() {
    dsf.emit.$remove("updatePropertyChart", this.owner.$children[0]);
  },
  methods: {
    updatePropertyChartCallBack() {},
    updateChart() {
      dsf.emit.$emit(
        "updateChart",
        {
          chart: this.chart,
        },
        [this.owner.$children[0]]
      );
    },
    // 获取映射字段的中文值
    getFieldName(val) {
      return this.mapFieldList.find((item) => item.value === val)?.name || val;
    },
  },
};
