/*
 * @Author: wqsong2
 * @Date: 2023/10/25 18:05
 * @Desciption:菜单store配置
 */
// @ts-ignore
import waterData from '$public/nav.json'
import { searchTreeL, handleAuthMenu, searchTree } from '@/utils/arithmetic';
import {isHttp, loadView} from '@/utils/utils';
import auth from '@/services/modules/auth.service';
import router from '@/router/index';
import { url } from '@/utils/regexp';
export interface stateAppMenu {
	menu: string[];
	menuActiveIndex: string;
	levelList: string[];
	matched: object;
  visitedViews: [];
  topNav:Boolean;
}
export const intialState: stateAppMenu = {
	menu: [],
	menuActiveIndex: '',
	levelList: [],
	matched: {},
  visitedViews:[],
  topNav:true,
};

const children: any = (menus: any,menuUrl:'') => {
  menus.map((item:any) =>{
    item.menuUrl = menuUrl ? menuUrl + '/' +item.path : item.path
    item.menuName = item.meta.title
    item.meta.keepAlive = false
    item.meta.fullScreen = 'TCB'
    item.meta.requireAuth = true
    item.meta.nobread = true
    item.meta.noTagsView = true
    item.meta.isHideAside = true
    item.meta.affix = false
    if (item.component === 'Layout') {
      item.component = loadView(item.component,1)
    }else if(item.component){
      item.component = loadView(item.component,'')
    }
    if(item.children?.length > 0){
      children(item.children,item.menuUrl)
    }else {
      item.children = []
    }
  })
};
let listArray:any = null
const routerListFunc = (list:any,urlArray:any) => {
  list.map((item:any)=>{
    if(item.menuUrl === urlArray){
      listArray = item
    }else if(item.children && item.children.length > 0){
      routerListFunc(item.children,urlArray)
    }
  })
}
// 递归重新组装菜单
const menuList = (resList:any,res:any,resData:any) => {
  resList.forEach((item:any)=>{
    res?.forEach((items:any)=>{
      if(item.path == items.path){
        resData.push({
          children:[],
          alwaysShow:items.alwaysShow,
          component:items.component,
          hidden:items.hidden,
          meta:items.meta,
          name:items.name,
          path:items.path,
          redirect:items.redirect,
          query:items.query
        })
        if(item.children && item.children.length>0){
          menuList(item.children,items.children,resData[resData.length-1].children)
        }
      }
    })
  })
}
export default {
	state: {
		menu: intialState.menu,
		menuActiveIndex: intialState.menuActiveIndex,
		levelList: intialState.levelList,
		matched: intialState.matched,
    visitedViews: intialState.visitedViews,
    topNav:intialState.topNav
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
        const response = await auth.getgetRoutersData();
				const devResponse: any = {
					errCode: '-1',
					errMsg: '操作成功',
					data: response.data,
					flag: true,
				};
        // 授权菜单二次处理合并
        const whetherOrNotToFilter = true
        let nMenu:any = [];
        if(whetherOrNotToFilter){
          const resList = await auth.getMenuData();
          if(resList.data.children && resList.data.children.length  > 0){
            menuList(resList.data.children,response.data,nMenu)
          }
        }
        let menu = whetherOrNotToFilter ? nMenu : devResponse.data.concat(nMenu);
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
      let arr = state.visitedViews.filter((item:any) => item.menuUrl === urlArray.path);
      if (arr.length == 0) {
        listArray = null
        let menus = router.options.routes.concat(state.menu)
        await routerListFunc(menus,urlArray.path)
        if(listArray){
          listArray.query = urlArray.query
          state.visitedViews.push(listArray)
        }
      }
    },
    // 删除某个菜单
    MUT_DeleteMenuvisitedViews (state: any, urlArray: any){
      state.visitedViews = state.visitedViews.filter((item:any)=>item.menuUrl !== urlArray)
    }
	},
};
