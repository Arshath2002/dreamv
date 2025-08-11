<!--
 * @Author: liuhu@dreamdt.cn
 * @Date: 2023-07-21 16:00:41
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-12 15:10:02
-->
<template>
  <div class="des-dv-chart-custom-direction-wrapper">
    <div
      class="direction-item"
      :class="{
        active: item.direction === activeValue, 
        leftActive: idx === 0,
        rightActive: idx === directionMap.length - 1,
      }"
      v-for="(item, idx) in directionMap"
      @click="handleChangeItem(item)"
      :key="idx"
    >
      <img
        :src="(item[iconType] || item.content) | toBase64(item.direction === activeValue)"
        class="direction-item-img"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "Direction",
  data() {
    return {
      // direction: 方位；vertical: 垂直；horizontal：水平
      typeMap: {
        direction: [{
          direction: 'top',
          content: '<?xml version="1.0" encoding="UTF-8"?><svg width="16px" height="18px" viewBox="0 0 16 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>orientation-top</title><g id="页面" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="3样式配置" transform="translate(-441, -325)"><g id="orientation-top" transform="translate(439, 324)"><rect id="矩形" x="0" y="0" width="20" height="20"></rect><path d="M5,1 L15,1 L15,3 L5,3 L5,1 Z M16,5 C17.1045695,5 18,5.8954305 18,7 L18,17 C18,18.1045695 17.1045695,19 16,19 L4,19 C2.8954305,19 2,18.1045695 2,17 L2,7 C2,5.8954305 2.8954305,5 4,5 L16,5 Z M8.66666667,9.24740034 L8.29296201,9.66781808 L5.62629534,12.6678181 L6.37370466,13.3321819 L8.666,10.753 L10.9596287,13.3321819 L11.3333333,13.7525997 L11.707038,13.3321819 L14.3737047,10.3321819 L13.6262953,9.66781808 L11.333,12.246 L9.04037133,9.66781808 L8.66666667,9.24740034 Z" id="形状结合" fill="#AAAAAA"></path></g></g></g></svg>'
        }, {
          direction: 'right',
          content: '<?xml version="1.0" encoding="UTF-8"?><svg width="20px" height="14px" viewBox="0 0 20 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>orientation-right</title><g id="页面" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="3样式配置" transform="translate(-484, -327)"><g id="orientation-right" transform="translate(484, 324)"><rect id="矩形" x="0" y="0" width="20" height="20"></rect><path d="M20,5 L20,15 L18,15 L18,5 L20,5 Z M14,3 C15.1045695,3 16,3.8954305 16,5 L16,15 C16,16.1045695 15.1045695,17 14,17 L2,17 C0.8954305,17 1.3527075e-16,16.1045695 0,15 L0,5 C-1.3527075e-16,3.8954305 0.8954305,3 2,3 L14,3 Z M6.66666667,7.24740034 L6.29296201,7.66781808 L3.62629534,10.6678181 L4.37370466,11.3321819 L6.666,8.753 L8.95962867,11.3321819 L9.33333333,11.7525997 L9.70703799,11.3321819 L12.3737047,8.33218192 L11.6262953,7.66781808 L9.333,10.246 L7.04037133,7.66781808 L6.66666667,7.24740034 Z" id="形状结合" fill="#AAAAAA"></path></g></g></g></svg>'
        }, {
          direction: 'bottom',
          content: '<?xml version="1.0" encoding="UTF-8"?><svg width="16px" height="18px" viewBox="0 0 16 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>orientation- bottom</title><g id="页面" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="3样式配置" transform="translate(-531, -325)"><g id="orientation--bottom" transform="translate(529, 324)"><rect id="矩形" x="0" y="0" width="20" height="20"></rect><path d="M5,17 L15,17 L15,19 L5,19 L5,17 Z M16,1 C17.1045695,1 18,1.8954305 18,3 L18,13 C18,14.1045695 17.1045695,15 16,15 L4,15 C2.8954305,15 2,14.1045695 2,13 L2,3 C2,1.8954305 2.8954305,1 4,1 L16,1 Z M8.66666667,5.24740034 L8.29296201,5.66781808 L5.62629534,8.66781808 L6.37370466,9.33218192 L8.666,6.753 L10.9596287,9.33218192 L11.3333333,9.75259966 L11.707038,9.33218192 L14.3737047,6.33218192 L13.6262953,5.66781808 L11.333,8.246 L9.04037133,5.66781808 L8.66666667,5.24740034 Z" id="形状结合" fill="#AAAAAA"></path></g></g></g></svg>'
        }, {
          direction: 'left',
          content: '<?xml version="1.0" encoding="UTF-8"?><svg width="20px" height="14px" viewBox="0 0 20 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>orientation-left</title><g id="页面" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="3样式配置" transform="translate(-571, -327)"><g id="orientation-left" transform="translate(571, 324)"><rect id="矩形" x="2.27373675e-13" y="0" width="20" height="20"></rect><path d="M2,5 L2,15 L-8.8817842e-16,15 L8.8817842e-16,5 L2,5 Z M18,3 C19.1045695,3 20,3.8954305 20,5 L20,15 C20,16.1045695 19.1045695,17 18,17 L6,17 C4.8954305,17 4,16.1045695 4,15 L4,5 C4,3.8954305 4.8954305,3 6,3 L18,3 Z M10.6666667,7.24740034 L10.292962,7.66781808 L7.62629534,10.6678181 L8.37370466,11.3321819 L10.666,8.753 L12.9596287,11.3321819 L13.3333333,11.7525997 L13.707038,11.3321819 L16.3737047,8.33218192 L15.6262953,7.66781808 L13.333,10.246 L11.0403713,7.66781808 L10.6666667,7.24740034 Z" id="形状结合" fill="#AAAAAA"></path></g></g></g></svg>'
        }],
        vertical: [{
          direction: 'top',
          content: '<?xml version="1.0" encoding="UTF-8"?><svg width="20px" height="18px" viewBox="0 0 20 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>vertical-top</title><g id="页面" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="0筛选" transform="translate(-446, -485)"><g id="vertical-top" transform="translate(446, 484)"><rect id="矩形" x="0" y="0" width="20" height="20"></rect><path d="M9.09494702e-13,3 L9.09617166e-13,1 L20,1 L20,3 Z M14,6 L14,17 C14,18.1045695 13.1045695,19 12,19 L8,19 C6.8954305,19 6,18.1045695 6,17 L6,6 C6,4.8954305 6.8954305,4 8,4 L12,4 C13.1045695,4 14,4.8954305 14,6 Z" id="形状结合" fill="#AAAAAA"></path></g></g></g></svg>',
          textContent: '<?xml version="1.0" encoding="UTF-8"?><svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>vertical-align-top</title><g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="vertical-align-top" fill="#AAAAAA" fill-rule="nonzero"><rect id="矩形" opacity="0" x="0" y="0" width="16" height="16"></rect><path d="M13.4359375,2.625 L2.5640625,2.625 C2.49375,2.625 2.4375,2.68125 2.4375,2.75 L2.4375,3.6875 C2.4375,3.75625 2.49375,3.8125 2.5640625,3.8125 L13.4359375,3.8125 C13.50625,3.8125 13.5625,3.75625 13.5625,3.6875 L13.5625,2.75 C13.5625,2.68125 13.50625,2.625 13.4359375,2.625 Z M8.0984375,5.546875 C8.0484375,5.4828125 7.9515625,5.4828125 7.9015625,5.546875 L6.1515625,7.7609375 C6.0875,7.8421875 6.1453125,7.9625 6.25,7.9625 L7.4046875,7.9625 L7.4046875,13.25 C7.4046875,13.31875 7.4609375,13.375 7.5296875,13.375 L8.4671875,13.375 C8.5359375,13.375 8.5921875,13.31875 8.5921875,13.25 L8.5921875,7.9640625 L9.75,7.9640625 C9.8546875,7.9640625 9.9125,7.84375 9.8484375,7.7625 L8.0984375,5.546875 Z" id="形状"></path></g></g></svg>'
        }, {
          direction: 'middle',
          content: '<?xml version="1.0" encoding="UTF-8"?><svg width="20px" height="16px" viewBox="0 0 20 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>vertical-middle</title><g id="页面" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="0筛选" transform="translate(-506, -486)"><g id="vertical-middle" transform="translate(506, 484)"><rect id="矩形" x="2.27373675e-13" y="0" width="20" height="20"></rect><path d="M20,9 L20,11 L15,11 L15,9 L20,9 Z M5,9 L5,11 L0,11 L0,9 L5,9 Z M14,4 L14,16 C14,17.1045695 13.1045695,18 12,18 L8,18 C6.8954305,18 6,17.1045695 6,16 L6,4 C6,2.8954305 6.8954305,2 8,2 L12,2 C13.1045695,2 14,2.8954305 14,4 Z" id="形状结合" fill="#AAAAAA"></path></g></g></g></svg>',
          textContent: '<?xml version="1.0" encoding="UTF-8"?><svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>vertical-align-middl</title><g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="vertical-align-middl" fill="#AAAAAA" fill-rule="nonzero"><rect id="矩形" opacity="0" x="0" y="0" width="16" height="16"></rect><path d="M13.4359375,7.40625 L2.5640625,7.40625 C2.49375,7.40625 2.4375,7.4625 2.4375,7.53125 L2.4375,8.46875 C2.4375,8.5375 2.49375,8.59375 2.5640625,8.59375 L13.4359375,8.59375 C13.50625,8.59375 13.5625,8.5375 13.5625,8.46875 L13.5625,7.53125 C13.5625,7.4625 13.50625,7.40625 13.4359375,7.40625 Z M7.9109375,6.2390625 C7.95625,6.296875 8.04375,6.296875 8.0875,6.2390625 L9.6625,4.246875 C9.7203125,4.1734375 9.66875,4.0640625 9.5734375,4.0640625 L8.59375,4.0640625 L8.59375,1.625 C8.59375,1.55625 8.5375,1.5 8.46875,1.5 L7.53125,1.5 C7.4625,1.5 7.40625,1.55625 7.40625,1.625 L7.40625,4.0625 L6.425,4.0625 C6.33125,4.0625 6.278125,4.171875 6.3359375,4.2453125 L7.9109375,6.2390625 L7.9109375,6.2390625 Z M8.0890625,9.7609375 C8.04375,9.703125 7.95625,9.703125 7.9125,9.7609375 L6.3375,11.7546875 C6.2796875,11.828125 6.33125,11.9375 6.4265625,11.9375 L7.40625,11.9375 L7.40625,14.375 C7.40625,14.44375 7.4625,14.5 7.53125,14.5 L8.46875,14.5 C8.5375,14.5 8.59375,14.44375 8.59375,14.375 L8.59375,11.9375 L9.575,11.9375 C9.66875,11.9375 9.721875,11.828125 9.6640625,11.7546875 L8.0890625,9.7609375 L8.0890625,9.7609375 Z" id="形状"></path></g></g></svg>'
        }, {
          direction: 'bottom',
          content: '<?xml version="1.0" encoding="UTF-8"?><svg width="20px" height="18px" viewBox="0 0 20 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>vertical-bottom</title><g id="页面" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="0筛选" transform="translate(-566, -485)"><g id="vertical-bottom" transform="translate(566, 484)"><rect id="矩形" x="0" y="0" width="20" height="20"></rect><path d="M9.09494702e-13,17 L9.09617166e-13,19 L20,19 L20,17 Z M14,14 L14,3 C14,1.8954305 13.1045695,1 12,1 L8,1 C6.8954305,1 6,1.8954305 6,3 L6,14 C6,15.1045695 6.8954305,16 8,16 L12,16 C13.1045695,16 14,15.1045695 14,14 Z" id="形状结合" fill="#AAAAAA"></path></g></g></g></svg>',
          textContent: '<?xml version="1.0" encoding="UTF-8"?><svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>vertical-align-botto</title><g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="vertical-align-botto" fill="#AAAAAA" fill-rule="nonzero"><rect id="矩形" opacity="0" x="0" y="0" width="16" height="16"></rect><path d="M13.4359375,12.1875 L2.5640625,12.1875 C2.49375,12.1875 2.4375,12.24375 2.4375,12.3125 L2.4375,13.25 C2.4375,13.31875 2.49375,13.375 2.5640625,13.375 L13.4359375,13.375 C13.50625,13.375 13.5625,13.31875 13.5625,13.25 L13.5625,12.3125 C13.5625,12.24375 13.50625,12.1875 13.4359375,12.1875 Z M7.9015625,10.453125 C7.9515625,10.5171875 8.0484375,10.5171875 8.0984375,10.453125 L9.8484375,8.2390625 C9.9125,8.1578125 9.8546875,8.0375 9.75,8.0375 L8.5921875,8.0375 L8.5921875,2.75 C8.5921875,2.68125 8.5359375,2.625 8.4671875,2.625 L7.5296875,2.625 C7.4609375,2.625 7.4046875,2.68125 7.4046875,2.75 L7.4046875,8.0359375 L6.25,8.0359375 C6.1453125,8.0359375 6.0875,8.15625 6.1515625,8.2375 L7.9015625,10.453125 Z" id="形状"></path></g></g></svg>'
        }],
        horizontal: [{
          direction: 'left',
          content: '<?xml version="1.0" encoding="UTF-8"?><svg width="18px" height="20px" viewBox="0 0 18 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>horizontal-left</title><g id="页面" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="0筛选" transform="translate(-446, -436)"><g id="horizontal-left" transform="translate(446, 436)"><rect id="矩形" x="0" y="0" width="20" height="20"></rect><path d="M0,0 L2,0 L2,20 L0,20 Z M5,6 L16,6 C17.1045695,6 18,6.8954305 18,8 L18,12 C18,13.1045695 17.1045695,14 16,14 L5,14 C3.8954305,14 3,13.1045695 3,12 L3,8 C3,6.8954305 3.8954305,6 5,6 Z" id="形状结合" fill="#AAAAAA"></path></g></g></g></svg>',
          textContent: '<?xml version="1.0" encoding="UTF-8"?><svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>align-left</title><g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="align-left" fill="#AAAAAA" fill-rule="nonzero"><rect id="矩形" opacity="0" x="0" y="0" width="16" height="16"></rect><path d="M1.875,3.59375 L9.625,3.59375 C9.69375,3.59375 9.75,3.5375 9.75,3.46875 L9.75,2.59375 C9.75,2.525 9.69375,2.46875 9.625,2.46875 L1.875,2.46875 C1.80625,2.46875 1.75,2.525 1.75,2.59375 L1.75,3.46875 C1.75,3.5375 1.80625,3.59375 1.875,3.59375 Z M1.875,10.21875 L9.625,10.21875 C9.69375,10.21875 9.75,10.1625 9.75,10.09375 L9.75,9.21875 C9.75,9.15 9.69375,9.09375 9.625,9.09375 L1.875,9.09375 C1.80625,9.09375 1.75,9.15 1.75,9.21875 L1.75,10.09375 C1.75,10.1625 1.80625,10.21875 1.875,10.21875 Z M14.125,12.40625 L1.875,12.40625 C1.80625,12.40625 1.75,12.4625 1.75,12.53125 L1.75,13.40625 C1.75,13.475 1.80625,13.53125 1.875,13.53125 L14.125,13.53125 C14.19375,13.53125 14.25,13.475 14.25,13.40625 L14.25,12.53125 C14.25,12.4625 14.19375,12.40625 14.125,12.40625 Z M14.125,5.78125 L1.875,5.78125 C1.80625,5.78125 1.75,5.8375 1.75,5.90625 L1.75,6.78125 C1.75,6.85 1.80625,6.90625 1.875,6.90625 L14.125,6.90625 C14.19375,6.90625 14.25,6.85 14.25,6.78125 L14.25,5.90625 C14.25,5.8375 14.19375,5.78125 14.125,5.78125 Z" id="形状"></path></g></g></svg>'
        }, {
          direction: 'center',
          content: '<?xml version="1.0" encoding="UTF-8"?><svg width="16px" height="20px" viewBox="0 0 16 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>horizontal-center</title><g id="页面" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="0筛选" transform="translate(-508, -436)"><g id="horizontal-center" transform="translate(506, 436)"><rect id="矩形" x="0" y="0" width="20" height="20"></rect><path d="M9,0 L11,0 L11,5 L9,5 L9,0 Z M9,15 L11,15 L11,20 L9,20 L9,15 Z M4,6 L16,6 C17.1045695,6 18,6.8954305 18,8 L18,12 C18,13.1045695 17.1045695,14 16,14 L4,14 C2.8954305,14 2,13.1045695 2,12 L2,8 C2,6.8954305 2.8954305,6 4,6 Z" id="形状结合" fill="#AAAAAA"></path></g></g></g></svg>',
          textContent: '<?xml version="1.0" encoding="UTF-8"?><svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>align-center</title><g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="align-center" fill="#AAAAAA" fill-rule="nonzero"><rect id="矩形" opacity="0" x="0" y="0" width="16" height="16"></rect><path d="M4.125,3.59375 L11.875,3.59375 C11.94375,3.59375 12,3.5375 12,3.46875 L12,2.59375 C12,2.525 11.94375,2.46875 11.875,2.46875 L4.125,2.46875 C4.05625,2.46875 4,2.525 4,2.59375 L4,3.46875 C4,3.5375 4.05625,3.59375 4.125,3.59375 Z M11.875,10.21875 C11.94375,10.21875 12,10.1625 12,10.09375 L12,9.21875 C12,9.15 11.94375,9.09375 11.875,9.09375 L4.125,9.09375 C4.05625,9.09375 4,9.15 4,9.21875 L4,10.09375 C4,10.1625 4.05625,10.21875 4.125,10.21875 L11.875,10.21875 Z M14.125,12.40625 L1.875,12.40625 C1.80625,12.40625 1.75,12.4625 1.75,12.53125 L1.75,13.40625 C1.75,13.475 1.80625,13.53125 1.875,13.53125 L14.125,13.53125 C14.19375,13.53125 14.25,13.475 14.25,13.40625 L14.25,12.53125 C14.25,12.4625 14.19375,12.40625 14.125,12.40625 Z M14.125,5.78125 L1.875,5.78125 C1.80625,5.78125 1.75,5.8375 1.75,5.90625 L1.75,6.78125 C1.75,6.85 1.80625,6.90625 1.875,6.90625 L14.125,6.90625 C14.19375,6.90625 14.25,6.85 14.25,6.78125 L14.25,5.90625 C14.25,5.8375 14.19375,5.78125 14.125,5.78125 Z" id="形状"></path></g></g></svg>'
        }, {
          direction: 'right',
          content: '<?xml version="1.0" encoding="UTF-8"?><svg width="18px" height="20px" viewBox="0 0 18 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>horizontal-right</title><g id="页面" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="0筛选" transform="translate(-568, -436)"><g id="horizontal-right" transform="translate(566, 436)"><rect id="矩形" x="0" y="0" width="20" height="20"></rect><path d="M18,0 L20,0 L20,20 L18,20 Z M4,6 L15,6 C16.1045695,6 17,6.8954305 17,8 L17,12 C17,13.1045695 16.1045695,14 15,14 L4,14 C2.8954305,14 2,13.1045695 2,12 L2,8 C2,6.8954305 2.8954305,6 4,6 Z" id="形状结合" fill="#AAAAAA"></path></g></g></g></svg>',
          textContent: '<?xml version="1.0" encoding="UTF-8"?><svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>align-right</title><g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="align-right" fill="#AAAAAA" fill-rule="nonzero"><rect id="矩形" opacity="0" x="0" y="0" width="16" height="16"></rect><path d="M14.125,2.46875 L6.375,2.46875 C6.30625,2.46875 6.25,2.525 6.25,2.59375 L6.25,3.46875 C6.25,3.5375 6.30625,3.59375 6.375,3.59375 L14.125,3.59375 C14.19375,3.59375 14.25,3.5375 14.25,3.46875 L14.25,2.59375 C14.25,2.525 14.19375,2.46875 14.125,2.46875 Z M14.125,9.09375 L6.375,9.09375 C6.30625,9.09375 6.25,9.15 6.25,9.21875 L6.25,10.09375 C6.25,10.1625 6.30625,10.21875 6.375,10.21875 L14.125,10.21875 C14.19375,10.21875 14.25,10.1625 14.25,10.09375 L14.25,9.21875 C14.25,9.15 14.19375,9.09375 14.125,9.09375 Z M14.125,12.40625 L1.875,12.40625 C1.80625,12.40625 1.75,12.4625 1.75,12.53125 L1.75,13.40625 C1.75,13.475 1.80625,13.53125 1.875,13.53125 L14.125,13.53125 C14.19375,13.53125 14.25,13.475 14.25,13.40625 L14.25,12.53125 C14.25,12.4625 14.19375,12.40625 14.125,12.40625 Z M14.125,5.78125 L1.875,5.78125 C1.80625,5.78125 1.75,5.8375 1.75,5.90625 L1.75,6.78125 C1.75,6.85 1.80625,6.90625 1.875,6.90625 L14.125,6.90625 C14.19375,6.90625 14.25,6.85 14.25,6.78125 L14.25,5.90625 C14.25,5.8375 14.19375,5.78125 14.125,5.78125 Z" id="形状"></path></g></g></svg>',
        }]
      },
    };
  },
  filters: {
    toBase64(svgString, isSelected) {
      let content = svgString;
      if (isSelected) {
        content = svgString.replace(/#AAAAAA/g, '#3C8DDB');
      }
      // 处理中文字符
      const str = content.replace(/[\u4e00-\u9fa5]/g, (_, $1) => $1);
      // 转为 base64 图片
      return `data:image/svg+xml;base64,${window.btoa(str)}`;
    }
  },
  props: {
    value: {
      type: [String,Number],
      default() {
        return 'top';
      }
    },
    type: {
      type: String,
      default: "direction"
    },
    mapData: {
      type: Array,
      default: () => ([]) // [{mapName: "auto", mapKey: "top"}]
    },
    iconType: {
      type: String,
      default: "content"
    },
  },
  computed: {
    directionMap() {
      // 根据mapData和type来定义要渲染的数组
      const map = this.typeMap[this.type] || []
      if (this.mapData && this.mapData.length) {
        const renderMap = [];
        this.mapData.forEach(it => {
          const mapKey = it.mapKey;
          const findItem = map.find(it => it.direction === mapKey);
          if (findItem && !it.hidden) {
            renderMap.push(findItem);
          }
        });
        return renderMap;
      }
      return map;
    },
    activeValue() {
      if (this.mapData && this.mapData.length) {
        const map = this.getMap(this.mapData, ['mapName', 'mapKey']);
        const active = map.get(this.value);
        return active;
      }
      return this.value;
    }
  },
  methods: {
    getMap(data = [], keys = []) {
      const map = new Map();
      const [start, end] = keys;
      if (!start || !end) {
        return map;
      }
      data.forEach(it => {
        if (!map.has(it[start])) {
          map.set(it[start], it[end]);
        }
      })
      return map;
    },
    handleChangeItem(item) {
      if (this.mapData && this.mapData.length) {
        const map = this.getMap(this.mapData, ['mapKey', 'mapName']);
        const value = map.get(item.direction);
        value && this.$emit('input', value);
        return;
      }
      if (item.direction) {
        this.$emit('input', item.direction);
      }
    }
  },

};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/chartDirectionWrapper.scss";
</style>

