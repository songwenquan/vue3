/*
 * @Author: wqsong2
 * @Date: 2023/7/25 19:08
 * @Description:用户 菜单 字典 登录 退出接口 isJson:是否json传参默认JSON  text:请求遮罩文字 hideLoading:是否隐藏请求遮罩
 */
import HttpClient from '@/utils/http-client';
import { config } from '@/configs/index';
const http$ = new HttpClient(config.baseUrl2);
export default {
	// 获取指标概览头部折线列表数据
	kpiData(params: any) {
		return http$.request({
			url: '/services/statistics/kpiData',
			method: 'post',
			isJson: true,
			data: params,
		});
	},
	// 获取明细动态 待办事项
	todoIndicator(params: any) {
		return http$.request({
			url: '/services/statistics/todoIndicator',
			method: 'post',
			isJson: true,
			data: params,
		});
	},
	// 获取明细动态 热门事项
	hitIndicator(params: any) {
		return http$.request({
			url: '/services/statistics/hitIndicator',
			method: 'post',
			isJson: true,
			data: params,
		});
	},
	// 获取明细动态 最近更新
	latestIndicator(params: any) {
		return http$.request({
			url: '/services/statistics/latestIndicator',
			method: 'post',
			isJson: true,
			data: params,
		});
	},
	// 获取指标来源分布
	indicatorOverall(params: any) {
		return http$.request({
			url: '/services/statistics/indicatorOverall',
			method: 'post',
			isJson: true,
			data: params,
		});
	},
	// 获取概览动态
	updateInfo(params: any) {
		return http$.request({
			url: '/services/statistics/updateInfo',
			method: 'post',
			isJson: true,
			data: params,
		});
	},
	// 获取指标异常情况
	exception(params: any) {
		return http$.request({
			url: '/services/statistics/exception',
			method: 'post',
			isJson: true,
			data: params,
		});
	},
};
