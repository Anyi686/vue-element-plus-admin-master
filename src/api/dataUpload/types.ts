// SOP模板类型（左侧菜单）
export interface SopTemplateType {
  id: number
  name: string
  type: number
  typeId: number
}

// SOP模板列表响应
export interface SopTemplateResult {
  list: SopTemplateType[]
}

// 客户数据类型
export interface CustomerType {
  id: string
  name: string
  assignTime: string
  phone: string
  docId: string | null
  birthDate: string
  createTime: string
  creator: string
  doctor: string
  status: string
  plan: string
  age: number
}

// 客户列表响应
export interface CustomerListResult {
  list: CustomerType[]
  total?: number
}

// 上传参数
export interface UploadParams {
  file: File
  typeId: number
  type: number // 1:SOP任务 2:SOP计划
}

// SOP任务类型
export interface SopTaskType {
  id: number
  name: string
  status: number
  count: number
  days: number
  timeStart?: string
  timeEnd?: string
}

// SOP任务列表响应
export interface SopTaskListResult {
  list: SopTaskType[]
}

// SOP计划（安排）类型
export interface SopArrangeType {
  id: number
  [key: string]: any
}

// SOP计划列表响应
export interface SopArrangeListResult {
  list: SopArrangeType[]
  total: number
  page: number
  size: number
}

// 上传历史记录类型
export interface FileHistoryType {
  createTime: string
  count: number
  item: string
  desc: string
}

// 上传历史列表响应
export interface FileHistoryResult {
  list: FileHistoryType[]
  total: number
  page: number
  size: number
}
