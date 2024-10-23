/*
 * @Author: wqsong2
 * @Date: 2023/10/17 15:15
 * @Desciption:路由  keepAlive:是否缓存 fullScreen:页面布局类型  requireAuth:是否需要登录 nobread:是否显示面包屑导航  isHideAside: 是否显示侧边栏,
 * fullScreen   TCB 左侧列表布局   TCB-TOP 顶部菜单列表布局  currency 自定义布局  noTagsView 是否展示已点击菜单序列  affix 是否支持删除
 *
 */
export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '扫码登录',
      keepAlive: false,
      fullScreen: 'CUSTOM',
      requireAuth: false,
    },
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404.vue'),
  }
  // {
  //   path: '/',
  //   component: () => import('@/views/index.vue'),
  //   name: 'indicator-web',
  //   meta: {
  //     title: '指标管理系统',
  //     keepAlive: false,
  //     showCrumb: false,
  //   },
  //   children: [
  //     // 指标概览
  //     {
  //       path: '/indicator-overview',
  //       name: 'indicator-overview',
  //       meta: {
  //         title: '指标概览',
  //         keepAlive: false,
  //         fullScreen: 'TCB',
  //         requireAuth: true,
  //         nobread: true,
  //         noTagsView:true,
  //         isHideAside: true,
  //         affix:false
  //       },
  //       component: () => import('../../views/indicator-overview/index.vue'),
  //     },
  //     {
  //       path: '/indicator-design',
  //       name: 'indicator-design',
  //       redirect:"/indicator-system-manangement",
  //       meta: {
  //         title: '指标体系设计',
  //       },
  //       children: [
  //         {
  //           path: '/indicator-system-manangement',
  //           name: 'indicator-system-manangement',
  //           meta: {
  //             title: '指标体系管理',
  //             keepAlive: false,
  //             fullScreen: 'TCB',
  //             requireAuth: true,
  //             nobread: true,
  //             noTagsView:true,
  //             isHideAside: true,
  //             affix:false
  //           },
  //           component: () => import('@/views/indicator-design/indicator-system-manangement.vue'),}
  //       ]
  //     },
  //   ]
  // }
];
