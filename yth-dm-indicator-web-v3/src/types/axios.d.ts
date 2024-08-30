/*
 * @Author: wqsong2
 * @Date: 2023/10/10 17:03
 * @Desciption:InternalAxiosRequestConfig额外参数扩展
 */
// eslint-disable-next-line
import { InternalAxiosRequestConfig, AxiosInstance } from 'axios';

declare module 'axios' {
	export interface InternalAxiosRequestConfig {
		// 是否隐藏loading
		hideLoading?: boolean;
		// loading 文本
		text?: string;
		// 是否使用JSON 传参
		isJson?: boolean;
		isFormData?: boolean;
	}
	export interface AxiosInstance {
		(config: AxiosRequestConfig): Promise<any>;
	}
}
