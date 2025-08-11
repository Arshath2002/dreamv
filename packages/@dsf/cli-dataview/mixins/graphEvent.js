
export default {
  methods: {
    //添加指标
    handleAddGraphItem(seriesName, data) {
      if (arguments.length == 1 && typeof seriesName == 'object') {
        this.chart.series.push(seriesName)
        let legend = this.chart.legend
        let name = seriesName.name
        let last = legend.data[legend.data.length - 1]
        if (last) {
          let icon = last.icon
          legend.data.push({ name, icon })
        } else {
          legend.data.push({ name, icon: '' })
        }

      } else if (arguments.length == 2 && typeof seriesName == 'string') {
        let seriesItem = this.chart.series.find(it => it.name === seriesName)
        seriesItem && seriesItem.data.push(data)
      }
      this.reset()
      return this
    },
    //设置标题
    handleTitle(name) {
      let title = this.chart?.title
      if (title) {
        title.text = name
        this.reset()
      }
      return this
    },
    //删除指标
    handleDeleteGraphItem(seriseName, name) {
      if (arguments.length == 1 && typeof seriseName == 'string') {
        let index = this.chart.series.findIndex(it => it.name === seriseName)
        index > -1 && this.chart.series.splice(index, 1)
      } else if (arguments.length == 2 && typeof name == 'string') {
        let seriesItem = this.chart.series.find(it => it.name === seriseName)
        let data = (seriesItem && seriesItem.data)
        if (Array.isArray(data)) {
          let index = data.findIndex(it => it.name === name)
          index > -1 && data.splice(index, 1)
        }
      }
      this.reset()
      return this
    },
    //获取宽度
    handleGetWidth() {
      return this.chartObj ? this.chartObj.getWidth() : this.$el.clientWidth
    },
    //获取高度
    handleGetHeight() {
      return this.chartObj ? this.chartObj.getHeight() : this.$el.clientHeight
    },
    //获取配置项
    handleGetOption() {
      return this.chartObj ? this.chartObj.getOption() : {}
    },
    //设置配置项
    handleSetOption(option) {
      if (this.chartObj) {
        let _option = this.chartObj.getOption()
        dsf.mix(_option, option);
        this.chartObj.setOption(_option)
      }
      return this
    },
    //设置宽度
    handleSetWidth(width) {
      width = dsf.dataview.utils.transformPx(width)
      this.$el.style.width = width
      this.$nextTick(this.resize)
      return this
    },
    //设置高度
    handleSetHeight(height) {
      height = dsf.dataview.utils.transformPx(height)
      this.$el.style.height = height
      this.$nextTick(this.resize)
      return this
    },
    // 设置动态图表
    handleSetdynamicChart(interval) {
      let newInteval = parseFloat(interval);
      switch (true) {
        case !interval:
          // 默认时间设置
          newInteval = 1000;
          break;
        case isNaN(newInteval):
          // 设置时间不正确
          dsf.layer.message('当前时间设置格式不正确', false);
          return;
        default:
          break;
      }
      this.$emit('update:timeline', true);
      this.$emit('update:timelineTimeDistance', newInteval);
      this.reset();
      return this;
    },
    // 还原数据
    fakeRestoreData() {
      return this.beforeInit();
    },
  }
}