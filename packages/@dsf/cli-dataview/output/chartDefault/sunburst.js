/*
 * @Editor: zhanghang
 * @Description: 旭日图
 * @Date: 2024-05-30 11:47:08
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 16:21:03
 */
import common from "./common";

const createSunburst = function () {
  return dsf.mix(
    true,
    {
      series: [
        {
          name: "旭日图",
          type: "sunburst",
          center: ["50%", "50%"],
          radius: [0, "75%"],
          nodeClick: "rootToNode",
          sort: "desc",
          clockwise: true,
          emphasis: {
            focus: "ancestor",
          },
          startAngle: 90,
          itemStyle: {
            borderWidth: 1,
            borderColor: "#FFF",
          },
          label: {
            show: true,
            rotate: "radial",
            align: "center",
            position: "inside",
            minAngle: 10,
            color: "#fff",
            fontSize: 12,
          },
          data: [
            {
              name: "Grandpa",
              children: [
                {
                  name: "Uncle Leo",
                  value: 15,
                  children: [
                    {
                      name: "Cousin Jack",
                      value: 2,
                    },
                    {
                      name: "Cousin Mary",
                      value: 5,
                      children: [
                        {
                          name: "Jackson",
                          value: 2,
                        },
                      ],
                    },
                    {
                      name: "Cousin Ben",
                      value: 4,
                    },
                  ],
                },
                {
                  name: "Father",
                  value: 10,
                  children: [
                    {
                      name: "Me",
                      value: 5,
                    },
                    {
                      name: "Brother Peter",
                      value: 1,
                    },
                  ],
                },
              ],
            },
            {
              name: "Nancy",
              children: [
                {
                  name: "Uncle Nike",
                  children: [
                    {
                      name: "Cousin Betty",
                      value: 1,
                    },
                    {
                      name: "Cousin Jenny",
                      value: 2,
                    },
                  ],
                },
              ],
            },
          ],
          //层级样式
          levels: [
            //下钻层
            {
              label: {
                rotate: "tangential",
              },
              itemStyle: {
                color: common.color[0],
              },
            },
            {
              itemStyle: {
                color: common.color[1],
              },
            },
            {
              itemStyle: {
                color: common.color[2],
              },
            },
            {
              itemStyle: {
                color: common.color[3],
              },
            },
            {
              itemStyle: {
                color: common.color[4],
              },
            },
          ],
          //名称映射
          nameRelation: "name",
          seriesNameRelation: "",
          //是否包含系类名称映射
          hasNameRelation: false,
          //值映射字段
          valueRelation: "value",
          childrenRelation: "children",
          idRelation: "id",
          pidRelation: "pid",
          //顶层id
          rootId: "0",
        },
      ],

      //提示配置
      tooltip: {
        trigger: "item",
        confine: true,
      },
    },
    common
  );
};
export { createSunburst };
