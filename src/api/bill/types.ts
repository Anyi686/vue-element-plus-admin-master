// 账单明细类型
export interface BillDetailType {
  name: string
  createTime: string
  customerId: number
  minutes: number
  rest: string
  type: number
}

// 账单明细列表响应
export interface BillDetailListResult {
  list: BillDetailType[]
  total?: number
}
