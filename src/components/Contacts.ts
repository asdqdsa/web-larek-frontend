// import { IOrderForm } from '../types';
import { EventEmitter, IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { Form } from './Form';

export interface IContactsFormView {
	email: string;
	phone: string;
}

export type TContactsForm = {
	email: string;
	phone: string;
};

export type TContactsActions = {
	onClick: () => void;
};

export class Contacts extends Form<TContactsForm> implements IContactsFormView {
	protected _close: HTMLElement;

	constructor(
		container: HTMLFormElement,
		events: IEvents,
		actions: TContactsActions
	) {
		super(container, events);

		if (actions.onClick) {
			this._submit.addEventListener('click', actions.onClick);
		}
		this.valid = false;
	}

	get phone() {
		return this.container.phone.value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	get email() {
		return this.container.email.value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	setNextEnable(field: string, state: boolean) {
		// console.log(state);
		this.valid = state;
		// if (!state) {
		// 	this.errors = 'Укажите адрес/способ оплаты';
		// this.events.emit('formErrors:change', this.formErrors);
		// } else this.errors = '';
	}
}
