/*
 * @Author: wqsong2
 * @Date: 2023/10/31 16:47
 * @Desciption:公共方法
 */
declare global {
  interface ImportMeta {
    glob: any;
  }
}
import Moment from 'moment';
import mitt, { Emitter } from 'mitt';
import store from "@/store";
// 菜单权限校验
export function checkPermission(key: string, val: string, arr: any) {
	let result = -1; // 初始值为-1，表示未找到
	if (Array.isArray(arr)) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i][key] === val) {
				// console.log('匹配成功')
				result = i;
				break; // 匹配到目标值后，立即终止循环
			} else if (Array.isArray(arr[i].children)) {
				// console.log('匹配下一级')
				const subresult = checkPermission(key, val, arr[i].children);
				if (subresult !== -1) {
					result = i;
					break; // 匹配到目标值后，立即终止循环
				}
			}
		}
	} else {
		// console.log('菜单不存在')
		result = -1;
	}
	return result;
}
// 大小写切换提示事件
export function checkCapslock(e: KeyboardEvent, map: any, key: any) {
	if (e.getModifierState('CapsLock')) {
		map[key] = true;
	} else {
		map[key] = false;
	}
}
// 部门赋值自定义方法
export function orgCode(nodes: any, arr: any, keyValue: any) {
	if (!nodes) {
		arr.value[keyValue[0]] = null;
		arr.value[keyValue[1]] = '';
	} else {
		arr.value[keyValue[0]] = nodes.id;
		arr.value[keyValue[1]] = nodes.areaName;
	}
}
// 时间赋值自定义方法
export function time(value: any, arr: any, code: any) {
	const list = ['receiveTime', 'acceptTime'];
	if (list.includes(code)) {
		if (value) {
			arr.value[code + 'Start'] = Moment(value[0]).format('YYYY-MM-DD');
			arr.value[code + 'End'] = Moment(value[1]).format('YYYY-MM-DD');
		} else {
			arr.value[code + 'Start'] = '';
			arr.value[code + 'End'] = '';
		}
	}
}
// 导出功能
export function exportExcel(params: any, service: any, api: any, menuName: any, proxy: any) {
	proxy.$api[service][api](params).then(async (res: any) => {
		const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=UTF-8' });
		const link = document.createElement('a');
		link.style.display = 'none';
		link.href = URL.createObjectURL(blob);
		link.download = menuName + '.xls'; // 这里是文件名
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		proxy.$message.success('导出成功');
	});
}
// 判断是否存在子集url
export function children(menus: any,type:any) {
  let result = "";
  if(menus[0].children.length > 0){
    result = children(menus[0].children,'')
  }else{
    result = menus[0].menuUrl
    store.commit('menu/MUT_SetMenuvisitedViews', result);
  }
  return result
}
let redirect = ''
// 判断是否存在子集url（拼接式）
export function childrenStr(menus: any,type:any) {
  if(menus[0].children && menus[0].children.length > 0){
    if(type == 1){
      redirect = ''
      redirect  = redirect + menus[0].path
    }else{
      redirect  = redirect + '/' + menus[0].path
    }
    childrenStr(menus[0].children,'')
  }else{
    redirect  = redirect + '/' + menus[0].path
  }
  return redirect
}
// 判断url是否是http或https
export function isHttp(url:any) {
  return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
}
// 匹配views里面所有的.vue文件
const viewsModules: any = require.context('../views/',true,/\.vue$/);
const dynamicViewsModules = Object.assign({},{ ...viewsModules });
export const loadView = (view:string,type:any) => {
  if(type === 1){
    return () => import('@/views/index.vue')
  }else {
    let res
    for (const path in dynamicViewsModules.keys()) {
      const dir = dynamicViewsModules.keys()[path].split('./')[1].split('.vue')[0]
      if (dir === view) {
        res = () => require.ensure([],(require) => require(`@/views/${dir}.vue`))
      }
    }
    return res
  }
}
// 全局通信事件方法
const emitter: Emitter<MittType> = mitt<MittType>();
// 导出
export default emitter;
