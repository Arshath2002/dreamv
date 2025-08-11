<template>
  <div class="ds-designer-property property-item" :style="propertyItemStyle" :class="propertyItemClass">
    <div class="property-item-name" :class="[{ 'flex-center': data.showType === 'dv_margins' }, `margin-left-${data.spacingNumber || 0}`]" v-if="data.text" :style="propertyItemNameStyle">
      <span v-if="!data.hiddenText">
        {{ data.text }}
        <span v-if="!data.isFirstTitle && data.text && !data.hiddenText">： </span>
      </span>
    </div>
    <component
      v-if="itemComponent"
      :is="itemComponent"
      :data="data"
      :config="data.config"
      :mapFieldList="mapFieldList"
      :value="dataValue"
      :owner="owner"
      :disabled="inputDisabled"
      @change="dataValueChange"
    ></component>
    <!-- 提示放到最后,产品说的 -->
    <template v-if="desc">
      <DesDVToolTipsIcon :data="data" :descStriking="descStriking"></DesDVToolTipsIcon>
    </template>
  </div>
</template>
<script>
export default {
  name: "DsfDataViewDesignerProperty",
  inject: {
    $designer: {
      default: null,
    },
    $properties: {
      default: null,
    },
    $designerRight: {
      default: null,
    },
  },
  props: {
    id: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    //属性配置json中的数据项目
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    //所属组件的的属性对象
    bind: {
      type: Object,
      default() {
        return {};
      },
    },
    //所属组件本身示例
    owner: {
      type: Object,
      default() {
        return {};
      },
    },
    //备注
    desc: {
      type: String,
      default: "",
    },
    descStriking: {
      type: Boolean,
      default: false,
    },
    tabActive: {
      type: String,
    },
  },
  data() {
    return {
      itemComponent: null,
      dataValue: this.convertFromDataType(this.bind.data[this.bind.key]),
      unWatchEffect: [],
    };
  },
  computed: {
    mapFieldList() {
      return this.owner.$children[0].designerMapFieldList;
    },
    graphsTemplates: {
      get() {
        return this.$designer.graphsTemplates;
      },
    },
    isMobile() {
      return this.owner.$designer.mobile || false;
    },
    showType() {
      return this.data.showType;
    },
    config() {
      let config = this.data.config;
      return config || {};
    },
    dataValueArray: {
      get() {
        return this.dataValue || [];
      },
      set(v) {
        this.dataValue = v;
      },
    },
    inputDisabled() {
      if (this.disabled === true) {
        return true;
      }
      if (this?.config?.disabled) {
        return true;
      } else {
        if (this?.data?.bindControlAttr == "caption") {
          //业务组件因为名称规范要求不许修改caption
          if (this.owner.isBusiness && this.owner.isFormControl) {
            return true;
          }
        }
      }
      return false;
    },
    propertyItemNameStyle() {
      let isFirstTitle = this.data.isFirstTitle;
      let defaultStyle = {};
      let textStyle = this.data.textCss || {};
      if (isFirstTitle) {
        defaultStyle.color = "#333";
      }
      return {
        ...defaultStyle,
        ...textStyle,
      };
    },
    propertyItemClass() {
      return this.data.itemClass;
    },
    propertyItemStyle() {
      let style = {};
      let itemStyle = this.data.itemCss || {};
      return {
        ...style,
        ...itemStyle,
      };
    },
    oneLineStyle() {
      return {};
    },
  },
  created() {
    this.itemComponent = dsf.designer.getPropEditor(this.showType);
    this.unWatch = Vue.watchEffect(() => {
      const bind = this?.bind;
      const k = bind?.key || "";
      const val = bind?.data?.[k];
      this.dataValue = this.convertFromDataType(val);
    });

    this.loadExecute();
  },
  watch: {
    data() {
      this.loadExecute();
    },
  },
  beforeDestroy() {
    if (this._visibleProper && this.$designerRight) {
      this.$designerRight.focusPopper(false, this.id);
    }
    this.unWatch && this.unWatch();
  },
  methods: {
    loadExecute() {
      //加载之前执行
      if (this.data.loadExceFunction) {
        let fnName = this.data.loadExceFunction;
        let caller = this.owner[fnName];
        caller && caller.call(this.owner, this.data);
      }
    },
    //切换图表
    changeGraph(group) {
      this.owner.$children[0].changeGraph(group);
    },
    getInCommonUse(prop) {
      return this.$properties.filterIsCommonUse(prop);
    },
    dataValueChange(value) {
      let v = value;
      let { key } = this.bind;
      const { splitChart, changeExecFunction, bindControlAttr } = this.data;
      if (v !== undefined && key) {
        let newValue = this.convertToDataType(value, splitChart);
        if (key == "caption" && dsf.isString(newValue)) {
          newValue = newValue.toLowerCase();
          this.dataValue = newValue;
        }
     
        this.bind.data[key] = newValue; //this.convertToDataType(v,this.data.splitChart);
      }
      this.$nextTick(() => {
        if (changeExecFunction) {
          let caller = this.owner[changeExecFunction];
          caller && caller.call(this.owner, bindControlAttr);
        }
        this.$nextTick(() => {
          this?.owner?.$designer?.recordPageChange?.();
        });
      });
    },
    copyAttrName(attr) {
      dsf.copyText(attr.bindControlAttr).then(() => {
        dsf.layer.message("复制属性名成功");
      });
    },
    showHelp(attr) {
      this.$openDialog({
        title: attr.name,
        width: "500px",
        height: "300px",
        overflow: "auto",
        template: `<span style="display: inline-block; line-height: 1.5em" v-html="dsf.safe.xss(params.value)"></span>`,
        params: {
          value: attr.desc,
        },
        btns: [],
      });
    },
    convertFromDataType(v) {
      let val = v;
      if (dsf.isDef(v)) {
        const { showType, dataType } = this.data;
        if (showType == "text") {
          if (dsf.isUnDef(dataType)) {
            return val;
          }
          if (dataType == "Number[]" || dataType == "String[]") {
            if (dsf.isArray(v)) {
              val = v.join(this.data.splitChart || ",");
            }
          } else if (dataType == "Number") {
            val = v.toString();
          }
        } else if (showType == "timePicker") {
          if (dsf.isArray(v)) {
            const now = dsf.date.format(new Date(), "yyyy/mm/dd ");
            val = [new Date(now + v[0]), new Date(now + v[1])];
          }
        }
      }
      return val;
    },
    convertToDataType(v) {
      let val = v;
      if (dsf.isDef(v)) {
        if (this.data.showType == "text" && dsf.type(v) == "string") {
          if (this.data.dataType == "Number[]") {
            val = v.split(this.data.splitChart || ",");
            val = _.map(val, (el) => {
              return parseFloat(el);
            });
          } else if (this.data.dataType == "String[]") {
            val = v.split(this.data.splitChart || ",");
          } else if (this.data.dataType == "Number") {
            val = parseFloat(val);
          }
        } else if (this.data.showType == "timePicker") {
          if (Array.isArray(v)) {
            val = [dsf.date.format(v[0], "hh:ii:ss"), dsf.date.format(v[1], "hh:ii:ss")];
          }
        }
      }
      return val;
    },
    beforeUpload(data) {},
    visibleChange(to) {
      this._visibleProper = to;
      this.$designerRight.focusPopper(to, this.id);
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/designerProperty.scss";
</style>
