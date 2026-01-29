<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { Table } from '@/components/Table'
import { ElTag } from 'element-plus'
import { CrudSchema } from '@/hooks/web/useCrudSchemas'
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
    field: 'username',
    label: t('userDemo.username'),
    search: {
      component: 'Input'
    }
  },
  {
    field: 'departmentName',
    label: t('userDemo.departmentName'),
    search: {
      hidden: true
    }
  },
  {
    field: 'roleName',
    label: t('userDemo.role'),
    search: {
      hidden: true
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
    field: 'action',
    label: t('tableDemo.action'),
    width: '260px',
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
        total,
        currentPage,
        pageSize
      }"
      @register="tableRegister"
    />
  </ContentWrap>
</template>
