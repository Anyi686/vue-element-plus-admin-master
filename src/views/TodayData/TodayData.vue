<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElTag,
  ElTable,
  ElTableColumn,
  ElDialog,
  ElSlider,
  ElMessage,
  ElPagination
} from 'element-plus'
import { Icon } from '@/components/Icon'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

// 查看记录弹窗
const recordDialogVisible = ref(false)
const currentRecord = ref<any>(null)

// 音频播放器状态
const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const totalDuration = ref(0)
const audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

// 初始化音频
onMounted(() => {
  audioRef.value = new Audio(audioUrl)
  audioRef.value.addEventListener('loadedmetadata', () => {
    totalDuration.value = audioRef.value?.duration || 0
  })
  audioRef.value.addEventListener('timeupdate', () => {
    currentTime.value = audioRef.value?.currentTime || 0
  })
  audioRef.value.addEventListener('ended', () => {
    isPlaying.value = false
    currentTime.value = 0
  })

  // 初始化时加载表格数据
  manualListLoading.value = true
  notConnectedListLoading.value = true
  setTimeout(() => {
    manualListLoading.value = false
    notConnectedListLoading.value = false
  }, 500)
})

// 清理音频
onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value = null
  }
})

// 监听弹窗关闭，暂停音频
watch(recordDialogVisible, (val) => {
  if (!val && audioRef.value) {
    audioRef.value.pause()
    isPlaying.value = false
  }
})

// 模拟对话数据
const conversationList = ref([
  {
    id: 1,
    type: 'ai',
    content: '喂，你好，我是鑫华口腔郭院长的助理苗苗'
  },
  {
    id: 2,
    type: 'patient',
    content: '恩，你好'
  },
  {
    id: 3,
    type: 'ai',
    content: '之前你在我们这咨询过牙齿问题，您还记得吗?'
  },
  {
    id: 4,
    type: 'patient',
    content: '恩，怎么了'
  },
  {
    id: 5,
    type: 'ai',
    content:
      '恩，郭院长让我给您联系安排一次种植牙维护，这个种植牙要是想长久使用的话肯定是要做定期维护的，毕竟咱们花了那么多钱把这个牙种上了，也是想着说用得越久越好，您说是吧?'
  },
  {
    id: 6,
    type: 'patient',
    content: '恩，可以，预计什么时间能去?'
  }
])

