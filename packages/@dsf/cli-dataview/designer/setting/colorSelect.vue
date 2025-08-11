<template>
  <div class="data-view-color-select">
    <div class="color-select-type-switch">
      <p
        :class="{ active: activeIndex === 0 }"
        @click="clickHandler('selectTypeSwitch', 'color')"
      >
        单色
      </p>
      <p
        :class="{ active: activeIndex === 1 }"
        @click="clickHandler('selectTypeSwitch', 'linear')"
      >
        线性渐变
      </p>
      <p
        :class="{ active: activeIndex === 2 }"
        @click="clickHandler('selectTypeSwitch', 'radial')"
      >
        径向渐变
      </p>
    </div>
    <div>
      <dsf-color-select v-model="selectColor"></dsf-color-select>
      <template v-if="activeIndex != 0">
        <dsf-linear-gradual-select v-if="activeIndex === 1"  v-model="linear" />
        <dsf-radial-gradual-select v-else v-model="radial" />
      </template>
    </div>
    <div class="color-select-item">
      <p>系统主题色</p>
      <div class="color-preview-wrap">
        <div
          class="color-preview-item"
          v-for="(color, index) in systemDefaultColors"
          :key="`color-preview-system-item${index}`"
          :style="itemStyle(color)"
          @click="clickHandler('selectColor', color)"
        ></div>
      </div>
    </div>
    <div class="color-select-item">
      <p>预设颜色</p>
      <div class="color-preview-wrap">
        <div
          class="color-preview-item"
          v-for="(color, index) in presetColors"
          :key="`color-preview-system-item${index}`"
          :style="itemStyle(color)"
          @click="clickHandler('selectColor', color)"
        ></div>
      </div>
    </div>
    <div class="color-select-item" v-if="recentlyUsed.length > 0">
      <p>最近使用</p>
      <div class="color-preview-wrap">
        <div
          class="color-preview-item"
          v-for="(color, index) in recentlyUsed"
          :key="`color-preview-system-item${index}`"
          :style="itemStyle(color, 'recently')"
          @click="clickHandler('selectColor', color, true)"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ColorSelect",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default() {
        return {};
      },
    },
    currentSelectColor: {
      type: String,
      default: "",
    },
    quickIndex: {
      type: Number,
      default: -1,
    },
    colordisk: {
      type: Boolean,
      default: false,
    },
    selectType: {
      type: String,
      default: "color",
    },
    quickColors: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    // 当前选中的非渐变色号
    selectColor: {
      get() {
        return this.currentSelectColor;
      },
      set(v) {
        this.debounce(v, "color");
      },
    },
    // 当前选中的线性值
    linear: {
      get() {
        return this.form.linear;
      },
      set(v) {
        this.debounce(v, "linear");
      },
    },
    // 当前选中的径向值
    radial: {
      get() {
        return this.form.radial;
      },
      set(v) {
        this.debounce(v, "radial");
      },
    },
    // 系统主题颜色
    systemDefaultColors() {
      let systemKey = ["page_background", "main", "normal", "warning"],
        currentTheme = dsf.themeConfig.currentTheme,
        colors = [];
      _.forIn(currentTheme, (value, key) => {
        if (systemKey.includes(key)) colors.push(value);
      });
      return colors;
    },
  },
  watch: {
    selectType(nv) {
      if (!this.colordisk) {
        this.activeIndex = ["color", "linear", "radial"].findIndex(
          (it) => it === nv
        );
      }
    },
    show(nv) {
      if (nv) this.recordRecentlyUsedColor(true);
    },
  },
  data() {
    return {
      deg: "0deg",
      activeIndex: 0,
      debounce: null,
      // 预设颜色
      presetColors: [
        "#eb9436",
        "#f5cc44",
        "#30cb13",
        "#2d8bfe",
        "#152ad1",
        "#8b572a",
        "#ffffff",
        "#50e3c2",
        "#999999",
        "#666666",
        "#333333",
        "#726953",
      ],
      // 近期使用的颜色
      recentlyUsed: [],
    };
  },
  created() {
    if (!this.colordisk) {
      this.activeIndex = ["color", "linear", "radial"].findIndex(
        (it) => it === this.selectType
      );
    }

    let recentlyUsedColors =
      dsf.storage.local.get("recentlyUsedColors", this.recentlyUsed) || [];

    if (recentlyUsedColors.length > 0) {
      this.recentlyUsed = [];
      _.forEach(recentlyUsedColors, (c) => this.recentlyUsed.push(c));
    }

    this.debounce = _.debounce((v, type) => {
      this.updateParentComponentData(v, type);
      this.recordRecentlyUsedColor();
    }, 500);
  },
  methods: {
    itemStyle(color, type = "default") {
      let style = {
        "background-color": color,
      };

      // 近期使用颜色需根据设置显示出渐变
      if (type === "recently" && (dsf.isArray(color) || dsf.isObject(color))) {
        style = {
          "background-image": this.computedRealGradient(color),
        };
      }
      return style;
    },
    // 记录近期使用颜色
    recordRecentlyUsedColor(openPopover = false) {
      this.$nextTick(() => {
        let keyname = ["selectColor", "linear", "radial"][this.activeIndex],
          color = _.cloneDeep(this[keyname]);

        if (openPopover && !this.colordisk && this.quickIndex > -1) {
          if (dsf.isArray(this.quickColors[this.quickIndex])) {
            let current = _.cloneDeep(this.quickColors[this.quickIndex]);
            color = {
              angle: Number(current[0].replaceAll("deg", "")),
              point: _.map(current.slice(1), (it) => it),
            };
          } else {
            color = this.quickColors[this.quickIndex];
          }
        }

        if (color) {
          this.recentlyUsed = _.filter(
            this.recentlyUsed,
            (it) => !this.isEqual(color, it)
          );
          if (this.recentlyUsed.length > 11) {
            this.recentlyUsed = this.recentlyUsed.slice(0, 11);
          }

          if (
            this.selectType === "radial" &&
            dsf.isObject(color) &&
            Object.keys(color).length > 4
          ) {
            color = {
              size: color.size,
              position: color.position,
              point: color.point,
              shape: color.shape,
            };
          }
          this.recentlyUsed.unshift(color);
          dsf.storage.local.set("recentlyUsedColors", this.recentlyUsed);
        }
      });
    },
    // 更新父组件数据
    updateParentComponentData(v, type) {
      if (!this.show) return;
      if (this.selectType != ["color", "linear", "radial"][this.activeIndex]) {
        this.$emit(
          "update:selectType",
          ["color", "linear", "radial"][this.activeIndex]
        );
      }

      if (!this.colordisk) this.$emit("update:colordisk", true);
      if (type === "color") {
        this.$emit("update:currentSelectColor", v);

        // 当选择 线性/径向渐变 的单色色盘时， 同时更新渐变色颜色
        if (this.activeIndex > 0) {
          let formtype = ["linear", "radial"][this.activeIndex - 1],
            formValue = _.cloneDeep(this.form[formtype]);
          formValue.point[formValue.point.length - 1].color = v;
          this.updateParentComponentData(formValue, formtype);
        }
      } else {
        let form = _.cloneDeep(this.form),
          keyname = v.angle != undefined ? "linear" : "radial";
        form[keyname] = v;
        this.$emit("update:form", form);
      }
    },
    // 对比两个对象是否完全相等
    isEqual(obj, obj2) {
      let result = true;
      if (dsf.isObject(obj) && dsf.isObject(obj2)) {
        let obj1keys = Object.keys(obj),
          obj2keys = Object.keys(obj2);

        obj2keys.sort((p, n) => obj1keys.indexOf(p) - obj1keys.indexOf(n));
        if (
          obj1keys.length != obj2keys.length ||
          JSON.stringify(obj1keys) != JSON.stringify(obj2keys)
        )
          result = false;
        else {
          for (let key in obj2) {
            if (dsf.isObject(obj2[key]) && dsf.isObject(obj[key])) {
              let equal = this.isEqual(obj[key], obj2[key]);
              if (!equal) {
                result = false;
                break;
              }
            } else {
              if (JSON.stringify(obj[key]) != JSON.stringify(obj2[key])) {
                result = false;
                break;
              }
            }
          }
        }
      } else {
        if (obj != obj2) result = false;
      }
      return result;
    },
    clickHandler(handlerModel, value, recentlyUse = false) {
      switch (handlerModel) {
        case "selectTypeSwitch":
          this.activeIndex = ["color", "linear", "radial"].findIndex(
            (t) => t === value
          );

          if (["linear", "radial"].includes(value)) {
            // 切换前更新 线性/径向渐变值
            let formValue = this.form[value];
            formValue.point[
              formValue.point.length - 1
            ].color = this.selectColor;
            this.updateParentComponentData(formValue, value);
          }

          this.$emit("update:selectType", value);
          this.recordRecentlyUsedColor();
          break;
        case "selectColor":
          if (recentlyUse) {
            if (dsf.isObject(value)) {
              let point = value?.point || [],
                key = value?.angle === undefined ? "radial" : "linear";

              if (point[point.length - 1]?.color)
                this.$emit(
                  "update:currentSelectColor",
                  point[point.length - 1]?.color
                );

              this.activeIndex = key === "linear" ? 1 : 2;
              this.$emit("update:selectType", key);
              this.updateParentComponentData(value, key);
            } else {
              this.activeIndex = 0;
              this.$emit("update:selectType", "color");
              this.selectColor = value;
            }
            this.recordRecentlyUsedColor();
          } else {
            this.selectColor = value;

            let type = ["color", "linear", "radial"][this.activeIndex];
            if (["linear", "radial"].includes(type)) {
              let formValue = this[type],
                point = formValue?.point || [];

              if (point.length > 0) {
                formValue.point[point.length - 1].color = value;
                this.updateParentComponentData(formValue, type);
                this.recordRecentlyUsedColor();
              }
            }
          }
          break;
      }
    },
    // 计算真实的 linear-gradient / radial-gradient
    computedRealGradient(color) {
      let gradient = null;
      if (dsf.isArray(color)) {
        gradient = `linear-gradient(${this.deg}, ${color[0]} 0%, ${color[1]} 100%)`;
        if (color?.[2] === "radial") {
          // 径向渐变
          gradient = `radial-gradient(circle at 50% 50%, ${color[1]} 0%, ${color[0]} 100%)`;
        }
      } else {
        if (color?.shape) {
          let { shape, position, point } = color;
          gradient = `radial-gradient(${shape} at `;
          _.forEach(position, (p) => {
            gradient += `${p}%`;
          });
          _.forEach(point, (p) => {
            gradient += `, ${p.color} ${p.length}%`;
          });
        } else {
          let { angle, point } = color;
          gradient = `linear-gradient(${angle}deg`;
          _.forEach(point, (p) => {
            gradient += `, ${p.color} ${p.length}%`;
          });
        }
      }

      return gradient;
    },
  },
};
</script>
