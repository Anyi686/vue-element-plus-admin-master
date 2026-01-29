<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTree, ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { filter } from '@/utils/tree'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const treeRef = ref<InstanceType<typeof ElTree>>()

const formSchema = ref<FormSchema[]>([
  {
    field: 'roleName',
    label: t('role.roleName'),
    component: 'Input'
  },
  {
    field: 'status',
    label: t('menu.status'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('userDemo.disable'),
          value: 0
        },
        {
          label: t('userDemo.enable'),
          value: 1
        }
      ]
    }
  },
  {
    field: 'menu',
    label: t('role.menu'),
    colProps: {
      span: 24
    }
  }
])

const currentTreeData = ref<any>(null)
const nodeClick = (treeData: any) => {
  currentTreeData.value = treeData
}

const rules = reactive({
  roleName: [required()],
  status: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const treeData = ref<any[]>([])

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    const checkedKeys = unref(treeRef)?.getCheckedKeys() || []
    const data = filter(unref(treeData), (item: any) => {
      return checkedKeys.includes(item.id)
    })
    formData.menu = data || []
    console.log(formData)
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) {
      // Clear checkboxes on create
      unref(treeRef)?.setCheckedKeys([])
      return
    }
    setValues(currentRow)

    const checkedKeys = (currentRow.menu || []).map((v: any) => v.id)
    unref(treeRef)?.setCheckedKeys(checkedKeys)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema">
    <template #menu>
      <div class="flex w-full">
        <div class="flex-1">
          <ElTree
            ref="treeRef"
            show-checkbox
            node-key="id"
            highlight-current
            :check-strictly="true"
            :expand-on-click-node="false"
            :data="treeData"
            @node-click="nodeClick"
          >
            <template #default="{ data }">
              <span>{{ data.meta.title }}</span>
            </template>
          </ElTree>
        </div>
        <div class="flex-1">
          <ElCheckboxGroup
            v-if="currentTreeData && currentTreeData.permissionList"
            v-model="currentTreeData.meta.permission"
          >
            <ElCheckbox v-for="v in currentTreeData.permissionList" :key="v.value" :label="v.value">
              {{ v.label }}
            </ElCheckbox>
          </ElCheckboxGroup>
        </div>
      </div>
    </template>
  </Form>
</template>
