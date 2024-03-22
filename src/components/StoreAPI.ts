import {
	ICatalogItem,
	ApiPostMethods,
	ApiListResponse,
	Url,
	TOrder,
	TOrderResult,
} from '../types';

interface IStoreAPI {
	url: Url;
	options: RequestInit;
	handleResponse: (response: Response) => Promise<object>;
	get: (uri: string) => Promise<object>;
	post: (uri: string, data: object, method: ApiPostMethods) => Promise<object>;
	getCatalogList: () => Promise<ICatalogItem[]>;
}

export class StoreAPI implements IStoreAPI {
	readonly url: Url;
	options: RequestInit;

	constructor(url: Url, options: RequestInit = {}) {
		this.url = url;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	get(uri: string) {
		return fetch(this.url.items + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse);
	}

	post(uri: string, data: object, method: ApiPostMethods = 'POST') {
		return fetch(this.url.items + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse);
	}

	getCatalogList(): Promise<ICatalogItem[]> {
		return this.get('/product/').then((data: ApiListResponse<ICatalogItem>) => {
			return data.items.map((item) => ({
				...item,
				image: this.url.images + item.image,
			}));
		});
	}

	orderItems(order: TOrder): Promise<TOrderResult> {
		return this.post('/order', order).then((data: TOrderResult) => data);
	}
}
