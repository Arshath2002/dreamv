
import VueI18n from 'vue-i18n';
let langs = {};
for (let k in $i18n) {
  langs[k] = {
    ...($i18n[k] || {})
  }
}
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'zh_CN',    // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale 
  messages: {
    ...langs
  },
  silentTranslationWarn: true
});

export default i18n;