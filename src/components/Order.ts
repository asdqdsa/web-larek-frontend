import { Form } from './Form';
// import { IOrderForm } from '../types';
import { EventEmitter, IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export type TOrderForm = {
	email: string;
	phone: string;
	address: string;
};

export type TOrderActions = {
	onClick: () => void;
};

export type TOrder = {
	items: string[];
} & TOrderForm;

export class Order extends Form<TOrderForm> {
	constructor(
		container: HTMLFormElement,
		events: IEvents,
		actions: TOrderActions
	) {
		super(container, events);

		if (actions?.onClick) {
			this._submit.addEventListener('click', actions.onClick);
		}
		this.valid = false;
	}

	set address(value: string) {
		(
			this.container.elements.namedItem('address') as HTMLInputElement
		).setAttribute('value', value);
	}

	setNextEnable(field: string, state: boolean) {
		this.valid = state;
		if (!state) this.errors = 'the field is empty';
		else this.errors = '';
	}
}
