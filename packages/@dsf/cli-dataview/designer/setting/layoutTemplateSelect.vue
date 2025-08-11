<!--
 * @Description: 布局模板选择
 * @Author: shenah
 * @Date: 2024-03-14 09:24:39
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-04 14:09:48
-->

<template>
  <div class="data-view-designer-layout-template">
    <!-- 左边 -->
    <div class="layout-template-left">
      <el-radio-group v-model="queryParams.equipmentType" class="screen-type-select">
        <el-radio-button :label="item.value" v-for="item in screenTypeList" :key="item.value">
          <DsfIcon :name="item.icon"></DsfIcon>
          <span class="text">{{ item.label }}</span>
        </el-radio-button>
      </el-radio-group>
      <div class="select-item">
        <Collapse v-model="activeCollapse" style="height: 100%">
          <el-scrollbar class="ds-scroll" style="height: 100%">
            <CollapseItem :name="it.text" :data="it.pinyin" v-for="(it, index) in queryTemplate" :key="index">
              <SingleMoreSelect
                v-model="queryParams[it.py]"
                :list="it.children"
                labelField="text"
                :multiple="true"
                :itemWidth="index === 0 ? '100' : '155'"
                class="select-item-single-more"
              ></SingleMoreSelect>
            </CollapseItem>
          </el-scrollbar>
        </Collapse>
      </div>
      <div class="reset-btn">
        <el-button type="text" @click="reset" size="small">重置</el-button>
      </div>
    </div>
    <!-- 右边 -->
    <div class="layout-template-right">
      <dsf-virtual-scroll>
        <div class="layout-template-list">
          <dsf-empty-data v-if="!templateList.length" description="暂无数据" />
          <div class="layout-template-item" v-for="item in templateList" :key="item.id" @click="templateClick(item)">
            <div class="layout-bg-wrap">
              <el-image lazy class="layout-bg" :src="item.thumbnail | imgDVFormat" :class="{ active: nowTemplate && item.id === nowTemplate.id }" alt="" />
            </div>
            <div class="layout-text">{{ item.name }}</div>
          </div>
        </div>
      </dsf-virtual-scroll>
    </div>
  </div>
</template>
<script>
import Collapse from "./graph/config/tool/collapse.vue";
import CollapseItem from "./graph/config/tool/collapseItem.vue";
import SingleMoreSelect from "_dataview/share/common/components/singleMoreSelect.vue";
export default {
  name: "LayoutTemplate",
  components: {
    Collapse,
    CollapseItem,
    SingleMoreSelect,
  },
  props: {},
  data() {
    const iconColorMap = new Map([
      ["lanse", ["rgba(0,11,82,1)"]],
      ["heijin", ["rgba(12,4,28,1)", "rgba(255,176,87,1)"]],
      ["huise", ["rgba(162,162,162,1)"]],
      ["chunheise", ["rgba(0,0,0,1)"]],
      ["qingheise", ["rgba(12,4,28,1)", "rgba(43,186,140,1)"]],
      ["baise", ["rgba(255,255,255,1)"]],
      ["lanbai", ["rgba(26,108,194,1)", "rgba(255,255,255,1)"]],
      ["zise", ["rgba(193,193,229,1)"]],
      ["bantouming", ["rgba(162,162,162,0.1)"]],

      ["jinjiyunxing", "chengguogongzuoliang"],
      ["shujuziyuan", "top5"],
      ["renkoufenxi", "nav-add-xjhy"],
      ["qiyejiance", "ranqijianceqi"],
      ["dangzhengjiaowu", "dsh"],
      ["shujukanban", "shujukanban"],

      ["banbaobuju", "table"],
      ["zuozhuyoucibuju", "buju"],
      ["jundengbuju", "table"],
      ["chenjingbuju", "table"],
    ]);
    return {
      // 屏幕类型
      screenTypeList: [
        {
          label: "pc端",
          value: "0",
          icon: "dsf-icon-xianshiqiPc",
        },
        {
          label: "移动端",
          value: "1",
          icon: "dsf-icon-icon_phone",
        },
      ],
      iconColorMap,
      activeCollapse: [],
      //模板列表
      templateList: [],
      // 请求参数
      queryParams: {
        equipmentType: "0",
      },
      //选中模板
      nowTemplate: null,
      //查询模板
      queryTemplate: [],
    };
  },
  watch: {
    queryParams: {
      handler() {
        this.queryData();
      },
      deep: true,
    },
  },
  created() {
    //获取字典
    this.getDict();
  },
  methods: {
    yes() {
      return this.nowTemplate;
    },
    reset() {
      this.queryParams = {
        equipmentType: "0",
      };
    },
    getDict() {
      const url = dsf.url.getWebPath("dict/getList/8176ce0316784370bb04ebfe923cc470", $$webRoot.platform);
      this.$http.get(url).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          const activeCollapse = [];
          data.forEach((it) => {
            activeCollapse.push(it.pinyin);
            this.$set(this.queryParams, it.py, this.queryParams[it.py] ? this.queryParams[it.py] : []);
            it.children.forEach((child) => {
              const value = this.iconColorMap.get(child.value);
              if (Array.isArray(value)) {
                child.color = value;
              } else {
                child.icon = value || "tab_workbench_checked";
              }
            });
          });
          this.activeCollapse = activeCollapse;
          this.queryTemplate = data.map((it) => {
            it.children = it.children.filter((_) => _.value != "aibuju");
            return it;
          });
        }
      });
    },

    queryData() {
      const queryParams = this.queryParams;
      let url = dsf.url.getWebPath(`template/selectDataViewTemplates?equipmentType=${queryParams.equipmentType}`, $$webRoot.platform);
      Object.keys(queryParams).forEach((key, index) => {
        if (index > 0) {
          if (Array.isArray(queryParams[key]) && queryParams[key].length) {
            url += `&query=${encodeURIComponent(queryParams[key].join("^"))}`;
          }
        }
      });

      this.$http.get(url).then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          this.templateList = data.filter(it=>it.label_value!="aibuju");
          this.nowTemplate = data?.[0] || null;
        }
      });
    },
    templateClick(item) {
      this.nowTemplate = item;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/layoutTemplateSelect.scss";
</style>
