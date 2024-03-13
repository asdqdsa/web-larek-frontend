import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
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
		// console.log(this._nextButton, 'modal next button');
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
		// if (this._nextButton) {
		// 	this._nextButton.addEventListener('click', (event) =>
		// 		console.log('fdsd')
		// 	);
		// }
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		console.log('open');
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
