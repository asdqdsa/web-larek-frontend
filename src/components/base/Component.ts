export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	// check
	protected setText(element: HTMLElement | Element, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	//
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	// check
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	// check
	protected setPrice(element: HTMLSpanElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	// check
	protected setCategory(element: HTMLSpanElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	// check
	protected setDescription(element?: HTMLSpanElement, value?: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}
	//check
	protected addStyleClass(element: HTMLElement, value: unknown) {
		if (element) element.classList.add(String(value));
	}

	// check
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
