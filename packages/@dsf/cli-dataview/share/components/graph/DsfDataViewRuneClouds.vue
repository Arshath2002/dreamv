<template>
  <div
    class="dsf-dv-rune-clouds ds-control data-view-item-wrap data-view-no-padding"
    :style="controlOuterStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <div class="dsf-dv-rune-clouds-data data-view-common-bg-effect">
      <div class="canvas-box" :ref="ref" :style="controlStyle">
        <div>
          <template v-if="!hasData">
            <DsfEmptyData />
          </template>
          <canvas :width="realWidth" :height="realHeight" :id="canvasId" v-else>
            <p>
              Anything in here will be replaced on browsers that support the
              canvas element
            </p>
          </canvas>
        </div>
        <div :id="labelId" style="display: none">
          <ul>
            <li
              v-for="(item, index) in data"
              :key="index"
              :style="getTextStyle(index)"
            >
              <a @click.prevent="clickItem(item)">{{ item.name }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const staticDataKeyDic = {
  name: "名称",
  attach: "附加信息",
};
const staticData = [
  {
    name: "字符1",
    attach: "",
  },
  {
    name: "字符2",
    attach: "",
  },
  {
    name: "字符3",
    attach: "",
  },
  {
    name: "字符4",
    attach: "",
  },
  {
    name: "字符5",
    attach: "",
  },
];
import border from "_dataview/mixins/border.js";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
import { handleColor, ColorRegexp } from "_dataview/output/config/commonConfig";
export default dsf.component({
  name: "DsfDataViewRuneClouds",
  ctrlCaption: "字符云3D",
  mixins: [$mixins.dataView, border, dataAnalysis],
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "runeClouds",
    },
    colors: {
      type: Array,
      default() {
        return [
          "#37a2da",
          "#32c5e9",
          "#67e0e3",
          "#9fe6b8",
          "#ffdb5c",
          "#ff9f7f",
          "#fb7293",
        ];
      },
    },
    textStyle: {
      typeof: Object,
      default: () => createCommonTextStyle({ fontSize: 25 }),
    },
    controlBackgroundConfig: {
      type: Object,
      default: () => defaultBackground,
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    config: {
      type: Object,
      default: () => ({
        textFont: null,
        maxSpeed: 0.05,
        minSpeed: 0.01,
        textHeight: 25,
        outlineMethod: "none",
        fadeIn: 800,
        outlineOffset: 0,
        depth: 0.6,
        minBrightness: 0.2,
        textColour: null,
        wheelZoom: false,
        reverse: true,
        shadowBlur: 2,
        shuffleTags: true,
        shadowOffset: [1, 1],
        stretchX: 1.7,
        initial: [0, 0.1],
        clickToFront: 600,
        weightMode: "Both",
      }),
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(
          staticData,
          staticDataKeyDic
        );
      },
    },
    mapRelations: {
      type: Array,
      default() {
        return [
          {
            text: "名称",
            value: "name",
            map: "name",
            hideDigit: true,
          },
          {
            text: "附加信息",
            value: "attach",
            map: "attach",
            hideDigit: true,
          },
        ];
      },
    },
  },
  data() {
    const canvasId = dsf.uuid();
    const labelId = dsf.uuid();
    return {
      canvasId: `canvas_${canvasId}`,
      labelId: `label_${labelId}`,
      componentRef: "rune-clouds",
      ref: "runeClouds",
    };
  },

  beforeDestroy() {
    window.TagCanvas && TagCanvas.Delete(this.canvasId);
  },
  methods: {
    // 复制字体样式，返回数组
    copyTextStyles() {
      return this.colors.map((it) => {
        return {
          ...this.textStyle,
          color: it,
        };
      });
    },
    // 粘贴字体样式，默认取 label 字体，个别特殊的在组件内单独实现
    pasteTextStyles(textStyles) {
      for (let i = 0; i < textStyles.length && i < this.colors.length; i++) {
        // 字体不支持渐变，只取第一个色值
        const color = handleColor(textStyles[i].color);
        this.colors[i] = color.replace(ColorRegexp, "$1");
      }
      if (textStyles.length) {
        const newTextStyle = {
          fontSize: textStyles[0].fontSize,
          fontFamily: textStyles[0].fontFamily,
        };
        this.$emit("update:textStyle", newTextStyle);
      }
    },
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: this.copyTextStyles(),
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(
        (it) => !/数据|属性|插槽/.test(it.name)
      );
      if (config._props.ctrlName !== this.ctrlName) {
        const { textStyles = [], backgrounds = [] } = config;
        groups = groups.filter((it) =>
          /布局|背景|边框设置|入场动画/.test(it.name)
        );
        this.pasteTextStyles(textStyles);
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    getTextStyle(index) {
      const { colors, textStyle } = this;
      return {
        color: colors[index % colors.length],
        fontFamily: textStyle.fontFamily,
      };
    },
    start() {
      $(`#${this.canvasId}`).html("");
      let { ...options } = this.config;
      setTimeout(() => {
        TagCanvas.Start(this.canvasId, this.labelId, options);
      });
      this.dataLoad = false;
    },
    dataAnalysis(data) {
      if (!data.length) {
        this.hasData = false;
        return;
      }
      if (eval(this.dynamicRules) || this.dataType === "excel") {
        this.dataLoad = true;
        this.handleData(data);
      } else {
        this.data = data;
      }
      this.changeDataRender();
    },
    changeDataRender() {
      try {
        //解决canvas 绘制字体未加载完成
        document.fonts.load(`12px ${this.textStyle.fontFamily}`).then(() => {
          this.loadScript().then(this.start);
        });
      } catch (error) {
        this.loadScript().then(this.start);
      }
    },
    handleData(data) {
      let nameKey = this.mapRelations[0].map;
      let fontSizeKey = this.mapRelations[1].map;
      let newArr = [];
      data.forEach((item) => {
        let name = item[nameKey];
        let attach = item[fontSizeKey];
        let obj = {
          name: "",
          attach: "",
        };
        if (name) {
          obj.name = name;
          obj.attach = attach;
          newArr.push(obj);
        }
      });
      this.data = newArr;
    },
    clickItem(item) {
      this.$dispatch("itemClick", item);
      this.loadClickEvents(item);
    },
    loadScript() {
      if (window.TagCanvas) {
        return Promise.resolve();
      } else {
        return new Promise((resolve, reject) => {
          let loadFileHttp = dsf.dataview.utils.importFiles(
            [
              this.$getWebPath(
                "static/js/libs/tagCanvas/tagCanvas.js",
                __DSF_DATAVIEW_PATH__
              ),
            ],
            () => {
              resolve();
            },
            (err) => {
              reject(err);
              this.dataLoad = false;
              dsf.layer.message("加载tagCanvas文件报错", false);
            },
            () => {
              this.addNowRequestFileList(loadFileHttp, true);
            }
          );
          this.addNowRequestFileList(loadFileHttp);
        });
      }
    },
  },
  watch: {
    textStyle: {
      handler(val) {
        //设计器下查看
        if (this.isDesign) {
          const config = this.config;
          config.textFont = val.fontFamily;
          config.textHeight = parseInt(val.fontSize);
          this.$emit("update:config", config);
        }
      },
      deep: true,
    },
    colors: {
      handler() {
        //设计器下查看
        if (this.isDesign) {
          this.init();
        }
      },
      deep: true,
    },
    config: {
      handler() {
        //设计器下查看
        if (this.isDesign) {
          this.init();
        }
      },
      deep: true,
    },
    staticData: {
      handler() {
        if (this.isDesign) {
          this.init();
        }
      },
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/runeClouds.scss";
</style>
