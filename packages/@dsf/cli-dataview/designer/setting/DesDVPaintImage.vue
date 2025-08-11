<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-01-16 11:15:50
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-17 11:22:40
-->
<template>
  <div class="des-dv-paint-image-wrapper">
    <div class="des-dv-paint-image-wrapper__content">
      <div class="sketch" ref="sketch" v-if="image" :style="sketchStyle">
        <canvas ref="canvas" class="canvas" data-img=""></canvas>
        <div class="mask" ref="mask" :style="maskImageStyle">
          <div class="mask-inner" ref="mask-inner" :style="maskInnerStyle"></div>
        </div>
      </div>
    </div>
    <svg xlmns="http://www.w3.org/2000/svg" version="1.1" style="display: none">
      <filter :id="heatId" filterUnits="objectBoundingBox" x="0" y="0" width="100%" height="100%">
        <feTurbulence :id="heatTurbulence" type="fractalNoise" numOctaves="1" seed="2" />
        <feDisplacementMap xChannelSelector="G" yChannelSelector="B" scale="22" in="SourceGraphic" />
      </filter>
    </svg>
  </div>
</template>
<script>
export default {
  name: "DesDVPaintImage",
  mixins: [$mixins.propertyDialogSetting],
  data() {
    const heatId = dsf.uuid();
    return {
      heatId: `heat_${heatId}`,
      heatTurbulence: `heatTurbulence_${heatId}`,

      maskImage: "",

      maxWidth: 900,

      image: null,
    };
  },
  computed: {
    sketchStyle() {
      const { width, height, src } = this.image;
      return {
        backgroundImage: `url(${src})`,
        width: `${width}px`,
        height: `${height}px`,
      };
    },
    maskImageStyle() {
      const maskImage = this.maskImage;
      return {
        "mask-image": `url(${maskImage})`,
      };
    },
    maskInnerStyle() {
      const { maskImage, heatId } = this;
      const { src } = this.image;
      return {
        "mask-image": `url(${maskImage})`,
        backgroundImage: `url(${src})`,
        filter: `url(#${heatId})`,
      };
    },
  },
  mounted() {
    this.loadScript(() => {
      const { maskImage } = this.currentData;
      const backgroundConfig = this.owner.backgroundConfig;

      this.maskImage = maskImage;

      const active = backgroundConfig.active;
      if (backgroundConfig[active] && backgroundConfig[active].image) {
        const image = new Image();
        const src = dsf.url.getWebPath(backgroundConfig[active].image);
        image.src = src;
        image.onload = () => {
          const scale = image.width > this.maxWidth ? image.width / this.maxWidth : 1;
          const width = image.width > this.maxWidth ? this.maxWidth : image.width;
          const height = image.height / scale;
          this.image = {
            width,
            height,
            src,
          };

          this.$nextTick(this.paintImage);
        };
      }

      const timeline = new TimelineMax({
        repeat: -1,
        yoyo: true,
      });
      this.timeline = timeline;
      const heatTurbulence = document.querySelector(`#${this.heatTurbulence}`);

      timeline.add(
        TweenMax.to(heatTurbulence, 8, {
          onUpdate: function () {
            var bfX = this.progress() * 0.01 + 0.025,
              bfY = this.progress() * 0.003 + 0.01,
              bfStr = bfX.toString() + " " + bfY.toString();
            heatTurbulence.setAttribute("baseFrequency", bfStr);
          },
        }),
        0
      );
    });
  },
  beforeDestroy() {
    this.timeline && this.timeline.kill();
  },
  methods: {
    paintImage() {
      const canvas = this.$refs.canvas;
      if (!canvas) return false;

      const onPaint = () => {
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
        const url = canvas.toDataURL();
        this.maskImage = url;
      };
      const ctx = canvas.getContext("2d");
      const sketch = this.$refs.sketch;
      const sketchStyle = window.getComputedStyle(sketch);
      const mouse = { x: 0, y: 0 };

      const width = parseInt(sketchStyle.getPropertyValue("width"));
      const height = parseInt(sketchStyle.getPropertyValue("height"));
      canvas.width = width;
      canvas.height = height;

      // 存在绘制
      if (this.maskImage) {
        const image = new Image();
        image.src = this.maskImage;
        image.onload = function () {
          ctx.drawImage(image, 0, 0, width, height);
        };
      }

      canvas.addEventListener(
        "mousemove",
        (e) => {
          mouse.x = e.pageX - canvas.getBoundingClientRect().left;
          mouse.y = e.pageY - canvas.getBoundingClientRect().top;
        },
        false
      );

      ctx.lineWidth = 40;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";

      canvas.addEventListener(
        "mousedown",
        () => {
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          canvas.addEventListener("mousemove", onPaint, false);
        },
        false
      );

      canvas.addEventListener(
        "mouseup",
        () => {
          canvas.removeEventListener("mousemove", onPaint, false);
        },
        false
      );
    },
    yes() {
      return {
        maskImage: this.maskImage,
        show: true,
      };
    },
    clear() {
      this.maskImage = "";
      // 清空画布
      const canvas = this.$refs.canvas;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },
    loadScript(callback) {
      if (window.TweenMax) {
        callback?.();
      } else {
        this.$http
          .importFiles([this.$getWebPath("static/js/libs/TweenMax/TweenMax.min.js", __DSF_DATAVIEW_PATH__)])
          .then(() => {
            callback?.();
          })
          .catch((err) => {
            console.error(err);
            dsf.layer.message("加载TweenMax文件报错", false);
          });
      }
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVPaintImage.scss";
</style>
