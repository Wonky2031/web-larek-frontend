import { Component } from '../base/component';
import { setText, setImage, toggleClass, setDisabled } from '../../utils/utils';
import type { ICardView, IProductView } from '../../types';
import type { IEvents } from '../base/events';

export class CardView extends Component<IProductView> implements ICardView {
	protected readonly titleElement: HTMLElement | null;
	protected readonly priceElement: HTMLElement | null;
	protected readonly imageElement: HTMLImageElement | null;
	protected readonly categoryElement: HTMLElement | null;
	protected readonly textElement: HTMLElement | null;
	protected readonly buttonElement: HTMLButtonElement | null;
	protected readonly indexElement: HTMLElement | null;
	protected readonly deleteButton: HTMLButtonElement | null;

	private productId: string | null = null;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this.titleElement = container.querySelector('.card__title');
		this.priceElement = container.querySelector('.card__price');
		this.imageElement = container.querySelector('.card__image');
		this.categoryElement = container.querySelector('.card__category');
		this.textElement = container.querySelector('.card__text');
		this.buttonElement = container.querySelector('.card__row .card__button');
		this.indexElement = container.querySelector('.basket__item-index');
		this.deleteButton = container.querySelector('.basket__item-delete');

		if (!this.deleteButton && !this.buttonElement) {
			this.element.addEventListener('click', () => {
				if (this.productId) events.emit('card:select', { id: this.productId });
			});
		}

		if (this.deleteButton) {
			this.deleteButton.addEventListener('click', () => {
				if (this.productId) events.emit('card:remove', { id: this.productId });
			});
		}

		if (this.buttonElement) {
			this.buttonElement.addEventListener('click', () => {
				if (this.productId) events.emit('card:toggle', { id: this.productId });
			});
		}
	}

	render(
		data: IProductView,
		options?: { index?: number; inBasket?: boolean }
	): HTMLElement {
		this.productId = data.id;

		if (this.titleElement) setText(this.titleElement, data.title);
		if (this.priceElement) setText(this.priceElement, data.priceText);
		if (this.imageElement)
			setImage(this.imageElement, data.imageUrl, data.title);

		if (this.categoryElement) {
			setText(this.categoryElement, data.category);
			this.setCategoryModifier(data.categoryClass);
		}

		if (this.textElement) setText(this.textElement, data.description);

		if (this.buttonElement && options?.inBasket !== undefined) {
			setText(this.buttonElement, options.inBasket ? 'Убрать' : 'В корзину');
			setDisabled(this.buttonElement, data.priceText === 'Бесценно');
		}

		if (this.indexElement && options?.index !== undefined) {
			setText(this.indexElement, options.index);
		}

		return this.element;
	}

	private setCategoryModifier(modifier: string): void {
		if (!this.categoryElement) return;

		const allModifiers = [
			'card__category_soft',
			'card__category_hard',
			'card__category_additional',
			'card__category_button',
			'card__category_other',
		];
		allModifiers.forEach((cls) =>
			toggleClass(this.categoryElement!, cls, false)
		);
		toggleClass(this.categoryElement, `card__category_${modifier}`, true);
	}
}
