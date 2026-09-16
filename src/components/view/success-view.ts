import { Component } from '../base/component';
import { ensureElement, setText } from '../../utils/utils';
import type { ISuccessView } from '../../types';
import type { IEvents } from '../base/events';

export class SuccessView
	extends Component<{ total: string }>
	implements ISuccessView
{
	protected readonly totalElement: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this.totalElement = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		const closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);

		closeButton.addEventListener('click', () => {
			events.emit('success:close');
		});
	}

	render(data: { total: string }): HTMLElement {
		setText(this.totalElement, `Списано ${data.total}`);
		return this.element;
	}
}
