/*
 * @Author: wqsong2
 * @Date: 2023/10/13 17:22
 * @Desciption::页面布局类型
 */
const lyMap: any = {
	// th: 头部高度、fh: 尾部高度、sow:侧边栏展开宽度、scw: sideNav collapsed width
	TLR: { th: 60, fh: 40, sow: 200, scw: 40 },
	// 折叠 54px 下，默认图标居中
	LR: { th: 50, fh: 40, sow: 200, scw: 54 },
	TCB: { th: 60, fh: 40, sow: 0, scw: 0 },
};
export interface stateAppLayout {
	layout: string;
}
export const intialState: stateAppLayout = {
	layout: '', // TCB 左侧列表布局   TCB-TOP 顶部菜单列表布局  CUSTOM 布局
};

export default {
	state: {
		layout: intialState.layout,
	},
	getters: {
		isSidebarOpend: (state: any) => state.sidebar.opened,
		layout: (state: any) => state.layout,
		th: (state: any, getters: any) => lyMap[getters.layout].th,
		fh: (state: any, getters: any) => lyMap[getters.layout].fh,
		sw: (state: any, getters: any) => (getters.isSidebarOpend ? lyMap[getters.layout].sow : lyMap[getters.layout].scw),
	},
	actions: {
		ACT_ToggleSideBar({ commit }: { commit: any }) {
			commit('MUT_ToggleSideBar');
		},
		ACT_CloseSideBar({ commit }: { commit: any }, { withoutAnimation }: { withoutAnimation: any }) {
			commit('MUT_CloseSideBar', withoutAnimation);
		},
		ACT_ToggleDevice({ commit }: { commit: any }, device: any) {
			commit('MUT_ToggleDevice', device);
		},
	},
	mutations: {
		MUT_ToggleSideBar: (state: any) => {
			state.sidebar.opened = !state.sidebar.opened;
			state.sidebar.withoutAnimation = false;
		},
		MUT_CloseSideBar: (state: any, withoutAnimation: any) => {
			state.sidebar.opened = false;
			state.sidebar.withoutAnimation = withoutAnimation;
		},
		MUT_ToggleDevice: (state: any, device: any) => {
			state.device = device;
		},
		MUT_SetLayout: (state: any, val: string) => {
			state.layout = val.toString();
		},
	},
};
