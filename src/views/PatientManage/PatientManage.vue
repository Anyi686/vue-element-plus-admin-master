<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElTag
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

// 患者数据接口
interface Patient {
  id: number
  name: string
  age: number
  appointmentTime: string
  medicalRecordNo: string
  phone: string
  birthDate: string
  importTime: string
  appointmentDoctor: string
  treatmentItem: string
  creator: string
  executionPlan: string
  manualPlanAdjust: string
}

// 执行计划选项
const executionPlanOptions = [
  { value: 'oldPatientInvite', label: '老患者邀约' },
  { value: 'fiveRegular', label: '五个定期' },
  { value: 'pmtcMaintain', label: 'PMTC维护' }
]

// 人工计划调整选项
const manualPlanOptions = [
  { value: 'phonePlan', label: '电话计划' },
  { value: 'yearRoundCare', label: '全年随访关怀' },
  { value: 'fiveRegularMaintain', label: '五个定期维护' },
  { value: 'pmtcPreventMember', label: 'PMTC预防会员' }
]

// 模拟患者数据
const patientList = ref<Patient[]>([
  {
    id: 1,
    name: '张三',
    age: 35,
    appointmentTime: '2024-01-15 09:00',
    medicalRecordNo: 'MR20240001',
    phone: '138****1234',
    birthDate: '1989-05-20',
    importTime: '2024-01-10 14:30',
    appointmentDoctor: '李医生',
    treatmentItem: '种植牙',
    creator: '王管理员',
    executionPlan: 'oldPatientInvite',
    manualPlanAdjust: 'phonePlan'
  },
  {
    id: 2,
    name: '李四',
    age: 42,
    appointmentTime: '2024-01-16 10:30',
    medicalRecordNo: 'MR20240002',
    phone: '139****5678',
    birthDate: '1982-08-15',
    importTime: '2024-01-11 09:20',
    appointmentDoctor: '张医生',
    treatmentItem: '牙齿矫正',
    creator: '王管理员',
    executionPlan: 'fiveRegular',
    manualPlanAdjust: 'yearRoundCare'
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    appointmentTime: '2024-01-17 14:00',
    medicalRecordNo: 'MR20240003',
    phone: '137****9012',
    birthDate: '1996-03-10',
    importTime: '2024-01-12 16:45',
    appointmentDoctor: '李医生',
    treatmentItem: '洁牙护理',
    creator: '张管理员',
    executionPlan: 'pmtcMaintain',
    manualPlanAdjust: 'pmtcPreventMember'
  },
  {
    id: 4,
    name: '赵六',
    age: 55,
    appointmentTime: '2024-01-18 11:00',
    medicalRecordNo: 'MR20240004',
    phone: '136****3456',
    birthDate: '1969-11-25',
    importTime: '2024-01-13 10:15',
    appointmentDoctor: '王医生',
    treatmentItem: '补牙',
    creator: '王管理员',
    executionPlan: 'oldPatientInvite',
    manualPlanAdjust: 'fiveRegularMaintain'
  },
  {
    id: 5,
    name: '孙七',
    age: 31,
    appointmentTime: '2024-01-19 15:30',
    medicalRecordNo: 'MR20240005',
    phone: '135****7890',
    birthDate: '1993-07-08',
    importTime: '2024-01-14 11:30',
    appointmentDoctor: '张医生',
    treatmentItem: '根管治疗',
    creator: '张管理员',
    executionPlan: 'fiveRegular',
    manualPlanAdjust: 'phonePlan'
  }
])

// 搜索表单
const searchForm = reactive({
  name: '',
  phone: '',
  medicalRecordNo: '',
  appointmentDoctor: '',
  treatmentItem: '',
  executionPlan: '',
  dateRange: [] as string[]
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10
})

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('编辑患者')
const currentPatient = ref<Patient | null>(null)

// 编辑表单
const editForm = reactive<Partial<Patient>>({
  name: '',
  age: 0,
  appointmentTime: '',
  medicalRecordNo: '',
  phone: '',
  birthDate: '',
  appointmentDoctor: '',
  treatmentItem: '',
  executionPlan: '',
  manualPlanAdjust: ''
})

