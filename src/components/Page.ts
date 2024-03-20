import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
// import { IPage } from '../types';

export type TPage = {
	catalog: HTMLElement[];
	locked: boolean;
	cartCounter: TUpdateCounter;
};

export type TUpdateCounter = {
	count: number;
};

export type TPageActions = {
	onClick: (event: MouseEvent) => void;
};

export interface IPageView {
	catalog: HTMLElement[];
	cartCounter: TUpdateCounter;
	locked: boolean;
}

export class Page extends Component<TPage> implements IPageView {
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _cart: HTMLElement;
	protected _cartCounter: HTMLElement;

	constructor(container: HTMLElement, actions: TPageActions) {
		super(container);
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._cart = ensureElement<HTMLElement>('.header__basket');
		this._cartCounter = ensureElement<HTMLElement>('.header__basket-counter');

		if (actions?.onClick) this._cart.addEventListener('click', actions.onClick);
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set cartCounter(data: TUpdateCounter) {
		this.setText(this._cartCounter, data.count);
	}

	set locked(value: boolean) {
		if (value) this._wrapper.classList.add('page__wrapper_locked');
		else this._wrapper.classList.remove('page__wrapper_locked');
	}
}