// 格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 播放/暂停
const togglePlay = () => {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

// 快退10秒
const prevTrack = () => {
  if (!audioRef.value) return
  audioRef.value.currentTime = Math.max(0, audioRef.value.currentTime - 10)
}

// 快进10秒
const nextTrack = () => {
  if (!audioRef.value) return
  audioRef.value.currentTime = Math.min(totalDuration.value, audioRef.value.currentTime + 10)
}

// 拖动进度条
const handleSliderChange = (val: number) => {
  if (!audioRef.value) return
  audioRef.value.currentTime = val
}

// 今日任务详情数据
const taskSummary = reactive({
  totalTasks: 520,
  completedTasks: 376,
  connected: 232,
  notConnected: 144,
  appointmentTime: 45,
  riskWarning: 52,
  needManual: 67,
  appointmentConfirmed: 28,
  appointmentNotConfirmed: 12
})

// 搜索关键字
const searchKeyword = ref('')

// 待人工处理客户清单数据
const manualProcessList = ref([
  {
    id: 1,
    name: '陈晓晨',
    gender: '女',
    treatmentProject: '拔牙',
    appointmentTime: '2026年03月18日',
    agreeWechat: '同意',
    customerType: '投诉顾问',
    status: 'processed'
  },
  {
    id: 2,
    name: '梨沙子',
    gender: '男',
    treatmentProject: '种牙',
    appointmentTime: '无',
    agreeWechat: '不同意',
    customerType: '风险预警',
    status: 'pending'
  },
  {
    id: 3,
    name: '王小明',
    gender: '男',
    treatmentProject: '洗牙',
    appointmentTime: '2026年03月20日',
    agreeWechat: '已有微信',
    customerType: '高意向',
    status: 'pending'
  },
  {
    id: 4,
    name: '李婷婷',
    gender: '女',
    treatmentProject: '正畸',
    appointmentTime: '2026年03月22日',
    agreeWechat: '同意',
    customerType: '约时间',
    status: 'pending'
  },
  {
    id: 5,
    name: '张伟',
    gender: '男',
    treatmentProject: '补牙',
    appointmentTime: '无',
    agreeWechat: '不同意',
    customerType: '风险预警',
    status: 'pending'
  },
  {
    id: 6,
    name: '刘美玲',
    gender: '女',
    treatmentProject: '种牙',
    appointmentTime: '2026年03月25日',
    agreeWechat: '已有微信',
    customerType: '高意向',
    status: 'processed'
  },
  {
    id: 7,
    name: '赵强',
    gender: '男',
    treatmentProject: '根管治疗',
    appointmentTime: '无',
    agreeWechat: '同意',
    customerType: '有意向',
    status: 'pending'
  },
  {
    id: 8,
    name: '孙丽华',
    gender: '女',
    treatmentProject: '洗牙',
    appointmentTime: '2026年03月19日',
    agreeWechat: '不同意',
    customerType: '预约未确认',
    status: 'pending'
  },
  {
    id: 9,
    name: '周建国',
    gender: '男',
    treatmentProject: '拔牙',
    appointmentTime: '无',
    agreeWechat: '同意',
    customerType: '风险预警',
    status: 'pending'
  },
  {
    id: 10,
    name: '吴芳',
    gender: '女',
    treatmentProject: '美白',
    appointmentTime: '2026年03月21日',
    agreeWechat: '已有微信',
    customerType: '约时间',
    status: 'processed'
  },
  {
    id: 11,
    name: '郑浩',
    gender: '男',
    treatmentProject: '种牙',
    appointmentTime: '无',
    agreeWechat: '不同意',
    customerType: '投诉顾问',
    status: 'pending'
  },
  {
    id: 12,
    name: '陈雪',
    gender: '女',
    treatmentProject: '补牙',
    appointmentTime: '2026年03月23日',
    agreeWechat: '同意',
    customerType: '高意向',
    status: 'pending'
  }
])

// 过滤后的客户清单
const filteredManualProcessList = computed(() => {
  if (!searchKeyword.value.trim()) {
    return manualProcessList.value
  }
  const keyword = searchKeyword.value.trim().toLowerCase()
  return manualProcessList.value.filter((item) => {
    return item.name.toLowerCase().includes(keyword)
  })
})

// 客户分类选项
const customerTypeOptions = [
  { label: '全部', value: '全部' },
  { label: '高意向', value: '高意向' },
  { label: '有意向', value: '有意向' },
  { label: '约时间', value: '约时间' },
  { label: '风险预警', value: '风险预警' },
  { label: '预约未确认', value: '预约未确认' }
]

// 未接通客户处理数据
const notConnectedList = ref([
  { id: 1, category: '预约提醒', count: '12人', processMethod: '执行新计划' },
  { id: 2, category: '新患者开发', count: '25人', processMethod: '当日再次拨打' },
  { id: 3, category: '老患者激活', count: '38人', processMethod: '执行新计划' },
  { id: 4, category: '种植牙维护', count: '15人', processMethod: '次日再次拨打' },
  { id: 5, category: '正畸复查', count: '8人', processMethod: '执行新计划' },
  { id: 6, category: '洗牙提醒', count: '22人', processMethod: '3日后拨打' },
  { id: 7, category: '术后回访', count: '6人', processMethod: '当日再次拨打' },
  { id: 8, category: '会员关怀', count: '18人', processMethod: '7日后拨打' }
])

// 处理方式选项
const processMethodOptions = [
  { label: '执行新计划', value: '执行新计划' },
  { label: '当日再次拨打', value: '当日再次拨打' },
  { label: '次日再次拨打', value: '次日再次拨打' },
  { label: '3日后拨打', value: '3日后拨打' },
  { label: '7日后拨打', value: '7日后拨打' }
]

// 获取微信同意Tag类型
const getWechatTagType = (value: string) => {
  if (value === '同意') return 'success'
  if (value === '不同意') return 'danger'
  return 'primary'
}

// 查看记录
const handleViewRecord = (row: any) => {
  currentRecord.value = row
  recordDialogVisible.value = true
}

// 处理客户
const handleProcess = (row: any) => {
  row.status = 'processed'
  ElMessage.success(`客户 ${row.name} 已标记为已处理`)
}

// 客户分类变更
const handleCustomerTypeChange = (value: string, row: any) => {
  ElMessage.success(`客户 ${row.name} 分类已更新为：${value}`)
}

// 处理方式变更
const handleProcessMethodChange = (value: string, row: any) => {
  ElMessage.success(`${row.category} 处理方式已更新为：${value}`)
}

// 表格加载状态
const manualListLoading = ref(false)
const notConnectedListLoading = ref(false)

// 待人工处理表格分页
const manualPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 未接通客户表格分页
const notConnectedPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 待人工处理总数
const manualTotal = computed(() => filteredManualProcessList.value.length)

// 未接通客户总数
const notConnectedTotal = computed(() => notConnectedList.value.length)

// 分页后的待人工处理数据
const paginatedManualList = computed(() => {
  const list = filteredManualProcessList.value
  const start = (manualPagination.currentPage - 1) * manualPagination.pageSize
  const end = start + manualPagination.pageSize
  return list.slice(start, end)
})

// 分页后的未接通客户数据
const paginatedNotConnectedList = computed(() => {
  const list = notConnectedList.value
  const start = (notConnectedPagination.currentPage - 1) * notConnectedPagination.pageSize
  const end = start + notConnectedPagination.pageSize
  return list.slice(start, end)
})

// 待人工处理分页变化
const handleManualPageChange = (page: number) => {
  manualPagination.currentPage = page
}

const handleManualSizeChange = (size: number) => {
  manualPagination.pageSize = size
  manualPagination.currentPage = 1
}

// 未接通客户分页变化
const handleNotConnectedPageChange = (page: number) => {
  notConnectedPagination.currentPage = page
}

const handleNotConnectedSizeChange = (size: number) => {
  notConnectedPagination.pageSize = size
  notConnectedPagination.currentPage = 1
}

// 表格行样式
const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}
</script>

