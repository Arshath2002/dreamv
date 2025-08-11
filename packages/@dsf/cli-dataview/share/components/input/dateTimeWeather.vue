<template>
  <div
    class="dsf-dataview-date-time-weather data-view-item-wrap data-view-no-padding ds-control"
    :style="dateTimeWeatherStyle"
  >
    <div class="dsf-dataview-date-time-inner-weather data-view-common-bg-effect" :style="innerWeatherStyle">
      <div
        :style="getItemStyle(item)"
        v-for="(item, index) in layouts"
        :key="index"
        @click="clickItem(item)"
      >
        <template v-if="item.value == 'WEATHER-ICON'">
          <el-image
            :style="getImageSize(item)"
            :src="getWeatherImage"
          >
            <div
              slot="placeholder"
              class="image-slot"
            >
              加载中
              <span class="dot">...</span>
            </div>
          </el-image>
        </template>
        <template v-else>
          {{ getCurrentFormat(item) }}
        </template>
      </div>
    </div>

  </div>
</template>
<script>
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import weather_1 from "_dataview/assets/img/weather/1.png";
import weather_2 from "_dataview/assets/img/weather/2.png";
import weather_3 from "_dataview/assets/img/weather/3.png";
import weather_4 from "_dataview/assets/img/weather/4.png";
import weather_5 from "_dataview/assets/img/weather/5.png";
import weather_6 from "_dataview/assets/img/weather/6.png";
import weather_7 from "_dataview/assets/img/weather/7.png";
import weather_8 from "_dataview/assets/img/weather/8.png";
import weather_9 from "_dataview/assets/img/weather/9.png";
//时间类型
const TYPES = [
  {
    name: "年月日时分秒",
    value: "YMD-HMS",
  },
  {
    name: "年月日",
    value: "YMD",
  },
  {
    name: "年月",
    value: "YM",
  },
  {
    name: "时分",
    value: "HM",
  },
  {
    name: "时分秒",
    value: "HMS",
  },
  {
    name: "星期",
    value: "WEEK",
  },
  {
    name: "天气名称",
    value: "WEATHER-NAME",
  },
  {
    name: "天气图标",
    value: "WEATHER-ICON",
  },
  {
    name: "温度",
    value: "TEMP",
  },
  {
    name: "温度范围",
    value: "TEMP-RANGE",
  },
  {
    name: "地区",
    value: "LOCAL-NAME",
  },
];
//展示格式
const FORMAT = new Map([
  [
    "YMD-HMS",
    [
      {
        label: "年月日 hh:ii:ss",
        value: "yyyy年mm月dd日 hh:ii:ss",
      },
      {
        label: "yyyy-mm-dd hh:ii:ss",
        value: "yyyy-mm-dd hh:ii:ss",
      },
      {
        label: "yyyy.mm.dd hh:ii:ss",
        value: "yyyy.mm.dd hh:ii:ss",
      },
      {
        label: "yyyy/mm/dd hh:ii:ss",
        value: "yyyy/mm/dd hh:ii:ss",
      },
    ],
  ],
  [
    "YMD",
    [
      {
        label: "年月日",
        value: "yyyy年mm月dd日",
      },
      {
        label: "yyyy-mm-dd",
        value: "yyyy-mm-dd",
      },
      {
        label: "yyyy.mm.dd",
        value: "yyyy.mm.dd",
      },
      {
        label: "yyyy/mm/dd",
        value: "yyyy/mm/dd",
      },
    ],
  ],
  [
    "YM",
    [
      {
        label: "年月",
        value: "yyyy年mm月",
      },
      {
        label: "yyyy-mm",
        value: "yyyy-mm",
      },
      {
        label: "yyyy.mm",
        value: "yyyy.mm",
      },
      {
        label: "yyyy/mm",
        value: "yyyy/mm",
      },
    ],
  ],
  [
    "HM",
    [
      {
        label: "时分",
        value: "hh时ii分",
      },
      {
        label: "hh-ii",
        value: "hh-ii",
      },
      {
        label: "hh:ii",
        value: "hh:ii",
      },
    ],
  ],
  [
    "HMS",
    [
      {
        label: "时分秒",
        value: "hh时ii分ss秒",
      },
      {
        label: "hh-ii-ss",
        value: "hh-ii-ss",
      },
      {
        label: "hh:ii:ss",
        value: "hh:ii:ss",
      },
    ],
  ],
]);
const WEATHER_IMAGES = new Map([
  ["风", weather_1],
  ["多云", weather_2],
  ["雪", weather_3],
  ["晴", weather_4],
  ["雨夹雪", weather_5],
  ["雷阵雨", weather_6],
  ["雨", weather_7],
  ["雾", weather_8],
  ["云", weather_9],
]);
//默认样式
const defaultStyle = {
  fontFamily: "Microsoft Yahei",
  fontSize: "16px",
  // color: "rgba(62, 136, 188, 1)",
  color: "rgba(3, 82, 160, 1)",
  fontStyle: "normal",
  fontWeight: "normal",
  textDecoration: "none",
  size: 50,
  width: "100%",
  left: 0,
  top: 0,
};
export default dsf.component({
  name: "DsfDataViewDateTimeWeather",
  mixins: [$mixins.dataView],
  ctrlCaption: "时间天气组件",
  props: {
    //风格
    styleMapKey: {
      type: String,
      default: "dataviewDateTimeWeather",
    },
    height: {
      type: String,
      default: "auto",
    },
    inputHeight: {
      type: String,
      default: "auto",
    },
    margin: {
      type: Array,
      default() {
        return [0, 0, 0, 0];
      },
    },
    padding:{
      type: Array,
      default: () => [8, 6, 8, 6],
    },
    //传入的时间
    dynamicDate: {
      type: String,
      default: "",
    },
    //城市行政编码
    city: {
      type: String,
      default: "110000",
    },
    //高德key
    weatherKey: {
      type: String,
      default: "3d4c3d2ea7c4c6dd51e0f1eb02ad2102",
    },
    // 全局默认样式
    defaultStyle: {
      type: Object,
      default() {
        return {
          ...defaultStyle,
        };
      },
    },
    // 布局
    layouts: {
      type: Array,
      default() {
        return [
          {
            id: dsf.uuid(),
            value: "LOCAL-NAME",
            format: "yyyy-mm-dd hh:ii:ss",
            style: {
              ...defaultStyle,
              width: "20%",
              top: 0,
            },
          },
          {
            id: dsf.uuid(),
            value: "WEATHER-NAME",
            format: "yyyy-mm-dd hh:ii:ss",
            style: {
              ...defaultStyle,
              width: "20%",
              top: 0,
            },
          },
          {
            id: dsf.uuid(),
            value: "WEATHER-ICON",
            format: "yyyy-mm-dd hh:ii:ss",
            style: {
              ...defaultStyle,
              width: "30%",
            },
          },
          {
            id: dsf.uuid(),
            value: "TEMP-RANGE",
            format: "yyyy-mm-dd hh:ii:ss",
            style: {
              ...defaultStyle,
            },
          },
          {
            id: dsf.uuid(),
            value: "YMD-HMS",
            format: "yyyy-mm-dd hh:ii:ss",
            style: {
              ...defaultStyle,
            },
          },
        ];
      },
    },
    // 背景
    controlBackgroundConfig: {
      type: Object,
      default() {
        return {
          active: "page",
          image: "",
          size: "cover",
          repeat: "no-repeat",
          position: "center",
        };
      },
    },
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          click: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
  },
  data() {
    return {
      //单个样式
      cellStyle: defaultStyle,
      //天气分类
      weatherDiverse: {
        风: [
          "有风",
          "平静",
          "微风",
          "和风",
          "清风",
          "强风/劲风",
          "疾风",
          "大风",
          "烈风",
          "风暴",
          "狂爆风",
          "飓风",
          "热带风暴",
          "龙卷风",
        ],
        多云: ["少云", "晴间多云", "多云"],
        雪: [
          "雪",
          "阵雪",
          "小雪",
          "中雪",
          "大雪",
          "暴雪",
          "小雪-中雪",
          "中雪-大雪",
          "大雪-暴雪",
          "冷",
        ],
        晴: ["晴"],
        雨夹雪: ["雨雪天气", "雨夹雪", "阵雨夹雪"],
        雷阵雨: ["雷阵雨", "雷阵雨并伴有冰雹", "强雷阵雨"],
        雨: [
          "阵雨",
          "小雨",
          "中雨",
          "大雨",
          "暴雨",
          "大暴雨",
          "特大暴雨",
          "强阵雨",
          "极端降雨",
          "毛毛雨/细雨",
          "雨",
          "小雨-中雨",
          "中雨-大雨",
          "大雨-暴雨",
          "暴雨-大暴雨",
          "大暴雨-特大暴雨",
          "冻雨",
        ],
        雾: [
          "霾",
          "中度霾",
          "重度霾",
          "严重霾",
          "浮尘",
          "扬沙",
          "沙尘暴",
          "强沙尘暴",
          "雾",
          "浓雾",
          "强浓雾",
          "轻雾",
          "大雾",
          "特强浓雾",
        ],
        云: ["阴", "未知"],
      },
      weeks: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ],
      TYPES,
      FORMAT,
      date: null,
      //定时器
      timer: null,

      //天气名字
      weatherName: "",
      //气温
      temperature: "",
      //地点
      localName: "",
      //气温范围
      temperatureRange: "",
    };
  },
  created() {
    this.getTime();
    this.getWeather();
    this.getWeatherRange();
  },
  mounted() {
    this.$nextTick(() => {
      this.handleEventScope();
    });
  },
  watch: {
    inputHeight: {
      handler(val) {
        if (typeof val === 'string' && val.includes("%")) {
          this.$emit("update:height", "100%");
        } else {
          this.$emit("update:height", "auto");
        }
      },
      immediate: true,
    },
    city() {
      this.getWeather();
      this.getWeatherRange();
    },
    weatherKey() {
      this.getWeather();
      this.getWeatherRange();
    },
  },
  computed: {
    //获取icon 图标
    getWeatherImage() {
      let icon = "";
      Object.keys(this.weatherDiverse).forEach((key) => {
        let values = this.weatherDiverse[key];
        if (values.includes(this.weatherName)) {
          icon = key;
        }
      });
      return WEATHER_IMAGES.get(icon) ? WEATHER_IMAGES.get(icon) : "";
    },
    dateTimeWeatherStyle(){
      let style = {
        ...this.controlOuterStyle,
        height: dsf.dataview.utils.transformPx(this.height),
      };
      return style;
    },
    innerWeatherStyle(){
      let style = {
        height: dsf.dataview.utils.transformPx(this.inputHeight),
      };
      return style;
    },
  },
  methods: {
    textStylesProxy(values = null) {
      const target = this.layouts.filter(it => it.value != "WEATHER-ICON");
      if (Array.isArray(values)) {
        for (let i = 0; i < values.length; i++) {
          ["fontFamily", "fontSize", "color", "fontStyle", "fontWeight", "textDecoration"].forEach(key => {
            const val = values[i][key];
            if (val !== undefined) target[i].style[key] = val;
          })
        }
      } else {
        return target.map(item => {
          return ["fontFamily", "fontSize", "color", "fontStyle", "fontWeight", "textDecoration"].reduce((style, key) => {
            style[key] = item.style[key];
            return style;
          }, {})
        })
      }
    },
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: this.textStylesProxy(),
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|边框设置|背景|入场动画/.test(it.name));
        const { textStyles = [], backgrounds = [] } = config;
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
        this.textStylesProxy(textStyles);
      }
      this.setComponentStyle(groups, config._props);
    },
    // 点击事件
    clickItem(item) {
      this.$dispatch("clickItem", item);
      this.loadClickEvents(item);
    },
    //依赖组件关联方法
    loadClickEvents(data) {
      let { fn } = this.eventRelativeDeal.click;
      this.handleCommonEmit(fn, data);
    },
    getWeatherRange() {
      const needLogin = this.$page?.needLogin;
      let config = {
        headers: {},
      };
      if (needLogin === false) {
        config.headers["view"] = "view_key";
      }
      this.$http
        .get(dsf.url.getWebPath("resource/getHttpResult", $$webRoot.dataview), {
          url: "https://restapi.amap.com/v3/weather/weatherInfo",
          params: {
            city: this.city,
            key: this.weatherKey,
            extensions: "all",
          },
        }, config)
        .then((res) => {
          if (res.data.success) {
            let result = res.data.data;
            //表示成功
            if (result.status == "1") {
              let item = result.forecasts[0].casts[0];
              this.temperatureRange = `${item.nighttemp}°~${item.daytemp}°`;
            }
          }
        });
    },
    getWeather() {
      const needLogin = this.$page?.needLogin;
      let config = {
        headers: {},
      };
      if (needLogin === false) {
        config.headers["view"] = "view_key";
      }
      
      this.$http
        .get(dsf.url.getWebPath("resource/getHttpResult", $$webRoot.dataview), {
          url: "https://restapi.amap.com/v3/weather/weatherInfo",
          params: {
            city: this.city,
            key: this.weatherKey,
            extensions: "base",
          },
        }, config)
        .then((res) => {
          if (res.data.success) {
            let result = res.data.data;
            // console.log(result);
            //表示成功
            if (result.status == "1") {
              this.weatherName = result.lives[0].weather;
              this.temperature = result.lives[0].temperature;
              this.localName = result.lives[0].city;
            }
          }
        });
    },
    getTime() {
      const date = this.dynamicDate ? new Date(this.dynamicDate) : new Date();
      this.date = date;
      this.timer = setTimeout(this.getTime, 1000);
    },
    //获取当前数据转换
    getCurrentFormat(item) {
      let res = "";
      //显示的值
      const val = item.value;
      switch (val) {
        case "WEEK":
          res = this.weeks[this.date.getDay()];
          break;
        case "WEATHER-NAME":
          res = this.weatherName;
          break;
        case "WEATHER-ICON":
          res = "";
          break;
        case "TEMP":
          res = this.temperature + "°";
          break;
        case "TEMP-RANGE":
          res = this.temperatureRange;
          break;
        case "LOCAL-NAME":
          res = this.localName;
          break;
        case "":
          res = "";
          break;
        default:
          const format = item.format;
          res = dsf.date.format(this.date, format);
          break;
      }
      return res;
    },
    getImageSize(item) {
      let style = item.style;
      let size = dsf.dataview.utils.transformPx(style.size);
      return {
        width: size,
        height: size,
      };
    },
    getItemStyle(item) {
      let newStyle = {};
      let fontAnyStyle = dsf.dataview.utils.transformTextStyle(item.style);
      let style = item.style;
      let { size, ...properties } = style;
      properties.position = "relative";
      properties.minHeight = "1px";
      if (properties.width != "auto") {
        properties.display = "inline-block";
      }
      // 兼容处理
      if (properties.span) {
        properties.width = (properties.span / 24) * 100 + "%";
        properties.verticalAlign = "middle";
      }
      if (typeof properties.left === "number") {
        properties.top += "px";
        properties.left += "px";
      }
      if (dsf.dataview.utils.isCursorPointer([
        this.eventRelativeDeal.click,
      ])) {
        newStyle["cursor"] = "pointer";
      }
      return {
        ...properties,
        ...fontAnyStyle,
        ...newStyle,
      };
    },
    // 切换风格回调
    afterChangeStyle() {
      this.layouts.forEach((it) => {
        it.style.color = this.defaultStyle.color;
      });
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/dateTimeWeather.scss";
</style>
