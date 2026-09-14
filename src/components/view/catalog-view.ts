import { Component } from '../base/component';
import { CardView } from './card-view';
import { cloneTemplate } from '../../utils/utils';
import type { ICatalogView, IProductView } from '../../types';

export class CatalogView
	extends Component<{ products: IProductView[] }>
	implements ICatalogView
{
	private onSelect: ((product: IProductView) => void) | null = null;

	constructor(container: HTMLElement) {
		super(container);
	}

	render(data: { products: IProductView[] }): HTMLElement {
		this.element.innerHTML = '';

		data.products.forEach((product) => {
			const cardElement = cloneTemplate<HTMLElement>('#card-catalog');
			const cardView = new CardView(cardElement);

			cardView.render(product);
			cardView.setClickHandler(() => {
				this.onSelect?.(product);
			});

			this.element.append(cardElement);
		});

		return this.element;
	}

	setSelectHandler(callback: (product: IProductView) => void): void {
		this.onSelect = callback;
	}
}
