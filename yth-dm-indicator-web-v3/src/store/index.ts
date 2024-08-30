/*
 * @Author: wqsong2
 * @Date: 2023/10/10 17:21
 * @Desciption:vuex 总入口
 */
import { createStore } from 'vuex';
import { createApp } from 'vue';
import { RootState } from '@/store/types';
const app = createApp({});
// 获得全部module
const files = require.context('./modules', false, /\.ts$/);
const modules: any = {};
// 收集
files.keys().forEach((key) => {
	// 文件名为key
	modules[key.replace(/(\.\/|\.ts)/g, '')] = files(key).default;
});
Object.keys(modules).forEach((key) => {
	// 带命名空间，防止不唯一
	modules[key].namespaced = true;
});
const store = createStore<RootState>({ modules });
/**
 * 安装vuex
 * @param {*} app
 */
Object.defineProperty(app.config.globalProperties, '$store', {
	enumerable: true,
	get() {
		return store;
	},
});
export default store;
