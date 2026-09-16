import { Component } from '../base/component';
import type { ICatalogView } from '../../types';

export class CatalogView
	extends Component<{ items: HTMLElement[] }>
	implements ICatalogView
{
	constructor(container: HTMLElement) {
		super(container);
	}

	render(data: { items: HTMLElement[] }): HTMLElement {
		this.element.innerHTML = '';

		data.items.forEach((item) => {
			this.element.append(item);
		});

		return this.element;
	}
}