<template>
  <div class="bg-gray-100 min-h-full">
    <!-- 今日任务详情 -->
    <div class="text-16px font-600 text-gray-800 mb-16px flex items-center">
      <span class="w-4px h-18px bg-blue-500 rounded-full mr-10px"></span>
      {{ t('todayData.taskDetails') }}
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-12px mb-28px">
      <!-- 今日任务卡片 -->
      <div
        class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-12px p-16px text-center text-white shadow-lg hover:shadow-xl hover:-translate-y-1px transition-all duration-300"
      >
        <div class="text-13px opacity-90 mb-8px">{{ t('todayData.todayTasks') }}</div>
        <div class="text-14px font-600">
          {{ t('todayData.totalTasks') }}{{ taskSummary.totalTasks }}/{{ t('todayData.completed')
          }}{{ taskSummary.completedTasks }}
        </div>
      </div>
      <!-- 已接通 -->
      <div
        class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-12px p-16px text-center text-white shadow-lg hover:shadow-xl hover:-translate-y-1px transition-all duration-300"
      >
        <div class="text-13px opacity-90 mb-8px">{{ t('todayData.connected') }}</div>
        <div class="text-22px font-700">{{ taskSummary.connected }}</div>
      </div>
      <!-- 未接通 -->
      <div
        class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-12px p-16px text-center text-white shadow-lg hover:shadow-xl hover:-translate-y-1px transition-all duration-300"
      >
        <div class="text-13px opacity-90 mb-8px">{{ t('todayData.notConnected') }}</div>
        <div class="text-22px font-700">{{ taskSummary.notConnected }}</div>
      </div>
      <!-- 约时间 -->
      <div
        class="bg-gradient-to-br from-violet-500 to-violet-600 rounded-12px p-16px text-center text-white shadow-lg hover:shadow-xl hover:-translate-y-1px transition-all duration-300"
      >
        <div class="text-13px opacity-90 mb-8px">{{ t('todayData.appointmentTime') }}</div>
        <div class="text-22px font-700">{{ taskSummary.appointmentTime }}</div>
      </div>
      <!-- 风险预警 -->
      <div
        class="bg-gradient-to-br from-rose-500 to-rose-600 rounded-12px p-16px text-center text-white shadow-lg hover:shadow-xl hover:-translate-y-1px transition-all duration-300"
      >
        <div class="text-13px opacity-90 mb-8px">{{ t('todayData.riskWarning') }}</div>
        <div class="text-22px font-700">{{ taskSummary.riskWarning }}</div>
      </div>
      <!-- 需人工 -->
      <div
        class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-12px p-16px text-center text-white shadow-lg hover:shadow-xl hover:-translate-y-1px transition-all duration-300"
      >
        <div class="text-13px opacity-90 mb-8px">{{ t('todayData.needManual') }}</div>
        <div class="text-22px font-700">{{ taskSummary.needManual }}</div>
      </div>
      <!-- 预约确认 -->
      <div
        class="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-12px p-16px text-center text-white shadow-lg hover:shadow-xl hover:-translate-y-1px transition-all duration-300"
      >
        <div class="text-13px opacity-90 mb-8px">{{ t('todayData.appointmentConfirmed') }}</div>
        <div class="text-22px font-700">{{ taskSummary.appointmentConfirmed }}</div>
      </div>
      <!-- 预约未确认 -->
      <div
        class="bg-gradient-to-br from-pink-500 to-pink-600 rounded-12px p-16px text-center text-white shadow-lg hover:shadow-xl hover:-translate-y-1px transition-all duration-300"
      >
        <div class="text-13px opacity-90 mb-8px">{{ t('todayData.appointmentNotConfirmed') }}</div>
        <div class="text-22px font-700">{{ taskSummary.appointmentNotConfirmed }}</div>
      </div>
    </div>

    <!-- 待人工处理客户清单 -->
    <div class="flex justify-between items-center mb-16px">
      <div class="text-16px font-600 text-gray-800 flex items-center">
        <span class="w-4px h-18px bg-blue-500 rounded-full mr-10px"></span>
        {{ t('todayData.manualProcessList') }}
      </div>
      <ElInput
        v-model="searchKeyword"
        :placeholder="t('todayData.searchPatient')"
        class="!w-240px !rounded-8px"
        clearable
      >
        <template #prefix>
          <Icon icon="ep:search" class="text-gray-400" />
        </template>
      </ElInput>
    </div>
    <div class="bg-white rounded-16px shadow-sm overflow-hidden mb-24px">
      <ElTable
        v-loading="manualListLoading"
        :data="paginatedManualList"
        style="width: 100%"
        max-height="400"
        :row-class-name="tableRowClassName"
        class="custom-table"
      >
        <ElTableColumn prop="name" :label="t('todayData.name')" min-width="100" align="center">
          <template #default="{ row }">
            <span class="font-500 text-gray-800">{{ row.name }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="gender" :label="t('todayData.gender')" min-width="80" align="center">
          <template #default="{ row }">
            <ElTag
              :type="row.gender === '女' ? 'danger' : 'primary'"
              size="small"
              effect="light"
              round
            >
              {{ row.gender }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="treatmentProject"
          :label="t('todayData.treatmentProject')"
          min-width="100"
          align="center"
        >
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.treatmentProject }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="appointmentTime"
          :label="t('todayData.appointmentTime')"
          min-width="150"
          align="center"
        >
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.appointmentTime }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="t('todayData.agreeWechat')" min-width="110" align="center">
          <template #default="{ row }">
            <ElTag :type="getWechatTagType(row.agreeWechat)" size="small" effect="light" round>
              {{ row.agreeWechat }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="t('todayData.viewRecord')" min-width="110" align="center">
          <template #default="{ row }">
            <ElButton
              type="primary"
              size="small"
              round
              class="!px-16px"
              @click="handleViewRecord(row)"
            >
              {{ t('todayData.viewRecord') }}
            </ElButton>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="t('todayData.customerType')" min-width="140" align="center">
          <template #default="{ row }">
            <ElSelect
              v-model="row.customerType"
              :placeholder="t('common.selectText')"
              size="small"
              class="!w-110px"
              @change="(val) => handleCustomerTypeChange(val, row)"
            >
              <ElOption
                v-for="option in customerTypeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="t('todayData.manualProcess')" min-width="110" align="center">
          <template #default="{ row }">
            <ElTag
              v-if="row.status === 'processed'"
              type="success"
              effect="dark"
              round
              class="!px-12px !h-28px"
            >
              {{ t('todayData.processed') }}
            </ElTag>
            <ElTag
              v-else-if="row.status === 'pending'"
              type="warning"
              effect="light"
              round
              class="!px-12px !h-28px cursor-pointer hover:opacity-80 transition-opacity"
              @click="handleProcess(row)"
            >
              {{ t('todayData.notProcessed') }}
            </ElTag>
          </template>
        </ElTableColumn>
      </ElTable>
      <!-- 分页器 -->
      <div class="flex justify-end p-12px border-t border-gray-100">
        <ElPagination
          v-model:current-page="manualPagination.currentPage"
          v-model:page-size="manualPagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="manualTotal"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleManualSizeChange"
          @current-change="handleManualPageChange"
        />
      </div>
    </div>

    <!-- 未接通客户处理 -->
    <div class="text-16px font-600 text-gray-800 mb-16px flex items-center">
      <span class="w-4px h-18px bg-blue-500 rounded-full mr-10px"></span>
      {{ t('todayData.notConnectedProcess') }}
    </div>
    <div class="bg-white rounded-16px shadow-sm overflow-hidden">
      <ElTable
        v-loading="notConnectedListLoading"
        :data="paginatedNotConnectedList"
        style="width: 100%"
        max-height="350"
        :row-class-name="tableRowClassName"
        class="custom-table"
      >
        <ElTableColumn
          prop="category"
          :label="t('todayData.customerCategory')"
          min-width="200"
          align="center"
        >
          <template #default="{ row }">
            <span class="font-500 text-gray-800">{{ row.category }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="count"
          :label="t('todayData.customerCount')"
          min-width="200"
          align="center"
        >
          <template #default="{ row }">
            <span class="text-blue-600 font-700 text-16px">{{ row.count }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="t('todayData.processMethod')" min-width="300" align="center">
          <template #default="{ row }">
            <ElSelect
              v-model="row.processMethod"
              :placeholder="t('common.selectText')"
              class="!w-160px"
              @change="(val) => handleProcessMethodChange(val, row)"
            >
              <ElOption
                v-for="option in processMethodOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
      </ElTable>
      <!-- 分页器 -->
      <div class="flex justify-end p-12px border-t border-gray-100">
        <ElPagination
          v-model:current-page="notConnectedPagination.currentPage"
          v-model:page-size="notConnectedPagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="notConnectedTotal"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleNotConnectedSizeChange"
          @current-change="handleNotConnectedPageChange"
        />
      </div>
    </div>

    <!-- 查看记录弹窗 -->
    <ElDialog v-model="recordDialogVisible" width="720px" :show-close="false" class="record-dialog">
      <template #header>
        <div class="custom-dialog-header">
          <div class="flex items-center gap-12px">
            <Icon icon="ep:phone" class="text-18px text-white" />
            <span class="text-15px font-600 text-white">{{ t('todayData.callRecord') }}</span>
            <div class="flex items-center gap-6px">
              <span class="header-tag">{{ currentRecord?.name }}</span>
              <span class="header-tag">{{ currentRecord?.gender }}</span>
              <span class="header-tag">{{ currentRecord?.treatmentProject }}</span>
              <span class="header-tag">{{ currentRecord?.customerType }}</span>
            </div>
          </div>
          <button class="close-btn" @click="recordDialogVisible = false">
            <Icon icon="ep:close" class="text-16px" />
          </button>
        </div>
      </template>

      <!-- 音频播放器 -->
      <div class="audio-player-container">
        <div class="flex items-center gap-16px">
          <!-- 播放按钮 -->
          <button class="play-btn" @click="togglePlay">
            <Icon :icon="isPlaying ? 'ep:video-pause' : 'ep:caret-right'" class="text-18px" />
          </button>

          <!-- 进度条区域 -->
          <div class="flex-1 flex items-center gap-10px">
            <span class="time-text">{{ formatTime(currentTime) }}</span>
            <div class="flex-1">
              <ElSlider
                v-model="currentTime"
                :max="totalDuration || 100"
                :show-tooltip="false"
                class="audio-slider"
                @change="handleSliderChange"
              />
            </div>
            <span class="time-text">{{ formatTime(totalDuration) }}</span>
          </div>

          <!-- 快进快退 -->
          <div class="flex items-center gap-6px">
            <button class="control-btn" @click="prevTrack" title="快退10秒">
              <Icon icon="ep:d-arrow-left" class="text-14px" />
            </button>
            <button class="control-btn" @click="nextTrack" title="快进10秒">
              <Icon icon="ep:d-arrow-right" class="text-14px" />
            </button>
          </div>
        </div>
      </div>

      <!-- 对话内容标题 -->
      <div class="flex items-center gap-8px mb-16px">
        <Icon icon="ep:chat-dot-round" class="text-16px text-indigo-500" />
        <span class="text-14px font-500 text-gray-700">语音转文字</span>
      </div>

      <!-- 对话内容 -->
      <div class="conversation-container">
        <div
          v-for="item in conversationList"
          :key="item.id"
          :class="['message-wrapper', item.type === 'ai' ? 'ai-message' : 'patient-message']"
        >
          <div class="message-avatar">
            <Icon :icon="item.type === 'ai' ? 'ep:service' : 'ep:user'" class="text-14px" />
          </div>
          <div class="message-content">
            <div class="message-label">{{ item.type === 'ai' ? 'AI助理' : '患者' }}</div>
            <div class="message-bubble">{{ item.content }}</div>
          </div>
        </div>
      </div>
    </ElDialog>
  </div>
</template>

<style scoped>
/* 表格整体样式 */
.custom-table {
  --el-table-border-color: transparent;
}

:deep(.el-table) {
  --el-table-header-bg-color: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

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
  border-bottom: 1px solid #f1f5f9 !important;
}

:deep(.el-table__body td .cell) {
  padding: 0 16px;
}

/* 最后一行去除底部边框 */
:deep(.el-table__body tr:last-child td) {
  border-bottom: none !important;
}

/* 搜索框样式 */
:deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 2px 6px rgb(0 0 0 / 15%);
}

/* 下拉选择框样式 */
:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
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

/* Tag 样式优化 */
:deep(.el-tag) {
  border: none;
}

:deep(.el-tag--light) {
  font-weight: 500;
}

/* 弹窗样式 */
:deep(.record-dialog) {
  overflow: visible;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%);
}

:deep(.record-dialog .el-dialog) {
  overflow: hidden;
  border-radius: 16px;
}

:deep(.record-dialog .el-dialog__header) {
  padding: 0 !important;
  margin: 0 !important;
  margin-right: 0 !important;
  overflow: visible;
  background: transparent;
  border: none !important;
}

:deep(.record-dialog .el-dialog__headerbtn) {
  display: none;
}

:deep(.record-dialog .el-dialog__body) {
  padding: 20px;
  background: #f8fafc;
}

/* 自定义弹窗头部 */
.custom-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 54px;
  padding: 0 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px 16px 0 0;
}