// 过滤后的数据
const filteredData = computed(() => {
  let result = [...patientList.value]

  if (searchForm.name) {
    result = result.filter((item) => item.name.includes(searchForm.name))
  }
  if (searchForm.phone) {
    result = result.filter((item) => item.phone.includes(searchForm.phone))
  }
  if (searchForm.medicalRecordNo) {
    result = result.filter((item) => item.medicalRecordNo.includes(searchForm.medicalRecordNo))
  }
  if (searchForm.appointmentDoctor) {
    result = result.filter((item) => item.appointmentDoctor.includes(searchForm.appointmentDoctor))
  }
  if (searchForm.treatmentItem) {
    result = result.filter((item) => item.treatmentItem.includes(searchForm.treatmentItem))
  }
  if (searchForm.executionPlan) {
    result = result.filter((item) => item.executionPlan === searchForm.executionPlan)
  }

  return result
})

// 数据总数
const totalCount = computed(() => filteredData.value.length)

// 分页后的数据
const paginatedData = computed(() => {
  const data = filteredData.value
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return data.slice(start, end)
})

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
}

// 重置搜索
const handleReset = () => {
  searchForm.name = ''
  searchForm.phone = ''
  searchForm.medicalRecordNo = ''
  searchForm.appointmentDoctor = ''
  searchForm.treatmentItem = ''
  searchForm.executionPlan = ''
  searchForm.dateRange = []
  pagination.currentPage = 1
}

// 编辑患者
const handleEdit = (row: Patient) => {
  currentPatient.value = row
  dialogTitle.value = '编辑患者'
  Object.assign(editForm, {
    name: row.name,
    age: row.age,
    appointmentTime: row.appointmentTime,
    medicalRecordNo: row.medicalRecordNo,
    phone: row.phone,
    birthDate: row.birthDate,
    appointmentDoctor: row.appointmentDoctor,
    treatmentItem: row.treatmentItem,
    executionPlan: row.executionPlan,
    manualPlanAdjust: row.manualPlanAdjust
  })
  dialogVisible.value = true
}

