<template>
	<el-config-provider :locale="getGlobalI18n">
		<div v-cloak id="app">
			<component :is="layouts[layout]" />
		</div>
	</el-config-provider>
</template>
<script lang="ts" setup>
import { reactive, toRefs, computed, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStoreState } from '@/store/vuex';
const layouts: any = {
	CUSTOM: defineAsyncComponent(() => import('@/layouts/BL-CUSTOM.vue')),
	TCB: defineAsyncComponent(() => import('@/layouts/BL-TCB.vue')),
};
// 获取全局 i18n
const { messages, locale } = useI18n();
const getGlobalI18n = computed(() => {
	return messages.value[locale.value];
});
const { layout } = toRefs(reactive(useStoreState('layout', ['layout'])));
</script>
<style lang="scss"></style>
