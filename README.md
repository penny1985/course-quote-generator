# 課程金句產生器

上傳簡報，AI 自動分析產出吸睛金句的互動工具。

## 功能特色

- 📤 上傳簡報圖片或 PDF
- 🤖 Gemini AI 自動分析產出 6 句金句
- 🎨 Shaders 動態漸層背景
- 📱 金句卡片可下載（1080x1080，適合社群分享）
- 💧 浮水印「陳沛孺」

---

## 部署步驟

### 1. 取得 Gemini API Key

1. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 登入 Google 帳號
3. 點擊「Create API Key」
4. 複製 API Key（格式像 `AIzaSy...`）

### 2. 部署到 Netlify

**方法 A：從 GitHub 部署（推薦）**

1. 把這個資料夾上傳到你的 GitHub
2. 前往 [Netlify](https://app.netlify.com)
3. 點擊「Add new site」→「Import an existing project」
4. 選擇你的 GitHub repo
5. Build settings 會自動偵測，直接點「Deploy」

**方法 B：直接拖曳部署**

1. 在本地執行：
   ```bash
   npm install
   npm run build
   ```
2. 把 `dist` 資料夾拖曳到 [Netlify Drop](https://app.netlify.com/drop)

### 3. 設定環境變數（重要！）

1. 在 Netlify 後台，進入你的 site
2. 點擊「Site configuration」→「Environment variables」
3. 點擊「Add a variable」
4. 設定：
   - Key: `GEMINI_API_KEY`
   - Value: 你的 Gemini API Key
5. 點擊「Create variable」
6. **重新部署**：到「Deploys」頁面，點擊「Trigger deploy」→「Deploy site」

### 4. 完成！

你的網站網址會是：`https://你的站名.netlify.app`

---

## 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置
npm run build
```

本地測試 Netlify Functions：
```bash
npm install -g netlify-cli
netlify dev
```

---

## 技術架構

- **前端**：React + Vite
- **視覺特效**：@paper-design/shaders-react
- **後端**：Netlify Functions
- **AI**：Google Gemini API

---

## 授權

陳沛孺 / 閱讀塗鴉實驗室
