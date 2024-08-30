/* * @Author: wqsong2 * @Date: 2023/11/23 16:39 * @Desciption:树形下拉选择框 departmentData初始化一级数据可支持function和Array数组 */
<template>
	<el-popover placement="bottom-start" popper-style="width:80%;height:200px;overflow-y:auto" trigger="click" :teleported="false">
		<div class="tree-editor-dialog__popover">
			<div class="tree-select-input">
				<el-input placeholder="请输入关键字查询" v-model="keywords" :prefix-icon="Search" :maxlength="200" />
			</div>
			<el-tree
				ref="treeRef"
				class="vue-tree"
				:data="treeList"
				lazy
				:highlight-current="true"
				:expand-on-click-node="false"
				:props="defaultProps"
				:load="loadNode"
				:filter-node-method="filterNode"
				node-key="id"
				@current-change="onCurrentChange"
			>
				<template #default="{ node }">
					<span class="custom-tree-node ell cursor-p">
						<span :title="node.label">{{ node.label }}</span>
					</span>
				</template>
			</el-tree>
		</div>
		<template #reference>
			<el-input placeholder="请选择" readonly :disabled="disabled" v-model="localValue">
				<template #suffix>
					<el-icon class="el-input__icon" @click.stop="clear" v-if="localValue && !disabled"><Close /></el-icon>
				</template>
			</el-input>
		</template>
	</el-popover>
</template>
<script setup lang="ts">
import { toRefs, reactive, watch, getCurrentInstance, ref, nextTick } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElTree } from 'element-plus';
import { last } from 'lodash';
interface Tree {
	[key: string]: any;
}
const { proxy } = getCurrentInstance() as any; // this
const props = defineProps({
	placeholder: {
		type: String,
		default: '',
	},
	keyValue: {
		type: Array,
		default() {
			return [];
		},
	},
	searchForm: {
		type: Object,
		default() {
			return {};
		},
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	departmentData: {
		type: Function || Array,
		default: null,
	},
	getChildListFunc: {
		type: Function,
		default: null,
	},
});
const { searchForm, disabled, keyValue } = toRefs(props);
const { localValue, keywords, treeList, defaultProps } = toRefs(
	reactive({
		localValue: null,
		keywords: '',
		treeList: [],
		defaultProps: {
			id: 'id',
			code: 'code',
			label: 'areaName',
			children: 'children',
			isLeaf: 'hasChild',
		},
	})
);
watch(
	() => searchForm.value,
	(newValue) => {
		(localValue as any).value = last([newValue[(keyValue as any).value[1]]]);
		// 根据默认ID进行高亮
		nextTick(() => {
			(treeRef as any).value.setCurrentKey(last([searchForm.value[(keyValue as any).value[0]]]));
		});
	},
	{ deep: true, immediate: true }
);
// 根据输入框文字进行过滤
const treeRef = ref<InstanceType<typeof ElTree>>();
watch(keywords, (val) => {
	(treeRef as any).value.filter(val);
});
const filterNode = (value: string, data: Tree) => {
	if (!value) return true;
	return data.areaName.includes(value);
};
// 懒加载
const loadNode = async (node: any, resolve: any) => {
	if (node.level === 0) {
		return treeGetList(resolve);
	}
	if (node.level >= 1) {
		return getChildList(node, resolve);
	}
};
// 初始化数据
const treeGetList = async (resolve: any) => {
	if (props.departmentData) {
		if (typeof props.departmentData === 'function') {
			const data = await props.departmentData();
			if (data && data.length > 0) {
				resolve([
					{
						areaName: data[0].name,
						id: data[0].id,
						code: data[0].code,
						children: null,
					},
				]);
				nextTick(() => {
					(treeRef as any).value?.setCurrentKey(last([searchForm.value[(keyValue as any).value[0]]]));
				});
			} else {
				resolve([]);
			}
		} else {
			resolve(props.departmentData);
			nextTick(() => {
				(treeRef as any).value?.setCurrentKey(last([searchForm.value[(keyValue as any).value[0]]]));
			});
		}
	} else {
		resolve([]);
	}
};
// 子级数据
const getChildList = async (node: any, resolve: any) => {
	let data = [];
	if (props.getChildListFunc && typeof props.getChildListFunc === 'function') {
		data = await props.getChildListFunc(node);
	} else {
		data = await proxy.$api.warningManagement.getOrgListByParentId({ pCode: node.data.code, pId: node.data.id }).then((res: any) => {
			if (res.flag) {
				return res.data;
			} else {
				return [];
				proxy.$message.error(res.errMsg);
			}
		});
	}
	if (data && data.length > 0) {
		const dataResolve: any = [];
		data.map((item: any) => {
			dataResolve.push({
				areaName: item.name,
				id: item.id,
				code: item.code,
				hasChild: !(item.orgType == '1'),
				children: null,
			});
		});
		resolve(dataResolve);
		const val = searchForm.value[(keyValue as any).value[0]];
		if (dataResolve.findIndex((item: any) => item.id === val) !== -1) {
			// 根据默认ID进行高亮
			nextTick(() => {
				(treeRef as any).value.setCurrentKey(last([searchForm.value[(keyValue as any).value[0]]]));
			});
		}
	} else {
		resolve([]);
	}
};

const emit = defineEmits(['change', 'departmentData']);
// 清除功能
const clear = () => {
	emit('change', {});
};
// 树点击选中功能
const onCurrentChange = (val: any) => {
	emit('change', val);
};
</script>

<style scoped lang="scss">
:deep(.el-input__suffix:hover) {
	cursor: pointer !important;
}
</style>
