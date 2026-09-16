export abstract class Component<T extends object = object> {
	readonly element: HTMLElement;

	protected constructor(element: HTMLElement) {
		this.element = element;
	}

	render(data?: Partial<T>): HTMLElement {
		return this.element;
	}
}
