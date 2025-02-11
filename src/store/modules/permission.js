import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

// 權限管理模組
const permission = {
  // 狀態管理
  state: {
    routes: [],          // 所有路由
    addRoutes: [],       // 動態添加的路由
    defaultRoutes: [],   // 預設路由
    topbarRouters: [],   // 頂部導航欄路由
    sidebarRouters: []   // 側邊欄路由
  },

  // 修改狀態的方法
  mutations: {
    // 設置路由
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes                     // 保存動態路由
      state.routes = constantRoutes.concat(routes) // 合併靜態路由和動態路由
    },
    // 設置預設路由
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
    // 設置頂部導航欄路由
    SET_TOPBAR_ROUTES: (state, routes) => {
      state.topbarRouters = routes
    },
    // 設置側邊欄路由
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
  },

  // 異步操作
  actions: {
    // 生成路由配置
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向後端請求路由數據
        getRouters().then(res => {
          // 深拷貝路由數據，避免相互影響
          const sdata = JSON.parse(JSON.stringify(res.data))  // 用於側邊欄
          const rdata = JSON.parse(JSON.stringify(res.data))  // 用於重寫路由

          // 將後端返回的路由字符串轉換為組件對象
          const sidebarRoutes = filterAsyncRouter(sdata)                // 處理側邊欄路由
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)   // 處理重寫路由
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes)        // 過濾動態路由權限

          // 添加 404 頁面的路由配置
          rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
          
          // 動態添加路由
          router.addRoutes(asyncRoutes)

          // 提交 mutation，更新路由狀態
          commit('SET_ROUTES', rewriteRoutes)
          commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
          commit('SET_DEFAULT_ROUTES', sidebarRoutes)
          commit('SET_TOPBAR_ROUTES', sidebarRoutes)
          
          resolve(rewriteRoutes)
        })
      })
    }
  }
}

/**
 * 過濾和處理異步路由
 * @param asyncRouterMap 後端返回的路由數據
 * @param lastRouter 上一級路由對象
 * @param type 是否是重寫路由
 * @returns 處理後的路由數組
 */
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    // 處理子路由
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }

    // 處理組件
    if (route.component) {
      // 特殊組件的處理
      if (route.component === 'Layout') {
        route.component = Layout                // 主框架頁面
      } else if (route.component === 'ParentView') {
        route.component = ParentView           // 空白頁面
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink           // 內部連結組件
      } else {
        route.component = loadView(route.component) // 一般頁面組件
      }
    }

    // 遞歸處理子路由
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      // 沒有子路由則刪除相關屬性
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

/**
 * 處理子路由的特殊情況
 * @param childrenMap 子路由數組
 * @param lastRouter 上一級路由
 * @returns 處理後的子路由數組
 */
function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        // 如果是 ParentView，則將其子路由提升
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      // 拼接完整的路由路徑
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

/**
 * 過濾動態路由權限
 * @param routes 路由數組
 * @returns 有權限的路由數組
 */
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    // 檢查權限
    if (route.permissions) {
      // 檢查是否具有任一權限
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      // 檢查是否具有任一角色
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

/**
 * 路由懶加載
 * @param view 組件路徑
 * @returns 組件加載函數
 */
export const loadView = (view) => {
  // 移除環境判斷，統一使用動態導入
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission
