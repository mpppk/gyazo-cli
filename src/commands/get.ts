import { GyazoClient, type GyazoImage } from "../api.ts";

export interface GetOptions {
	imageId: string;
	json: boolean;
	ocr: boolean;
}

function formatImage(img: GyazoImage): void {
	console.log(`image_id   : ${img.image_id}`);
	console.log(`type       : ${img.type}`);
	console.log(`created_at : ${img.created_at}`);
	console.log(`url        : ${img.url}`);
	console.log(`permalink  : ${img.permalink_url ?? "(none)"}`);
	console.log(`thumb_url  : ${img.thumb_url ?? "(none)"}`);
	console.log("metadata:");
	console.log(`  app      : ${img.metadata.app ?? "(none)"}`);
	console.log(`  title    : ${img.metadata.title ?? "(none)"}`);
	console.log(`  url      : ${img.metadata.url ?? "(none)"}`);
	console.log(`  desc     : ${img.metadata.desc ?? "(none)"}`);
	if (img.metadata.ocr) {
		console.log("ocr:");
		console.log(`  locale   : ${img.metadata.ocr.locale}`);
		console.log(`  text     : ${img.metadata.ocr.description.trim()}`);
	}
}

export async function runGet(opts: GetOptions): Promise<void> {
	const client = new GyazoClient();
	const image = await client.getImage(opts.imageId);

	if (opts.ocr) {
		if (!image.metadata.ocr) {
			console.error("No OCR data available for this image.");
			process.exit(1);
		}
		console.log(image.metadata.ocr.description.trim());
	} else if (opts.json) {
		console.log(JSON.stringify(image, null, 2));
	} else {
		formatImage(image);
	}
}
