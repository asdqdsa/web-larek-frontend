import { ICatalogItem, IAppState } from '../types';
import { Model } from './base/Model';

export class CatalogItem extends Model<ICatalogItem> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	status: boolean;
}

export class AppState extends Model<IAppState> {
	catalog: ICatalogItem[];
	preview: string | null;
	// cartState: string[];

	setCatalog(items: ICatalogItem[]) {
		this.catalog = items.map((item) => {
			item.status = false;
			return new CatalogItem(item, this.events);
		});
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: ICatalogItem) {
		this.preview = item.id;
		// this.cartState.push(item.id);
		// console.log(item.status, 'itemstatusappdata');
		if (!item.status) this.emitChanges('preview:changed', item);
		else this.emitChanges('preview:process', item);
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
		this.emitChanges('cart:preview', this.cartState);
	}

	// updateCartCounter() {}
}
