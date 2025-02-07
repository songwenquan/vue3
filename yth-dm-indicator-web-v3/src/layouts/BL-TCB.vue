/* * @Author: wqsong2 * @Date: 2023/11/8 18:28 * @Desciption:公共配置 左侧列表 右侧内容 */
<template>
	<el-container class="main_container flex">
		<el-header class="main_header flex">
			<Header>
				<template v-slot:icon>
					<i class="title_icon mr10"></i>
				</template>
				<template v-slot:text>
					<span class="title_text fz18 color-f">智能业务协同系统</span>
				</template>
			</Header>
      <!-- 横向布局 菜单栏 -->
      <TopNav id="topmenu-container" class="topmenu-container" v-if="topNav" />
			<UserPanel @loginOut="actLogout"></UserPanel>
		</el-header>
		<el-container class="main_content flex flex-h-1">
			<el-aside :width="isCollapse ? '64px' : '220px'" v-if="$route.meta.isHideAside" class="flex">
				<MenuLeft :menu-array="leftMenu" @nav-item-select="menuItemSelect" :isCollapse="isCollapse"></MenuLeft>
				<div class="collapse fz14 c3 cursor-p pl20" :style="{ width: isCollapse ? '64px' : '220px' }" @click="isCollapse = !isCollapse">
					<el-icon v-if="isCollapse"><Expand /></el-icon>
					<el-icon v-else><Fold /></el-icon>
					<span class="tl ml10" v-show="!isCollapse">收起菜单</span>
				</div>
			</el-aside>
			<el-main class="main_primary flex" :style="{width: isCollapse ? 'calc(100% - 64px)' : 'calc(100% - 220px)'}">
				<router-view />
			</el-main>
		</el-container>
	</el-container>
</template>

<script setup lang="ts">
import { reactive, toRefs, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStoreState, useStoreActions } from '@/store/vuex';
import Header from '@/components/header/index.vue';
import UserPanel from '@/components/user-panel/index.vue';
import MenuLeft from '@/components/menu-left/index.vue';
import TopNav from '@/components/top-nav/index.vue';
const router = useRouter();
const route = useRoute();
let { isCollapse, activeIdx, subMenuClassName, levelList,leftMenu} = toRefs(
	reactive({
		isCollapse: false as boolean, // 展开收起状态
		activeIdx: '',
		subMenuClassName: 'clear-top-drop-dowm',
		levelList: [],
    leftMenu:[]
	})
);
// menu store-state-menu
const { menu: menuArray,topNav } = toRefs(reactive(useStoreState('menu', ['menu','topNav'])));
// 获取user store-actions方法
const userList = useStoreActions('user', ['ACT_Logout']);
const actLogout = () => {
	userList.ACT_Logout();
};
// 菜单点击跳转
const menuItemSelect = (val: any, openType: any) => {
	if (openType === '2') {
		window.open(val);
	} else {
		router.push({ path: val });
	}
};
// 获取menu store-actions方法
const menuList = useStoreActions('menu', ['ACT_SetMatched', 'ACT_SetlevelList']);
// 判断是否存在子集url
// 存储面包屑导航数据
const levelListFunc = () => {
	const { path } = route;
	(menuArray as any).value.map((item: any) => {
		if (item.menuUrl === path) {
			levelList = item;
			item.show = true;
			// 存储当前节点名称
			menuList.ACT_SetMatched({ menuName: item.menuName, menuUrl: item.menuUrl });
		} else {
			item.show = '';
			menuArrayChildren(item, item.children, path);
		}
	});
	// 数据处理  如果多级菜单 递归获取父级
	if ((levelList as any).show !== true) {
		const parentDirectory: any = levelListChild(menuArray.value, path);
		// 根据url匹配  重新赋值name以及赋值路由中部分字段
		parentDirectory.map((item: any) => {
			route.matched.map((items) => {
				if (item.menuUrl === items.path) {
					item.redirect = items.redirect;
				} else {
					menuNameChild(item, items.children, 'path', 'redirect');
				}
			});
			// 因菜单和路由名称可能存在变差  故取菜单数据进行赋值
			(menuArray as any).value.map((items: any) => {
				if (items.menuUrl === item.menuUrl) {
					item.menuName = items.menuName;
				} else {
					menuNameChild(item, items.children, 'menuUrl', 'menuName');
				}
			});
		});
		menuList.ACT_SetlevelList(  parentDirectory);
	} else {
		menuList.ACT_SetlevelList([{ menuUrl: (levelList as any).menuUrl, menuName: (levelList as any).menuName }]);
	}
};
// 递归遍历子级菜单
const menuArrayChildren = (item: any, children: any, path: any) => {
	children.map((items: any) => {
		if (items.menuUrl === path) {
			items.show = true;
			levelList = item;
			// 存储当前节点名称
			menuList.ACT_SetMatched({ menuName: items.menuName, menuUrl: items.menuUrl });
		} else {
			items.show = '';
			menuArrayChildren(item, items.children, path);
		}
	});
};
// 递归获取父级url
const levelListChild = (tree: any, nodeId: any) => {
	if (tree) {
		const { childList = 'children', menuUrl = 'menuUrl' } = {};
		const toFlatArray: any = (tree: any, parentId: any) => {
			return tree.reduce((t: any, _: any) => {
				const child = _[childList];
				return [...t, parentId ? { ..._, parentId } : _, ...(child && child.length ? toFlatArray(child, _[menuUrl]) : [])];
			}, []);
		};
		const getIds = (flatArray: any) => {
			let ids = [{ menuUrl: nodeId }];
			let child = flatArray.find((_: any) => _[menuUrl] === nodeId);
			while (child && child.parentId) {
				ids = [{ menuUrl: child.parentId }, ...ids];
				child = flatArray.find((_: any) => _[menuUrl] === child.parentId);
			}
			return ids;
		};
		return getIds(toFlatArray(tree));
	}
};
// 递归获取子级部分字段
const menuNameChild = (item: any, children: any, key: string, code: string) => {
	if (children && children.length) {
		children.map((items: any) => {
			if (item.menuUrl === items[key]) {
				item[code] = items[code];
			} else {
				menuNameChild(item, items.children, key, code);
			}
		});
	}
};
// 路由监听
watchEffect(() => {
  // 双位置菜单拆分
  menuArray.value.map((item:any)=>{
    if(route.path.startsWith(item.path)){
      leftMenu.value = item.children
    }
  })
	levelListFunc();
});
</script>

<style scoped lang="scss">
.main_container {
	width: 100vw;
	height: 100vh;
	flex-direction: column;
	.main_header {
		padding: 0 !important;
		background: #1558c9 url('~@/assets/banner.png') no-repeat right center;
		width: 100%;
		justify-content: space-between;
	}
	.title_icon {
		width: 30px;
		height: 30px;
		background: url('~@/assets/logo.png') no-repeat;
		background-size: 100% 100%;
	}
	.el-aside {
		flex-direction: column;
		margin-right: 3px;
		box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
    padding-top: 15px;
		.collapse {
			position: fixed;
			bottom: 0;
			line-height: 48px;
			background-color: #f7f8f9;
			box-sizing: border-box;
			span {
				width: 100%;
			}
		}
	}
	.main_primary {
		padding: 15px;
		background-color: #eef4fb;
    height: 100%;
	}
}
</style>
