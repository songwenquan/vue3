/*
 * @Author: wqsong2
 * @Date: 2023/10/25 17:29
 * @Desciption:用户信息store 获取 存储配置
 */
import auth from '@/services/modules/auth.service';
import router from '@/router/index';
export interface stateAppUser {
	userInfo: object;
}
const intialState: stateAppUser = {
	userInfo: {},
};
export default {
	state: {
		userInfo: intialState.userInfo,
	},
	getters: {},
	actions: {
		async ACT_GetUserInfo({ commit }: { commit: any }) {
			try {
				const response: any = await auth.getUserInfo();
        if (response.flag || response.success || response.code === '200') {
					const data = response.data.uapUser;
					commit('MUT_SetUser', data);
					return { flag: true, user: data };
				} else {
					const msg = response.errMsg ? response.errMsg : response.errorMessage;
					return { flag: false, errCode: response.errCode, msg: msg };
				}
			} catch {
				return { flag: false, msg: '连接网络超时' };
			}
		},
		ACT_Logout({ commit }: { commit: any }) {
			commit('MUT_LogoutUser');
		},
		ACT_InitUserInfo({ commit }: { commit: any }) {
			commit('MUT_InitUserInfo');
		},
	},
	mutations: {
		MUT_InitUserInfo(state: any) {
			state.userInfo = {};
		},
		MUT_SetUser(state: any, userInfo: any) {
			state.userInfo = { ...state.userInfo, ...userInfo };
		},
		async MUT_LogoutUser(state: any) {
			const response = await auth.logout();
			if (response.status === 200 && response.data.flag) {
				state.userInfo = {};
				router.push({ path: '/login' });
			} else {
				if (response.data.errCode === '401') {
					state.userInfo = {};
					router.push({ path: '/login' });
				} else if (response.data.errCode === '403') {
					console.log('403');
				}
			}
		},
	},
};
