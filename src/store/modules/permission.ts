import { defineStore } from 'pinia'
import { store } from '../index'
import { asyncRouterMap, constantRouterMap } from '@/router'
import { AppCustomRouteRecordRaw } from '@/router/types'

interface PermissionState {
  routers: AppCustomRouteRecordRaw[]
  addRouters: AppCustomRouteRecordRaw[]
  isAddRouters: boolean
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false
  }),
  getters: {
    getRouters(): AppCustomRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppCustomRouteRecordRaw[] {
      return this.addRouters
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    }
  },
  actions: {
    generateRoutes(type?: string): Promise<AppCustomRouteRecordRaw[]> {
      return new Promise((resolve) => {
        console.log('Generating routes with type:', type)
        const accessedRouters = asyncRouterMap
        console.log('Accessed routers:', accessedRouters)
        this.setRouters(constantRouterMap.concat(accessedRouters))
        this.setAddRouters(accessedRouters)
        resolve(accessedRouters)
      })
    },
    setRouters(routers: AppCustomRouteRecordRaw[]) {
      this.routers = routers
    },
    setAddRouters(routers: AppCustomRouteRecordRaw[]) {
      this.addRouters = routers
    },
    setIsAddRouters(isAddRouters: boolean) {
      this.isAddRouters = isAddRouters
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
