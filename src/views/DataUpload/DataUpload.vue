<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElTag,
  ElDialog,
  ElUpload,
  ElMessage,
  ElEmpty,
  ElPagination,
  ElSkeleton,
  ElSkeletonItem
} from 'element-plus'
import { Icon } from '@/components/Icon'
import type { UploadRequestOptions } from 'element-plus'
import {
  getCustomerListApi,
  uploadCustomerApi,
  getSopTemplatesApi,
  getFileHistoryApi
} from '@/api/dataUpload'
import type { CustomerType, SopTemplateType, FileHistoryType } from '@/api/dataUpload/types'

// 左侧导入类型列表
const importTypes = ref<SopTemplateType[]>([])

// 菜单加载状态
const menuLoading = ref(false)

// 加载导入类型数据
const loadImportTypes = async () => {
  menuLoading.value = true
  try {
    const res = await getSopTemplatesApi()
    if (res.code === 200) {
      importTypes.value = res.data.list || []
      if (importTypes.value.length > 0) {
        activeType.value = importTypes.value[0].typeId
        loadTableData()
      }
    }
  } catch (error) {
    console.error('加载菜单失败:', error)
    ElMessage.error('加载菜单失败')
  } finally {
    menuLoading.value = false
  }
}

// 当前选中的导入类型
const activeType = ref(0)

// 初始化加载
onMounted(() => {
  loadImportTypes()
})

// 格式化今天日期
const formatTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

// 导入时间和数据统计
const importInfo = computed(() => {
  return {
    date: formatTodayDate(),
    count: tableData.value.length
  }
})

// 表格数据
const tableData = ref<CustomerType[]>([])

// 获取当前选中菜单的type
const getCurrentType = () => {
  const current = importTypes.value.find((item) => item.typeId === activeType.value)
  return current?.type || 0
}

// 加载表格数据
const loadTableData = async () => {
  tableLoading.value = true
  try {
    const res = await getCustomerListApi({
      page: tablePagination.currentPage,
      size: tablePagination.pageSize,
      typeId: activeType.value,
      type: getCurrentType()
    })
    if (res.code === 200) {
      tableData.value = res.data.list || []
      tablePagination.total = res.data.total || tableData.value.length
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    tableLoading.value = false
  }
}

// 导入弹窗
const importDialogVisible = ref(false)

// 导入历史弹窗
const historyDialogVisible = ref(false)

// 导入历史数据
const historyData = ref<FileHistoryType[]>([])

// 加载导入历史数据
const loadHistoryData = async () => {
  historyLoading.value = true
  try {
    const res = await getFileHistoryApi({
      page: historyPagination.currentPage,
      size: historyPagination.pageSize,
      type: getCurrentType(),
      typeId: activeType.value
    })
    if (res.code === 200) {
      historyData.value = res.data.list || []
      historyPagination.total = res.data.total || 0
    }
  } catch (error) {
    console.error('加载历史数据失败:', error)
    ElMessage.error('加载历史数据失败')
  } finally {
    historyLoading.value = false
  }
}

// 表格加载状态
const tableLoading = ref(false)
const historyLoading = ref(false)

// 主表格分页
const tablePagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 导入历史分页
const historyPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 切换导入类型
const handleTypeChange = (id: number) => {
  if (activeType.value === id) return
  activeType.value = id
  tablePagination.currentPage = 1
  loadTableData()
}

// 打开导入弹窗
const handleImport = () => {
  importDialogVisible.value = true
}

// 下载模板
const handleDownloadTemplate = () => {
  const link = document.createElement('a')
  link.href = '/模版.xlsx'
  link.download = '导入模版.xlsx'
  link.click()
}

// 查看导入历史
const handleViewHistory = () => {
  historyDialogVisible.value = true
  historyPagination.currentPage = 1
  loadHistoryData()
}

// 自定义上传方法
const handleCustomUpload = async (options: UploadRequestOptions) => {
  const formData = new FormData()
  formData.append('file', options.file)
  formData.append('typeId', String(activeType.value))
  formData.append('type', String(getCurrentType()))

  try {
    const res = (await uploadCustomerApi(formData)) as any
    if (res.code === 200 && res.message !== '任务不存在') {
      ElMessage.success('数据导入成功')
      importDialogVisible.value = false
      loadTableData()
    } else {
      ElMessage.error(res.message || res.data?.message || '导入失败')
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败，请重试')
  }
}

// 获取状态标签类型
const getStatusTagType = (
  status: string
): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    已预约: 'primary',
    已确认: 'success',
    待确认: 'warning',
    已取消: 'danger'
  }
  return map[status] || 'info'
}

