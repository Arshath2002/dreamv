<template>
  <div id="app">
    <home :page-suffix="pageSuffix"></home>
  </div>
</template>

<script>
import home from "./views/Home";
export default {
  components: {
    home
  },
  provide() {
    return {
      $app: this
    };
  },
  data() {
    return {
      pageSuffix: "else"
    };
  },
  created() {
    let htmlName = window.location.pathname;
    let route = ["_project", "_product", ""];
    let pageSuffix = "else";
    for (let i = 0; i < route.length; i++) {
      if (htmlName.indexOf(`/index${route[i]}.html`) >= 0) {
        pageSuffix = "index";
        break;
      } else if (htmlName.indexOf(`/index1${route[i]}.html`) >= 0) {
        pageSuffix = "index1";
        break;
      } else {
        pageSuffix = "else";
      }
    }
    this.pageSuffix = pageSuffix;
  },
  mounted() {},
  methods: {}
};
</script>