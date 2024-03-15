import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { ICard, ICardActions, CatalogItemStatus, ICartItem } from '../types';

export class Card<T> extends Component<ICard<T>> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLSpanElement;
	protected _category?: HTMLSpanElement;
	protected _description?: HTMLParagraphElement;
	protected _button?: HTMLButtonElement;
	protected _statusBtn: boolean;

	constructor(
		container: HTMLElement,
		actions?: ICardActions,
		protected blockName: string = 'card'
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		// this._image = ensureElement<HTMLImageElement>(
		// 	`.${blockName}__image`,
		// 	container
		// );
		this._image = container.querySelector(`.${blockName}__image`);
		// if (this._image) {
		// 	this._image = ensureElement<HTMLImageElement>(
		// 		`.${blockName}__image`,
		// 		container
		// 	);
		// } else {
		// 	console.log('lol2');
		// 	this._image = null;
		// }

		this._price = ensureElement<HTMLSpanElement>(
			`.${blockName}__price`,
			container
		);
		// this._category = ensureElement<HTMLSpanElement>(
		// 	`.${blockName}__category`,
		// 	container
		// );
		this._category = container.querySelector(`.${blockName}__category`);

		this._description = container.querySelector(
			`.${blockName}__text`
		) as HTMLParagraphElement;
		this._button = container.querySelector(`.${blockName}__button`);
		// this._statusBtn =
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
			// this.container.addEventListener('click', actions.onClick);
			// console.log(this.statusBtn);
			if (this.statusBtn) {
				this.setDisabled(this._button, this._statusBtn);
				// console.log('disable');
			} else {
				// console.log('enable');
			}
		}
	}

	get button(): HTMLButtonElement {
		return this._button;
	}

	get statusBtn(): boolean {
		return this._statusBtn;
	}
	set statusBtn(value: boolean) {
		this._statusBtn = value;
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

	get description(): string {
		return this._category.textContent || '';
	}

	set description(value: string) {
		this.setDescription(this._description, value);
	}

	// get status(): any {
	// 	return this._status
	// }
}

export class CatalogItem1 extends Card<CatalogItemStatus> {
	protected _status: HTMLElement;
	// protected _statusBtn: boolean;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions, 'card');
	}

	set status({ status, label }: CatalogItemStatus) {
		this.setText(this._status, label);
	}
}

export class CartItem extends Card<ICartItem> {
	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions, 'card');
	}
}
