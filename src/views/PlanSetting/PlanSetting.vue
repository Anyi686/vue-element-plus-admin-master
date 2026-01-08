<script setup lang="ts">
import { ref, computed, reactive, nextTick } from 'vue'
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElInput,
  ElInputNumber,
  ElDialog,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption
} from 'element-plus'
import { Icon } from '@/components/Icon'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

// 左侧计划类型列表
const planTypes = ref([
  { id: 1, name: '新患者开发导入', key: 'newPatient', icon: 'ep:user-filled' },
  { id: 2, name: '老患者预约导入', key: 'oldPatient', icon: 'ep:refresh' },
  { id: 3, name: '预约导入', key: 'appointment', icon: 'ep:calendar' },
  { id: 4, name: '患者sop全年计划导入', key: 'sopPlan', icon: 'ep:document' },
  { id: 5, name: '五个定期计划', key: 'regularPlan', icon: 'ep:timer' },
  { id: 6, name: 'PMTC预防会员导入', key: 'pmtcMember', icon: 'ep:medal' },
  { id: 7, name: '自定义跟进计划', key: 'customPlan', icon: 'ep:edit' }
])

// 当前选中的计划类型
const activePlanType = ref('newPatient')

// 各计划类型对应的数据
const planDataMap = ref<Record<string, any[]>>({
  newPatient: [
    {
      id: 1,
      marketingDays: 1,
      scriptContent: `例：您之前在我们这儿做了那个种植牙，回去这段时间感觉怎么样？"
客户回应处理：
如果客户表示有问题。则可以恰当时间告知患者，"我跟医生反馈一下，然后给您回复"，并结束通话
如果客户没问题，则主要引导到店进行治疗后的维护保养
流程3：强调维护保养重要性
-目标：描述维护保养的重要性+邀约患者到店进行维护保养
-提示词：
例：恩，郭院长让我给您联系安排一次种植牙维护，这个种植牙要是想长久使用的话肯定是要做定期维护的，毕竟咱们花了那么多钱把这个牙种上了，也是想着说用得越久越好，您说是吧?
客户回应处理：是的
流程4：邀约到店
恩，郭院长专门给您安排的。可以先来免费做这个种植牙的维护，我要不帮咱们约个时间，来做个这个免费的种植牙维护?
客户回应处理：好的
行好，约什么时间您方便过来？"
客户回应处理：
--如果客户表示同意，则告诉客户，确认一下医生时间，给客户回复
如果客户首次--不同意，则将以下话术优化后回答
"行呀，那过段时间我再联系您，，不过这个一定要尽早哈，定期维护也能延长这个牙齿的使用寿命，就像咱们这个汽车一样，也需要做一做这个定期保养一样"
流程5：引导客户加微
-目标：以微信上给客户发送维护保养的方式方法以及以后可以通过微信来预约
-提示词：
--不同意，那这个电话号是您的微信号不？我一会儿加上您的微信，您通过一下哈，到时候您也可以通过微信跟我预约到店的时间哈，最主要的是门诊有什么最新信息我也可以第一时间发送给您哈
流程6：确认客户信息
-目标：如果是邀请客户加微信，必须先确认"这个手机号是您的微信号吗"
-提示词：`,
      taskDetail: '',
      enabled: true
    },
    {
      id: 2,
      marketingDays: 3,
      scriptContent: '',
      taskDetail: '',
      enabled: false
    },
    {
      id: 3,
      marketingDays: 7,
      scriptContent: '',
      taskDetail: '',
      enabled: false
    }
  ],
  oldPatient: [
    {
      id: 1,
      marketingDays: 1,
      scriptContent: '您好，我是XX口腔的客服，之前您在我们这边做过治疗，想回访一下您的恢复情况...',
      taskDetail: '回访老患者',
      enabled: true
    },
    {
      id: 2,
      marketingDays: 7,
      scriptContent: '您好，上次回访后想了解一下您现在的情况，是否需要来店复查...',
      taskDetail: '二次回访',
      enabled: false
    }
  ],
  appointment: [
    {
      id: 1,
      marketingDays: 1,
      scriptContent: '您好，提醒您明天有预约，请按时到店...',
      taskDetail: '预约提醒',
      enabled: true
    }
  ],
  sopPlan: [
    {
      id: 1,
      marketingDays: 7,
      scriptContent: 'SOP全年计划第一阶段话术内容...',
      taskDetail: '年度计划启动',
      enabled: true
    }
  ],
  regularPlan: [
    {
      id: 1,
      marketingDays: 30,
      scriptContent: '定期维护提醒话术...',
      taskDetail: '定期维护',
      enabled: true
    }
  ],
  pmtcMember: [
    {
      id: 1,
      marketingDays: 1,
      scriptContent: 'PMTC预防会员欢迎话术...',
      taskDetail: '会员欢迎',
      enabled: true
    }
  ],
  customPlan: [
    {
      id: 1,
      marketingDays: 1,
      scriptContent: '自定义跟进计划话术模板...',
      taskDetail: '自定义任务',
      enabled: false
    }
  ]
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 当前类型的全部数据
const currentPlanData = computed(() => {
  return planDataMap.value[activePlanType.value] || []
})

// 分页后的数据
const paginatedData = computed(() => {
  const data = currentPlanData.value
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return data.slice(start, end)
})

// 数据总数
const totalCount = computed(() => currentPlanData.value.length)

// 切换计划类型
const handlePlanTypeClick = (key: string) => {
  activePlanType.value = key
  pagination.currentPage = 1 // 切换类型时重置页码
}

// 分页变化
const handlePageChange = (page: number) => {
  pagination.currentPage = page
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
}

// 开启/关闭
const handleToggleEnable = (row: any) => {
  row.enabled = !row.enabled
  ElMessage.success(row.enabled ? '已开启' : '已关闭')
}

// 删除
const handleDelete = (_row: any, index: number) => {
  ElMessageBox.confirm('确定要删除该计划吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const currentData = planDataMap.value[activePlanType.value]
      currentData.splice(index, 1)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // 取消删除
    })
}

// 表格行样式
const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

// 编辑状态
const editingCell = ref<{ rowId: number; field: string } | null>(null)

// 双击开始编辑
const handleCellDblClick = (row: any, field: string) => {
  editingCell.value = { rowId: row.id, field }
  nextTick(() => {
    const input = document.querySelector(
      '.edit-input input, .edit-textarea textarea'
    ) as HTMLElement
    input?.focus()
  })
}

// 判断是否正在编辑
const isEditing = (row: any, field: string) => {
  return editingCell.value?.rowId === row.id && editingCell.value?.field === field
}

// 结束编辑
const handleEditFinish = () => {
  if (editingCell.value) {
    editingCell.value = null
    ElMessage.success('编辑成功')
  }
}

// 营销天数变化
const handleMarketingDaysChange = () => {
  ElMessage.success('编辑成功')
}

// 添加计划弹窗
const addDialogVisible = ref(false)
const addForm = reactive({
  planType: '',
  marketingDays: 1,
  scriptContent: ''
})

// 打开添加计划弹窗
const handleOpenAddDialog = () => {
  addForm.planType = activePlanType.value
  addForm.marketingDays = 1
  addForm.scriptContent = ''
  addDialogVisible.value = true
}

// 保存新计划
const handleSaveNewPlan = () => {
  if (!addForm.planType) {
    ElMessage.warning('请选择计划类型')
    return
  }
  if (!addForm.scriptContent.trim()) {
    ElMessage.warning('请输入话术内容')
    return
  }

  const targetData = planDataMap.value[addForm.planType]
  const maxId = targetData.length > 0 ? Math.max(...targetData.map((item) => item.id)) : 0

  const newPlan = {
    id: maxId + 1,
    marketingDays: addForm.marketingDays,
    scriptContent: addForm.scriptContent,
    taskDetail: '',
    enabled: false
  }

  targetData.push(newPlan)

  // 如果添加到当前选中的类型，切换到最后一页显示新数据
  if (addForm.planType === activePlanType.value) {
    const totalPages = Math.ceil(targetData.length / pagination.pageSize)
    pagination.currentPage = totalPages
  }

  ElMessage.success('添加成功')
  addDialogVisible.value = false
}
</script>

<template>
  <div class="plan-setting-container flex bg-gray-100 gap-16px">
    <!-- 左侧计划类型列表 -->
    <div class="left-sidebar w-200px flex-shrink-0">
      <div class="left-menu-wrapper bg-white rounded-12px shadow-sm p-12px">
        <div
          v-for="item in planTypes"
          :key="item.id"
          :class="[
            'flex items-center gap-8px px-14px py-12px rounded-8px cursor-pointer transition-all duration-200 mb-8px last:mb-0',
            activePlanType === item.key
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
              : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
          ]"
          @click="handlePlanTypeClick(item.key)"
        >
          <Icon :icon="item.icon" class="text-16px flex-shrink-0" />
          <span class="text-13px font-500 whitespace-nowrap">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <!-- 右侧表格区域 -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- 页面标题和添加按钮 -->
      <div class="flex items-center justify-between mb-16px flex-shrink-0">
        <div class="text-16px font-600 text-gray-800 flex items-center">
          <span class="w-4px h-18px bg-blue-500 rounded-full mr-10px"></span>
          {{ t('router.planSetting') }}
        </div>
        <ElButton type="primary" @click="handleOpenAddDialog">
          <Icon icon="ep:plus" class="mr-4px" />
          添加计划
        </ElButton>
      </div>

      <!-- 表格容器 -->
      <div
        class="table-wrapper flex-1 bg-white rounded-16px shadow-sm overflow-hidden flex flex-col"
      >
        <ElTable
          :data="paginatedData"
          style="width: 100%"
          class="flex-1 custom-table"
          :row-class-name="tableRowClassName"
        >
          <ElTableColumn prop="id" label="序号" width="80" align="center">
            <template #default="{ $index }">
              <span class="font-500 text-gray-800">{{
                (pagination.currentPage - 1) * pagination.pageSize + $index + 1
              }}</span>
            </template>
          </ElTableColumn>

          <ElTableColumn prop="marketingDays" label="营销天数" width="160" align="center">
            <template #default="{ row }">
              <div class="flex items-center justify-center gap-4px">
                <span class="text-gray-600 font-500">第</span>
                <ElInputNumber
                  v-model="row.marketingDays"
                  :min="1"
                  :max="365"
                  size="small"
                  controls-position="right"
                  class="marketing-days-input"
                  @change="handleMarketingDaysChange"
                />
                <span class="text-gray-600 font-500">天</span>
              </div>
            </template>
          </ElTableColumn>

          <ElTableColumn prop="scriptContent" label="话术内容" min-width="400">
            <template #default="{ row }">
              <ElInput
                v-if="isEditing(row, 'scriptContent')"
                v-model="row.scriptContent"
                type="textarea"
                :rows="8"
                class="edit-textarea"
                @blur="handleEditFinish"
                autofocus
              />
              <div
                v-else
                class="script-content text-gray-700 text-13px leading-relaxed whitespace-pre-wrap cursor-pointer editable-cell"
                @dblclick="handleCellDblClick(row, 'scriptContent')"
              >
                {{ row.scriptContent || '-' }}
              </div>
            </template>
          </ElTableColumn>

          <ElTableColumn prop="taskDetail" label="任务执行状态" width="150" align="center">
            <template #default="{ row }">
              <ElButton
                :type="row.enabled ? 'success' : 'primary'"
                size="small"
                round
                class="!px-16px"
                @click="handleToggleEnable(row)"
              >
                {{ row.enabled ? '已开启' : '开启' }}
              </ElButton>
            </template>
          </ElTableColumn>

          <ElTableColumn label="操作" width="100" align="center">
            <template #default="{ row, $index }">
              <ElButton
                type="danger"
                size="small"
                round
                plain
                class="!px-12px"
                @click="handleDelete(row, $index)"
              >
                删除
              </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
        <!-- 分页器 -->
        <div class="flex justify-end p-12px border-t border-gray-100">
          <ElPagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="totalCount"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <!-- 添加计划弹窗 -->
    <ElDialog v-model="addDialogVisible" title="添加计划" width="600px" destroy-on-close>
      <ElForm :model="addForm" label-width="100px" class="add-plan-form">
        <ElFormItem label="计划类型">
          <ElSelect v-model="addForm.planType" placeholder="请选择计划类型" style="width: 100%">
            <ElOption
              v-for="item in planTypes"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="营销天数">
          <div class="flex items-center gap-8px">
            <span class="text-gray-600">第</span>
            <ElInputNumber
              v-model="addForm.marketingDays"
              :min="1"
              :max="365"
              controls-position="right"
              class="marketing-days-input"
            />
            <span class="text-gray-600">天</span>
          </div>
        </ElFormItem>
        <ElFormItem label="话术内容">
          <ElInput
            v-model="addForm.scriptContent"
            type="textarea"
            :rows="8"
            placeholder="请输入话术内容"
            class="script-textarea"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="flex justify-end gap-12px">
          <ElButton @click="addDialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="handleSaveNewPlan">保存</ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
