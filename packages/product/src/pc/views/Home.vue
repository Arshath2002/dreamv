<template>
  <div class="full-view">
    <!--带左侧式菜单-->
    <dsf-home v-if="pageSuffix == 'index'" :menu-list="menuList" badge-style="text">
      <dsf-default-home-header slot="header" :dropdown-config="dropdownConfig" @dropdown-click="dropdownClick">
        <!--<dsf-default-home-header-menu-children />-->
      </dsf-default-home-header>
      <dsf-default-home-aside-menu slot="left" position="left" />
      <router-view fit style="min-height: 100%"></router-view>
      <DsfUserInfoWaterMark v-if="$showWaterMark" :text="$waterMarkText"></DsfUserInfoWaterMark>
    </dsf-home>
    <!--顶部下拉菜单-->
    <dsf-home v-else-if="pageSuffix == 'index1'" :menu-list="menuList">
      <dsf-template1-home-header slot="header" :dropdown-config="dropdownConfig" text-align="left" last-level-click @dropdown-click="dropdownClick" />
      <dsf-default-home-breadcrumb slot="breadcrumb" />
      <dsf-default-home-footer slot="footer" text="技术支持：上海梦创双杨数据科技股份有限公司" />
      <router-view fit></router-view>
      <DsfUserInfoWaterMark v-if="$showWaterMark" :text="$waterMarkText"></DsfUserInfoWaterMark>
      <dsf-personalization :show.sync="personalizationShow"></dsf-personalization>
    </dsf-home>
    <!--单层tab导航-->
    <dsf-home v-else-if="pageSuffix == 'index2'" :menu-list="menuList">
      <dsf-college-home :dropdown-config="dropdownConfig" logo-url="https://gitee.com/static/images/logo-black.svg?t=158106664" search-placeholder="请输入关键词" @dropdown-click="dropdownClick" />
      <dsf-personalization :show.sync="personalizationShow"></dsf-personalization>
    </dsf-home>
    <!--多页签-->
    <dsf-home v-else-if="pageSuffix == 'multiPage'" :menu-list="menuList">
      <dsf-default-home-header slot="header" :dropdown-config="dropdownConfig" no-menu @dropdown-click="dropdownClick" />
      <dsf-default-home-aside-menu slot="left" position="left" />
      <dsf-multi-page-home :dropdown-config="dropdownConfig" @dropdown-click="dropdownClick" />
      <dsf-personalization :show.sync="personalizationShow"></dsf-personalization>
    </dsf-home>
    <template v-else>
      <router-view class="page-head-font-fixed"></router-view>
      <DsfUserInfoWaterMark v-if="$showWaterMark" :text="$waterMarkText"></DsfUserInfoWaterMark>
    </template>
    <!-- <DsfIagentGlobalAiChat class="dsf-dv-ai-chat" :navMenuList="navMenuList" /> -->
  </div>
</template>

<script>
export default {
  name: "Home",
  props: {
    pageSuffix: {
      type: String,
      default: "else",
    },
  },
  data() {
    return {
      // navMenuList: [
      //   {
      //     path: `/pc/ai/dv-ai`,
      //     name: "大屏AI",
      //     icon: "iagent-icon-zhushou",
      //   },
      // ],
      personalizationShow: false,
      /**
       * **用户头像下的菜单** <br/>
       *  **name**: {String} _必须_ 显示文字 <br/>
       *  **key**: {String | Number} _非必须_ 菜单标识<br/>
       *  -----以下属性任意存在一个------ <br/>
       *  **url**: {String} _非必须_ 如果存在则跳转页面 <br/>
       *  **openUrl**: {String} _非必须_ 如果存在则新开页面 <br/>
       *  **handler**: {String} _非必须_ 如果存在则调用对应方法
       */
      dropdownConfig: [],
      menuList: [],
    };
  },
  created() {
    if (+dsf.config.setting_public_hidden_update_password) {
      this.dropdownConfig = [
        { name: "切换组", key: "groupChange" },
        { name: "退出", key: "loginOut", handler: "loginOut" },
      ];
    } else {
      this.dropdownConfig = [
        { name: "切换组", key: "groupChange" },
        { name: "修改密码", key: "alterPwd" },
        { name: "退出", key: "loginOut", handler: "loginOut" },
      ];
    }
    if (this.pageSuffix != "else") {
      getMenuTree.call(this);
    }
  },
  computed: {
    $waterMarkText() {
      return dsf.config.setting_public_watermark_text;
    },
    $showWaterMark() {
      return this.$store.state.userInfoWaterMark.show;
    },
  },
  methods: {
    // 用户头像下的菜单点击
    dropdownClick(item) {
      if (item.url) {
        window.location.href = item.url;
      } else if (item.openUrl) {
        window.open(item.openUrl);
      } else if (item.handler) {
        this[item.handler] && this[item.handler](item);
      } else {
        // 其他情况自行处理
      }
    },
    personalizationSetting() {
      this.personalizationShow = true;
    },
    // 修改密码
    alterPwd() {
      location.replace(dsf.config.setting_public_alter_password_page);
    },
    // 自带方法：退出登录
    loginOut() {
      dsf.layer
        .confirm("您确定要退出吗?")
        .then(() => {
          // 应后端要求，退出登录cookies由后端清除，若接口异常直接提示报错信息
          this.$webAPI
            .loginOut()
            .then(({ success, message }) => {
              if (success) {
                dsf.clearLoginInfo();
                location.replace(dsf.config.setting_public_pc_login_page);
              } else {
                dsf.layer.message(message, false);
              }
            })
            .catch((err) => {
              console.error(err);
              dsf.layer.message("退出失败", false);
            });
        })
        .catch(() => {});
    },
  },
};

/**
 * 请求菜单数据
 */
function getMenuTree() {
  let urlInfo = dsf.url.parse(location.href),
    isPrevieHome = urlInfo.hashKey == "/pc/previewHome",
    params = {},
    url = dsf.config.setting_public_home_menu_src;

  if (isPrevieHome) {
    params = dsf.mix({}, urlInfo.hashQuery);
    url = "user/menu2/user/list/tree";
  }

  this.$http
    .get(url, params)
    .done(({ success, data }) => {
      if (success) {
        this.menuList = data;
        // 如果是菜单预览将不做session处理-用于基础平台-用户管理-预览菜单时使用
        if (!isPrevieHome) {
          dsf.storage.session.set("homeMenu", data);
        }
      }
    })
    .error((error) => {
      dsf.httpError(error);
      // dsf.layer.message(message, false);
    });
}
</script>
