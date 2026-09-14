import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import type { ICardView, IProductView } from '../../types';

export class CardView extends Component<IProductView> implements ICardView {
	protected readonly categoryElement: HTMLElement;
	protected readonly titleElement: HTMLElement;
	protected readonly imageElement: HTMLImageElement;
	protected readonly priceElement: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this.categoryElement = ensureElement<HTMLElement>(
			'.card__category',
			container
		);
		this.titleElement = ensureElement<HTMLElement>('.card__title', container);
		this.imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			container
		);
		this.priceElement = ensureElement<HTMLElement>('.card__price', container);
	}

	render(data: IProductView): HTMLElement {
		this.setText(this.titleElement, data.title);
		this.setText(this.priceElement, data.priceText);
		this.setImage(this.imageElement, data.imageUrl, data.title);

		this.setText(this.categoryElement, data.category);
		this.setCategoryModifier(data.categoryClass);

		return this.element;
	}

	setClickHandler(callback: () => void): void {
		this.element.addEventListener('click', callback);
	}

	private setCategoryModifier(modifier: string): void {
		const allModifiers = [
			'card__category_soft',
			'card__category_hard',
			'card__category_additional',
			'card__category_button',
			'card__category_other',
		];

		allModifiers.forEach((className) => {
			this.toggleClass(this.categoryElement, className, false);
		});

		this.toggleClass(this.categoryElement, `card__category_${modifier}`, true);
	}
}
