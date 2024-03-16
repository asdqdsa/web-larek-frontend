// import { IOrderForm } from '../types';
import { EventEmitter, IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { Form } from './Form';

export interface IContactsForm {
	email: string;
	phone: string;
}

export class Contacts extends Form<IContactsForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
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
