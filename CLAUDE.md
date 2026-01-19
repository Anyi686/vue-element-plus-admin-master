# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

瓴可AI管理系统 (Lingke AI Management System) - An intelligent outbound call management platform for medical institutions, built on vue-element-plus-admin.

**Tech Stack:** Vue 3.5 + Vite 6 + TypeScript 5 + Element Plus 2.9 + Pinia 2 + UnoCSS

## Common Commands

```bash
# Development
pnpm dev              # Start dev server (port 4000)
pnpm i                # Install dependencies

# Build
pnpm build:pro        # Production build → dist-pro/
pnpm build:dev        # Development build → dist-dev/
pnpm build:test       # Test build → dist-test/

# Linting
pnpm lint:eslint      # ESLint with auto-fix
pnpm lint:format      # Prettier formatting
pnpm lint:style       # Stylelint for CSS/LESS
pnpm ts:check         # TypeScript type checking

# Preview builds
pnpm serve:pro        # Preview production build
```

## Architecture

### Directory Structure

```
src/
├── api/           # API layer (organized by feature)
├── axios/         # HTTP client with interceptors
├── components/    # Global reusable components
├── hooks/web/     # Vue composition API hooks (useForm, useTable, useI18n, etc.)
├── layout/        # App layout (TSX-based)
├── plugins/       # Third-party integrations
├── router/        # Route definitions (static + dynamic injection)
├── store/modules/ # Pinia stores (user, app, permission, tagsView, locale)
├── utils/         # Utility functions
└── views/         # Page components
```

### Key Patterns

**App Initialization** (main.ts):

```
setupI18n → setupStore → setupGlobCom → setupElementPlus → setupRouter → setupPermission → mount
```

**Routing:**

- Hash-based routing (`createWebHashHistory`)
- Static routes in `constantRouterMap`, dynamic routes in `asyncRouterMap`
- Permission store handles dynamic route injection

**State Management:**

- Feature-based Pinia stores with persistence plugin
- Key stores: `user.ts` (auth), `app.ts` (UI state), `permission.ts` (routes)

**HTTP Layer:**

- Axios wrapper at `src/axios/index.ts` with `request.get/post/put/delete`
- Auto Bearer token injection via Authorization header
- Response interceptor handles code===0 as success, 401 triggers logout

**API Organization:**

- APIs organized by feature: `src/api/{feature}/index.ts` + `types.ts`
- Example: `src/api/login/` contains all auth-related endpoints

### Hooks (src/hooks/web/)

| Hook         | Purpose                     |
| ------------ | --------------------------- |
| useForm      | Form handling & validation  |
| useTable     | Table CRUD operations       |
| useI18n      | Multi-language support      |
| useValidator | Form validation rules       |
| useStorage   | localStorage/sessionStorage |

### Permission System

- Route guard at `src/permission.ts`
- Permission directive: `v-permission="['admin', 'editor']"`
- Token stored in user store, persisted via Pinia plugin

## Environment Configuration

- `.env.base` - Base configuration
- `.env.dev` / `.env.test` / `.env.pro` - Environment-specific
- API proxy configured in vite.config.ts for `/api` and `/admin` endpoints

## Path Aliases

- `@/*` → `src/*`

## Build Optimization

Vite splits chunks:

- `vue-chunks`: Vue ecosystem
- `element-plus`: UI library
- `echarts`: Charts
- `wang-editor`: Rich text editor