// 删除患者
const handleDelete = (row: Patient) => {
  ElMessageBox.confirm(`确定要删除患者 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const index = patientList.value.findIndex((item) => item.id === row.id)
      if (index > -1) {
        patientList.value.splice(index, 1)
        ElMessage.success('删除成功')
      }
    })
    .catch(() => {
      // 取消删除
    })
}

// 人工计划调整变更
const handlePlanChange = (row: Patient, value: string) => {
  row.manualPlanAdjust = value
  ElMessage.success('计划调整成功')
}

// 执行计划变更
const handleExecutionPlanChange = (row: Patient, value: string) => {
  row.executionPlan = value
  ElMessage.success('执行计划更新成功')
}

// 保存编辑
const handleSave = () => {
  if (currentPatient.value) {
    Object.assign(currentPatient.value, editForm)
    ElMessage.success('保存成功')
    dialogVisible.value = false
  }
}

// 分页变化
const handlePageChange = (page: number) => {
  pagination.currentPage = page
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
}

// 表格行样式
const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
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
        <ElInput
          v-model="searchForm.medicalRecordNo"
          placeholder="病历号"
          clearable
          class="!w-140px"
          @keyup.enter="handleSearch"
        />
        <ElInput
          v-model="searchForm.appointmentDoctor"
          placeholder="预约医生"
          clearable
          class="!w-140px"
          @keyup.enter="handleSearch"
        />
        <ElInput
          v-model="searchForm.treatmentItem"
          placeholder="治疗项目"
          clearable
          class="!w-140px"
          @keyup.enter="handleSearch"
        />
        <ElSelect
          v-model="searchForm.executionPlan"
          placeholder="执行计划"
          clearable
          class="!w-140px"
        >
          <ElOption
            v-for="item in executionPlanOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
        <ElDatePicker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="导入开始"
          end-placeholder="导入结束"
          class="!w-240px"
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
        :data="paginatedData"
        style="width: 100%"
        class="flex-1 custom-table"
        :row-class-name="tableRowClassName"
      >
        <ElTableColumn prop="name" label="患者姓名" min-width="90" align="center">
          <template #default="{ row }">
            <span class="font-500 text-gray-800">{{ row.name }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="age" label="年龄" min-width="60" align="center">
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.age }}岁</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="appointmentTime" label="预约时间" min-width="140" align="center">
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.appointmentTime }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="medicalRecordNo" label="病历号" min-width="110" align="center">
          <template #default="{ row }">
            <span class="text-blue-600 font-500">{{ row.medicalRecordNo }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="phone" label="手机" min-width="100" align="center">
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.phone }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="birthDate" label="出生日期" min-width="100" align="center">
          <template #default="{ row }">
            <span class="text-gray-500">{{ row.birthDate }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="importTime" label="导入时间" min-width="140" align="center">
          <template #default="{ row }">
            <span class="text-gray-500">{{ row.importTime }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="appointmentDoctor" label="预约医生" min-width="90" align="center">
          <template #default="{ row }">
            <ElTag type="success" size="small">{{ row.appointmentDoctor }}</ElTag>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="treatmentItem" label="治疗项目" min-width="90" align="center">
          <template #default="{ row }">
            <ElTag type="info" size="small">{{ row.treatmentItem }}</ElTag>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="creator" label="创建人" min-width="90" align="center">
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.creator }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="executionPlan" label="执行计划" min-width="130" align="center">
          <template #default="{ row }">
            <ElSelect
              v-model="row.executionPlan"
              size="small"
              class="plan-select"
              @change="(val: string) => handleExecutionPlanChange(row, val)"
            >
              <ElOption
                v-for="item in executionPlanOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="manualPlanAdjust" label="人工计划调整" min-width="130" align="center">
          <template #default="{ row }">
            <ElSelect
              v-model="row.manualPlanAdjust"
              size="small"
              class="plan-select"
              @change="(val: string) => handlePlanChange(row, val)"
            >
              <ElOption
                v-for="item in manualPlanOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>

        <ElTableColumn label="操作" min-width="130" align="center">
          <template #default="{ row }">
            <div class="flex justify-center gap-8px">
              <ElButton type="primary" size="small" round plain @click="handleEdit(row)">
                编辑
              </ElButton>
              <ElButton type="danger" size="small" round plain @click="handleDelete(row)">
                删除
              </ElButton>
            </div>
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

    <!-- 编辑弹窗 -->
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="600px" destroy-on-close>
      <ElForm :model="editForm" label-width="100px" class="edit-form">
        <div class="grid grid-cols-2 gap-x-16px">
          <ElFormItem label="患者姓名">
            <ElInput v-model="editForm.name" placeholder="请输入患者姓名" />
          </ElFormItem>
          <ElFormItem label="年龄">
            <ElInput v-model.number="editForm.age" placeholder="请输入年龄" type="number" />
          </ElFormItem>
          <ElFormItem label="手机号">
            <ElInput v-model="editForm.phone" placeholder="请输入手机号" />
          </ElFormItem>
          <ElFormItem label="病历号">
            <ElInput v-model="editForm.medicalRecordNo" placeholder="请输入病历号" />
          </ElFormItem>
          <ElFormItem label="出生日期">
            <ElDatePicker
              v-model="editForm.birthDate"
              type="date"
              placeholder="选择出生日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </ElFormItem>
          <ElFormItem label="预约时间">
            <ElDatePicker
              v-model="editForm.appointmentTime"
              type="datetime"
              placeholder="选择预约时间"
              style="width: 100%"
              value-format="YYYY-MM-DD HH:mm"
            />
          </ElFormItem>
          <ElFormItem label="预约医生">
            <ElInput v-model="editForm.appointmentDoctor" placeholder="请输入预约医生" />
          </ElFormItem>
          <ElFormItem label="治疗项目">
            <ElInput v-model="editForm.treatmentItem" placeholder="请输入治疗项目" />
          </ElFormItem>
          <ElFormItem label="执行计划">
            <ElSelect
              v-model="editForm.executionPlan"
              placeholder="请选择执行计划"
              style="width: 100%"
            >
              <ElOption
                v-for="item in executionPlanOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="人工计划调整">
            <ElSelect v-model="editForm.manualPlanAdjust" placeholder="请选择" style="width: 100%">
              <ElOption
                v-for="item in manualPlanOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </div>
      </ElForm>
      <template #footer>
        <div class="flex justify-end gap-12px">
          <ElButton @click="dialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="handleSave">保存</ElButton>
        </div>
      </template>
    </ElDialog>
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

/* 计划选择器样式 */
.plan-select {
  width: 100%;
  min-width: 110px;
}

:deep(.plan-select .el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
}

:deep(.plan-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 2px #c7d2fe;
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

:deep(.el-button--primary.is-plain) {
  color: #3b82f6;
  background: #eff6ff;
  border-color: #bfdbfe;
}

:deep(.el-button--primary.is-plain:hover) {
  color: #2563eb;
  background: #dbeafe;
  border-color: #93c5fd;
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

/* 搜索输入框样式 */
:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
}

/* 编辑表单样式 */
.edit-form {
  padding: 16px 0;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
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
</style>
