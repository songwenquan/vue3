/*
 * @Author: wqsong2
 * @Date: 2023/10/10 17:21
 * @Desciption:路由总入口拦截器
 */
import { createRouter, createWebHistory, RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { checkPermission } from '@/utils/utils';
import { createApp } from 'vue';
import { ElMessage } from 'element-plus';
import { children} from '@/utils/utils';
import store from '@/store';
/* ---start: 顶部进度条加载 --- */
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({
	easing: 'ease', // 动画方式
	speed: 500, // 递增进度条的速度
	showSpinner: false, // 是否显示加载ico
	trickleSpeed: 200, // 自动递增间隔
	minimum: 0.3, // 更改启动时使用的最小百分比
	parent: 'body', // 指定进度条的父容器
});
/* ---end --- */
const app = createApp({});
let routerModule: Array<RouteRecordRaw> = [
	// 配置入口 route, 用来控制 / 自动跳转，也可以不配置。
];
const requireRouters = require.context('./', true, /^((?!index|\.unit\.).)*\.ts$/);
requireRouters.keys().forEach((r) => {
	routerModule = routerModule.concat(...requireRouters(r).default);
});
const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	scrollBehavior: (to, from, savePosition) => {
		if (savePosition) {
			return savePosition;
		} else {
			return { top: 0 };
		}
	},
	routes: [...routerModule],
});
// 判断主体路由模板
function fullScreen(to: RouteLocationNormalized, next: NavigationGuardNext, url: any = '') {
	document.title = to.meta.title ? (to.meta.title as string) : '管理平台';
	if (to.meta.fullScreen) {
		store.commit('layout/MUT_SetLayout', to.meta.fullScreen);
		return url ? next(url) : next();
	} else {
		store.commit('layout/MUT_SetLayout', 'TCB');
		return url ? next(url) : next();
	}
}
// 判断菜单权限
async function menusFunc(to: RouteLocationNormalized, next: NavigationGuardNext) {
	let menus: object = [];
	if (store.state.menu.menu && store.state.menu.menu.length > 0) {
		// 判断是否有菜单数据
		menus = store.state.menu.menu;
	} else {
		const menu = await store.dispatch('menu/ACT_GetMenu');
		if (menu.flag === true) {
			menus = menu.menu;
		} else {
			ElMessage.error({ message: menu.msg, duration: 3000 });
		}
	}
  if(to.path === '/'){
    const url = children(menus);
    fullScreen(to, next, url);
  }else if (process.env.NODE_ENV === 'production' && to.path !== '/permissionMenu' && checkPermission('menuUrl', to.path, menus) === -1) {
		// 没有该菜单权限
		ElMessage.error({ message: '暂无该菜单权限，请重新扫码登录', duration: 3000 });
		fullScreen(to, next, '/permissionMenu');
	} else {
    store.commit('menu/MUT_SetMenuvisitedViews', to);
		fullScreen(to, next);
	}
}
// 路由守卫
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
	NProgress.start();
	// TODO: 权限验证（结合 menu store）
	// 判断是否为需要登录的页面
	if (to.meta.requireAuth === false || to.path === '/login') {
		fullScreen(to, next);
	} else {
		if (JSON.stringify(store.state.user.userInfo) !== '{}') {
			// 判断是否有登录信息
			await menusFunc(to, next);
		} else {
			const user = await store.dispatch('user/ACT_GetUserInfo');
			if (user.flag === true) {
				await menusFunc(to, next);
			} else {
				if (user.errCode === '401') {
					ElMessage.warning({ message: user.msg, duration: 3000 });
					// return next('/login');
				} else {
					ElMessage.warning({ message: user.msg, duration: 3000 });
					// return next('/login');
				}
			}
		}
	}
});
router.afterEach(() => {
	NProgress.done();
});
Object.defineProperty(app.config.globalProperties, '$route', {
	enumerable: true,
	get() {
		return router;
	},
});
export default router;
