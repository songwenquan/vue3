/*
 * @Author: wqsong2
 * @Date: 2023/10/13 17:22
 * @Desciption::项目配置
 */
import { cookie,storageSetting } from '@/utils/cookies';
import { getLocale } from '@/i18n';
export interface stateApp {
	size: string;
	language: string;
  theme:string;
}
export const intialState: stateApp = {
	size: cookie.get('sizeKey') || '',
	language: getLocale(),
  theme: storageSetting.get('layout-setting','theme') || '#005FCF'
};

export default {
	state: {
		size: intialState.size,
		language: intialState.language,
    theme:intialState.theme
	},
	getters: {},
	actions: {},
	mutations: {
		MUT_SET_LANGUAGE(state: any, language: any) {
			state.language = language;
			cookie.set('languageKey', state.language);
		},
	},
};
