/*
 * @Author: wqsong2
 * @Date: 2023/10/25 19:31
 * @Desciption:store的状态类型
 */
// 定义状态类型
import { stateAppUser } from './modules/user';
import { stateAppMenu } from './modules/menu';
import { stateApp } from './modules/app';
export interface RootState {
	user: stateAppUser;
	menu: stateAppMenu;
	app: stateApp;
}
