# gyazo-cli

Gyazo API を操作する CLI ツール。[Bun](https://bun.sh) で動作します。  
Note: このリポジトリのコードは100%AIが生成しており、内容はほとんど精査していません。利用する際は自己責任でお願いします。

## 必要条件

- [Bun](https://bun.sh) v1.0 以上

## インストール

```bash
git clone https://github.com/mpppk/gyazo-cli.git
cd gyazo-cli
bun install
bun link        # グローバルに `gyazo` コマンドとして登録
```

## セットアップ

[Gyazo API のダッシュボード](https://gyazo.com/oauth/applications) でアクセストークンを発行し、環境変数に設定します。

```bash
export GYAZO_ACCESS_TOKEN=your_access_token_here
```

## 使い方

```
gyazo <command> [options]
```

### コマンド一覧

| コマンド | 説明 |
|---|---|
| `list` | 画像一覧を取得 |
| `get <image_id>` | 特定の画像の詳細を取得 |
| `upload <file>` | 画像をアップロード |
| `search <query>` | 画像を検索（Gyazo Pro のみ） |

### `list` — 画像一覧

```bash
gyazo list [--page <n>] [--per-page <n>] [--json]
```

| オプション | デフォルト | 説明 |
|---|---|---|
| `--page` | 1 | ページ番号 |
| `--per-page` | 20 | 1 ページあたりの件数（最大 100） |
| `--json` | false | JSON 形式で出力 |

```bash
gyazo list
gyazo list --page 2 --per-page 50
gyazo list --json
```

### `get` — 画像詳細

```bash
gyazo get <image_id> [--json]
```

```bash
gyazo get 8980c52421e452ac3355ca3e5cfe7a0c
gyazo get 8980c52421e452ac3355ca3e5cfe7a0c --json
```

### `upload` — 画像アップロード

```bash
gyazo upload <file> [options]
```

| オプション | デフォルト | 説明 |
|---|---|---|
| `--access-policy` | `anyone` | 公開範囲 (`anyone` または `only_me`) |
| `--title` | — | ページタイトル |
| `--desc` | — | 画像の説明 |
| `--collection-id` | — | 追加するコレクション ID |
| `--json` | false | JSON 形式で出力 |

```bash
gyazo upload screenshot.png
gyazo upload screenshot.png --access-policy only_me
gyazo upload screenshot.png --title "My screenshot" --desc "homepage capture"
```

### `search` — 画像検索（Pro のみ）

```bash
gyazo search <query> [--page <n>] [--per <n>] [--json]
```

| オプション | デフォルト | 説明 |
|---|---|---|
| `--page` | 1 | ページ番号 |
| `--per` | 20 | 1 ページあたりの件数（最大 100） |
| `--json` | false | JSON 形式で出力 |

```bash
gyazo search "cat"
gyazo search "error log" --page 2 --per 50
```

## 開発

```bash
# 直接実行
GYAZO_ACCESS_TOKEN=xxx bun run src/index.ts list

# 型チェック
bun run typecheck
```
