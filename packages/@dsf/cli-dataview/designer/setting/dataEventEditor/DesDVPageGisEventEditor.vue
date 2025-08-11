<!--
 * @Description: 事件编辑
 * @Author: zhanghang
 * @Date: 2023-01-12 15:40:37
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-04-03 11:39:39
-->
<template>
  <div class="des-dv-event-editor">
    <div class="event-editor-left">
      <!-- 当前组件事件 -->
      <template>
        <el-radio-group :value="currentEventKey" @input="setCurrentEvent">
          <el-radio
            :label="it"
            v-for="it in currentEventKeys"
            :key="`cur_${it}`"
            class="com-event"
          >
            {{ keyNames[it] ? keyNames[it] : it }}
          </el-radio>
        </el-radio-group>
      </template>
      <div class="event-editor-page">
        <p>GIS事件</p>
        <div class="event-editor-page-content" v-if="GISMap">
          <div
            class="event-editor-page-content-item com-item"
            @dblclick="handleInsert(GISMap.name)"
          >
            <el-dropdown @command="handleCommand">
              <span class="com-item-name">{{ GISMap.name }}</span>
              <el-dropdown-menu slot="dropdown" class="dv-comps-list-item-drop">
                <el-dropdown-item
                  v-for="item in GISMap.dropList"
                  :key="item"
                  :command="{ p: GISMap.name, c: item }"
                >
                  {{ item }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div
          v-else
          style="margin-top: 20px; box-sizing: border-box; padding-left: 20px"
        >
          暂未监测到拓展Gis配置，无法配置事件
        </div>
      </div>
      <div class="event-editor-page end-box">
        <p>组件事件</p>
        <div ref="comp-box" class="event-editor-page-content">
          <el-scrollbar class="event-editor-scroll" :style="scrollStyle">
            <div
              class="event-editor-page-content-item com-item"
              @dblclick="handleInsert(it)"
              v-for="(it, index) in getComponetnsNameMap"
              :key="`com_${index}`"
            >
              <el-dropdown @command="handleCommand">
                <span class="com-item-name">
                  {{ it }}{{ it === fakeCodeName ? "（当前组件）" : "" }}
                </span>
                <el-dropdown-menu
                  slot="dropdown"
                  class="dv-comps-list-item-drop"
                  v-if="componetnsNameMap.get(it).dropList"
                >
                  <el-dropdown-item
                    v-for="item in componetnsNameMap.get(it).dropList"
                    :key="item"
                    :command="{ p: it, c: item }"
                  >
                    {{ item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="monaco-editor-fn" v-if="GISMap">
      <div class="monaco-editor-fn-tool">
        <span>提示：输入@符号会提示全局变量</span>
      </div>
      <DsfMonacoCustom
        ref="editor"
        height="100%"
        width="100%"
        theme="vs-dark"
        :model="currentEventKeys[0]"
        :language="'javascript'"
        :loadTipCustom="complateCustom"
        :loadTip="loadTip"
        @editLoaded="editorLoaded"
      ></DsfMonacoCustom>
    </div>
  </div>
</template>
<script>


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
import { eventKeyNames } from "_dataview/output/utils/relativeEvent";
import { EVENT_TEMPLATE } from "_dataview/output/utils/eventTemplate";
import { utilsHandleGetEditorTemplate } from "_dataview/output/utils/event";
export default {
  name: "DesDVPageGisEventEditor",
  mixins: [$mixins.propertyDialogSetting],
  props: {
    relativeList: {
      type: Array,
      default() {
        return [];
      },
    },
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
    if (this.owner.dependExtendGis) {
      GISMap = dsf.dataview.extendGis || null;
    }
     let $eventKeyNames = dsf.dataview.eventKeyNames;
    let _eventKeyNames = dsf.mix(true, {}, eventKeyNames, $eventKeyNames);
    return {
      height: 0,
      keyNames:_eventKeyNames,
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

      //Gis组件操作列表
      GISMap,
      // 编辑器提示数据
      completionItems: [],
      //依赖组件面板
      activeNames: ["1", "2"],

      loadTip: {
        type: "local", // 支持local/jupyter 两种方式
        isOpenTip: true, // 是否开启提示
        localLanguage: ["javascript"], // 本地支持语言
      },
      fakeCodeName: "",
    };
  },
  created() {
    this.fakeCodeName = this.owner.fakeCodeName;
    this.eventObj = this.currentData;
    let keys = Object.keys(this.currentData);
    let _keys = [];
    keys.forEach((key) => {
      if (!this.eventObj[key].hidden) {
        _keys.push(key);
      }
    });
    this.currentEventKeys = _keys;
    this.currentEventKey = keys[0] || "";
    if (this.GISMap) {
      this.GISMap.dropList = this.handleGetComponentDropList(
        EVENT_TEMPLATE[this.GISMap.componentType]
      );
    }
  },
  computed: {
    scrollStyle() {
      return {
        height: `${this.height}px`,
      };
    },
    currentEvent() {
      return this.eventObj[this.currentEventKey];
    },
    getComponetnsNameMap() {
      //过滤掉Gis一张图运行组件
      if (this.GISMap) {
        return Array.from(this.componetnsNameMap.keys()).filter(
          (key) => key !== this.GISMap.name
        );
      } else {
        return Array.from(this.componetnsNameMap.keys());
      }
    },
  },
  mounted() {
    let rect = this.$refs["comp-box"].getBoundingClientRect();
    this.height = Math.floor(rect.height);

    let nameMap = new Map();
    let comWeakMap = new WeakMap();

    dsf.designer.recursionLayoutTree(
      this.designer.$refs.viewProxy,
      null,
      null,
      (it) => {
        this.getAllComponents(it, nameMap, comWeakMap);
      }
    );

    this.componetnsNameMap = nameMap;
    this.componetsWeakMap = comWeakMap;

    if (this.GISMap) {
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
        const oldEventComponents = Object.keys(
          eval(`(${this.owner.executeFnScope})`)
        );
        let currentComponents = {};

        let deleteComponents = [];

        let compNames = this.componetnsNameMap.keys();

        for (let key of compNames) {
          currentComponents[key] = true;
        }

        for (let i = 0, j = oldEventComponents.length; i < j; i++) {
          if (!currentComponents[oldEventComponents[i]]) {
            deleteComponents.push(oldEventComponents[i]);
          }
        }
        if (deleteComponents.length) {
          dsf.layer.confirm(
            `在伪代码中中发现已删除组件【${deleteComponents.join(
              ","
            )}】残留逻辑，为保证程序正常运行请删除相关逻辑。`
          );
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
    complateCustom(model, position, code) {
      const lastCode = code.substring(code.length - 1);
      if (lastCode === "@") {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn - 1,
          endColumn: word.endColumn,
        };

        let gobalVariable = [
          "vm",
          "page",
          "page.$dataview",
          "data",
          "路径参数",
          "全局参数",
        ];
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
                if (
                  data[i].value == levels[index] ||
                  data[i].name == levels[index]
                ) {
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
      this.completionItems = utilsHandleGetEditorTemplate(
        componentsEvent,
        insert,
        "Module"
      );
      // console.log('this.completionItems',this.completionItems)
    },

    editorLoaded(editerInstance) {
      this.editerInstance = editerInstance;
      this.$refs.editor.setValue(this.eventObj[this.currentEventKey].fn || "");
      setTimeout(() => {
        editerInstance.trigger("anyString", "editor.action.formatDocument");
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
            if (
              componentType &&
              EVENT_TEMPLATE[componentType] &&
              reg.test(fn)
            ) {
              componentsEvent[name] = EVENT_TEMPLATE[componentType];
            }
          }
        }
      }

      this.componentsEvent = componentsEvent;
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
    yes() {
      // 保存当前编辑器的代码
      this.handleSaveEvent({
        fn: this.$refs.editor.getValue(),
      });
      this.handleGetCodeScope();

      this.owner.executeFnScope = dsf.dataview.utils.objectToString(
        this.componentsEvent,
        true
      );
      // console.log("executeFnScope", this.componentsEvent);
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
@import "_dataview/assets/styles/designer/eventEditor.scss";
</style>
