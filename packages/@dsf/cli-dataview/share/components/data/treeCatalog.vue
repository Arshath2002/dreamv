<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-11-15 10:47:00
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 18:25:28
-->
<template>
  <div
    class="dsf-dv-tree-catalog-catalog data-view-item-wrap ds-control data-view-no-padding"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
      ...this.getBoxShadowConfig(true),
    }">
    <div class="dsf-dv-tree-catalog-catalog__content data-view-common-bg-effect">
      <DsfVirtualTree
        ref="virtualTree"
        :data="data"
        :lazy="lazy"
        :nodeHeight="nodeHeight"
        :defaultExpandedKeys="expandKey"
        :defaultExpandAll="defaultExpandAll"
        :show-checkbox="isCheckBox"
        :props="defaultProps"
        :highlightCurrent="highlightCurrent"
        :style="labelStyle"
        @node-click="nodeClick"
        @check="checkNodes"
        :node-key="getId"
        :currentNodeKey="currentNodeKey"
        @loadDataSuccess="loadDataSuccess">
        <div slot="label" slot-scope="{ node, data }" class="dsf-dv-tree-catalog-catalog_label" :style="node.isCurrent ? getSelectLabel : {}">
          <div class="content-wrap">
            <span :is-opacity="isExpandedOpacity(node)" :class="getExtendIcon" :style="getExtendIconStyle" class="ds-virtual-tree-node-expanded extend-icon" @click.stop="expandNode(node, !node.expanded)"></span>
            <DataViewCheckBox class="ds-virtual-tree-node-checkbox" v-bind="{ ...checkBoxProps }" v-show="isShowCheckbox(node)" :value="node.checked" :indeterminate="node.indeterminate" @change="checkboxClick(node, $event)" />
            <template v-if="parentIcon && data.children && data.children.length">
              <DsfIcon style="margin-right: 5px; cursor: pointer" :name="parentIcon" :style="getParentIconStyle"></DsfIcon>
            </template>
            <template v-if="childIcon && (!data.children || !data.children.length)">
              <DsfIcon style="margin-right: 5px; cursor: pointer" :name="childIcon" :style="getChildIconStyle"></DsfIcon>
            </template>
            <span @click="clickItem($event, data)" @mouseenter="(e) => handleMouseEnter(data, e)" @mouseleave="(e) => handleMouseLeave(data, e)">
              <slot :data="data" :node="node">
                {{ data[getLabel] }}
              </slot>
            </span>
          </div>
        </div>
      </DsfVirtualTree>
    </div>
  </div>
</template>
<script>
import DataViewCheckBox from '../input/checkBox.vue'
import createBackground from "_dataview/output/config/backgroundExtend.js";

