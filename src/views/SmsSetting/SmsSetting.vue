<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElSwitch,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElTag
} from 'element-plus'
import { Icon } from '@/components/Icon'

// 电话类别选项
const phoneTypeOptions = [
  { value: 'newPatient', label: '新患者开发导入' },
  { value: 'oldPatient', label: '老患者预约导入' },
  { value: 'appointment', label: '预约导入' },
  { value: 'sopPlan', label: '患者sop全年计划导入' },
  { value: 'regularPlan', label: '五个定期计划' },
  { value: 'pmtcMember', label: 'PMTC预防会员导入' },
  { value: 'customPlan', label: '自定义跟进计划' }
]

// 是否接通选项
const connectOptions = [
  { value: 'connected', label: '接通' },
  { value: 'notConnected', label: '未接通' }
]

// 短信数据
interface SmsItem {
  id: number
  phoneType: string
  phoneTypeLabel: string
  isConnected: string
  isConnectedLabel: string
  smsContent: string
  enabled: boolean
}

const smsList = ref<SmsItem[]>([
  {
    id: 1,
    phoneType: 'newPatient',
    phoneTypeLabel: '新患者开发导入',
    isConnected: 'notConnected',
    isConnectedLabel: '未接通',
    smsContent:
      '您好，这里是XX口腔门诊。之前给您致电未联系上，希望您一切安好。我们一直关注您的口腔健康，如果后续在复诊安排或牙齿维护方面有任何疑问，随时可以联系我们。祝您健康顺心！',
    enabled: true
  },
  {
    id: 2,
    phoneType: 'newPatient',
    phoneTypeLabel: '新患者开发导入',
    isConnected: 'connected',
    isConnectedLabel: '接通',
    smsContent: '感谢您的咨询，我们已为您预留专属优惠名额，期待您的到来！如有疑问可随时联系我们。',
    enabled: true
  },
  {
    id: 3,
    phoneType: 'oldPatient',
    phoneTypeLabel: '老患者预约导入',
    isConnected: 'notConnected',
    isConnectedLabel: '未接通',
    smsContent:
      '您好，我是XX口腔的客服，之前给您致电未接通。您上次的治疗已有一段时间，建议您来院复查一下，确保恢复良好。',
    enabled: true
  },
  {
    id: 4,
    phoneType: 'oldPatient',
    phoneTypeLabel: '老患者预约导入',
    isConnected: 'connected',
    isConnectedLabel: '接通',
    smsContent: '感谢您选择XX口腔，期待您的再次到来。如需预约请提前联系我们，祝您生活愉快！',
    enabled: true
  },
  {
    id: 5,
    phoneType: 'appointment',
    phoneTypeLabel: '预约导入',
    isConnected: 'notConnected',
    isConnectedLabel: '未接通',
    smsContent: '您好，您预约了明天的治疗，刚才打电话没有接，记得按时来复诊哦',
    enabled: true
  },
  {
    id: 6,
    phoneType: 'appointment',
    phoneTypeLabel: '预约导入',
    isConnected: 'connected',
    isConnectedLabel: '接通',
    smsContent: '感谢您选择XX口腔，明天我们在门诊等着您。',
    enabled: true
  },
  {
    id: 7,
    phoneType: 'sopPlan',
    phoneTypeLabel: '患者sop全年计划导入',
    isConnected: '',
    isConnectedLabel: '',
    smsContent:
      '尊敬的会员，您的年度口腔健康计划已启动，本月建议进行一次口腔检查，请联系我们预约时间。',
    enabled: true
  },
  {
    id: 8,
    phoneType: 'regularPlan',
    phoneTypeLabel: '五个定期计划',
    isConnected: '',
    isConnectedLabel: '',
    smsContent: '您好，根据您的治疗计划，现在是进行定期复查的时间，请尽快预约来院检查。',
    enabled: true
  },
  {
    id: 9,
    phoneType: 'pmtcMember',
    phoneTypeLabel: 'PMTC预防会员导入',
    isConnected: 'notConnected',
    isConnectedLabel: '未接通',
    smsContent:
      '尊敬的PMTC会员，您的会员权益即将到期，为了您的口腔健康，建议尽快来院进行洁牙护理。',
    enabled: true
  },
  {
    id: 10,
    phoneType: 'pmtcMember',
    phoneTypeLabel: 'PMTC预防会员导入',
    isConnected: 'connected',
    isConnectedLabel: '接通',
    smsContent: '感谢您成为我们的PMTC会员，您的下次洁牙时间已预约成功，届时请准时到店。',
    enabled: false
  },
  {
    id: 11,
    phoneType: 'customPlan',
    phoneTypeLabel: '自定义跟进计划',
    isConnected: '',
    isConnectedLabel: '',
    smsContent: '您好，根据您的个人治疗方案，现阶段建议进行一次复查，请联系我们预约时间。',
    enabled: false
  }
])

// 短信剩余数量（跟随分页器total数量）
const smsRemaining = computed(() => totalCount.value)

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10
})

// 数据总数
const totalCount = computed(() => smsList.value.length)

