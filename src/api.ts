export class GyazoAPIError extends Error {
	constructor(
		message: string,
		public readonly status: number,
	) {
		super(message);
		this.name = "GyazoAPIError";
	}
}

export interface ImageMetadata {
	app: string | null;
	title: string | null;
	url: string | null;
	desc: string | null;
	ocr?: ImageOcr;
}

export interface ImageOcr {
	locale: string;
	description: string;
}

export interface GyazoImage {
	image_id: string;
	permalink_url: string | null;
	thumb_url: string | null;
	url: string;
	type: string;
	created_at: string;
	metadata: ImageMetadata;
}

export interface SearchResult {
	image_id: string;
	permalink_url: string | null;
	thumb_url: string | null;
	url: string;
	type: string;
	created_at: string;
	video_length?: number;
	mp4_url?: string;
	metadata: ImageMetadata;
}

export interface SearchResponse {
	captures: SearchResult[];
	number_of_captures: number;
	query: string;
}

export interface UploadResponse {
	image_id: string;
	permalink_url: string;
	thumb_url: string;
	url: string;
	type: string;
}

export interface UserResponse {
	user: {
		email: string;
		name: string;
		profile_image: string;
		uid: string;
	};
}

export interface UploadOptions {
	access_policy?: "anyone" | "only_me";
	metadata_is_public?: boolean;
	referer_url?: string;
	app?: string;
	title?: string;
	desc?: string;
	collection_id?: string;
}

export class GyazoClient {
	private readonly token: string;
	private readonly apiBase = "https://api.gyazo.com";
	private readonly uploadBase = "https://upload.gyazo.com";

	constructor(token?: string) {
		const resolved = token ?? process.env["GYAZO_ACCESS_TOKEN"];
		if (!resolved) {
			throw new Error(
				"Access token is required. Set GYAZO_ACCESS_TOKEN environment variable.",
			);
		}
		this.token = resolved;
	}

	private get authHeaders(): Record<string, string> {
		return { Authorization: `Bearer ${this.token}` };
	}

	private async request<T>(url: string, init?: RequestInit): Promise<T> {
		const res = await fetch(url, {
			...init,
			headers: {
				...this.authHeaders,
				...(init?.headers ?? {}),
			},
		});

		if (!res.ok) {
			let message = `HTTP ${res.status}: ${res.statusText}`;
			try {
				const body = (await res.json()) as { message?: string };
				if (body.message) message = body.message;
			} catch {
				// ignore parse errors
			}
			throw new GyazoAPIError(message, res.status);
		}

		return res.json() as Promise<T>;
	}

	async listImages(page = 1, perPage = 20): Promise<GyazoImage[]> {
		const params = new URLSearchParams({
			page: String(page),
			per_page: String(perPage),
		});
		return this.request<GyazoImage[]>(`${this.apiBase}/api/images?${params}`);
	}

	async getImage(imageId: string): Promise<GyazoImage> {
		return this.request<GyazoImage>(
			`${this.apiBase}/api/images/${encodeURIComponent(imageId)}`,
		);
	}

	async uploadImage(
		filePath: string,
		opts: UploadOptions = {},
	): Promise<UploadResponse> {
		const file = Bun.file(filePath);
		const formData = new FormData();
		// filename is required by the API
		formData.append("imagedata", file, file.name ?? "image");

		if (opts.access_policy)
			formData.append("access_policy", opts.access_policy);
		if (opts.metadata_is_public !== undefined)
			formData.append("metadata_is_public", String(opts.metadata_is_public));
		if (opts.referer_url) formData.append("referer_url", opts.referer_url);
		if (opts.app) formData.append("app", opts.app);
		if (opts.title) formData.append("title", opts.title);
		if (opts.desc) formData.append("desc", opts.desc);
		if (opts.collection_id)
			formData.append("collection_id", opts.collection_id);

		return this.request<UploadResponse>(`${this.uploadBase}/api/upload`, {
			method: "POST",
			body: formData,
		});
	}

	async searchImages(
		query: string,
		page = 1,
		per = 20,
	): Promise<SearchResponse> {
		const params = new URLSearchParams({
			query,
			page: String(page),
			per: String(per),
		});
		return this.request<SearchResponse>(`${this.apiBase}/api/search?${params}`);
	}
}
