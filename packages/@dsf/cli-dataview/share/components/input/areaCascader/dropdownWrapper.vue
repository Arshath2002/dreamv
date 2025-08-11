<!--
 * @Description: 下拉外部
 * @Author: shenah
 * @Date: 2024-11-19 10:00:56
 * @LastEditors: shenah
 * @LastEditTime: 2024-11-19 11:06:46
-->

<template>
  <div
    ref="reference"
    class="dataview-dropdown-wrapper"
    v-clickoutside="() => toggleDropDownVisible(false)"
    @click="() => toggleDropDownVisible()"
  >
    <slot />
    <transition
      name="el-zoom-in-top"
      @after-leave="handleDropdownLeave"
    >
      <div
        ref="popper"
        v-if="(!lazy || init) && loadPoper"
        v-show="dropDownVisible"
        class="el-popper dataview-dropdown-wrapper-dropdown"
        :class="dropClass"
        :style="{'width': width, 'min-width': minWidth, 'height': height}"
      >
        <slot
          v-if="height && height !== 'auto'"
          name="dropdown"
        />
        <dsf-virtual-scroll
          v-else
          :max-height="maxHeight"
          scroll-x
        >
          <slot name="dropdown" />
        </dsf-virtual-scroll>
      </div>
    </transition>
  </div>
</template>

<script>
const Popper = ELEMENT.Popover.mixins[0];
const Clickoutside = ELEMENT.Cascader.directives.Clickoutside;

const PopperMixin = {
  props: {
    dropClass: {
      type: String,
      default: ""
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    appendToBody: Popper.props.appendToBody,
    visibleArrow: {
      type: Boolean,
      default: true
    },
    arrowOffset: Popper.props.arrowOffset,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeDestroy: Popper.beforeDestroy
};

export default {
  name: "DsfDropdownWrapper",
  inject: {
    $page: {
      default: null
    }
  },
  mixins: [PopperMixin],
  directives: { Clickoutside },
  props: {
    isDesign: {
      type: Boolean,
      required: true,
    },
    width: {
      type: String,
      default: ''
    },
    minWidth: {
      type: String,
      default: '120px'
    },
    maxHeight: {
      type: String,
      default: '260px'
    },
    height: {
      type: String,
      default: 'auto'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      init: false,
      dropDownVisible: false,
      loadPoper: false
    }
  },
  computed: {
  },
  watch: {
    'dropDownVisible'(to) {
      if (to) {
        this.loadPoper = true;
      }
    }
  },
  methods: {
    toggleDropDownVisible(visible) {
      if (this.isDesign) return;
      if (this.disabled) return;
      const { dropDownVisible } = this;
      visible = dsf.isDef(visible) ? visible : !dropDownVisible;
      if (visible !== dropDownVisible) {
        this.dropDownVisible = visible;
        if (visible) {
          if (this.lazy && !this.init) {
            this.init = true;
          }
          this.$nextTick(() => {
            this.updatePopper();
          });
        }
        this.$nextTick(() => {
          this.$emit('visible-change', visible);
        });
      }
    },
    handleDropdownLeave() {
      this.doDestroy();
    }
  }
}
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/dropdownWrapper.scss";
</style>