---
name: gyazo-cli
description: "次のときに使う: コマンドラインで Gyazo 画像を扱うとき。スクリーンショットや画像ファイルを Gyazo にアップロードしたい、保存済み画像を一覧したい、画像から抽出された OCR テキストを取得したい、画像履歴を検索したい場合に使う。ユーザーが gyazo.com の URL を示して、その画像からテキスト抽出やメタデータ取得をしたい場合にも使う。`GYAZO_ACCESS_TOKEN` 環境変数が必要。Bun で作られた `gyazo-cli` ツールを使う。"
---

# Gyazo CLI

Gyazo API を扱うための CLI ツール。ソース: https://github.com/mpppk/gyazo-cli

## 実行方法

インストール不要で `bunx` から実行できます:

```bash
bunx github:mpppk/gyazo-cli <command> [options]
```

または一度だけグローバルインストールします:

```bash
bun install -g github:mpppk/gyazo-cli
gyazo <command> [options]
```

## 事前準備

```bash
export GYAZO_ACCESS_TOKEN=your_token_here
```

トークンは https://gyazo.com/oauth/applications で取得します。

## コマンド

### 画像一覧
```bash
bunx github:mpppk/gyazo-cli list [--page <n>] [--per-page <n>] [--json]
```
- デフォルトは 1 ページ目、1 ページあたり 20 件です（最大 100 件）

### 画像詳細を取得
```bash
bunx github:mpppk/gyazo-cli get <image_id> [--ocr] [--json]
```
- `--ocr` - OCR テキストだけを出力します。パイプやスクリプトで使うときに便利です
- `--json` - メタデータと OCR を含む完全な JSON を出力します

### 画像をアップロード
```bash
bunx github:mpppk/gyazo-cli upload <file> [--access-policy anyone|only_me] [--title <str>] [--desc <str>] [--collection-id <str>] [--json]
```
- 成功すると `permalink_url` を出力します

### 画像を検索（Gyazo Pro のみ）
```bash
bunx github:mpppk/gyazo-cli search <query> [--page <n>] [--per <n>] [--json]
```

## 画像 ID

画像 ID は Gyazo URL に含まれる 16 進文字列です:
```
https://gyazo.com/13fabb407b137e3ef76d46fa087941c2
                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                  image_id
```

## 補足

- OCR データは `metadata.ocr` に入っています。`--ocr` フラグを使うと自動でそれを扱います
- すべてのコマンドで `--json` を使うと機械処理しやすい形式で出力できます
- `search` の利用には Gyazo Pro アカウントが必要です

## よくある使い方

### Gyazo URL から OCR テキストを取り出す
```bash
bunx github:mpppk/gyazo-cli get <image_id> --ocr
```

### アップロードして共有リンクを取得する
```bash
bunx github:mpppk/gyazo-cli upload screenshot.png
# → permalink: https://gyazo.com/...
```

### Markdown に画像を埋め込む（Gyazo Teams）
Gyazo Teams を使っている場合は、次の形式で画像の直リンクを作れます:

```text
https://t.gyazo.com/teams/[team-name]/[image-id].png
```

Markdown では、画像の直リンクを `img` 部分に、Gyazo の画像ページ URL をリンク先に指定します:

```md
[![Image from Gyazo](https://t.gyazo.com/teams/[team-name]/[image-id].png)](https://[team-name].gyazo.com/[image-id])
```

これで Markdown 上で画像がレンダリングされ、クリックすると Gyazo の画像ページを開けます。

### OCR テキストを別のコマンドに渡す
```bash
bunx github:mpppk/gyazo-cli get <image_id> --ocr | pbcopy   # クリップボードにコピー
bunx github:mpppk/gyazo-cli get <image_id> --ocr | grep "keyword"
```

### 最近のキャプチャを JSON で見る
```bash
bunx github:mpppk/gyazo-cli list --per-page 50 --json | jq '.[].permalink_url'
```
