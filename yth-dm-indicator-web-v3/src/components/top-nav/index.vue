/*
* @Author: wqsong2
* @Date: 2024/10/30 18:21
* @Desciption:头部导航
*/
<template>
  <div class="topNav">
    <el-menu :default-active="activeMenu" mode="horizontal" @select="handleSelect" :ellipsis="false">
      <template v-for="(item, index) in topMenus">
        <el-menu-item :style="{ '--theme': theme }" :index="firstChildPath(item)" :key="index"
                      v-if="index < visibleNumber" :class="route.path.startsWith(item.path) ? 'active-menu-item' : ''">
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script setup lang="ts">
import { reactive, toRefs,computed,onMounted,onBeforeUnmount} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useStoreState} from "@/store/vuex";
const route = useRoute()
const router = useRouter()
const {visibleNumber,currentIndex,hideList} = toRefs(reactive({
  visibleNumber:null, // 顶部栏初始数
  currentIndex:null, //当前激活菜单的
  hideList: [],   // 隐藏侧边栏路由
}));
// 所有路由信息
const { menu } = toRefs(reactive(useStoreState('menu', ['menu'])));
// 主题颜色
const { theme } = toRefs(reactive(useStoreState('app', ['theme'])));
// 顶部显示菜单
const topMenus = computed(() => {
  let topMenus = []
  menu.value.slice(0,visibleNumber.value).map(menu => {
    if (menu.hidden !== true) {
      // 兼容顶部栏一级菜单内部跳转
      if (menu.path === '/') {
        topMenus.push(menu.children[0])
      } else {
        topMenus.push(menu)
      }
    }
  })
  return topMenus
})
// 默认激活菜单
const activeMenu = computed(() => {
  const path = route.path
})
// 获取模块菜单的第一子路由
const firstChildPath = computed(() => {
  return function (item) {
    const data = findRedirectPage(item)
    return data.length > 2 ? `${data.at(-2)}/${data.at(-1)}` : `${data.at(-1)}`
  }
})
// 递归 查询模块菜单的第一个展示页面
const findRedirectPage = (item, array = []) => {
  array.push(item.path)
  if (item.children.length > 0) {
    const ui = item.children.filter(item => !item.hidden)
    return findRedirectPage(ui[0], array)
  } else return array
}
// 只适应窗口宽度
const setVisibleNumber = () => {
  const width = document.body.getBoundingClientRect().width / 3
  visibleNumber.value = parseInt(width / 85)
}
onMounted(() => {
  window.addEventListener('resize', setVisibleNumber)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', setVisibleNumber)
})
onMounted(() => {
  setVisibleNumber()
})
</script>
<style scoped lang="scss">
.topNav {
  .el-menu {
    background-color: transparent !important;
  }
  .el-menu--horizontal{
    border-bottom: none !important;
    .el-menu-item:not(.is-disabled):hover{
      background-color: transparent !important;
      color: #ffffff;
    }
    .el-menu-item.active-menu-item {
      color: #fff !important;
      background-image: url('@/assets/images/img/tab_bg.png');
      background-size: 114% 105% !important;
      border-bottom: none !important;
    }
    .el-menu-item.is-active {
      color: #fff !important;
      background-image: url('@/assets/images/img/tab_bg.png');
      background-size: 114% 105% !important;
      border-bottom: none !important;
    }
    el-sub-menu:hover {
      color: #fff;
      background-color: transparent !important;
    }
  }
  .el-menu-item {
    color: #ffffff;
    background-color: unset !important;
    border-bottom: none !important;
  }
}
</style>
