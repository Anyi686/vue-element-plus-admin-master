<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
</script>

<template>
  <ContentWrap :title="t('router.systemSetting')">
    <div class="page-container">
      <div class="text-center text-gray-500">
        {{ t('router.systemSetting') }}
      </div>
    </div>
  </ContentWrap>
</template>

<style lang="less" scoped>
.page-container {
  display: flex;
  min-height: 400px;
  align-items: center;
  justify-content: center;
}
</style>
