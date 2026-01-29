import request from '@/axios'
import type {
  CustomerListResult,
  SopTemplateResult,
  SopTaskListResult,
  SopArrangeListResult,
  FileHistoryResult
} from './types'

// 获取SOP模板列表（左侧菜单）
export const getSopTemplatesApi = (): Promise<IResponse<SopTemplateResult>> => {
  return request.get({ url: '/tel/sop/templates' })
}

// 获取客户列表
export const getCustomerListApi = (params: {
  page: number
  size: number
  name?: string
  mobile?: string
  type?: number
  typeId?: number
}): Promise<IResponse<CustomerListResult>> => {
  return request.get({ url: '/tel/customer/list', params })
}

// 上传客户数据
export const uploadCustomerApi = (data: FormData): Promise<IResponse<any>> => {
  return request.post({
    url: '/tel/customer/upload',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取SOP任务列表
export const getSopTasksApi = (params: {
  groupId: number
}): Promise<IResponse<SopTaskListResult>> => {
  return request.get({ url: '/tel/sop/tasks', params })
}

// 获取SOP计划列表（安排）
export const getSopArrangesApi = (params: {
  taskId: number
  page: number
  size: number
}): Promise<IResponse<SopArrangeListResult>> => {
  return request.get({ url: '/tel/sop/arranges', params })
}

// 获取上传历史列表
export const getFileHistoryApi = (params: {
  page: number
  size: number
  type: number
  typeId: number
}): Promise<IResponse<FileHistoryResult>> => {
  return request.get({ url: '/tel/customer/fileHistory', params })
}

// 添加任务
export const addTaskApi = (data: {
  groupId: number
  name: string
  timeStart: string
  timeEnd: string
  status: boolean
}): Promise<IResponse<any>> => {
  return request.post({ url: '/tel/sop/addTask', data })
}

// 更改任务状态
export const updateTaskStatusApi = (data: {
  id: number
  status: boolean
}): Promise<IResponse<any>> => {
  return request.post({ url: '/tel/sop/updateTaskStatus', data })
}

// 删除任务
export const deleteTaskApi = (id: number): Promise<IResponse<any>> => {
  return request.delete({ url: `/tel/sop/deleteTask?id=${id}` })
}

// 添加计划
export const addArrangeApi = (
  taskId: number,
  data: {
    taskId: number
    status: boolean
    notice: string
    days: number
  }
): Promise<IResponse<any>> => {
  return request.post({ url: `/tel/sop/addArrange?taskId=${taskId}`, data })
}

// 更新计划状态
export const updateArrangeStatusApi = (data: {
  arrangeId: number
  status: boolean
}): Promise<IResponse<any>> => {
  return request.post({ url: '/tel/sop/updateArrangeStatus', data })
}

// 删除计划
export const deleteArrangeApi = (arrangeId: number): Promise<IResponse<any>> => {
  return request.delete({ url: `/tel/sop/deleteArrange?arrangeId=${arrangeId}` })
}
