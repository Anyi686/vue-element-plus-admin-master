<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import { ElForm, ElFormItem, ElInput, ElCheckbox, ElButton, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import type { FormInstance, FormRules } from 'element-plus'

const userStore = useUserStore()
const { currentRoute, push } = useRouter()

// 登录表单
const loginFormRef = ref<FormInstance>()
const loginForm = reactive({
  account: '',
  password: '',
  rememberMe: false
})

const loginRules: FormRules = {
  account: [{ required: true, message: '请输入您的账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入您的密码', trigger: 'blur' }]
}

const loading = ref(false)
const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  { immediate: true }
)

// 初始化
onMounted(() => {
  initLoginInfo()
})

// 初始化记住的登录信息
const initLoginInfo = () => {
  const loginInfo = userStore.getLoginInfo
  if (loginInfo) {
    loginForm.account = loginInfo.account || ''
    loginForm.password = loginInfo.password || ''
    loginForm.rememberMe = true
  }
}

// 账号密码登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login({
          account: loginForm.account,
          password: loginForm.password
        })

        // 记住密码
        if (loginForm.rememberMe) {
          userStore.setLoginInfo({
            account: loginForm.account,
            password: loginForm.password
          })
        } else {
          userStore.setLoginInfo(undefined)
        }

        ElMessage.success('登录成功')
        setTimeout(() => {
          push({ path: redirect.value || '/today-data/index', replace: true })
        }, 100)
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error((error as Error).message || '登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="login-form-container">
    <div class="text-center text-20px mb-24px font-600">欢迎登录</div>

    <ElForm ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
      <ElFormItem prop="account">
        <ElInput v-model="loginForm.account" placeholder="请输入账号" @keyup.enter="handleLogin" />
      </ElFormItem>
      <ElFormItem prop="password">
        <ElInput
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          show-password
          @keyup.enter="handleLogin"
        />
      </ElFormItem>
      <ElFormItem>
        <ElCheckbox v-model="loginForm.rememberMe">记住密码</ElCheckbox>
      </ElFormItem>
      <ElFormItem>
        <ElButton :loading="loading" type="primary" style="width: 100%" @click="handleLogin">
          {{ loading ? '登录中...' : '登 录' }}
        </ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style lang="less" scoped>
.login-form-container {
  width: 100%;
}
</style>
