import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import type { IHeaderView } from '../../types';

export class HeaderView
	extends Component<{ count: number }>
	implements IHeaderView
{
	protected readonly counterElement: HTMLElement;
	protected readonly basketButton: HTMLButtonElement;

	constructor(container: HTMLElement) {
		super(container);

		this.counterElement = ensureElement<HTMLElement>(
			'.header__basket-counter',
			container
		);
		this.basketButton = ensureElement<HTMLButtonElement>(
			'.header__basket',
			container
		);
	}

	render(data: { count: number }): HTMLElement {
		this.setText(this.counterElement, data.count);
		return this.element;
	}

	setBasketHandler(callback: () => void): void {
		this.basketButton.addEventListener('click', callback);
	}
}
