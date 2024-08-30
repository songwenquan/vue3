/*
 * @Author: wqsong2
 * @Date: 2023/10/10 17:21
 * @Desciption:请求service封装总入口
 */
import camelCase from 'lodash/camelCase';
const services = {};
export default {
	install(app: any) {
		const requireModule = require.context('./', true, /^((?!index|\.unit\.).)*\.ts$/);
		requireModule.keys().forEach((fileName) => {
			const moduleDefinition = requireModule(fileName).default || requireModule(fileName);
			const modulePath: Array<any> = fileName
				.replace(/^\.\/modules\//, '')
				.replace(/(\.service)?\.\w+$/, '')
				.split(/\//)
				.map(camelCase);
			const leafService = getNamespace(services, modulePath);
			leafService[modulePath.pop()] = {
				...moduleDefinition,
			};
		});
		Object.defineProperty(app.config.globalProperties, '$api', {
			enumerable: true,
			get() {
				return services;
			},
		});
	},
};
function getNamespace(subtree: any, path: any): any {
	if (path.length === 1) {
		return subtree;
	}
	const namespace = path.shift();
	subtree[namespace] = {
		...subtree[namespace],
	};
	return getNamespace(subtree[namespace], path);
}
