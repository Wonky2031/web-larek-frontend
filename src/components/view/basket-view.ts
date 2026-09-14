import { Component } from '../base/component';
import { BasketItemView } from './basket-item-view';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import type { IBasketView, IProductView } from '../../types';

export class BasketView extends Component implements IBasketView {
	protected readonly listElement: HTMLElement;
	protected readonly totalElement: HTMLElement;
	protected readonly orderButton: HTMLButtonElement;

	private onOrder: (() => void) | null = null;
	private onRemove: ((id: string) => void) | null = null;

	constructor(container: HTMLElement) {
		super(container);

		this.listElement = ensureElement<HTMLElement>('.basket__list', container);
		this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
		this.orderButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

		this.orderButton.addEventListener('click', () => {
			this.onOrder?.();
		});
	}

	render(data: { items: IProductView[]; total: string }): HTMLElement {
		this.listElement.innerHTML = '';

		data.items.forEach((product, index) => {
			const itemElement = cloneTemplate<HTMLElement>('#card-basket');
			const itemView = new BasketItemView(itemElement);
			itemView.render({ product, index: index + 1 });
			itemView.setDeleteHandler(() => {
				this.onRemove?.(product.id);
			});

			this.listElement.append(itemElement);
		});

		this.setText(this.totalElement, data.total);
		this.setDisabled(this.orderButton, data.items.length === 0);

		return this.element;
	}

	setOrderHandler(callback: () => void): void {
		this.onOrder = callback;
	}

	setRemoveHandler(callback: (id: string) => void): void {
		this.onRemove = callback;
	}
}
