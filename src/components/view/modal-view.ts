import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import type { IModalView } from '../../types';

export class ModalView extends Component implements IModalView {
	protected readonly closeButton: HTMLButtonElement;
	protected readonly contentElement: HTMLElement;
	protected readonly containerElement: HTMLElement;
	private onClose: (() => void) | null = null;

	constructor(container: HTMLElement) {
		super(container);

		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this.contentElement = ensureElement<HTMLElement>(
			'.modal__content',
			container
		);
		this.containerElement = ensureElement<HTMLElement>(
			'.modal__container',
			container
		);

		this.closeButton.addEventListener('click', () => {
			this.onClose?.();
		});

		this.element.addEventListener('click', (event) => {
			if (event.target === this.element) {
				this.onClose?.();
			}
		});
	}

	open(content: HTMLElement): void {
		this.contentElement.innerHTML = '';
		this.contentElement.append(content);
		this.element.classList.add('modal_active');
	}

	close(): void {
		this.contentElement.innerHTML = '';
		this.element.classList.remove('modal_active');
	}

	setCloseHandler(callback: () => void): void {
		this.onClose = callback;
	}
}
