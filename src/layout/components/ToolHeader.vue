<script lang="tsx">
import { defineComponent, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Collapse } from '@/components/Collapse'
import { LocaleDropdown } from '@/components/LocaleDropdown'
import { SizeDropdown } from '@/components/SizeDropdown'
import { UserInfo } from '@/components/UserInfo'
import { Screenfull } from '@/components/Screenfull'
import { Breadcrumb } from '@/components/Breadcrumb'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { useI18n } from '@/hooks/web/useI18n'
import { Icon } from '@/components/Icon'

export default defineComponent({
  name: 'ToolHeader',
  setup() {
    const router = useRouter()
    const { getPrefixCls, variables } = useDesign()
    const prefixCls = getPrefixCls('tool-header')
    const appStore = useAppStore()
    const { t } = useI18n()

    // 电话剩余分钟数（模拟数据）
    const phoneRemaining = ref(1000)

    // 面包屑
    const breadcrumb = computed(() => appStore.getBreadcrumb)

    // 折叠图标
    const hamburger = computed(() => appStore.getHamburger)

    // 全屏图标
    const screenfull = computed(() => appStore.getScreenfull)

    // 尺寸图标
    const size = computed(() => appStore.getSize)

    // 布局
    const layout = computed(() => appStore.getLayout)

    // 多语言图标
    const locale = computed(() => appStore.getLocale)

    // 打开帮助中心
    const openHelpCenter = () => {
      // 暂不跳转
    }

    // 打开账户明细
    const openAccountDetail = () => {
      router.push('/account-detail/index')
    }

    return () => (
      <div
        id={`${variables.namespace}-tool-header`}
        class={[
          prefixCls,
          'h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between'
        ]}
      >
        {layout.value !== 'top' ? (
          <div class="h-full flex items-center">
            {hamburger.value && layout.value !== 'cutMenu' ? (
              <Collapse class="custom-hover" color="var(--top-header-text-color)"></Collapse>
            ) : undefined}
            {breadcrumb.value ? <Breadcrumb class="<md:hidden"></Breadcrumb> : undefined}
          </div>
        ) : undefined}
        <div class="h-full flex items-center">
          {/* 电话剩余 */}
          <div
            class="flex items-center h-32px px-12px mx-4px rounded-6px cursor-pointer bg-[var(--el-fill-color-light)] hover:bg-[var(--el-fill-color)]"
            style="color: var(--top-header-text-color); transition: background-color 0.2s"
            onClick={openAccountDetail}
          >
            <Icon icon="vi-ant-design:phone-outlined" class="mr-6px text-16px"></Icon>
            <span class="text-13px">
              {t('common.phoneRemaining')}：
              <span class="text-14px font-600 text-indigo-500">{phoneRemaining.value}</span>{' '}
              {t('common.minutes')}
            </span>
          </div>
          {/* 帮助中心 */}
          <div
            class="flex items-center h-32px px-12px mx-4px rounded-6px cursor-pointer bg-[var(--el-fill-color-light)] hover:bg-[var(--el-fill-color)]"
            style="color: var(--top-header-text-color); transition: background-color 0.2s"
            onClick={openHelpCenter}
          >
            <Icon icon="vi-ant-design:question-circle-outlined" class="mr-6px text-16px"></Icon>
            <span class="text-13px <lg:hidden">{t('common.helpCenter')}</span>
          </div>
          {screenfull.value ? (
            <Screenfull class="custom-hover" color="var(--top-header-text-color)"></Screenfull>
          ) : undefined}
          {size.value ? (
            <SizeDropdown class="custom-hover" color="var(--top-header-text-color)"></SizeDropdown>
          ) : undefined}
          {locale.value ? (
            <LocaleDropdown
              class="custom-hover"
              color="var(--top-header-text-color)"
            ></LocaleDropdown>
          ) : undefined}
          <UserInfo></UserInfo>
        </div>
      </div>
    )
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-tool-header';

.@{prefix-cls} {
  transition: left var(--transition-time-02);
}
</style>
