<template>
  <div class="ds-color-cards">
    <div class="color-rows" v-for="(rows, index) in colors" :key="index">
      <span
        class="color-item"
        v-for="(color, idx) in rows"
        :key="index + '-' + idx"
        :style="{ background: color }"
        @click="$emit('change', color)"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    colors: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>