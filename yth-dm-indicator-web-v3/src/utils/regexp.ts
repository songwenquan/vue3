/*
 * @Author: wqsong2
 * @Date: 2023/10/30 18:08
 * @Desciption:部分正则验证
 */
export const url = /^(https?:)?\/{2}/;
// 手机号 || 电话号码
export function validatePhone(str: string) {
	return /^((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))$/.test(str);
}
// 手机号 由以1 开头的11位数字组成
export function validateMobile(str: string) {
	const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
	if (!str) {
		return true;
	} else {
		return reg.test(str);
	}
}