// 表格行样式
const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

// 主表格总数（使用后端返回的total）
const tableTotal = computed(() => tablePagination.total)

// 导入历史总数
const historyTotal = computed(() => historyPagination.total)

// 主表格分页变化
const handleTablePageChange = (page: number) => {
  tablePagination.currentPage = page
  loadTableData()
}

const handleTableSizeChange = (size: number) => {
  tablePagination.pageSize = size
  tablePagination.currentPage = 1
  loadTableData()
}

// 导入历史分页变化
const handleHistoryPageChange = (page: number) => {
  historyPagination.currentPage = page
  loadHistoryData()
}

const handleHistorySizeChange = (size: number) => {
  historyPagination.pageSize = size
  historyPagination.currentPage = 1
  loadHistoryData()
}
</script>

<template>
  <div class="data-upload-container flex bg-gray-100 gap-16px">
    <!-- 左侧导入类型列表 -->
    <div class="left-sidebar flex-shrink-0">
      <div class="left-menu-wrapper bg-white rounded-12px shadow-sm p-12px">
        <!-- 加载骨架屏 -->
        <template v-if="menuLoading">
          <div v-for="i in 7" :key="i" class="mb-8px last:mb-0">
            <ElSkeleton animated>
              <template #template>
                <ElSkeletonItem variant="text" class="!h-40px !rounded-8px" />
              </template>
            </ElSkeleton>
          </div>
        </template>
        <!-- 菜单列表 -->
        <template v-else>
          <div
            v-for="item in importTypes"
            :key="item.typeId"
            :class="[
              'flex items-center gap-8px px-14px py-12px rounded-8px cursor-pointer transition-all duration-200 mb-8px last:mb-0',
              activeType === item.typeId
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            ]"
            @click="handleTypeChange(item.typeId)"
          >
            <span class="text-13px font-500 whitespace-normal break-words leading-tight">{{
              item.name
            }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- 右侧内容区 -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- 顶部操作栏 -->
      <div class="flex justify-between items-center mb-16px flex-shrink-0">
        <!-- 左侧统计信息 -->
        <div class="flex items-center gap-8px">
          <span class="text-16px font-600 text-blue-600">导入时间：{{ importInfo.date }}</span>
          <span class="text-16px font-600 text-gray-800">共：</span>
          <span class="text-18px font-700 text-blue-600">{{ importInfo.count }}</span>
          <span class="text-16px font-600 text-gray-800">条数据</span>
        </div>

        <!-- 右侧操作按钮 -->
        <div class="flex items-center gap-12px">
          <ElButton type="primary" class="!rounded-8px" @click="handleImport">
            <Icon icon="ep:upload" class="mr-6px" />
            导入
          </ElButton>
          <ElButton
            class="!rounded-8px !border-blue-500 !text-blue-500"
            @click="handleDownloadTemplate"
          >
            <Icon icon="ep:download" class="mr-6px" />
            模板下载
          </ElButton>
        </div>
      </div>

      <!-- 导入历史按钮 -->
      <div class="flex justify-end mb-12px flex-shrink-0">
        <ElButton
          type="primary"
          class="!rounded-8px !bg-gradient-to-r !from-indigo-500 !to-purple-500 !border-none"
          @click="handleViewHistory"
        >
          <Icon icon="ep:clock" class="mr-6px" />
          导入历史
        </ElButton>
      </div>

      <!-- 数据表格 -->
      <div
        class="table-wrapper flex-1 bg-white rounded-16px shadow-sm overflow-hidden flex flex-col"
      >
        <ElTable
          v-loading="tableLoading"
          :data="tableData"
          style="width: 100%"
          class="flex-1 custom-table"
          :row-class-name="tableRowClassName"
        >
          <ElTableColumn prop="name" label="患者姓名" min-width="100" align="center" fixed>
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
              <span class="text-gray-600">{{ row.birthDate }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="assignTime" label="预约时间" min-width="160" align="center">
            <template #default="{ row }">
              <span class="text-gray-600">{{ row.assignTime }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="doctor" label="预约医生" min-width="100" align="center">
            <template #default="{ row }">
              <span class="text-gray-700 font-500">{{ row.doctor }}</span>
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
          <template #empty>
            <ElEmpty description="暂无数据" />
          </template>
        </ElTable>
        <!-- 分页器 -->
        <div class="flex justify-end p-12px border-t border-gray-100">
          <ElPagination
            v-model:current-page="tablePagination.currentPage"
            v-model:page-size="tablePagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="tableTotal"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleTableSizeChange"
            @current-change="handleTablePageChange"
          />
        </div>
      </div>
    </div>

    <!-- 导入弹窗 -->
    <ElDialog v-model="importDialogVisible" title="数据导入" width="500px">
      <div class="p-20px">
        <div class="mb-16px text-14px text-gray-600">
          请选择要导入的Excel文件，文件格式需与模板一致
        </div>
        <ElUpload
          class="upload-area"
          drag
          :auto-upload="true"
          :http-request="handleCustomUpload"
          accept=".xlsx,.xls"
          :show-file-list="false"
        >
          <div class="py-40px">
            <Icon icon="ep:upload-filled" class="text-48px text-blue-400 mb-12px" />
            <div class="text-14px text-gray-600 mb-8px">将文件拖到此处，或点击上传</div>
            <div class="text-12px text-gray-400">支持 .xlsx, .xls 格式</div>
          </div>
        </ElUpload>
      </div>
      <template #footer>
        <ElButton @click="importDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="importDialogVisible = false">确认导入</ElButton>
      </template>
    </ElDialog>

    <!-- 导入历史弹窗 -->
    <ElDialog v-model="historyDialogVisible" title="导入历史" width="800px">
      <ElTable v-loading="historyLoading" :data="historyData" style="width: 100%" max-height="300">
        <ElTableColumn prop="createTime" label="导入日期" min-width="160" />
        <ElTableColumn prop="count" label="导入数量" min-width="100" />
        <ElTableColumn prop="item" label="导入类目" min-width="140" />
        <ElTableColumn prop="desc" label="执行情况" min-width="200" />
      </ElTable>
      <!-- 分页器 -->
      <div class="flex justify-end pt-16px">
        <ElPagination
          v-model:current-page="historyPagination.currentPage"
          v-model:page-size="historyPagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="historyTotal"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleHistorySizeChange"
          @current-change="handleHistoryPageChange"
        />
      </div>
    </ElDialog>
  </div>
</template>

<style scoped>
/* 容器高度自适应 */
.data-upload-container {
  height: calc(100vh - 170px);
  overflow: hidden;
}

/* 左侧边栏宽度和高度 */
.left-sidebar {
  width: auto;
  height: 100%;
  max-width: 200px;
  min-width: 160px;
}

/* 左侧菜单填充高度 */
.left-menu-wrapper {
  height: 100%;
  overflow-y: auto;
}

/* 左侧菜单滚动条样式 */
.left-menu-wrapper::-webkit-scrollbar {
  width: 4px;
}

.left-menu-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.left-menu-wrapper::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 2px;
}

.left-menu-wrapper::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
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
  border-bottom: 1px solid #f1f5f9 !important;
}

:deep(.el-table__body td .cell) {
  padding: 0 12px;
}

/* 固定列样式 */
:deep(.el-table__fixed-right),
:deep(.el-table__fixed) {
  box-shadow: none;
}

/* 上传区域样式 */
.upload-area {
  width: 100%;
}

:deep(.upload-area .el-upload) {
  width: 100%;
}

:deep(.upload-area .el-upload-dragger) {
  width: 100%;
  background: #f9fafb;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s;
}

:deep(.upload-area .el-upload-dragger:hover) {
  background: #eff6ff;
  border-color: #3b82f6;
}

/* Tag 样式 */
:deep(.el-tag) {
  border: none;
}
</style>
