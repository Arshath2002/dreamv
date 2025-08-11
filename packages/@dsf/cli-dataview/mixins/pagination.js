/*
 * @Description: 分页的混入
 * @Author: shenah
 * @Date: 2024-02-21 09:29:28
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-07-01 16:59:18
 */
const createPageConfig = () => ({
  isPage: false,
  pageSize: 10,
  isRequest: true, // 是否走请求
  selectStyle: "default", // 风格
  vAlign: "center", // 垂直
  hAlign: "center", // 水平\
  margin: [0, 0, 0, 0], // 外边距
  padding: [0, 0, 0, 0], // 内边距
  height: "50", // 高度
  fontSize: "14", // 字体大小
  fontFamily: "Microsoft Yahei", // 字体
  arrowDirection: "row", // 箭头排列
  arrowType: "circle", // 箭头类型
  arrowDistance: 20, // 间距
  btnList: [
    // 按钮列表
    {
      name: "刷新重置",
      value: "slot",
      show: true,
    },
    {
      name: "前一页",
      value: "prev",
      show: true,
    },
    {
      name: "页码",
      value: "pager",
      show: true,
    },
    {
      name: "后一页",
      value: "next",
      show: true,
    },
    {
      name: "跳转第几页",
      value: "jumper",
      show: true,
    },
    {
      name: "总数",
      value: "total",
      show: true,
    },
  ],
});
export default {
  props: {
    pageConfig: {
      type: Object,
      default: () => createPageConfig(),
    },
  },
  data() {
    return {
      originalPageData: [], // 分页的原始数据
      pageParams: {
        // 分页参数
        pageNum: 1,
        pageSize: 10,
      },
      pageTotal: 0, // 总共的数量
    };
  },
  computed: {
    isShowPage() {
      return this.pageConfig.isPage && (this.isDesign || this.allowPageDataType || !this.pageConfig.isRequest);
    },
    // 准许分页并发送请求
    allowPageDataType() {
      return this.pageConfig.isPage && this.pageConfig.isRequest && ["interface","datasource"].includes(this.dataType);
    },
    // 不发请求分页
    notAllowPageDataType() {
      return this.pageConfig.isPage && !this.pageConfig.isRequest;
    }
  },
  mounted() {
    // 兼容以后新增
    this.compatiblePageAttr();
    this.initPage();
  },
  watch: {
    allowPageDataType() {
      this.init && this.init();
    },
    notAllowPageDataType() {
      this.init && this.init();
    },
    isShowPage() {
      this.init && this.init();
    },
    dataType() {
      this.pageParams.pageNum = 1;
      this.pageTotal = 0;
    },
  },
  methods: {
    compatiblePageAttr() {
      let config = dsf.mix(true, {}, createPageConfig(), this.pageConfig);
      this.$emit("update:pageConfig", config);
    },
    initPage() {
      this.pageParams.pageSize = this.pageConfig.pageSize;
    },
    // 不走接口初始化设置
    notRequestInitData(list) {
      if (this.notAllowPageDataType) {
        this.originalPageData = _.cloneDeep(list);
        this.pageTotal = list.length;
        return this.userHandlePageList(this.originalPageData);
      }
      return _.cloneDeep(list);
    },
    pageChange(params) {
      this.pageParams = params;
      if (this.allowPageDataType) {
        this.init && this.init();
      } else if (this.notAllowPageDataType) {
        let list = this.userHandlePageList(this.originalPageData);
        this.notRequestAfterPageChange && this.notRequestAfterPageChange(list);
      }
    },
    // 用户自己处理分页数据
    userHandlePageList(list) {
      if (this.notAllowPageDataType) {
        let pageNum = this.pageParams.pageNum;
        let pageSize = this.pageParams.pageSize;
        const offset = (pageNum - 1) * pageSize;
        const length = Math.min(pageSize, list.length - offset);
        return list.slice(offset, offset + length);
      }
      return _.cloneDeep(list);
    },
    handlePageParams() {
      return this.getPageParams();
    },
    getPageParams() {
      if (this.pageConfig.isPage) {
        return {
          ...this.pageParams,
        };
      }
      return {};
    },
  },
};
