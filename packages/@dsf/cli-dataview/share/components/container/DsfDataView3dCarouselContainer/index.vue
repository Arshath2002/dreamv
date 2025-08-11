<!--
 * @Editor: zhanghang
 * @Description: 3d 轮播容器
 * @Date: 2025-06-24 17:20:33
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-26 10:20:25
-->
<template>
  <div
    class="dsf-dv-3d-carousel-container data-view-item-wrap ds-control"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
  >
    <div class="carousel-wrap" ref="carousel">
      <div :style="carouselItemStyle" class="carousel-item" @click="handleSlide($event, item)" v-for="(item, index) in carouselData" :key="isDesign ? item.name : index">
        <template v-if="carouselModel === 'picture'">
          <div class="picture" :style="getImgStyle(item)"></div>
        </template>
        <template v-else-if="carouselModel === 'slot'">
          <div class="carousel-item-slot" :slot-name="item.name">
            <slot :name="item.name">
              <div class="empty-slot">
                {{ isDesign ? item.name : "" }}
              </div>
            </slot>
          </div>
        </template>
        <!-- 组件模式-设计器 -->
        <template v-else-if="isDesign && carouselModel === 'component'">
          <div class="carousel-item-slot slot-dv-name" :slot-name="item.name">
            <slot :name="item.name">
              <div class="empty-slot">
                {{ isDesign ? item.name : "" }}
              </div>
            </slot>
          </div>
        </template>
        <!-- 组件模式运行 -->
        <template v-else-if="!isDesign && carouselModel === 'component'">
          <div v-if="componentSlots[index % componentSlots.length] && componentSlots[index % componentSlots.length].controls" class="carousel-item-slot">
            <ComponentTree v-for="child in componentSlots[index % componentSlots.length].controls" :key="child.designId" :component-props="getChildProps(child, item)" :is-design="isDesign" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import Carousel from "./Carousel.js";
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
import ComponentTree from "_dataview/share/common/components/ComponentTree.vue";
import componentContainer from "../componentContainer.js";
const staticDataKeyDic = {
  name: "name",
  value: "value",
};
const staticData = [
  {
    name: "工业增加值",
    value: 148.6,
  },
  {
    name: "农业增加值",
    value: 168.6,
  },
  {
    name: "互联网增加值",
    value: 118.6,
  },
  {
    name: "房产增加值",
    value: 128.6,
  },
];