/* 容器高度自适应 */
.plan-setting-container {
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
  padding: 16px 0 !important;
  font-size: 14px;
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
  padding: 14px 0 !important;
  font-size: 14px;
  vertical-align: top;
  border-bottom: 1px solid #f1f5f9 !important;
}

:deep(.el-table__body td .cell) {
  padding: 0 16px;
}

/* 最后一行去除底部边框 */
:deep(.el-table__body tr:last-child td) {
  border-bottom: none !important;
}

/* 话术内容样式 */
.script-content {
  max-height: 300px;
  min-width: 400px;
  padding: 8px 0;
  overflow-y: auto;
}

.script-content::-webkit-scrollbar {
  width: 4px;
}

.script-content::-webkit-scrollbar-track {
  background: transparent;
}

.script-content::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 2px;
}

.script-content::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
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

:deep(.el-button--success) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  box-shadow: 0 2px 4px rgb(16 185 129 / 30%);
}

:deep(.el-button--success:hover) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 4px 8px rgb(16 185 129 / 40%);
}

:deep(.el-button--danger.is-plain) {
  color: #dc2626;
  background: #fef2f2;
  border-color: #fecaca;
}

:deep(.el-button--danger.is-plain:hover) {
  color: #b91c1c;
  background: #fee2e2;
  border-color: #f87171;
}

