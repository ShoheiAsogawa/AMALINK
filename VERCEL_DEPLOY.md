# Vercelでデプロイする方法

## 方法1: GitHubと連携して自動デプロイ（推奨・最も簡単）

### 手順

1. **Vercelアカウントを作成**
   - https://vercel.com にアクセス
   - 「Sign Up」をクリック
   - GitHubアカウントでログイン（推奨）

2. **プロジェクトをインポート**
   - Vercelのダッシュボードで「Add New...」→「Project」をクリック
   - GitHubリポジトリ一覧から「AMARINK」を選択
   - 「Import」をクリック

3. **設定を確認**
   - **Framework Preset**: Next.js（自動検出される）
   - **Root Directory**: `./`（そのまま）
   - **Build Command**: `npm run build`（自動設定）
   - **Output Directory**: `.next`（自動設定）
   - その他の設定はデフォルトのままでOK

4. **環境変数（必要に応じて）**
   - お問い合わせフォームでメール送信を使う場合、環境変数を設定
   - 「Environment Variables」セクションで追加可能

5. **デプロイ**
   - 「Deploy」ボタンをクリック
   - 数分でデプロイが完了します

6. **完了**
   - デプロイが完了すると、`https://amalink-xxxxx.vercel.app` のようなURLが生成されます
   - 今後、GitHubにpushするたびに自動的にデプロイされます

### カスタムドメインの設定（オプション）

1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Domains」を選択
3. ドメイン名を入力して「Add」をクリック
4. 表示されるDNS設定をドメインのDNS設定に追加

---

## 方法2: Vercel CLIを使う方法

### 手順

1. **Vercel CLIをインストール**
   ```bash
   npm i -g vercel
   ```

2. **ログイン**
   ```bash
   vercel login
   ```

3. **デプロイ**
   ```bash
   vercel
   ```
   - 初回は設定を聞かれますが、基本的にEnterキーで進めればOK

4. **本番環境にデプロイ**
   ```bash
   vercel --prod
   ```

---

## 注意事項

- Vercelでは`basePath`や`output: 'export'`の設定は不要です（自動的に最適化されます）
- APIルート（`/api/contact`）が正常に動作します
- 無料プランで十分に運用できます（月100GB帯域、無制限リクエスト）

## トラブルシューティング

### ビルドエラーが発生する場合
- Vercelのダッシュボードで「Deployments」タブを開き、エラーログを確認
- ローカルで`npm run build`が成功することを確認

### 環境変数が必要な場合
- Vercelダッシュボードの「Settings」→「Environment Variables」で設定
- 本番環境、プレビュー環境、開発環境で個別に設定可能