// 分页后的数据
const paginatedData = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return smsList.value.slice(start, end)
})

// 表格行样式
const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

// 状态切换
const handleStatusChange = (row: SmsItem) => {
  const status = row.enabled ? '开启' : '关闭'
  ElMessage.success(`已${status}该短信模板`)
}

// 电话类别变更
const handlePhoneTypeChange = (row: SmsItem, value: string) => {
  const option = phoneTypeOptions.find((item) => item.value === value)
  if (option) {
    row.phoneType = value
    row.phoneTypeLabel = option.label
    ElMessage.success('保存成功')
  }
}

// 双击编辑短信内容
const editingId = ref<number | null>(null)
const editingContent = ref('')

const handleDoubleClick = (row: SmsItem) => {
  editingId.value = row.id
  editingContent.value = row.smsContent
  nextTick(() => {
    const textarea = document.querySelector('.edit-textarea textarea') as HTMLElement
    textarea?.focus()
  })
}

// 失焦保存
const handleEditFinish = (row: SmsItem) => {
  if (editingId.value === row.id) {
    row.smsContent = editingContent.value
    editingId.value = null
    ElMessage.success('保存成功')
  }
}

// 删除
const handleDelete = (row: SmsItem) => {
  ElMessageBox.confirm('确定要删除该短信模板吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = smsList.value.findIndex((item) => item.id === row.id)
    if (index > -1) {
      smsList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  })
}

// 添加弹窗
const addDialogVisible = ref(false)
const addForm = reactive({
  phoneType: '',
  isConnected: '',
  smsContent: ''
})

// 打开添加弹窗
const handleOpenAddDialog = () => {
  addForm.phoneType = ''
  addForm.isConnected = ''
  addForm.smsContent = ''
  addDialogVisible.value = true
}

// 保存新短信模板
const handleSaveNewSms = () => {
  if (!addForm.phoneType) {
    ElMessage.warning('请选择电话类别')
    return
  }
  if (!addForm.smsContent.trim()) {
    ElMessage.warning('请输入短信内容')
    return
  }

  const phoneTypeOption = phoneTypeOptions.find((item) => item.value === addForm.phoneType)
  const connectOption = connectOptions.find((item) => item.value === addForm.isConnected)

  const maxId = smsList.value.length > 0 ? Math.max(...smsList.value.map((item) => item.id)) : 0

  const newSms: SmsItem = {
    id: maxId + 1,
    phoneType: addForm.phoneType,
    phoneTypeLabel: phoneTypeOption?.label || '',
    isConnected: addForm.isConnected,
    isConnectedLabel: connectOption?.label || '',
    smsContent: addForm.smsContent,
    enabled: true
  }

  smsList.value.push(newSms)
  ElMessage.success('添加成功')
  addDialogVisible.value = false
}

// 分页变化
const handlePageChange = (page: number) => {
  pagination.currentPage = page
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
}
</script>

