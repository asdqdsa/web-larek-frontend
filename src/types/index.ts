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

export interface ICard {
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
	// counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

// events enum
export enum Events {
	ITEMS_CHANGE = 'items:changed',
	PREVIEW_CHANGE = 'preview:changed',
	PREVIEW_PROCESS = 'preview:process',

	CARD_SELECT = 'card:select',
	CARD_REMOVE = 'card:remove',

	ORDER_OPEN = 'order:open',
	ORDER_ADDRESS = 'order:submit',
	ORDER_CONTACTS = 'contacts:submit',

	SHOPCART_OPEN = 'cart:open',
	SHOPCART_PREVIEW = 'cart:preview',
	SHOPTCART_CHANGE = 'cart:changed',
	SHOPCART_PRICE_UPD = 'cart:updatePrice',
	SHOPCART_COUNT_UPD = 'cart:updateCounter',
	ORDER_CHANGE_ADDRESS = 'order.address:change',

	MODAL_OPEN = 'modal:open',
	MODAL_CLOSE = 'modal:close',

	REGEX_CHANGE = `/^contacts..*:change/`, // ??
}

export enum CategoryCard {
	SOFT = 'софт-скил',
	OTHER = 'другое',
	MISC = 'дополнительное',
	BUTTON = 'кнопка',
	HARD = 'хард-скил',
}

export const CategoryCardDict: Map<CategoryCard, string> = new Map([
	[CategoryCard.SOFT, 'card__category_soft'],
	[CategoryCard.HARD, 'card__category_hard'],
	[CategoryCard.BUTTON, 'card__category_button'],
	[CategoryCard.OTHER, 'card__category_other'],
	[CategoryCard.MISC, 'card__category_additional'],
]);

export const dictCategoryCard: Map<string, string> = new Map([
	['софт-скил', 'card__category_soft'],
	['другое', 'card__category_hard'],
	['дополнительное', 'card__category_button'],
	['кнопка', 'card__category_other'],
	['хард-скил', 'card__category_additional'],
]);
