/* * @Author: wqsong2 * @Date: 2023/11/10 15:55 * @Desciption:通用头部-用户 */
<template>
	<div class="user_panel color-f tr mr30 flex">
		<el-dropdown class="scmp_user_option ml40 flex" @command="handleCommand">
			<span class="el-dropdown-link cursor-p flex">
				<el-image class="scmp_user_photo mr15" :src="txSrc" fit="fill" :size="36" @error="txOnError" />
				<span class="scmp_user_name ell color-f">{{ userInfo.loginName }}</span>
				<span class="color-f">({{ userInfo.userTypeText}})</span>
				<div class="ml20 tuichu cursor-p" @click="loginOut">
					<img src="~@/assets/tuichu.png" alt="" />
					<span class="color-f"> {{ $t('navbar.logOut') }}</span>
				</div>
			</span>
			<!--      <template #dropdown>-->
			<!--        <el-dropdown-menu>-->
			<!--          <el-dropdown-item divided :command="{type: 'loginOut'}"> {{ $t("navbar.logOut") }}</el-dropdown-item>-->
			<!--        </el-dropdown-menu>-->
			<!--      </template>-->
		</el-dropdown>
	</div>
</template>

<script setup lang="ts">
import { getCurrentInstance, reactive, toRefs } from 'vue';
import { useStoreState } from '@/store/vuex';
const { proxy } = getCurrentInstance() as any; // this

const { txSrc } = toRefs(
	reactive({
		txSrc: require('../../assets/user-icon.png'), // 头像地址
	})
);
// 加载错误时的默认头像
const txOnError = () => {
	const src = require('../../assets/user-icon.png');
	txSrc.value = src;
};

// 获取user store-state-userInfo
const { userInfo } = toRefs(reactive(useStoreState('user', ['userInfo'])));
// 登出事件
const emit = defineEmits(['loginOut']);
const loginOut = () => {
	proxy
		.$alert('确认退出?', '提示', {
			confirmButtonText: '确定',
			type: 'warning',
		})
		.then(() => {
			emit('loginOut');
		})
		.catch(() => {});
};
// 菜单选择事件
const handleCommand = (command: any) => {
	switch (command.type) {
		case 'loginOut':
			loginOut();
			break;
	}
};
</script>

<style scoped lang="scss">
.user_panel {
	line-height: 60px;
	.scmp_user_option {
		justify-content: flex-end;
		.el-dropdown-link {
			align-items: center;
			img {
				vertical-align: middle;
			}
			.scmp_user_photo {
				display: inline-block;
				height: 32px;
			}
			.scmp_user_name {
				display: inline-block;
				max-width: 100px;
			}
			.tuichu {
				img {
					width: 30px;
					height: 30px;
				}
			}
		}
	}
}
</style>
