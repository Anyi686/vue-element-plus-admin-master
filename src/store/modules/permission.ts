import { defineStore } from 'pinia'
import { store } from '../index'
import { asyncRouterMap, constantRouterMap } from '@/router'

interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return this.addRouters
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    generateRoutes(type?: string): Promise<AppRouteRecordRaw[]> {
      return new Promise((resolve) => {
        console.log('Generating routes with type:', type)
        const accessedRouters = asyncRouterMap
        console.log('Accessed routers:', accessedRouters)
        this.setRouters(constantRouterMap.concat(accessedRouters))
        this.setAddRouters(accessedRouters)
        resolve(accessedRouters)
      })
    },
    setRouters(routers: AppRouteRecordRaw[]) {
      this.routers = routers
    },
    setAddRouters(routers: AppRouteRecordRaw[]) {
      this.addRouters = routers
    },
    setIsAddRouters(isAddRouters: boolean) {
      this.isAddRouters = isAddRouters
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]) {
      this.menuTabRouters = routers
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
