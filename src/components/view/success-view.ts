import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import type { ISuccessView } from '../../types';

export class SuccessView extends Component implements ISuccessView {
	protected readonly totalElement: HTMLElement;
	protected readonly closeButton: HTMLButtonElement;

	private onClose: (() => void) | null = null;

	constructor(container: HTMLElement) {
		super(container);

		this.totalElement = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);

		this.closeButton.addEventListener('click', () => {
			this.onClose?.();
		});
	}

	render(data: { total: string }): HTMLElement {
		this.setText(this.totalElement, `Списано ${data.total}`);
		return this.element;
	}

	setCloseHandler(callback: () => void): void {
		this.onClose = callback;
	}
}
