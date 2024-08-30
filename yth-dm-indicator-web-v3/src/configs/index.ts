/*
 * @Author: wqsong2
 * @Date: 2023/10/9 15:49
 * @Desciption:config配置引用文件
 */
const environment = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
export const config = require(`./modules/${environment}.config.ts`);
export default {
	// 组件内部使用：
	install(app: any) {
		Object.defineProperty(app.config.globalProperties, '$conf', {
			enumerable: true,
			get() {
				return config;
			},
		});
	},
};
