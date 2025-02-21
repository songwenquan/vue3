/* * @Author: wqsong2 * @Date: 2023/11/22 15:30 * @Desciption:搜索条件 name:名字 code:字段 span:宽度 type:组件类型 dictkey:当前搜索条件字典key
func:自定义方法 placeholder:默认提示 * @Desciption:departmentData:tree组件的初始一级数据 getChildListFunc:tree组件的下级数据 keyValue:部门的name
code映射字段 * @type 1.文本框 2.下拉框 3.部门tree 4.时间范围 */
<template>
	<div class="searchForm bf mb15 flex">
		<el-form ref="editForm" :model="searchForm" :label-width="labelWidth" class="adv-search-form">
			<el-row>
				<el-col v-for="(item, index) in list" :span="item.span || 8" :key="index">
					<el-form-item :label="item.name + ':'" v-if="item.type === 1">
						<el-input :placeholder="item.placeholder || '请输入'" v-model="searchForm[item.code]"></el-input>
					</el-form-item>
					<el-form-item :label="item.name + ':'" v-if="item.type === 2">
						<el-select v-model="searchForm[item.code]" :multiple="item.multiple || false" :placeholder="item.placeholder || '请选择'" clearable>
							<el-option
								:label="item.label"
								:value="item.value"
								v-for="(item, index) in item.dictList ? item.dictList : dictGetter(item.dictKey)"
								:key="index"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="item.name + ':'" v-if="item.type === 3">
						<Treeselect
							v-model:searchForm="searchForm"
							:departmentData="item.data"
							:getChildListFunc="item.dataChild"
							:keyValue="item.keyValue"
							:placeholder="item.placeholder || '请选择'"
							@change="valChange($event, item.func, item.keyValue)"
						></Treeselect>
					</el-form-item>
					<el-form-item :label="item.name + ':'" v-if="item.type === 4">
						<el-date-picker
							v-model="searchForm[item.code]"
							type="daterange"
							@change="valChange($event, item.func, item.code)"
							:clearable="true"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:disabled-date="item.disabledDate"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item :label="item.name + ':'" v-if="item.type === 'slot'">
						<slot name="slot" :item="item" :searchForm="searchForm"></slot>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div class="search-bar-btns mb20 ml10">
			<el-button class="wide-btn" type="primary" @click="onSearch">查询</el-button>
			<el-button @click="resetForm">清除</el-button>
			<div v-if="moreButton" class="fz14 tc">
				<div class="button mt10 cursor-p" v-if="advancedSearch" @click="advancedSearch = !advancedSearch">
					高级搜索<el-icon style="top: 3px"><ArrowDown /></el-icon>
				</div>
				<div class="button mt10 cursor-p" v-else @click="advancedSearch = !advancedSearch">
					收起<el-icon style="top: 3px"><ArrowUp /></el-icon>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { toRefs, reactive, watch } from 'vue';
import { useStoreGetters } from '@/store/vuex';
import Treeselect from '@/components/Treeselect/index.vue';
const props = defineProps({
	// 搜索条件list
	list: {
		type: Array,
		default: () => {
			return [
				{
					disabledDate: Boolean,
				},
			];
		},
	},
	// 高级查询条件是否显示
	moreButton: {
		type: Boolean,
		default: false,
	},
	labelWidth: {
		type: String,
		default: '100px',
	},
	// 数据二次处理
	Initialize: {
		type: Function,
	},
});
const { list } = toRefs(props);

const { searchForm, advancedSearch } = toRefs(
	reactive({
		searchForm: {},
		advancedSearch: true,
	})
);
// 监听
watch(
	() => list.value,
	(newValue) => {
		newValue.forEach((item: any) => {
			(searchForm as any).value[item.code] = item.value || null;
		});
		if (props.Initialize) {
			props.Initialize(searchForm.value);
		}
	},
	{ deep: true, immediate: true }
);
// 调用store-dictList-getter获取方法
const storeGetter = useStoreGetters('dictList', ['dictGetter']);
// 获取字典
const dictGetter = (value: any) => {
	return storeGetter.dictGetter.value[value];
};
// 数值变化调用回调方法
const valChange = (nodes: any, callback: any, code: any) => {
	callback(nodes, searchForm, code);
};
// 查询
const emit = defineEmits(['search', 'update:list']);
const onSearch = () => {
	emit('search', searchForm);
};
// 清空
const resetForm = () => {
	for (const key in searchForm.value) {
		if (Object.hasOwnProperty.call(searchForm.value, key)) {
			(searchForm as any).value[key] = null;
		}
	}
};
// list有源value数据时 修改searchForm时候必须触发updatelist同步修改数据源！！！！！
watch(
	() => searchForm.value,
	(newValue) => {
		emit('update:list', newValue);
	},
	{ deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
.searchForm {
	box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
	box-sizing: border-box;
	padding: 27px 10px 9px 10px;
	align-items: flex-start;
	.el-form {
		flex: 1;
	}
	.button {
		color: #0079fe;
	}
	:deep(.el-form-item__content) {
		height: 32px;
	}
}
</style>
