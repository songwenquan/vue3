/* * @Author: wqsong2 * @Date: 2023/11/13 19:10 * @Desciption:公共配置 左侧列表 */
<template>
	<el-menu
		ref="ELMENU"
		class="scmp-menu"
		:mode="mode"
		:collapse="isCollapse"
		:default-active="activeMenu"
		:collapse-transition="false"
		@select="handleSelect"
	>
		<!-- 使用 url 作为 key值，而不是使用 id， base-path 用于后面拼接 url-->
		<SubMenu
			:isCollapse="isCollapse"
			v-for="menuItem in filteredNavs"
			:key="menuItem.id + menuItem.menuUrl"
			:sub="menuItem"
			:base-path="menuItem.menuUrl"
		></SubMenu>
	</el-menu>
</template>

<script setup lang="ts">
import { toRefs, reactive, computed, watch, ref } from 'vue';
import SubMenu from '@/components/menu-left/subMenu.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const props = defineProps({
	menuArray: {
		type: Array,
		default: () => [],
	},
	mode: {
		type: String,
		default: 'vertical',
	},
	isCollapse: {
		type: Boolean,
		default: false,
	},
	activeIdx: {
		type: String,
		default: '',
	},
});
const { activeIndex } = toRefs(
	reactive({
		activeIndex: '',
	})
);
// 监听
const ELMENU = ref(null);
watch(
	() => props.activeIdx,
	(newValue) => {
		activeIndex.value = newValue;
		(ELMENU.value as any).activeIndex = activeIndex;
	}
);
// 菜单列表处理
const filteredNavs = computed(() => {
	return filterNavs(props.menuArray);
});
// 计算当前激活的叶子节点
const activeMenu = computed(() => {
	const { meta, path } = route;
	const activePath = path;
	if (meta.activeMenu) {
		return meta.activeMenu;
	}
	return activePath;
});
// 过滤隐藏菜单
const filterNavs = (menuArray: any) => {
	return menuArray.filter((nav: any) => {
		const children = nav.children;
		if (children && children.length) {
			nav.children = filterNavs(children);
		}
		if (nav.meta) {
			return !nav.meta.hidden;
		} else {
			return true;
		}
	});
};
// 路由点击处理   // indexPath, item
const emit = defineEmits(['nav-item-select']);
const handleSelect = (index: any) => {
	if (index === 'collapse') return;
	let item: any = '';
	if (index) {
		item = findItemByUrl(props.menuArray, index, {});
	}
	activeIndex.value = index;
	emit('nav-item-select', index, item.openType);
};
const findItemByUrl = (array: any, url: any, matchLast: any) => {
	for (let i = 0; i < array.length; i++) {
		if (url.indexOf(array[i].menuUrl) > -1) {
			if (!matchLast.url || matchLast.url.length < array[i].menuUrl.length) {
				matchLast = array[i];
			}
		}
		if (array[i].children && array[i].children.length > 0) {
			const item = findItemByUrl(array[i].children, url, matchLast);
			if (!matchLast.url || matchLast.url.length < item.menuUrl.length) {
				matchLast = item;
			}
		}
	}
	return matchLast;
};
</script>

<style scoped lang="scss">
.scmp-menu {
}
</style>
