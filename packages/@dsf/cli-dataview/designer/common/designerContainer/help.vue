<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-03-13 11:00:26
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-14 11:30:55
-->
<template>
  <div class="dsf-designer-container__help dv-designer-container__help">
    <el-row type="flex" :gutter="10">
      <el-col :span="12">
        <p>
          <label><span class="key">Ctrl</span> + <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">Z</span>：</label>
          <span>后退操作</span>
        </p>
        <p>
          <label><span class="key">Ctrl</span> + <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">Y</span>：</label>
          <span>前进操作</span>
        </p>
        <p>
          <label><span class="key">Ctrl</span> + <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">S</span>：</label>
          <span>保存页面</span>
        </p>
      </el-col>
      <el-col :span="12">
        <p v-if="!$designerContainer.disableScale">
          <label><span class="key">Alt</span> + 鼠标滚轮：</label>
          <span>控制视图缩放</span>
        </p>
        <p>
          <label><span class="key">Alt</span> + 鼠标左键：</label>
          <span>有滚动条时，可拖动视图位置</span>
        </p>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="10">
      <el-col :span="12">
        <div style="margin-top: 10px">
          <p style="padding: 5px 10px; box-sizing: border-box; background-color: #f5f5f5; margin-bottom: 10px">打开布局时，单元格操作</p>
          <p>
            <label><span class="key">Ctrl</span> + <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">C</span>：</label>
            <span>复制单元格</span>
          </p>
          <p>
            <label><span class="key">Ctrl</span> + <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">V</span>：</label>
            <span>粘贴单元格</span>
          </p>
          <p>
            <label><span class="key">Delete</span> ：</label>
            <span>删除选中单元格</span>
          </p>
          <p>
            <label>
              <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">↑</span>
              <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">↓</span>
              <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">←</span>
              <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">→</span> ：</label
            >
            <span>移动选中单元格位置</span>
          </p>
          <p>
            <label><span class="key">Ctrl</span> + <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">G</span>：</label>
            <span>组合多个单元格</span>
          </p>
          <p>
            <label><span class="key">Ctrl</span> +<span class="key">Shift</span>+ <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">G</span>：</label>
            <span>取消单元格组合</span>
          </p>
          <p>
            <label><span class="key">Ctrl</span> + <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">K</span>：</label>
            <span>锁住单元格或组合</span>
          </p>
          <p>
            <label><span class="key">Ctrl</span> + <span class="key">Shift</span>+ <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">K</span>：</label>
            <span>取消锁住单元格或组合</span>
          </p>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="margin-top: 10px">
          <p style="padding: 5px 10px; box-sizing: border-box; background-color: #f5f5f5; margin-bottom: 10px">关闭布局时，组件操作</p>
          <p>
            <label><span class="key">D</span> ：</label>
            <span>打开组件映射字段弹框</span>
          </p>
          <p>
            <label><span class="key">A</span> ：</label>
            <span>打开组件依赖事件弹框</span>
          </p>
          <p>
            <label><span class="key">Ctrl</span> + <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">C</span>：</label>
            <span>复制组件</span>
          </p>
          <p>
            <label><span class="key">Ctrl</span> + <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">B</span>：</label>
            <span>复制组件样式</span>
          </p>
          <p>
            <label><span class="key">Ctrl</span> + <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">V</span>：</label>
            <span>粘贴组件、组件样式</span>
          </p>
          <p>
            <label><span class="key">Ctrl</span> + <span class="key" style="min-width: 34px; text-align: center; margin-right: 5px">Q</span>：</label>
            <span>快速关联多个组件，打开依赖事件弹框</span>
          </p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Help",
  inject: {
    $designerContainer: {
      default: null,
    },
  },
};
</script>
