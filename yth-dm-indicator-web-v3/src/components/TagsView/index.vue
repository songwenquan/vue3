/*
* @Author: wqsong2
* @Date: 2024/7/12 18:07
* @Desciption:已点击菜单列表
*/
<template>
  <div id="tags-view-container" class="tags-view-container bf mb10">
    <el-scrollbar ref="scrollPaneRef" class="tags-view-wrapper cursor-p bf fz12" >
      <router-link class="tags-view-item ml5 mt5" v-for="tag in visitedViews" :key="tag.path" :data-path="tag.path" :class="isActive(tag) ? 'active' : ''" :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
                   :style="activeStyle(tag)" @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''">
        {{ tag.meta.title }}
        <span v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)">
          <close class="el-icon-close" style="width: 1em; height: 1em; vertical-align: middle" />
        </span>
      </router-link>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import {  reactive, toRefs } from 'vue';
import {useStoreMutations, useStoreState} from "@/store/vuex";
import { useRoute,useRouter} from 'vue-router';
const router = useRouter();
const route = useRoute();
const { visitedViews } = toRefs(reactive(useStoreState('menu', ['visitedViews'])));
const { MUT_DeleteMenuvisitedViews } = useStoreMutations('menu', ['MUT_DeleteMenuvisitedViews']);
const { theme } = toRefs(reactive(useStoreState('app', ['theme'])));
// 判断当前path是否相同url path
const isActive = (r:any) => {
  return r.path === route.path
}
// 获取按钮选中颜色
const activeStyle = (tag:any) => {
  if (!isActive(tag)){
    return {}
  }else {
    return {
      'background-color': theme.value,
      'border-color': theme.value
    }
  }
}
// 关闭当前tab
const closeSelectedTag = (view:any) => {
  MUT_DeleteMenuvisitedViews(view.path)
  if(visitedViews.value.length === 0){
    router.push({ path: '/' });
  }else {
    router.push({
      path: visitedViews.value[0].path,
      query:visitedViews.value[0].query
    });
  }
}
// 是否支持删除
const isAffix = (tag:any) => {
  return tag.meta && tag.meta.affix
}
</script>

<style scoped lang="scss">
a{
  text-decoration: none;
}
.tags-view-container{
  display: flex;
  align-items: center;
  height: 40px;
  line-height: 40px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    flex: 1;
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      padding: 0 8px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        color: #fff;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
}
</style>
