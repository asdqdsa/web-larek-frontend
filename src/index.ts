import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { API_URL as items, CDN_URL as images } from './utils/constants';
import { StoreAPI } from './components/StoreAPI';
import { AppState } from './components/AppData';
import { Page } from './components/Page';
import { ensureElement, cloneTemplate } from './utils/utils';
import { CatalogChangeEvent, ICatalogItem } from './types';
import { CatalogItem } from './components/Card';
import { Modal } from './components/Modal';

const events = new EventEmitter();
const api = new StoreAPI({ items, images });
const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// templates
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		// console.log(item.description);
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

// show modal card
events.on('card:select', (item: ICatalogItem) => {
	console.log('selected');
	appData.setPreview(item);
});

events.on('preview:changed', (item: ICatalogItem) => {
	const showItem = (item: ICatalogItem) => {
		const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
			onClick: () => events.emit('cart:changed', item),
		});

		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				category: item.category,
				price: item.price,
				description: item.description,
				statusBtn: item.status,
			}),
		});
	};
	if (item) {
		api
			.getCatalogItem(item.id)
			.then((result) => {
				item.description = result.description;
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

events.on('preview:process', (item: ICatalogItem) => {
	const showItem = (item: ICatalogItem) => {
		const card = new CatalogItem(cloneTemplate(cardPreviewTemplate));
		console.log(card.button);
		card.button.disabled = item.status;
		modal.render({ content: card.render({ ...item }) });
	};
	if (item) {
		api
			.getCatalogItem(item.id)
			.then((result) => {
				item.description = result.description;
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	console.log('modal:openn');
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	console.log('modal:closee');
	page.locked = false;
});

events.on('cart:changed', (item: ICatalogItem) => {
	console.log('cart:changeddd');
	console.log(item.status);
	if (!item.status) {
		appData.addItemCart(item);
		appData.setPreview(item);
	} else {
		console.log('indexts no!');
	}
});

api
	.getCatalogList()
	.then(appData.setCatalog.bind(appData))
	// .then((data) => console.log(data))
	.catch((error) => console.log(error));

events.onAll(({ eventName, data }) => console.log(eventName, data));
