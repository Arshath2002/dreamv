<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">相对位移X<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '%' }" :value="series.center[0] | valueFilter" @change="changeItemValue($event + '%', series.center, 0)"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">Y<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '%' }" :value="series.center[1] | valueFilter" @change="changeItemValue($event + '%', series.center, 1)"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">水波图半径<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '%' }" :value="series.radius | valueFilter" @change="changeItemValue($event + '%', series, 'radius')"></DesDVNumber>
    </div>
    <DesDVHorizonLine
      :config="{
        spacingNumber: 1,
        space: 30,
      }"
    ></DesDVHorizonLine>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">水波图形状<span>： </span></div>
    </div>
    <div class="ds-designer-property property-item ml20">
      <div class="property-item-name">自定义<span>： </span></div>
      <DesDVSwitch v-model="series.isShapeCustom" @change="changeItemShape($event, series, 'isShapeCustom')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="!series.isShapeCustom">
      <div class="property-item-name">形状<span>： </span></div>
      <DesDVSelect :data="{ dictionary: shapeTypeOptions }" v-model="series.shape" @change="changeItemValue($event, series, 'shape')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-else>
      <div class="property-item-name"><span> </span></div>
      <el-upload class="avatar-uploader" :action="uploadAction" :headers="headers" :show-file-list="false" :on-change="handleChange" :auto-upload="false">
        <div class="svg-preview-wrap" v-if="series.shapeSvgHtml" v-html="series.shapeSvgHtml" title="重新上传"></div>
        <DsfButton type="primary" v-else class="data-view-dialog-common-btn" style="width: auto; height: auto" size="small"> 上传SVG图片 </DsfButton>
      </el-upload>
    </div>
    <DesDVHorizonLine
      :config="{
        spacingNumber: 1,
        space: 30,
      }"
    ></DesDVHorizonLine>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">水波样式<span>： </span></div>
    </div>

    <div class="ds-designer-property property-item ml20">
      <div class="property-item-name">颜色<span>： </span></div>
      <DesDVColorPicker
        :config="{
          ...bothConfig,
        }"
        v-model="itemStyleColor"
        @change="changeItemColor($event, series.itemStyle, 'color')"
      />
    </div>
    <div class="ds-designer-property property-item ml20">
      <div class="property-item-name">背景颜色<span>： </span></div>
      <DesDVColorPicker
        :config="{
          ...bothConfig,
        }"
        v-model="backgroundStyleColor"
        @change="changeItemColor($event, series.backgroundStyle, 'color')"
      />
    </div>
    <div class="ds-designer-property property-item ml20">
      <div class="property-item-name">水波动画<span>： </span></div>
      <DesDVSwitch :value="series.waveAnimation" @change="changeItemValue($event, series, 'waveAnimation')" />
    </div>
    <template v-if="false">
      <div class="ds-designer-property property-item ml40">
        <div class="property-item-name">流动方向<span>： </span></div>
        <DesDVRadioGroup :data="{ dictionary: directionOptions }" v-model="series.direction" @change="changeItemValue($event, series, 'direction')" />
      </div>
      <div class="ds-designer-property property-item ml40">
        <div class="property-item-name">振幅<span>： </span></div>
        <DesDVNumber :config="{ min: 0, unit: '' }" :value="series.amplitude" @change="changeItemValue($event, series, 'amplitude')"></DesDVNumber>
      </div>
      <div class="ds-designer-property property-item ml40">
        <div class="property-item-name">长度<span>： </span></div>
        <DesDVNumber :config="{ min: 0, unit: '' }" :value="series.waveLength" @change="changeItemValue($event, waveLength, 'amplitude')"></DesDVNumber>
      </div>
    </template>
    <!-- 文字样式 -->
    <DesDVHorizonLine
      :config="{
        spacingNumber: 1,
        space: 30,
      }"
    ></DesDVHorizonLine>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">外边框<span>： </span></div>
    </div>
    <!-- 边框 -->
    <div class="ds-designer-property property-item ml20">
      <div class="property-item-name">距离<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '' }" :value="series.outline.borderDistance" @change="changeItemValue($event, series.outline, 'borderDistance')"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item ml20">
      <div class="property-item-name">线宽<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '' }" :value="series.outline.itemStyle.borderWidth" @change="changeItemValue($event, series.outline.itemStyle, 'borderWidth')"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item ml20">
      <div class="property-item-name">颜色<span>： </span></div>
      <DesDVColorPicker
        :config="{
          ...colorConfig,
        }"
        v-model="series.outline.itemStyle.borderColor"
        @change="changeItemColor($event, series.outline.itemStyle, 'borderColor')"
      />
    </div>
    <DesDVHorizonLine
      :config="{
        spacingNumber: 1,
        space: 30,
      }"
    ></DesDVHorizonLine>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签<span>： </span></div>
    </div>
    <div class="ds-designer-property property-item ml20">
      <div class="property-item-name">值样式：</div>
      <DesDVTextStyle v-model="series.label" @change="changeLabelStyle" :config="textStyleConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item ml20">
      <div class="property-item-name">显示名称<span>： </span></div>
      <DesDVSwitch :value="chart.title.show" @change="changeItemValue($event, chart.title, 'show')" />
    </div>
    <div class="ds-designer-property property-item" v-if="chart.title.show" style="margin-left: 40px">
      <div class="property-item-name">名称样式：</div>
      <DesDVTextStyle v-model="chart.title.textStyle" @change="changeTitleStyle" :config="textStyleConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item" v-if="chart.title.show" style="margin-left: 40px">
      <div class="property-item-name">相对位移Y<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '%' }" :value="chart.title.top | valueFilter" @change="changeItemValue($event + '%', chart.title, 'top')"></DesDVNumber>
    </div>
  </div>
