<template>
  <div class="ds-color-picker-panel">
    <slot name="header"></slot>
    <div class="ds-picker-panel">
      <div class="ds-panel-header">
        <div class="ds-panel-title">{{ activePanel == "card" ? "色卡" : "面板" }}选择器</div>
        <div class="ds-panel-change-btn">
          <DsfIcon :class="[activePanel === 'card' ? 'active' : '']" name="dv-icon-seqia" @click="activePanel = 'card'" />
          <DsfIcon :class="[activePanel === 'panel' ? 'active' : '']" name="dv-icon-tiaosepan" @click="activePanel = 'panel'" />
        </div>
      </div>
      <Points ref="points" v-if="type !== 'color'" v-model="gradientRange">
        <template slot="suffix">
          <DsfIcon name="zhihuan" class="suffix-icon" @click.stop="reverseHandler" @mousedown.stop></DsfIcon>
          <DsfIcon name="shuaxin1" class="suffix-icon"   @click.stop="rotateHandler" @mousedown.stop></DsfIcon>
        </template>
      </Points>
      <Cards v-show="activePanel === 'card'" :colors="colorCards" @change="setHex($event, 100)"></Cards>
      <Panel v-show="activePanel === 'panel'" ref="panel" />
    </div>
    <slot name="after-panel"></slot>
    <div class="ds-picker-slider">
      <label class="quick-btn clear" title="清除" @click="setColor('a', 0)">
        <DsfIcon name="dv-icon-wutianchongyanse" />
      </label>
      <label v-if="isEyeDropper" class="quick-btn dropper" title="取色器" @click="doEyeDropper">
        <DsfIcon name="dv-icon-a-5" />
      </label>
      <div class="ds-slider-wrap">
        <hue ref="hue" />
        <alpha ref="alpha" v-if="showAlpha" />
      </div>
      <div class="ds-preview-panel" :class="[type, radialShape]">
        <span class="ds-preview-value" :style="{ background: value }"></span>
        <span v-if="type === 'linear'" class="ds-linear-pointer" :style="linearPointerStyle"></span>
        <template v-else-if="type === 'radial'">
          <Pos :value.sync="radialPosition"></Pos>
          <DsfIcon name="shuaxin1" @click.stop="clickHandler" @mousedown.stop></DsfIcon>
        </template>
      </div>
    </div>
    <slot name="after-slider"></slot>
    <div class="ds-picker-input">
      <label class="str">
        <el-input v-model="hex" size="mini" @change="setHex"></el-input>
        <span>HEX</span>
      </label>
      <label>
        <el-input-number :value="rgba[0]" :min="0" :max="255" :controls="false" size="mini" step-strictly @change="setColor('r', $event)" />
        <span>R</span>
      </label>
      <label>
        <el-input-number :value="rgba[1]" :min="0" :max="255" :controls="false" size="mini" step-strictly @change="setColor('g', $event)" />
        <span>G</span>
      </label>
      <label>
        <el-input-number :value="rgba[2]" :min="0" :max="255" :controls="false" size="mini" step-strictly @change="setColor('b', $event)" />
        <span>B</span>
      </label>
      <label>
        <el-input-number :value="rgba[3]" :min="0" :max="255" :controls="false" size="mini" step-strictly @change="setColor('a', $event)" />
        <span>Alpha</span>
      </label>
    </div>
    <slot name="after-input"></slot>
    <div class="ds-picker-record">
      <div class="ds-record-item" v-if="curUsedColors.length">
        <p>最近使用</p>
        <div class="ds-color-list">
          <span class="ds-color-item" v-for="(it, idx) in curUsedColors" :key="idx" :style="{ background: it }" @click="useColor(it)"></span>
        </div>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script>
import Color from "./color";
import Hue from "./Hue";
import Panel from "./Panel";
import Alpha from "./Alpha";
import Points from "./Points";
import Cards from "./Cards";
import Pos from "./Pos";

const isEyeDropper = !!window.EyeDropper;

