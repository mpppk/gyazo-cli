import { GyazoClient, type GyazoImage } from "../api.ts";

export interface ListOptions {
	page: number;
	perPage: number;
	json: boolean;
}

function formatTable(images: GyazoImage[]): void {
	if (images.length === 0) {
		console.log("No images found.");
		return;
	}

	const idW = 32;
	const typeW = 5;
	const dateW = 25;
	const urlW = 50;

	const header =
		"IMAGE_ID".padEnd(idW) +
		"  " +
		"TYPE".padEnd(typeW) +
		"  " +
		"CREATED_AT".padEnd(dateW) +
		"  " +
		"URL";
	console.log(header);
	console.log("-".repeat(idW + typeW + dateW + urlW + 6));

	for (const img of images) {
		const row =
			img.image_id.padEnd(idW) +
			"  " +
			img.type.padEnd(typeW) +
			"  " +
			img.created_at.padEnd(dateW) +
			"  " +
			(img.permalink_url ?? img.url);
		console.log(row);
	}
}

export async function runList(opts: ListOptions): Promise<void> {
	const client = new GyazoClient();
	const images = await client.listImages(opts.page, opts.perPage);

	if (opts.json) {
		console.log(JSON.stringify(images, null, 2));
	} else {
		formatTable(images);
	}
}
