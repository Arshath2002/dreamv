<template>
  <div class="designer-props-box">
    <el-tabs v-model="tabActive" stretch class="dv-designer-props-box-tabs">
      <el-tab-pane label="属性及样式" name="1" class="commonUse">
        <template v-slot:label>
          <div style="padding-left: 4px" class="tab-label" :class="{ 'is-active': tabActive === '1' }">属性及样式</div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="高级" name="2" class="all">
        <template v-slot:label>
          <div style="padding-left: 4px" class="tab-label" :class="{ 'is-active': tabActive === '2' }">高级</div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="动画" name="3" class="animate-tab">
        <template v-slot:label>
          <div style="padding-left: 4px" class="tab-label" :class="{ 'is-active': tabActive === '3' }">动画</div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div class="designer-props">
      <dsf-virtual-scroll>
        <el-collapse v-model="activeName">
          <el-collapse-item v-for="(group, $index) in data" :key="$index" v-show="showGroup(group)" :title="group.name" :name="group.name">
            <div class="ds-designer-property-wrap">
              <DsfDataViewDesignerProperty
                v-for="(item, $idx) in group.attributes"
                v-show="show(item)"
                :key="(item.bindControlAttr || '') + $idx"
                :id="(item.bindControlAttr || '') + $idx"
                :rel="item.bindControlAttr"
                :desc="item.desc"
                :desc-striking="item.desc_striking"
                :data="item"
                :owner="owner"
                :disabled="isDisabled(item)"
                :bind="getBind(item)"
                :tabActive="tabActive"
              >
              </DsfDataViewDesignerProperty>
            </div>
          </el-collapse-item>
        </el-collapse>
      </dsf-virtual-scroll>
    </div>
  </div>
</template>
<script>
import DsfDataViewDesignerProperty from "./dsfDataViewDesignerProperty.vue";
export default {
  name: "DsfDataViewDesignerProperties",
  inject: {
    $designer: {
      default: null,
    },
    $designerRight: {
      default: null,
    },
  },
  components: { DsfDataViewDesignerProperty },
  provide() {
    return {
      $properties: this,
    };
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    owner: {
      type: Object,
      default() {
        return {};
      },
    },
    propShow: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      tabActive: "1",
      activeName: [],
      inCommonUseGroup: [],
    };
  },
  computed: {
    isSimple() {
      return this.$designer.isSimple;
    },
    propsList() {
      let active = this.tabActive;
      if (active == 1) {
        return this.inCommonUseGroup.length > 0 ? this.inCommonUseGroup : this.data;
      } else {
        return this.data;
      }
    },
  },
  watch: {
    data: {
      handler(v) {
        this.activeName = [];
        if (v.length) {
          this.activeName = v.slice(0, 3).map((it) => it.name);
        }

        this.inCommonUseGroup = this.getInCommonUse(this.data);
        if (this.$designerRight) {
          this.$designerRight.focusPopper();
        }
      },
      immediate: true,
    },
    inCommonUseGroup(v) {
      if (v.length) {
        this.tabActive = "1";
      } else {
        this.tabActive = "2";
      }
    },
    tabActive(v) {
      if (v == 2 || v == 3) {
        this.activeName = this.data.map((it) => it.name);
      }
    },
  },
  mounted() {
    this.inCommonUseGroup = this.getInCommonUse(this.data);
  },
  methods: {
    isDisabled(item) {
      if (item.disabled) {
        return true;
      }
      return (this?.owner?.designDisabledProps || []).indexOf(item.bindControlAttr) >= 0;
    },
    filterIsCommonUse(prop) {
      if (this.tabActive == "1") {
        if (prop.inCommonUse) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    },
    showGroup(group) {
      // if (this.tabActive == "1") {
      //   return group.commonUseCount > 0;
      // }
      let result = _.filter(group.attributes, (it) => {
        return this.show(it);
      });
      return result.length;
    },
    getInCommonUse(data) {
      let arr = [];
      _.each(data, (v) => {
        let attrs = _.filter(v.attributes, (a) => {
          return a.inCommonUse;
        });
        let count = attrs.length;
        this.$set(v, "commonUseCount", count);
        if (attrs.length) {
          arr.push(v);
        }
      });
      return arr;
    },
    getBind(item) {
      let attrExpress = item.bindControlAttr || "";
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
    show(item) {
      //如果是设计器简化版本
      if (this.isSimple && item.isSimple === false) {
        return false;
      }
      //否则按平台设计器规则加载
      let show = true;
      if (item.showExpress) {
        show = this.$eval(item.showExpress, this.owner);
      }
      if (show) {
        let result = true;
        try {
          let ctrl = this.owner.$$getComponent ? this.owner.$$getComponent() : this.owner;
          this.propShow && this.propShow(ctrl, item);
        } catch (ex) {
          dsf.warn(ex);
        } finally {
          show = result === false ? false : true;
        }
        if ((!item.inCommonUse && this.tabActive == 1) || (item.inCommonUse && this.tabActive == 2) || (this.tabActive == 3 && item.showTabType !== "animate")) {
          show = false;
        }
        if (item.showTabType === "animate") {
          if (this.tabActive == 3) {
            show = true;
          } else {
            show = false;
          }
        }
        if (item.inCommonUseBoth) {
          show = true;
        }
      }
      return show;
    },
  },
};
</script>
