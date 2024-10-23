/* * @Author: wqsong2 * @Date: 2023/11/13 19:49 * @Desciption:菜单列表组件 */
<template>
	<div id="SubMenu" class="SubMenu">
		<el-sub-menu v-if="sub.children && sub.children.length" ref="subMenuRef" :index=sub.id :title="sub.title || sub.menuName">
			<template #title>
				<!--  添加  sub-el-icon 类收缩时，图标居中 -->
<!--				<img v-if="!$route.path.includes(sub.menuUrl) && sub.icon !== ''" :src="sub.icon" alt="" />-->
        <i :class="['bg-icon', sub.icon]" class="menu-pre-icon" v-if="!$route.path.includes(sub.menuUrl) && sub.icon !== ''" ></i>
				<img v-else-if="$route.path.includes(sub.menuUrl) && sub.iconActive !== ''" :src="sub.iconActive" alt="" />
				<slot name="title" v-if="!isCollapse" class="fz15 ml5">{{ sub.title || sub.menuName }}</slot>
			</template>
			<subMenu v-for="ch in sub.children" :key="ch.id" :sub="ch"></subMenu>
		</el-sub-menu>
		<!-- 注意 :index ‘’ 多级情况下可能有问题   -->
		<el-menu-item v-else :index="sub.menuUrl" class="scmp-menu-item" :title="sub.title || sub.menuName">
			<!--  添加  sub-el-icon 类收缩时，图标居中      -->
<!--			<img v-if="$route.path !== sub.menuUrl && sub.icon !== ''" :src="sub.icon" alt="" />-->
      <SvgIcons :icon-class="sub.meta && sub.meta.icon" v-if="sub.meta.icon !== ''"/>
			<img v-else-if="$route.path === sub.menuUrl && sub.iconActive !== ''" :src="sub.iconActive" alt="" />
			<slot name="title" v-if="!isCollapse" class="fz15 ml5">{{ sub.title || sub.menuName }}</slot>
		</el-menu-item>
	</div>
</template>

<script setup lang="ts">
import { onMounted, toRefs } from 'vue';
import SvgIcons from "@/components/svgIcons/index.vue";
const props = defineProps({
	sub: {
		type: Object,
		default() {
			return {};
		},
	},
	basePath: {
		type: String,
		default: '',
	},
	isCollapse: {
		type: Boolean,
		default: false,
	},
});
const { sub, basePath, isCollapse } = toRefs(props);
onMounted(() => {
	// console.log(props.basePath, basePath);
});
</script>
<style scoped lang="scss">
:deep(.is-active) {
	& > .el-submenu__title {
		color: #0462f0;
	}
}
//修改箭头指向
// 菜单关闭
:deep(.el-submenu > .el-submenu__title .el-submenu__icon-arrow) {
	-webkit-transform: rotateZ(-90deg);
	-ms-transform: rotate(-90deg);
	transform: rotateZ(-90deg);
}
// 菜单展开
:deep(.el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow) {
	-webkit-transform: rotateZ(0deg);
	-ms-transform: rotate(0deg);
	transform: rotateZ(0deg);
}
.SubMenu {
	i {
		color: #555;
	}
	.el-submenu__title {
		img {
			width: 25px;
		}
		&:hover {
			color: #0462f0;
			background: rgba(4, 98, 240, 0.1);
			i {
				color: #0462f0;
			}
		}
	}
	.el-menu {
		.el-menu-item {
			&:hover {
				color: #0462f0;
				background: rgba(4, 98, 240, 0.1);
			}
		}
	}
	.el-menu-item.is-active {
		background-color: #eaf0fd;
	}
}
</style>
