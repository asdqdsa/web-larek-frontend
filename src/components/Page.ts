import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IPage } from '../types';

export class Page extends Component<IPage> {
	protected _catalog: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._catalog = ensureElement<HTMLElement>('.gallery');
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}
}
