/* * @Author: wqsong2 * @Date: 2023/11/6 11:03 * @Desciption:语言切换 */
<template>
	<div class="langSelect">
		<el-dropdown>
			<span class="el-dropdown-link cursor-p">
				<SvgIcons :width="width" :height="height" :color="color" icon-class="#iconzhongyingwen" />
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item v-for="item in languages" :key="item.value" :disabled="language === item.value">
						<span @click="handleSetLanguage(item.value)">{{ item.name }}</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<script setup lang="ts">
import SvgIcons from '@/components/svgIcons/index.vue';
import { getCurrentInstance, toRefs } from 'vue';
import { useStoreMutations, useStoreState } from '@/store/vuex';
const { proxy } = getCurrentInstance() as any; // this
const props = defineProps({
	width: {
		type: String,
		default: '20',
	},
	height: {
		type: String,
		default: '20',
	},
	color: {
		type: String,
		default: '#ffffff',
	},
});
const { width, height, color } = toRefs(props);
type Language = {
	name: string;
	value: string;
};
// 语言种类list
const { languages } = {
	languages: [
		{ name: 'en', value: 'en' },
		{ name: '中文', value: 'zh' },
	] as Array<Language>,
};
// 当前语言类型
const { language } = useStoreState('app', ['language']);
// 语言切换方法
const { MUT_SET_LANGUAGE } = useStoreMutations('app', ['MUT_SET_LANGUAGE']);
const handleSetLanguage = (lang: string) => {
	MUT_SET_LANGUAGE(lang);
	proxy.$i18n.locale = lang;
	proxy.$message.success('语言更换成功');
};
</script>

<style scoped lang="scss">
.langSelect {
	.svg-color {
		fill: white;
	}
}
</style>
