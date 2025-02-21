/* * @Author: wqsong2 * @Date: 2024/7/11 10:44 * @Desciption:指标概览 */
<template>
	<div class="indexOverview">
		<div class="total-overview-item">
			<div v-for="(item, index) in listStatis" :key="index" class="list mr10 bf">
				<div class="left">
					<div class="title fz14 cursor-p" @click="openDatail(item)">
						{{ item.dataName }}
					</div>
					<div class="fb mt5" v-text="formatNumber(item.sumValue)"></div>
				</div>
				<div class="right">
					<lineChartBasic style="width: 100%; height: 46px" :lineBasic="'chart' + item.idx" :ref="(el: Element) => setItemRef(el, item)" />
				</div>
			</div>
		</div>
		<div class="main-moudle mt10">
			<div class="module-1 moudle">
				<div class="module-item module-left">
					<div class="top">
						<span class="title fz16 fb color-3">明细动态</span>
						<el-radio-group v-model="trendsDateType" class="radio-group">
							<el-radio-button v-for="item in trendsDateList" :key="item.value" :label="item.label" :value="item.value" />
						</el-radio-group>
					</div>
					<div class="main mt10">
						<el-radio-group v-model="trendsSwitch" class="radio-group-bottom" v-if="trendsDateType !== 1">
							<el-radio-button v-for="item in trendsSwitchList" :key="item.value" :label="item.label" :value="item.value" />
						</el-radio-group>
						<detailList class="mt10" :trendsDateType="trendsDateType" :trendsSwitch="trendsSwitch" :form-model="formModel"></detailList>
					</div>
				</div>
				<div class="module-item module-right">
					<div class="head">
						<span class="title fz16 fb color-3">指标来源分布</span>
					</div>
					<PieChart class="mt10" style="width: 100%; height: 88%" ref="sourceOfIndicators" pieChart="sourceOfIndicators" :radius="radius"></PieChart>
				</div>
			</div>
			<div class="module-2 moudle mt10">
				<div class="module-item module-left">
					<div class="top">
						<span class="title fz16 fb color-3">概览动态</span>
						<el-radio-group v-model="dataType" class="radio-group" @change="overviewdynamic()">
							<el-radio-button v-for="item in dateTypeList" :key="item.value" :label="item.label" :value="item.value" />
						</el-radio-group>
					</div>
					<lineChartBasic style="height: 280px" ref="changeTrend" lineBasic="changeTrend" :radius="radius"></lineChartBasic>
				</div>
				<div class="module-item module-right">
					<div class="head">
						<span class="title fz16 fb color-3">指标异常情况</span>
					</div>
					<PieChart
						class="mt10"
						style="height: 280px"
						ref="exception"
						pieChart="exception"
						:radius="['60%', '90%']"
						text-align="center"
						title-left="49%"
					></PieChart>
					<div class="btn-group">
						<span>异常指标</span>
						<span>正常指标</span>
						<span>异常率</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { toRefs, reactive, onMounted, getCurrentInstance, ref, nextTick } from 'vue';
