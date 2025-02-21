/*
 * @Author: wqsong2
 * @Date: 2023/11/3 18:14
 * @Desciption:存储信息封装
 */
// cookie的封装
import Cookies from 'js-cookie';
export const cookie = {
	// 设置cookie
	set(key: string, val: any) {
		Cookies.set(key, val);
	},
	// 获取cookie
	get(key: string) {
		return Cookies.get(key);
	},
};
// 获取特殊存储数据
export const storageSetting = {
	// 获取对应Key
	get(key: string, keys: any) {
		if (localStorage.getItem(key)) {
			return localStorage.getItem(key)![keys];
		}
	},
};
