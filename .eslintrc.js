module.exports = {
  "root": true,
  // 指定环境
  "env": {
    "node": true, // Node.js 全局变量和 Node.js 作用域
    "browser": true // 浏览器环境中的全局变量
  },
  "extends": [
    "plugin:vue/essential",
    "eslint:recommended"
  ],
  // 解析器选项
  "parserOptions": {
    "ecmaVersion": 2020, // 指定你想要使用的 ECMAScript 版本
    "parser": "babel-eslint",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    // "indent":['error',2], // 不强制使用一致的缩进
    // "prettier/prettier": "error",
    "vue/script-setup-uses-vars": "off",
    "no-unused-vars": "off", // 禁止出现未使用过的变量
    "no-undef": "off", // 禁用未声明的变量，除非它们在?/*global*/?注释中被提到
    "no-useless-escape": "off", // 不禁用不必要的转义字符
    "no-debugger": "warn", //禁用 debugger；警告
    "no-constant-condition": "off", // 禁止在条件中使用常量表达式
    "no-redeclare": "off", // 禁止多次声明同一变量
    "no-self-assign": "off", // 禁止自我赋值
    "no-case-declarations": "off", // 不允许在 case 子句中使用词法声明
    "no-useless-catch": "off", // 禁止不必要的 catch 子句
    // vue相关
    "vue/no-reserved-keys": "off",
    "vue/no-mutating-props": "off",
    "vue/require-v-for-key": "error", //必须设置v-for的键值；否则报错
    "vue/no-unused-components": "off",
    "vue/html-self-closing": "off",
    "vue/no-v-html": "off",
    "vue/no-unused-vars": "off",
    "vue/custom-event-name-casing": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/html-quotes": ["error", "double"],
    "vue/no-parsing-error": "off",
    "vue/html-indent": ["error", 2, {
      "attribute": 1,
      "baseIndent": 1,
      "closeBracket": 0,
      "alignAttributesVertically": true,
      "ignores": []
    }],
    "vue/max-attributes-per-line": [ //多个特性的元素的规则；否则报错
      "error",
      {
        singleline: 8,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ]
  },
  "globals": {
    "$": true,
    "_": true,
    "dsf": true,
    "Vue": true,
    "$$webRoot": true,
    "$$config": true,
    "$$validate": true,
    "$$form": true,
    "flow": true,
    "ui": true,
    "UE": true,
    "monaco": true,
    "uParse": true,
  },
  "overrides": [{
    "files": [
      "**/__tests__/*.{j,t}s?(x)",
      "**/tests/unit/**/*.spec.{j,t}s?(x)"
    ],
    "env": {
      "jest": true
    }
  }]
};