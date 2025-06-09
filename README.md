# EM-Client Project

## 项目概述
- 基于 Vue2 构建的 UniApp 项目
- 使用 HBuilderX v3.8.12 作为开发工具

## 环境配置

### Node.js 环境
- 使用 nvm-windows 管理 Node.js 版本
- 下载地址：[nvm-windows releases](https://github.com/coreybutler/nvm-windows/releases)
- 安装 Node.js：`nvm install 16.18.0`（要求版本 >= 16.18.0）

### npm 源管理
- 使用 nrm 管理 npm 源
- 安装：`npm install nrm -g`
- 查看可用源：`nrm ls`
- 切换源：`nrm use [registry]`

### 开发工具配置
#### HBuilderX 插件安装
- eslint-js：用于 JavaScript 代码校验
- eslint-plugin-vue：Vue 代码规范检查
- prettier：代码格式化（推荐使用，HBuilderX 自带的 jsbeautify 对 Vue 文件格式化支持不全面）

## 项目运行

### 安装依赖
```bash
npm install
```

### 运行到设备
#### 真机/模拟器连接
- HBuilderX 内置 adb 工具位置：`HBuilderX\plugins\launcher\tools\adbs`（可配置到系统环境变量）
- 连接 MuMu 模拟器：`adb connect 127.0.0.1:7555`

## 注意事项
- 云打包须使用 HBuilderX v3.8.12 版本（截至 2024-02-01）