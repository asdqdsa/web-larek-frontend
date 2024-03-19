import { Component } from './base/Component';
import { createElement, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

export interface IShoppingCart {
	items: HTMLElement[];
	price: number;
	list: HTMLElement[];
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class ShoppingCart extends Component<IShoppingCart> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLElement;
	protected _itemIndex: HTMLElement;

	constructor(
		container: HTMLElement,
		protected events: EventEmitter,
		actions?: ICardActions
	) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._price = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
		this._itemIndex = this.container.querySelector('.basket__item-index');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Ваша Корзина пуста',
				})
			);
		}
	}
	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	set price(price: number) {
		this.setText(this._price, price + ' cинопсов');
	}

	// set itemIndex(index: number) {
	// 	this.setText(this._itemIndex, index);
	// }

	setOrderIndex() {
		const orderedList = this.container.querySelectorAll('.basket__item-index');
		console.log(orderedList, 'list');
		for (let i = 0; i < orderedList.length; i++) {
			this.setText(orderedList[i], i + 1);
		}
	}

	// set list(items: HTMLElement[]) {
	// 	this._list.replaceChildren(...items);
	// }
}
