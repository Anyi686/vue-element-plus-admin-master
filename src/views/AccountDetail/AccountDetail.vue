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

const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  pagination.value.currentPage = 1
}
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
    <div class="table-wrapper flex-1 bg-white rounded-12px shadow-sm overflow-hidden flex flex-col">
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
        :data="billList"
        style="width: 100%"
        class="flex-1 custom-table"
        :row-class-name="tableRowClassName"
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
  border-radius: 12px;
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
