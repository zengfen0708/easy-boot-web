import { constantRoutes } from '@/router'

import { getTreeNode } from '@/api/system/menu'

import Layout from '@/layout'

const state = {
  routes: [],
  addRoutes: [] // 异步加载的路由
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // constantRoutes： 代表那些不需要动态判断权限的路由，如登录页、404、等通用页面
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // 获取动态路由
  generateRoutes({ commit }, roles) {
    // 异步编程的一种解决方案
    return new Promise((resolve, reject) => {
      // 获取动态菜单
      getTreeNode().then(res => {
        let accessedRoutes = []
        accessedRoutes = filterAsyncRouter(res.data)
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
        .catch(function(error) {
          reject(error)
        })
    })
  }
}

export const filterAsyncRouter = (routers) => { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = routers.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.childrens && router.childrens.length) {
      router.children = filterAsyncRouter(router.childrens)
    }
    return true
  })
  return accessedRouters
}

export const loadView = (view) => { // 路由懒加载
  return () => import(`@/views/${view}`)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
