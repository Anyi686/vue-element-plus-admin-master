import request from '@/axios'
import type { UserLoginType, UserType, AppInfo, LoginQrResult, CheckLoginResult } from './types'

// 账号密码登录
export const loginApi = (data: UserLoginType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/tel/login/login', data })
}

// 获取用户信息
export const getUserInfoApi = (): Promise<IResponse<UserType>> => {
  return request.get({ url: '/corporation/login/user' })
}

// 获取公众号列表
export const getGhAppsApi = (): Promise<IResponse<AppInfo[]>> => {
  return request.get({ url: '/corporation/oauth2/ghApps' })
}

// 获取微信登录二维码
export const loginQrApi = (params?: { appid?: string }): Promise<IResponse<LoginQrResult>> => {
  return request.get({ url: '/corporation/oauth2/loginQr', params })
}

// 检查登录状态
export const checkLoginApi = (params: {
  sessionid: string
}): Promise<IResponse<CheckLoginResult>> => {
  return request.get({ url: '/corporation/oauth2/checkLogin', params })
}

// 绑定邀请码
export const bindingInviteCodeApi = (data: {
  inviteCode: string
  openid: string
}): Promise<IResponse<UserType>> => {
  return request.post({ url: '/corporation/employee/bindingInviteCode', data })
}

// 绑定已有账号
export const bindingEmployeeApi = (data: {
  account: string
  password: string
  openid: string
}): Promise<IResponse<UserType>> => {
  return request.post({ url: '/corporation/employee/bindingEmployee', data })
}

// 退出登录
export const logoutApi = (): Promise<IResponse<void>> => {
  return request.post({ url: '/logout' })
}

// 获取可切换企业列表
export const getCorporationListApi = (): Promise<IResponse<any[]>> => {
  return request.get({ url: '/corporation/login/switchCorp' })
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    code: string
    data: {
      list: UserType[]
      total: number
    }
  }>({ url: '/admin/user/list', params })
}
