<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ref } from 'vue'

const { t } = useI18n()

const columns: TableColumn[] = [
  {
    field: 'title',
    label: t('tableDemo.title')
  },
  {
    field: 'video_uri',
    label: t('tableDemo.videoPreview')
  },
  {
    field: 'author',
    label: t('tableDemo.author')
  },
  {
    field: 'display_time',
    label: t('tableDemo.displayTime')
  },
  {
    field: 'pageviews',
    label: t('tableDemo.pageviews')
  }
]

const loading = ref(true)

const tableDataList = ref<any[]>([])

const getTableList = async () => {
  loading.value = true
  tableDataList.value = []
  loading.value = false
}

getTableList()
</script>

<template>
  <ContentWrap :title="t('router.PicturePreview')">
    <Table
      :columns="columns"
      :data="tableDataList"
      :loading="loading"
      :video-preview="['image_uri', 'video_uri']"
    />
  </ContentWrap>
</template>
