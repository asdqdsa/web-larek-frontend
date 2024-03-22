export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	protected setText(element: HTMLElement | Element, value: unknown) {
		if (element) element.textContent = String(value);
	}

	protected setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	protected addStyleClass(element: HTMLElement, value: unknown) {
		if (element) element.classList.add(String(value));
	}

	protected removeStyleClass(element: HTMLElement, value: unknown) {
		if (element) element.classList.remove(String(value));
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
