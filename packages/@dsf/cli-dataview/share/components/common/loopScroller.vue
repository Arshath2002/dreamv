<template>
  <div
    ref="container"
    class="scroll-list-container"
    :class="{ 'disable-scroll': disableScroll, 'horizontal': direction === 'horizontal' }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @scroll="handleScroll"
  >
    <div class="scroll-content" ref="content">
      <slot></slot>
    </div>
    <div class="scroll-content copy" ref="copyContent" v-if="!isContentShort">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScrollList",
  props: {
    speed: {
      type: [Number, String],
      default: 0.25,
      validator: (value) => parseFloat(value) > 0,
    },
    step: {
      type: [Number],
      default: 0,
      validator: (value) => parseFloat(value) >= 0,
    },
    interval: {
      type: [Number],
      default: 0,
      validator: (value) => parseFloat(value) >= 0,
    },
    hoverPause: {
      type: Boolean,
      default: true,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    disableScroll: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: 'vertical',
      validator: (value) => ['vertical', 'horizontal'].includes(value),
    },
  },
  data() {
    return {
      isContentShort: false,
      scrollPosition: 0,
      isScrolling: false,
      animationFrame: null,
      contentSize: 0,
      isAtBottomOrRight: false,
      scrollTimer: null,
    };
  },
  mounted() {
    setTimeout(() => {
      this.initializeScroll();
      if (this.autoplay) {
        this.startScrolling();
      }
    }, 100);
    window.addEventListener('resize', this.handleResize);
    if (this.disableScroll) {
      this.$refs.container.addEventListener('wheel', this.preventScroll, { passive: false });
    }
  },
  beforeDestroy() {
    this.stopScrolling();
    window.removeEventListener('resize', this.handleResize);
    if (this.disableScroll) {
      this.$refs.container.removeEventListener('wheel', this.preventScroll);
    }
  },
  methods: {
    initializeScroll() {
      const container = this.$refs.container;
      const content = this.$refs.content;

      if (!container || !content) return;

      // 根据方向计算尺寸
      this.contentSize = this.direction === 'horizontal' ? content.offsetWidth : content.offsetHeight;
      const containerSize = this.direction === 'horizontal' ? container.offsetWidth : container.offsetHeight;
      this.isContentShort = this.contentSize <= containerSize;

      if (!this.isContentShort && this.$refs.copyContent) {
        // 设置复制内容的尺寸和位置
        if (this.direction === 'horizontal') {
          this.$refs.copyContent.style.width = `${this.contentSize}px`;
          this.$refs.copyContent.style.left = `${this.contentSize}px`;
        } else {
          this.$refs.copyContent.style.height = `${this.contentSize}px`;
          this.$refs.copyContent.style.top = `${this.contentSize}px`;
        }
      }
    },
    startScrolling() {
      if (this.isContentShort || this.isScrolling) return;

      this.isScrolling = true;
      if (this.step > 0 && this.interval > 0) {
        // 使用 step 和 interval 的定时器逻辑
        this.stepScroll();
      } else {
        // 使用原有速度动画逻辑
        this.animate();
      }
    },
    stopScrolling() {
      this.isScrolling = false;
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
      if (this.scrollTimer) {
        clearInterval(this.scrollTimer);
        this.scrollTimer = null;
      }
    },
    stepScroll(ms) {
      const interval = ms || parseFloat(this.interval);
      this.scrollTimer = setTimeout(() => {
        this.scrollPosition += parseFloat(this.step);

        // 在重置位置时禁用过渡效果
        if (this.scrollPosition > this.contentSize) {
          this.disableTransition();
          this.scrollPosition -= this.contentSize + this.step;
          this.applyTransform();
          this.stepScroll(100);
        } else {
          this.enableTransition();
          this.applyTransform();
          this.stepScroll();
        }

      }, interval);
    },
    animate() {
      if (!this.isScrolling) return;

      this.scrollPosition += parseFloat(this.speed);

      // 在重置位置时禁用过渡效果
      if (this.scrollPosition >= this.contentSize) {
        this.disableTransition();
        this.scrollPosition -= this.contentSize;
      } else {
        this.enableTransition();
      }

      this.applyTransform();

      this.animationFrame = requestAnimationFrame(() => this.animate());
    },
    applyTransform() {
      const transform = this.direction === 'horizontal' ? `translateX(-${this.scrollPosition}px)` : `translateY(-${this.scrollPosition}px)`;
      this.$refs.content.style.transform = transform;
      if (this.$refs.copyContent) {
        this.$refs.copyContent.style.transform = transform;
      }
    },
    disableTransition() {
      if (this.$refs.content) {
        this.$refs.content.style.transition = 'none';
      }
      if (this.$refs.copyContent) {
        this.$refs.copyContent.style.transition = 'none';
      }
    },
    enableTransition() {
      // 只有当 step 和 interval 都存在时才启用过渡
      if (this.step > 0 && this.interval > 0) {
        if (this.$refs.content) {
          this.$refs.content.style.transition = 'transform 0.5s linear';
        }
        if (this.$refs.copyContent) {
          this.$refs.copyContent.style.transition = 'transform 0.5s linear';
        }
      } else {
        this.disableTransition();
      }
    },
    handleMouseEnter() {
      if (this.hoverPause) {
        this.stopScrolling();
      }
    },
    handleMouseLeave() {
      if (this.hoverPause && !this.isContentShort) {
        this.startScrolling();
      }
    },
    handleScroll() {
      const container = this.$refs.container;
      // 判断是否滚动到底部或最右侧
      if (this.direction === 'horizontal') {
        this.isAtBottomOrRight = container.scrollLeft + container.offsetWidth >= container.scrollWidth;
      } else {
        this.isAtBottomOrRight = container.scrollTop + container.offsetHeight >= container.scrollHeight;
      }
    },
    handleResize() {
      this.stopScrolling();
      this.$nextTick(() => {
        this.initializeScroll();
        if (this.autoplay && !this.isContentShort) {
          this.startScrolling();
        }
      });
    },
    preventScroll(event) {
      event.preventDefault();
    },
  },
};
</script>
<style scoped lang="scss">
.scroll-list-container {
  height: 100%;
  overflow: hidden;
  position: relative;

  &.horizontal {
    width: 100%;
    white-space: nowrap;

    .scroll-content {
      // 确保宽度被子元素撑开
      width: fit-content;
      display: inline-block;
      overflow: hidden;

      &.copy {
        left: unset; /* 由 JS 动态设置 left */
      }
    }
  }
  
  .scroll-content {
    position: relative;
    width: 100%;

    &.copy {
      position: absolute;
    }
  }

  &.disable-scroll {
    overflow: hidden !important;
  }
}

</style>