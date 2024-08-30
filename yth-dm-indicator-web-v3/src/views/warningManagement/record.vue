/* * @Author: wqsong2 * @Date: 2023/11/14 19:15 * @Desciption:超期受理 */
<template>
	<div class="record">
		<!--搜索-->
		<SearchForm ref="searchForm" :list="list" @update:list="updateList" :more-button="moreButton" :Initialize="Initialize" @search="onSearch">
			<template #slot="scope">
				<el-select v-model="scope.searchForm[scope.item.code]" placeholder="请选择" v-if="scope.item.code === 'serviceObject'" clearable>
					<el-option :label="item.label" :value="item.value" v-for="(item, index) in TBFWDX" :key="index"></el-option>
				</el-select>
			</template>
		</SearchForm>
		<div class="list-wrap">
			<tableTitle :matched="matched" show-right-btn @rightBtnClick="add">
				<template v-slot:rightBtn>
					<el-button type="primary">导出</el-button>
				</template>
			</tableTitle>
			<TableList
				ref="tableList"
				:showExpand="true"
				:key-list="keyList"
				:expandKey="expandKey"
				:multiple="true"
				:border="true"
				:params="params"
				service="warningManagement"
				api="getSsqdPage"
				:btnObj="btnObj"
				:show-index="true"
				:show-page="true"
				row-key="ssqdId"
				@handleClick="handleClick"
				:expandApi="`warningManagement.getSsqdPage`"
				:expandCode="expandCode"
				:handle-data="handleData"
				:expand-handle-data="expandHandleData"
				:handle-row-current-change="handleRowCurrentChange"
			></TableList>
		</div>
	</div>
</template>
<script setup lang="ts">
import { toRefs, reactive, ref, getCurrentInstance, h } from 'vue';
import { time, orgCode, exportExcel } from '@/utils/utils';
import tableTitle from '@/components/table/tableTitle.vue';
import TableList from '@/components/table/tableList.vue';
import SearchForm from '@/components/search-form/index.vue';
import { useStoreActions, useStoreState } from '@/store/vuex';
import _ from 'lodash';

