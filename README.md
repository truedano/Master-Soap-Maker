# 手工皂製作大師 (Master Soap Maker)

<div align="center">
  <img src="public/soap_favicon.png" width="80" height="80" alt="Logo" />
  <h3>專業級手工皂配方計算與製作輔助工具</h3>
  <p>專為手工皂愛好者打造的現代化 Web 應用程式，提供精確的配方計算、即時成本估算與完整的製作指南。</p>
  <p>
    <img src="https://img.shields.io/badge/version-1.0.1-blue.svg" alt="Version 1.0.1" />
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
    <img src="https://img.shields.io/badge/built%20with-React%20%2B%20Vite-61DAFB.svg" alt="Built with React" />
  </p>
</div>

---

## ✨ 核心功能 (Features)

### 1. 🧪 專業配方計算 (Smart Calculator)
- **即時數值分析**：自動計算 INS 值、NaOH 用量、水量及總油脂重。
- **五力分析雷達圖**：視覺化呈現配方的清潔力、起泡力、硬度、保濕度與穩定度。
- **專家建議系統**：若配方數值超出建議範圍，系統會自動提供補救建議（如增加椰子油以提升硬度）。
- **雙重輸入模式**：支援「重量 (g)」與「比例 (%)」兩種輸入方式，滿足不同習慣。
- **精準水量調整**：支援自訂水量倍數（1.0 ~ 5.0 倍），適配不同氣候與需求。

### 2. ✨ 創意添加物管理 (Additives)
- **多樣化支持**：支援精油、香氛、色粉、礦泥等多種添加物紀錄。
- **比例公式**：支援以「總油重百分比 (%)」或「固定重量 (g)」計算添加量。
- **安全提醒系統**：內建精油濃度監控，若比例超過安全上限（3-5%）會即時發出黃/紅警告。
- **成本整合**：添加物成本自動計入總製造成本，提供最精確的報價報告。

### 3. 📚 油脂百科 (Oil Encyclopedia)
- **詳細資料庫**：收錄數十種常用油脂的詳細特性（皂化價、INS、脂肪酸組成等）。
- **五力排行**：可根據硬度、清潔力等指標對油脂進行排序，快速找到合適的油品。
- **自訂價格**：支援設定油脂單價，系統會自動記憶並用於成本估算。

### 4. 💰 成本估算 (Cost Estimation)
- **即時報價**：根據配方用量與自訂單價，即時計算總成本與每 100g 成本。
- **預算分佈圖**：視覺化呈現各項油品的成本佔比，協助精確控制預算。

### 5. 📝 製作流程導引 (Production Guide)
- **逐步教學**：從溶鹼、融油到入模的完整步驟教學。
- **打皂製作單**：提供專注模式的「製作單 Overlay」，列出精確稱重清單與步驟勾選功能。
- **安全提醒**：內建安全警語與注意事項，確保製作過程安全無虞。

### 6. 📂 配方管理 (Recipe Management)
- **本地儲存**：所有配方皆儲存在瀏覽器本地端 (LocalStorage)，隱私安全且支援離線使用。
- **一鍵列印**：支援輸出精美的 PDF 配方報告，包含添加物細節與實作筆記區。
- **懶人包**：內建多款經典配方（如 72% 馬賽皂、家事皂），新手也能輕鬆開始。

### 7. 🎨 多元主題介面 (UI Themes)
- **經典橘 (Classic)**：溫暖的手作質感。
- **自然綠 (Natural)**：清爽的植萃風格。
- **極簡黑 (Minimal)**：現代感的低飽和配色。

---

## 🛠️ 技術堆疊 (Tech Stack)

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: GitHub Actions (GH Pages)

---

## 🚀 快速開始 (Quick Start)

### 前置需求
確保您的電腦已安裝 [Node.js](https://nodejs.org/) (建議 v18 以上)。

### 1. 安裝依賴
```bash
npm install
```

### 2. 啟動開發伺服器
```bash
npm run dev
```
打開瀏覽器訪問 `http://localhost:3000` 即可開始使用。

### 3. 建置生產版本
```bash
npm run build
```

---

## 📦 部署指南 (Deployment)

本專案已配置 GitHub Actions 自動化部署。

1. **推送代碼**：將代碼推送到 GitHub `main` 分支。
2. **自動部署**：如果是首次部署，請至 Repository Settings > Pages > Source 選擇 "GitHub Actions"。
3. **查看狀態**：在 Actions 頁籤查看部署進度。

---

## ⚠️ 免責聲明

本應用程式僅供教學與輔助計算參考。手工皂製作涉及化學反應（強鹼），請務必：
1. 全程佩戴防護裝備（護目鏡、手套、口罩）。
2. 於通風良好處操作。
3. 嚴格遵守「鹼入水」的安全順序。

---

<div align="center">
  <p>Made with ❤️ by Master Soap Maker Team</p>
</div>
