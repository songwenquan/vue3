/*
 * @Author: wqsong2
 * @Date: 2023/7/13 17:17
 * @Desciption:安装插件
 */
// 全局安装element-plus
import ElementPlus, { ElMessage } from 'element-plus';
import store from '@/store';
import i18n from '@/i18n';
import 'element-plus/dist/index.css';
// 时间插件
import Moment from 'moment';
// 引用图标库
import * as Icons from '@element-plus/icons-vue';
Moment.locale('zh-cn');
export const installPlugins = {
	install: function (app: any) {
		// 安装图标库
		for (const [key, component] of Object.entries(Icons)) {
			app.component(key, component);
		}
		app.use(ElementPlus, {
			i18n: i18n.global.t,
			size: store.state.app.size,
		});
		// 全局使用和挂载il8n
		app.use(i18n);
		app.config.globalProperties.$t = i18n.global.t;
		// 全局挂载时间组件
		app.config.globalProperties.$moment = Moment;
		// 默认提示
		app.config.globalProperties.$message = function (msg: any, duration: number) {
			return ElMessage({
				message: msg,
				duration: duration || 2000,
			});
		};
		// 错误提示
		app.config.globalProperties.$message.error = function (msg: any, duration: number) {
			return ElMessage.error({
				message: msg,
				duration: duration || 2000,
			});
		};
		// 警告提示
		app.config.globalProperties.$message.warning = function (msg: any, duration: number) {
			return ElMessage.warning({
				message: msg,
				duration: duration || 2000,
			});
		};
		// 成功提示
		app.config.globalProperties.$message.success = function (msg: any, duration: number) {
			return ElMessage.success({
				message: msg,
				duration: duration || 2000,
			});
		};
	},
};
