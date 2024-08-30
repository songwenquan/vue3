/* * @Author: wqsong2 * @Date: 2023/11/9 15:50 * @Desciption:通用头部 */
<template>
	<div class="header ml30 flex">
		<slot name="icon"></slot>
		<slot name="text"></slot>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.header {
	max-width: 400px;
	justify-content: center;
	align-items: center;
}
</style>
