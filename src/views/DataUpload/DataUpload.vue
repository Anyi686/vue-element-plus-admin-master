<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElTag,
  ElDialog,
  ElUpload,
  ElMessage,
  ElEmpty,
  ElPagination
} from 'element-plus'
import { Icon } from '@/components/Icon'
import type { UploadProps } from 'element-plus'

// 左侧导入类型列表
const importTypes = ref([
  { id: 1, name: '预约导入', icon: 'ep:calendar' },
  { id: 2, name: '新患者开发导入', icon: 'ep:user-filled' },
  { id: 3, name: '老患者激活导入', icon: 'ep:refresh' },
  { id: 4, name: '患者sop全年计划导入', icon: 'ep:document' },
  { id: 5, name: '五个定期计划', icon: 'ep:timer' },
  { id: 6, name: 'PMTC预防会员导入', icon: 'ep:medal' },
  { id: 7, name: '自定义跟进计划', icon: 'ep:edit' }
])

// 当前选中的导入类型
const activeType = ref(1)

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
const tableData = ref([
  {
    id: 1,
    name: '张三',
    age: 35,
    appointmentTime: '2026-03-18 09:30',
    recordNo: 'MR20260318001',
    phone: '138****5678',
    birthDate: '1991-05-12',
    duration: '30分钟',
    doctor: '李医生',
    visitStatus: '已预约',
    creator: '王助理',
    visitType: '初诊',
    createTime: '2026-03-17 14:30'
  },
  {
    id: 2,
    name: '李四',
    age: 28,
    appointmentTime: '2026-03-18 10:00',
    recordNo: 'MR20260318002',
    phone: '139****1234',
    birthDate: '1998-08-20',
    duration: '45分钟',
    doctor: '张医生',
    visitStatus: '已确认',
    creator: '王助理',
    visitType: '复诊',
    createTime: '2026-03-17 15:20'
  },
  {
    id: 3,
    name: '王五',
    age: 45,
    appointmentTime: '2026-03-18 11:00',
    recordNo: 'MR20260318003',
    phone: '137****8901',
    birthDate: '1981-02-15',
    duration: '60分钟',
    doctor: '陈医生',
    visitStatus: '待确认',
    creator: '李助理',
    visitType: '初诊',
    createTime: '2026-03-17 16:45'
  },
  {
    id: 4,
    name: '赵六',
    age: 52,
    appointmentTime: '2026-03-18 14:00',
    recordNo: 'MR20260318004',
    phone: '136****2345',
    birthDate: '1974-11-08',
    duration: '30分钟',
    doctor: '李医生',
    visitStatus: '已预约',
    creator: '张助理',
    visitType: '复诊',
    createTime: '2026-03-17 17:10'
  },
  {
    id: 5,
    name: '孙七',
    age: 31,
    appointmentTime: '2026-03-18 15:30',
    recordNo: 'MR20260318005',
    phone: '135****6789',
    birthDate: '1995-07-22',
    duration: '45分钟',
    doctor: '张医生',
    visitStatus: '已确认',
    creator: '王助理',
    visitType: '初诊',
    createTime: '2026-03-17 18:00'
  },
  {
    id: 6,
    name: '周八',
    age: 39,
    appointmentTime: '2026-03-18 16:00',
    recordNo: 'MR20260318006',
    phone: '134****3456',
    birthDate: '1987-03-18',
    duration: '30分钟',
    doctor: '陈医生',
    visitStatus: '待确认',
    creator: '李助理',
    visitType: '复诊',
    createTime: '2026-03-17 18:30'
  },
  {
    id: 7,
    name: '吴九',
    age: 26,
    appointmentTime: '2026-03-19 09:00',
    recordNo: 'MR20260318007',
    phone: '133****7890',
    birthDate: '2000-01-05',
    duration: '60分钟',
    doctor: '李医生',
    visitStatus: '已预约',
    creator: '张助理',
    visitType: '初诊',
    createTime: '2026-03-17 19:00'
  },
  {
    id: 8,
    name: '郑十',
    age: 48,
    appointmentTime: '2026-03-19 10:30',
    recordNo: 'MR20260318008',
    phone: '132****4567',
    birthDate: '1978-09-30',
    duration: '45分钟',
    doctor: '张医生',
    visitStatus: '已确认',
    creator: '王助理',
    visitType: '复诊',
    createTime: '2026-03-17 19:30'
  }
])

// 导入弹窗
const importDialogVisible = ref(false)

// 导入历史弹窗
const historyDialogVisible = ref(false)

// 导入历史数据
const historyData = ref([
  {
    id: 1,
    date: '2026年01月15日',
    count: 1927,
    category: '老患者激活',
    result: '拨通：1320人，未拨通：607人'
  },
  {
    id: 2,
    date: '2026年01月12日',
    count: 856,
    category: '预约导入',
    result: '拨通：652人，未拨通：204人'
  },
  {
    id: 3,
    date: '2026年01月10日',
    count: 2341,
    category: '新患者开发导入',
    result: '拨通：1856人，未拨通：485人'
  },
  {
    id: 4,
    date: '2026年01月08日',
    count: 1205,
    category: '患者sop全年计划导入',
    result: '拨通：987人，未拨通：218人'
  },
  {
    id: 5,
    date: '2026年01月05日',
    count: 678,
    category: 'PMTC预防会员导入',
    result: '拨通：521人，未拨通：157人'
  }
])

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
  tableLoading.value = true
  activeType.value = id
  // 模拟加载数据
  setTimeout(() => {
    tableLoading.value = false
  }, 500)
}

