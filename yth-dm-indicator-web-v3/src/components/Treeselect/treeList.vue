/* * @Author: wqsong2 * @Date: 2023/12/1 15:00 * @Desciption:树列表 */
<template>
	<div class="treeList">
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
			:check-strictly="checkStrictly"
			:show-checkbox="showCheckbox"
			@check="handleCheckChange"
			:check-on-click-node="checkOnClickNone"
			:default-checked-keys="checkedKeys"
		>
			<template #default="{ node }">
				<span class="custom-tree-node ell cursor-p">
					<span :title="node.label">{{ node.label }}</span>
				</span>
			</template>
		</el-tree>
	</div>
</template>

<script setup lang="ts">
import { toRefs, reactive, getCurrentInstance, ref } from 'vue';
import { ElTree } from 'element-plus';
const { proxy } = getCurrentInstance() as any; // this
interface Tree {
	[key: string]: any;
}
const props = defineProps({
	departmentData: {
		type: Function || Array,
		default: null,
	},
	getChildListFunc: {
		type: Function,
		default: null,
	},
	// 是否显示复选框
	showCheckbox: {
		type: Boolean,
		default: false,
	},
	// 是否父子关联
	checkStrictly: {
		type: Boolean,
		default: false,
	},
	// 是否在点击节点的时候选中节点
	checkOnClickNone: {
		type: Boolean,
		default: false,
	},
	// 回显选中
	checkedKeys: {
		type: Array,
		default: () => [],
	},
});
const { treeList, defaultProps } = toRefs(
	reactive({
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
const treeRef = ref<InstanceType<typeof ElTree>>();
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
			} else {
				resolve([]);
			}
		} else {
			resolve(props.departmentData);
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
	} else {
		resolve([]);
	}
};
// 根据文字进行过滤
const filterNode = (value: string, data: Tree) => {
	if (!value) return true;
	return data.areaName.includes(value);
};
// 树点击选中功能
const onCurrentChange = (val: any, node: any) => {
	console.log('树点击选中功能', val, node);
};
// 点击节点复选框之后触发
const handleCheckChange = (checkedNodes: any, checkedKeys: any) => {
	console.log('点击节点复选框之后触发', checkedNodes, checkedKeys);
};
</script>

<style scoped lang="scss">
.treeList {
}
</style>
