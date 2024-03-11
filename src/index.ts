import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { API_URL as items, CDN_URL as images } from './utils/constants';
import { StoreAPI } from './components/StoreAPI';
import { AppState } from './components/AppData';
import { Page } from './components/Page';
import { ensureElement, cloneTemplate } from './utils/utils';
import { CatalogChangeEvent } from './types';
import { CatalogItem } from './components/Card';

const events = new EventEmitter();
const api = new StoreAPI({ items, images });
const appData = new AppState({}, events);

const page = new Page(document.body, events);

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// templates
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		console.log(item.category);
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

api
	.getCatalogList()
	.then(appData.setCatalog.bind(appData))
	// .then((data) => console.log(data))
	.catch((error) => console.log(error));
