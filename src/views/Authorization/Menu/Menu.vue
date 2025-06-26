<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ElTag } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { reactive } from 'vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { BaseButton } from '@/components/Button'

const { t } = useI18n()

const { tableRegister, tableState } = useTable({
  fetchDataApi: async () => {
    return {
      list: [],
      total: 0
    }
  }
})

const { loading, dataList, total, currentPage, pageSize } = tableState

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: t('menu.index'),
    type: 'index'
  },
  {
    field: 'meta.title',
    label: t('menu.title')
  },
  {
    field: 'meta.icon',
    label: t('menu.icon')
  },
  {
    field: 'component',
    label: t('menu.component')
  },
  {
    field: 'path',
    label: t('menu.path')
  },
  {
    field: 'status',
    label: t('menu.status'),
    table: {
      slots: {
        default: (data: any) => {
          return (
            <ElTag type={data.row.status === 0 ? 'danger' : 'success'}>
              {data.row.status === 1 ? t('userDemo.enable') : t('userDemo.disable')}
            </ElTag>
          )
        }
      }
    }
  },
  {
    field: 'action',
    width: '260px',
    label: t('tableDemo.action'),
    table: {
      slots: {
        default: () => {
          return (
            <>
              <BaseButton type="primary">{t('exampleDemo.edit')}</BaseButton>
              <BaseButton type="danger">{t('exampleDemo.del')}</BaseButton>
            </>
          )
        }
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
</script>

<template>
  <ContentWrap>
    <div class="mb-10px">
      <BaseButton type="primary">{{ t('exampleDemo.add') }}</BaseButton>
    </div>
    <Table
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total
      }"
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      @register="tableRegister"
    />
  </ContentWrap>
</template>
