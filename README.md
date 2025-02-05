## 開發

```bash
# 克隆項目
git clone https://github.com/guanhuashan/horoscope-ui.git

# 進入項目目錄
cd ruoyi-ui

# 安裝依賴
npm install

# 建議不要直接使用 cnpm 安裝依賴，會有各種詭異的 bug。可以通過如下操作解決 npm 下載速度慢的問題
npm install --registry=https://registry.npmmirror.com

# 啟動服務
npm run dev
```

瀏覽器訪問 http://localhost:80

## 發布

```bash
# 構建測試環境
npm run build:stage

# 構建生產環境
export NODE_OPTIONS=--openssl-legacy-provider
npm run build:prod
```

nvm use 8
$ npm -v
8.19.4
linching-shiang ~/Downloads/horoscope-ui-master
$ node -v
v16.20.2
linching-s
