<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElMessage,
  ElPagination,
  ElInput,
  ElTag
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { getCustomerListApi } from '@/api/dataUpload'
import type { CustomerType } from '@/api/dataUpload/types'

const { t } = useI18n()

// 患者列表数据
const patientList = ref<CustomerType[]>([])

// 加载状态
const tableLoading = ref(false)

// 搜索表单
const searchForm = reactive({
  name: '',
  phone: ''
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 加载数据
const loadData = async () => {
  tableLoading.value = true
  try {
    const res = await getCustomerListApi({
      page: pagination.currentPage,
      size: pagination.pageSize,
      name: searchForm.name || undefined,
      mobile: searchForm.phone || undefined
    })
    if (res.code === 200) {
      patientList.value = res.data.list || []
      pagination.total = res.data.total || patientList.value.length
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    tableLoading.value = false
  }
}

// 初始化加载
onMounted(() => {
  loadData()
})

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  loadData()
}

// 重置搜索
const handleReset = () => {
  searchForm.name = ''
  searchForm.phone = ''
  pagination.currentPage = 1
  loadData()
}

// 分页变化
const handlePageChange = (page: number) => {
  pagination.currentPage = page
  loadData()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadData()
}

// 表格行样式
const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

// 获取状态标签类型
const getStatusTagType = (
  status: string
): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    已预约: 'primary',
    已确认: 'success',
    待确认: 'warning',
    已取消: 'danger',
    未就诊: 'info'
  }
  return map[status] || 'info'
}
</script>

<template>
  <div class="patient-manage-container flex flex-col bg-gray-100 gap-16px">
    <!-- 页面标题 -->
    <div class="text-16px font-600 text-gray-800 flex items-center flex-shrink-0">
      <span class="w-4px h-18px bg-blue-500 rounded-full mr-10px"></span>
      {{ t('router.patientManage') }}
    </div>

    <!-- 搜索区域 -->
    <div class="search-wrapper bg-white rounded-12px shadow-sm p-16px flex-shrink-0">
      <div class="flex flex-wrap gap-12px items-center">
        <ElInput
          v-model="searchForm.name"
          placeholder="患者姓名"
          clearable
          class="!w-140px"
          @keyup.enter="handleSearch"
        />
        <ElInput
          v-model="searchForm.phone"
          placeholder="手机号"
          clearable
          class="!w-140px"
          @keyup.enter="handleSearch"
        />
        <div class="flex gap-8px">
          <ElButton type="primary" @click="handleSearch">搜索</ElButton>
          <ElButton @click="handleReset">重置</ElButton>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-wrapper flex-1 bg-white rounded-16px shadow-sm overflow-hidden flex flex-col">
      <ElTable
        v-loading="tableLoading"
        :data="patientList"
        style="width: 100%"
        class="flex-1 custom-table"
        :row-class-name="tableRowClassName"
      >
        <ElTableColumn prop="name" label="患者姓名" min-width="100" align="center">
          <template #default="{ row }">
            <span class="font-500 text-gray-800">{{ row.name }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="age" label="年龄" min-width="70" align="center">
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.age }}岁</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="phone" label="手机" min-width="130" align="center">
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.phone }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="birthDate" label="出生日期" min-width="110" align="center">
          <template #default="{ row }">
            <span class="text-gray-500">{{ row.birthDate }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="assignTime" label="预约时间" min-width="160" align="center">
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.assignTime }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="doctor" label="预约医生" min-width="100" align="center">
          <template #default="{ row }">
            <ElTag type="success" size="small">{{ row.doctor }}</ElTag>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="status" label="就诊状态" min-width="100" align="center">
          <template #default="{ row }">
            <ElTag :type="getStatusTagType(row.status)" size="small" effect="light" round>
              {{ row.status }}
            </ElTag>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="plan" label="计划" min-width="100" align="center">
          <template #default="{ row }">
            <span class="text-blue-600 font-500">{{ row.plan }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="creator" label="创建人" min-width="90" align="center">
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.creator }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="createTime" label="创建时间" min-width="160" align="center">
          <template #default="{ row }">
            <span class="text-gray-500 text-12px">{{ row.createTime }}</span>
          </template>
        </ElTableColumn>
      </ElTable>

      <!-- 分页器 -->
      <div class="flex justify-end p-12px border-t border-gray-100">
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
.patient-manage-container {
  height: calc(100vh - 170px);
  overflow: hidden;
}

/* 搜索区域 */
.search-wrapper {
  flex-shrink: 0;
}

/* 表格容器 */
.table-wrapper {
  min-height: 0;
}

/* 表格整体样式 */
.custom-table {
  --el-table-border-color: transparent;
}

:deep(.el-table) {
  overflow: hidden;
  border-radius: 16px;
}

/* 表头样式 */
:deep(.el-table__header-wrapper) {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

:deep(.el-table__header th) {
  padding: 14px 0 !important;
  font-size: 13px;
  font-weight: 600 !important;
  color: #fff !important;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
  border: none !important;
}

:deep(.el-table__header th .cell) {
  color: #fff !important;
}

/* 表格行样式 */
:deep(.el-table__body tr) {
  transition: all 0.3s ease;
}

:deep(.el-table__body tr:hover > td) {
  background-color: #eef2ff !important;
}

:deep(.el-table__body tr.even-row > td) {
  background-color: #fff;
}

:deep(.el-table__body tr.odd-row > td) {
  background-color: #f8fafc;
}

/* 单元格样式 */
:deep(.el-table__body td) {
  padding: 12px 0 !important;
  font-size: 13px;
  vertical-align: middle;
  border-bottom: 1px solid #f1f5f9 !important;
}

:deep(.el-table__body td .cell) {
  padding: 0 12px;
}

/* 最后一行去除底部边框 */
:deep(.el-table__body tr:last-child td) {
  border-bottom: none !important;
}

/* 按钮样式优化 */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  box-shadow: 0 2px 4px rgb(59 130 246 / 30%);
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 8px rgb(59 130 246 / 40%);
}

/* 搜索输入框样式 */
:deep(.el-input__wrapper) {
  border-radius: 6px;
}

/* 标签样式 */
:deep(.el-tag--success) {
  color: #065f46;
  background: #d1fae5;
  border-color: #a7f3d0;
}

:deep(.el-tag--info) {
  color: #3730a3;
  background: #e0e7ff;
  border-color: #c7d2fe;
}

:deep(.el-tag) {
  border: none;
}
</style>
