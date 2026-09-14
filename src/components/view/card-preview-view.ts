import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import type { ICardPreviewView, IProductView } from '../../types';

export class CardPreviewView
	extends Component<{ product: IProductView; inBasket: boolean }>
	implements ICardPreviewView
{
	protected readonly categoryElement: HTMLElement;
	protected readonly titleElement: HTMLElement;
	protected readonly textElement: HTMLElement;
	protected readonly imageElement: HTMLImageElement;
	protected readonly priceElement: HTMLElement;
	protected readonly buttonElement: HTMLButtonElement;

	private onToggle: (() => void) | null = null;

	constructor(container: HTMLElement) {
		super(container);

		this.categoryElement = ensureElement<HTMLElement>(
			'.card__category',
			container
		);
		this.titleElement = ensureElement<HTMLElement>('.card__title', container);
		this.textElement = ensureElement<HTMLElement>('.card__text', container);
		this.imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			container
		);
		this.priceElement = ensureElement<HTMLElement>('.card__price', container);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.card__button',
			container
		);

		this.buttonElement.addEventListener('click', () => {
			this.onToggle?.();
		});
	}

	render(data: { product: IProductView; inBasket: boolean }): HTMLElement {
		const { product, inBasket } = data;

		this.setText(this.titleElement, product.title);
		this.setText(this.textElement, product.description);
		this.setText(this.priceElement, product.priceText);
		this.setImage(this.imageElement, product.imageUrl, product.title);
		this.setText(this.categoryElement, product.category);
		this.setCategoryModifier(product.categoryClass);

		this.setText(this.buttonElement, inBasket ? 'Убрать' : 'В корзину');
		this.setDisabled(this.buttonElement, product.priceText === 'Бесценно');

		return this.element;
	}

	setToggleHandler(callback: () => void): void {
		this.onToggle = callback;
	}

	private setCategoryModifier(modifier: string): void {
		const allModifiers = [
			'card__category_soft',
			'card__category_hard',
			'card__category_additional',
			'card__category_button',
			'card__category_other',
		];
		allModifiers.forEach((cls) =>
			this.toggleClass(this.categoryElement, cls, false)
		);
		this.toggleClass(this.categoryElement, `card__category_${modifier}`, true);
	}
}
