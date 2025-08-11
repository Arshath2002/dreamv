<template>
  <div class="listBasics" ref="box" style="height: 100%">
    <slot></slot>
    <slot v-if="!isfew"></slot>
  </div>
</template>
<script>
export default {
  name: "listBasics",
  created() {},
  mounted() {
    this.isStart();
  },
  props: {
    SHeight: {
      type: String,
      default: "150",
    },
    isSlots: {
      type: Boolean,
      default: false,
    },
    speed: {
      default: "1",
      type: String,
    },
    isHoverStop: {
      type: Boolean,
      default: false,
    },
    isDesignPro: {
      type: Boolean,
      default: false,
    },
    ScrollTime: {
      type: String,
      default: "1",
    },
    direction: {
      type: String,
      default: "1",
    },
  },
  computed: {
    // //第一个slot
    // ele0() {
    //   return this.$refs.box.children[0];
    // },
    // //第二个slot
    // ele1() {
    //   return this.$refs.box.children[1];
    // },
    // //盒子的可视高度
    // boxHeight() {
    //   return this.$refs.box.clientHeight;
    // },
  },
  data() {
    return {
      height: 0,
      isScroll: true,
      isfew: false, //(为ture时不显示第二个slot,滚动条件不足，数据高度不够，不会滚动）
      timeIndex: "",
    };
  },
  methods: {
    //第一个slot
    ele0() {
      if (this.$refs.box) {
        return this.$refs.box.children[0];
      } else {
        return "";
      }
    },
    //第二个slot
    ele1() {
      return this.$refs.box.children[1];
    },
    //盒子的可视高度
    boxHeight() {
      return this.$refs.box.clientHeight;
    },
    isStart() {
      cancelAnimationFrame(this.timeIndex);
      this.height = 0;
      this.isScroll = true;
      // console.log('重新计算')
      //在盒子内容高度小于可视高度时不滚动
      this.$nextTick(() => {
        //boxHeight用渲染后高度
        if (this.boxHeight() < this.ele0().clientHeight) {
          this.isfew = false;
          this.$nextTick(() => {
            this.start(this.height);
            this.setEvet();
          });
        } else {
          //滚动条件不足，数据高度不够'
          this.isfew = true;
          this.ele0().style = `transform:translateY(0px);`; //归位
        }
      });
    },
    // 鼠标移入停止滚动 移出继续滚动
    setEvet() {
      let _this = this;
      this.$refs.box.onmouseenter = () => {
        cancelAnimationFrame(this.timeIndex); //停止
        this.isScroll = !this.isHoverStop;
        // this.height = 0;
      };
      this.$refs.box.onmouseleave = () => {
        if (this.isfew) {
          return false;
        }
        if (this.isHoverStop) {
          this.isScroll = true;
          this.$nextTick(() => {
            this.start(this.height);
          });
        }
      };
    },
    // 滚动方法
    start(height) {
      let _this = this;
      if (this.direction == 1) {
        //向上
        this.ele0().style = `transform:translateY(-${height}px);`;
        this.ele1().style = `height:${this.boxHeight()}px;transform:translateY(-${height}px);overflow: hidden;`;
      } else {
        //向下
        this.ele0().style = `transform:translateY(-${this.ele0().clientHeight - height}px);`;
        this.ele1().style = `transform:translateY(-${this.ele1().clientHeight - height}px);`;
      }
      if (height >= this.ele0().clientHeight) {
        this.height = 0;
      } else {
        this.height += Number(this.speed);
      }
      if (!this.isScroll) return;
      this.timeIndex = window.requestAnimationFrame(() => {
        //移除组件不报错
        if (this.ele0()) {
          _this.start(_this.height);
        }
      });
    },
  },
  watch: {
    // SHeight(v) {
    //   if (this.isDesign) {
    //     this.resize(v)
    //   }
    // },
    SHeight: {
      handler: function () {
        this.isStart();
      },
      deep: true,
    },
  },
};
</script>