import lineChartBasic from '@/components/echarts/lineChart/lineChartBasic.vue';
import { useRouter } from 'vue-router';
import detailList from '@/views/back/indicator-overview/comps/detailList.vue';
import PieChart from '@/components/echarts/pieChart/pieChart.vue';
const router = useRouter();
const { proxy } = getCurrentInstance() as any; // this
const { listStatis, formModel, colorList, trendsDateType, trendsDateList, trendsSwitch, trendsSwitchList, radius, dataType, dateTypeList } = toRefs(
	reactive({
		listStatis: [],
		formModel: {
			deptName: '全部',
			deptId: '',
		},
		colorList: [
			{ color: ['rgba(104,150,255,1)', 'rgba(93,139,255,0)'] },
			{ color: ['rgba(104,226,255,1)', 'rgba(93,193,255,0)'] },
			{ color: ['rgba(255,159,21,1)', 'rgba(255,159,21,0)'] },
			{ color: ['rgba(45,182,109,1)', 'rgba(45,182,109,0.1)'] },
			{ color: ['rgba(45,182,109,1)', 'rgba(93,139,255,0)'] },
		],
		trendsDateType: 1,
		trendsSwitch: 1,
		trendsDateList: [
			{ value: 1, label: '热门数据' },
			{ value: 2, label: '待办事项' },
			{ value: 3, label: '最近更新' },
		],
		trendsSwitchList: [
			{ value: 1, label: '指标' },
			{ value: 2, label: '指标体系' },
		],
		radius: ['45%', '85%'],
		dataType: 1,
		dateTypeList: [
			{ value: 0, label: '今日' },
			{ value: 1, label: '近七天' },
			{ value: 2, label: '近一月' },
			{ value: 3, label: '近半年' },
		],
	})
);
interface item {
	idx: string;
	dateDataList: Array<[]>;
}
// 用于存储元素的ref
const itemRefs = ref({} as any);
// 设置ref的函数
const setItemRef = (el: Element, item: item) => {
	/*
	 * 响应式问题会导致data内有数据修改 rerender之后重新渲染元素 会触发了绑定事件
	 * 增加判断是否已经含有ref 存在不执行新增渲染方法
	 */
	if (el && !itemRefs.value[`chart${item.idx}`]) {
		itemRefs.value[`chart${item.idx}`] = el;
		initView(item);
		return `chart${item.idx}`;
	}
};
// 获取关键指标列表数据
const kpiData = async () => {
	const { flag, data, errMsg } = await proxy.$api.overview.kpiData({ deptId: formModel.value.deptId });
	if (flag) {
		listStatis.value = data;
		listStatis.value.map((item: any, index: number) => {
			item.idx = index;
		});
	} else {
		proxy.$message.error(errMsg);
	}
};
// 获取指标来源分布
const sourceOfIndicators = ref(null);
const indicatorOverall = async () => {
	const { flag, data, errMsg } = await proxy.$api.overview.indicatorOverall({ deptId: formModel.value.deptId });
	if (flag) {
		data.map((item: any) => {
			item.name = item.deptName;
			item.value = item.subjectNum;
		});
		const list = {
			name: '指标来源分布',
			color: ['#5875D0', '#95D278', '#FAC958', '#EE6666', '#73C0DE', '#3BA272'],
			data: data,
			type: 1,
			extraCssText: 'width:auto',
			label: {
				show: true,
				position: 'outside',
				formatter: '{d}%({c})\n{b}',
			},
		};
		(sourceOfIndicators.value as any).drawLine(list);
	} else {
		proxy.$message.error(errMsg);
	}
};
// 循环调用组件生成图表
const initView = (item: item) => {
	nextTick(() => {
		const x: Array<[]> = [];
		const series: Array<[]> = [];
		item.dateDataList.map((items: any) => {
			x.push(items.dateStr);
			series.push(items.value);
		});
		let currentColor = colorList.value[item.idx].color;
		const list = {
			xAxisData: x,
			xAxisShow: false,
			yAxisShow: false,
			tooltipShow: false,
			grid: {
				left: '0%',
				top: '20%',
				bottom: 0,
				right: 0,
			},
			series: [
				{
					data: series,
					type: 'line',
					showSymbol: false,
					lineStyle: {
						width: 1,
						color: currentColor[0],
					},
					areaStyle: {
						color: new proxy.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: currentColor[0] },
							{ offset: 1, color: currentColor[1] },
						]),
					},
				},
			],
		};
		itemRefs.value[`chart${item.idx}`].drawLine(list);
	});
};
// 点击跳转路由
const openDatail = (item: any) => {
	if (item.detailUrl) {
		router.push({ path: item.detailUrl });
	}
};
// 转换为本地格字符串
const formatNumber = (num: Number) => {
	let resNum = num ? Number(num).toLocaleString() : 0;
	return resNum;
};
// 概览动态
const changeTrend = ref(null);
const overviewdynamic = async () => {
	console.log(dataType.value);
	let param = {
		deptId: formModel.value.deptId,
		searchDateType: dataType.value,
	};
	const { flag, data, errMsg } = await proxy.$api.overview.updateInfo(param);
	if (flag) {
		const x: Array<[]> = [];
		const addIndexData: Array<[]> = [];
		const addSubjectData: Array<[]> = [];
		const updateIndexData: Array<[]> = [];
		const updateSubjectData: Array<[]> = [];
		const editIndexData: Array<[]> = [];
		let series: Array<[]> = [];
		data.map((item: any) => {
			x.push(item.dateStr);
			addIndexData.push(item.addnum);
			addSubjectData.push(item.subjectAddTotal);
			updateIndexData.push(item.updatenum);
			updateSubjectData.push(item.subjectEditTotal);
			editIndexData.push(item.indicatorDataEditTotal);
		});
		series = [
			{
				name: '新增指标',
				type: 'line',
				showSymbol: dataType.value === '0' ? true : false,
				data: addIndexData,
			},
			{
				name: '新增专题',
				type: 'line',
				showSymbol: dataType.value === '0' ? true : false,
				data: addSubjectData,
			},
			{
				name: '更新指标',
				type: 'line',
				showSymbol: dataType.value === '0' ? true : false,
				data: updateIndexData,
			},
			{
				name: '更新专题',
				type: 'line',
				showSymbol: dataType.value === '0' ? true : false,
				data: updateSubjectData,
			},
			{
				name: '更新指标数据',
				type: 'line',
				showSymbol: dataType.value === '0' ? true : false,
				data: editIndexData,
			},
		];
		const list = {
			xAxisData: x,
			color: ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE'],
			grid: data.grid || {
				left: '2%',
				top: '19%',
				right: '3%',
				bottom: '0%',
				containLabel: true,
			},
			yAxis: {
				type: 'value',
				name: '（个）',
			},
			series: series,
			hideLegend: true,
			legend: ['新增指标', '新增专题', '更新指标', '更新专题', '更新指标数据'],
		};
		(changeTrend.value as any).drawLine(list);
	} else {
		proxy.$message.error(errMsg);
	}
};
// 指标异常情况
const exception = ref(null);
const metricAnomalies = async () => {
	const { flag, data, errMsg } = await proxy.$api.overview.exception({ deptId: formModel.value.deptId });
	if (flag) {
		let servie = [
			{ value: data.indicatorException, name: '异常指标' },
			{ value: data.indicatorNormal, name: '正常指标' },
		];
		const list = {
			title: '指标异常情况(个)',
			name: '指标异常情况(个)',
			color: ['#D8D8D8', '#407cff'],
			data: servie,
			type: 1,
			extraCssText: 'width:auto',
		};
		(exception.value as any).drawLine(list);
	} else {
		proxy.$message.error(errMsg);
	}
};
onMounted(() => {
	kpiData();
	indicatorOverall();
	overviewdynamic();
	metricAnomalies();
	window.addEventListener('resize', () => {
		for (const key in itemRefs.value) {
			itemRefs.value[key].resize();
		}
		(sourceOfIndicators.value as any).resize();
	});
});
</script>

