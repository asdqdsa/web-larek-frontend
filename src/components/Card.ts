import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { TCardActions, ICardView, TCard, TDictCategoryCard } from '../types';

export class Card extends Component<TCard> implements ICardView {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLSpanElement;
	protected _category?: HTMLSpanElement;
	protected _description?: HTMLParagraphElement;
	protected _button?: HTMLButtonElement;
	protected _statusBtn: boolean;

	constructor(
		container: HTMLElement,
		actions: TCardActions,
		protected blockName: string = 'card'
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = container.querySelector(`.${blockName}__image`);
		this._price = ensureElement<HTMLSpanElement>(
			`.${blockName}__price`,
			container
		);
		this._category = container.querySelector(`.${blockName}__category`);
		this._description = container.querySelector(
			`.${blockName}__text`
		) as HTMLParagraphElement;
		this._button = container.querySelector(`.${blockName}__button`);
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
			if (this.statusBtn) this.setDisabled(this._button, this._statusBtn);
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
		if (value === null) this.setPrice(this._price, 'Бесценно');
		else this.setPrice(this._price, `${value} синапсов`);
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

	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) element.alt = alt;
		}
	}

	protected setPrice(element: HTMLSpanElement, value: unknown) {
		if (element) element.textContent = String(value);
	}

	protected setCategory(element: HTMLSpanElement, value: unknown) {
		if (element) element.textContent = String(value);
	}

	protected setDescription(element: HTMLSpanElement, value: unknown) {
		if (element) element.textContent = String(value);
	}

	setCategoryCard(value: string) {
		this.addStyleClass(this._category, TDictCategoryCard.get(value));
	}
}
