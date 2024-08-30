/*
* @Author: wqsong2
* @Date: 2023/12/7 10:13
* @Desciption:自定义 rules 规则 和 env 配置
*/
require('@rushstack/eslint-patch/modern-module-resolution')
module.exports = {
  root: true,
  env: {
    node: true // 识别 nodejs 配置
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/multi-word-component-names': 'off', // 默认vue文件必须大驼峰命名，off 关闭文件名称校验
  }
}
