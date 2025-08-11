/*
 * @Description: 公共配置：[grid] [title] [legend]
 * @Author: zhanghang
 * @Date: 2021-07-27 14:16:51
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-03 10:50:35
 */
export const color = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#546570', '#c4ccd3']
export default {
  //颜色系配置
  color: [...color],
  backgroundColor: 'rgba(255,255,255,0)',
  //标题配置
  title: {
    show: false,
    //主标题
    text: '',
    //副标题
    subtext: '',
    //主标题与副标题间距
    itemGap: 10,
    //位置
    left: 'auto',
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    // 标题大小设置
    textStyle: {
      color: '#333',
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: "Microsoft Yahei",
    }
  },
  //图例配置
  legend: {
    show: false,
    //位置
    left: 'center',
    top: 'top',
    right: 'center',
    bottom: 'auto',
    //朝向
    orient: 'horizontal',
    //图例形状
    icon: '',
    custom: false, // 自定义位置
    //图例字体
    textStyle: {
      color: '#FFF',
      fontSize: '12',
      fontWeight: 'normal',
      fontFamily: "Microsoft Yahei",
    },
    itemStyle: {
      borderWidth: 0,
      borderColor: "rgba(255,255,255,0)",
    },
    //图例数据对应数据系name属性
    data: []
  },
  //区域配置
  grid: {
    //可视区域间距
    left: 10,
    top: 40,
    right: 40,
    bottom: 30,
    //是否包含坐标轴
    containLabel: true,
    //背景色
    backgroundColor: 'transparent',
    //网格的边框颜色
    borderColor: '#ccc',
    //网格的边框宽度
    borderWidth: 1,

    show: false,
  },
}
