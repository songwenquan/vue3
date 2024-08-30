/* * @Author: wqsong2 * @Date: 2023/11/29 17:30 * @Desciption:列表公共头部 */
<template>
	<div class="tableTitle mb10">
		<span class="table-title flex">
			<div class="line mr10"></div>
			{{ matched.menuName }}列表
		</span>
		<div v-if="showRightBtn" class="right-btn" @click="$emit('rightBtnClick')">
			<slot name="rightBtn"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
const props = defineProps({
	matched: {
		// 附加入参
		type: Object,
		default: () => {
			return {};
		},
	},
	showRightBtn: {
		type: Boolean,
		default: false,
	},
});
const { matched, showRightBtn } = toRefs(props);
</script>

<style scoped lang="scss">
.tableTitle {
	display: flex;
	justify-content: space-between;
	line-height: 30px;
	.table-title {
		align-items: center;
		.line {
			width: 4px;
			height: 18px;
			border-radius: 3px;
			background-color: dodgerblue;
		}
	}
}
</style>