</template>
<script>
import itemMixin from "../itemMixin";

import DsfDVChartRichText from "../DsfDVChartRichText.vue";

export default {
  name: "DsfDVChartPieItem",
  mixins: [itemMixin],
  components: { DsfDVChartRichText },
  props: {
    series: {
      type: Object,
      require: true,
    },
    chart: {
      type: Object,
      require: true,
    },
  },
  filters: {
    valueFilter(val) {
      return +(val + "").replace(/%/g, "");
    },
  },
  data() {
    return {
      staticFile: dsf.config.setting_dataview_upload_static == 1|| false,
      centerOptions: [
        {
          label: "%",
          value: "%",
        },
        {
          label: "无",
          value: "",
        },
      ],
      shapeTypeOptions: [
        {
          text: "圆形",
          value: "circle",
        },
        {
          text: "菱形",
          value: "diamond",
        },
        {
          text: "水滴",
          value: `path://
            M828.817 706.209C828.817 881.725 686.98 1024 512 1024c-174.98 0-316.817-142.275-316.817-317.791C195.183 530.74 512 0 512 0s316.817 530.74 316.817 706.209z`,
        },
        {
          text: "三角形",
          value: "triangle",
        },
        {
          text: "箭头",
          value: "arrow",
        },
        {
          text: "矩形",
          value: "rect",
        },
        {
          text: "椭圆",
          value: "roundRect",
        },
        {
          text: "pin",
          value: "pin",
        },
      ],
      directionOptions: [
        {
          text: "左",
          value: "left",
        },
        {
          text: "右",
          value: "right",
        },
      ],
      textStyleConfig: {
        isShowColor: true,
        isShowFontWeight: false,
        isShowItalics: false,
        isShowUnderline: false,
        isShowFontFamily: true,
        isShowFontSize: true,
        isShowShadow: false,
        isMarginTop: true,
        picker: {
          type: "color",
        },
        colorStringField: "color",
        fontSizeField: "fontSize",
        fontFamilyField: "fontFamily",
      },
      // 水波颜色
      itemStyleColor: "",
      // 背景颜色
      backgroundStyleColor: "",
    };
  },
  computed: {
    filesArgs() {
      return dsf.dataview.utils.getDataViewUploadFilesArgs.call(this, this.staticFile);
    },
    uploadAction() {
      return this.filesArgs.url;
    },
    headers() {
      return this.filesArgs.headers;
    },
    extendData() {
      return this.filesArgs.extraData;
    },
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.itemStyleColor = dsf.dataview.utils.convertChartToCSSColor(this.series.itemStyle.color);
      this.backgroundStyleColor = dsf.dataview.utils.convertChartToCSSColor(this.series.backgroundStyle.color);
    },
    changeLabelStyle(val) {
      let { color, fontFamily, fontSize } = val;
      let label = {
        color,
        fontFamily,
        fontSize,
        insideColor: color,
      };
      this.changeItemValue(label, this.series, "label");
    },
    changeTitleStyle(val) {
      let { color, fontFamily, fontSize } = val;
      let textStyle = {
        color,
        fontFamily,
        fontSize,
      };
      this.changeItemValue(textStyle, this.chart.title, "textStyle");
    },
    changeItemShape(val, item, key) {
      if (!val) {
        this.changeItemValue("circle", this.series, "shape");
      } else if (this.series.shapeSvgHtml) {
        let svgText = this.series.shapeSvgHtml;
        let path = this.getSvgPath(svgText);
        this.changeItemValue(path, this.series, "shape");
      }
      this.changeItemValue(val, item, key);
    },

    getSvgPath(svgText) {
      const regex = /<path\s+[^>]*?d="([^"]*)"/g;
      let match;
      let path = `path:// `;
      while ((match = regex.exec(svgText)) !== null) {
        path = `${path}
          ${match[1]}`;
      }
      return path;
    },
    handleChange(e) {
      let file = e.raw;
      const isSVG = file.type === "image/svg+xml";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isSVG) {
        this.$message("请上传svg格式文件!", false);
      }
      if (!isLt2M) {
        this.$message("上传svg大小不能超过 2MB!", false);
      }
      if (!isSVG || !isLt2M) return false;
      let loadVm = dsf.layer.loading();
      const reader = new FileReader();
      reader.onload = (e) => {
        let svgText = e.target.result;
        this.changeItemValue(svgText, this.series, "shapeSvgHtml");
        let path = this.getSvgPath(svgText);
        this.changeItemValue(path, this.series, "shape");
        dsf.layer.closeLoading(loadVm);
      };
      reader.readAsText(file, "UTF-8");
    },
  },
};
</script>
