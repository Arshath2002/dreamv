<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-26 17:25:34
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-19 11:38:57
-->
<template>
  <div class="designer-page-bg-setting">
    <el-tabs type="border-card" style="height: 100%" :value="tabActive" @tab-click="tabClick">
      <el-tab-pane :label="it.label" v-for="it in tabImageNames" :key="it.value" :name="it.value">
        <dsf-virtual-scroll>
          <div class="page-bg-content">
            <div class="bg-image" v-for="(item, index) in images[it.value]" :key="index" @click="itemClick(item, it.value)">
              <div class="image-wrap" :style="getPatternImgStyle(item.imageSrc)"></div>
              <el-radio v-model="form.pattern.image" :label="item.imageSrc">
                {{ item.name }}
              </el-radio>
            </div>
          </div>
        </dsf-virtual-scroll>
      </el-tab-pane>
      <el-tab-pane label="自定义背景" name="custom">
        <dsf-virtual-scroll>
          <DesDVBgSettingExtendCustom :custom.sync="form.custom"></DesDVBgSettingExtendCustom>
        </dsf-virtual-scroll>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import imageMixin from "./imageMixin";
export default {
  name: "DesDVBgSettingExtend",
  mixins: [$mixins.propertyDialogSetting, imageMixin],
  components: {
    DesDVBgSettingExtendCustom: Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "_dataview/designer/setting/DesDVImage/DesDVBgSettingExtendCustom.vue")),
  },
  props: {
    // 是否显示动效
    isEffect: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    //展示图片标签
    tabImageNames() {
      const backgroundTypes = this.backgroundTypes;
      return backgroundTypes.map((it) => this.keyNames[it]);
    },
    getPatternImgStyle() {
      return (imgUrl) => {
        return {
          "background-image": imgUrl ? `url('${imgUrl}')` : "none",
          "background-size": "contain",
          "background-repeat": "no-repeat",
          "background-position": "center center",
        };
      };
    },
  },
  data() {
    return {
      keyNames: {
        page: {
          label: "页面背景",
          value: "page",
        },
        model: {
          label: "模块标题背景",
          value: "model",
        },
        nav: {
          label: "导航背景",
          value: "nav",
        },
        title: {
          label: "标题背景",
          value: "title",
        },
        board: {
          label: "数据看板背景",
          value: "board",
        },
        boardIcon: {
          label: "看板图标",
          value: "boardIcon",
        },
      },
      //标签激活name
      tabActive: "custom",
      images: {
        page: [],
        model: [],
        nav: [],
        title: [],
        board: [],
        boardIcon: [],
      },
    };
  },
  created() {
    if (this.backgroundTypes.length === 0) {
      this.form.active = "custom";
    }

    if (this.form.active === "custom") {
      this.tabActive = this.form.active;
    } else if (this.form.imageType) {
      const imageType = this.form.imageType;
      const backgroundTypes = this.backgroundTypes;
      this.tabActive = backgroundTypes.includes(imageType) ? imageType : backgroundTypes[0];
    }
  },
  mounted() {
    this.loadImages();
  },
  methods: {
    tabClick(panel) {
      const name = panel.name;
      this.tabActive = name;
      if (Object.keys(this.keyNames).includes(name)) {
        this.form.active = "pattern";
        this.form.imageType = name;
      } else {
        this.form.active = name;
      }
    },
    async loadImages() {
      const backgroundTypes = this.backgroundTypes;

      const prev = "dataview_rm_bimage";

      let params = {
        pageNum: 1,
        pageSize: 1000,
        query: JSON.stringify({
          searchValue: "",
          type_value: backgroundTypes,
        }),
        // 图片根据 order 以及中文名称排序
        order: "[{'code':'ds_order','sort':'asc'},{'code':'name','sort':'asc'},{'code':'ds_order','sort':'asc'}]",
        filter: "[]",
        namespace: `dataview.rm.bimage`,
        pageName: `list`,
      };
      params.pageSize = await this.getImageCount(params);
      const url = dsf.url.getWebPath("meta/list/data", $$webRoot.dataview);
      this.$http.get(url, params).done((res) => {
        if (res?.data && res.data.length > 0) {
          res.data.forEach((it) => {
            const image = JSON.parse(it[`${prev}.img`]);
            const src = dsf.url.getFilePath(image, true);
            const name = it[`${prev}.name`];
            const result = {
              name,
              imageSrc: src,
              id: it._id,
              select: src === this.currentData?.image ? it._id : "",
            };

            const type = it[`${prev}.type`].value;
            this.images[type]?.push(result);
          });
        }
      });
    },
    async getImageCount(params) {
      let count = 0;
      const url = dsf.url.getWebPath("meta/list/count", $$webRoot.dataview);
      await this.$http.get(url, params).done((res) => {
        if (res?.data?.count) count = res.data.count;
      });
      return count;
    },
    itemClick(item, value) {
      let current = this.images[value].find((it) => it.id === item.id);
      this.form.pattern.image = current.imageSrc;
      this.form.pattern.width = current.width;
      this.form.pattern.height = current.height;
    },
    yes() {
      const active = this.tabActive;
      if (Object.keys(this.keyNames).includes(active)) {
        this.form.active = "pattern";
        this.form.imageType = active;
      } else {
        this.form.active = active;
      }

      const name = this.tabActive;
      if (Object.keys(this.keyNames).includes(name)) {
        this.form.active = "pattern";
        this.form.imageType = name;
      } else {
        this.form.active = name;
      }
      if (!this.isEffect) {
        // 去除效果
        if (this.form.custom.animation) {
          this.form.custom.animation.name = [];
        }
        if (this.form.pattern.animation) {
          this.form.pattern.animation.name = [];
        }
      }
      return this.form;
    },
  },
};
</script>
