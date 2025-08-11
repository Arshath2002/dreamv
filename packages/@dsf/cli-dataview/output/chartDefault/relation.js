/*
 * @Description: 关系图谱
 * @Author: shenah
 * @Date: 2023-09-27 15:18:45
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-06-05 09:35:46
 */

import common from "./common"
export default dsf.mix(true, {
  series: [
    {
      type: 'graph',
      layout: 'force',
      symbolSize: 45,
      focusNodeAdjacency: true,
      roam: true,
      itemStyle: {
        color: "#009800",
      },
      categoriesIdx: 0,
      isCustomFormatter: false,
      categories: [{
        name: '根节点',
        itemStyle: {
          color: "#009800",
        },
        symbolSize: 45,
        symbol:"circle",
        label: {
          show: true,
          fontSize: 12,
          color: "#fff"
        },
      }, {
        name: '子节点',
        symbol:"circle",
        itemStyle: {
          color: "#4592FF",
        },
        label: {
          show: true,
          fontSize: 12,
          color: "#fff"
        },
        symbolSize: 60,
      }],
      label: {
        show: true,
        fontSize: 12,
        formatter: '{b}',
        color: "#fff",
      },
      force: {
        repulsion: 800,
        layoutAnimation:true //是否显示布局的迭代动画
      },
      edgeSymbol: ['none', 'none'],
      edgeSymbolSize: [10, 10],
      symbol: "circle",
      edgeLabel: {
        show: true,
        textStyle: {
          fontSize: 12,
          color: "#fff"
        },
        formatter: "{c}"
      },
      data: [{
        name: '徐云',
        draggable: true,
      }, {
        name: '冯可梁',
        category: 1, // 样式控制
        draggable: true,
      }, {
        name: '邓志荣',
        category: 0,
        draggable: true,
      }, {
        name: '李荣庆',
        category: 1,
        draggable: true,
      }, {
        name: '郑志勇',
        category: 1,
        draggable: true,
      }, {
        name: '赵英杰',
        category: 2,
        draggable: true,
      }, {
        name: '王承军',
        category: 1,
        draggable: true,
      }, {
        name: '陈卫东',
        category: 2,
        draggable: true,
      }, {
        name: '邹劲松',
        category: 0,
        draggable: true,
      }, {
        name: '赵成',
        category: 1,
        draggable: true,
      }, {
        name: '陈现忠',
        category: 2,
        draggable: true,
      }, {
        name: '陶泳',
        category: 0,
        draggable: true,
      }, {
        name: '王德福',
        category: 1,
        draggable: true,
      }],
      links: [{
        source: 0, // 连接关系
        target: 1,
        // category: 0, // 样式控制
        value: '夫妻'
      }, {
        source: 0,
        target: 2,
        value: '子女'
      }, {
        source: 0,
        target: 3,
        value: '夫妻'
      }, {
        source: 0,
        target: 4,
        value: '父母'
      }, {
        source: 1,
        target: 2,
        value: '表亲'
      }, {
        source: 0,
        target: 5,
        value: '朋友'
      }, {
        source: 4,
        target: 5,
        value: '朋友'
      }, {
        source: 2,
        target: 8,
        value: '叔叔'
      }, {
        source: 0,
        target: 12,
        value: '朋友'
      }, {
        source: 6,
        target: 11,
        value: '爱人'
      }, {
        source: 6,
        target: 3,
        value: '朋友'
      }, {
        source: 7,
        target: 5,
        value: '朋友'
      }, {
        source: 9,
        target: 10,
        value: '朋友'
      }, {
        source: 3,
        target: 10,
        value: '朋友'
      }, {
        source: 2,
        target: 11,
        value: '同学'
      }],
      lineStyle: {
        opacity: 1,
        width: 1,
        color: '#aaa',
        curveness: 0
      },
      valueRelation: "",
      nameRelation: "",
      categoryRelation: "",
      startRelation: "",
      endRelation: "",
      linkRelation: "",
    }
  ],
  tooltip: {
    show: true,
    textStyle: {
      align: "left",
    },
    confine:true
  },
}, common);