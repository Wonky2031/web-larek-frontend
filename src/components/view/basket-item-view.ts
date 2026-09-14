import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import type { IBasketItemView, IProductView } from '../../types';

export class BasketItemView extends Component implements IBasketItemView {
	protected readonly indexElement: HTMLElement;
	protected readonly titleElement: HTMLElement;
	protected readonly priceElement: HTMLElement;
	protected readonly deleteButton: HTMLButtonElement;

	private onDelete: (() => void) | null = null;

	constructor(container: HTMLElement) {
		super(container);

		this.indexElement = ensureElement<HTMLElement>(
			'.basket__item-index',
			container
		);
		this.titleElement = ensureElement<HTMLElement>('.card__title', container);
		this.priceElement = ensureElement<HTMLElement>('.card__price', container);
		this.deleteButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);

		this.deleteButton.addEventListener('click', () => {
			this.onDelete?.();
		});
	}

	render(data: { product: IProductView; index: number }): HTMLElement {
		this.setText(this.indexElement, data.index);
		this.setText(this.titleElement, data.product.title);
		this.setText(this.priceElement, data.product.priceText);
		return this.element;
	}

	setDeleteHandler(callback: () => void): void {
		this.onDelete = callback;
	}
}