const staticData = [
  {
    id: '0',
    pid: 'null',
    label: '梦创双杨',
    children: [
      {
        id: '1',
        pid: '0',
        label: '北京研发中心',
        children: [],
      },
      {
        id: '2',
        pid: '0',
        label: '成都研发中心',
        children: [],
      },
    ],
  },
]
const staticDataKeyDic = {
  id: '主键',
  pid: '父主键',
  label: '标签名',
  total: '数量字段（选填）',
}
import defaultBackground from '_dataview/share/components/common/backgroundDefault.js'
import dataAndGraphRelationMixin from '_dataview/mixins/dataAndGraphRelationMixin.js'
import { eventTemp } from '_dataview/output/utils/relativeEvent'
import { createCommonTextStyle } from '_dataview/output/config/commonConfig.js'
import mouseEvents from '_dataview/mixins/mouseEvents.js'
export default dsf.component({
  name: 'DsfDataViewTreeCatalog',
  ctrlCaption: '大屏树目录',
  mixins: [$mixins.dataView, dataAndGraphRelationMixin, mouseEvents],
  components: {
    DataViewCheckBox,
  },
  props: {
    staticData: {
      type: Array,
      default: () => staticData,
    },
    selectBackgroundConfig: {
      type: Object,
      default() {
        return { ...defaultBackground, ...{ color: { ...defaultBackground.color, ...{ value: '' } } } }
      },
    },
    lazy: {
      type: Boolean,
      default() {
        return false
      },
    },
    // 节点高度
    nodeHeight: {
      default: 26,
    },
    highlightCurrent: {
      type: Boolean,
      default: true,
    },
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    defaultExpandedKeys: {
      type: String,
      default: '',
    },
    //复选框样式
    checkBoxProps: {
      type: Object,
      default() {
        return {
          //border 颜色
          border: '#00DFFF',
          //激活border 颜色
          activeBorder: '#00DFFF',
          //背景色
          background: 'transparent',
          //激活背景色
          activtBackground: 'transparent',
          //图标颜色
          iconColor: '00DFFF',
          width: '14px',
          height: '14px',
          fontSize: '12px',
        }
      },
    },
    highColor: {
      type: String,
      default: '#DCF0FF',
    },
    labelTextStyle: {
      type: Object,
      default: () => createCommonTextStyle({ fontSize: '16', color: '#DCF0FF' }),
    },
    extendIconStyle: {
      type: Object,
      default: () => createCommonTextStyle({ fontSize: '14', color: '#DCF0FF' }),
    },
    //是否是数结构数据
    isTreeData: {
      type: Boolean,
      default: false,
    },
    mainKey: {
      type: String,
      default: 'null',
    },
    //是否展示复选框
    isCheckBox: {
      type: Boolean,
      default: false,
    },
    //展开icon
    extendIcon: {
      type: String,
      default: 'dsf-icon-ln_jiantouyou',
    },
    //父节点图标
    parentIcon: {
      type: String,
      default: '',
    },
    parentIconStyle: {
      type: Object,
      default: () => createCommonTextStyle({ fontSize: '14', color: '#DCF0FF' }),
    },
    childIcon: {
      type: String,
      default: '',
    },
    childIconStyle: {
      type: Object,
      default: () => createCommonTextStyle({ fontSize: '14', color: '#DCF0FF' }),
    },
    // 整体背景
    controlBackgroundConfig: {
      type: Object,
      default: () => createBackground(),
    },
    excelData: {
      type: Array,
      default: () => {
        let data = dsf.dataview.utils.flatTree([...staticData])
        return dsf.dataview.utils.transformToExcelData(data, staticDataKeyDic)
      },
    },
    mapRelations: {
      type: Array,
      default() {
        return [
          {
            text: '主键',
            value: 'id',
            map: 'id',
            hideDigit: true,
          },
          {
            text: '父主键',
            value: 'pid',
            map: 'pid',
            hideDigit: true,
          },
          {
            text: '标签名',
            value: 'label',
            map: 'label',
            hideDigit: true,
          },
          {
            text: '数量字段（选填）',
            value: 'total',
            map: 'total',
            hideDigit: true,
          },
        ]
      },
    },
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          //组件初始化事件
          mounted: {
            relatives: [],
            fn: eventTemp,
          },
          //数据加载完成事件
          dataLoad: {
            relatives: [],
            fn: eventTemp,
          },
          load: {
            relatives: [],
            fn: '',
          },
          click: {
            relatives: [],
            fn: '',
          },
          check: {
            relatives: [],
            fn: '',
          },
          // 鼠标移入事件
          mouseenter: {
            relatives: [],
            fn: eventTemp,
          },
          // 鼠标移出事件
          mouseleave: {
            relatives: [],
            fn: eventTemp,
          },
        }
      },
    },
  },
  computed: {
    getExtendIcon() {
      let extendIcon = this.extendIcon
      return `ds-icon ${extendIcon} icon-${extendIcon}`
    },
    getExtendIconStyle() {
      let { fontSize, color } = this.extendIconStyle
      color = this.getColor(color)
      return {
        fontSize: dsf.dataview.utils.transformPx(fontSize),
        color: color,
      }
    },
    getParentIconStyle() {
      let { fontSize, color } = this.parentIconStyle
      color = this.getColor(color)
      return {
        fontSize: dsf.dataview.utils.transformPx(fontSize),
        color: color,
      }
    },
    getChildIconStyle() {
      let { fontSize, color } = this.childIconStyle
      color = this.getColor(color)
      return {
        fontSize: dsf.dataview.utils.transformPx(fontSize),
        color: color,
      }
    },
    labelStyle() {
      let { fontFamily, fontSize, color, fontWeight, fontStyle, textDecoration } = this.labelTextStyle
      color = this.getColor(color)
      let style = {
        fontSize: dsf.dataview.utils.transformPx(fontSize),
        color,
        fontFamily,
        fontWeight,
        fontStyle,
        textDecoration,
      }
      return style
    },
    getId() {
      return this.mapRelations[0].map
    },
    getPid() {
      return this.mapRelations[1].map
    },
    getLabel() {
      return this.mapRelations[2].map
    },
    getTotal() {
      return this.mapRelations[3].map
    },
    getSelectLabel() {
      let background = this.dvBackgroundFormat(this.selectBackgroundConfig, {
        isBgInfoVar: true,
      })
      return {
        color: this.highColor,
        ...background,
      }
    },
  },
  data() {
    return {
      componentType: 'treeCatalog',
      data: [],
      currentCheckNodes: {},
      defaultProps: {
        label: 'label',
      },
      loadTree: false,
      currentNodeKey: '',
      expandKey: [],
    }
  },
  watch: {
    isTreeData() {
      this.init()
    },
    defaultExpandedKeys: {
      handler(val) {
        if (this.defaultExpandedKeys) {
          this.expandKey = this.defaultExpandedKeys.split(',').map(Number)
        }
      },
      immediate: true,
    },
  },
  created() {
    this.compatibleProp()
  },
  beforeDestroy() {
    dsf.emit.$remove('treeLoaded')
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        textStyles: [{ color: this.highColor }, this.labelTextStyle],
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        const { textStyles = [], backgrounds = [] } = config;
        groups = groups.filter(it => /布局|背景|边框设置|入场动画/.test(it.name));
        this.updateComponentStyle("highColor", textStyles[0]?.color);
        this.updateComponentStyle("labelTextStyle", textStyles[1]);
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    getColor(color) {
      if (color === 'theme') {
        color = '@main'
      }
      return dsf.themeConfig.getThemeColor(color) || color
    },
    // 兼容老板本
    compatibleProp() {
      // 标签
      if (this.$attrs.fontColor) {
        const labelTextStyle = dsf.mix(true, {}, this.labelTextStyle, {
          fontSize: this.fontSize,
          color: this.$attrs.fontColor,
          fontFamily: this.$attrs.fontFamily,
        })
        this.$emit(`update:labelTextStyle`, labelTextStyle)
      }
      // 展开图标
      if (this.$attrs.extendIconFontSize) {
        const extendIconStyle = dsf.mix(true, {}, this.extendIconStyle, {
          fontSize: this.$attrs.extendIconFontSize,
          color: this.$attrs.extendIconColor,
        })
        this.$emit(`update:extendIconStyle`, extendIconStyle)
      }
      // 目录图标
      if (this.$attrs.parentIconFontSize) {
        const parentIconStyle = dsf.mix(true, {}, this.parentIconStyle, {
          fontSize: this.$attrs.parentIconFontSize,
          color: this.$attrs.parentIconColor,
        })
        this.$emit(`update:parentIconStyle`, parentIconStyle)
      }
      // 节点图标
      if (this.$attrs.childIconFontSize) {
        const childIconStyle = dsf.mix(true, {}, this.childIconStyle, {
          fontSize: this.$attrs.childIconFontSize,
          color: this.$attrs.childIconColor,
        })
        this.$emit(`update:childIconStyle`, childIconStyle)
      }
    },
    dataAnalysis(data) {
      if (!data) {
        this.hasData = false
        return
      }
      if (dsf.isObject(data)) {
        data = [data]
      }
      if (eval(this.dynamicRules)) {
        if (!this.isTreeData) {
          let treeData = dsf.dataview.utils.establishTree(data, this.mainKey, this.getId, this.getPid)
          this.data = treeData
        } else {
          this.data = data
        }
      } else if (this.dataType === 'excel') {
        let treeData = dsf.dataview.utils.establishTree(data, this.mainKey, this.getId, this.getPid)
        this.data = treeData
      } else {
        if (this.$listeners['interceptOptions']) {
          this.$dispatch('interceptOptions', { data: data, vm: this })
        } else {
          this.data = data
        }
      }
      this.loadTree = false
    },
    loadCheckEvents(data) {
      try {
        let { fn } = this.eventRelativeDeal.check
        //给组件设置当前数据
        this.currentComponentData = data
        this.handleCommonEmit(fn, data)
      } catch (e) {
        console.error(e)
      }
    },
    clickItem(evt, data) {
      this.loadClickEvents(data, evt)
    },
    //节点点击事件
    nodeClick(data, node) {},
    //----------------重新实现虚拟树的方法----------start
    isExpandedOpacity(node) {
      return this.$refs.virtualTree.isExpandedOpacity(node)
    },
    isShowCheckbox(node) {
      return this.$refs.virtualTree.isShowCheckbox(node)
    },
    isDisabledNode(node) {
      return this.$refs.virtualTree.isDisabledNode(node)
    },
    checkboxClick(node, $event) {
      this.$refs.virtualTree.checkboxClick(node, $event)
    },
    expandNode() {
      this.$refs.virtualTree.expandNode(...arguments)
    },
    //----------------重新实现虚拟树的方法----------end
    //监控树数据载入状态
    loadDataSuccess(tree) {
      if (tree.nodeData && tree.nodeData.length > 0 && !this.loadTree) {
        this.loadTree = true
      }
    },
    checkNodes(data, checkedNodes) {
      this.currentCheckNodes = checkedNodes
      let leafs = checkedNodes.checkedNodes.filter((it) => !it.children || !it.children.length)
      this.loadCheckEvents(leafs)
    },
    //伪代码获取复选值
    getCheckNodes() {
      if (!this.isCheckBox) {
        return '复选框属性未开启'
      }
      return this.currentCheckNodes
    },
    //伪代码获取选中项值
    getSelectNodes() {
      return this.currentNodeKey
    },
    //等待树加载完成，最多轮询 10 次
    waitForLoadTree(callback, retryCount = 0) {
      if (this.loadTree) {
        callback() // 直接执行回调
        return
      }
      if (retryCount >= 10) {
        console.error('树加载超时')
        return
      }
      setTimeout(() => {
        this.waitForLoadTree(callback, retryCount + 1)
      }, 50)
    },
    //设置复选框选中项
    setCheckNodes(keys) {
      if (!this.isCheckBox) {
        return
      }
      if (this.loadTree) {
        this.$refs.virtualTree.setCheckedKeys(keys)
      } else {
        this.waitForLoadTree(() => {
          this.$refs.virtualTree.setCheckedKeys(keys)
        })
      }
    },
    //设置选中项
    setSelectNodes(keys) {
      let node = dsf.isArray(keys) ? keys[0] : keys
      const fn = () => {
        if (dsf.isString(node) || dsf.isNumber(node)) {
          const treeNode = this.$refs.virtualTree.getNode(String(node))
          if (treeNode) {
            node = treeNode?.data
          } else {
            // 处理找不到节点的情况
            node = null // 或者其他默认值
          }
        }
        this.currentNodeKey = node
        let expandKey = this.findParents(this.data, node)

        // 如果 findParents 返回值为空，则初始化为一个空数组
        expandKey = expandKey ? expandKey.map((item) => String(item[this.getId])) : []
        expandKey.push(String(node[this.getId]))
        expandKey.forEach((item) => {
          let itemNode = this.$refs.virtualTree.getNode(item)
          this.$refs.virtualTree.expandNode(itemNode, true)
        })
      }
      if (this.loadTree) {
        fn()
      } else {
        this.waitForLoadTree(() => {
          fn()
        })
      }
    },
    findParents(tree, target, path = []) {
      for (const node of tree) {
        if (node === target) {
          return path // 找到目标，返回收集到的父级
        }
        if (node.children) {
          const result = this.findParents(node.children, target, [...path, node])
          if (result) return result
        }
      }
      return null // 未找到目标
    },
  },
})
</script>
<style lang="scss">
@import '_dataview/assets/styles/share/components/DsfDataViewTreeCatalog.scss';
</style>