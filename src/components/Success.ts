import { EventEmitter, IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { Form } from './Form';
import { Component } from './base/Component';

export type TSuccessForm = {
	totalPrice: number;
};

export type TSuccessActions = {
	onClick: () => void;
};

export interface ISuccessView {
	totalPrice: number;
}

export class Success extends Component<TSuccessForm> implements ISuccessView {
	protected _close: HTMLElement;
	protected _totalPrice: HTMLParagraphElement;

	constructor(container: HTMLFormElement, actions: TSuccessActions) {
		super(container);

		this._totalPrice = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			this.container
		);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set totalPrice(value: number) {
		this.setText(this._totalPrice, value);
	}
}
