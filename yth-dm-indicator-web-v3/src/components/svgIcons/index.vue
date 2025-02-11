/* * @Author: wqsong2 * @Date: 2023/11/6 17:03 * @Desciption:svg图标组件 */
<template>
	<svg aria-hidden="true" :width="width" :height="height" :class="svgClass"
       :style="{'margin-right': show ? '15px' : '0px'}">
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
		default: '',
	},
	width: {
		type: String,
		default: '14',
	},
	height: {
		type: String,
		default: '14',
	},
  show:{
    type: Boolean,
    default: false,
  }
});
const iconName = computed(() => {
	return `#icon-${props.iconClass}`
});
const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`
  }
  return 'svg-icon'
})
</script>

<style scoped lang="scss">
.svg-icon{
  fill: currentColor;
}
</style>
