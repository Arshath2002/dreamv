<template>
  <el-container>
    <el-main style="padding: 0px">
      <el-table
        ref="table"
        class="ds-table"
        :border="true"
        :data="tableData"
      >
        <el-table-column
          label="菜单名称"
          :header-align="'center'"
          :align="'center'"
        >
          <template v-slot:default="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="140"
          label="菜单宽度"
          :header-align="'center'"
          :align="'center'"
        >
          <template v-slot:default="scope">
            <el-input v-model="scope.row.style.menuWidth"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="默认字体颜色"
          width="160"
          :header-align="'center'"
          :align="'center'"
        >
          <template v-slot:default="scope">
            <DesDVColorPicker
              :config="{
                type:'both',
                noInput:true,
              }"
              v-model="scope.row.style.defaultColor"
            >
            </DesDVColorPicker>
          </template>
        </el-table-column>
        <el-table-column
          label="选中字体颜色"
          width="160"
          :header-align="'center'"
          :align="'center'"
        >
          <template v-slot:default="scope">
            <DesDVColorPicker
              :config="{
                type:'both',
                noInput:true,
              }"
              v-model="scope.row.style.clickColor"
            >
            </DesDVColorPicker>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="默认背景"
          :header-align="'center'"
          :align="'center'"
        >
          <template v-slot:default="scope">
            <el-button
              @click="selectImg(scope.row.style, 'defaultBackgroundConfig')"
              size="small"
            > 选择 </el-button>
          </template>
        </el-table-column>
        <el-table-column
          width="160"
          label="预览"
          :header-align="'center'"
          :align="'center'"
        >
          <template v-slot:default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="getImg(scope.row.style.defaultBackgroundConfig)"
              fit="contain"
            >
              <div
                slot="error"
                style="line-height: 100px"
              >
                <span>暂无默认背景图</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="选中背景"
          :header-align="'center'"
          :align="'center'"
        >
          <template v-slot:default="scope">
            <el-button
              @click="selectImg(scope.row.style, 'clickBackgroundConfig')"
              size="small"
            > 选择 </el-button>
          </template>
        </el-table-column>
        <el-table-column
          width="160"
          label="预览"
          :header-align="'center'"
          :align="'center'"
        >
          <template v-slot:default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="getImg(scope.row.style.clickBackgroundConfig)"
              fit="contain"
            >
              <div
                slot="error"
                style="line-height: 100px"
              >
                <span>暂无选中背景图</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>

export default {
  name: "DesDVNavStyleEdit",
  mixins: [$mixins.propertyDialogSetting],

  data() {
    return {
      self: this,

      tableData: [],
    };
  },
  computed: {
    getImg() {
      return function (obj) {
        const img = dsf.dataview.utils.$backgroundFormat(obj);
        let match = "";
        if (img["background-image"]) {
          const regex = /\/(.*)'/;
          match = img["background-image"].match(regex);
        }
        return match[1] || "";
      };
    },
  },
  created() {
    this.tableData = this.currentData || [];
  },
  methods: {
    selectImg(row, key) {
      let currentData = row[key];
      let self = this;
      this.$openDialog({
        title: "图片设置",
        content: "DesDVBgSettingExtend",
        width: "950px",
        height: "600px",
        params: {
          currentData,
          backgroundTypes: ["nav"],
        },
        btns: [
          {
            text: "确定",
            handler: (res) => {
              let result = res.yes();
              if (result) {
                self.$set(row, key, result);
              }
            },
          },
        ],
      });
    },
    yes() {
      return this.currentData;
    },
  },
};
</script>
<style scoped></style>
