module.exports = {
  compact:true,
  presets: [
    [
      "@vue/cli-plugin-babel/preset",
      {
        "useBuiltIns": false,
        "modules": false
      }
    ]
  ],
  plugins: [
    // elementUi按需引入
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      },
      'element-ui'
    ],
    // vant按需引入
    [
      'import',
      {
        'libraryName': 'vant',
        'libraryDirectory': 'es',
        'style': true
      },
      'vant'
    ],
    "@babel/plugin-proposal-export-default-from"
  ]
}