// 打开导入弹窗
const handleImport = () => {
  importDialogVisible.value = true
}

// 下载数据
const handleDownloadTemplate = () => {
  ElMessage.success('数据下载中...')
  const templateName = importTypes.value.find((t) => t.id === activeType.value)?.name || '导入数据'

  // 表头
  const headers = [
    '患者姓名',
    '年龄',
    '预约时间',
    '病历号',
    '手机',
    '出生日期',
    '预约时长',
    '预约医生',
    '就诊状态',
    '创建人',
    '就诊类型',
    '创建时间'
  ]

  // 数据行
  const rows = tableData.value.map((row) => [
    row.name,
    row.age,
    row.appointmentTime,
    row.recordNo,
    row.phone,
    row.birthDate,
    row.duration,
    row.doctor,
    row.visitStatus,
    row.creator,
    row.visitType,
    row.createTime
  ])

  // 生成CSV内容
  const csvContent =
    '\uFEFF' +
    headers.join(',') +
    '\n' +
    rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')

  // 创建Blob并下载
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${templateName}_${formatTodayDate()}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

// 查看导入历史
const handleViewHistory = () => {
  historyDialogVisible.value = true
}

// 上传成功
const handleUploadSuccess: UploadProps['onSuccess'] = () => {
  ElMessage.success('数据导入成功')
  importDialogVisible.value = false
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

// 主表格总数
const tableTotal = computed(() => tableData.value.length)

// 导入历史总数
const historyTotal = computed(() => historyData.value.length)

// 分页后的主表格数据
const paginatedTableData = computed(() => {
  const start = (tablePagination.currentPage - 1) * tablePagination.pageSize
  const end = start + tablePagination.pageSize
  return tableData.value.slice(start, end)
})

// 分页后的导入历史数据
const paginatedHistoryData = computed(() => {
  const start = (historyPagination.currentPage - 1) * historyPagination.pageSize
  const end = start + historyPagination.pageSize
  return historyData.value.slice(start, end)
})

// 主表格分页变化
const handleTablePageChange = (page: number) => {
  tablePagination.currentPage = page
}

const handleTableSizeChange = (size: number) => {
  tablePagination.pageSize = size
  tablePagination.currentPage = 1
}

// 导入历史分页变化
const handleHistoryPageChange = (page: number) => {
  historyPagination.currentPage = page
}

const handleHistorySizeChange = (size: number) => {
  historyPagination.pageSize = size
  historyPagination.currentPage = 1
}
</script>

<template>
  <div class="data-upload-container flex bg-gray-100 gap-16px">
    <!-- 左侧导入类型列表 -->
    <div class="left-sidebar w-200px flex-shrink-0">
      <div class="left-menu-wrapper bg-white rounded-12px shadow-sm p-12px">
        <div
          v-for="item in importTypes"
          :key="item.id"
          :class="[
            'flex items-center gap-8px px-14px py-12px rounded-8px cursor-pointer transition-all duration-200 mb-8px last:mb-0',
            activeType === item.id
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
              : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
          ]"
          @click="handleTypeChange(item.id)"
        >
          <Icon :icon="item.icon" class="text-16px flex-shrink-0" />
          <span class="text-13px font-500 whitespace-nowrap">{{ item.name }}</span>
        </div>
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
          :data="paginatedTableData"
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
          <ElTableColumn prop="appointmentTime" label="预约时间" min-width="150" align="center">
            <template #default="{ row }">
              <span class="text-gray-600">{{ row.appointmentTime }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="recordNo" label="病历号" min-width="140" align="center">
            <template #default="{ row }">
              <span class="text-blue-600 font-500">{{ row.recordNo }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="phone" label="手机" min-width="120" align="center">
            <template #default="{ row }">
              <span class="text-gray-600">{{ row.phone }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="birthDate" label="出生日期" min-width="110" align="center">
            <template #default="{ row }">
              <span class="text-gray-600">{{ row.birthDate }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="duration" label="预约时长" min-width="90" align="center">
            <template #default="{ row }">
              <ElTag type="info" size="small" effect="light" round>{{ row.duration }}</ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="doctor" label="预约医生" min-width="100" align="center">
            <template #default="{ row }">
              <span class="text-gray-700 font-500">{{ row.doctor }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="visitStatus" label="就诊状态" min-width="100" align="center">
            <template #default="{ row }">
              <ElTag :type="getStatusTagType(row.visitStatus)" size="small" effect="light" round>
                {{ row.visitStatus }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="creator" label="创建人" min-width="90" align="center">
            <template #default="{ row }">
              <span class="text-gray-600">{{ row.creator }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="visitType" label="就诊类型" min-width="90" align="center">
            <template #default="{ row }">
              <ElTag
                :type="row.visitType === '初诊' ? 'success' : 'warning'"
                size="small"
                effect="light"
                round
              >
                {{ row.visitType }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="createTime" label="创建时间" min-width="150" align="center">
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
          action="/api/upload"
          accept=".xlsx,.xls"
          :on-success="handleUploadSuccess"
          :limit="1"
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
      <ElTable
        v-loading="historyLoading"
        :data="paginatedHistoryData"
        style="width: 100%"
        max-height="300"
      >
        <ElTableColumn prop="date" label="导入日期" min-width="140" />
        <ElTableColumn prop="count" label="导入数量" min-width="100" />
        <ElTableColumn prop="category" label="导入类目" min-width="140" />
        <ElTableColumn prop="result" label="执行情况" min-width="200" />
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

/* 左侧边栏固定高度 */
.left-sidebar {
  height: 100%;
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
