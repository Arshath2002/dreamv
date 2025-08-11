/*
 * @Date: 2024-10-25 17:40:17
 * @Author: haodong chenghd@dreamdt.cn
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-08 17:17:30
 */
dsf.mergeConfig(
  dsf.config,
  {
    webRoot: {
      //默认请求路径根
      default: "/",
    },
    file: {
      preViewServer: "/dsfa/",
    },
    //当前运行类型：project--项目
    runType: "platform",
    assetsDir: "./static/",
    //默认皮肤
    setting_public_default_theme: "darkred-theme",
    //默认字体大小
    setting_public_default_size: "normal",
    //默认顶部导航栏是否为窄条
    setting_public_default_header_mini: false,
    //显示ai
    setting_public_ai_enter_show: "1",
    // 上传文件是不是静态 默认不是静态
    setting_dataview_upload_static: "0",
    //页面右下角是否显示设计器跳转图标
    setting_public_gotoicon: "1",
    //登录成功后进入页面地址
    setting_public_login_success_to: "./index.html",
    //登录成功后跳转页面
    setting_public_mobile_login_success_to: "./mobile-index.html",
    //登录页地址
    setting_public_pc_login_page: "./page.html#/pc/login",
    // 修改密码地址
    setting_public_alter_password_page: "./page.html#/pc/dsfa/platformhome/alterPassword",
    // pc端忘记密码地址
    setting_public_forgot_password_page: "./page.html#/pc/dsfa/platformhome/forgetPassword",
    // 移动端忘记密码地址
    setting_mobile_public_forgot_password_page: "./mobile-index.html#/mobile/dsfa/platformhome/mobile-forgot-password",
    // 找回密码模式，默认为通过手机找回
    setting_public_forget_pwd_setting: "phone",

    setting_public_mobile_login_page: "./mobile-index.html#/mobile/login",
    //项目logo图片地址
    setting_public_logo_image: "",
    //项目名称
    setting_public_logo_title: "",
    //默认用户头像
    setting_public_user_default_header: "modules/platform/static/img/defaultHeader.png",
    //菜单请求接口
    setting_public_home_menu_src: "/platform/menu/getTree",
    // 密级字典地址
    setting_encrypt_level_dictionary: "dd525199e48d4c5bbb37f40e75219d4f",
    //默认预览
    setting_public_file_host: "/",
    // 流程提示弹窗倒计时间，默认为3
    setting_flow_count_down_time: 3,
    setting_public_disable_head_logo_url: false,
  },
  window.$$serverConfig ? window.$$serverConfig : {},
  getServerConfigJson(),
  window.$$config ? window.$$config : {}
);
function getServerConfigJson() {
  try {
    return JSON.parse(window.$$serverConfig.setting_public_config_js.trim());
  } catch (ex) {
    return {};
  }
}
window.$$webRoot = dsf.config.webRoot;
