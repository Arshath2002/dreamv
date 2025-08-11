/*
 * @Description: 饼状图默认配置项
 * @Author: zhanghang
 * @Date: 2021-07-28 13:48:57
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-05-08 14:17:46
 */
import common from "./common";
const createTree = function () {
  return dsf.mix(true, {}, common, {
    //数据系配置
    series: [
      {
        roam: true,
        name: "树图",
        type: "tree",
        left: 20,
        top: 0,
        bottom: 0,
        right: 0,
        edgeShape: "polyline",
        initialTreeDepth: 2,
        lineStyle: {
          width: 2,
        },
        width: "80%",
        height: "100%",
        orient: "LR",
        symbol: "circle",
        symbolSize: 16,
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
        itemStyle: {
          color: "#fff",
        },
        label: {
          show: true,
          fontSize: 14,
          lineHeight: 18,
          formatter: "{b}",
          padding: [6, 10],
          borderWidth: 2,
          borderType: "solid",
          borderColor: "#666",
          borderRadius: 5,
          color: "#fff",
          backgroundColor: "#1a3460",
          verticalAlign: "middle",
          position: "right",
          distance: 10,
          overflow: "breakAll",
        },
        leaves: {
          label: {},
        },
        emphasis: {
          focus: "descendant",
          label: {
            show: true,
            fontSize: "18",
            fontWeight: "bold",
          },
        },
        data: [
          {
            name: "国民经济行业分类",
            value: 200,
            children: [
              {
                name: "农、林、牧、渔业",
                value: 30,
                children: [
                  {
                    name: "农业",
                    value: 6,
                    children: null,
                  },
                  {
                    name: "林业",
                    value: 6,
                    children: null,
                  },
                  {
                    name: "畜牧业",
                    value: 6,
                    children: null,
                  },
                  {
                    name: "渔业",
                    value: 6,
                    children: null,
                  },
                  {
                    name: "农、林、牧、渔专业及辅助性活动",
                    value: 6,
                    children: null,
                  },
                ],
              },
              {
                name: "房地产业",
                value: 50,
                children: [
                  {
                    name: "房地产业",
                    value: 2,
                    children: null,
                  },
                ],
              },
              {
                name: "文化、体育和娱乐业",
                value: 120,
                children: [
                  {
                    name: "新闻和出版业",
                    value: 20,
                    children: null,
                  },
                  {
                    name: "广播、电视、电影和录音制作业",
                    value: 40,
                    children: null,
                  },
                  {
                    name: "文化艺术业",
                    value: 30,
                    children: null,
                  },
                  {
                    name: "体育",
                    value: 15,
                    children: null,
                  },
                  {
                    name: "娱乐业",
                    value: 15,
                    children: null,
                  },
                ],
              },
            ],
          },
        ],
        //数据名称映射
        nameRelation: "",
        //数据值映射
        valueRelation: "",
        //数据名称映射
        seriesNameRelation: "",
        //是否包含系类名称映射
        hasNameRelation: false,
      },
    ],
    //提示配置
    tooltip: {
      trigger: "item",
      textStyle: {
        align: "left",
      },
      confine: true,
      formatter: "{b}: {c}",
    },
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      containLabel: true,
      backgroundColor: "transparent",
      borderColor: "#ccc",
      borderWidth: 1,
      show: false,
    },
  });
};

export { createTree };
