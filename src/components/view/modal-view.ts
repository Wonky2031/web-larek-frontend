import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import type { IModalView } from '../../types';
import type { IEvents } from '../base/events';

export class ModalView extends Component implements IModalView {
	protected readonly closeButton: HTMLButtonElement;
	protected readonly contentElement: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this.contentElement = ensureElement<HTMLElement>(
			'.modal__content',
			container
		);

		this.closeButton.addEventListener('click', () => {
			events.emit('modal:close');
		});

		this.element.addEventListener('click', (event) => {
			if (event.target === this.element) {
				events.emit('modal:close');
			}
		});
	}

	open(content: HTMLElement): void {
		this.contentElement.innerHTML = '';
		this.contentElement.append(content);
		this.element.classList.add('modal_active');
		document.body.classList.add('modal-open');
	}

	close(): void {
		this.contentElement.innerHTML = '';
		this.element.classList.remove('modal_active');
		document.body.classList.remove('modal-open');
	}
}
