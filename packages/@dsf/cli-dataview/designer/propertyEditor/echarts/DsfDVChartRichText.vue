<template>
  <div class="des-dv-chart-tooltip-wrap">
    <div class="title-wrap">
      <div class="title">{{ title }}</div>
      <div class="title-tip">输入@符号提示字段</div>
    </div>
    <div
      class="editor-div"
      :class="`editor_theme_${editorTheme}`"
      ref="contentEditable"
      contentEditable="true"
      :style="useStyle"
      @keydown="keydown"
      @input="recordPosition('input')"
      @click="contendEditClick"
      @blur="blurChange"
    ></div>
    <div class="btn-list">
      <el-button type="text" @click="openRich" class="common-editor-btn">
        <el-badge :is-dot="hasRichText" type="primary" class="common-property-badge"> 
          富文本设置 
        </el-badge>
      </el-button>
      <el-button type="text" @click="openFontStyleRule" class="common-editor-btn"> 
        <el-badge :is-dot="fieldsStyleRules.length > 0" type="primary" class="common-property-badge"> 
          字段样式设置 
        </el-badge>
      </el-button>
    </div>
    <!-- 提示列表 -->
    <ul :style="listStyle" @click.stop class="tip-list" v-if="showFormList">
      <el-autocomplete @click.stop class="inline-input" ref="search" v-model="searchName" size="small" :fetch-suggestions="querySearch" placeholder="请输入关键字筛选">
        <template slot-scope="{ item }">
          <div class="name" @click.stop="handleSelect(item)">
            {{ item.name }}
          </div>
        </template>
      </el-autocomplete>
    </ul>
  </div>
