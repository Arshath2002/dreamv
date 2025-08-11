<template>
  <div v-if="show" class="ds-error-wrap">
    <div class="redict-content">
      <img :src="errorImg" class="error-img" />
      <p class="sub-title">您访问的页面不存在...</p>
      <div class="sub-button">
        <el-button type="text" icon="el-icon-refresh" @click="handleEvent('reload')">刷新页面</el-button>
        <el-button type="text" icon="el-icon-refresh-left" @click="handleEvent('home')">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error',
  data() {
    return {
      show: true,
      errorImg: dsf.url.getWebPath(`$/img/${dsf.config.runType}/404.png`)
    }
  },
  beforeMount() {

  },
  created(){
    this.show = !(this.$route.path == "/");
  },
  methods: {
    handleEvent(type) {
      const handler = {
        reload: () => {
          location.reload()
        },
        home: () => {
          location.href = './index.html'
        },
      };
      handler[type] && handler[type]();
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.show = !(to.path == "/");
    next();
  }
};
</script>

<style lang="scss" scoped>
.ds-error-wrap {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.redict-content {
  margin-top: 0px;
}
</style>