/* * @Author: wqsong2 * @Date: 2023/12/1 15:02 * @Desciption: */
<template>
	<div class="completion list-wrap">
		<div @click="one('1'), two('2'), selectMenuItem('1')">{{ TBGBSXLX1('TBGBSXLX') }}{{ dataMap.msg }}</div>
		<el-select v-model="value" multiple filterable allow-create default-first-option :reserve-keyword="false" collapse-tags>
			<el-option v-for="item in options.list" :key="item.value" :label="item.label" :value="item.value">
				<span style="float: left" class="span-style">{{ item.label }}</span>
				<span style="float: right" class="span-style-delete" @click="editItem(item, $event)"
					><el-icon><Edit /></el-icon
				></span>
			</el-option>
		</el-select>
		<tree-list
			:departmentData="ssqdFunc"
			:showCheckbox="true"
			:checkStrictly="true"
			:getChildListFunc="getChildListFunc"
			:checkedKeys="['20221014113629002-EB8D-524B7E147', '20220616094202030-2583-07C24CDAB', '20221014114015660-2FB8-3AB32CB3A']"
		>
		</tree-list>
	</div>
</template>
<script setup lang="ts">
import { getCurrentInstance, reactive, ref, watch } from 'vue';
import { useStoreActions, useStoreGetters } from '@/store/vuex';
import TreeList from '@/components/Treeselect/treeList.vue';
const { proxy } = getCurrentInstance() as any; // this
// 调用store-dictList-getter获取当前需要值
const storeGetter = useStoreGetters('dictList', ['dictGetter']);
const TBGBSXLX1 = (value: any) => {
	return storeGetter.dictGetter.value[value];
};
const dataMap = reactive<any>({
	msg: '1',
});
const value = ref<string[]>([]);
const options = reactive(<any>{ list: [] });
watch(value, (newValue) => {
	options.list = [];
	newValue.map((item) => {
		options.list.push({ value: item, label: item });
	});
});
const one = (value: any) => {
	dataMap.msg = 2;
	console.log(value);
};
const two = (value: any) => {
	one(value);
};
const editItem = (item: any, event: Event) => {
	console.log(item);
	event.stopPropagation();
};
// 链接跳转
const menuList = useStoreActions('menu', ['ACT_SelectMenuItem']);
const selectMenuItem = (value: any) => {
	menuList.ACT_SelectMenuItem(value);
};
// 调用store-dictList-actions接口获取当前页面依赖字典值
const storeActions = useStoreActions('dictList', ['getDicListStr']);
storeActions.getDicListStr({ url: 'dicts', type: 'TBGBSXLX' });

const ssqdFunc = async () => {
	return await proxy.$api.warningManagement.getOrgListByParentId({ pCode: '', pId: '' }).then((res: any) => {
		if (res.flag) {
			return res.data;
		} else {
			proxy.$message.error(res.errMsg);
			return [];
		}
	});
};
const getChildListFunc = async (node: any) => {
	return await proxy.$api.warningManagement.getOrgListByParentId({ pCode: node.data.code, pId: node.data.id }).then((res: any) => {
		if (res.flag) {
			return res.data;
		} else {
			return [];
			proxy.$message.error(res.errMsg);
		}
	});
};
</script>

<style scoped lang="scss">
.completion {
}
</style>
