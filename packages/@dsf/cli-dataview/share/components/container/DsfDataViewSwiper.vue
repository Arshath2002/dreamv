<template>
  <div
    class="dsf-dv-swiper data-view-item-wrap ds-control"
    :class="[swiperClass]"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
  >
    <div class="swiper-wrap">
      <div class="swiper" ref="swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in swiperData" :key="isDesign ? item.name : index">
            <div class="swiper-slide-content" @click="handleSlide($event, item)">
              <template v-if="swiperModel === 'picture'">
                <div class="picture" :style="getImgStyle(item)"></div>
              </template>
              <template v-else-if="swiperModel === 'slot'">
                <div class="swiper-container__slot_item" :slot-name="item.name">
                  <slot :name="item.name">
                    <div class="empty-slot">
                      {{ isDesign ? item.name : "" }}
                    </div>
                  </slot>
                </div>
              </template>
              <!-- 组件模式-设计器 -->
              <template v-else-if="isDesign && swiperModel === 'component'">
                <div class="swiper-container__slot_item slot-dv-name" :slot-name="item.name">
                  <slot :name="item.name">
                    <div class="empty-slot">
                      {{ isDesign ? item.name : "" }}
                    </div>
                  </slot>
                </div>
              </template>
              <!-- 组件模式运行 -->
              <template v-else-if="!isDesign && swiperModel === 'component'">
                <div v-if="componentSlots[index % componentSlots.length] && componentSlots[index % componentSlots.length].controls" class="swiper-container__slot_item">
                  <ComponentTree v-for="child in componentSlots[index % componentSlots.length].controls" :key="child.designId" :component-props="getChildProps(child, item)" :is-design="isDesign" />
                </div>
              </template>
            </div>
          </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination" v-if="swiperConfig.isPagination"></div>

        <!-- 如果需要滚动条 -->
        <div class="swiper-scrollbar" v-if="swiperConfig.isScrollbar"></div>
      </div>
    </div>
    <!-- 如果需要导航按钮 -->
    <template v-if="arrowType == 'icon' && swiperConfig.isNavigation">
      <DsfIcon class="swiper-btn-prev" :style="leftBtnStyle" :name="leftArrowIcon" />
      <DsfIcon class="swiper-btn-next" :style="rightBtnStyle" :name="rightArrowIcon" />
    </template>
    <template v-else-if="arrowType == 'image' && swiperConfig.isNavigation">
      <div class="swiper-btn-prev" :style="leftBtnStyle" />
      <div class="swiper-btn-next" :style="rightBtnStyle" />
    </template>
  </div>
</template>
<script>
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
import ComponentTree from "_dataview/share/common/components/ComponentTree.vue";
import componentContainer from "./componentContainer.js";
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
        size: "100% 100%",
        repeat: "no-repeat",
        position: "center",
        width: "100%",
        height: "100%",
      },
    };
  });
}

