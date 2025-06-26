<script setup lang="ts">
import { PropType } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'

defineProps({
  detailSchema: {
    type: Array as PropType<DescriptionsSchema[]>,
    default: () => []
  },
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
