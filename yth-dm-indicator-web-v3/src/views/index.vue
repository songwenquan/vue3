/* * @Author: wqsong2 * @Date: 2023/11/8 18:12 * @Desciption:总路由 */
<template>
	<div class="index flex-col main-wrap">
    <!--菜单序列-->
    <TagsView v-if="noTagsView" />
    <!--菜单导航-->
		<breadcrumb v-if="nobread" />
		<div class="view-wrap border-box" :class="{ 'nobread': nobread,'noTagsView':noTagsView }">
			<router-view v-slot="{ Component }">
				<!--需要缓存的页面-->
				<keep-alive>
					<component :is="Component" :key="$route.fullPath" v-if="$route.meta.keepAlive"></component>
				</keep-alive>
				<!--不需要缓存的页面-->
				<component :is="Component" :key="$route.fullPath" v-if="!$route.meta.keepAlive"></component>
			</router-view>
		</div>
	</div>
</template>

<script setup lang="ts">
import breadcrumb from '@/components/bread-crumb/index.vue';
import TagsView from '@/components/TagsView/index.vue';
import { onMounted, getCurrentInstance, reactive, toRefs, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
const { proxy } = getCurrentInstance() as any; // this
const router = useRouter();
const { noTagsView, nobread } = toRefs(
	reactive({
    noTagsView:false as boolean,
		nobread: false as boolean, // 是否展示面包屑
	})
);

watchEffect(() => {
	console.log('路由---', router.currentRoute.value);
	// 根据路由配置是否展示面包屑
	if (router.currentRoute.value.meta && router.currentRoute.value.meta.nobread === true) {
		nobread.value = true;
	} else {
		nobread.value = false;
	}
  if (router.currentRoute.value.meta && router.currentRoute.value.meta.noTagsView === true) {
    noTagsView.value = true;
  } else {
    noTagsView.value = false;
  }
});
onMounted(() => {
	// 根据路由配置是否展示面包屑
	if (proxy.$route.meta && proxy.$route.meta.nobread === true) {
		nobread.value = true;
	} else {
		nobread.value = false;
	}
  if (proxy.$route.meta && proxy.$route.meta.noTagsView === true) {
    noTagsView.value = true;
  } else {
    noTagsView.value = false;
  }
});
</script>

<style scoped lang="scss">
.index {
  width: 100%;
  .noTagsView.nobread{
    height: calc(100% - 120px) !important;
    overflow: auto;
  }
  .noTagsView{
    height: calc(100% - 60px);
    overflow: auto;
  }
  .nobread{
    height: calc(100% - 70px);
    overflow: auto;
  }
  .view-wrap{
    height: 100%;
    overflow: auto;
  }
}
</style>
