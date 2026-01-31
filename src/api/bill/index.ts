import request from '@/axios'
import type { BillDetailListResult } from './types'

// 获取账单明细列表
export const getBillDetailListApi = (params: {
  page: number
  size: number
}): Promise<IResponse<BillDetailListResult>> => {
  return request.get({ url: '/tel/customer/bill', params })
}
