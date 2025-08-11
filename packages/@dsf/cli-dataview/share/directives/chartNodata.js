/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-11-28 13:54:27
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-03 16:51:42
 */
export default {
  install(Vue) {
    Vue.directive("chart-nodata", function (el, bind) {
      let value = bind.value
      let dom = $("<div class='ds-empty-data chart-empty-data'><i class='dsf-icon-no-data'></i><span>暂无数据</span></div>")
      if (value) {
        let child = $(el).children('.ds-empty-data')
        if (!child.length) {
          $(el).append(dom)
        }
        if ($(el).find('canvas').length) {
          $(el).find('canvas').css('opacity', 0)
        }
        if ($(el).find('.highcharts-container ').length) {
          $(el).find('.highcharts-container ').css('opacity', 0)
        }

      } else {
        $(el).children('.ds-empty-data').remove()

        if ($(el).find('canvas').length) {
          $(el).find('canvas').css('opacity', 1)
        }
        if ($(el).find('.highcharts-container ').length) {
          $(el).find('.highcharts-container ').css('opacity', 1)
        }

      }
    });
  }
};