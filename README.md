# 星座運勢後臺管理系統

基於 Vue2 + Element UI 的星座運勢管理後台系統，用於管理星座運勢、問答等相關內容。

## 技術架構

### 前端技術
- 核心框架：Vue 2.6.12
- UI 框架：Element UI 2.15.14
- 構建工具：Vue CLI 4.3.1
- 路由管理：Vue Router 3.4.9
- 狀態管理：Vuex 3.6.0
- HTTP 客戶端：Axios 0.24.0
- 國際化：vue-i18n 8.22.2
- 圖表：ECharts 4.9.0

### 開發環境
- Node.js: v16.20.2
- npm: v8.19.4
- 包管理器: yarn 1.22.4

## 功能模塊

### 系統管理
- 用戶管理
- 角色管理
- 菜單管理
- 部門管理
- 崗位管理
- 字典管理
- 參數設置
- 通知公告
- 日誌管理

### 問答管理
- 建議管理
  - AI 類型：預設、GoogleMap、Plexity
- 主題管理

### 運勢管理
- 運勢結果
- 運勢匹配

## 快速開始

### 環境準備
```bash
# 安裝 nvm (如果未安裝)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安裝並使用 Node.js v16.20.2
nvm install 16.20.2
nvm use 16.20.2

# 安裝 yarn
npm install -g yarn
```

### 安裝和運行
```bash
# 克隆項目
git clone https://github.com/guanhuashan/horoscope-ui.git

# 進入項目目錄
cd horoscope-ui

# 安裝依賴
yarn install

# 啟動服務
yarn dev
```

### 發布部署
```bash
# 構建測試環境
yarn build:stage

# 構建生產環境
yarn build:prod
```

## 項目結構
```
horoscope-ui
├── build                      # 構建相關
├── public                     # 公共資源
│   ├── favicon.ico           # favicon圖標
│   ├── index.html            # html模板
│   └── robots.txt            # 爬蟲配置文件
├── src                       # 源代碼
│   ├── api                   # 所有請求
│   │   ├── question         # 問答相關接口
│   │   │   ├── suggestion.js # 建議管理
│   │   │   └── topic.js     # 主題管理
│   │   └── system           # 系統管理相關接口
│   ├── assets               # 主題、字體等靜態資源
│   ├── components           # 全局公用組件
│   ├── directive           # 全局指令
│   ├── layout              # 主要框架結構
│   ├── router              # 路由
│   ├── store               # 全局 store
│   ├── utils              # 全局公用方法
│   ├── views              # 所有頁面
│   ├── App.vue           # 入口頁面
│   └── main.js           # 入口文件
├── .env.development      # 開發環境配置
├── .env.staging         # 測試環境配置
├── .env.production      # 生產環境配置
├── vue.config.js        # vue-cli 配置
└── package.json         # package.json
```

## 開發規範

### 代碼規範
1. 遵循 ESLint 規範
2. 組件命名採用大駝峰命名法 (PascalCase)
3. API 接口統一管理在 api 目錄下
4. 路由配置統一管理在 router 目錄下

### Git 規範
1. 提交前需要通過 lint 檢查
2. commit message 需要清晰描述改動內容

## 注意事項
1. Node.js 版本建議使用 v16.20.2
2. 開發環境需要設置 NODE_OPTIONS=--openssl-legacy-provider
3. 不建議使用 cnpm 安裝依賴
4. 生產環境構建前需要確認 API 配置
5. 如果遇到 SSL 相關問題，需要設置 NODE_OPTIONS 環境變量

## 常見問題
1. 如果出現 crypto 相關錯誤，請確保設置了正確的 NODE_OPTIONS
2. 開發環境的接口代理配置在 vue.config.js 中
3. 生產環境的接口地址配置在 .env.production 中

## 版本歷史
- v1.0.0 - 初始版本
  - 基礎架構搭建
  - 問答系統開發
  - 運勢系統開發

## 授權信息
MIT License