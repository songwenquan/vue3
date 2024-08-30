/* * @Author: wqsong2 * @Date: 2023/11/6 17:03 * @Desciption:svg图标组件 */
<template>
	<svg aria-hidden="true" :width="width" :height="height">
		<use :xlink:href="iconName" :fill="color" />
	</svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps({
	iconClass: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		default: '#08bebe',
	},
	width: {
		type: String,
		default: '20',
	},
	height: {
		type: String,
		default: '20',
	},
});
const iconName = computed(() => {
	return props.iconClass;
});
</script>

<style scoped lang="scss"></style>
