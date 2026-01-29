export interface UserLoginType {
  account: string
  password: string
  rememberMe?: boolean
}

export interface UserType {
  account?: string
  password?: string
  role?: string
  roleId?: string
  token?: string
  socketToken?: string
  permissions?: string[] | string
  username?: string
  avatar?: string
  nick?: string
  openid?: string
  // 接口返回的额外字段
  userId?: number
  cid?: number
  corporation?: string
  corporationId?: number
  createTime?: string
  logo?: string
  phone?: string
  email?: string
}

export interface AppInfo {
  appid: string
  name: string
}

export interface LoginQrResult {
  url: string
  sessionid: string
}

export interface CheckLoginResult {
  token?: string
  socketToken?: string
  avatar?: string
  nick?: string
  openid?: string
}
