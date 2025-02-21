/* * @Author: wqsong2 * @Date: 2023/11/8 18:14 * @Desciption:面包屑导航 */
<template>
	<div class="breadCrumb fw-b bf mb20">
		<el-breadcrumb class="app-breadcrumb border-box shadow-box fz15 pl30" separator-class="el-icon-arrow-right">
			<transition-group name="breadcrumb">
				<el-breadcrumb-item v-for="(item, index) in levelList" :key="`${index}${item.menuName}`">
					<span v-if="index === levelList.length - 1" class="no-redirect">{{ matched.menuName }}</span>
					<span v-else class="bread-f cursor-p" @click="handleLink(item)">{{ item.menuName }}</span>
				</el-breadcrumb-item>
			</transition-group>
		</el-breadcrumb>
	</div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue';
import { useStoreState } from '@/store/vuex';
import { useRoute, useRouter } from 'vue-router';
import * as pathToRegexp from 'path-to-regexp';
const route = useRoute();
const router = useRouter();
// 获取menu store-state-levelList store-state-matched
const { levelList, matched } = toRefs(reactive(useStoreState('menu', ['levelList', 'matched'])));
const pathCompile = (path: any) => {
	const { params } = route;
	const toPath = pathToRegexp.compile(path);
	return toPath(params);
};
const handleLink = (item: any) => {
	const { redirect, menuUrl } = item;
	if (redirect) {
		router.push({ path: redirect });
	}
	router.push({ path: pathCompile(menuUrl) });
};
</script>

<style scoped lang="scss">
.breadCrumb {
	width: 100%;
	height: 50px;
	box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
	box-sizing: border-box;
	margin-bottom: 16px;
	.app-breadcrumb {
		line-height: 50px;
		.bread-f {
			color: #0462f0;
		}
	}
}
</style>
