import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { ICard, ICardActions, CatalogItemStatus } from '../types';

export class Card<T> extends Component<ICard<T>> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLSpanElement;
	protected _category: HTMLSpanElement;
	// protected _description?: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._price = ensureElement<HTMLSpanElement>(
			`.${blockName}__price`,
			container
		);
		this._category = ensureElement<HTMLSpanElement>(
			`.${blockName}__category`,
			container
		);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	get price(): string {
		return this._price.textContent || '';
	}

	set price(value: string) {
		if (value === null) this.setPrice(this._price, 'Priceless');
		else this.setPrice(this._price, value);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set category(value: string) {
		this.setCategory(this._category, value);
	}
}

export class CatalogItem extends Card<CatalogItemStatus> {
	protected _status: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
	}

	set status({ status, label }: CatalogItemStatus) {
		this.setText(this._status, label);
	}
}
