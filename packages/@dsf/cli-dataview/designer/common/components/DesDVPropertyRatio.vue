<template>
  <div class="property-ratio-tools-item">
    <el-dropdown size="mini" placement="bottom" @command="deviceChange">
      <span class="bt">{{ value ? value.text || value.name : "" }}</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item, index) in deviceConfig" :key="index" :divided="item.divided" :command="item">
          {{ item.text || item.name }}
          <span v-if="item.name != 'auto'" style="color: #aaa"> ({{ item.width }} x {{ item.height }}) </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span class="bt" @click="setRect">{{ width }} x {{ height }}</span>
  </div>
</template>
<script>
import propertyMixin from "./propertyMixin";
export default {
  name: "DesDVPropertyRatio",
  mixins:[propertyMixin],
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    dictionary() {
      return this.data.dictionary;
    },
    deviceConfig() {
      return [this.autoDevice].concat(this.dictionary);
    },
    width() {
      if (!this.value) return 0;
      let { width = 0 } = this.value;
      return width;
    },
    height() {
      if (!this.value) return 0;
      let { height = 0 } = this.value;
      return height;
    },
  },
  data() {
    return {
      autoDevice: { name: "auto", text: "自定义", width: 0, height: 0 },
    };
  },
  methods: {
    deviceChange(val) {
      if (val.name == "auto" && (!val.width || !val.height)) {
        val.width = this.width;
        val.height = this.height;
      }
      this.$emit("change", val);
    },
    setRect() {
      let width = this.width + "";
      let height = this.height + "";
      let rect = Vue.observable({
        width,
        height,
      });
      let rules = {
        width: [
          { required: true, message: "宽度不能为空", trigger: "blur" },
          { type: "string", pattern: /^[1-9]\d+$/, message: "必须输入正整数", trigger: "blur" },
        ],
        height: [
          { required: true, message: "高度不能为空", trigger: "blur" },
          { type: "string", pattern: /^[1-9]\d+$/, message: "必须输入正整数", trigger: "blur" },
        ],
      };
      let key = dsf.uuid();
      let fn = (h) => {
        return (
          <el-form ref="form" key={key} label-width="60px" props={{ model: rect }} rules={rules}>
            <el-form-item label="宽" prop="width">
              <div class="el-input" style="width: 280px">
                <input v-model={rect.width} type="text" class="el-input__inner" />
              </div>
            </el-form-item>
            <el-form-item label="高" prop="height">
              <div class="el-input" style="width: 280px">
                <input v-model={rect.height} type="text" class="el-input__inner" />
              </div>
            </el-form-item>
          </el-form>
        );
      };
      ELEMENT.MessageBox({
        title: "宽高设置",
        showClose: false,
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        message: fn(this.$createElement),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.$refs.form.validate((valid) => {
              if (valid) {
                done();
              } else {
                return false;
              }
            });
          } else {
            done();
          }
        },
      }).then((action) => {
        if (action === "confirm") {
          let w = Number(rect.width);
          let h = Number(rect.height);
          if (!isNaN(w) && !isNaN(h)) {
            this.$emit("change", {
              name: "auto",
              text: "自定义",
              width: w,
              height: h,
            });
          }
        }
      });
    },
  },
};
</script>
