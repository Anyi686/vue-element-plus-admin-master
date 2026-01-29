<script setup lang="ts">
import PanelGroup from './components/PanelGroup.vue'
import { ElRow, ElCol, ElCard, ElSkeleton } from 'element-plus'
import { Echart } from '@/components/Echart'
import { pieOptions, barOptions, lineOptions } from './echarts-data'
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { set } from 'lodash-es'
import { EChartsOption } from 'echarts'
import { useI18n } from '@/hooks/web/useI18n'
import { useAppStore } from '@/store/modules/app'

useI18n()

const loading = ref(false)

const appStore = useAppStore()
const isDark = computed(() => appStore.getIsDark)

const pieOptionsData = reactive<EChartsOption>(pieOptions) as EChartsOption

const barOptionsData = reactive<EChartsOption>(barOptions) as EChartsOption

const lineOptionsData = reactive<EChartsOption>(lineOptions) as EChartsOption

/**
 * 更新 legend.textStyle
 */
const updateLegendTextStyle = (options) => {
  const newTextStyle = {
    color: isDark.value ? '#ccc' : '#333'
  }
  const inactiveColor = isDark.value ? '#abacac' : '#ccc'
  set(options, 'title.textStyle', newTextStyle)
  if (options !== barOptionsData) {
    set(options, 'legend.textStyle', newTextStyle)
    set(options, 'legend.inactiveColor', inactiveColor)
  }
  options === pieOptionsData && set(options, 'series[0].emptyCircleStyle.color', inactiveColor)
}

// 监听暗黑模式变化并重新更新样式
watch(isDark, () => {
  updateLegendTextStyle(pieOptionsData)
  updateLegendTextStyle(barOptionsData)
  updateLegendTextStyle(lineOptionsData)
})
onMounted(() => {
  updateLegendTextStyle(pieOptionsData)
  updateLegendTextStyle(barOptionsData)
  updateLegendTextStyle(lineOptionsData)
})
</script>

<template>
  <PanelGroup />
  <ElRow :gutter="20" justify="space-between">
    <ElCol :xl="10" :lg="10" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="pieOptionsData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :xl="14" :lg="14" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="barOptionsData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :span="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated :rows="4">
          <Echart :options="lineOptionsData" :height="350" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
</template>
