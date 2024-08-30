/*
 * @Author: wqsong2
 * @Date: 2023/11/3 16:49
 * @Desciption:封装vuex的mapMutations 方法
 */
import { mapMutations, createNamespacedHelpers } from 'vuex';
import { useActionMapper } from './useMapper';
import { checkType } from '@/store/vuex/index';
/**
 *
 * @param {*} moduleName 模块名称
 * @param {*} mapper 方法名集合 ['fn1', 'fn2']
 * @returns
 */
export default function useMutations(moduleName: any, mapper: any) {
	let mapperFn = mapMutations;
	// 如果使用模块化，则使用vuex提供的createNamespacedHelpers方法找到对应模块的mapActions方法
	if (checkType(moduleName) === '[object String]' && moduleName.length > 0) {
		mapperFn = createNamespacedHelpers(moduleName).mapMutations;
	}
	return useActionMapper(mapper, mapperFn);
}
