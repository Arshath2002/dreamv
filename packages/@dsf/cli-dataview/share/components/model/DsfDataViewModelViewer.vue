<!--
 * @Editor: zhanghang
 * @Description: 模型查看器
 * @Date: 2024-12-30 10:12:05
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-12-31 11:09:08
-->
<template>
  <div
    class="data-view-item-wrap ds-control data-view-no-padding dv-three-model-viewer"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
  >
    <div class="ds-designer-box" v-if="isDesign && !threeOptions.model.url">
      <span style="margin: auto">【请上传模型】</span>
    </div>
    <div ref="model" class="dv-three-model-canvas"></div>
    <div class="design-tip" v-if="isDesign">
      <p>按住Ctrl键+鼠标右键调整初始视角</p>
    </div>
  </div>
</template>
<script>
import defaultOptions from "_dataview/output/model/options.js";
import ThreeModel from "./ThreeModel.js";
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
export default dsf.component({
  name: "DsfDataViewModelViewer",
  ctrlCaption: "三维查看器",
  mixins: [$mixins.dataView],
  props: {
    controlBackgroundConfig: {
      type: Object,
      default() {
        return defaultBackground;
      },
    },
    threeOptions: {
      type: Object,
      default: defaultOptions,
    },
    //three 配置字符串
    threeString: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isCtrl: false,
    };
  },
  created() {
    // threeString 获取 threeString 作为配置项
    if (this.threeString) {
      let threeString = this.threeString;
      let threeOptions = dsf.eval(threeString);
      for (let key in this.threeOptions) {
        Reflect.deleteProperty(this.threeOptions, key);
      }
      Object.assign(this.threeOptions, threeOptions);
      this.$emit("update:threeOptions", threeOptions);
    } else {
      let o = dsf.dataview.utils.objectToString(this.threeOptions, true);
      this.$emit("update:threeString", o);
    }
    dsf.emit.$on(
      "updateThree",
      (args) => {
        console.log("接受");
        // chart
        const threeOptions = args.threeOptions;
        const threeString = dsf.dataview.utils.objectToString(threeOptions, true);
        this.$emit("update:threeOptions", threeOptions);
        this.$emit("update:threeString", threeString);
        //在option 获取之后执行
        setTimeout(this.reset);
      },
      this
    );
  },
  mounted() {
    document.addEventListener("keydown", this.keyBoard, false);
    document.addEventListener("keyup", this.keyBoardUp, false);

    this.$nextTick(() => {
      this.model = new ThreeModel(this.$refs.model, this.isDesign);
      this.reset();
    });
  },
  beforeDestroy() {
    dsf.emit.$remove("updateThree", this);
    document.removeEventListener("keydown", this.keyBoard, false);
    document.removeEventListener("keyup", this.keyBoardUp, false);
    this.model && this.model.destroy();
    this.model = null;
  },
  methods: {
    keyBoard(e) {
      if (e.keyCode === 17 && this.isDesign) {
        this.isCtrl = true;
      }
    },
    keyBoardUp(e) {
      if (e.keyCode === 17 && this.isDesign) {
        this.isCtrl = false;
      }
    },
    reset() {
      this.model && this.model.setOptions(this.threeOptions);

      if (this.isDesign && this.model) {
        this.model.off("change");
        this.model.on("change", () => {
          let result = this.model.getCamera();
          if (result && this.isCtrl) {
            const { x, y, z } = result;
            this.cameraPosition = { x, y, z };
          }
        });
      }
    },
    resize() {
      this.model && this.model.resize();
    },
  },
  design: {
    metadata: {
      create() {
        if (this.model) {
          let result = this.cameraPosition;
          if (result) {
            const { x, y, z } = result;
            this.threeOptions.camera.x = x;
            this.threeOptions.camera.y = y;
            this.threeOptions.camera.z = z;
            this.threeString = dsf.dataview.utils.objectToString(this.threeOptions, true);
          }
        }
      },
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/threeModel.scss";
</style>
