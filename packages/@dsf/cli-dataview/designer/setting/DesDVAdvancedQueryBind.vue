<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2024-01-25 15:44:08
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-07-02 10:49:39
-->
<template>
  <div class="des-dv-advanced-query-bind">
    <el-table ref="multipleTable" :data="allComponents" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="expand" width="55">
        <template slot-scope="props">
          <div class="conditions-list">
            <div class="condition-item" v-for="item in props.row.conditions" :key="item._id">
              <el-checkbox v-model="item.isCheck"></el-checkbox>
              <div class="condition-item-info">
                <p class="name">名称：{{ item.label }}</p>
                <p class="field">
                  字段：
                  <el-input size="mini" v-model="item.field"></el-input>
                  <DsfIcon class="edit-icon" name="bianjisekuai"/>
                </p>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="组件名称"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "DesDVAdvancedQueryBind",
  mixins: [$mixins.propertyDialogSetting],
  data() {
    return {
      comps: {},
      //所有和数据相关组件
      allComponents: [],
      //条件字段
      fieldItems: [],
    };
  },
  created() {
    //条件字段
    this.fieldItems = this.owner.formItems.map((it) => {
      const fieldItem = it.fieldItem;
      let field = fieldItem.field.join(",");
      return {
        label: it.performanceItem.label,
        _id: it._id,
        ...fieldItem,
        field,
      };
    });

    this.comps = this.currentData;
    // console.log("comps", this.comps);
  },
  mounted() {
    dsf.designer.recursionLayoutTree(this.designer.$refs.viewProxy, null, null, (it) => {
      this.getAllComponents(it);
    });
  },
  watch: {},
  methods: {
    yes() {
      const selection = this.$refs.multipleTable.selection;
      const comps = {};
      selection.forEach((it) => {
        const ref = it.ref;
        it.conditions = it.conditions.filter((condition) => condition.isCheck);
        comps[ref] = it;
      });
      return comps;
    },
    getAllComponents(it) {
      if (it.dataType) {
        const { caption, fakeCodeName } = it;
        //克隆条件
        const conditions = dsf.mix(true, [], this.fieldItems).map((it) => {
          return {
            isCheck: false,
            ...it,
          };
        });
        const comps = this.comps;
        //寻找是否设置过该组件条件
        const ref = Object.keys(comps).find((it) => it === caption);
        //设置过该组件的条件
        if (ref) {
          const _conditions = comps[ref].conditions;
          _conditions.forEach((condition) => {
            let item = conditions.find((it) => it._id === condition._id);
            if (item) {
              item.field = condition.field;
              item.isCheck = true;
            }
          });
        } else {
          //默认全选
          conditions.forEach((it) => {
            it.isCheck = true;
          });
        }
        const row = {
          designId: it.designId,
          ref: caption,
          name: fakeCodeName,
          conditions,
        };
        this.allComponents.push(row);

        this.$nextTick(() => {
          ref && this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      }
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVAdvancedQueryBind.scss";
</style>
