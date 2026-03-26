---
name: gyazo-cli
description: "Use when: working with Gyazo images from the command line — uploading screenshots or image files to Gyazo, listing saved images, fetching OCR text extracted from images, or searching image history. Also use when the user mentions a gyazo.com URL and wants to extract text or get metadata from it. Requires GYAZO_ACCESS_TOKEN environment variable. Uses the gyazo-cli tool built with Bun."
---

# Gyazo CLI

A CLI tool for the Gyazo API. Source: https://github.com/mpppk/gyazo-cli

## Running

No installation needed — use `bunx`:

```bash
bunx github:mpppk/gyazo-cli <command> [options]
```

Or install globally once:

```bash
bun install -g github:mpppk/gyazo-cli
gyazo <command> [options]
```

## Prerequisites

```bash
export GYAZO_ACCESS_TOKEN=your_token_here
```

Get a token from https://gyazo.com/oauth/applications.

## Commands

### List images
```bash
bunx github:mpppk/gyazo-cli list [--page <n>] [--per-page <n>] [--json]
```
- Default: page 1, 20 results per page (max 100)

### Get image details
```bash
bunx github:mpppk/gyazo-cli get <image_id> [--ocr] [--json]
```
- `--ocr` — Print only the OCR text (useful for piping or scripting)
- `--json` — Full JSON including metadata and OCR

### Upload an image
```bash
bunx github:mpppk/gyazo-cli upload <file> [--access-policy anyone|only_me] [--title <str>] [--desc <str>] [--collection-id <str>] [--json]
```
- Prints `permalink_url` on success

### Search images (Gyazo Pro only)
```bash
bunx github:mpppk/gyazo-cli search <query> [--page <n>] [--per <n>] [--json]
```

## Image ID

The image ID is the hex string in a Gyazo URL:
```
https://gyazo.com/13fabb407b137e3ef76d46fa087941c2
                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                  image_id
```

## Key Notes

- OCR data lives at `metadata.ocr` — `--ocr` flag handles this automatically
- All commands accept `--json` for machine-readable output
- `search` requires a Gyazo Pro account

## Common Workflows

### Extract OCR text from a Gyazo URL
```bash
bunx github:mpppk/gyazo-cli get <image_id> --ocr
```

### Upload and get a shareable link
```bash
bunx github:mpppk/gyazo-cli upload screenshot.png
# → permalink : https://gyazo.com/...
```

### Pipe OCR text into another command
```bash
bunx github:mpppk/gyazo-cli get <image_id> --ocr | pbcopy   # copy to clipboard
bunx github:mpppk/gyazo-cli get <image_id> --ocr | grep "keyword"
```

### Browse recent captures as JSON
```bash
bunx github:mpppk/gyazo-cli list --per-page 50 --json | jq '.[].permalink_url'
```
