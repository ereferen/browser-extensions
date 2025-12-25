# Background Media

このフォルダに背景画像や動画を配置できます。

## 使い方

1. オクトパストラベラーの画像または動画をこのフォルダに配置
   - 推奨フォーマット：
     - 画像: JPG, PNG, WebP
     - 動画: MP4, WebM

2. `src/components/Background/Background.tsx` を編集
   - コメント内の該当する行のコメントを解除
   - ファイル名を実際のファイル名に変更

## 例

### 画像の場合
```tsx
<img src="/background/octopath.jpg" alt="" className={styles.media} />
```

### 動画の場合
```tsx
<video autoPlay muted loop playsInline className={styles.media}>
  <source src="/background/octopath.mp4" type="video/mp4" />
</video>
```

## 注意事項

- オクトパストラベラーの画像や動画は著作権で保護されています
- 個人利用のみを目的としてください
- 動画を使用する場合、ファイルサイズが大きくなりすぎないように注意してください（推奨: 10MB以下）
- 軽量化のため、動画は短いループ（5-10秒）が推奨されます
