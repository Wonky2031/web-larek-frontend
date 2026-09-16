import { Component } from '../base/component';
import { ensureElement, setText, setDisabled } from '../../utils/utils';
import type { IBasketView } from '../../types';
import type { IEvents } from '../base/events';

export class BasketView extends Component implements IBasketView {
	protected readonly listElement: HTMLElement;
	protected readonly totalElement: HTMLElement;
	protected readonly orderButton: HTMLButtonElement;
	protected readonly emptyElement: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this.listElement = ensureElement<HTMLElement>('.basket__list', container);
		this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
		this.orderButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);
		this.emptyElement = ensureElement<HTMLElement>('.basket__empty', container);

		this.orderButton.addEventListener('click', () => {
			events.emit('order:start');
		});
	}

	render(data: { items: HTMLElement[]; total: string }): HTMLElement {
		this.listElement.innerHTML = '';

		data.items.forEach((item) => {
			this.listElement.append(item);
		});

		const isEmpty = data.items.length === 0;
		this.emptyElement.style.display = isEmpty ? 'block' : 'none';

		setText(this.totalElement, data.total);
		setDisabled(this.orderButton, isEmpty);

		return this.element;
	}
}
