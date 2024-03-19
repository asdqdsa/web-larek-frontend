import { ICatalogItem, IAppState, ICartItem } from '../types';
import { IOrder, IOrderForm } from './Order';
import { Model } from './base/Model';

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export class CatalogItem extends Model<ICatalogItem> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	status: boolean;
}

export class CartList extends Model<ICartItem> {
	id: string;
	title: string;
	price: number | null;
	status: boolean;
}

export class AppState extends Model<IAppState> {
	catalog: ICatalogItem[];
	cartList: ICartItem[];
	preview: string | null;
	cartItems: ICartItem[];
	total: number;
	// cartState: Set<string>;
	order: IOrder = {
		email: '',
		phone: '',
		address: '',
		items: [],
	};
	formErrors: FormErrors = {};

	setCatalog(items: ICatalogItem[]) {
		this.catalog = items.map((item) => {
			item.status = false;
			return new CatalogItem(item, this.events);
		});
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: ICatalogItem) {
		// this.preview = item.id;
		// this.cartState.push(item.id);
		// console.log(item.status, 'itemstatusappdata');

		// if (!item.status) this.emitChanges('preview:changed', item);
		// else this.emitChanges('preview:process', item);

		this.emitChanges('preview:changed', item);
	}

	addItemCart(item: ICatalogItem) {
		if (!this.cartState.has(item.id)) {
			this.cartState.add(item.id);
			item.status = true;
		} else {
			console.log('your item is allready in the cart');
		}
		// this.emitChanges('cart:changed', item);
		this.emitChanges('preview:changed', item);
		console.log(this.cartState);
		this.emitChanges('cart:updateCounter', {
			count: this.cartState.size,
		});
	}

	setCartPreview() {
		this.cartItems = this.catalog.filter((item) =>
			[...this.cartState].includes(item.id)
		);
		this.getTotal();
		console.log(this.cartItems);
		this.emitChanges('cart:preview', { cartState: this.cartItems });
	}

	setCartList(items: ICartItem[]) {
		this.cartList = items.map((item) => {
			return new CartList(item, this.events);
		});
	}

	getTotal(): number {
		this.total = this.cartItems.reduce((acc, next) => {
			return next.price === null ? acc : acc + next.price;
		}, 0);
		return this.total;
	}

	removeCartItem(item: ICartItem): void {
		item.status = false;
		this.cartState.delete(item.id);
		console.log(this.cartItems, 'this');
		this.getTotal();
		console.log(this.cartItems);
		this.emitChanges('cart:open');
		this.emitChanges('cart:updateCounter', {
			count: this.cartState.size,
		});
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	isAddressValid(input: any) {
		if (input.value.length > 0) return true;
		return false;
	}
}
