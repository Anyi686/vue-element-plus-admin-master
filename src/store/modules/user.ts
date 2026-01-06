import { defineStore } from 'pinia'
import { store } from '../index'
import { UserLoginType, UserType } from '@/api/login/types'
import { ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { loginApi, getUserInfoApi } from '@/api/login'
import md5 from 'md5'

import { useTagsViewStore } from './tagsView'
import router from '@/router'

interface UserState {
  userInfo?: UserType
  tokenKey: string
  token: string
  socketToken: string
  roleRouters?: string[] | AppCustomRouteRecordRaw[]
  rememberMe: boolean
  loginInfo?: UserLoginType
  isWechatLogin: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      userInfo: undefined,
      tokenKey: 'Authorization',
      token: '',
      socketToken: '',
      roleRouters: undefined,
      // 记住我
      rememberMe: true,
      loginInfo: undefined,
      isWechatLogin: false
    }
  },
  getters: {
    getTokenKey(): string {
      return this.tokenKey
    },
    getToken(): string {
      return this.token
    },
    getSocketToken(): string {
      return this.socketToken
    },
    getUserInfo(): UserType | undefined {
      return this.userInfo
    },
    getRoleRouters(): string[] | AppCustomRouteRecordRaw[] | undefined {
      return this.roleRouters
    },
    getRememberMe(): boolean {
      return this.rememberMe
    },
    getLoginInfo(): UserLoginType | undefined {
      return this.loginInfo
    },
    getIsWechatLogin(): boolean {
      return this.isWechatLogin
    }
  },
  actions: {
    async login(loginData: UserLoginType) {
      const { account, password } = loginData

      try {
        // 调用登录接口，密码使用 md5 加密
        const res = await loginApi({
          account,
          password: md5(password)
        })

        if (res.code === 200 && res.data) {
          const userData = res.data
          console.log('Login successful:', userData)

          this.setToken(userData.token || '')
          if (userData.socketToken) {
            this.setSocketToken(userData.socketToken)
          }
          this.setUserInfo(userData)
          this.setIsWechatLogin(false)

          // 登录成功后获取用户详细信息
          await this.fetchUserInfo()

          return userData
        } else {
          throw new Error((res as any).message || '登录失败')
        }
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    // 获取用户详细信息
    async fetchUserInfo() {
      try {
        const res = await getUserInfoApi()
        if (res.code === 200 && res.data) {
          // 合并用户信息
          this.setUserInfo({
            ...this.userInfo,
            ...res.data
          })
          console.log('User info fetched:', res.data)
          return res.data
        }
      } catch (error) {
        console.error('Fetch user info error:', error)
      }
    },
    // 微信登录成功后设置用户信息
    async setWechatLoginInfo(userData: UserType) {
      this.setToken(userData.token || '')
      if (userData.socketToken) {
        this.setSocketToken(userData.socketToken)
      }
      this.setUserInfo(userData)
      this.setIsWechatLogin(true)
      // 获取用户详细信息
      await this.fetchUserInfo()
    },
    setTokenKey(tokenKey: string) {
      this.tokenKey = tokenKey
    },
    setToken(token: string) {
      this.token = token
    },
    setSocketToken(socketToken: string) {
      this.socketToken = socketToken
    },
    setUserInfo(userInfo?: UserType) {
      this.userInfo = userInfo
    },
    setRoleRouters(roleRouters: string[] | AppCustomRouteRecordRaw[]) {
      this.roleRouters = roleRouters
    },
    setIsWechatLogin(isWechatLogin: boolean) {
      this.isWechatLogin = isWechatLogin
    },
    logoutConfirm() {
      const { t } = useI18n()
      ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.reset()
        })
        .catch(() => {})
    },
    reset() {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      this.setToken('')
      this.setSocketToken('')
      this.setUserInfo(undefined)
      this.setRoleRouters([])
      this.setIsWechatLogin(false)
      router.replace('/login')
    },
    logout() {
      this.reset()
    },
    setRememberMe(rememberMe: boolean) {
      this.rememberMe = rememberMe
    },
    setLoginInfo(loginInfo: UserLoginType | undefined) {
      this.loginInfo = loginInfo
    }
  },
  persist: true
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