</template>
<script>
const DesDVDataFontStyleRules = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../../setting/DesDVDataFontStyleRules.vue"));
const DesDVEditorPlus = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../../setting/DesDVEditorPlus.vue"));
export default {
  name: "DsfDVChartRichText",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    owner: {
      type: Object,
      default() {
        return {};
      },
    },
    inputWidth: {
      type: Number,
      default: 160,
    },
    title: {
      type: String,
      default: "提示框内容：",
    },
    useStyle: {
      type: Object,
      default: () => ({
        minHeight: "200px",
      }),
    },
    value: {
      type: [String, Number],
    },
    //提示字段
    fields: {
      type: Array,
      default: () => [
        {
          name: "图例",
          value: "marker",
        },
        {
          name: "系列名",
          value: "seriesName",
        },
        {
          name: "名称（自带）",
          value: "name",
        },
        {
          name: "值（自带）",
          value: "value",
        },
      ],
    },
    //字段样式规则
    fieldsStyleRules: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      left: 0,
      top: 0,
      //编辑器背景
      editorTheme: "default",
      showFormList: false,
      searchName: "",
      //当前选中对象
      currentSelection: null,
      //当前光标对象
      range: null,
      // 当前@标志节点
      signNode: null,
    };
  },
  computed: {
    //字段
    showFields() {
      return this.fields;
    },
    listStyle() {
      return {
        width: `${this.inputWidth}px`,
        top: `${this.top + 20}px`,
        left: `${this.left + 20}px`,
      };
    },
    hasRichText() {
     return dsf.dataview.utils.hasTextContent(this.value+"");
    },
  },
  created() {
    this.updateData = _.debounce(() => {
      // this.$emit("change", this.getData());
    }, 500);
    //根据主题设置预览背景颜色
    if (["lanse", "heijin", "huise", "chunheise", "qingheise", "bantouming"].includes(this.owner.$designer.styleTheme)) {
      this.editorTheme = "dark";
    }
  },
  mounted() {
    window.addEventListener("click", this.closeList);
    this.setInputValue(this.value);
    this.contendEditClick();
  },
  beforeDestroy() {
    window.removeEventListener("click", this.closeList);
  },
  methods: {
    //打开字体文本样式规则
    openFontStyleRule() {
      let self = this;
      this.$openDialog({
        title: "字段字体样式规则",
        width: "800px",
        height: "520px",
        customClass: "tool-tip-font-style-edit-wrap",
        content: DesDVDataFontStyleRules,
        hasFooter: false,
        params: {
          mapFieldList: this.showFields,
          rules: this.fieldsStyleRules,
        },
        btns: [
          {
            text: "确定",
            handler(res) {
              self.$emit("update:fieldsStyleRules", res.yes());
              self.$emit("changeFieldsStyleRules");
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
    //打开富文本设置
    openRich() {
      let value = this.getData();
      let _self = this;
      this.$openDialog({
        title: "富文本编辑",
        customClass: "tool-tip-mona-edit-rich-wrap",
        width: "800px",
        height: "520px",
        content: DesDVEditorPlus,
        hasFooter: false,
        params: {
          owner: this,
          value,
          theme: this.editorTheme,
        },
        btns: [
          {
            text: "确定",
            handler(res) {
              let valueHtml = res.yes();
              _self.setInputValue(valueHtml);
            },
          },
          {
            text: "重置",
            handler() {
              _self.setInputValue("");
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
    setInputValue(val) {
      let editor = this.$refs.contentEditable;
      // console.log('editor',editor)
      editor.innerHTML = val;
      editor.focus();
    },
    closeList(e) {
      this.showFormList = false;
    },
    // 获取选中对象
    contendEditClick() {
      this.currentSelection = window.getSelection ? window.getSelection() : document.selection;
      this.recordPosition();
    },
    blurChange() {
      this.$emit("change", this.getData());
    },
    //记录当前光标位置
    recordPosition(type) {
      let selection = this.currentSelection;
      if (selection && selection.rangeCount > 0) {
        let range = selection.getRangeAt(0); // 获取选择范围对象
        this.range = range;
      }
      if (type === "input") {
        this.updateData();
      }
    },
    //插入字段
    insertTag(it, isTag = false) {
      let editor = this.$refs.contentEditable;
      let sel = this.currentSelection;
      //如果光标不存在
      if (!this.range) {
        editor.focus();
        this.contendEditClick();
      }
      let range = this.range;
      let node = document.createElement("label");
      node.setAttribute("contentEditable", false);
      if (typeof it === "string") {
        node.classList.add("sign-span");
        node.innerHTML = it;
      } else {
        node.classList.add("tag");
        node.setAttribute("real-value", it.value);
        node.innerHTML = it.name;
      }
      const text = document.createTextNode("\u00A0");

      if (!isTag) {
        range.insertNode(text);
      }
      range.insertNode(node);
      if (!isTag) {
        range.insertNode(text);
      }
      range = range.cloneRange();
      range.setStartAfter(node);
      //控制光标首尾一致
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      this.range = range;

      return node;
    },
    keydown(e) {
      e.stopPropagation();

      this.showFormList = false;
      let contentEditable = this.$refs.contentEditable;
      let clientWidth = contentEditable.clientWidth;
      // 兼容低版本火狐删除span
      if (e.key === "Backspace" || e.key === "Delete") {
        let range = this.currentSelection.getRangeAt(0);
        let node = e.key === "Backspace" ? range.startContainer.parentNode : range.endContainer.parentNode;

        if (node.nodeName == "LABEL") {
          contentEditable.removeChild(node);
          e.preventDefault();
          return false;
        }
      }
      if (e.shiftKey && e.code == "Digit2") {
        //输入@ 符号转成span标签再插入
        e.preventDefault();
        let node = this.insertTag("@", true);
        //有时候 e.preventDefault 会失效
        setTimeout(() => {
          let childNodes = this.flatNodes(Array.from(contentEditable.childNodes));

          childNodes.forEach((node) => {
            if (node.nodeType === 3) {
              let index = node.nodeValue.indexOf("@");
              while (index > -1) {
                node.deleteData(index, 1);
                index = node.nodeValue.indexOf("@");
              }
            }
          });
        });
        let offsetLeft = node.offsetLeft;
        this.left = clientWidth - offsetLeft - this.inputWidth >= 0 ? offsetLeft : clientWidth - this.inputWidth;
        this.top = node.offsetTop;
        this.signNode = node;
        this.showFormList = true;
        return false;
      }
    },
    flatNodes(childNodes) {
      return childNodes.reduce((flat, cur) => {
        flat.push(cur);
        if (cur.nodeName != "LABEL" && cur.childNodes && cur.childNodes.length > 0) {
          return [...flat, ...this.flatNodes(Array.from(cur.childNodes))];
        }
        return flat;
      }, []);
    },
    querySearch(queryString, cb) {
      const restaurants = this.showFields;
      const results = queryString ? restaurants.filter((restaurant) => ~restaurant.name.indexOf(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    //快速搜索
    handleSelect(item) {
      this.signNode && this.signNode.remove();
      //查询值
      this.searchName = "";
      this.insertTag(item);
      this.showFormList = false;
      this.$emit("change", this.getData());
    },
    getData() {
      let content = this.$refs.contentEditable.innerHTML;
      return content;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVChartTooltip.scss";
</style>
