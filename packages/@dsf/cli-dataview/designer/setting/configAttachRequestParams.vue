<template>
  <el-container direction="vertical" class="des-dv-setting-data-origin-params">
    <template v-if="!isJSON">
      <div v-for="(item, index) in tableData" :key="index">
        <div class="header-wrap">
          <div class="title">{{ item.name }}</div>
          <div class="header-button-wrap">
            <div class="button-item">
              <div class="common-button" @click="add(item)">新增</div>
              <div class="common-button" @click="clear(item)">清空</div>
            </div>
            <div class="button-item" v-if="index === 0">
              <dsf-button title="复制参数设置" size="small" btn-style="icon-text" icon="fuzhi" @click="copy" />
              <div class="switch-wrap">
                <span class="" v-if="!isJSON">列表模式</span>
                <el-switch class="des-dv-switch" :value="isJSON" @change="changeSwitch" />
                <span class="" v-if="isJSON">编辑模式</span>
              </div>
            </div>
          </div>
        </div>
        <el-main>
          <DsfEmptyData v-if="item.list.length == 0" />
          <div class="params-item" v-for="(params, i) in item.list" :key="i">
            <el-row>
              <el-col :offset="1" :span="5">参数字段名称</el-col>
              <el-col :span="11"></el-col>
              <el-col :offset="1" :span="5">
                设计器内取值
                <DesDVToolTipsIcon
                  :data="{
                    desc: '仅用于设计器内展示，不影响实际展示',
                  }"
                >
                </DesDVToolTipsIcon>
              </el-col>
            </el-row>
            <el-row class="params-item-value">
              <el-col :offset="1" :span="5">
                <el-input size="medium" placeholder="请输入" v-model="params.queryKey"></el-input>
              </el-col>
              <el-col class="equal-symbol" :span="1">=</el-col>
              <el-col :span="10">
                <el-input placeholder="请输入" size="medium" v-model="params.valueKey" class="input-with-select">
                  <el-select v-model="params.origin" slot="prepend" placeholder="请选择">
                    <el-option v-for="item in originOptions" :key="item.value" :value="item.value" :label="item.label"> </el-option>
                  </el-select>
                </el-input>
                <DesDVToolTipsIcon
                  :data="{
                    desc: '提供多种取值方式，下拉选择取值方式，填写取值字段名',
                  }"
                >
                </DesDVToolTipsIcon>
              </el-col>
              <el-col :offset="1" :span="5">
                <el-input size="medium" placeholder="请输入" v-model="params.designValue"></el-input>
              </el-col>
            </el-row>
            <DsfIcon name="delete" class="params-delete" @click="remove(item, params)" />
          </div>
        </el-main>
      </div>
    </template>
    <div class="json-wrap" v-else>
      <div class="header-wrap">
        <div class="header-button-wrap">
          <el-tooltip class="item" effect="dark" content="Left Bottom 提示文字" placement="left-end">
            <el-button type="text">提示</el-button>
            <div class="tip" slot="content">
              <div class="text">1. list、name、key：这些字段不可修改以及对应的值</div>
              <div class="text">2. 只能向list中删除以及添加对象</div>
              <div class="text">3. 只能向list中对象的origin、queryKey、valueKey、designValue字段中修改</div>
              <div class="text">
                4. origin<span style="color: red">(@下拉选择)</span
                >:text(固定值)、queryString(URL)、vm(当前窗口变量)、$dataview(大屏全局参数)、dialog(弹出窗体参数)、cookie、sessionStorage、localStorage
              </div>
              <div class="text">5. queryKey：自己输入(查询参数)</div>
              <div class="text">6. valueKey：自己输入(实际取值)</div>
              <div class="text">7. designValue：自己输入(仅用于设计器内展示，不影响实际展示)</div>
            </div>
          </el-tooltip>
          <div class="button-item">
            <dsf-button title="复制参数设置" size="small" btn-style="icon-text" icon="fuzhi" @click="copy" />
            <div class="switch-wrap">
              <span v-if="!isJSON">列表模式</span>
              <el-switch class="des-dv-switch" :value="isJSON" @change="changeSwitch" />
              <span v-if="isJSON">编辑模式</span>
            </div>
          </div>
        </div>
      </div>
      <div class="json-content">
        <DsfMonacoCustom ref="editor" height="100%" width="100%" theme="vs-dark" language="javascript" :loadTipCustom="loadTipCustom" :loadTip="loadTip" @editLoaded="editorLoaded"> </DsfMonacoCustom>
      </div>
    </div>
  </el-container>
