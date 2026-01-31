<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElPagination, ElMessage } from 'element-plus'
import { Icon } from '@/components/Icon'
import { useI18n } from '@/hooks/web/useI18n'
import { getBillDetailListApi } from '@/api/bill'
import type { BillDetailType } from '@/api/bill/types'

const { t } = useI18n()

// 加载状态
const loading = ref(false)

// 账户概览数据
const accountSummary = ref({
  totalConsumption: 0,
  currentBalance: 0
})

// 账单明细数据
const billList = ref<BillDetailType[]>([])

// 分页数据
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 格式化时间显示
const formatDateTime = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString.replace(/-/g, '/'))
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}年${month}月${day}日 ${hours}:${minutes}`
}

// 加载账单明细数据
const loadBillDetails = async () => {
  loading.value = true
  try {
    const res = await getBillDetailListApi({
      page: pagination.value.currentPage,
      size: pagination.value.pageSize
    })
    if (res.code === 200) {
      billList.value = res.data.list || []
      pagination.value.total = res.data.total || 0

      // 计算总消费和当前余额
      if (billList.value.length > 0) {
        // 总消费 = 所有记录的 minutes 之和
        accountSummary.value.totalConsumption = billList.value.reduce(
          (sum, item) => sum + (item.minutes || 0),
          0
        )
        // 当前余额 = 最后一条记录的 rest（取绝对值，因为 rest 可能是负数）
        const lastRest = billList.value[billList.value.length - 1]?.rest
        if (lastRest) {
          accountSummary.value.currentBalance = Math.abs(parseFloat(lastRest) || 0)
        }
      }
    } else {
      ElMessage.error('获取账单明细失败')
    }
  } catch (error) {
    console.error('获取账单明细失败:', error)
    ElMessage.error('获取账单明细失败，请重试')
  } finally {
    loading.value = false
  }
}

// 表格行样式
const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

// 充值
const handleRecharge = () => {
  console.log('充值')
}

// 分页变化
const handlePageChange = (page: number) => {
  pagination.value.currentPage = page
  loadBillDetails()
}

const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  pagination.value.currentPage = 1
  loadBillDetails()
}

// 组件挂载时加载数据
onMounted(() => {
  loadBillDetails()
})
</script>

<template>
  <div class="account-detail-container flex flex-col bg-gray-100 gap-16px">
    <!-- 账户概览 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-16px flex-shrink-0">
      <!-- 总消费卡片 -->
      <div class="summary-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-14px text-gray-500 mb-8px">{{
              t('accountDetail.totalConsumption')
            }}</div>
            <div class="text-32px font-700 text-gray-800">
              {{ accountSummary.totalConsumption }}
              <span class="text-16px font-400 text-gray-500 ml-4px">{{ t('common.minutes') }}</span>
            </div>
          </div>
          <Icon icon="ep:phone-filled" :size="48" color="#fb923c" />
        </div>
      </div>

      <!-- 当前余额卡片 -->
      <div class="summary-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-14px text-gray-500 mb-8px">{{
              t('accountDetail.currentBalance')
            }}</div>
            <div class="text-32px font-700 text-indigo-600">
              {{ accountSummary.currentBalance }}
              <span class="text-16px font-400 text-gray-500 ml-4px">{{ t('common.minutes') }}</span>
            </div>
          </div>
          <Icon icon="ep:coin" :size="48" color="#818cf8" />
        </div>
      </div>
    </div>

    <!-- 账单明细 -->
    <div class="table-wrapper flex-1 bg-white rounded-16px shadow-sm overflow-hidden flex flex-col">
      <!-- 标题栏 -->
      <div
        class="flex items-center justify-between px-20px py-14px border-b border-gray-100 flex-shrink-0"
      >
        <div class="text-16px font-600 text-gray-800 flex items-center">
          <span class="w-4px h-18px bg-blue-500 rounded-full mr-10px"></span>
          {{ t('accountDetail.billDetails') }}
        </div>
        <ElButton type="primary" @click="handleRecharge">
          <Icon icon="ep:plus" class="mr-4px" />
          {{ t('accountDetail.recharge') }}
        </ElButton>
      </div>

      <!-- 表格 -->
      <ElTable
        v-loading="loading"
        :data="billList"
        style="width: 100%"
        class="flex-1 custom-table"
        :row-class-name="tableRowClassName"
      >
        <ElTableColumn
          prop="name"
          :label="t('accountDetail.patientName')"
          min-width="180"
          align="center"
        >
          <template #default="{ row }">
            <span class="font-500 text-gray-800">{{ row.name || '-' }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="createTime"
          :label="t('accountDetail.date')"
          min-width="180"
          align="center"
        >
          <template #default="{ row }">
            <span class="text-gray-600">{{ formatDateTime(row.createTime) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="minutes"
          :label="t('accountDetail.consumption')"
          min-width="150"
          align="center"
        >
          <template #default="{ row }">
            <span class="text-orange-500 font-500"
              >-{{ row.minutes || 0 }}{{ t('common.minutes') }}</span
            >
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="rest"
          :label="t('accountDetail.remaining')"
          min-width="150"
          align="center"
        >
          <template #default="{ row }">
            <span class="text-blue-600 font-500"
              >{{ Math.abs(parseFloat(row.rest) || 0) }}{{ t('common.minutes') }}</span
            >
          </template>
        </ElTableColumn>
      </ElTable>

      <!-- 分页 -->
      <div class="flex justify-end p-12px border-t border-gray-100 flex-shrink-0">
        <ElPagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 容器高度自适应 */
.account-detail-container {
  height: calc(100vh - 170px);
  overflow: hidden;
}

/* 概览卡片 */
.summary-card {
  padding: 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 5%);
  transition: all 0.3s;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgb(0 0 0 / 8%);
}

/* 表格容器 */
.table-wrapper {
  min-height: 0;
}

/* 表格整体样式 */
.custom-table {
  --el-table-border-color: transparent;

  overflow: auto;
}

:deep(.custom-table .el-table__inner-wrapper) {
  height: 100%;
}

:deep(.el-table) {
  --el-table-header-bg-color: transparent;
}

:deep(.el-table__header th) {
  padding: 14px 0 !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #fff !important;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
  border: none !important;
}

:deep(.el-table__header th .cell) {
  color: #fff !important;
}

:deep(.el-table__body td) {
  padding: 14px 0 !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

:deep(.el-table__body td .cell) {
  padding: 0 16px !important;
}

/* 表格行样式 */
:deep(.el-table__body tr) {
  transition: all 0.3s ease;
}

/* 斑马纹 */
:deep(.el-table .even-row) {
  background-color: #fff !important;
}

:deep(.el-table .odd-row) {
  background-color: #fafbfc !important;
}

/* 悬停效果 */
:deep(.el-table__body tr:hover > td) {
  background-color: #f0f7ff !important;
}
</style>