const { proxy } = getCurrentInstance() as any; // this
const ssqdFunc = async () => {
	return await proxy.$api.warningManagement
		.getOrgListByParentId({
			pCode: '',
			pId: '',
		})
		.then((res: any) => {
			if (res.flag) {
				return res.data;
			} else {
				proxy.$message.error(res.errMsg);
				return [];
			}
		});
};
const getChildListFcun = async (node: any) => {
	return await proxy.$api.warningManagement
		.getOrgListByParentId({
			pCode: node.data.code,
			pId: node.data.id,
		})
		.then((res: any) => {
			if (res.flag) {
				return res.data;
			} else {
				return [];
				proxy.$message.error(res.errMsg);
			}
		});
};
const aaaa = (row: any) => {
	console.log(row);
};
const { list, moreButton, params, keyList, btnObj, expandCode, expandKey } = toRefs(
	reactive({
		moreButton: false as boolean, // 是否展示更多按钮
		params: {}, // 搜索参数
		list: [
			{
				code: 'ssqdZoneCode',
				value: '',
				keyValue: ['ssqdZoneCode', 'ssqdZoneName'],
				name: '区划及部门',
				span: 8,
				type: 3,
				func: orgCode,
				data: ssqdFunc,
				dataChild: getChildListFcun,
			},
			{
				code: 'ssqdName',
				name: '事项名称',
				span: 8,
				type: 1,
			},
			{
				code: 'ssqdTypeCode',
				name: '事项类型',
				span: 8,
				type: 2,
				dictKey: 'bjzt',
			},
			{
				code: 'itemType',
				name: '办件类型',
				span: 8,
				type: 2,
				dictList: [],
			},
			{
				code: 'serviceObject',
				name: '服务对象',
				span: 8,
				type: 'slot',
			},
			{
				code: 'receiveTime',
				name: '收件时间',
				span: 8,
				type: 4,
				func: time,
				disabledDate: (time: any) => {
					return time.getTime() > new Date().getTime();
				},
			},
		],
		keyList: [
			{
				name: '事项内码',
				code: 'ssqdId',
				width: '350',
			},
			{
				name: '事项名称',
				code: 'ssqdName',
				width: '200',
			},
			{
				name: '事项类型',
				code: 'serviceObject',
				width: '100',
				format: (key: any, row: any) =>
					row[key] === 'P'
						? '<div class="format">' +
						  '<span style="width:20%;height:29px;background-color: #ff0000;"></span>' +
						  '<span style="width: 75%" class="ell">222231231211</span>' +
						  '</div>'
						: row[key] === 'C'
						? '<div class="format">' +
						  '<span style="width:20%;height:29px;background-color: #ff0000;"></span>' +
						  '<span style="width: 75%" class="ell">row[key]</span>' +
						  '</div>'
						: row[key],
				click: aaaa,
			},
			{
				name: '所属区划',
				code: 'ssqdDeptName',
				render: (item: any) => {
					return h(
						'div',
						{
							class: {
								ell: true,
								'cursor-p': true,
							},
						},
						[
							h(
								'span',
								{
									class: {
										'text-btn': item.row.ssqdDeptName !== '',
									},
									onClick: () => {
										item.row.ssqdDeptName && (tableList.value as any).changeDrawer('特殊程序', 'specialApplyTimes', item.row);
									},
								},
								item.row.ssqdDeptName ? item.row.ssqdDeptName : '1223'
							),
						]
					);
				},
			},
		],
		btnObj: {
			name: '操作',
			width: 100,
			fiexd: false,
			list: [
				{
					name: '人员配置',
					callBackName: 'userConfig',
				},
			],
		}, // 操作按钮
		expandCode: ['ssqdZoneCode'], // 列表展开接口入参
		expandKey: [
			{
				name: '事项内码',
				code: 'ssqdId',
				width: '350',
			},
			{
				name: '事项名称',
				code: 'ssqdName',
			},
		],
	})
);
// 查询
const tableList = ref(null);
const onSearch = () => {
	(tableList.value as any).init();
};
// 处理列表数据
const handleData = (data: any) => {
	return data.rows;
};
const expandHandleData = (item: any) => {
	return item.rows;
};
// 导出
const add = () => {
	const data: any = _.cloneDeep(params);
	const menuName = matched.value.menuName;
	delete data.value.receiveTime;
	delete data.value.acceptTime;
	exportExcel(data.value, 'warningManagement', 'exportPdf', menuName, proxy);
};
// 初始化执行方法
const Initialize = (data: any) => {
	params.value = data;
};
// 数据更新修改list value数据源
const updateList = (data: any) => {
	(list as any).value.forEach((item: any) => {
		item.value = data[item.code];
	});
};
// 操作按钮list
const buttonList = {
	// 人员配置
	userConfig: (item: any) => {
		console.log('操作按钮list' + item);
	},
};
// 当前选中当前行数据
const handleRowCurrentChange = (item: any) => {
	console.log('当前选中当前行数据' + item);
};

// 获取当前页面的列表标题
const { matched } = toRefs(reactive(useStoreState('menu', ['matched'])));

// 调用store-dictList-actions接口获取当前页面依赖字典值
const storeActions = useStoreActions('dictList', ['getDicListStr']);
storeActions.getDicListStr({
	url: 'dicts',
	type: 'TBGBSXLX,TBSXZL,TBFWDX',
});
storeActions.getDicListStr({
	url: 'dictsDelivery',
	type: 'bjzt',
});

// 获取store-dictList-state需要用的字典值
const { TBSXZL, TBFWDX } = toRefs(reactive(useStoreState('dictList', ['TBSXZL', 'TBFWDX'])));
(list as any).value.find((item: any) => item.code === 'itemType').dictList = TBSXZL;

// 初始化获取用户当前所属的部门code和name
proxy.$api.warningManagement.getLoginUserOrgInfo().then((res: any) => {
	if (res.flag && res.data) {
		(list as any).value.find((item: any) => item.code === 'ssqdZoneCode').value = res.data.id;
		(params as any).value.ssqdZoneName = res.data.name;
		(tableList as any).value.init();
	} else {
		proxy.$message.error(res.errMsg);
	}
});

// 列表按钮点击
const handleClick = (item: any, callBackName: any, index: any, scope: any) => {
	(buttonList as any)[callBackName](item, index, scope);
};
</script>

<style scoped lang="scss">
.record {
}
</style>
