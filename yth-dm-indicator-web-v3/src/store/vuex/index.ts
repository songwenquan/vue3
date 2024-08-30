/*
 * @Author: wqsong2
 * @Date: 2023/11/1 18:04
 * @Desciption:vuex 方法导出
 */
export { default as useStoreActions } from '@/store/vuex/useActions';
export { default as useStoreState } from '@/store/vuex/useState';
export { default as useStoreGetters } from '@/store/vuex/useGetters';
export { default as useStoreMutations } from '@/store/vuex/useMutations';
export function checkType(data: any) {
	return Object.prototype.toString.call(data);
}
