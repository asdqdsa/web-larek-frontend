import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export type IModalData = {
	content: HTMLElement;
};

export interface IModalView {
	content: HTMLElement;
	open(): void;
	close(): void;
	toggleCartBtn(state: boolean): void;
	render(data: IModalData): HTMLElement;
}

export class Modal extends Component<IModalData> implements IModalView {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	protected _nextButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);
		this._nextButton = container.querySelector('.card__button');
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.addStyleClass(this.container, 'modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.removeStyleClass(this.container, 'modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	toggleCartBtn(state: boolean) {
		this.setDisabled(this._nextButton, state);
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
