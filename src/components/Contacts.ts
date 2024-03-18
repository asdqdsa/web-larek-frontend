// import { IOrderForm } from '../types';
import { EventEmitter, IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { Form } from './Form';

export interface IContactsForm {
	email: string;
	phone: string;
	actions?: IContactsActions;
}

export interface IContactsActions {
	onClick: () => void;
}

export class Contacts extends Form<IContactsForm> {
	protected _close: HTMLElement;

	constructor(
		container: HTMLFormElement,
		events: IEvents,
		actions?: IContactsActions
	) {
		super(container, events);

		// this._close = ensureElement<HTMLElement>(
		// 	'.order-success__close',
		// 	this.container
		// );
		if (actions?.onClick) {
			this._submit.addEventListener('click', actions.onClick);
		}
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	// set address(value: string) {
	// 	(
	// 		this.container.elements.namedItem('address') as HTMLInputElement
	// 	).setAttribute('value', value);
	// }
}