<style scoped lang="scss">
.indexOverview {
	background-color: #f4f6f9;
	.total-overview-item {
		display: flex;
		white-space: nowrap;
		justify-content: space-between;
		.list {
			display: flex;
			align-items: center;
			padding: 15px 20px;
			width: 20%;
			.left {
				width: 110px;
			}
			.right {
				width: calc(100% - 100px);
			}
		}
	}
	.main-moudle {
		.module-1,
		.module-2 {
			display: flex;
			justify-content: space-between;
			.module-left {
				width: 59.5%;
				background-color: #ffffff;
				padding: 15px;
				.top {
					display: flex;
					justify-content: space-between;
				}
				.main {
					padding: 0 16px 10px 16px;
					height: 260px;
				}
			}
			.module-right {
				width: 40%;
				background-color: #ffffff;
				padding: 15px;
			}
			.title {
				padding-left: 12px;
				position: relative;
				display: flex;
				align-items: center;
				&:before {
					content: '';
					width: 4px;
					height: 16px;
					background-color: #407cff;
					position: absolute;
					left: 0;
					border-radius: 2px;
				}
			}
		}
		.module-2 {
			.btn-group {
				display: flex;
				justify-content: space-between;
				span {
					width: 32%;
					text-align: center;
				}
			}
		}
	}
}
</style>