export default dsf.component({
  name: "DsfDataViewSwiper",
  ctrlCaption: "轮播容器",
  mixins: [$mixins.dataView, dataAnalysis, componentContainer],
  components: { ComponentTree },
  props: {
    // 组件模式 picture-图片模式 slot-插槽模式 component-组件模式
    swiperModel: {
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
    // 左按钮
    leftArrowIcon: {
      type: String,
      default: "nav_arrow_left",
    },
    // 右按钮
    rightArrowIcon: {
      type: String,
      default: "nav_arrow_right",
    },
    arrowType: {
      type: String,
      default: "icon",
    },
    leftImage: {
      type: Object,
      default() {
        return {
          active: "custom",
          custom: {
            image: "",
            size: "contain",
            repeat: "no-repeat",
            position: ["center", "center"],
          },
        };
      },
    },
    rightImage: {
      type: Object,
      default() {
        return {
          active: "custom",
          custom: {
            image: "",
            size: "contain",
            repeat: "no-repeat",
            position: ["center", "center"],
          },
        };
      },
    },
    imageWidth: {
      type: String,
      default: "20",
    },
    imageHeight: {
      type: String,
      default: "20",
    },
    // 按钮大小
    btnSize: {
      typeof: Number,
      default: 25,
    },
    // 按钮颜色
    btnColor: {
      type: String,
      default: "#ffffff",
    },
    //左上按钮 距离边位置
    leftBtnGap: {
      type: Number,
      default: 10,
    },
    // 右下按钮 距离边位置
    rightBtnGap: {
      type: Number,
      default: 10,
    },
    paginationColor: {
      type: String,
      default: "#035293",
    },
    // 图片模式下
    backgroundConfigs: {
      type: Array,
      default() {
        return createDefaultImgs();
      },
    },
    // 轮播配置
    swiperConfig: {
      type: Object,
      default() {
        return {
          initialSlide: 0,
          direction: "horizontal", // 垂直切换选项
          loop: false, // 循环模式选项
          isPagination: true, //分页器
          isNavigation: true, //前进后退按钮
          effect: "slide", //切换效果 "slide"（普通位移切换），还可设置为"fade"（淡入）、"cube"（方块）、"coverflow"（3d流）、"flip"（3d翻转）、"cards"(卡片式)、"creative"（创意性）。
          spaceBetween: 10, // 缝隙
          slidesPerView: 1, // 每行个数
          slidesPerGroup: 1, // 分组滚动个数
          speed: 800, // 滚动速度
        };
      },
    },
    // 3d 平移属性配置
    coverflowEffect: {
      type: Object,
      default() {
        return {
          rotate: -15, //slide做3d旋转时Y轴的旋转角度
          stretch: 10, //每个slide之间的拉伸值，越大slide靠得越紧
          depth: 60, //slide的位置深度。值越大z轴距离越远，看起来越小
          modifier: 1,
          slideShadows: false, //是否开启slide阴影
        };
      },
    },
    // 自动轮播属性配置
    autoplayConfig: {
      type: Object,
      default: () => {
        return {
          isAutoplay: false,
          autoplay: {
            delay: 2000, //1秒切换一次
            pauseOnMouseEnter: true, // 鼠标置于swiper时暂停自动切换
            disableOnInteraction: false, //用户操作swiper之后，是否禁止
          },
        };
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
  computed: {
    picture() {
      return this.backgroundConfigs.map((it) => {
        return {
          ...it,
          name: dsf.uuid(),
        };
      });
    },
    leftBtnStyle() {
      const { leftBtnGap, btnColor, btnSize, swiperConfig, arrowType, leftImage, imageWidth, imageHeight } = this;
      const style = {
        fontSize: dsf.dataview.utils.transformPx(btnSize),
        color: btnColor,
        transform: "translateY(-50%)",
      };
      if (swiperConfig.direction == "horizontal") {
        style.left = `${leftBtnGap}px`;
        style.top = "50%";
        style.transform = "translateY(-50%)";
      } else {
        style.top = `${leftBtnGap}px`;
        style.left = "50%";
        style.transform = "translateX(-50%)";
      }

      if (arrowType === "image") {
        const background = this.dvBackgroundFormat(leftImage);
        style.width = dsf.dataview.utils.transformPx(imageWidth);
        style.height = dsf.dataview.utils.transformPx(imageHeight);
        Object.assign(style, background);
      }
      return style;
    },
    rightBtnStyle() {
      const { rightBtnGap, btnColor, btnSize, swiperConfig, arrowType, rightImage, imageWidth, imageHeight } = this;
      const style = {
        fontSize: dsf.dataview.utils.transformPx(btnSize),
        color: btnColor,
      };

      if (swiperConfig.direction == "horizontal") {
        style.right = `${rightBtnGap}px`;
        style.top = "50%";
        style.transform = "translateY(-50%)";
      } else {
        style.bottom = `${rightBtnGap}px`;
        style.left = "50%";
        style.transform = "translateX(-50%)";
      }
      if (arrowType === "image") {
        const background = this.dvBackgroundFormat(rightImage);
        style.width = dsf.dataview.utils.transformPx(imageWidth);
        style.height = dsf.dataview.utils.transformPx(imageHeight);
        Object.assign(style, background);
      }
      return style;
    },
  },
  watch: {
    "slots.length"() {
      if (this.isDesign) {
        this.setSwiperData();
      }
    },
    // 背景图改变
    backgroundConfigs: {
      handler(val, old) {
        const model = this.swiperModel;
        if (!_.isEqual(val, old) && model === "picture") {
          this.setSwiperData();
        }
      },
      deep: true,
    },
    swiperData: {
      handler() {
        this.swiper && this.swiper.update();
      },
    },
    // 模式切换
    swiperModel: {
      handler() {
        // 初始化插槽，清空插槽
        this.setSwiperData([]);
      },
    },
    paginationColor() {
      this.$el && this.$el.style.setProperty("--swiper-pagination-color", this.paginationColor);
    },
    height() {
      this.$nextTick(() => {
        this.swiper && this.swiper.updateSize();
      });
    },
    swiperConfig: {
      handler(val) {
        this.$nextTick(() => {
          this.initSwiper();
        });
      },
      deep: true,
    },
    coverflowEffect: {
      handler(val) {
        this.$nextTick(() => {
          this.initSwiper();
        });
      },
      deep: true,
    },
    autoplayConfig: {
      handler() {
        this.$nextTick(() => {
          this.initSwiper();
        });
      },
      deep: true,
    },
  },
  data() {
    return {
      data: [],
      swiperData: [],
      swiper: null,
      swiperClass: "dsf-dataview-swiper-" + dsf.uuid(),
      activeIndex: 0,
      componentType: "swiper",
      otherEvents: ["切换滑块"],
    };
  },
  beforeDestroy() {
    this.swiper && this.swiper.destroy(false);
  },
  created() {
    this.setSwiperData();
  },
  mounted() {
    this.$el.style.setProperty("--swiper-pagination-color", this.paginationColor);
  },
  methods: {
    /**
     * 切换激活滑块
     * index	num	必选	指定将要切换到的slide的索引
     * speed	num	可选	切换速度(单位ms)
     * runCallbacks	boolean	可选	设置为false时不会触发transition回调函数
     */
    changeActive(...args) {
      this.swiper && this.swiper.slideTo(...args);
    },

    /**
     * 设计器中更新子组件数据
     */
    designerUpdateChildrenData() {
      if (this.swiperModel === "component" && this.slots[0] && this.slots[0].controls.length) {
        this.updateCommonChildrenData();
      }
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
     * 设置轮播数据
     * @param {Array} slots 插槽
     */
    setSwiperData(slots = this.slots) {
      const model = this.swiperModel;
      if (slots.length === 0) {
        slots.push({
          label: "carousel_1",
          name: "carousel_1",
          controls: [],
        });
        if (this.isDesign) {
          this.$emit("update:slots", slots);
        }
      }
      switch (model) {
        case "slot":
          this.swiperData = slots;
          break;
        case "component":
          this.swiperData = this.isDesign ? slots : [];
          break;
        default:
          this.swiperData = this.picture;
          break;
      }
    },
    beforeInit() {
      this.loadSwiper().then(() => {
        const model = this.swiperModel;
        this.init();
        if (!this.isDesign && model === "component") {
          return false;
        }
        this.initSwiper();
      });
    },
    initSwiper() {
      console.log("initSwiper");
      const swiperClass = this.swiperClass;
      if (!this.$refs.swiper) return false;

      this.swiper && this.swiper.destroy(false);
      this.swiper = null;

      let { swiperConfig, autoplayConfig, coverflowEffect } = this;

      if (swiperConfig.effect !== "slide") {
        swiperConfig.direction = "horizontal";
      }
      if (swiperConfig.effect !== "slide" && swiperConfig.effect !== "coverflow") {
        swiperConfig.slidesPerView = 1;
        swiperConfig.slidesPerGroup = 1;
      }

      autoplayConfig = autoplayConfig.isAutoplay ? { autoplay: autoplayConfig.autoplay } : {};

      const option = {
        direction: "horizontal", // 垂直切换选项
        loop: false, // 循环模式选项
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        resizeObserver: true,

        spaceBetween: 0, // 缝隙

        grabCursor: true, //指针会变成手掌形状

        touchStartPreventDefault: false, // 不阻止echarts的默认事件，不然点击事件不生效
        // 如果需要分页器
        pagination: {
          el: `.${swiperClass} .swiper-pagination`,
          clickable: true,
        },
        // 如果需要前进后退按钮
        navigation: {
          nextEl: `.${swiperClass} .swiper-btn-next`,
          prevEl: `.${swiperClass} .swiper-btn-prev`,
        },
        // 如果需要滚动条
        scrollbar: {
          el: `.${swiperClass} .swiper-scrollbar`,
        },

        fadeEffect: {
          crossFade: false,
        },
        //cube方块配置
        cubeEffect: {
          slideShadows: false,
          shadow: false,
          shadowOffset: 20,
          shadowScale: 0.6,
        },
        // 3d翻转
        flipEffect: {
          slideShadows: false,
        },
        watchSlidesProgress: true,
        coverflowEffect,
        ...swiperConfig,
        ...autoplayConfig,
      };
      //个数小于2 不轮播
      if (this.swiperData.length < 2) {
        option.loop = false;
      }
      let onEvents = {
        slideChange: this.change,
        resize: () => {
          this.$nextTick(() => {
            const children = $(this.$el).find(".swiper-container__slot_item>div");
            for (let i = 0; i < children.length; i++) {
              const comp = children[i].__vue__;
              comp && comp.resize && comp.resize();
            }
          });
        },
      };
      this.swiper = new Swiper(this.$refs.swiper, {
        ...option,
        ...{ on: onEvents },
      });
    },
    loadSwiper() {
      return new Promise((resolve, reject) => {
        if (!window.swiper) {
          let loadFileHttp = dsf.dataview.utils.importFiles(
            [
              this.$getWebPath("static/js/libs/swiper/swiper-bundle.v11.0.3.min.css", __DSF_DATAVIEW_PATH__),
              this.$getWebPath("static/js/libs/swiper/swiper-bundle.v11.0.3.min.js", __DSF_DATAVIEW_PATH__),
            ],
            () => {
              resolve(true);
            },
            () => {
              dsf.layer.message("加载swiper相关文件报错", false);
              reject(false);
            },
            () => {
              this.addNowRequestFileList(loadFileHttp, true);
            }
          );
          this.addNowRequestFileList(loadFileHttp);
        } else {
          resolve(true);
        }
      });
    },
    dataAnalysis(data) {
      this.data = data;
      //设计器更新组件数据
      if (this.isDesign) {
        this.designerUpdateChildrenData();
      }
      const model = this.swiperModel;
      if (model === "component" && !this.isDesign) {
        this.swiperData = data;
        this.$nextTick(() => {
          this.initSwiper();
        });
      }
    },
    change(e) {
      this.activeIndex = e.realIndex;
      this.$emit("change", { activeIndex: e.activeIndex, e, vm: this });
      if (!this.isDesign) {
        this.loadChangeEvents(e.realIndex);
      }
    },
    //切换依赖方法
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
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/DsfDataViewSwiper.scss";
</style>
