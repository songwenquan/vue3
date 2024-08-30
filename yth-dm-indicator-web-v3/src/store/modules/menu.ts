/*
 * @Author: wqsong2
 * @Date: 2023/10/25 18:05
 * @Desciption:菜单store配置
 */
// @ts-ignore
import waterData from '$public/nav.json'
import { searchTreeL, handleAuthMenu, searchTree } from '@/utils/arithmetic';
import auth from '@/services/modules/auth.service';
import router from '@/router/index';
import { url } from '@/utils/regexp';
export interface stateAppMenu {
	menu: string[];
	menuActiveIndex: string;
	levelList: string[];
	matched: object;
  visitedViews: [];
}
export const intialState: stateAppMenu = {
	menu: [],
	menuActiveIndex: '',
	levelList: [],
	matched: {},
  visitedViews:[],
};
const children: any = (menus: any) => {
  menus.map((item:any) =>{
    item.menuUrl = item.url.split('#')[1]
    item.children = item.items
    item.menuName = item.title
    item.parentId = item.upauthId
    if(item.items.length > 0){
      children(item.items)
    }
  })
};
let listArray:any = null
const routerListFunc = (list:any,urlArray:any) => {
  list.map((item:any)=>{
    if(item.path === urlArray){
      listArray = item
    }else if(item.children && item.children.length > 0){
      routerListFunc(item.children,urlArray)
    }
  })
}
export default {
	state: {
		menu: intialState.menu,
		menuActiveIndex: intialState.menuActiveIndex,
		levelList: intialState.levelList,
		matched: intialState.matched,
    visitedViews: intialState.visitedViews,
	},
	getters: {
		// 菜单中第一个无子节点的 item
		// TODO: 应查找第一个 url 为非外链的子节点；而任意一个子节点；
		GTT_MenuFirstLeaf: (state: any) => {
			if (state.menu && state.menu !== 0) {
				const menuArr = state.menu.map((item: any) => handleAuthMenu(item, '/'));
				const result = searchTreeL({ items: menuArr }, 'items');
				return result;
			}
		},
	},
	actions: {
		async ACT_GetMenu({ commit }: { commit: any }) {
			try {
				const devResponse: any = {
					errCode: '-1',
					errMsg: '操作成功',
					data: waterData.data.items,
					flag: true,
				};
				let nMenu = [];
				if (process.env.NODE_ENV === 'production') {
					const response = await auth.getMenuData();
					if (!response.data.flag) {
						return { flag: false, errCode: response.data.errCode, msg: response.data.errMsg };
					}
					nMenu = response.data && response.data.data;
				}
				const menu = process.env.NODE_ENV === 'production' ? nMenu : devResponse.data.concat(nMenu);
        // 部分菜单兼容改造
        children(menu)
				// menu.map((item: any) => {
				// 	item.icon = item.icon && item.icon !== '' ? require('@/assets/images/nav/' + item.icon) : '';
				// 	item.iconActive = item.iconActive && item.iconActive !== '' ? require('@/assets/images/nav/' + item.iconActive) : '';
				// });
				commit('MUT_SetMenu', menu);
				return { flag: true, menu: menu };
			} catch (error) {
				return { flag: false, msg: '连接网络超时' };
			}
		},
		ACT_SetMenuActiveIndex({ state, commit }: { state: any; commit: any }, idx = '') {
			const menuArr = state.menu;
			commit('MUT_SetMenuActiveIndex', idx);
			if (menuArr.length !== 0) {
				const activeItems = searchTree({ id: '', items: menuArr }, 'id', idx);
				commit('MUT_SetMenuActiveIndex', idx);
				if (activeItems && activeItems.url) {
					if (activeItems.url.includes('http')) {
						// 如果是外部链接直接打开
						window.open(activeItems.url);
					} else {
						router.push(activeItems.url);
					}
				}
			}
		},
		// 选择的是 menu item 对应的path
		ACT_SelectMenuItem(root: any, path = '') {
			(path && url.test(path) && window.open(path)) || (path && router.push(path));
		},
		// 选中菜单 链路节点存储
		ACT_SetlevelList({ commit }: { state: any; commit: any }, levelList: any) {
			commit('MUT_SetlevelList', levelList);
		},
		// 选中菜单 url name存储
		ACT_SetMatched({ commit }: { state: any; commit: any }, matched: any) {
			commit('MUT_SetMatched', matched);
		}
	},
	mutations: {
		MUT_SetMenu(state: any, menu: any) {
			state.menu = [...state.menu, ...menu];
		},
		MUT_SetMenuActiveIndex(state: any, payload: any) {
			state.menuActiveIndex = payload;
		},
		MUT_SetlevelList(state: any, levelList: any) {
			state.levelList = levelList;
		},
		MUT_SetMatched(state: any, matched: any) {
			state.matched = matched;
		},
    // 添加点击过的菜单
    async MUT_SetMenuvisitedViews (state: any, urlArray: any){
      let arr = state.visitedViews.filter((item:any) => item.path === urlArray.path);
      if (arr.length == 0) {
        listArray = null
        await routerListFunc(router.options.routes,urlArray.path)
        if(listArray){
          listArray.query = urlArray.query
          state.visitedViews.push(listArray)
        }
      }
    },
    // 删除某个菜单
    MUT_DeleteMenuvisitedViews (state: any, urlArray: any){
      state.visitedViews = state.visitedViews.filter((item:any)=>item.path !== urlArray)
    }
	},
};
