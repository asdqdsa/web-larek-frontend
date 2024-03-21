import { IEvents } from './events';

// Гарда для проверки на модель
export const isModel = (obj: unknown): obj is Model<any> => {
	return obj instanceof Model;
};

/**
 * Базовая модель, чтобы можно было отличить ее от простых объектов с данными
 */
export type TPaymentState = {
	payment?: null | string;
	address?: null | string;
};

export type TContactsState = {
	email?: null | string;
	phone?: null | string;
};

export abstract class Model<T> {
	cartState: Set<string>;
	cartStateDict: Map<string, null | number>;
	paymentState: TPaymentState;
	contactsState: TContactsState;
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
		this.cartState = new Set();
		this.paymentState = { payment: null, address: null };
		this.contactsState = { email: null, phone: null };
	}

	// Сообщить всем что модель поменялась
	emitChanges(event: string, payload?: object) {
		// Состав данных можно модифицировать
		this.events.emit(event, payload ?? {});
	}

	// далее можно добавить общие методы для моделей
}
