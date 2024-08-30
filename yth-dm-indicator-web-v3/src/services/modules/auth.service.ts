/*
 * @Author: wqsong2
 * @Date: 2023/7/25 19:08
 * @Description:用户 菜单 字典 登录 退出接口 isJson:是否json传参默认JSON  text:请求遮罩文字 hideLoading:是否隐藏请求遮罩
 */
import HttpClient from '@/utils/http-client';
import { config } from '@/configs/index';
const http1$ = new HttpClient(config.baseUrl);
const http$ = new HttpClient(config.baseUrl2);
export default {
	// 获取用户信息
	getUserInfo() {
		return http1$.request({
			url: '/session/userInfo/get',
			method: 'get',
		});
	},
	// 获取菜单
	getMenuData() {
		return http$.request({
			url: '/getNav',
			method: 'post',
		});
	},
	// 退出登录
	logout() {
		return http$.request({
			url: '/system/logout',
			method: 'post',
		});
	},
};
