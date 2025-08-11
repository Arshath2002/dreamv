export default {
  props: {
    isScroll: {
      type: Boolean,
      default: false,
    },
    scrollSpeed: {
      type: [Number, String],
      default: 0.4,
    },
    isHorizontalScroll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      animationHandler: null,
      scrollTop: 0,
      scrollLeft: 0,
      animateStatus: false,
      resizeFc: null,
      rowHeightNum: 0,
    };
  },
  watch: {
    isScroll() {
      this.$nextTick(this.animation);
    },
    rowHeight() {
      if (this.isDesign) {
        setTimeout(this.animation, 500);
      }
    },
  },
  created() {
    this.resizeFc = _.debounce(this.onResize, 200);
    window.addEventListener("resize", this.resizeFc);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeFc);
    this.stopAnimation();
  },
  methods: {
    addScrollerEvents() {
      const el = this.getScrollerEl();
      el.addEventListener("mousewheel", this.mousewheelListenerEvent);
      el.addEventListener("mouseover", this.mouseOverListenerEvent);
      el.addEventListener("mouseleave", this.mouseLeaveListenerEvent);
    },
    removeScrollerEvents() {
      const el = this.getScrollerEl();
      el.removeEventListener("mousewheel", this.mousewheelListenerEvent);
      el.removeEventListener("mouseover", this.mouseOverListenerEvent);
      el.removeEventListener("mouseleave", this.mouseLeaveListenerEvent);
    },
    mouseOverListenerEvent() {
      this.animateStatus = false;
    },
    mouseLeaveListenerEvent() {
      const el = this.getScrollerEl();
      this.animateStatus = true;
      this.scrollTop = el.scrollTop; // 更新 scrollTop
      this.scrollLeft = el.scrollLeft; // 更新 scrollLeft
      this.animation(false);
    },
    mousewheelListenerEvent(e) {
      this.animateStatus = false;
      this.scrollTop += e.deltaY;
      if (this.isHorizontalScroll) {
        this.scrollLeft += e.deltaX;
      }
      e.stopPropagation();
    },
    stopAnimation() {
      this.removeScrollerEvents();
      cancelAnimationFrame(this.animationHandler);
    },
    resetAnimation() {
      const el = this.getScrollerEl();
      if (el) {
        el.scrollTop = 0;
        el.scrollLeft = 0;
        this.scrollTop = 0;
        this.scrollLeft = 0;
      }
    },
    onResize() {
      this.$nextTick(() => {
        if (this.fixEachRowType === "rowNum") {
          const el = this.getScrollerEl();
          this.rowHeightNum = Math.floor(el.clientHeight / this.rowNum);
        }
        this.animation();
      });
    },
    getScrollerEl() {
      return this.$el.querySelector(".el-scrollbar__wrap");
    },
    animation(isFresh = true) {
      this.stopAnimation();
      if (isFresh) {
        this.resetAnimation();
      }

      setTimeout(() => {
        const el = this.getScrollerEl();
        if (this.isScroll && (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth)) {
          this.addScrollerEvents();
          this.animateStatus = true;

          const _requestAnimationFrame = () => {
            cancelAnimationFrame(this.animationHandler);
            this.animationHandler = requestAnimationFrame(() => {
              const scrollHeight = el.scrollHeight;
              const scrollWidth = el.scrollWidth;
              const newScrollTop = this.scrollTop + Number(this.scrollSpeed);
              const newScrollLeft = this.scrollLeft + Number(this.scrollSpeed);

              // Vertical scrolling
              if (this.isScroll) {
                if (newScrollTop + el.clientHeight >= scrollHeight) {
                  this.resetAnimation();
                } else {
                  el.scrollTop = newScrollTop;
                  this.scrollTop = newScrollTop;
                }
              }

              // Horizontal scrolling
              if (this.isHorizontalScroll) {
                if (newScrollLeft + el.clientWidth >= scrollWidth) {
                  this.resetAnimation();
                } else {
                  el.scrollLeft = newScrollLeft;
                  this.scrollLeft = newScrollLeft;
                }
              }

              // Continue animation if scrolling is possible
              if (this.animateStatus && (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth)) {
                _requestAnimationFrame();
              }
            });
          };
          _requestAnimationFrame();
        }
      }, 400);
    },
  },
}
