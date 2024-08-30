import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// 全局修改默认样式 elementPlus
import '@assets/styles/elementPlus.less';
// 引用公共组件(安装 修改)
import { installPlugins } from '@/plugins';
// 路由上下文配置
import configs from '@/configs';
// 请求
import service from '@/services';
//引入echarts
import * as echarts from "echarts";
// 解决V-HTML指令潜在的XSS攻击
import vueDOMPurifyHTML from 'vue-dompurify-html';
const app = createApp(App).use(vueDOMPurifyHTML).use(store).use(router).use(configs).use(service);
app.config.globalProperties.$echarts = echarts
installPlugins.install(app);
app.mount('#app');
