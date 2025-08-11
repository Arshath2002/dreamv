<!--
 * @Description: 只用于前缀显示
 * @Author: shenah
 * @Date: 2024-04-19 17:49:09
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-07 17:00:54
-->
<template>
  <span
    :class="wrapClass"
    v-if="showAll"
    :style="prefixSuffixThingStyle"
  >
    <template v-for="(item,index) in this.getWrapStyle.list">
      <template v-if="showValue(item.sortKey,'icon')">
        <DsfIcon
          :style="getNowStyle('icon')"
          :key="index"
          class="common-icon"
          :name="getWrapStyle.ruleObj.icon.icon"
        ></DsfIcon>
      </template>
      <template v-if="showValue(item.sortKey,'image')">
        <img
          :key="index"
          class="common-img"
          :src="getImageUrl"
          :width="getWrapStyle.ruleObj.image.width"
          :height="getWrapStyle.ruleObj.image.height"
          :style="getNowStyle('image')"
        />
      </template>
      <template v-if="showValue(item.sortKey,'text')">
        <span
          :key="index"
          :style="getNowStyle('text')"
        >{{ getWrapStyle.ruleObj.text.content }}</span>
      </template>

    </template>

  </span>
</template>

<script>
import { ruleTypeList } from "_dataview/output/config/universalRuleConfig";
import universalRuleMixin from "_dataview/mixins/universalRuleMixin";
export default {
  name: "prefixSuffixThing",
  mixins: [universalRuleMixin],
  components: {},
  data() {
    return {
      arr: ["span", "div"],
    };
  },
  props: {
    //所属的大屏组件
    belongDvComp: {
      type: Object,
      default() {
        return null;
      },
    },
    analysisRuleToDataField: {
      type: Function,
      default: () => "",
    },
    analysisKeyToDataField: {
      type: Function,
      default: () => "",
    },
    wrapClass: {
      type: String,
    },
    config: {
      type: Object,
    },
    row: {
      type: Object,
    },
  },
  computed: {
    prefixSuffixThingStyle() {
      let defaultConfig = this.config.defaultConfig;
      let positionType = defaultConfig.positionType || "";
      let positionMap = {
        'top': "marginBottom",
        'right': "marginLeft",
        'bottom': "marginTop",
        'left': "marginRight",
      }
      let style = {
        position: "relative",
      };
      if (positionMap[positionType]) {
        style[positionMap[positionType]] = dsf.dataview.utils.transformPx(defaultConfig.space);
      }
      return style;
    },
    getWrapStyle() {
      let defaultConfig = this.config.defaultConfig;
      let ruleList = this.config.ruleList;
      let nowTypeConfig = this.getDefaultConfig(defaultConfig);
      let ruleStyle = this.handleUniversalRule(this.row, ruleList);
      let result = Object.keys(ruleStyle).length ? ruleStyle : nowTypeConfig;
      let showList = this.sortRuleList(result) || [];
      return {
        list: showList,
        ruleObj: result,
      };
    },
    showValue() {
      return (nowType, type) => {
        if (nowType === type && type === "icon" && this.getWrapStyle.ruleObj.icon?.icon) {
          return true;
        } else if (nowType === type && type === "image" && this.getWrapStyle.ruleObj.image?.image) {
          return true;
        } else if (nowType === type && type === "text" && this.getWrapStyle.ruleObj.text?.content) {
          return true;
        }
        return false;
      };
    },
    getNowStyle() {
      return (type) => {
        let imgObj = this.getWrapStyle.ruleObj[type];
        let animationStyle = dsf.dataview.utils.getBgAnimation(imgObj.image);
        return {
          ...this.getWrapStyle.ruleObj[type],
          ...animationStyle,
        };
      };
    },
    getImageUrl() {
      return dsf.dataview.utils.compatiblePathToExtendShowImg(this.getWrapStyle.ruleObj.image.image);
    },
    showAll() {
      return Object.keys(this.getWrapStyle.ruleObj).some((key) => this.showValue(key, key));
    },
  },
  methods: {
    getDefaultConfig(config) {
      let newConfig = _.cloneDeep(config);
      let type = newConfig.type;
      ruleTypeList.forEach((item) => {
        if (item.value !== type) {
          delete newConfig[item.value];
        }
      });
      return newConfig;
    },
    sortRuleList(obj) {
      let entries = Object.entries(obj).map(([key]) => ({
        ...obj[key],
        sortKey: key,
      }));
      let arr = entries.sort((a, b) => a.sortIndex - b.sortIndex);
      return arr;
    },
  },
};
</script>
<style lang="scss" scoped></style>
