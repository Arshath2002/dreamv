// 动态图表生成文件
export default {
  // 动态图表控制参数
  props: {
    // 是否显示动态图表
    timeline: {
      type: Boolean,
      default: false
    },
    // 水平对齐
    timelineAlign: {
      type: String,
      default: 'left'
    },
    // 垂直对齐
    timelineVAlign: {
      type: String,
      default: 'bottom'
    },
    // 播放按钮大小
    timelineSize: {
      type: Number,
      default: 24
    },
    // 是否显示播放按钮
    timelinePlayBtn: {
      type: Boolean,
      default: true
    },
    // 是否循环播放
    timelineLoop: {
      type: Boolean,
      default: true
    },
    // 间隔时间(毫秒)
    timelineTimeDistance: {
      type: Number,
      default: 1000
    },
    // 是否控制图表循环次数
    isTimelineControlTimes: {
      type: Boolean,
      default: false
    },
    // 图表循环次数
    timelineControlTimes: {
      type: Number,
      default: 1
    }
  },
  computed: {
    timelineOptions() {
      return {
        timelineControlTimes: this.timelineControlTimes,
        isTimelineControlTimes: this.isTimelineControlTimes,
        axisType: 'category',
        left: this.timelineAlign,
        top: this.timelineVAlign,
        width: this.timelineSize + 20,
        // 是否自动播放
        autoPlay: true,
        // 播放时间间隔
        playInterval: this.timelineTimeDistance,
        controlPosition: 'left',
        loop: this.timelineLoop,
        tooltip: {
          show: false
        },
        data: [], // 生成的进度条控制
        // 线条设置
        lineStyle: {
          show: false
        },
        // 背景色icon设置
        itemStyle: {
          color: 'transparent'
        },
        // 进度条icon的样式
        checkpointStyle: {
          symbolSize: 0,
        },
        // 保留播放键
        controlStyle: {
          showPlayBtn: this.timelinePlayBtn,
          showPrevBtn: false,
          showNextBtn: false,
          itemSize: this.timelineSize,
        },
        // 选中样式控制
        progress: {
          itemStyle: {
            color: 'transparent'
          },
          label: {
            show: false
          },
        },
        // 文字
        label: {
          show: false
        },
        // 高亮显示
        emphasis: {
          checkpointStyle: {
            symbolSize: 0,
          },
          itemStyle: {
            color: 'transparent'
          },
        }
      }
    }
  },
  watch: {
    timelineOptions() {
      this.$nextTick(() => {
        if (this.isDesign) {
          this.reset();
        }
      });
    },
    timeline: {
      handler(v) {
        if (this.chart) {
          this.reset();
        }
      },
    },
  },
  data() {
    return {
      timelineTimer: null
    }
  },
  beforeDestroy() {
    if (this.timelineTimer) {
      clearTimeout(this.timelineTimer);
    }
  },
  methods: {
    calculateTimeline(chart = this.chart) {
      //  采用5.0以上的版本数据格式来生成
      // timelineNumber
      const len = chart.series.length;
      if (this.timeline && len) {
        const series = chart.series;
        const type = series[0].type + (chart.xAxis ? '_cartesian2d' : (chart.polar ? '_polar' : ''));
        // 构造options中类目轴的数据格式
        // 构造series中的数据格式
        switch (type) {
          case 'graph':
          case 'pie':
            this.timelinePieAndGraph(chart);
            break
          // 直角坐标系
          case 'pictorialBar_cartesian2d':
          case 'scatter_cartesian2d':
          case 'custom_cartesian2d':
          case 'bar_cartesian2d':
          case 'line_cartesian2d':
            this.timelineLiyerAndLine(chart);
            break
          // 极坐标系
          case 'line_polar':
          case 'scatter_polar':
          case 'bar_polar':
            this.timelinePolarAll(chart);
            break
          default:
            break;
        }
        // 针对不需要循环播放，并且不能控制循环次数的逻辑处理，
        // 目的是为了修复echarts针对与custom属性的动态图表最后一组数据渲染不正确问题
        if (!this.isTimelineControlTimes && !this.timelineLoop) {
          this.controlTimesTimeAction(1, this.timelineTimeDistance, chart);
        }
        // 动态图表执行次逻辑
        this.autoControlTimesTime(chart);
      } else {
        // this.$emit("update:dataZoom", false);
        Reflect.deleteProperty(chart, 'timeline');
        // this.chart需要恢复到组装前的样式
        Reflect.deleteProperty(chart, 'options');
      }
    },
    // 折线和柱状图执行的方法
    timelineLiyerAndLine(chart) {
      // 当x轴和y轴都为类目轴时，不执行
      if (chart.xAxis[0].type === 'category' && chart.yAxis[0].type === 'category') {
        return;
      }
      let isXCategory = chart.xAxis[0].type === 'category';
      const timeline = this.timelineOptions;
      // 构造timeline数据结构
      timeline.data = isXCategory ? chart.xAxis[0].data : chart.yAxis[0].data;
      // this.$emit("update:dataZoom", true);
      // 构造x轴的数据和构造series的数据
      const sturctXdata = _.cloneDeep(timeline.data), sturctSeriesData = chart.series.map(item => item.data);

      const resultOptions = timeline.data.map((_, idx) => {
        const catagory = isXCategory ? { xAxis: [{ ...chart.xAxis[0], data: sturctXdata.slice(0, idx + 1) }] } : { yAxis: [{ ...chart.yAxis[0], data: sturctXdata.slice(0, idx + 1) }] };
        return {
          ...catagory,
          series: sturctSeriesData.map((it, index) => {
            return {
              ...this.chart.series[index],
              data: it.slice(0, idx + 1)
            }
          })
        }
      })

      chart.timeline = timeline;
      chart.options = resultOptions;
    },
    // 圆环动态图表所执行的方法
    timelinePieAndGraph(chart) {
      const series = chart.series;
      if (!series.length) {
        return;
      }
      let timelineStruct = [];
      series.forEach(item => {
        if (timelineStruct.length < item.data.length) {
          timelineStruct = item.data;
        }
      });
      const timeline = this.timelineOptions;
      // 构造timeline数据
      timeline.data = timelineStruct.map(item => item.name);
      const resultOptions = timeline.data.map((_, idx) => {
        return {
          series: series.map((it, index) => {
            return {
              ...chart.series[index],
              data: it.data.slice(0, idx + 1)
            }
          })
        }
      })
      chart.timeline = timeline;
      chart.options = resultOptions;
    },
    // 极坐标系
    timelinePolarAll(chart) {
      const timeline = this.timelineOptions;
      // 角度轴是类目轴 否则 径向轴是类目轴
      const isAngleCategory = chart.angleAxis.type === 'category';
      timeline.data = isAngleCategory ? chart.angleAxis.data : chart.radiusAxis.data;
      // 构造x轴的数据和构造series的数据
      const sturctXdata = _.cloneDeep(timeline.data), sturctSeriesData = chart.series.map(item => item.data);
      const resultOptions = timeline.data.map((_, idx) => {
        const catagory = isAngleCategory ? { angleAxis: { ...chart.angleAxis, data: sturctXdata.slice(0, idx + 1) } } : { radiusAxis: { ...chart.radiusAxis, data: sturctXdata.slice(0, idx + 1) } };
        return {
          ...catagory,
          series: sturctSeriesData.map((it, index) => {
            return {
              ...chart.series[index],
              data: it.slice(0, idx + 1)
            }
          })
        }
      })
      chart.timeline = timeline;
      chart.options = resultOptions;
    },
    // 控制动态图表次数函数
    autoControlTimesTime(chart) {
      // 控制图表循环次数为false，实际输入的次数小于或者等于0，不需要去执行
      if (!this.isTimelineControlTimes || this.timelineControlTimes <= 0) {
        return;
      }
      this.controlTimesTimeAction(this.timelineControlTimes, this.timelineTimeDistance, chart);
    },
    // 传入次数以及时间，根据数据，执行动态图表行为函数
    controlTimesTimeAction(controlTimes, timelineTimeDistance, chart) {
      // 计算最长次数
      let caculateTimes = 0;
      chart.series.forEach(it => {
        if (it.data && it.data.length) {
          caculateTimes = Math.max(caculateTimes, it.data.length);
        }
      })
      // 连续触发时，需要清除定时器
      if (this.timelineTimer) {
        clearTimeout(this.timelineTimer);
      }
      // 表示需要重新去执行setOptions，并把对应的timeline的loop改为false
      if (caculateTimes > 0) {
        chart.timeline.loop = true;
        // 获取到毫秒数
        const fact_time = caculateTimes * controlTimes * timelineTimeDistance;
        this.timelineTimer = setTimeout(() => {
          const option = this.chartObj.getOption();
          option.timeline[0].loop = false;
          // 开启，控制动态图表次数时需要在最后不显示播放按钮
          option.timeline[0].controlStyle.show = false;
          this.chartObj.setOption(option);
        }, fact_time);
      }
    }
  }
}