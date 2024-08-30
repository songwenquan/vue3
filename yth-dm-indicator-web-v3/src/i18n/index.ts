/*
 * @Author: wqsong2
 * @Date: 2023/11/3 18:14
 * @Desciption:多语言入口文件
 */
import { createI18n } from 'vue-i18n';
import { cookie } from '@/utils/cookies';
import elementEnLocale from 'element-plus/es/locale/lang/en';
import elementZhLocale from 'element-plus/es/locale/lang/zh-cn';
import enLocale from '@/i18n/en'; // 导入项目中用到的英文语言包
import zhLocale from '@/i18n/zh-cn'; // 导入项目中用到的中文语言包
const messages = {
	en: {
		...enLocale,
		...elementEnLocale,
	},
	zh: {
		...zhLocale,
		...elementZhLocale,
	},
};
export const getLocale = () => {
	const cookieLanguage = cookie.get('languageKey');
	if (cookieLanguage) {
		return cookieLanguage;
	}
	const language = navigator.language.toLowerCase();
	const locales = Object.keys(messages);
	for (const locale of locales) {
		if (language.indexOf(locale) > -1) {
			return locale;
		}
	}
	return 'zh';
};

const i18n = createI18n({
	legacy: false,
	globalInjection: true,
	locale: getLocale(),
	messages: messages,
});

export default i18n;
