/*
 * @Author: wqsong2
 * @Date: 2023/10/30 18:06
 * @Desciption:菜单路径相关方法
 */
import { resolve } from 'path';
import { url } from '@/utils/regexp';
export function searchTreeL(element: any, key: string): any {
	if (element[key].length === 0) {
		return element;
	} else if (element[key].length !== 0) {
		let i;
		let result = null;
		for (i = 0; result === null && i < element.items.length; i++) {
			result = searchTreeL(element.items[i], key);
		}
		return result;
	}
	return null;
}
export function searchTree(element: any, key: string, val: any): any {
	if (element[key] === val) {
		return element;
	} else if (element.items != null) {
		let i;
		let result = null;
		for (i = 0; result === null && i < element.items.length; i++) {
			result = searchTree(element.items[i], key, val);
		}
		return result;
	}
	return null;
}
export function handleAuthMenu(element: any, baseUrl: string) {
	if (element.children.length === 0) {
		const url = resolvePath(baseUrl, element.menuUrl);
		return { ...element, url };
	} else if (element.children.length !== 0) {
		const url = resolvePath(baseUrl, element.menuUrl);
		const arr: any[] = [];
		element.children.forEach((item: any) => {
			arr.push(handleAuthMenu(item, url));
		});
		return { ...element, url, children: arr };
	}
}
function resolvePath(basePath: any, path: any) {
	if (url.test(path)) {
		return path;
	}
	if (url.test(basePath)) {
		return basePath;
	}
	path = path.match(/^\/(.*)/) ? path.match(/^\/(.*)/)[1] : path;
	return resolve(basePath, path);
}