<template>
  <div class="sms-setting-container flex flex-col bg-gray-100">
    <!-- 标题栏 -->
    <div class="flex items-center justify-between mb-16px flex-shrink-0">
      <div class="text-16px font-600 text-gray-800 flex items-center">
        <span class="w-4px h-18px bg-blue-500 rounded-full mr-10px"></span>
        未接通电话发送短信内容设置
      </div>
      <div class="flex items-center gap-16px">
        <div class="text-14px text-gray-600">
          短信剩余：<span class="text-blue-600 font-600">{{ smsRemaining }}</span
          >条
        </div>
        <ElButton type="primary" @click="handleOpenAddDialog">
          <Icon icon="ep:plus" class="mr-4px" />
          添加模板
        </ElButton>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-wrapper flex-1 bg-white rounded-16px shadow-sm overflow-hidden flex flex-col">
      <ElTable
        :data="paginatedData"
        style="width: 100%"
        class="flex-1 custom-table"
        :row-class-name="tableRowClassName"
      >
        <ElTableColumn type="index" label="序号" width="60" align="center">
          <template #default="{ $index }">
            <span class="text-gray-600">{{
              (pagination.currentPage - 1) * pagination.pageSize + $index + 1
            }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="phoneTypeLabel" label="对应电话类别" min-width="180" align="center">
          <template #default="{ row }">
            <ElSelect
              v-model="row.phoneType"
              class="phone-type-select"
              @change="handlePhoneTypeChange(row, $event)"
            >
              <ElOption
                v-for="item in phoneTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="isConnectedLabel" label="是否接通" align="center">
          <template #default="{ row }">
            <ElTag
              v-if="row.isConnected === 'connected'"
              type="success"
              size="small"
              class="connect-tag"
            >
              {{ row.isConnectedLabel }}
            </ElTag>
            <ElTag
              v-else-if="row.isConnected === 'notConnected'"
              type="danger"
              size="small"
              class="connect-tag"
            >
              {{ row.isConnectedLabel }}
            </ElTag>
            <span v-else class="text-gray-400">-</span>
          </template>
        </ElTableColumn>

        <ElTableColumn
          prop="smsContent"
          label="短信内容"
          min-width="400"
          class-name="sms-content-column"
        >
          <template #default="{ row }">
            <ElInput
              v-if="editingId === row.id"
              v-model="editingContent"
              type="textarea"
              :rows="8"
              class="edit-textarea"
              @blur="handleEditFinish(row)"
              autofocus
            />
            <div
              v-else
              class="sms-content text-gray-700 text-13px leading-relaxed whitespace-pre-wrap cursor-pointer editable-cell"
              @dblclick="handleDoubleClick(row)"
            >
              {{ row.smsContent || '-' }}
            </div>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="enabled" label="短信状态" align="center">
          <template #default="{ row }">
            <ElSwitch
              v-model="row.enabled"
              active-text="开启"
              inactive-text="关闭"
              inline-prompt
              class="status-switch"
              @change="handleStatusChange(row)"
            />
          </template>
        </ElTableColumn>

        <ElTableColumn label="操作" align="center">
          <template #default="{ row }">
            <ElButton type="danger" size="small" text @click="handleDelete(row)"> 删除 </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>

      <!-- 分页器 -->
      <div class="flex justify-end p-12px border-t border-gray-100 flex-shrink-0">
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

    <!-- 添加短信模板弹窗 -->
    <ElDialog v-model="addDialogVisible" title="添加短信模板" width="600px" destroy-on-close>
      <ElForm :model="addForm" label-width="100px" class="add-sms-form">
        <ElFormItem label="电话类别">
          <ElSelect v-model="addForm.phoneType" placeholder="请选择电话类别" style="width: 100%">
            <ElOption
              v-for="item in phoneTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="是否接通">
          <ElSelect
            v-model="addForm.isConnected"
            placeholder="请选择是否接通"
            style="width: 100%"
            clearable
          >
            <ElOption
              v-for="item in connectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="短信内容">
          <ElInput
            v-model="addForm.smsContent"
            type="textarea"
            :rows="6"
            placeholder="请输入短信内容"
            class="sms-textarea"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="flex justify-end gap-12px">
          <ElButton @click="addDialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="handleSaveNewSms">保存</ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
/* 容器高度自适应 */
.sms-setting-container {
  height: calc(100vh - 170px);
  overflow: hidden;
}

/* 表格容器 */
.table-wrapper {
  min-height: 0;
}

/* 短信内容列最大宽度 */
:deep(.sms-content-column) {
  max-width: 500px;
}

/* 短信内容样式 */
.sms-content {
  max-height: 300px;
  padding: 8px 0;
  overflow-y: auto;
}

.sms-content::-webkit-scrollbar {
  width: 4px;
}

.sms-content::-webkit-scrollbar-track {
  background: transparent;
}

.sms-content::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 2px;
}

.sms-content::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
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
.edit-textarea {
  width: 100%;
}

:deep(.edit-textarea .el-textarea__inner) {
  font-size: 13px;
  line-height: 1.6;
  border-radius: 6px;
  box-shadow: 0 0 0 2px #818cf8;
}

/* 表格整体样式 */
.custom-table {
  --el-table-border-color: transparent;

  overflow: auto;
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
  padding: 16px 0 !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

:deep(.el-table__body td .cell) {
  padding: 0 12px !important;
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

/* 接通状态标签样式 */
.connect-tag {
  font-weight: 500;
}

:deep(.connect-tag.el-tag--success) {
  color: #065f46;
  background: #d1fae5;
  border-color: #a7f3d0;
}

:deep(.connect-tag.el-tag--danger) {
  color: #b91c1c;
  background: #fee2e2;
  border-color: #fecaca;
}

/* 状态开关样式 */
.status-switch {
  --el-switch-on-color: #3b82f6;
  --el-switch-off-color: #cbd5e1;
}

:deep(.status-switch .el-switch__core) {
  height: 24px;
  min-width: 56px;
  border-radius: 12px;
}

:deep(.status-switch .el-switch__action) {
  width: 18px;
  height: 18px;
}

:deep(.status-switch.is-checked .el-switch__action) {
  left: calc(100% - 21px);
}

/* 电话类别下拉选择样式 */
.phone-type-select {
  width: 100%;
}

:deep(.phone-type-select .el-select__wrapper) {
  cursor: pointer;
  background: transparent;
  border: none;
  box-shadow: none;
  transition: all 0.2s ease;
}

:deep(.phone-type-select .el-select__wrapper:hover) {
  background-color: #e0e7ff;
  border-radius: 6px;
}

:deep(.phone-type-select .el-select__selected-item) {
  font-size: 13px;
  font-weight: 500;
  color: #4f46e5;
}

:deep(.phone-type-select .el-select__suffix) {
  color: #818cf8;
}

/* 添加弹窗样式 */
.add-sms-form {
  padding: 16px 0;
}

:deep(.add-sms-form .el-form-item) {
  margin-bottom: 20px;
}

:deep(.add-sms-form .el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

.sms-textarea {
  width: 100%;
}

:deep(.sms-textarea .el-textarea__inner) {
  font-size: 14px;
  line-height: 1.6;
  border-radius: 8px;
}

:deep(.sms-textarea .el-textarea__inner:focus) {
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
