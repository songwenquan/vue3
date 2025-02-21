/* * @Author: wqsong2 * @Date: 2024/7/16 15:33 * @Desciption: */
<template>
	<div :id="lineBasic" class="lineChartBasic" ref="echarts"></div>
</template>

<script setup lang="ts">
import { toRefs, reactive, getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance() as any; //this
const props = defineProps({
	lineBasic: {
		type: String,
		default: 'vertical',
	},
});
const { lineBasic } = toRefs(props);
const { option, echartsDom } = toRefs(
	reactive({
		option: {},
		echartsDom: '' as any,
	})
);
const emit = defineEmits(['clickFunc']);
const drawLine = (data: any) => {
	const myChart = proxy.$echarts.init(document.getElementById(lineBasic.value));
	myChart.clear();
	echartsDom.value = myChart;
	const series: any = [];
	if (data.seriesType === 1) {
		data.series.map((item: any) => {
			series.push({
				name: item.name,
				type: 'line',
				smooth: item.smooth !== undefined ? item.smooth : true,
				itemStyle: {
					normal: data.hideAreaColor
						? {}
						: item.normal || {
								areaStyle: item.areaStyle || {
									color: item.areaStyleColor || 'rgba(183,224,232, 0.4)',
								},
							},
				},
				yAxisIndex: item.yAxisIndex || 0,
				data: item.data,
			});
		});
	}
	option.value = {
		color: data.color, //颜色
		title: {
			text: data.text || '',
		},
		grid: data.grid || {
			left: '10%',
			top: '10%',
			right: '6%',
			bottom: '15%',
			containLabel: true,
		},
		// 图表展示的类别，这里的data和series中得name对应
		legend: {
			data: data.legend,
			top: data.legendPosition || '7%', // 与上方的距离 可百分比% 可像素px
			show: data.hideLegend, // 是否展示图列
			selected: data.selected || {}, // 图列默认选中
		},
		tooltip: {
			show: data.tooltipShow === undefined ? true : data.tooltipShow,
			trigger: data.trigger || 'axis',
			formatter: data.formatter,
			extraCssText: data.extraCssText || 'width:240px;',
			textStyle: {
				align: 'left',
				color: data.textStyleColor,
			},
			position: data.position || '',
		},
		xAxis: data.xAxis || [
			{
				type: 'category',
				data: data.xAxisData,
				boundaryGap: false,
				show: data.xAxisShow === undefined ? true : data.xAxisShow,
				axisTick: {
					show: false, // 不显示坐标轴刻度线
				},
			},
		],
		yAxis: data.yAxis || {
			type: 'value',
			show: data.yAxisShow === undefined ? true : data.yAxisShow,
		},
		series: data.seriesType === 1 ? series : data.series, // 数据
		dataZoom: data.dataZoom || '', // 数据区域缩放组件配置
	};
	option.value && myChart.setOption(option.value, true);
	myChart.off('click').on('click', (params: any) => {
		params.name && emit('clickFunc', params);
	});
};
const resize = () => {
	echartsDom.value.resize();
};
// 传递调用方法
defineExpose({
	drawLine,
	resize,
});
</script>

<style scoped lang="scss">
.lineChartBasic {
	height: 100%;
	width: 100%;
}
</style>
