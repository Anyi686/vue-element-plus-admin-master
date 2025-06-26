<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
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
    field: 'selection',
    table: {
      type: 'selection'
    }
  },
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'roleName',
    label: t('role.roleName'),
    search: {
      component: 'Input'
    }
  },
  {
    field: 'status',
    label: t('userDemo.status'),
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
    field: 'createTime',
    label: t('userDemo.createTime')
  },
  {
    field: 'remark',
    label: t('userDemo.remark')
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
              <BaseButton type="success">{t('exampleDemo.detail')}</BaseButton>
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
    <Search :schema="allSchemas.searchSchema" />
    <div class="mb-10px">
      <BaseButton type="primary">{{ t('exampleDemo.add') }}</BaseButton>
      <BaseButton type="danger">{{ t('exampleDemo.del') }}</BaseButton>
    </div>
    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total
      }"
      @register="tableRegister"
    />
  </ContentWrap>
</template>
