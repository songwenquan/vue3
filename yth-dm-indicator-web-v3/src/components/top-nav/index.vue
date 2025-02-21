/* * @Author: wqsong2 * @Date: 2024/10/30 18:21 * @Desciption:头部导航 */
<template>
	<div class="topNav">
		<el-menu :default-active="activeMenu" mode="horizontal" @select="handleSelect" :ellipsis="false">
			<template v-for="(item, index) in topMenus">
				<el-menu-item
					:style="{ '--theme': theme }"
					:index="firstChildPath(item)"
					:key="index"
					v-if="index < visibleNumber"
					:class="route.path.startsWith(item.path) ? 'active-menu-item' : ''"
				>
					<span>{{ item.meta.title }}</span>
				</el-menu-item>
			</template>
			<!-- 顶部菜单超出数量折叠 -->
			<el-sub-menu :style="{ '--theme': theme }" index="more" v-if="moreMenus.length > 0" :class="routerFunc(moreMenus) ? 'is-active' : ''">
				<template #title>更多菜单</template>
				<template v-for="(item, index) in moreMenus" :key="index">
					<el-menu-item :index="firstChildPath(item)" :class="route.path.startsWith(item.path) ? 'active-menu-item' : ''">
						<svg-icon :icon-class="item.meta.icon" style="margin-right: 5px" />
						{{ item.meta.title }}
					</el-menu-item>
				</template>
			</el-sub-menu>
		</el-menu>
	</div>
</template>
<script setup lang="ts">
import { reactive, toRefs, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStoreState } from '@/store/vuex';
import { isHttp } from '@/utils/utils';
import constantRoutes from '@/router/modules/home.router';
const route = useRoute();
const router = useRouter();
const { visibleNumber, currentIndex, hideList } = toRefs(
	reactive({
		visibleNumber: null, // 顶部栏初始数
		currentIndex: null, //当前激活菜单的
		hideList: [], // 隐藏侧边栏路由
	})
);
// 所有路由信息
const { menu } = toRefs(reactive(useStoreState('menu', ['menu'])));
// 主题颜色
const { theme } = toRefs(reactive(useStoreState('app', ['theme'])));
// 顶部显示菜单
const topMenus = computed(() => {
	let topMenus = [];
	menu.value.slice(0, visibleNumber.value).map((menu) => {
		if (menu.hidden !== true) {
			// 兼容顶部栏一级菜单内部跳转
			if (menu.path === '/') {
				topMenus.push(menu.children[0]);
			} else {
				topMenus.push(menu);
			}
		}
	});
	return topMenus;
});
// 更多菜单
const moreMenus = computed(() => {
	let moreMenus = [];
	menu.value.slice(visibleNumber.value, menu.value.length).map((menu) => {
		if (menu.hidden !== true) {
			// 兼容顶部栏一级菜单内部跳转
			if (menu.path === '/') {
				moreMenus.push(menu.children[0]);
			} else {
				moreMenus.push(menu);
			}
		}
	});
	return moreMenus;
});
const routerFunc = (moreMenus) => {
	let num = 0;
	moreMenus.forEach((item) => {
		if (route.path.startsWith(item.path)) {
			num++;
		}
	});
	if (num > 0) {
		return true;
	} else {
		return false;
	}
};
// 默认激活菜单
const activeMenu = computed(() => {
	const path = route.path;
});
// 获取模块菜单的第一子路由
const firstChildPath = computed(() => {
	return function (item) {
		const data = findRedirectPage(item);
		let url = '';
		data.map((items, index) => {
			if (index > 0) {
				url += '/' + items;
			} else {
				url = items;
			}
		});
		return url;
	};
});
// 递归 查询模块菜单的第一个展示页面
const findRedirectPage = (item, array = []) => {
	array.push(item.path);
	if (item.children.length > 0) {
		const ui = item.children.filter((item) => !item.hidden);
		return findRedirectPage(ui[0], array);
	} else return array;
};
// 只适应窗口宽度
const setVisibleNumber = () => {
	const width = document.body.getBoundingClientRect().width / 3;
	visibleNumber.value = parseInt(width / 85);
};
const handleSelect = (key) => {
	currentIndex.value = key;
	const route = menu.value.find((item) => item.path === key);
	if (isHttp(key)) {
		// http(s):// 路径新窗口打开
		window.open(key, '_blank');
	} else if (!route || !route.children) {
		// 没有子路由路径内部打开
		const routeMenu = childrenMenus.value.find((item) => item.path === key);
		if (routeMenu && routeMenu.query && Object.keys(routeMenu.query).length !== 0) {
			let query = JSON.parse(routeMenu.query);
			router.push({ path: key, query: query });
		} else {
			router.push({ path: key });
		}
	} else {
		// 显示左侧联动菜单
		activeRoutes(key);
	}
};
const childrenMenus = computed(() => {
	let childrenMenus = [];
	let menus = JSON.parse(JSON.stringify(menu.value));
	menus.map((router) => {
		for (let item in router.children) {
			if (router.children[item].parentPath === undefined) {
				if (router.path === '/') {
					router.children[item].path = '/' + router.children[item].path;
				} else {
					if (!isHttp(router.children[item].path)) {
						router.children[item].path = router.path + '/' + router.children[item].path;
					}
				}
				router.children[item].parentPath = router.path;
			}
			childrenMenus.push(router.children[item]);
		}
	});
	return constantRoutes.concat(childrenMenus);
});
const activeRoutes = (key) => {
	let routes = [];
	console.log(key);
};
onMounted(() => {
	window.addEventListener('resize', setVisibleNumber);
});
onBeforeUnmount(() => {
	window.removeEventListener('resize', setVisibleNumber);
});
onMounted(() => {
	setVisibleNumber();
});
</script>
<style scoped lang="scss">
::v-deep .el-menu--horizontal > .el-sub-menu .el-sub-menu__title {
	border-bottom: none;
	color: #ffffff;
}
::v-deep .el-menu--horizontal > .el-sub-menu .el-sub-menu__title:hover {
	background: none;
	color: #ffffff;
}
.topNav {
	.el-menu {
		background-color: transparent !important;
	}
	.el-menu--horizontal {
		border-bottom: none !important;
		.el-menu-item:not(.is-disabled):hover {
			background-color: transparent !important;
			color: #ffffff;
		}
		.el-menu-item.active-menu-item {
			color: #fff !important;
			background-image: url('@/assets/images/img/tab_bg.png');
			background-size: 114% 105% !important;
			border-bottom: none !important;
		}
		.el-menu-item.is-active {
			color: #fff !important;
			border-bottom: none !important;
		}
		.el-sub-menu.is-active {
			color: #fff !important;
			background-image: url('@/assets/images/img/tab_bg.png');
			background-size: 114% 105% !important;
			border-bottom: none !important;
		}
	}
	.el-menu-item {
		color: #ffffff;
		background-color: unset !important;
		border-bottom: none !important;
	}
}
</style>
