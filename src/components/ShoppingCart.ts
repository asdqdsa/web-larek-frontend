import { Component } from './base/Component';
import { createElement, ensureElement } from '../utils/utils';
import { IShoppingCartView, TShopCartActions, TShoppingCart } from '../types';

export class ShoppingCart
	extends Component<TShoppingCart>
	implements IShoppingCartView
{
	protected _items: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLElement;
	protected _itemIndex: HTMLElement;

	constructor(container: HTMLElement, actions: TShopCartActions) {
		super(container);
		this._items = ensureElement<HTMLElement>('.basket__list', this.container);
		this._price = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
		this._itemIndex = this.container.querySelector('.basket__item-index');
		this.items = [];
		if (this._button) this._button.addEventListener('click', actions.onClick);
	}

	set items(items: HTMLElement[]) {
		if (items.length) this._items.replaceChildren(...items);
		else {
			this._items.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Ваша Корзина пуста!',
				})
			);
		}
	}

	setOrderButton(value: number) {
		if (value > 0) this.setDisabled(this._button, false);
		else this.setDisabled(this._button, true);
	}

	set price(price: number) {
		this.setText(this._price, price + ' cинапсов');
	}

	setOrderIndex() {
		const orderedList = this.container.querySelectorAll('.basket__item-index');
		orderedList.forEach((item, idx) => this.setText(item, idx + 1));
	}
}
