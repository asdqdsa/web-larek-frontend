import { ICatalogItem, IAppState, ICartItem } from '../types';
import { TOrder, TOrderForm, TPayment } from './Order';
import { Model } from './base/Model';

export type TFormErrors = Partial<Record<keyof TOrder, string>>;

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

export type TPaymentState = {
	payment?: null | string;
	address?: null | string;
};

export class AppState extends Model<IAppState> {
	catalog: ICatalogItem[];
	cartList: ICartItem[];
	preview: string | null;
	cartItems: ICartItem[];
	total: number;
	order: TOrder = {
		payment: null,
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: [],
	};
	formErrors: TFormErrors = {};

	setCatalog(items: ICatalogItem[]) {
		this.catalog = items.map((item) => {
			item.status = false;
			return new CatalogItem(item, this.events);
		});
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	// remove
	// setPreview(item: ICatalogItem) {
	// this.preview = item.id;
	// this.cartState.push(item.id);
	// console.log(item.status, 'itemstatusappdata');

	// if (!item.status) this.emitChanges('preview:changed', item);
	// else this.emitChanges('preview:process', item);

	// 	this.emitChanges('preview:changed', item);
	// }

	addItemCart(item: ICatalogItem) {
		if (!this.cartState.has(item.id)) {
			this.cartState.add(item.id);
			item.status = true;
		} else {
			console.error('your item is allready in the cart');
		}
		this.emitChanges('preview:changed', item);
		this.emitChanges('cart:updateCounter', {
			count: this.cartState.size,
		});
	}

	setCartPreview() {
		this.cartItems = this.catalog.filter((item) =>
			[...this.cartState].includes(item.id)
		);
		this.getTotal();
		this.emitChanges('cart:preview', { count: this.cartState.size });
	}

	setCartList(items: ICartItem[]) {
		this.cartList = items.map((item) => new CartList(item, this.events));
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
		this.getTotal();
		this.emitChanges('cart:open');
		this.emitChanges('cart:updateCounter', {
			count: this.cartState.size,
		});
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.email = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.phone = 'Необходимо указать тип оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	isAddressValid(input: any) {
		return input.value ? true : false;
	}

	setAddress(address: string) {
		this.paymentState.address = address;
		this.order.address = address;
	}

	setPaymentType(paymentType: string) {
		this.paymentState.payment = paymentType;
		this.order.payment = paymentType;
	}

	setPhone(phone: string) {
		this.contactsState.phone = phone;
		this.order.phone = phone;
	}

	setEmail(email: string) {
		this.contactsState.email = email;
		this.order.email = email;
	}

	isPayementPicked() {
		return this.paymentState.payment ? true : false;
	}

	isOrderValid() {
		const errors: typeof this.formErrors = {};
		if (!this.paymentState.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.paymentState.payment) {
			errors.payment = 'Необходимо указать тип оплаты';
		}
		this.formErrors = errors;
		this.events.emit('orderErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	isContactsValid() {
		const errors: typeof this.formErrors = {};
		if (!this.contactsState.email) {
			errors.email = 'Необходимо указать почту';
		}
		if (!this.contactsState.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;

		this.events.emit('contactsErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	getPricelessItems(): Set<string> {
		const pricelessItems = this.catalog.filter((item) => {
			return item.price === null || 0;
		});
		const setPriceless: Set<string> = new Set();
		pricelessItems.forEach((item) => setPriceless.add(item.id));
		return setPriceless;
	}

	createOrder() {
		const setPriceless = this.getPricelessItems();
		this.order.items = Array.from(this.cartState).filter(
			(id) => !setPriceless.has(id)
		);
		this.order.email = this.contactsState.email;
		this.order.phone = this.contactsState.phone;
		this.order.payment = this.paymentState.payment;
		this.order.address = this.paymentState.address;
		this.order.total = this.getTotal();
		this.clearAllItems();
	}

	clearAllItems() {
		this.cartItems.forEach((item) => (item.status = false));
		this.cartState.clear();
		this.emitChanges('cart:updateCounter', {
			count: this.cartState.size,
		});
		this.events.emit('items:changed');
	}
}
