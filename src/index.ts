import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { API_URL as items, CDN_URL as images } from './utils/constants';
import { StoreAPI } from './components/StoreAPI';
import { AppState } from './components/AppData';
import { Page, TUpdateCounter } from './components/Page';
import { ensureElement, cloneTemplate } from './utils/utils';
import { CatalogChangeEvent, ICatalogItem, ICartItem, Events } from './types';
import { Card as CatalogItem, CartItem } from './components/Card';
import { Modal } from './components/Modal';
import { ShoppingCart, IShoppingCart } from './components/ShoppingCart';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new StoreAPI({ items, images });
const appData = new AppState({}, events);

// debag
events.onAll(({ eventName, data }) => console.log(eventName, data));

const page = new Page(document.body, {
	onClick: (event) => events.emit('cart:open', event),
});
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

events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		// console.log(item.description);
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			// onClick: () => events.emit('card:select', item),
			onClick: () => events.emit('preview:changed', item),
		});
		card.setCategoryCard(item.category);
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

const order = new Order(cloneTemplate(orderTemplate), events, {
	onClick: () => console.log('jk11'),
});
events.on('order:open', () => {
	console.log('pressed order buton');
	// appData.setOrderPreview();
	// appData.checkValidation()
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

const contacts = new Contacts(cloneTemplate(contactsTemplate), events, {
	onClick: () => {
		console.log('jk');
	},
});
events.on('order:submit', () => {
	console.log('order has been submitted');
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: true,
			errors: [],
		}),
	});
});

events.on('order.address:change', (input: any) => {
	const isValid = appData.isAddressValid(input);
	console.log(isValid);
	order.setNextEnable(input.field, isValid);
});

events.on(/^contacts\..*:change/, (input: any) => {
	console.log('regex');
});

events.on('contacts:submit', () => {
	console.log('contacts has been submitted');
	const success = new Success(cloneTemplate(successTemplate), events, {
		onClick: () => {
			events.emit('items:changed');
			// appData.clearShoppingCart();
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
events.on('cart:open', () => {
	appData.setCartPreview();
	shoppingCart.price = appData.getTotal();
	modal.render({ content: shoppingCart.render() });
	// shoppingCart.setOrderIndex();
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
	shoppingCart.setOrderIndex();
});

events.on('card:remove', (item: ICartItem) => {
	appData.removeCartItem(item);
	appData.setCartPreview();
	events.emit('cart:updatePrice', item);
});

// events.on('cart:updatePrice', (item) => {
// 	console.log('updating...', item);
// });

// show modal card ?????????
// events.on('card:select', (item: ICatalogItem) => {
// 	appData.setPreview(item);
// });

events.on('preview:changed', (item: ICatalogItem) => {
	const showItem = (item: ICatalogItem) => {
		const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
			onClick: () => events.emit('cart:changed', item),
		});
		// modal.toggleCartBtn(item.status);
		card.button.disabled = item.status;
		card.setCategoryCard(item.category);
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
			.then(() => showItem(item))
			.catch((err) => console.error(err));
	} else modal.close();
});

events.on('modal:open', () => (page.locked = true));
events.on('modal:close', () => (page.locked = false));

events.on('cart:changed', (item: ICatalogItem) => {
	if (!item.status) {
		appData.addItemCart(item);
		// appData.setPreview(item);
		modal.toggleCartBtn(item.status);
	} else {
		console.log('something went wrong');
	}
});

events.on('cart:updateCounter', (count: TUpdateCounter) => {
	page.cartCounter = count;
});

api
	.getCatalogList()
	.then(appData.setCatalog.bind(appData))
	.catch((error) => console.log(error));
