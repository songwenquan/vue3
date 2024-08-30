/* * @Author: wqsong2 * @Date: 2023/11/1 17:26 * @Desciption:主页面结构配置无头部 侧边栏 */
<template>
	<div class="BL-CUSTOM">
		<el-main class="main">
			<router-view v-slot="{ Component }" v-if="flag">
				<!--需要缓存的页面-->
				<keep-alive>
					<component :is="Component" :key="$route.fullPath" v-if="$route.meta.keepAlive"></component>
				</keep-alive>
				<!--不需要缓存的页面-->
				<component :is="Component" :key="$route.fullPath" v-if="!$route.meta.keepAlive"></component>
			</router-view>
		</el-main>
	</div>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const flag = ref(true);
// 路由监听 浏览器后退BUG
watch(
	() => router.currentRoute.value,
	(newValue: any) => {
		if (newValue.meta.fullScreen !== 'CUSTOM') {
			flag.value = false;
		} else {
			flag.value = true;
		}
	},
	{ immediate: true }
);
</script>

<style scoped lang="scss">
.BL-CUSTOM {
	height: 100vh;
	:deep(.el-main) {
		padding: 0px;
		height: 100%;
	}
}
</style>
