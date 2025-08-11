<template>
  <div id="app" class="mobile-app">
    <Home></Home>
  </div>
</template>
<script>
import Home from "./views/Home";
export default {
  components: { Home },
  mixins: [],
  data() {
    return {
      themes: dsf.config.setting_public_default_theme,
    };
  },

  beforeCreate() {},
  created() {
    //加载皮肤
    document.body.classList.add(this.themes);
  },
  mounted() {},

  methods: {
  }
};
</script>