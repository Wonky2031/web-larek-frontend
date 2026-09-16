import { FormView } from './form-view';
import { ensureElement, toggleClass } from '../../utils/utils';
import type { IOrderFormView, TPayment } from '../../types';
import type { IEvents } from '../base/events';

export class OrderFormView extends FormView implements IOrderFormView {
	protected readonly cardButton: HTMLButtonElement;
	protected readonly cashButton: HTMLButtonElement;
	protected readonly addressInput: HTMLInputElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events, 'order:next');

		this.cardButton = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			container
		);
		this.cashButton = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			container
		);
		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			container
		);

		this.cardButton.addEventListener('click', () => {
			events.emit('order:payment-change', { payment: 'card' });
		});
		this.cashButton.addEventListener('click', () => {
			events.emit('order:payment-change', { payment: 'cash' });
		});
		this.addressInput.addEventListener('input', () => {
			events.emit('order:address-change', { address: this.addressInput.value });
		});
	}

	render(data: { payment: TPayment | ''; address: string }): HTMLElement {
		this.setPayment(data.payment);
		this.setAddress(data.address);
		return this.element;
	}

	setPayment(payment: TPayment | ''): void {
		toggleClass(this.cardButton, 'button_alt-active', payment === 'card');
		toggleClass(this.cashButton, 'button_alt-active', payment === 'cash');
	}

	setAddress(value: string): void {
		this.addressInput.value = value;
	}
}
