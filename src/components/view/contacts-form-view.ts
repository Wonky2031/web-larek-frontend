import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import type { IContactsFormView } from '../../types';

export class ContactsFormView extends Component implements IContactsFormView {
	protected readonly formElement: HTMLFormElement;
	protected readonly emailInput: HTMLInputElement;
	protected readonly phoneInput: HTMLInputElement;
	protected readonly submitButton: HTMLButtonElement;
	protected readonly errorsElement: HTMLElement;

	private onEmailChange: ((value: string) => void) | null = null;
	private onPhoneChange: ((value: string) => void) | null = null;
	private onSubmit: (() => void) | null = null;

	constructor(container: HTMLElement) {
		super(container);

		this.formElement = container as HTMLFormElement;

		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			container
		);
		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			container
		);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			container
		);
		this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

		this.emailInput.addEventListener('input', () => {
			this.onEmailChange?.(this.emailInput.value);
		});
		this.phoneInput.addEventListener('input', () => {
			this.onPhoneChange?.(this.phoneInput.value);
		});
		this.formElement.addEventListener('submit', (event) => {
			event.preventDefault();
			this.onSubmit?.();
		});
	}

	render(): HTMLElement {
		this.formElement.reset();
		this.setEmail('');
		this.setPhone('');
		this.setErrors('');
		this.setDisabled(this.submitButton, true);
		return this.element;
	}

	setEmail(value: string): void {
		this.emailInput.value = value;
	}

	setPhone(value: string): void {
		this.phoneInput.value = value;
	}

	setErrors(message: string): void {
		this.setText(this.errorsElement, message);
	}

	setDisabledState(disabled: boolean): void {
		this.setDisabled(this.submitButton, disabled);
	}

	setEmailChangeHandler(callback: (value: string) => void): void {
		this.onEmailChange = callback;
	}

	setPhoneChangeHandler(callback: (value: string) => void): void {
		this.onPhoneChange = callback;
	}

	setSubmitHandler(callback: () => void): void {
		this.onSubmit = callback;
	}
}
