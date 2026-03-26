import { existsSync } from "node:fs";
import { GyazoClient, type UploadOptions } from "../api.ts";

export interface UploadCommandOptions extends UploadOptions {
	filePath: string;
	json: boolean;
}

export async function runUpload(opts: UploadCommandOptions): Promise<void> {
	if (!existsSync(opts.filePath)) {
		console.error(`Error: File not found: ${opts.filePath}`);
		process.exit(1);
	}

	const client = new GyazoClient();
	const result = await client.uploadImage(opts.filePath, {
		access_policy: opts.access_policy,
		metadata_is_public: opts.metadata_is_public,
		title: opts.title,
		desc: opts.desc,
		collection_id: opts.collection_id,
		app: opts.app,
		referer_url: opts.referer_url,
	});

	if (opts.json) {
		console.log(JSON.stringify(result, null, 2));
	} else {
		console.log(`Uploaded successfully!`);
		console.log(`image_id  : ${result.image_id}`);
		console.log(`type      : ${result.type}`);
		console.log(`url       : ${result.url}`);
		console.log(`permalink : ${result.permalink_url}`);
	}
}
