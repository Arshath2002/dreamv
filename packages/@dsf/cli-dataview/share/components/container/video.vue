<!--
 * @Author: RONGWEI PENG
 * @Date: 2022-09-19 10:19:05
 * @LastEditors: shenah
 * @LastEditTime: 2025-03-14 09:53:10
 * @FilePath: \dsf-product-dataview\packages\@dsf\cli-dataview\pc\components\container\video.vue
-->
<!--  video容器  -->
<template>
  <div
    class="dsf-dv-container-video data-view-item-wrap ds-control data-view-no-padding"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
    ref="dsfVideoWrapRef"
  >
    <DsfEmptyData v-if="!videoConfig.src" text="暂无视频播放" />
    <template v-else-if="!isLive">
      <video
        muted
        class="dsf-video"
        :src="playSrc"
        :poster="$poster"
        :controls="controlsVideo"
        :autoplay="autoplay"
        :loop="loop"
      ></video>
    </template>
    <div
      class="lived-video-wrap"
      ref="liveVideoWrapRef"
      v-else-if="isLive"
    ></div>
  </div>
</template>
<script>
import { eventTemp } from "_dataview/output/utils/relativeEvent";
export default dsf.component({
  name: "DsfDataViewVideo",
  ctrlCaption: "视频容器",
  mixins: [$mixins.dataView],
  props: {
    isLive: {
      type: Boolean,
      default: false,
    },
    //存在事件依赖
    hasEventRelative: {
      type: Boolean,
      default: true,
    },
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          load: {
            relatives: [],
            fn: eventTemp,
          },
          change: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
    margin: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    loop: {
      type: Boolean,
      default: false,
    },
    controlsVideo: {
      type: Boolean,
      default: true,
    },
    // 封面图片
    backgroundConfig: {
      type: Object,
      default() {
        return {
          active: "pattern",
          image: "",
        };
      },
    },
    videoConfig: {
      type: Object,
      default() {
        return {
          src: "",
          static: true,
        };
      },
    },
  },
  data() {
    return {
      liveId: "",
      // 组件类型
      componentType: "video",
      // 直播专用
      videoObj: null,
    };
  },
  watch: {
    "videoConfig.src": {
      handler(v) {
        this.loadChangeEvents(v);
        this.initVideo();
      },
      deep: true,
    },
    isLive(val) {
      this.$emit("update:videoConfig", {
        ...this.videoConfig,
        src: "",
      });
      this.$nextTick(() => {
        if (val) {
          this.initVideo();
        } else {
          this.disposeVideoJs();
        }
      });
    },
  },
  computed: {
    $poster(v) {
      let { image, pattern } = this.backgroundConfig;
      if (pattern?.image) {
        return pattern.image;
      } else {
        return image;
      }
    },
    playSrc() {
      return this.videoConfig.src;
    },
  },
  mounted() {
    this.initVideo();
  },
  beforeDestroy() {
    dsf.emit.$remove("loadVideoJs", this);
    this.disposeVideoJs();
  },
  methods: {
    initVideo() {
      if (this.isLive && this.videoConfig.src) {
        this.liveId = dsf.dataview.utils.generateRandomString(11);
        this.loadVideoJs(this).then(() => {
          this.$nextTick(() => {
            this.loadFlv();
          });
        });
      } else {
        this.disposeVideoJs();
      }
    },
    loadVideoJs(tag) {
      return new Promise((resolve, reject) => {
        if (!window.videojs && !window.dataViewVideoJs) {
          /****观察者模式动态加载videoJS script 标签，防止多次加载script   start******************/
          dsf.emit.$on(
            "loadVideoJs",
            () => {
              window.dataViewVideoJs = window.videojs;
              //加载完成
              resolve();
            },
            tag
          );
          if (!window.dataViewVideoLoad) {
            window.dataViewVideoLoad = true;
            let loadFileHttp = dsf.dataview.utils.importFiles(
              [
                this.$getWebPath(
                  "static/js/libs/newVideoJs/video-js.min.css",
                  __DSF_DATAVIEW_PATH__
                ),
                this.$getWebPath(
                  "static/js/libs/newVideoJs/video.min.js",
                  __DSF_DATAVIEW_PATH__
                ),
                this.$getWebPath(
                  "static/js/libs/newVideoJs/flv.min.js",
                  __DSF_DATAVIEW_PATH__
                ),
                this.$getWebPath(
                  "static/js/libs/newVideoJs/videojs-flvjs.min.js",
                  __DSF_DATAVIEW_PATH__
                ),
              ],
              () => {
                dsf.emit.$emit("loadVideoJs");
              },
              (err) => {
                dsf.layer.message("加载video相关文件报错", false);
                reject(err);
              },
              () => {
                this.addNowRequestFileList(loadFileHttp, true);
              }
            );
            this.addNowRequestFileList(loadFileHttp);
          }
          return;
        }
        //加载完成
        resolve();
      });
    },
    loadFlv() {
      this.disposeVideoJs();
      let el = this.$refs.liveVideoWrapRef;
      let html = "";
      if (el) {
        html = `<video
        muted
        class="lived-video video-js vjs-big-play-centered"
        src="${this.playSrc}"
        poster="${this.$poster}"
        width="${this.width}"
        height="${this.height}"
        controls="${this.controlsVideo}"
        autoplay="${this.autoplay}"
        loop="${this.loop}"
        id="${this.liveId}"
      >
        <source  src="${this.playSrc}" type="video/x-flv" />
      </video>`;
      }
      el.innerHTML = html;
      let videoJs = window.dataViewVideoJs || window.videojs;
      let w = this.$refs.dsfVideoWrapRef.clientWidth;
      let h = this.$refs.dsfVideoWrapRef.clientHeight;
      this.videoObj = videoJs(
        this.liveId,
        {
          muted: true,
          autoplay: true,
          controls: true,
          height: h,
          width: w,
          loop: true,
          // 更多配置.....
        },
        function () {
          this.play();
        }
      );
    },
    disposeVideoJs() {
      if (this.videoObj) {
        this.videoObj.dispose();
        this.videoObj = null;
      }
    },
    loadChangeEvents(data) {
      try {
        let { fn } = this.eventRelativeDeal.change;
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data);
      } catch (e) {
        console.error(e);
      }
    },
    /* 伪代码部分 */
    palyVideoEvent() {
      if (this.isLive) {
        this.videoObj && this.videoObj.play();
      } else {
        this.$el.querySelector(".dsf-video")?.play();
      }
      return this;
    },
    pauseVideoEvent() {
      if (this.isLive) {
        this.videoObj && this.videoObj.pause();
      } else {
        this.$el.querySelector(".dsf-video")?.pause();
      }

      return this;
    },
    updateVideoSrcEvent(src) {
      let $videoConfig = { ...this.videoConfig, ...{ src } };
      this.$emit("update:videoConfig", $videoConfig);
      return this;
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/DsfDataViewVideo.scss";
</style>
