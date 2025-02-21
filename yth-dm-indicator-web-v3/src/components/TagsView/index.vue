/* * @Author: wqsong2 * @Date: 2024/7/12 18:07 * @Desciption:已点击菜单列表 */
<template>
	<div id="tags-view-container" class="tags-view-container bf mb10">
		<el-scrollbar ref="scrollPaneRef" class="tags-view-wrapper cursor-p bf fz12">
			<router-link
				class="tags-view-item ml5 mt5"
				v-for="(tag, index) in visitedViews"
				:key="tag.menuUrl"
				:data-path="tag.menuUrl"
				:class="isActive(tag) ? 'active' : ''"
				:to="{ path: tag.menuUrl, query: tag.query, fullPath: tag.fullPath }"
				:style="activeStyle(tag)"
				@click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
				@contextmenu.prevent="openMenu(tag, $event, index)"
			>
				{{ tag.meta?.title }}
				<span v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)">
					<close class="el-icon-close" style="width: 1em; height: 1em; vertical-align: middle" />
				</span>
			</router-link>
		</el-scrollbar>
		<ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
			<li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)"><close style="width: 1em; height: 1em" /> 关闭当前</li>
			<li @click="closeOthersTags"><circle-close style="width: 1em; height: 1em" /> 关闭其他</li>
			<li v-if="isFirstView" @click="closeLeftTags"><back style="width: 1em; height: 1em" /> 关闭左侧</li>
			<li v-if="isLastView" @click="closeRightTags"><right style="width: 1em; height: 1em" /> 关闭右侧</li>
			<li @click="closeAllTags()"><circle-close style="width: 1em; height: 1em" /> 全部关闭</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { reactive, toRefs, getCurrentInstance, watch } from 'vue';
