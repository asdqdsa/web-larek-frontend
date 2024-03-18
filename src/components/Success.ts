import { EventEmitter, IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { Form } from './Form';
import { Component } from './base/Component';

export interface ISuccessForm {
	totalPrice: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccessForm> {
	protected _close: HTMLElement;
	protected _totalPrice: HTMLParagraphElement;
	constructor(
		container: HTMLFormElement,
		events: IEvents,
		actions?: ISuccessActions
	) {
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
	// set phone(value: string) {
	// 	(this.container.elements.namedItem('phone') as HTMLInputElement).value =
	// 		value;
	// }

	// set email(value: string) {
	// 	(this.container.elements.namedItem('email') as HTMLInputElement).value =
	// 		value;
	// }
	// set address(value: string) {
	// 	(
	// 		this.container.elements.namedItem('address') as HTMLInputElement
	// 	).setAttribute('value', value);
	// }
}
