<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElButton, ElTimePicker, ElMessage, ElSwitch } from 'element-plus'
import { Icon } from '@/components/Icon'

// 规则设置
const ruleSettings = reactive({
  autoExecute: true,
  timeRange: {
    start: '00:00',
    end: '00:00'
  },
  sendSmsAfterHangup: false
})

// 自动执行状态变更
const handleAutoExecuteChange = (val: boolean) => {
  ElMessage.success(`AI电话任务自动执行已${val ? '开启' : '关闭'}`)
}

// 挂断后发送短信状态变更
const handleSendSmsChange = (val: boolean) => {
  ElMessage.success(`挂断后发送短信已${val ? '开启' : '关闭'}`)
}

// 音频分类接口
interface AudioCategory {
  id: number
  name: string
  count: number
  selected: boolean
}

// 音频分类数据
const audioCategories = ref<AudioCategory[]>([
  { id: 1, name: '大模型政社协同案例', count: 7, selected: false },
  { id: 2, name: '大模型营销案例', count: 5, selected: false },
  { id: 3, name: '大模型法律咨询类', count: 1, selected: false },
  { id: 4, name: '大模型招聘案例', count: 2, selected: false },
  { id: 5, name: '大模型满意度回访调查', count: 4, selected: false },
  { id: 6, name: '大模型医疗案例', count: 6, selected: false },
  { id: 7, name: '大模型金融贷款案例', count: 6, selected: false },
  { id: 8, name: '大模型保险类', count: 1, selected: false },
  { id: 9, name: '电商', count: 14, selected: false },
  { id: 10, name: '政社协同案例', count: 2, selected: false },
  { id: 11, name: '运营商增值服务', count: 10, selected: false },
  { id: 12, name: '展会营销邀约', count: 2, selected: false },
  { id: 13, name: '呼入', count: 11, selected: false },
  { id: 14, name: '地产家装行业', count: 12, selected: false },
  { id: 15, name: '教育行业', count: 14, selected: false },
  { id: 16, name: '税务产权行业', count: 8, selected: false },
  { id: 17, name: '软件和信息技术服务业', count: 15, selected: false },
  { id: 18, name: '租赁和商务服务行业', count: 9, selected: false },
  { id: 19, name: '广告和新媒体行业', count: 3, selected: false },
  { id: 20, name: '互联网服务', count: 8, selected: false },
  { id: 21, name: '外包代办服务行业', count: 10, selected: false },
  { id: 22, name: '游戏行业', count: 5, selected: false },
  { id: 23, name: '医疗保健医美行业', count: 10, selected: false },
  { id: 24, name: '金融股票保险行业', count: 20, selected: false }
])

// 选择音频分类
const selectCategory = (category: AudioCategory) => {
  audioCategories.value.forEach((item) => {
    item.selected = item.id === category.id
  })
  ElMessage.success(`已选择：${category.name}`)
}

// 声音克隆
const handleVoiceClone = () => {
  ElMessage.info('声音克隆功能开发中...')
}
</script>

<template>
  <div class="system-setting-container">
    <!-- 规则设置 -->
    <div class="setting-section">
      <div class="section-title">规则设置</div>
      <div class="setting-content">
        <!-- AI电话任务自动执行 -->
        <div class="setting-item">
          <span class="setting-label">AI电话任务自动执行</span>
          <ElSwitch
            v-model="ruleSettings.autoExecute"
            active-text="开启"
            inactive-text="关闭"
            inline-prompt
            class="status-switch"
            @change="handleAutoExecuteChange"
          />
        </div>

        <!-- 自动AI电话开启时间段 -->
        <div class="setting-item">
          <span class="setting-label">自动AI电话开启时间段</span>
          <div class="time-range-picker">
            <span class="time-label">开始</span>
            <ElTimePicker
              v-model="ruleSettings.timeRange.start"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="00:00"
              class="time-picker"
            />
            <span class="time-separator">--结束</span>
            <ElTimePicker
              v-model="ruleSettings.timeRange.end"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="00:00"
              class="time-picker"
            />
          </div>
        </div>

        <!-- 挂断后发送短信 -->
        <div class="setting-item">
          <span class="setting-label">挂断后发送短信</span>
          <ElSwitch
            v-model="ruleSettings.sendSmsAfterHangup"
            active-text="开启"
            inactive-text="关闭"
            inline-prompt
            class="status-switch"
            @change="handleSendSmsChange"
          />
        </div>
      </div>
    </div>

    <!-- 音频选择 -->
    <div class="setting-section">
      <div class="section-header">
        <div class="section-title">音频选择</div>
        <ElButton type="primary" size="small" @click="handleVoiceClone">
          <Icon icon="ep:headset" class="mr-4px" />
          声音克隆
        </ElButton>
      </div>
      <div class="audio-grid">
        <div
          v-for="category in audioCategories"
          :key="category.id"
          :class="['audio-card', { selected: category.selected }]"
          @click="selectCategory(category)"
        >
          <Icon icon="ep:folder-opened" class="folder-icon" />
          <span class="audio-name" :title="category.name">{{ category.name }}</span>
          <span class="audio-count">{{ category.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


/* 响应式布局 */
@media (width <= 1400px) {
  .audio-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (width <= 1000px) {
  .audio-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width <= 600px) {
  .audio-grid {
    grid-template-columns: 1fr;
  }
}

.system-setting-container {
  min-height: calc(100vh - 170px);
  background: #f5f7fa;
}

/* 设置区块 */
.setting-section {
  padding: 24px;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);
}

.section-title {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-header .section-title {
  margin-bottom: 0;
}

/* 设置项 */
.setting-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 24px;
}

.setting-label {
  width: 180px;
  font-size: 14px;
  color: #374151;
}

/* 时间范围选择器 */
.time-range-picker {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-label {
  font-size: 14px;
  color: #6b7280;
}

.time-separator {
  font-size: 14px;
  color: #6b7280;
}

.time-picker {
  width: 100px;
}

:deep(.time-picker .el-input__wrapper) {
  border-radius: 6px;
}

/* 音频网格 */
.audio-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.audio-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  cursor: pointer;
  background: #f8fafc;
  border: 2px solid transparent;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.audio-card:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.audio-card.selected {
  background: #eff6ff;
  border-color: #3b82f6;
}

.folder-icon {
  flex-shrink: 0;
  font-size: 20px;
  color: #3b82f6;
}

.audio-name {
  flex: 1;
  overflow: hidden;
  font-size: 14px;
  color: #374151;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.audio-count {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

/* 按钮样式 */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
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
</style>
