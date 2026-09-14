export abstract class Component<T extends object = object> {
	readonly element: HTMLElement;

	protected constructor(element: HTMLElement) {
		this.element = element;
	}

	protected setText(element: HTMLElement, value: unknown): void {
		if (element) {
			element.textContent = String(value);
		}
	}

	protected setImage(
		element: HTMLImageElement,
		src: string,
		alt = ''
	): void {
		if (element) {
			element.src = src;
			element.alt = alt;
		}
	}

	protected toggleClass(
		element: HTMLElement,
		className: string,
		force?: boolean
	): void {
		if (element) {
			element.classList.toggle(className, force);
		}
	}

	protected setDisabled(element: HTMLElement, state: boolean): void {
		if (element) {
			if (state) {
				element.setAttribute('disabled', 'disabled');
			} else {
				element.removeAttribute('disabled');
			}
		}
	}

	render(data?: Partial<T>): HTMLElement {
		if (data) {
			Object.assign(this, data);
		}
		return this.element;
	}
}
