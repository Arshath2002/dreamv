/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-09-18 16:48:25
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-09-20 09:57:01
 */

// 计算点位坐标
export const stratify1 = function (data, staticSize) {
  const temp = data.map(({ name, value }) => {
    return {
      depth: 1,
      name,
      value: staticSize ? 10 : value,
      id: `virtual_parent.${name}`,
    };
  });

  temp.unshift({
    id: "virtual_parent",
    value: 0,
  });
  const groupData = d3
    .stratify()
    .parentId(function (it) {
      return it.id.substring(0, it.id.lastIndexOf("."));
    })(temp)
    .sum(function (it) {
      return it.value || 0;
    })
    .sort(function (a, b) {
      return b.value - a.value;
    });

  return groupData;
};

const calculateData = (data, groupData, width, height, padding = 0) => {
  d3.pack().size([width, height]).padding(padding)(groupData);
  const res = groupData.descendants().map(({ data, r, x, y }) => {
    return {
      name: data.name,
      r,
      x,
      y,
    };
  });

  data.forEach((it) => {
    const item = res.find((rect) => rect.name === it.name);
    if (item) {
      it.r = item.r;
      it.x = item.x;
      it.y = item.y;
    }
  });
};

export const createCustomSeries = (options) => {
  // 处理数据
  const data = options.data;
  const groupData = stratify1(data, options.bubbleSizeType == "fixed");

  const renderItem = (params, api) => {
    let idx = params.dataIndex;
    // Only do that layout once in each time `setOption` called.
    // 每次调用“setOption”时，只能进行一次布局。
    calculateData(data, groupData, api.getWidth(), api.getHeight(), options.padding);
    const node = data[idx];
    const itemStyle = node.itemStyle.normal;
    const { color, ...properties } = itemStyle;
    if (!node) {
      // Reder nothing.
      return;
    }
    return {
      type: "circle",
      shape: {
        cx: node.x,
        cy: node.y,
        r: node.r,
      },
      style: api.style({
        fill: color,
        ...properties,
      }),
    };
  };
  options.renderItem = renderItem;
  options.coordinateSystem = "none";
  return options;
};
