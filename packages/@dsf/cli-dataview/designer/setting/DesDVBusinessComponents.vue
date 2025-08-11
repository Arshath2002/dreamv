<template>
  <div class="des-dv-business-components">
    <div class="des-dv-business-components__main">
      <dsf-virtual-scroll class="nav" scroll-x>
        <ul>
          <li @click="changeActive(item)" :class="{ active: item.id === active.id }" class="group-item" v-for="item in catalog" :key="item.id">
            <i class="ds-icon dsf-icon-dakai"></i>
            <el-checkbox v-if="multiple" :indeterminate="item.status === 1" :value="item.status === 2" @change="changeAllValue($event, item)"></el-checkbox>
            <span class="title">{{ item.name }}</span>
            <span class="num">（{{ item.items.length }}）</span>
          </li>
        </ul>
      </dsf-virtual-scroll>
      <div class="components-list">
        <div class="components-list__header" v-if="multiple">
          <el-checkbox class="__check" :indeterminate="active.status === 1" :value="active.status === 2" @change="changeAllValue($event, active)">全选</el-checkbox>
        </div>
        <dsf-virtual-scroll class="list-view" scroll-y>
          <div class="list-view__wrap">
            <div class="list-view__wrap__item" v-for="item in list" :key="item.id">
              <div class="item-business" v-if="item.data && item.data.thumbnail && item.data.thumbnail != '[]'" style="width: 100%">
                <el-image lazy :src="item.data.thumbnail | imgDVFormat" style="width: 100%" alt="img" />
              </div>
              <div v-else class="item-business none"></div>
              <div class="item-business-name">
                <el-checkbox :value="dataValue.includes(item.id)" @change="changeValue($event, item)"> {{ item.name || item.id }} </el-checkbox>
              </div>
            </div>
            <i></i> <i></i> <i></i> <i></i> <i></i>
          </div>
        </dsf-virtual-scroll>
      </div>
    </div>
    <div class="des-dv-business-components__footer">已选择（<span>{{ dataValue.length }}</span>）条数据</div>
  </div>
</template>

<script>
export default {
  name: "DesDVBusinessComponents",
  mixins: [$mixins.propertyDialogSetting],
  data() {
    return {
      active: "",
      list: [],
      dataValue: [],
      catalog: [],
    };
  },
  computed: {
    multiple() {
      return this.config.multiple;
    },
    // 是否返回对象值
    isObjectValue() {
      return this.config.isObjectValue;
    },
    textKey() {
      return this.config.textKey || "text";
    },
    valueKey() {
      return this.config.valueKey || "value";
    },
    businessGroups() {
      return  this.designer.getBusinessControlGroup;
    },
  },
  watch: {
    dataValue: {
      handler() {
        this.refreshCatalog();
      },
      deep: true,
    },
  },
  created() {
    let value = this.currentData;
    if (!Array.isArray(value)) {
      value = value ? [value] : [];
    }
    value = value.map((it) => {
      return dsf.isObject(it) ? it[this.valueKey] : it;
    });
    this.dataValue = value;

    this.refreshCatalog();

    let item = this.catalog.find((it) => it.status > 0);
    item = item || this.catalog[0];
    if (item) {
      this.active = item;
      this.list = item.items;
    }
  },

  methods: {
    clear() {
      this.dataValue = [];
    },
    refreshCatalog() {
      const catalog = this.catalog;
      if (catalog.length) {
        catalog.forEach((item) => {
          const { items } = item;
          const ids = items.map((it) => it.id);
          const status = this.getCatalogStatus([...ids]);
          item.status = status;
        });
      } else {
        this.catalog = this.businessGroups.map((item) => {
          const { id, items, title: name } = item;
          const ids = items.map((it) => it.id);
          const status = this.getCatalogStatus([...ids]);
          return {
            id,
            status,
            name,
            items,
          };
        });
      }
    },
    /**
     * 切换全选业务组件
     * @param {Boolean} val
     * @param {Object} item
     */
    changeAllValue(val, item) {
      const value = this.dataValue;
      const ids = item.items.map((it) => it.id);
      if (val) {
        value.push(...ids);
        const r = Array.from(new Set(value));
        this.dataValue = r;
      } else {
        ids.forEach((it) => {
          const index = this.dataValue.findIndex((i) => i === it);
          if (index > -1) {
            this.dataValue.splice(index, 1);
          }
        });
      }
    },

    /**
     * 切换业务组件
     * @param {Boolean} val
     * @param {Object} item
     */
    changeValue(val, item) {
      const value = this.dataValue;
      if (val) {
        if (this.multiple) {
          value.push(item.id);
          const r = Array.from(new Set(value));
          this.dataValue = r;
        } else {
          this.dataValue = [item.id];
        }
      } else {
        if (this.multiple) {
          const index = value.findIndex((it) => it === item.id);
          if (index > -1) {
            value.splice(index, 1);
          }
          this.dataValue = value;
        } else {
          this.dataValue = [];
        }
      }
    },

    /**
     * 选中业务组
     * @param {Object} item
     */
    changeActive(item) {
      this.active = item;
      this.list = item.items;
    },

    /**
     * @return {Number} 0 未选 1 半选 2 全选
     */
    getCatalogStatus(ids) {
      const len = ids.length;
      if (!ids.length) return false;
      const value = this.dataValue;
      value.forEach((it) => {
        const index = ids.findIndex((i) => i === it);
        if (index > -1) {
          ids.splice(index, 1);
        }
      });
      const r = len - ids.length;

      if (r === 0) {
        return 0;
      } else if (r === len) {
        return 2;
      } else if (r < len) {
        return 1;
      }
      return 0;
    },

    yes() {
      if (!this.isObjectValue) {
        return this.multiple ? this.dataValue : this.dataValue[0] === undefined ? "" : this.dataValue[0];
      } else {
        const catalog = this.catalog;
        const platCatalog = catalog.reduce((arr, cur) => [...arr, ...cur.items], []);
        const r = platCatalog
          .filter((it) => this.dataValue.includes(it.id))
          .map((it) => {
            return {
              [this.textKey]: it.name,
              [this.valueKey]: it.id,
            };
          });

        return this.multiple ? r : r[0] === undefined ? "" : r[0];
      }
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVBusinessComponents.scss";
</style>
