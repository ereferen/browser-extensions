# Octopath Traveler New Tab

Chrome の新規タブページをオクトパストラベラーの HD-2D UI 風にカスタマイズする拡張機能です。

## 機能

- **3カラムレイアウト**:
  - 左サイドバー: ブックマーク管理（16個まで）
  - 中央: 検索バー＋タイトル
  - 右サイドバー: 天気表示＋ニュースフィード
- **ブックマーク管理**:
  - カスタムブックマークの追加・編集
  - Chrome ブックマークからインポート
  - キーボードナビゲーション対応
- **検索バー**: Google 検索（`/` キーでフォーカス）
- **天気表示**: OpenWeatherMap API で現在地の天気を表示
- **ニュースフィード**: Hacker News の最新記事を表示
- **カスタム背景**: オクトパストラベラーの画像・動画を背景に設定可能
- **HD-2D エフェクト**: 光の粒子、ぼかし、グロー効果

## インストール方法

### 開発版（ローカル）

1. 依存関係をインストール:
   ```bash
   cd octopath-newtab
   npm install
   ```

2. ビルド:
   ```bash
   npm run build
   ```

3. Chrome で拡張機能をインストール:
   - `chrome://extensions/` を開く
   - 「デベロッパーモード」をオンにする
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - `dist` フォルダを選択

### 開発サーバー

開発中はホットリロードが使えます:

```bash
npm run dev
```

その後、Chrome 拡張機能の設定で `dist` フォルダをリロードしてください。

## カスタマイズ

### 背景画像・動画の設定

オクトパストラベラーの雰囲気を高めるため、お好きな背景画像や動画を設定できます:

1. `public/background/` フォルダに画像または動画を配置
2. `src/components/Background/Background.tsx` を開く
3. コメントアウトされている該当行を有効化し、ファイル名を変更

詳細は `public/background/README.md` を参照してください。

**注意**: オクトパストラベラーの画像・動画は著作権で保護されています。個人利用のみを目的としてください。

### 天気 API の設定

天気機能を使うには OpenWeatherMap の API キーが必要です:

1. [OpenWeatherMap](https://openweathermap.org/api) でアカウント作成
2. 無料 API キーを取得
3. ブラウザのコンソールで以下を実行:
   ```javascript
   localStorage.setItem('openweather_api_key', 'YOUR_API_KEY');
   ```
4. 新規タブをリロード

## 操作方法

| 操作 | アクション |
|------|-----------|
| `/` | 検索バーにフォーカス |
| `Esc` | 検索バーをクリア |
| 矢印キー | ブックマーク選択 |
| `Enter` | 選択したブックマークを開く |
| 右クリック | ブックマークを編集 |
| `Ctrl/Cmd + クリック` | 新しいタブで開く |

## 技術スタック

- React 18 + TypeScript
- Vite + @crxjs/vite-plugin
- CSS Modules
- Chrome Extension Manifest V3

## ディレクトリ構成

```
src/
├── components/
│   ├── Background/     # 背景・パーティクルエフェクト
│   ├── Bookmarks/      # ブックマーク管理
│   ├── SearchBar/      # 検索バー
│   ├── Weather/        # 天気表示
│   └── NewsFeed/       # ニュースフィード
├── styles/
│   ├── variables.css   # CSS変数（カラーパレット等）
│   └── effects.css     # HD-2D エフェクト
├── utils/
│   ├── storage.ts      # Chrome Storage API
│   └── api.ts          # 天気・ニュースAPI
└── App.tsx             # メインコンポーネント
```

## ライセンス

このプロジェクトは個人利用を目的としています。
オクトパストラベラーは SQUARE ENIX の登録商標です。
