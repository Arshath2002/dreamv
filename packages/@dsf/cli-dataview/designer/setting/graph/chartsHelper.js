/*
 * @Editor: zhanghang
 * @Description: 图表映射字段
 * @Date: 2024-04-17 15:55:29
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-04-26 17:44:38
 */

export default {
  provide() {
    return {
      owner: this.owner,
      mapFieldList: () => this.mapFieldList,
    };
  },
  data() {
    return {
      //映射列表
      mapFieldList: [],
      chartOptions: {},
    };
  },
  computed: {
    dataType() {
      return this.owner.$children[0].dataType;
    },
  },
  created() {
    //兼容以前版本
    this.reloadFieldList();

    //重新使用字符串计算chart对象
    this.chartOptions = dsf.eval(this.owner.chartString);
    //挂载wholeOptions 静态设置使用
    this.owner.$$wholeOptions = this.chartOptions;
    dsf.emit.$on(
      "reloadFields",
      (args) => {
        //是否清空映射值
        if (args && args.clear) {
          this.clearMapFieldList();
        }
        this.$nextTick(() => {
          this.reloadFieldList();
        });
      },
      this.owner.$children[0]
    );
  },
  beforeDestroy() {
    dsf.emit.$remove("reloadFields", this.owner.$children[0]);
    Reflect.deleteProperty(this.owner, "$$wholeOptions");
  },
  methods: {
    //获取下一个色值
    getNextColor() {
      let colors = this.chartOptions.color;
      const series = this.chartOptions.series;
      let len = series.length;
      let next = colors[len % colors.length];
      let exits = series.map((data) => data.itemStyle.color);
      let recurveIndex = 0;
      while (exits.includes(next) && recurveIndex < 50) {
        len++;
        recurveIndex++;
        next = colors[len % colors.length];
      }
      return next;
    },
    //读取映射字段
    reloadFieldList() {
      this.mapFieldList = this.owner.$children[0].getDesignerMapFieldList();
    },
    dealChartOption(vm) {
      vm.chartString = dsf.dataview.utils.objectToString(
        this.chartOptions,
        true
      );
      //在option 获取之后执行
      setTimeout(() => {
        vm.$children[0].middleWareData(vm.$children[0].serviceData);
        //更新右侧属性值
        this.$nextTick(() => {
          dsf.emit.$emit("updatePropertyChart", {}, [this.owner.$children[0]]);
        });
      });
    },
    // 获取映射字段的中文值
    getFieldName(val) {
      return this.mapFieldList.find((item) => item.value === val)?.name || val;
    },
    yes() {
      //处理图表chart字符串
      this.dealChartOption(this.owner);
      return this.chartOptions;
    },
  },
};
