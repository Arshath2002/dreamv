<!--
 * @Description: 事件编辑
 * @Author: zhanghang
 * @Date: 2023-01-12 15:40:37
 * @LastEditors: shenah
 * @LastEditTime: 2025-02-17 14:59:08
-->
<template>
  <div class="des-dv-new-event-editor">
    <!-- 当前组件事件 -->
    <div class="current-event-list">
      <div
        class="event-item"
        :class="{
          'active-event-item': it === currentEventKey,
          'no-line': judgeLine(index),
        }"
        v-for="(it, index) in currentEventKeys"
        :key="`cur_${it}`"
        @click="setCurrentEvent(it)"
      >
        <div class="title">
          {{ keyNames[it] ? keyNames[it] : it }}
          <div class="point" v-if="judgePoint(it)"></div>
        </div>
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="content">
      <div class="content-left">
        <el-scrollbar class="common-scrollbar">
          <el-collapse class="common-collapse" v-model="activeCollapse">
            <!-- 页面事件 -->
            <el-collapse-item name="page">
              <template slot="title">
                页面行为
                <el-tooltip class="item" effect="dark" content="双击添加事件" placement="right">
                  <DsfIcon name="bangzhuzhongxin" class="title-icon"/>
                </el-tooltip>
              </template>
              <div class="common-item">
                <div class="page-event-list">
                  <div class="page-event-item" v-for="(it, index) in pageEvents" :key="index" @dblclick="handleInsertPage(it)">
                    {{ it }}
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="gis" v-if="isGisViewPart">
              <!-- gis事件 -->
              <template slot="title">
                GIS行为
                <el-tooltip class="item" effect="dark" content="双击添加组件，下拉选择添加组件事件" placement="right">
                  <DsfIcon name="bangzhuzhongxin" class="title-icon"/>
                </el-tooltip>
              </template>
              <div class="common-item">
                <div class="component-event-list" v-if="GISMap">
                  <div class="component-event-item" @dblclick="handleInsert(GISMap.name)">
                    <el-dropdown @command="handleCommand" class="dropdown-name-wrap">
                      <div class="name-wrap">
                        <div class="name">{{ GISMap.name }}</div>
                        <div class="arrow">
                          <DsfIcon name="xia1"></DsfIcon>
                        </div>
                      </div>
                      <el-dropdown-menu slot="dropdown" class="dv-new-comps-list-item-drop" v-if="GISMap.dropList.length">
                        <el-dropdown-item v-for="item in GISMap.dropList" :key="item" :command="{ p: GISMap.name, c: item }">
                          {{ item }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <div v-else style="margin-top: 20px; box-sizing: border-box; padding-left: 20px">暂无拓展Gis配置</div>
              </div>
            </el-collapse-item>
            <!-- 组件事件 -->
            <el-collapse-item name="component">
              <template slot="title">
                组件行为
                <el-tooltip class="item" effect="dark" content="<br/>" placement="right">
                  <div slot="content">
                    <div>双击添加组件，下拉选择添加组件事件；</div>
                    <div>长按鼠标左键，定位展示选中的组件。</div>
                  </div>
                  <DsfIcon name="bangzhuzhongxin" class="title-icon"/>
                </el-tooltip>
              </template>
              <div class="common-item">
                <!-- <div class="des">双击添加组件，下拉选择添加组件事件</div> -->
                <div class="like-query">
                  <div class="text">模糊搜索：</div>
                  <el-input v-model="generalValue" class="like-input" clearable size="small" placeholder="组件名称"></el-input>
                </div>
                <div class="component-event-list">
                  <div
                    class="component-event-item"
                    v-for="(it, index) in getComponetnsNameMap"
                    :key="`com_${index}`"
                    :class="{
                      'active-current-component': it === fakeCodeName,
                    }"
                    @dblclick="handleInsert(it)"
                  > 
                    <el-dropdown
                      @command="handleCommand"
                      class="dropdown-name-wrap"
                      v-dsf-dv-longPress="{
                        press:handleLongPress,
                        cancel:cancelLongPress,
                        time:500,
                        userData:it
                      }">
                      <div class="name-wrap">
                        <div class="name">{{ it }}</div>
                        <div class="arrow">
                          <DsfIcon name="xia1"></DsfIcon>
                        </div>
                      </div>
                      <el-dropdown-menu slot="dropdown" class="dv-new-comps-list-item-drop" v-if="componetnsNameMap.get(it).dropList">
                        <el-dropdown-item v-for="item in componetnsNameMap.get(it).dropList" :key="item" :command="{ p: it, c: item }">
                          {{ item }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </div>
      <div class="content-right">
        <div class="monaco-editor-fn-tool">
          <div class="tool-wrap">
            <el-tooltip class="item" effect="dark" placement="right">
              <div slot="content">
                <p>vm：当前组件;</p>
                <p>page：二开context;</p>
                <p>page.$dataview:可获取设置当前大屏页面独立变量空间,也可以直接写：变量空间,全局参数;</p>
                <p>data：当前组件接口数据,也可以直接调用 组件名.获取当前值;</p>
              </div>
              <i class="el-icon-warning" />
            </el-tooltip>
            <span class="tip">提示：输入@符号会提示全局变量</span>
          </div>
          <div class="btn-list">
            <el-button type="text" icon="el-icon-link" @click="openApi"> 伪代码API </el-button>
          </div>
        </div>
        <DsfMonacoCustom
          ref="editor"
          height="100%"
          width="100%"
          theme="vs-dark"
          :model="currentEventKey"
          :language="'javascript'"
          :loadTipCustom="loadTipCustom"
          :loadTip="loadTip"
          @editLoaded="editorLoaded"
        ></DsfMonacoCustom>
      </div>
    </div>
  </div>
</template>
<script>
import { EVENT_TEMPLATE } from "_dataview/output/utils/eventTemplate";
import { eventKeyNames } from "_dataview/output/utils/relativeEvent";
import { utilsHandleGetEditorTemplate } from "_dataview/output/utils/event";
const insert = function (key, module) {
  const specialInsert = {
    请求: `.then(function(res){

    })`,
  };
  let value = key;
  if (typeof module == "function") {
    let functionString = module.toString();
    let params = functionString.match(/\([^()]*\)/);

    value = `${key}${params}`;
    if (specialInsert[key]) {
      value += specialInsert[key];
    }
  }

  return value;
};
export default {
  name: "DesDVEventEditor",
  mixins: [$mixins.propertyDialogSetting],
  props: {
    relativeList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  beforeDestroy() {
    // 事件解绑
    this.$off("yesCallback");
  },
  data() {
    //产品gis
    let GISMap = {
      name: "GIS运行一张图",
      caption: "GISPageMap",
      componentType: "gis",
      dropList: [],
    };
    //使用拓展gis组件
    if (this.owner.$children[0].$page.dependExtendGis) {
      GISMap = dsf.dataview.extendGis || null;
    }
    //分派拓展的依赖事件
    let $eventKeyNames = dsf.dataview.eventKeyNames;
    let _eventKeyNames = dsf.mix(true, {}, eventKeyNames, $eventKeyNames);
    return {
      activeCollapse: ["page", "component"],
      height: 0,
      keyNames: _eventKeyNames,
      eventObj: {},
      currentEventKeys: [],
      //所有可配置依赖的组件
      allComponents: [],
      // 组件中文名字对应映射表
      componetnsNameMap: new Map(),

      //组件对应映射表
      componetsWeakMap: new WeakMap(),

      //当前事件key
      currentEventKey: "",
      // editor实列
      editerInstance: null,
      // 组件事件配置项
      componentsEvent: {},
      // 编辑器提示数据
      completionItems: [],
      //依赖组件面板
      activeNames: ["1", "2"],

      //页面公共事件
      pageEvents: [],
      //Gis组件操作列表
      GISMap,
      loadTip: {
        type: "local", // 支持local/jupyter 两种方式
        isOpenTip: true, // 是否开启提示
        localLanguage: ["javascript"], // 本地支持语言
      },
      fakeCodeName: "",
      generalValue: "", // 过滤组件
    };
  },
  created() {
    this.fakeCodeName = this.owner.fakeCodeName;
    this.eventObj = this.currentData;
    let keys = Object.keys(this.currentData);
    let _keys = [];
    let activeIndex = 0;
    let isHasActiveIndex = false;
    keys.forEach((key, index) => {
      if (!this.eventObj[key].hidden) {
        _keys.push(key);
      }
      if (this.eventObj[key].fn && !isHasActiveIndex) {
        isHasActiveIndex = true;
        activeIndex = index;
      }
    });
    this.currentEventKeys = _keys;
    this.currentEventKey = keys[activeIndex] || "";

    this.pageEvents = this.handleGetComponentDropList(EVENT_TEMPLATE.page);

    if (this.isGisViewPart && this.GISMap) {
      //如果在Gis一张图下运行,设置gis运行一张图组件提示
      this.GISMap.dropList = this.handleGetComponentDropList(EVENT_TEMPLATE[this.GISMap.componentType]);
    }
  },
  computed: {
    scrollStyle() {
      return {
        height: `${this.height}px`,
      };
    },
    //是否是gis一张图运行模式
    isGisViewPart() {
      return this.owner.$children[0].$page.isGisViewPart;
    },
    currentEvent() {
      return this.eventObj[this.currentEventKey];
    },
    getComponetnsNameMap() {
      //过滤掉Gis一张图运行组件
      let arr = Array.from(this.componetnsNameMap.keys()).filter((key) => key.includes(this.generalValue));
      if (this.GISMap) {
        return arr.filter((key) => key !== this.GISMap.name);
      } else {
        return arr;
      }
    },
    judgePoint() {
      return (eventKey) => {
        let obj = this.eventObj[eventKey];
        if (typeof obj.fn === "string" && obj.fn.trim()) {
          return true;
        }
        return false;
      };
    },
  },
  mounted() {
    let nameMap = new Map();
    let comWeakMap = new WeakMap();

    //传过来的联动组件
    if (this.relativeList.length) {
      this.relativeList.forEach((it) => {
        this.getAllComponents(it.$children[0], nameMap, comWeakMap);
      });
      //页面全部联动组件
    } else {
      dsf.designer.recursionLayoutTree(this.designer.$refs.viewProxy, null, null, (it) => {
        this.getAllComponents(it, nameMap, comWeakMap);
      });
    }

    this.componetnsNameMap = nameMap;
    this.componetsWeakMap = comWeakMap;

    //如果在Gis一张图下运行
    if (this.isGisViewPart && this.GISMap) {
      let name = this.GISMap.name;
      this.componetnsNameMap.set(name, this.GISMap);
      this.componetsWeakMap.set(this.GISMap, name);
      this.allComponents.push(this.GISMap);
    }

    this.handleGetComponentEventTemplate();
    this.handleFindDeleteComponent();
  },
  methods: {
    getAllComponents(it, nameMap, comWeakMap) {
      if (it.hasEventRelative) {
        const { componentType, includeEvents, caption } = it;
        let events = _.cloneDeep(EVENT_TEMPLATE[componentType]);
        if (includeEvents && includeEvents.length > 0) {
          let $events = {};
          includeEvents.forEach((key) => {
            events[key] && ($events[key] = events[key]);
          });
          events = $events;
        }
        let comp = {
          componentType,
          includeEvents,
          caption,
          dropList: [],
        };
        if (events) {
          const dropList = this.handleGetComponentDropList(events);
          comp.dropList = dropList;
        }
        let name = it.fakeCodeName;

        nameMap.set(name, comp);
        comWeakMap.set(comp, name);
        this.allComponents.push(comp);
      }
    },
    setCurrentEvent(key) {
      if (this.editerInstance) {
        this.handleSaveEvent({ fn: this.$refs.editor.getValue() });
        this.currentEventKey = key;
        // 切换编辑器model
        this.$refs.editor.addModel(key, "javascript", this.currentEvent.fn);
      }
    },
    // 组件设置的依赖事件中，是否包含删除的组件
    handleFindDeleteComponent() {
      if (this.owner.executeFnScope) {
        const oldEventComponents = Object.keys(eval(`(${this.owner.executeFnScope})`));
        //公共页面事件
        let commonPageEvents = Object.keys(EVENT_TEMPLATE.page);

        let currentComponents = {};

        let deleteComponents = [];

        let compNames = this.componetnsNameMap.keys();

        for (let key of compNames) {
          currentComponents[key] = true;
        }

        for (let i = 0, j = oldEventComponents.length; i < j; i++) {
          if (!currentComponents[oldEventComponents[i]] && commonPageEvents.indexOf(oldEventComponents[i]) == -1) {
            deleteComponents.push(oldEventComponents[i]);
          }
        }
        if (deleteComponents.length) {
          dsf.layer.confirm(`在伪代码中中发现已删除组件【${deleteComponents.join(",")}】残留逻辑，为保证程序正常运行请删除相关逻辑。`);
        }
      }
    },
    // 保存eventObj数据
    handleSaveEvent({ relatives, fn }) {
      if (relatives) {
        this.eventObj[this.currentEventKey].relatives = relatives;
      }
      if (fn) {
        this.eventObj[this.currentEventKey].fn = fn;
      } else {
        this.eventObj[this.currentEventKey].fn = "";
      }
    },
    // 自定义提示
    loadTipCustom(model, position, code) {
      const lastCode = code.substring(code.length - 1);
      if (lastCode === "@") {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn - 1,
          endColumn: word.endColumn,
        };

        let gobalVariable = ["vm", "page", "page.$dataview", "data", "全局参数", "路径参数"];
        let suggestions = gobalVariable.map((variable) => {
          return {
            label: variable,
            kind: monaco.languages.CompletionItemKind.Function,
            filterText: `@-${variable.split("").join("-")}`,
            insertText: variable,
            range: range,
          };
        });

        return {
          suggestions: suggestions,
        };
      } else {
        if (dsf.isArray(this.completionItems)) {
          let suggestions = [];
          // 兼容低版本浏览器
          let lastCodes = code.trim().replace(/[\s\S]+[ ;]+([\s\S]+)/, "");
          let codeList = lastCodes.split(".");
          const lastCode = codeList.splice(-1);
          // 获取提示消息
          const getSuggestions = (levels, filter) => {
            let list = []; // 捕获的到下拉值
            function forEachBreadth(data, index = 0) {
              let searchIndex = -1; // 当前层级匹配到下标
              for (let i = 0; i < data.length; i++) {
                if (data[i].value == levels[index] || data[i].name == levels[index]) {
                  searchIndex = i;
                  list = data[i].children || [];
                  break;
                } else {
                  list = [];
                }
              }
              if (searchIndex !== -1 && !dsf.isUnDef(levels[index + 1])) {
                forEachBreadth(data[searchIndex].children, index + 1);
              }
            }
            if (levels.length === 0) {
              list = this.completionItems;
            } else {
              forEachBreadth(this.completionItems);
            }
            if (list.length) {
              for (let i = 0; i < list.length; i++) {
                const { name, value, type, detail } = list[i];
                suggestions.push({
                  label: name,
                  kind: monaco.languages.CompletionItemKind[type || "Function"],
                  insertText: `${value}${type === "Function" ? "()" : ""}`,
                  detail: detail,
                  filterText: name.replace(/[\u4e00-\u9fa5\w]/g, "$&-"),
                  sortText: "1",
                });
              }
            }
          };
          if (codeList.length !== 0) {
            getSuggestions(codeList, lastCode[0]);
          } else {
            getSuggestions([], lastCode[0]);
          }
          return {
            suggestions,
          };
        } else {
          return {
            suggestions: [],
          };
        }
      }
    },
    // 插入
    handleInsert(data) {
      this.$refs.editor.addCode(data);
    },
    //插入页面公共事件
    handleInsertPage(key) {
      let pageEvents = EVENT_TEMPLATE["page"];
      let module = pageEvents[key];
      let val = "";
      switch (key) {
        case "跳转页面":
          this.openDialog(key, [], true);
          break;
        case "系统弹框":
          this.openDialog(key, ["50%", "500px", "弹窗标题"], true);
          break;
        case "大屏弹框":
          this.openDialog(key, ["50%", "500px", "弹窗标题", "default"], true);
          break;
        case "悬浮弹框":
          this.openDialog(key, ["50%", "500px", "default"], true);
          break;

        default:
          val = insert(key, module);
          break;
      }
      val && this.$refs.editor.addCode(`${val}`);
    },
    //打开页面选择弹框
    openDialog(key, args = [], isDv = false) {
      let self = this;
      const params = {
        value: "",
        type: "pc",
      };
      if (isDv) {
        const gid = dsf.config.setting_dataview_page_gid || "e31357e71e2e43d5b1205fccdcd9d83b.868b115a7ef04f6b872e30ba9d986e0a.e4a5ae5871c64872adc3795b9c1c31df";
        const url = `rm/list?type=directory,bigScreen&rmGid=${gid}`;
        params.URL_MAP = {
          pc: ["页面", url],
        };
      }
      dsf.layer.pc.openDialog(
        {
          title: "设置链接",
          width: "1300px",
          height: "500px",
          content: "DsfUrlDialog",
          showClose: false,
          params,
          btns: [
            {
              text: "确定",
              handler: (res) => {
                let url = res.yes();
                args.unshift(url);
                let argsString = "";

                for (let i = 0; i < args.length; i++) {
                  const arg = args[i];
                  argsString += `'${arg}',`;
                }
                argsString = `(${argsString})`;

                self.$refs.editor.addCode(`${key}${argsString}`);
              },
            },
            {
              text: "取消",
            },
          ],
        },
        () => {}
      );
    },
    // 下拉框选中插入
    handleCommand({ p, c }) {
      const item = this.componetnsNameMap.get(p);

      const { componentType } = item;
      if (componentType && EVENT_TEMPLATE[componentType]) {
        let module = EVENT_TEMPLATE[componentType][c];
        let val = insert(c, module);
        return this.$refs.editor.addCode(`${p}.${val};`);
      }

      this.$refs.editor.addCode(`${p}.${c}();`);
    },
    // 初始化所有组件的事件项
    handleGetComponentEventTemplate() {
      let componentsEvent = {};
      let allComponents = [...this.allComponents];

      _.forEach(allComponents, (item) => {
        const { componentType, includeEvents } = item;
        if (componentType && EVENT_TEMPLATE[componentType]) {
          let currentEvent = _.cloneDeep(EVENT_TEMPLATE[componentType]);

          if (includeEvents && includeEvents.length > 0) {
            let $events = {};
            includeEvents.forEach((key) => {
              currentEvent[key] && ($events[key] = currentEvent[key]);
            });
            currentEvent = $events;
          }
          let name = this.componetsWeakMap.get(item);
          name && (componentsEvent[name] = currentEvent);
        }
      });
      this.completionItems = utilsHandleGetEditorTemplate(componentsEvent, insert, "Module");
    },

    editorLoaded(editerInstance) {
      this.editerInstance = editerInstance;
      this.$refs.editor.setValue(this.eventObj[this.currentEventKey].fn || "");
      setTimeout(() => {
        editerInstance.trigger("anyString", "editor.action.formatDocument");
      });
      // 新增的失去焦点的事件
      editerInstance.onDidBlurEditorText(() => {
        this.handleSaveEvent({ fn: this.$refs.editor.getValue() });
      });
    },
    // 找出伪代码涉及到的组件
    handleGetCodeScope() {
      let componentsEvent = {};
      for (let key in this.eventObj) {
        let fn = this.eventObj[key].fn;
        if (fn) {
          for (let i = 0, j = this.allComponents.length; i < j; i++) {
            const comp = this.allComponents[i];

            const name = this.componetsWeakMap.get(comp);

            const componentType = this.allComponents[i].componentType;
            const reg = new RegExp(name);
            if (componentType && EVENT_TEMPLATE[componentType] && reg.test(fn)) {
              componentsEvent[name] = EVENT_TEMPLATE[componentType];
            }
          }
        }
      }
      let pageEvents = EVENT_TEMPLATE.page;

      this.componentsEvent = { ...componentsEvent, ...pageEvents };
    },
    // 组件提示
    handleGetComponentDropList(data, prevString = "") {
      const list = [];
      const keys = Object.keys(data);
      for (let i = 0, j = keys.length; i < j; i++) {
        const key = keys[i];
        if (dsf.isObject(data[key])) {
          list.push(...this.handleGetComponentDropList(data[key], key));
        } else {
          list.push(prevString ? `${prevString}.${key}` : key);
        }
      }
      return list;
    },
    openApi() {
      window.open("http://cd.dreamdt.cn:20102/wiki/page.html?#/pc/wiki?code=e2Qaishn&id=db984d691bf248a19fb2e5dea5607ce5&pid=&type=&tId=", new Date().getTime());
    },
    judgeLine(index) {
      let activeIndex = this.currentEventKeys.findIndex((key) => key === this.currentEventKey);
      return index + 1 === activeIndex;
    },
    handleLongPress(e){
      let it = e.userData;
      const {$dialogEl,$targetEl} = this.getNowDwInfo(it);
      $dialogEl.css("opacity","0.1")
      $(".dv-new-comps-list-item-drop").css("opacity","0");
      $targetEl.addClass("data-view-cp-high animate__animated animate__heartBeat");
    },
    cancelLongPress(e){
      let it = e.userData;
      const {$dialogEl,$targetEl} = this.getNowDwInfo(it);
      $dialogEl.css("opacity","1");
      $(".dv-new-comps-list-item-drop").css("opacity","1");
      $targetEl.removeClass("data-view-cp-high animate__animated animate__heartBeat");
    },
    getNowDwInfo(it){
      let obj = this.componetnsNameMap.get(it);
      let caption = obj.caption;
      let vm = this.owner.$children[0];
      let designer = vm.$designer;
      let allComponents = Object.values(designer.allComponents);
      let currentCp = allComponents.find(cp=> cp.caption === caption);
      let dialogEl  = this.$parent.$el;
      let $dialogEl = $(dialogEl);
      let currentCpEl = currentCp.$el;
      let $targetEl = $(currentCpEl).parent();
      return {
        $dialogEl,
        $targetEl,
      }
    },
    yes() {
      // 保存当前编辑器的代码
      this.handleSaveEvent({
        fn: this.$refs.editor.getValue(),
      });
      this.handleGetCodeScope();

      this.owner.executeFnScope = dsf.dataview.utils.objectToString(this.componentsEvent, true);
      //解析中文名对应组件
      let executeFnComp = {};
      Object.keys(this.componentsEvent).forEach((key) => {
        let refcomp = this.componetnsNameMap.get(key);
        if (refcomp) {
          executeFnComp[key] = refcomp.caption;
        }
      });
      this.owner.executeFnComp = executeFnComp;

      return this.eventObj;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/newEventEditor.scss";
</style>