function createDefaultImgs() {
  return [
    "/dataview/file/sdk/download?files=b46a5faa9d9c4a519b8ea28cbfa4316a",
    "/dataview/file/sdk/download?files=b46a5faa9d9c4a519b8ea28cbfa4316a",
    "/dataview/file/sdk/download?files=b46a5faa9d9c4a519b8ea28cbfa4316a",
  ].map((url) => {
    return {
      active: "pattern",
      pattern: {
        image: url,
        size: "contain",
        repeat: "no-repeat",
        position: "center",
        width: "100%",
        height: "100%",
      },
    };
  });
}
export default dsf.component({
  name: "DsfDataView3dCarouselContainer",
  ctrlCaption: "旋转容器3D",
  mixins: [$mixins.dataView, dataAnalysis, componentContainer],
  components: {
    ComponentTree,
  },
  props: {
    // 组件模式 picture-图片模式 slot-插槽模式 component-组件模式
    carouselModel: {
      type: String,
      default: "picture",
    },
    // 内边距（上、右、下、左）
    padding: {
      type: Array,
      default() {
        return [15, 15, 15, 15];
      },
    },
    itemWidth: {
      type: String,
      default: "150",
    },
    itemHeight: {
      type: String,
      default: "50%",
    },
    // 插槽
    slots: {
      type: Array,
      default() {
        return [];
      },
    },
    // 静态数据
    staticData: {
      type: Array,
      default() {
        return staticData;
      },
    },
    // 图片模式下
    backgroundConfigs: {
      type: Array,
      default() {
        return createDefaultImgs();
      },
    },
    // 表格数据
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
    height: {
      type: String,
      default: "100%",
    },
    carouselOptions: {
      type: Object,
      default() {
        return {
          //最远缩放比 max=1 min=0.1
          farScale: 0.5,
          //椭圆 x 轴 中心点位置比例 2 代表 1/2 宽度的2分之一
          xOrigin: 2,
          //椭圆  y 轴 中心点位置比例 10 代表 1/10 高度的10分之一
          yOrigin: 10,
          //椭圆 长半轴 中心点位置比例 2 代表 1/2 宽度的2分之一
          xRadius: 2,
          //椭圆 短半轴 中心点位置比例 6 代表 1/2 宽度的6分之一
          yRadius: 6,
          //旋转木马的相对速度系数，取值范围：任何正数（即1~），数值越大速度越快，如1表示慢，4表示中等，10表示快
          speed: 4,
          //自动旋转 0 - 不自动旋转 1 顺时针 -1 逆时针
          autoPlay: 0,
          //激活单元类名
          frontItemClass: "",
        };
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
          //数据处理完成事件
          load: {
            relatives: [],
            fn: eventTemp,
          },
          //数据点击事件
          click: {
            relatives: [],
            fn: eventTemp,
          },
          // 切换事件
          change: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
  },
  watch: {
    "slots.length"() {
      if (this.isDesign) {
        this.setCarouselData();
      }
    },

    // 背景图改变
    backgroundConfigs: {
      handler(val, old) {
        const model = this.carouselModel;
        if (!_.isEqual(val, old) && model === "picture") {
          this.setCarouselData();
        }
      },
      deep: true,
    },
    carouselData: {
      handler() {
        this.$nextTick(() => {
          this.carousel && this.carousel.reset();
        });
      },
    },
    // 模式切换
    carouselModel: {
      handler() {
        // 初始化插槽，清空插槽
        this.setCarouselData([]);
      },
    },
    carouselOptions: {
      handler(opt) {
        this.carousel && this.carousel.reset(opt);
      },
      deep: true,
    },
    height() {
      this.$nextTick(() => {
        this.carousel && this.carousel.resize();
      });
    },
    itemWidth() {
      this.$nextTick(() => {
        this.carousel && this.carousel.resize();
      });
    },
    itemHeight() {
      this.$nextTick(() => {
        this.carousel && this.carousel.resize();
      });
    },
  },
  computed: {
    carouselItemStyle() {
      const { itemWidth, itemHeight } = this;
      return {
        width: dsf.dataview.utils.transformPx(itemWidth),
        height: dsf.dataview.utils.transformPx(itemHeight),
      };
    },
    picture() {
      return this.backgroundConfigs.map((it) => {
        return {
          ...it,
          name: dsf.uuid(),
        };
      });
    },
  },
  data() {
    return {
      data: [],
      carouselData: [],
      carousel: null,
      activeIndex: 0,
      componentType: "carousel3d",
      otherEvents: ["切换卡片"],
    };
  },
  beforeDestroy() {
    this.carousel && this.carousel.deactivate();
  },

  created() {
    this.setCarouselData();
  },
  methods: {
    resize() {
      this.carousel && this.carousel.resize();
    },

    /**
     * 容器点击事件
     * @param {Object} evt 事件对象
     * @param {Object]} item 点击的对象
     */
    handleSlide(evt, item) {
      this.$dispatch("clickItem", item);
      this.loadClickEvents(item, evt);
    },

    /**
     * 图片模式-图片背景
     * @param {Object} item 图片对象
     */
    getImgStyle(item) {
      return this.dvBackgroundFormat(item);
    },

    /**
     * 设置旋转数据
     * @param {Array} slots 插槽
     */
    setCarouselData(slots = this.slots) {
      const model = this.carouselModel;
      if (slots.length === 0) {
        slots.push(
          ...[
            {
              label: "carousel_1",
              name: "carousel_1",
              controls: [],
            },
            {
              label: "carousel_2",
              name: "carousel_2",
              controls: [],
            },
            {
              label: "carousel_3",
              name: "carousel_3",
              controls: [],
            },
          ]
        );
        if (this.isDesign) {
          this.$emit("update:slots", slots);
        }
      }
      switch (model) {
        case "slot":
          this.carouselData = slots;
          break;
        case "component":
          this.carouselData = this.isDesign ? slots : [];
          break;
        default:
          this.carouselData = this.picture;
          break;
      }
    },

    /**
     * 设计器中更新子组件数据
     */
    designerUpdateChildrenData() {
      if (this.carouselModel === "component" && this.slots[0] && this.slots[0].controls.length) {
        this.updateCommonChildrenData();
      }
    },

    change(activeIndex) {
      this.activeIndex = activeIndex;
      this.$emit("change", { activeIndex, vm: this });
      if (!this.isDesign) {
        this.loadChangeEvents(activeIndex);
      }
    },

    /**
     *切换卡片索引
     */
    changeActive(index) {
      this.carousel && this.carousel.goTo(index);
    },

    /**
     * 切换依赖方法
     */
    loadChangeEvents(data, e) {
      try {
        let { fn } = this.eventRelativeDeal.change;
        //给组件设置当前数据
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data, e);
      } catch (e) {
        console.error(e);
      }
    },

    /**
     * 初始化3D旋转容器
     */
    initCarousel() {
      this.carousel && this.carousel.deactivate();
      if (this.$refs.carousel) {
        this.carousel = new Carousel(this.$refs.carousel, {
          ...this.carouselOptions,
          onAnimationFinished: (index) => {
            this.change(index);
          },
        });
      }
    },
    dataAnalysis(data) {
      this.data = data;
      //设计器更新组件数据
      if (this.isDesign) {
        this.designerUpdateChildrenData();
      }
      const model = this.carouselModel;
      if (model === "component" && !this.isDesign) {
        this.carouselData = data;
      }
      this.$nextTick(() => {
        this.initCarousel();
      });
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/DsfDataView3dCarouselContainer.scss";
</style>
