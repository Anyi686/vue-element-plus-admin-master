<div align="center">
  <img width="100" src="./public/logo.png">
  <br><br>
  <h1>瓴可AI管理系统</h1>
</div>

[English](./README.md) | **中文**

## 介绍

瓴可AI管理系统是一个基于 `Vue3`、`Element Plus`、`TypeScript` 和 `Vite` 开发的智能外呼管理平台。为口腔诊所和医疗机构提供全面的患者管理、AI外呼计划配置和数据分析功能。

## 特性

- **最新技术栈**：使用 Vue3、Vite6、TypeScript 和 Element Plus 构建
- **患者管理**：完善的患者信息管理和跟踪功能
- **AI外呼**：智能外呼计划配置和话术管理
- **计划配置**：灵活的营销计划设置，支持自定义话术
- **数据分析**：实时数据看板和统计分析
- **短信集成**：内置短信通知系统
- **用户管理**：基于角色的访问控制和用户管理
- **国际化**：内置中英文国际化支持
- **主题定制**：可配置的主题和布局

## 主要模块

- **今日数据** - 实时业务数据概览
- **患者管理** - 患者信息增删改查
- **计划设置** - AI外呼计划配置
- **数据上传** - 批量数据导入功能
- **短信设置** - 短信模板和通知管理
- **系统设置** - 系统配置和偏好设置

## 技术栈

| 技术         | 版本   | 说明                   |
| ------------ | ------ | ---------------------- |
| Vue          | 3.5.13 | 渐进式 JavaScript 框架 |
| Vite         | 6.0.7  | 下一代前端构建工具     |
| Element Plus | 2.9.2  | 基于 Vue 3 的组件库    |
| TypeScript   | 5.7.3  | JavaScript 的超集      |
| Pinia        | 2.3.0  | 状态管理               |
| Vue Router   | 4.5.0  | Vue.js 官方路由        |
| UnoCSS       | 0.65.4 | 即时按需原子 CSS 引擎  |
| Axios        | 1.7.9  | HTTP 客户端            |

## 前置要求

- [Node.js](http://nodejs.org/) >= 18.0.0
- [pnpm](https://pnpm.io/) >= 8.1.0
- [Git](https://git-scm.com/)

## 安装使用

```bash
# 克隆仓库
git clone <repository-url>

# 进入项目目录
cd vue-element-plus-admin-AI-call

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产环境
pnpm build:pro

# 构建开发环境
pnpm build:dev

# 构建测试环境
pnpm build:test
```

## 环境配置

| 文件        | 说明               |
| ----------- | ------------------ |
| `.env.base` | 所有环境的基础配置 |
| `.env.dev`  | 开发环境配置       |
| `.env.test` | 测试环境配置       |
| `.env.pro`  | 生产环境配置       |

## 浏览器支持

推荐使用 Chrome 80+ 浏览器

|   IE   |     Edge      |    Firefox    |    Chrome     |    Safari     |
| :----: | :-----------: | :-----------: | :-----------: | :-----------: |
| 不支持 | 最近 2 个版本 | 最近 2 个版本 | 最近 2 个版本 | 最近 2 个版本 |

## 许可证

[MIT](./LICENSE)

## 致谢

本项目基于 [vue-element-plus-admin](https://github.com/kailong321200875/vue-element-plus-admin) 开发。