</template>

<script>
export default {
  name: "configAttachRequestParams",
  mixins: [$mixins.propertyDialogSetting],
  data() {
    return {
      loadTip: {
        type: "local", // 支持local/jupyter 两种方式
        isOpenTip: true, // 是否开启提示
        localLanguage: ["javascript"], // 本地支持语言
      },
      tableData: [],
      isJSON: false,
    };
  },
  created() {
    this.tableData = _.cloneDeep(this.currentData || []);
  },
  computed: {
    originKeys() {
      return this.originOptions.map((item) => item.value);
    },
    isRunningDataViewPage() {
      return this.owner.isRunningDataViewPage;
    },
    originOptions() {
      const options = [
        { label: "固定值", value: "text" },
        { label: "URL", value: "queryString" },
        { label: "当前窗口变量", value: "vm" },
        { label: "弹出窗体参数", value: "dialog" },
        { label: "cookie", value: "cookie" },
        { label: "sessionStorage", value: "sessionStorage" },
        { label: "localStorage", value: "localStorage" },
      ];

      if (this.owner.isRunningDataViewPage) {
        options.unshift({ label: "大屏全局参数", value: "$dataview" });
      }
      return options;
    },
  },
  methods: {
    add(row) {
      row.list.push({
        origin: "text",
        queryKey: "",
        valueKey: "",
      });
    },
    remove(item, row) {
      let list = item.list;
      let index = list.findIndex((ite) => ite === row);
      if (index >= 0) {
        list.splice(index, 1);
      }
    },
    copy() {
      dsf.copyText(JSON.stringify(this.tableData)).then(() => {
        dsf.layer.message("复制成功");
      });
    },
    clear(item) {
      item.list = [];
    },
    editorLoaded(editerInstance) {
      this.$nextTick(() => {
        let json = JSON.stringify(this.tableData, null, 2);
        editerInstance.setValue(json);
        editerInstance.trigger("anyString", "editor.action.formatDocument");
      });
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
        let globalVariable = this.originKeys;
        let suggestions = globalVariable.map((variable) => {
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
      }
      return {
        suggestions: [],
      };
    },
    changeSwitch(val) {
      if (!val) {
        this.judgeJSON(!val);
      }
      this.isJSON = val;
    },
    judgeJSON(val) {
      if (val) {
        try {
          let editorRef = this.$refs["editor"];
          if (editorRef) {
            let valStr = editorRef.getValue();
            let arr = JSON.parse(valStr);
            while (typeof arr === "string") {
              arr = JSON.parse(arr);
            }
            this.verifyData(arr);
          }
          this.$refs["editor"].getValue();
        } catch (error) {
          this.$message({
            message: "数据解析错误,修改的无效",
            type: "error",
          });
          this.tableData = _.cloneDeep(this.currentData || []);
        }
      }
    },
    verifyData(arr) {
      // 原始的
      let originNewArr = _.cloneDeep(this.currentData || []);
      let mustFieldArr = ["designValue", "queryKey", "valueKey", "origin"];
      originNewArr.forEach((item, index) => {
        let one = arr[index];
        let list = one && Array.isArray(one.list) ? one.list : [];
        let newList = list
          .filter((ite) => {
            let allKeys = Object.keys(ite);
            let flag = allKeys.every((key) => mustFieldArr.indexOf(key) > -1);
            return flag;
          })
          .map((item) => ({
            designValue: item.designValue,
            queryKey: item.queryKey,
            valueKey: item.valueKey,
            origin: this.originKeys.indexOf(item.origin) > -1 ? item.origin : "text",
          }));
        item.list = newList;
      });
      this.tableData = originNewArr;
    },
    yes() {
      this.judgeJSON(this.isJSON);
      let list = this.tableData || [];
      list.forEach((item) => {
        item.list = item.list.filter((one) => one.queryKey);
      });
      return list;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/requestParamsConfig.scss";
</style>