/* 可编辑单元格样式 */
.editable-cell {
  display: inline-block;
  min-height: 24px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.editable-cell:hover {
  background-color: #e0e7ff;
  box-shadow: 0 0 0 2px #c7d2fe;
}

/* 编辑输入框样式 */
.edit-input {
  width: 100%;
}

:deep(.edit-input .el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 0 0 2px #818cf8;
}

.edit-textarea {
  width: 100%;
  min-width: 400px;
}

:deep(.edit-textarea .el-textarea__inner) {
  font-size: 13px;
  line-height: 1.6;
  border-radius: 6px;
  box-shadow: 0 0 0 2px #818cf8;
}

/* 营销天数数字输入框样式 */
.marketing-days-input {
  width: 110px;
}

:deep(.marketing-days-input .el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
}

:deep(.marketing-days-input .el-input__wrapper:hover) {
  box-shadow: 0 0 0 2px #c7d2fe;
}

:deep(.marketing-days-input .el-input__wrapper:focus-within) {
  box-shadow: 0 0 0 2px #818cf8;
}

:deep(.marketing-days-input .el-input-number__decrease),
:deep(.marketing-days-input .el-input-number__increase) {
  background: #f3f4f6;
  border-color: #e5e7eb;
}

:deep(.marketing-days-input .el-input-number__decrease:hover),
:deep(.marketing-days-input .el-input-number__increase:hover) {
  color: #3b82f6;
  background: #eff6ff;
}

/* 添加计划弹窗样式 */
.add-plan-form {
  padding: 16px 0;
}

:deep(.add-plan-form .el-form-item) {
  margin-bottom: 20px;
}

:deep(.add-plan-form .el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

.script-textarea {
  width: 100%;
}

:deep(.script-textarea .el-textarea__inner) {
  font-size: 14px;
  line-height: 1.6;
  border-radius: 8px;
}

:deep(.script-textarea .el-textarea__inner:focus) {
  box-shadow: 0 0 0 2px #c7d2fe;
}

/* 弹窗样式 */
:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 12px 20px;
  border-top: 1px solid #f3f4f6;
}
</style>
