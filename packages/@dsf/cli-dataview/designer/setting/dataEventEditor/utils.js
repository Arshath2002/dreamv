/*
 * @Editor: chenqy
 * @Description: 事件工具函数
 * @Date: 2023-03-28 15:36:19
 * @LastEditors: Chenqy
 * @LastEditTime: 2023-03-31 16:34:59
 */
import { EVENT_TEMPLATE } from "_dataview/output/utils/eventTemplate";

// 获取组件事件项
const getEventConfig = (componentType) => {
  return EVENT_TEMPLATE[componentType];
};
export { getEventConfig };
