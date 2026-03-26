#!/usr/bin/env bun
import { parseArgs } from "util";
import { GyazoAPIError } from "./api.ts";
import { runGet } from "./commands/get.ts";
import { runList } from "./commands/list.ts";
import { runSearch } from "./commands/search.ts";
import { runUpload } from "./commands/upload.ts";

const HELP = `
gyazo-cli — Gyazo API command-line tool

USAGE
  gyazo <command> [options]

COMMANDS
  list                       List your images
  get <image_id>             Get image info
  upload <file>              Upload an image
  search <query>             Search images (Gyazo Pro only)

GLOBAL OPTIONS
  --json                     Output raw JSON
  --help, -h                 Show this help

COMMAND OPTIONS
  list
    --page <n>               Page number (default: 1)
    --per-page <n>           Results per page (default: 20, max: 100)

  get
    --ocr                    Print only the OCR text

  upload
    --access-policy <str>    anyone | only_me (default: anyone)
    --title <str>            Page title metadata
    --desc <str>             Description / comment
    --collection-id <str>    Collection ID to add to

  search
    --page <n>               Page number (default: 1)
    --per <n>                Results per page (default: 20, max: 100)

ENVIRONMENT
  GYAZO_ACCESS_TOKEN         Your Gyazo access token (required)
`.trim();

function printHelp(): void {
	console.log(HELP);
}

async function main(): Promise<void> {
	const rawArgs = process.argv.slice(2);

	if (rawArgs.length === 0 || rawArgs[0] === "--help" || rawArgs[0] === "-h") {
		printHelp();
		process.exit(0);
	}

	const [command, ...rest] = rawArgs;

	try {
		switch (command) {
			case "list": {
				const { values } = parseArgs({
					args: rest,
					options: {
						page: { type: "string", default: "1" },
						"per-page": { type: "string", default: "20" },
						json: { type: "boolean", default: false },
						help: { type: "boolean", short: "h", default: false },
					},
					strict: true,
				});
				if (values.help) {
					console.log(
						"Usage: gyazo list [--page <n>] [--per-page <n>] [--json]",
					);
					break;
				}
				await runList({
					page: parseInt(values.page!, 10),
					perPage: Math.min(parseInt(values["per-page"]!, 10), 100),
					json: values.json!,
				});
				break;
			}

			case "get": {
				const { values, positionals } = parseArgs({
					args: rest,
					options: {
						json: { type: "boolean", default: false },
						ocr: { type: "boolean", default: false },
						help: { type: "boolean", short: "h", default: false },
					},
					allowPositionals: true,
					strict: true,
				});
				if (values.help) {
					console.log("Usage: gyazo get <image_id> [--ocr] [--json]");
					break;
				}
				const imageId = positionals[0];
				if (!imageId) {
					console.error("Error: image_id is required.");
					console.error("Usage: gyazo get <image_id> [--ocr] [--json]");
					process.exit(1);
				}
				await runGet({ imageId, json: values.json!, ocr: values.ocr! });
				break;
			}

			case "upload": {
				const { values, positionals } = parseArgs({
					args: rest,
					options: {
						"access-policy": { type: "string", default: "anyone" },
						title: { type: "string" },
						desc: { type: "string" },
						"collection-id": { type: "string" },
						json: { type: "boolean", default: false },
						help: { type: "boolean", short: "h", default: false },
					},
					allowPositionals: true,
					strict: true,
				});
				if (values.help) {
					console.log(
						"Usage: gyazo upload <file> [--access-policy anyone|only_me] [--title <str>] [--desc <str>] [--collection-id <str>] [--json]",
					);
					break;
				}
				const filePath = positionals[0];
				if (!filePath) {
					console.error("Error: file path is required.");
					console.error("Usage: gyazo upload <file> [options]");
					process.exit(1);
				}
				const policy = values["access-policy"];
				if (policy !== "anyone" && policy !== "only_me") {
					console.error(
						`Error: --access-policy must be "anyone" or "only_me".`,
					);
					process.exit(1);
				}
				await runUpload({
					filePath,
					access_policy: policy,
					title: values.title,
					desc: values.desc,
					collection_id: values["collection-id"],
					json: values.json!,
				});
				break;
			}

			case "search": {
				const { values, positionals } = parseArgs({
					args: rest,
					options: {
						page: { type: "string", default: "1" },
						per: { type: "string", default: "20" },
						json: { type: "boolean", default: false },
						help: { type: "boolean", short: "h", default: false },
					},
					allowPositionals: true,
					strict: true,
				});
				if (values.help) {
					console.log(
						"Usage: gyazo search <query> [--page <n>] [--per <n>] [--json]",
					);
					break;
				}
				const query = positionals[0];
				if (!query) {
					console.error("Error: search query is required.");
					console.error(
						"Usage: gyazo search <query> [--page <n>] [--per <n>] [--json]",
					);
					process.exit(1);
				}
				await runSearch({
					query,
					page: parseInt(values.page!, 10),
					per: Math.min(parseInt(values.per!, 10), 100),
					json: values.json!,
				});
				break;
			}

			default:
				console.error(`Error: Unknown command "${command}"\n`);
				printHelp();
				process.exit(1);
		}
	} catch (err) {
		if (err instanceof GyazoAPIError) {
			console.error(`API error (HTTP ${err.status}): ${err.message}`);
		} else if (err instanceof Error) {
			console.error(`Error: ${err.message}`);
		} else {
			console.error("An unexpected error occurred.");
		}
		process.exit(1);
	}
}

main();
