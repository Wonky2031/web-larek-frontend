import { Component } from '../base/component';
import { ensureElement, setText } from '../../utils/utils';
import type { IHeaderView } from '../../types';
import type { IEvents } from '../base/events';

export class HeaderView
	extends Component<{ count: number }>
	implements IHeaderView
{
	protected readonly counterElement: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this.counterElement = ensureElement<HTMLElement>(
			'.header__basket-counter',
			container
		);
		const basketButton = ensureElement<HTMLButtonElement>(
			'.header__basket',
			container
		);

		basketButton.addEventListener('click', () => {
			events.emit('basket:open');
		});
	}

	render(data: { count: number }): HTMLElement {
		setText(this.counterElement, data.count);
		return this.element;
	}
}