/* 关闭按钮 */
.close-btn {
  display: flex;
  width: 28px;
  height: 28px;
  color: #fff;
  cursor: pointer;
  background: rgb(255 255 255 / 15%);
  border: none;
  border-radius: 6px;
  transition: all 0.2s;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgb(255 255 255 / 30%);
}

/* 头部标签 */
.header-tag {
  display: inline-flex;
  padding: 3px 8px;
  font-size: 12px;
  color: #fff;
  background: rgb(255 255 255 / 20%);
  border-radius: 4px;
  align-items: center;
}

/* 音频播放器容器 */
.audio-player-container {
  padding: 12px 16px;
  margin-bottom: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 6%);
}

/* 播放控制按钮 */
.control-btn {
  display: flex;
  width: 28px;
  height: 28px;
  color: #6b7280;
  cursor: pointer;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  transition: all 0.2s;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  color: #667eea;
  background: #e5e7eb;
}

.play-btn {
  display: flex;
  width: 40px;
  height: 40px;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgb(102 126 234 / 30%);
  transition: all 0.2s;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.play-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgb(102 126 234 / 40%);
}

/* 时间文本 */
.time-text {
  min-width: 40px;
  font-family: 'SF Mono', Monaco, 'Courier New', monospace;
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

/* 音频滑块样式 */
:deep(.audio-slider .el-slider__runway) {
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
}

:deep(.audio-slider .el-slider__bar) {
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

:deep(.audio-slider .el-slider__button) {
  width: 12px;
  height: 12px;
  background-color: #fff;
  border: 2px solid #667eea;
  box-shadow: 0 1px 4px rgb(102 126 234 / 30%);
}

:deep(.audio-slider .el-slider__button:hover) {
  transform: scale(1.2);
}

/* 对话容器 */
.conversation-container {
  max-height: 380px;
  padding: 20px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 6%);
}

/* 消息样式 */
.message-wrapper {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.message-wrapper:last-child {
  margin-bottom: 0;
}

.ai-message {
  flex-direction: row-reverse;
}

.message-avatar {
  display: flex;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-message .message-avatar {
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.patient-message .message-avatar {
  color: #fff;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.message-content {
  max-width: 75%;
}

.ai-message .message-content {
  text-align: right;
}

.message-label {
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 500;
}

.ai-message .message-label {
  color: #7c3aed;
}

.patient-message .message-label {
  color: #059669;
}

.message-bubble {
  display: inline-block;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.6;
  border-radius: 16px;
}

.ai-message .message-bubble {
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-top-right-radius: 4px;
  box-shadow: 0 2px 8px rgb(102 126 234 / 25%);
}

.patient-message .message-bubble {
  color: #065f46;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 1px solid #a7f3d0;
  border-top-left-radius: 4px;
  box-shadow: 0 2px 8px rgb(16 185 129 / 15%);
}

/* 对话容器滚动条 */
.conversation-container::-webkit-scrollbar {
  width: 6px;
}

.conversation-container::-webkit-scrollbar-track {
  background: transparent;
}

.conversation-container::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

.conversation-container::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
