import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { API_URL as items, CDN_URL as images } from './utils/constants';
import { StoreAPI } from './components/StoreAPI';
import { AppState } from './components/AppData';
import { Page } from './components/Page';
import { ensureElement, cloneTemplate } from './utils/utils';
import { CatalogChangeEvent, ICatalogItem, ICartItem } from './types';
import { Card as CatalogItem, CartItem } from './components/Card';
import { Modal } from './components/Modal';
import { ShoppingCart, IShoppingCart } from './components/ShoppingCart';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new StoreAPI({ items, images });
const appData = new AppState({}, events);

events.onAll(({ eventName, data }) => console.log(eventName, data));

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// templates
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const itemCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const shoppingCart = new ShoppingCart(cloneTemplate(cartTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
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

events.on('order:open', () => {
	console.log('pressed order buton');
	// appData.setOrderPreview();
	modal.render({
		content: order.render({
			address: '',
			valid: true,
			errors: [],
		}),
	});
});

events.on('order:submit', () => {
	console.log('order has bee submitted');
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: true,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	console.log('contacts has bee submitted');
	const success = new Success(cloneTemplate(successTemplate), events, {
		onClick: () => {
			events.emit('items:changed');
			modal.close();
		},
	});
	modal.render({
		content: success.render({
			totalPrice: appData.getTotal(),
		}),
	});
});

// show cart
events.on('cart:open', (event) => {
	console.log(event);
	// const showItem = ()

	appData.setCartPreview();
	shoppingCart.price = appData.getTotal();
	modal.render({
		content: shoppingCart.render(),
	});
});

events.on('cart:preview', (cartState) => {
	console.log(cartState, 'send state');
	shoppingCart.items = appData.cartItems.map((item) => {
		const cartItem = new CartItem(cloneTemplate(itemCartTemplate), {
			onClick: () => events.emit('card:remove', item),
		});
		return cartItem.render({
			title: item.title,
			price: item.price,
		});
	});
});

events.on('card:remove', (item: ICartItem) => {
	appData.removeCartItem(item);
	appData.setCartPreview();
	events.emit('cart:updatePrice', item);
	// events.emit('cart:changed', item);
});

events.on('cart:updatePrice', (item) => {
	console.log('updating...', item);
});

// show modal card
events.on('card:select', (item: ICatalogItem) => {
	// console.log('selected');
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
		// console.log(card.button);
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
	// console.log('modal:openn');
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	// console.log('modal:closee');
	page.locked = false;
});

events.on('cart:changed', (item: ICatalogItem) => {
	// console.log('cart:changeddd');
	// console.log(item.status);
	if (!item.status) {
		appData.addItemCart(item);
		// appData.updateCartCounter();
		appData.setPreview(item);
	} else {
		console.log('indexts no!');
	}
});

events.on('cart:updateCounter', (count) => {
	console.log(count);
	page.cartCounter = Object.values(count);
});

api
	.getCatalogList()
	.then(appData.setCatalog.bind(appData))
	// .then((data) => console.log(data))
	.catch((error) => console.log(error));
