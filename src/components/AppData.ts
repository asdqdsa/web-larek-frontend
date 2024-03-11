import { ICatalogItem, IAppState } from '../types';
import { Model } from './base/Model';

export class CatalogItem extends Model<ICatalogItem> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export class AppState extends Model<IAppState> {
	catalog: ICatalogItem[];
	setCatalog(items: ICatalogItem[]) {
		this.catalog = items.map((item) => new CatalogItem(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}
}