// 颜色选择器
export default {
  name: "DsfColorPickerPanel",
  components: {
    Hue,
    Panel,
    Alpha,
    Points,
    Cards,
    Pos,
  },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: String,
      default: "#333",
      // "linear-gradient(90deg, rgb(113, 49, 128) 0%, rgba(17, 195, 254, 0.882) 44%, rgba(189, 65, 65, 0.97) 100%)",
    },
    showAlpha: {
      type: Boolean,
      default: true,
    },
    // hsl / hsv / hex / rgb
    colorFormat: {
      type: String,
      default: "hex",
    },
    // color / linear / radial
    type: {
      type: String,
      default: "color",
    },
    options: {
      type: Array,
      default() {
        return ["color", "linear", "radial"];
      }
    },
    colorCards: {
      type: Array,
      default() {
        return [
          ["#000000", "#333333", "#555555", "#7f7f7f", "#aaaaaa", "#d7d7d7", "#f2f2f2", "#ffffff"],
          ["#ec808d", "#facd91", "#ffff80", "#caf982", "#80ffff", "#81d3f8", "#8080ff", "#c280ff"],
          ["#d9001b", "#f59a23", "#ffff00", "#95f204", "#00ffff", "#02a7f0", "#0000ff", "#8400ff"],
          ["#a30014", "#b8741a", "#bfbf00", "#70b603", "#00bfbf", "#027db4", "#0000bf", "#6300bf"],
          ["#6d000e", "#7b4d12", "#808000", "#4b7902", "#008080", "#015478", "#000080", "#420080"],
        ]
      }
    }
  },
  data() {
    this.isEyeDropper = isEyeDropper;
    return {
      activePanel: "card",
      // 线性渐变
      linearRange: [
        { color: "#f00", pos: 0 },
        { color: "#000", pos: 100 },
      ],
      linearAngle: 90,
      // 径向渐变
      radialRange: [
        { color: "#f00", pos: 0 },
        { color: "#000", pos: 100 },
      ],
      radialShape: "circle",
      radialSize: "farthest-corner",
      radialPosition: [50, 50],
      color: null,
      rgba: [255, 255, 255, 100],
      hex: "#FFFFFF",
      usedColors: {
        color: [],
        linear: [],
        radial: [],
      },
    };
  },
  computed: {
    typeRegExp() {
      return new RegExp(this.options.join("|") || "color");
    },
    colorOptions() {
      return {
        enableAlpha: this.showAlpha,
        format: this.colorFormat,
      };
    },
    gradientRange() {
      return this.type === "linear" ? this.linearRange : this.radialRange;
    },
    linearValue() {
      let colorVal = this.linearRange.map((it) => `${it.color} ${it.pos}%`).join();
      return `linear-gradient(${this.linearAngle}deg, ${colorVal})`;
    },
    linearPointerStyle() {
      return {
        transform: `rotateZ(${this.linearAngle}deg)`,
      };
    },
    radialValue() {
      let colorVal = this.radialRange.map((it) => `${it.color} ${it.pos}%`).join(",");
      let position = this.radialPosition.map((pos) => pos + "%").join(" ");
      return `radial-gradient(${this.radialShape} ${this.radialSize} at ${position}, ${colorVal})`;
    },
    curUsedColors() {
      return this.usedColors[this.type] || [];
    },
  },
  watch: {
    type(to, from) {
      this.$nextTick(() => this.changePickerType(to, from));
    },
    value(to) {
      if (!this.color) return;
      this.color.fromString(this.parseColor(to));
      this.init();
    },
    linearValue(nv) {
      if (this.type === "linear") {
        this.$emit("change", nv);
        this.storeColor(nv);
      }
    },
    radialValue(nv) {
      if (this.type === "radial") {
        this.$emit("change", nv);
        this.storeColor(nv);
      }
    },
  },
  created() {
    let colorVal = this.parseColor(this.value);
    this.color = new Color(this.colorOptions);
    this.color.fromString(colorVal);
    this.init();
    if (isEyeDropper) {
      this.eyeDropper = new EyeDropper();
    }

    let usedColors = localStorage.getItem("dsf_used_colors");
    if (usedColors) this.usedColors = JSON.parse(usedColors);
    if (!this.usedColors.radial) this.usedColors.radial = [];
  },
  methods: {
    changePickerType(to, from) {
      let val = null;
      if (from === "linear") {
        val = this.linearRange[0].color;
      } else if (from === "radial") {
        val = this.radialRange[0].color;
      } else {
        if (!this.value) return;
        val = this.value;
      }

      if (to === "linear" && this.linearValue !== this.value) {
        this.linearRange[0] = { color: val, pos: 0 };
        this.linearRange = this.linearRange.slice(0);
        this.$emit("change", this.linearValue);
      } else if (to === "radial" && this.radialValue !== this.value) {
        this.radialRange[0] = { color: val, pos: 0 };
        this.radialRange = this.radialRange.slice(0);
        this.$emit("change", this.radialValue);
      } else {
        this.storeColor(val);
        this.$emit("change", val);
      }
      return val;
    },
    init() {
      this.$refs.hue?.updatePoint()?.updateBg?.();
      this.$refs.panel?.updatePoint()?.updateBg?.();
      this.$refs.alpha?.updatePoint()?.updateBg?.();
      let { r, g, b } = this.color.toRgb();
      this.rgba = [r, g, b, this.color._alpha];
      this.hex = this.color.toHex(r, g, b);
    },
    colorChange() {
      this.$refs.hue.updateBg();
      this.$refs.panel.updateBg();
      this.$refs.alpha.updateBg();
      let { r, g, b } = this.color.toRgb();
      this.rgba = [r, g, b, this.color._alpha];
      this.hex = this.color.toHex(r, g, b);
      this.color.fromString(this.hex);
      this.updateValue();
    },
    setColor(k, v) {
      let [r, g, b, a] = this.rgba;
      let c = { r, g, b, a };
      c[k] = v;
      this.color.fromString(`rgba(${c.r},${c.g},${c.b},${c.a / 100})`);
      this.init();
      this.updateValue();
    },
    setHex(hex, alpha) {
      if (!/^#(([0-9A-Fa-f]{3})|([0-9A-Fa-f]{6}))$/.test(hex)) {
        let [r, g, b] = this.rgba;
        this.hex = this.color.toHex({ r, g, b });
        return;
      }
      this.color.fromString(hex);
      this.color.set("alpha", alpha || this.rgba[3]);
      this.init();
      this.updateValue();
    },
    updateValue() {
      if (this.type === "color") {
        let { value } = this.color;
        this.$emit("change", value);
        this.storeColor(value);
      } else {
        this.$refs.points.activePoint.color = this.color.value;
      }
    },
    doEyeDropper() {
      if (!this.eyeDropper) return;
      this.eyeDropper
        .open()
        .then((res) => {
          this.setHex(res.sRGBHex, 100);
        })
        .catch(dsf.noop);
    },
    parseColor(str) {
      str = str.replace("transparent", "rgba(0, 0, 0, 0)");
      const type = str.replace(/^(linear|radial)?.*$/gi, (_, $1) => $1 || "color");
      let result;
      if (type !== "color") {
        const valueStr = str.slice("linear-gradient".length + 1, -1);
        const colorReg = /((rgba?\(.+?\))|(#[a-f\d]{3})|(#[a-f\d]{6}))\s+([\d\.]+%?)/gi;
        const colors = valueStr.match(colorReg).map((it) => {
          let pos = null;
          let color = it.replace(/\s*(\d+%?$)/, ($) => ((pos = $), ""));
          return { color, pos: parseFloat(pos) || 0 };
        });
  
        if (type === "linear") {
          const angle = parseFloat(valueStr.match(/^-?\d+deg/)[0]);
          this.linearAngle = isFinite(angle) ? angle : 90;
          this.linearRange = colors;
        } else if (type === "radial") {
          const params = valueStr.match(/(\w+)\s([\w\-]+)\s?at\s([\d\.]+)%\s([\d\.]+)%/);
          const [_, shape, size, x = 50, y = 50] = params || [];
          this.radialShape = shape || "circle";
          this.radialSize = size || "farthest-corner";
          this.radialPosition = [x, y];
          this.radialRange = colors;
        }
        result = colors[0].color;
      }
      if (type === this.type) {
        return result || str;
      } else if (this.typeRegExp.test(type)) {
        this.$emit("update:type", type);
        return result || str;
      } else {
        // 不支持目标类型，则降级为当前颜色类型
        return this.changePickerType(this.type, type);
      }
    },
    reverseHandler() {
      const range =
        this.type === "linear" ? this.linearRange : this.radialRange;
      let left = 0;
      let right = range.length - 1;
      while (left < right) {
        let color = range[left].color;
        range[left++].color = range[right].color;
        range[right--].color = color;
      }
    },
    rotateHandler() {
      if (this.type === "linear") {
        this.linearAngle = (this.linearAngle + 45) % 360;
      } else if (this.type === "radial") {
        const sizeArr = ["farthest-corner", "closest-side", "closest-corner", "farthest-side"];
        let curIdx = sizeArr.findIndex((it) => it === this.radialSize);
        this.radialSize = sizeArr[(curIdx + 1) % 4];
      }
    },
    clickHandler() {
      if (this.type === "radial") {
        this.radialShape = this.radialShape === "circle" ? "ellipse" : "circle";
      }
    },
    storeColor(val) {
      if (this.curUsedColors.includes(val)) return;
      this.curUsedColors.unshift(val);
      if (this.curUsedColors.length > 14) this.curUsedColors.length = 14;
      localStorage.setItem("dsf_used_colors", JSON.stringify(this.usedColors));
    },
    useColor(val, isThemeColor) {
      if (this.type !== "color" && isThemeColor) {
        this.$refs.points.activePoint.color = val;
      } else {
        this.$emit("change", val);
      }
    },
  },
};
</script>