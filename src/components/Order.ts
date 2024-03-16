import { Form } from './Form';
// import { IOrderForm } from '../types';
import { EventEmitter, IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export interface IOrderForm {
	email: string;
	phone: string;
	address: string;
}

export class Order extends Form<IOrderForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set address(value: string) {
		(
			this.container.elements.namedItem('address') as HTMLInputElement
		).setAttribute('value', value);
	}
}