import { useStoreMutations, useStoreState } from '@/store/vuex';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
const { visitedViews } = toRefs(reactive(useStoreState('menu', ['visitedViews'])));
const { MUT_DeleteMenuvisitedViews } = useStoreMutations('menu', ['MUT_DeleteMenuvisitedViews']);
const { theme } = toRefs(reactive(useStoreState('app', ['theme'])));
const { proxy } = getCurrentInstance();
const { visible, name, url, left, top, selectedTag, isFirstView, isLastView, tagIndex } = toRefs(
	reactive({
		visible: false,
		name: '',
		url: '',
		left: 0,
		top: 0,
		selectedTag: {},
		isFirstView: false,
		isLastView: false,
		tagIndex: '',
	})
);
// 判断当前path是否相同url path
const isActive = (r: any) => {
	return r.menuUrl === route.path;
};
// 获取按钮选中颜色
const activeStyle = (tag: any) => {
	if (!isActive(tag)) {
		return {};
	} else {
		return {
			'background-color': theme.value,
			'border-color': theme.value,
		};
	}
};
// 关闭当前tab
const closeSelectedTag = (view: any) => {
	MUT_DeleteMenuvisitedViews(view.menuUrl);
	let query = null;
	if (visitedViews.value[0].query && Object.keys(visitedViews.value[0].query).length !== 0) {
		query = JSON.parse(visitedViews.value[0].query);
	}
	if (visitedViews.value.length === 0) {
		router.push({ path: '/' });
	} else {
		router.push({
			path: visitedViews.value[0].menuUrl,
			query: query,
		});
	}
};
// 关闭其他
const closeOthersTags = () => {
	visitedViews.value.forEach((item) => {
		MUT_DeleteMenuvisitedViews(item.menuUrl);
	});
	router.push({
		path: selectedTag.value.menuUrl,
		query: selectedTag.value.query ? JSON.stringify(selectedTag.value.query) : undefined,
	});
};
// 全部关闭
const closeAllTags = () => {
	visitedViews.value.forEach((item) => {
		MUT_DeleteMenuvisitedViews(item.menuUrl);
	});
	router.push({ path: '/' });
};
// 关闭左侧
const closeLeftTags = () => {
	const indexs = visitedViews.value.findIndex((v) => v.menuUrl === router.currentRoute.value.path);
	let query;
	let url = visitedViews.value[tagIndex.value].menuUrl;
	if (visitedViews.value[tagIndex.value].query && Object.keys(visitedViews.value[tagIndex.value].query).length !== 0) {
		query = JSON.parse(visitedViews.value[tagIndex.value].query);
	}
	visitedViews.value.forEach((item, index) => {
		if (index < tagIndex.value) {
			MUT_DeleteMenuvisitedViews(item.menuUrl);
			if (indexs < tagIndex.value) {
				router.push({
					path: url,
					query: query,
				});
			}
		}
	});
};
// 关闭右侧
const closeRightTags = () => {
	const indexs = visitedViews.value.findIndex((v) => v.menuUrl === router.currentRoute.value.path);
	let query;
	let url = visitedViews.value[tagIndex.value].menuUrl;
	visitedViews.value.forEach((item, index) => {
		if (index > tagIndex.value) {
			MUT_DeleteMenuvisitedViews(item.menuUrl);
			if (indexs > tagIndex.value) {
				router.push({
					path: url,
					query: query,
				});
			}
		}
	});
};
const $closePage = () => {
	MUT_DeleteMenuvisitedViews(router.currentRoute.value.path);
	let query = null;
	if (visitedViews.value[visitedViews.value.length - 1].query && Object.keys(visitedViews.value[visitedViews.value.length - 1].query).length !== 0) {
		query = JSON.parse(visitedViews.value[visitedViews.value.length - 1].query);
	}
	if (visitedViews.value.length === 0) {
		router.push({ path: '/' });
	} else {
		router.push({
			path: visitedViews.value[visitedViews.value.length - 1].menuUrl,
			query: query,
		});
	}
};
// 是否支持删除
const isAffix = (tag: any) => {
	return tag.meta && tag.meta.affix;
};
const openMenu = (tag, e, index) => {
	left.value = e.clientX - proxy.$el.getBoundingClientRect().left + 20;
	top.value = e.clientY - proxy.$el.getBoundingClientRect().top + 10;
	visible.value = true;
	isFirstView.value = false;
	isLastView.value = false;
	selectedTag.value = tag;
	if (visitedViews.value.length !== 1) {
		if (index == 0) {
			isLastView.value = true;
		} else if (index == visitedViews.value.length - 1) {
			isFirstView.value = true;
		} else {
			isFirstView.value = true;
			isLastView.value = true;
		}
	}
	tagIndex.value = index;
};
watch(visible, (value) => {
	if (value) {
		document.body.addEventListener('click', closeMenu);
	} else {
		document.body.removeEventListener('click', closeMenu);
	}
});
const closeMenu = () => {
	visible.value = false;
};
window.$closePage = $closePage;
</script>

<style scoped lang="scss">
a {
	text-decoration: none;
}
.active {
	background: linear-gradient(90deg, #1677ff, #01a6ff) !important;
	border: none !important;
}
.tags-view-container {
	display: flex;
	align-items: center;
	position: relative;
	min-height: 40px;
	line-height: 40px;
	box-shadow:
		0 1px 3px 0 rgba(0, 0, 0, 0.12),
		0 0 3px 0 rgba(0, 0, 0, 0.04);
	.tags-view-wrapper {
		flex: 1;
		.tags-view-item {
			display: inline-block;
			position: relative;
			height: 26px;
			line-height: 26px;
			border: 1px solid #d8dce5;
			color: #495060;
			padding: 0 8px;
			&:first-of-type {
				margin-left: 15px;
			}
			&:last-of-type {
				margin-right: 15px;
			}
			&.active {
				color: #fff;
				&::before {
					content: '';
					background: #fff;
					display: inline-block;
					width: 8px;
					height: 8px;
					border-radius: 50%;
					position: relative;
					margin-right: 2px;
				}
			}
		}
	}
	.contextmenu {
		margin: 0;
		background: #fff;
		z-index: 3000;
		position: absolute;
		list-style-type: none;
		padding: 5px 0;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 400;
		color: #333;
		box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
		li {
			margin: 0;
			padding: 0px 16px;
			cursor: pointer;
			&:hover {
				background: #eee;
			}
		}
	}
}
</style>
