// export type IItem =

export interface ICatalogItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	status: boolean;
}

export interface ICartItem {
	id: string;
	title: string;
	price: number | null;
	status: boolean;
}

// types for API
export type Url = {
	images: string;
	items: string;
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

// types for AppData
export interface IAppState {
	catalog: ICatalogItem[];
}

export type CatalogChangeEvent = {
	catalog: ICatalogItem[];
};

// types for card
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export type CatalogItemStatus = {
	status: string;
	label: string;
};

export interface ICard<T> {
	// description: string;
	image?: string;
	title: string;
	category?: string;
	price: number | null;
	description?: string;
	statusBtn: boolean;
	// status: T;
}

// types for Page
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}
