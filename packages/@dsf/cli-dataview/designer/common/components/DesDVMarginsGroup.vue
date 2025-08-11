<!-- 边距组 -->
<template>
  <div class="dsf-margins-group">
    <div class="dsf-margins-group-nav">
      <template v-for="(item, index) in currentConfig.options">
        <div
          :class="[
            'dsf-margins-group-nav-item',
            active === item.bindControlAttr && 'active',
          ]"
          :key="index"
          v-if="show(item.showExpress)"
          @click="active = item.bindControlAttr"
        >
          <div :class="['text',showDot(item) && 'dot']">
            <span>{{ item.text }}</span>
            <template v-if="item.desc">
              <DesDVToolTipsIcon
                :data="item"
              ></DesDVToolTipsIcon>
            </template>
          </div>
        </div>
      </template>
    </div>
    <div class="dsf-margins-group-content">
      <template v-for="(item, index) in currentConfig.options">
        <DesDVMargins
          v-if="item.bindControlAttr === active && show(item.showExpress)"
          :owner="owner"
          :key="index"
          :config="item.config"
          :value="getMarginsValue(item.bindControlAttr)"
          @change="changeValue"
        ></DesDVMargins>
      </template>
    </div>
  </div>
</template>

<script>
import propertyMixin from "_dataview/designer/common/components/propertyMixin.js";

export default {
  name: "DesDVMarginsGroup",
  mixins: [propertyMixin],
  props: {
    //所属组件本身示例
    owner: {
      type: Object,
      default() {
        return {};
      },
    },
    customEmit:{
      type:String,
      default:""
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      defaultConfig: {
        options: [],
      },
      active: null,
    };
  },
  created() {
    this.active = this.currentConfig.options[0]?.bindControlAttr;
  },
  methods: {
    show(showExpress) {
      // 待优化
      let showTabNav = [];
      _.each(this.currentConfig.options, (item) => {
        item.showExpress =
          item.showExpress === undefined ? "" : item.showExpress;
        if (this.$replace(item.showExpress, this.owner) !== false) {
          showTabNav.push(item.bindControlAttr);
        }
      });
      if (
        showTabNav?.length > 0 &&
        !_.find(showTabNav, (item) => {
          return item == this.active;
        })
      ) {
        this.active = showTabNav[0];
      }
      if (!showExpress) return true;
      return this.$replace(showExpress, this.owner);
    },
    showDot(item) {
      let bind = this.getBind(item.bindControlAttr);
      let value = bind.data[bind.key];
      return _.find(value, (it) => {
        return it != 0 && it != "";
      });
    },
    getMarginsValue(attr) {
      if (!attr) return [0, 0, 0, 0];
      let { data, key } = this.getBind(attr);
      return data[key];
    },
    getBind(attrExpress = "") {
      // let attrExpress = item.bindControlAttr || "";
      let attrLevel = attrExpress.split(".");
      if (attrLevel.length == 1) {
        return {
          data: this.owner,
          key: attrLevel[0] || "",
        };
      } else {
        let arr = attrLevel.slice(0, attrLevel.length - 1);
        let obj = this.owner;
        let c = arr.shift();
        while (c) {
          let prop = this.testProp(obj, c);
          if (dsf.isDef(prop)) {
            obj = prop;
            c = arr.shift();
          } else {
            obj = null;
            break;
          }
        }
        if (!obj) {
          obj = this.owner;
        }
        return {
          data: obj,
          key: attrLevel[attrLevel.length - 1],
        };
      }
    },
    testProp(obj, key) {
      let code = "return obj." + key;
      let fn = new Function("obj", "key", code);
      try {
        return fn(obj, key);
      } catch (ex) {
        console.log(ex);
        return null;
      }
    },
    changeValue(value) {
      let bind = this.getBind(this.active);
      bind.data[bind.key] = value;
      if(this.customEmit){
        this.$emit(this.customEmit,this.owner);
      }
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/marginsGroup.scss";
</style>
