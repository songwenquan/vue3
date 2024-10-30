/* * @Author: wqsong2 * @Date: 2023/11/3 14:48 * @Desciption:登录 */
<template>
	<div class="login fl">
		<video poster="../../../assets/images/login/video-cover.jpeg" loop autoplay muted>
			<source src="../../../assets/images/login/night.mp4" />
		</video>
		<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
			<div class="title-container">
				<h3 class="title fw fz26 tc">
					{{ $t('login.title') }}
				</h3>
				<LangSelect width="60" height="60" class="set-language cursor-p fz18" />
			</div>
			<el-form-item prop="username">
				<span class="fz16 color-f">
					<el-icon class="username" :size="20"><User /></el-icon>{{ $t('login.username') }}:
				</span>
				<el-input ref="userNameRef" v-model="loginForm.username" :placeholder="$t('login.username')" type="text" tabindex="1" autocomplete="on" />
			</el-form-item>
			<el-tooltip :visible="state.capsTooltip" :content="$t('settings.CapsLock')" placement="right" manual>
				<el-form-item prop="password">
					<span class="fz16 color-f">
						<el-icon class="password" :size="20"><Lock /></el-icon>{{ $t('login.password') }}:
					</span>
					<el-input
						ref="passwordRef"
						v-model="loginForm.password"
						type="password"
						:placeholder="$t('login.password')"
						show-password
						tabindex="2"
						autocomplete="on"
						@keyup="checkCapslock($event, state, 'capsTooltip')"
						@blur="state.capsTooltip = false"
						@keyup.enter="handleLogin(loginFormRef)"
					/>
				</el-form-item>
			</el-tooltip>
			<el-button :loading="state.loading" type="primary" style="width: 100%; margin-bottom: 30px" @click="handleLogin(loginFormRef)">{{
				$t('login.logIn')
			}}</el-button>
		</el-form>
	</div>
</template>
<script setup lang="ts">
import { getCurrentInstance, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import LangSelect from '@/components/lang_select/index.vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useStoreActions } from '@/store/vuex';
import {checkCapslock, children, childrenStr} from '@/utils/utils';
const router = useRouter();
const { proxy } = getCurrentInstance() as any; // this
// 登录
const state = reactive({
	capsTooltip: false as boolean,
	loading: false,
});
interface RuleForm {
	username: string;
	password: string;
}
const loginFormRef = ref<FormInstance>();
const loginForm = reactive<RuleForm>({
	username: '',
	password: '',
});
const loginRules = reactive<FormRules<RuleForm>>({
	username: [{ required: true, message: proxy.$t('rules.loginRules.username'), trigger: 'blur' }],
	password: [{ required: true, message: proxy.$t('rules.loginRules.password'), trigger: 'blur' }],
});
// 获取menu store-actions方法
const menuList = useStoreActions('menu', ['ACT_GetMenu']);

// 点击登录
const handleLogin = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			const menus = await menuList.ACT_GetMenu();
			if (menus.flag === true) {
				if (menus.menu.length > 0) {
					const url = childrenStr(menus.menu);
					router.push({ path: url });
				} else {
					proxy.$message.warning('暂无菜单权限', 3000);
				}
			} else {
				proxy.$message.warning(menus.msg, 3000);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};
</script>
<style scoped lang="scss">
.login {
	width: 100%;
	height: 100%;
	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: absolute;
	}
	.login-form {
		position: relative;
		width: 520px;
		max-width: 100%;
		padding: 160px 35px 0;
		margin: 0 auto;
		overflow: hidden;
		.title-container {
			position: relative;
			.title {
				color: $lightGray;
				margin: 0px auto 40px auto;
			}
			.set-language {
				position: absolute;
				top: -15px;
				right: 0px;
			}
		}
		.username,
		.password {
			padding: 6px 5px 6px 15px;
			color: $color-f;
			vertical-align: middle;
			width: 30px;
			display: inline-block;
		}
	}
}
</style>
