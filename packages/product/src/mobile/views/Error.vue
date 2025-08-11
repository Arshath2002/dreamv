<template>
  <van-empty style="background-color:#fff">
    <template>
      <van-button type="default" icon="arrow-left" @click="back">返回</van-button>
      <van-button type="default" icon="home-o" style="margin-left:5px" @click="loginOut">退出登录</van-button>
    </template>
    <template v-slot:image>
      <van-image :src="errorImg" width="100%" height="auto"></van-image>
    </template>
  </van-empty>
</template>

<script>

export default {
  name: 'Error',
  data() {
    return {
      errorImg: dsf.url.getWebPath(`$/img/${dsf.config.runType}/404.png`)
    }
  },
  methods: {
    back() {
      this.$router.back();
    },
    // 自带方法：退出登录
    loginOut() {
      dsf.layer
        .confirm("您确定要退出吗?")
        .then(() => {
          this.$webAPI
            .loginOut()
            .then(({ success }) => {})
            .catch((ex) => {})
            .finally(() => {
              dsf.cookies.remove("authorization_token");
              dsf.cookies.remove("user_name");
              dsf.cookies.remove("isLogin");
              dsf.storage.session.clear();
              location.replace(dsf.url.getMobileLogin());
            });
        })
        .catch(() => {});
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.show = !(to.path == "/");
    next();
  }
};
</script>

<style lang="scss" scoped>
.van-empty ::v-deep {
  & > .van-empty__image {
    width: 100%;
    height: auto;
  }
}
</style>
