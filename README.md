<div align="center">
  <img width="100" src="./public/logo.png">
  <br><br>
  <h1>Lingke AI Management System</h1>
</div>

**English** | [中文](./README.zh-CN.md)

## Introduction

Lingke AI Management System is an intelligent outbound call management platform based on `Vue3`, `Element Plus`, `TypeScript`, and `Vite`. It provides comprehensive patient management, AI outbound call planning, and data analysis features for dental clinics and medical institutions.

## Features

- **Modern Tech Stack**: Built with Vue3, Vite6, TypeScript, and Element Plus
- **Patient Management**: Comprehensive patient information management and tracking
- **AI Outbound Calls**: Intelligent outbound call planning and script management
- **Plan Configuration**: Flexible marketing plan settings with customizable scripts
- **Data Analytics**: Real-time data dashboard and statistics
- **SMS Integration**: Built-in SMS notification system
- **User Management**: Role-based access control and user management
- **Internationalization**: Built-in i18n support (Chinese/English)
- **Theme Customization**: Configurable themes and layouts

## Main Modules

- **Today's Data** - Real-time business data overview
- **Patient Management** - Patient information CRUD operations
- **Plan Settings** - AI outbound call plan configuration
- **Data Upload** - Batch data import functionality
- **SMS Settings** - SMS template and notification management
- **System Settings** - System configuration and preferences

## Tech Stack

| Technology   | Version | Description                         |
| ------------ | ------- | ----------------------------------- |
| Vue          | 3.5.13  | Progressive JavaScript framework    |
| Vite         | 6.0.7   | Next generation frontend build tool |
| Element Plus | 2.9.2   | Vue 3 based component library       |
| TypeScript   | 5.7.3   | Typed JavaScript                    |
| Pinia        | 2.3.0   | State management                    |
| Vue Router   | 4.5.0   | Official router for Vue.js          |
| UnoCSS       | 0.65.4  | Instant on-demand atomic CSS engine |
| Axios        | 1.7.9   | HTTP client                         |

## Prerequisites

- [Node.js](http://nodejs.org/) >= 18.0.0
- [pnpm](https://pnpm.io/) >= 8.1.0
- [Git](https://git-scm.com/)

## Repository

- **Aliyun Codeup**: <https://codeup.aliyun.com/6848f7a6455bbe90fa4f8f7c/TelSopPC.git>

## Installation

```bash
# Clone the repository
git clone https://codeup.aliyun.com/6848f7a6455bbe90fa4f8f7c/TelSopPC.git

# Navigate to project directory
cd TelSopPC

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production (output: dist-pro/)
pnpm build:pro

# Build for development (output: dist-dev/)
pnpm build:dev

# Build for testing (output: dist-test/)
pnpm build:test
```

## Environment Configuration

| File        | Description                             |
| ----------- | --------------------------------------- |
| `.env.base` | Base configuration for all environments |
| `.env.dev`  | Development environment config          |
| `.env.test` | Testing environment config              |
| `.env.pro`  | Production environment config           |

## Browser Support

Recommended: Chrome 80+

|      IE       |      Edge       |     Firefox     |     Chrome      |     Safari      |
| :-----------: | :-------------: | :-------------: | :-------------: | :-------------: |
| Not supported | Last 2 versions | Last 2 versions | Last 2 versions | Last 2 versions |

## License

[MIT](./LICENSE)

## Acknowledgments

This project is based on [vue-element-plus-admin](https://github.com/kailong321200875/vue-element-plus-admin).
