import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import type { IOrderFormView, TPayment } from '../../types';

export class OrderFormView extends Component implements IOrderFormView {
	protected readonly formElement: HTMLFormElement;
	protected readonly cardButton: HTMLButtonElement;
	protected readonly cashButton: HTMLButtonElement;
	protected readonly addressInput: HTMLInputElement;
	protected readonly submitButton: HTMLButtonElement;
	protected readonly errorsElement: HTMLElement;

	private onPaymentChange: ((payment: TPayment) => void) | null = null;
	private onAddressChange: ((address: string) => void) | null = null;
	private onSubmit: (() => void) | null = null;

	constructor(container: HTMLElement) {
		super(container);
		this.formElement = container as HTMLFormElement;
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
		this.submitButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			container
		);
		this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

		this.cardButton.addEventListener('click', () => {
			this.onPaymentChange?.('card');
		});
		this.cashButton.addEventListener('click', () => {
			this.onPaymentChange?.('cash');
		});
		this.addressInput.addEventListener('input', () => {
			this.onAddressChange?.(this.addressInput.value);
		});
		this.formElement.addEventListener('submit', (event) => {
			event.preventDefault();
			this.onSubmit?.();
		});
	}

	render(): HTMLElement {
		this.formElement.reset();
		this.setPayment('');
		this.setAddress('');
		this.setErrors('');
		this.setDisabled(this.submitButton, true);
		return this.element;
	}

	setPayment(payment: TPayment | ''): void {
		this.toggleClass(this.cardButton, 'button_alt-active', payment === 'card');
		this.toggleClass(this.cashButton, 'button_alt-active', payment === 'cash');
	}

	setAddress(value: string): void {
		this.addressInput.value = value;
	}

	setErrors(message: string): void {
		this.setText(this.errorsElement, message);
	}

	setDisabledState(disabled: boolean): void {
		this.setDisabled(this.submitButton, disabled);
	}

	setPaymentChangeHandler(callback: (payment: TPayment) => void): void {
		this.onPaymentChange = callback;
	}

	setAddressChangeHandler(callback: (address: string) => void): void {
		this.onAddressChange = callback;
	}

	setSubmitHandler(callback: () => void): void {
		this.onSubmit = callback;
	}
}
