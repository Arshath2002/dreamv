<!--
 * @Description: k线图的标记线
 * @Author: shenah
 * @Date: 2024-07-05 15:30:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 16:36:31
-->
<template>
  <div>
    <template v-if="specialMarkLineData.length">
      <!-- 标记展示 -->
      <div class="ds-designer-property property-item">
        <div class="property-item-name">标记展示<span>： </span></div>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">起点<span>： </span></div>
        <DesDVSelect :data="{ dictionary: symbolOptionsList }" :value="getSymbol(markLine.symbol[0])" @change="changeSymbol($event, markLine.symbol, '0')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="getSymbol(markLine.symbol[0]) === 'custom'">
        <div class="property-item-name">上传<span>： </span></div>
        <el-input readonly="readonly" style="width: 108px; margin: 0 5px" placeholder="请输入内容" size="small" :value="markLine.symbol[0]"></el-input>
        <button class="upload-button el-button el-button--small">
          <span @click.stop="uploadClick" style="display: flex; width: 100%; height: 100%"> 点击上传 </span>
          <input @change="changeCustomSymbolImage($event, markLine.symbol, '0')" type="file" class="upload-input" style="display: none" />
        </button>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">终点<span>： </span></div>
        <DesDVSelect :data="{ dictionary: symbolOptionsList }" :value="getSymbol(markLine.symbol[1])" @change="changeSymbol($event, markLine.symbol, '1')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="getSymbol(markLine.symbol[1]) === 'custom'">
        <div class="property-item-name">上传<span>： </span></div>
        <el-input readonly="readonly" style="width: 108px; margin: 0 5px" placeholder="请输入内容" size="small" :value="markLine.symbol[1]"></el-input>
        <button class="upload-button el-button el-button--small">
          <span @click.stop="uploadClick" style="display: flex; width: 100%; height: 100%"> 点击上传 </span>
          <input @change="changeCustomSymbolImage($event, markLine.symbol, '1')" type="file" class="upload-input" style="display: none" />
        </button>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">大小<span>： </span></div>
        <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="markLine.symbolSize" @change="changeItemValue($event, markLine, 'symbolSize')" />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        <span>标记线 <span>： </span></span>
      </div>
      <div class="des-dv-icon-add" @click="addItem">
        <i class="add-btn el-icon-plus"></i>
      </div>
    </div>
    <template v-for="(item, index) in markLine.data">
      <div :key="index" class="ml20" v-if="!Array.isArray(item)">
        <div class="ds-designer-property property-item">
          <div class="property-item-name">
            <span>标注类型 <span>： </span></span>
          </div>
          <div style="width: 100%; display: flex; align-items: center; justify-content: space-between">
            <DesDVSelect :data="{ dictionary: typeOptions }" :value="item.type" @change="changeItemValue($event, item, 'type')" />
            <div class="des-dv-icon-add" @click="deleteItem(index)">
              <i class="add-btn el-icon-minus"></i>
            </div>
          </div>
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name">
            <span>标注值 <span>： </span></span>
          </div>
          <DesDVSelect :data="{ dictionary: valueDimOptions }" :value="item.valueDim" @change="changeItemValue($event, item, 'valueDim')" />
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name">线宽<span>： </span></div>
          <DesDVNumber :value="item.lineStyle.width" @change="changeItemValue($event, item.lineStyle, 'width')" />
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name">线类型<span>： </span></div>
          <DesDVRadioGroup
            :data="{ dictionary: borderTypeList }"
            :fieldMap="{
              text: 'label',
              value: 'value',
            }"
            :value="item.lineStyle.type"
            @change="changeItemValue($event, item.lineStyle, 'type')"
          />
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name">线颜色<span>： </span></div>
          <DesDVColorPicker :config="bothConfig" :value="item.lineStyle.itemLineColor" @change="changeItemColor($event, item.lineStyle, 'color')" />
        </div>
        <!-- 标签 -->
        <div class="ds-designer-property property-item">
          <div class="property-item-name">标签<span>： </span></div>
          <DesDVSwitch :value="item.label.show" @change="changeItemValue($event, item.label, 'show')"></DesDVSwitch>
        </div>
        <div v-if="item.label.show">
          <div class="ds-designer-property property-item ml20">
            <div class="property-item-name">位置<span>： </span></div>
            <Direction
              type="horizontal"
              :value="item.label.position"
              :mapData="[
                { mapName: 'start', mapKey: 'left' },
                { mapName: 'middle', mapKey: 'center' },
                { mapName: 'end', mapKey: 'right' },
              ]"
              @input="changeItemValue($event, item.label, 'position')"
            ></Direction>
          </div>
          <div class="ds-designer-property property-item ml20">
            <div class="property-item-name">样式<span>： </span></div>
            <DesDVTextStyle
              class="min"
              :value="item.label"
              :config="{
                isShowUnderline: false,
                isShowShadow: false,
                picker: {
                  type: 'color',
                },
              }"
              @change="changeItemValue($event, item, 'label')"
            ></DesDVTextStyle>
          </div>
        </div>
        <div class="ds-designer-property property-item">
          <DesDVHorizonLine></DesDVHorizonLine>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import itemMixin from "../itemMixin";
import Direction from "_dataview/designer/setting/graph/config/tool/direction.vue";
export default {
  name: "candlestickMarkLine",
  mixins: [itemMixin],
  inject: ["owner"],
  components: { Direction },
  props: {
    chart: {
      type: Object,
      require: true,
    },
    markLine: {
      type: Object,
      require: true,
    },
    mapFieldList: {
      type: Array,
      require: true,
    },
  },
  computed: {
    specialMarkLineData() {
      return this.markLine.data.filter((item) => !Array.isArray(item));
    },
  },
  data() {
    return {
      typeOptions: [
        {
          text: "最小值",
          value: "min",
        },
        {
          text: "最大值",
          value: "max",
        },
        {
          text: "平均值",
          value: "average",
        },
        {
          text: " 中位数",
          value: "median",
        },
      ],
      valueDimOptions: [
        {
          text: "开盘值",
          value: "open",
        },
        {
          text: "收盘值",
          value: "close",
        },
        {
          text: "最低值",
          value: "lowest",
        },
        {
          text: " 最高值",
          value: "highest",
        },
      ],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {},
    addItem() {
      this.markLine.data.push({
        type: "min",
        valueDim: "open",
        lineStyle: {
          width: 1,
          type: "dashed",
          color: "rgba(239,35,42,1)",
          itemLineColor: "rgba(239,35,42,1)",
        },
        label: {
          show: true,
          position: "end",
          color: "#fff",
          fontWeight: "normal",
          fontFamily: "Microsoft Yahei",
          fontSize: 12,
        },
      });
      this.$emit("updateChart");
    },
    changeSpecialItemColorKey(val, item, key) {
      if (key === "color") {
        this.$set(item, "itemLineColor", val);
      }
    },
    deleteItem(index) {
      this.markLine.data.splice(index, 1);
      this.$emit("updateChart");
    },
    getSymbol($symbol) {
      let symbols = this.symbolOptionsList.map((item) => item.value);
      if (!symbols.includes($symbol)) {
        return "custom";
      } else {
        return $symbol;
      }
    },
    changeSymbol(e, item, key) {
      let val = "";
      if (e !== "custom") {
        val = e;
        this.$set(item, key, val);
        this.$emit("updateChart");
      } else {
        this.$set(item, key, val);
      }
    },
    changeCustomSymbolImage($event, item, key) {
      this.changeSymbolImage($event, item, (result) => {
        this.changeItemValue(result, item, key);
      });
    },
  },
};
</script>
