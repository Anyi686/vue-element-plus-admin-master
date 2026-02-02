import { AxiosResponse, InternalAxiosRequestConfig } from './types'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { SUCCESS_CODE, TRANSFORM_REQUEST_DATA } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'
import { objToFormData } from '@/utils'

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  if (
    config.method === 'post' &&
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data)
  } else if (
    TRANSFORM_REQUEST_DATA &&
    config.method === 'post' &&
    config.headers['Content-Type'] === 'multipart/form-data' &&
    !(config.data instanceof FormData)
  ) {
    config.data = objToFormData(config.data)
  }
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}

const defaultResponseInterceptors = (response: AxiosResponse) => {
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  } else if (response.data.code === SUCCESS_CODE || response.status === 200) {
    return response.data
  } else {
    // 处理 token 过期的情况
    if (response?.data?.code === 401) {
      const message = response?.data?.message || 'Token expired!'
      // 如果是 token 过期，显示提示并登出
      if (
        message.includes('Token expired') ||
        message.includes('token expired') ||
        message === 'Token expired!' ||
        message.toLowerCase().includes('token expired')
      ) {
        ElMessage.error('登录已过期，请重新登录')
        const userStore = useUserStoreWithOut()
        userStore.logout()
      } else {
        // 其他 401 错误也处理登出
        ElMessage.error(message || '登录已过期，请重新登录')
        const userStore = useUserStoreWithOut()
        userStore.logout()
      }
      // 抛出错误，阻止后续处理
      return Promise.reject(response.data)
    } else {
      // 其他错误正常显示
      ElMessage.error(response?.data?.message)
      return Promise.reject(response.data)
    }
  }
}

export { defaultResponseInterceptors, defaultRequestInterceptors }
