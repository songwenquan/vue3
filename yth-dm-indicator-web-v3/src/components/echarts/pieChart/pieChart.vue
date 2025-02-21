/* * @Author: wqsong2 * @Date: 2024/8/13 10:38 * @Desciption: */
<template>
	<div :id="pieChart" class="pieChart" ref="echarts"></div>
</template>

<script setup lang="ts">
import { toRefs, reactive, getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance() as any; //this
const props = defineProps({
	pieChart: {
		type: String,
		default: 'vertical',
	},
	radius: {
		type: Array,
		default: () => {
			return ['0%', '50%'];
		},
	},
	center: {
		type: Array,
		default: () => {
			return ['50%', '50%'];
		},
	},
	borderRadius: {
		type: Number,
		default: 0,
	},
	titleLeft: {
		type: String,
		default: 'center',
	},
	textAlign: {
		type: String,
		default: 'left',
	},
	titleTop: {
		type: String,
		default: 'center',
	},
	showLegend: {
		type: Boolean,
		default: false,
	},
});
const { pieChart, radius, center, borderRadius, titleLeft, textAlign, titleTop, showLegend } = toRefs(props);
const { option, echartsDom } = toRefs(
	reactive({
		option: {},
		echartsDom: '' as any,
		objTimer: '',
	})
);
const emit = defineEmits(['clickFunc']);
const drawLine = (data: any) => {
	let num = 0;
	const _this = this;
	data.data.map((item: any) => {
		num += Number(item.value);
	});
	num = Number.isInteger(num) ? num : parseFloat(num.toFixed(2));
	if (data.num !== undefined) {
		num = data.num;
	}
	const myChart = proxy.$echarts.init(document.getElementById(pieChart.value));
	myChart.clear();
	echartsDom.value = myChart;
	option.value = {
		color: data.color ? data.color : [],
		title: {
			show: data.titleShow === undefined ? true : data.titleShow,
			text: num,
			subtext: data.title ? data.title : '', // 子级标题
			left: titleLeft.value,
			top: titleTop.value,
			textAlign: textAlign.value,
			textStyle: data.titleStyle || {
				color: '#27D9C8', // 父级标题颜色
				fontSize: 18,
				align: 'center',
			},
			subtextStyle: data.subtextStyle || {
				color: '#aaa', // 子级标题颜色
				fontSize: 14,
				align: 'center',
			},
		},

		tooltip: data.toolTip || {
			trigger: 'item',
			extraCssText: data.extraCssText || 'width:240px;',
			formatter: data.formatter || '{a}<br/>{b}: {c} ({d}%)',
			textStyle: {
				color: data.textStyleColor,
			},
			position: data.position,
		},
		legend: data.legend || {
			type: data.legendType || '',
			height: data.legendHeight || '',
			pageIconColor: '#fff', // 翻页箭头颜色
			pageTextStyle: {
				color: '#fff', // 翻页数字颜色
			}, // 翻页数字设置
			pageIconSize: 13,
			show: showLegend.value,
			icon: 'circle', // 设置形状
			itemWidth: data.legendItemWidth || 10, // 设置大小
			itemHeight: data.legendItemHeight || 10,
			width: '100px',
			orient: 'vertical',
			left: data.left || '25%',
			top: data.top || '0%',
			itemGap: data.itemGap || 10,
			textStyle: {
				fontSize: 14,
				rich: {
					// 这里定义a的样式
					name: {
						width: data.nameWidth || 100,
						fontSize: data.legendFontSize || 14,
					},
					mainCount: {
						width: data.mainWidth || 90,
						fontSize: data.legendFontSize || 14,
					},
					sonCount: {
						width: data.sonWidth || 60,
						fontSize: data.legendFontSize || 14,
					},
				},
			},
			formatter: function (name: any) {
				const chartData = data.data || [];
				let mainCount = 0;
				let sonCount = 0;
				let valueName = '';
				for (let i = 0, l = chartData.length; i < l; i++) {
					if (chartData[i].name === name) {
						mainCount = chartData[i].value;
						sonCount = chartData[i].sonCount;
						valueName = chartData[i].valueName;
					}
				}
				if (data.type === 1) {
					return '{name|' + name + '}' + '   ' + '{mainCount|' + mainCount + '} ' + '{sonCount|' + sonCount + '} ';
				} else if (data.type === 2) {
					return '{name|' + name + '}' + '   ' + '{mainCount|' + mainCount + valueName + '} ' + '{sonCount|' + sonCount + '} ';
				}
			},
		},
		series: [
			{
				name: data.name,
				type: 'pie',
				clockwise: true,
				radius: radius.value,
				center: center.value, // 水平垂直位置
				avoidLabelOverlap: true,
				itemStyle: data.itemStyle || {
					borderRadius: borderRadius.value,
				},
				data: data.data,
				label: data.label || '',
			},
		],
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
.pieChart {
	height: 100%;
	width: 100%;
}
</style>
