import { Form } from './Form';
// import { IOrderForm } from '../types';
import { EventEmitter, IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export type TOrderForm = {
	address: string;
	payment: TPayment | null;
};

export type TPayment = 'cash' | 'card';

export type TOrderActions = {
	onClickPayment: (event: Event) => void;
};
export type TContactsForm = {
	email: string;
	phone: string;
};

// export type TOrder = {
// 	items: string[];
// } & TOrderForm &
// 	TContactsForm;

export type TOrder = {
	items: string[];
	address: string;
	payment: string | null;
	email: string;
	phone: string;
	total: number;
};

interface IOrderView {
	address: string;
	setNextEnable(field: string, state: boolean): void;
}

export class Order extends Form<TOrderForm> implements IOrderView {
	protected _cash: HTMLButtonElement;
	protected _card: HTMLButtonElement;
	protected _paymentTypes: HTMLElement[];
	protected _address: HTMLElement[];

	constructor(
		container: HTMLFormElement,
		events: IEvents,
		actions: TOrderActions
	) {
		super(container, events);

		this._cash = this.container.cash;
		this._card = this.container.card;
		this._paymentTypes = [this._cash, this._card];
		// this._address = this.container.elements.namedItem('address')

		if (actions.onClickPayment) {
			// this._submit.addEventListener('click', actions.onClick);
			this._card.addEventListener('click', actions.onClickPayment);
			this._cash.addEventListener('click', actions.onClickPayment);
		}
		this.valid = false;
	}

	get address() {
		return this.container.address.value;
	}

	set address(value: string) {
		(
			this.container.elements.namedItem('address') as HTMLInputElement
		).setAttribute('value', value);
	}

	setNextEnable(field: string, state: boolean) {
		// console.log(state);
		this.valid = state;
		// if (!state) {
		// 	this.errors = 'Укажите адрес/способ оплаты';
		// 	// this.events.emit('formErrors:change', this.formErrors);
		// } else this.errors = '';
	}

	setStyleBorder(paymentType: string) {
		this._paymentTypes.forEach((button) =>
			this.removeStyleClass(button, 'button_alt-active')
		);
		this.addStyleClass(this.container[paymentType], 'button_alt-active');
	}
}
