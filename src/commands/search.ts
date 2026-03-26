import { GyazoClient, type SearchResult } from "../api.ts";

export interface SearchOptions {
	query: string;
	page: number;
	per: number;
	json: boolean;
}

function formatTable(
	results: SearchResult[],
	total: number,
	query: string,
): void {
	console.log(`Query: "${query}"  Total: ${total}\n`);

	if (results.length === 0) {
		console.log("No results found.");
		return;
	}

	const idW = 32;
	const typeW = 5;
	const dateW = 25;

	const header =
		"IMAGE_ID".padEnd(idW) +
		"  " +
		"TYPE".padEnd(typeW) +
		"  " +
		"CREATED_AT".padEnd(dateW) +
		"  " +
		"URL";
	console.log(header);
	console.log("-".repeat(idW + typeW + dateW + 55));

	for (const img of results) {
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

export async function runSearch(opts: SearchOptions): Promise<void> {
	const client = new GyazoClient();
	const response = await client.searchImages(opts.query, opts.page, opts.per);

	if (opts.json) {
		console.log(JSON.stringify(response, null, 2));
	} else {
		formatTable(response.captures, response.number_of_captures, response.query);
	}
}
