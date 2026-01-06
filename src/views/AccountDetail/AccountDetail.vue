<script setup lang="ts">
import { ref } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElPagination } from 'element-plus'
import { Icon } from '@/components/Icon'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

// 账户概览数据
const accountSummary = ref({
  totalConsumption: 1273,
  currentBalance: 3985
})

// 账单明细数据
const billList = ref([
  { id: 1, patientName: '张三', date: '2025年01月09日', consumption: 2.5, remaining: 2981 },
  { id: 2, patientName: '李四', date: '2025年01月08日', consumption: 3.2, remaining: 2983.5 },
  { id: 3, patientName: '王五', date: '2025年01月08日', consumption: 1.8, remaining: 2986.7 },
  { id: 4, patientName: '赵六', date: '2025年01月07日', consumption: 4.5, remaining: 2988.5 },
  { id: 5, patientName: '钱七', date: '2025年01月07日', consumption: 2.1, remaining: 2993 },
  { id: 6, patientName: '孙八', date: '2025年01月06日', consumption: 3.8, remaining: 2995.1 },
  { id: 7, patientName: '周九', date: '2025年01月06日', consumption: 2.9, remaining: 2998.9 },
  { id: 8, patientName: '吴十', date: '2025年01月05日', consumption: 1.5, remaining: 3001.8 }
])

// 分页数据
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 50
})

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
}
</script>

<template>
  <div class="p-20px bg-gray-50 min-h-full">
    <!-- 账户概览 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-20px mb-28px">
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
    <div class="bg-white rounded-16px shadow-sm overflow-hidden">
      <!-- 标题栏 -->
      <div class="flex items-center justify-between px-24px py-16px border-b border-gray-100">
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
        :data="billList"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        class="custom-table"
      >
        <ElTableColumn
          prop="patientName"
          :label="t('accountDetail.patientName')"
          min-width="180"
          align="center"
        >
          <template #default="{ row }">
            <span class="font-500 text-gray-800">{{ row.patientName }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="date" :label="t('accountDetail.date')" min-width="180" align="center">
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.date }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="consumption"
          :label="t('accountDetail.consumption')"
          min-width="150"
          align="center"
        >
          <template #default="{ row }">
            <span class="text-orange-500 font-500"
              >-{{ row.consumption }}{{ t('common.minutes') }}</span
            >
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="remaining"
          :label="t('accountDetail.remaining')"
          min-width="150"
          align="center"
        >
          <template #default="{ row }">
            <span class="text-blue-600 font-500">{{ row.remaining }}{{ t('common.minutes') }}</span>
          </template>
        </ElTableColumn>
      </ElTable>

      <!-- 分页 -->
      <div class="flex justify-center py-16px border-t border-gray-100">
        <ElPagination
          v-model:current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 概览卡片 */
.summary-card {
  padding: 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  transition: all 0.3s;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgb(0 0 0 / 8%);
}

/* 表格整体样式 */
.custom-table {
  --el-table-border-color: transparent;
}

:deep(.el-table) {
  --el-table-header-bg-color: #f8fafc;
}

:deep(.el-table__header th) {
  padding: 14px 0 !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #475569 !important;
  background: #f8fafc !important;
  border-bottom: 1px solid #e2e8f0 !important;
}

:deep(.el-table__header th .cell) {
  padding: 0 16px !important;
}

:deep(.el-table__body td) {
  padding: 14px 0 !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

:deep(.el-table__body td .cell) {
  padding: 0 16px !important;
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
