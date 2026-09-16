import { FormView } from './form-view';
import { ensureElement } from '../../utils/utils';
import type { IContactsFormView } from '../../types';
import type { IEvents } from '../base/events';

export class ContactsFormView extends FormView implements IContactsFormView {
	protected readonly emailInput: HTMLInputElement;
	protected readonly phoneInput: HTMLInputElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events, 'contacts:submit');

		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			container
		);
		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			container
		);

		this.emailInput.addEventListener('input', () => {
			events.emit('contacts:email-change', { email: this.emailInput.value });
		});
		this.phoneInput.addEventListener('input', () => {
			events.emit('contacts:phone-change', { phone: this.phoneInput.value });
		});
	}

	render(data: { email: string; phone: string }): HTMLElement {
		this.setEmail(data.email);
		this.setPhone(data.phone);
		return this.element;
	}

	setEmail(value: string): void {
		this.emailInput.value = value;
	}

	setPhone(value: string): void {
		this.phoneInput.value = value;
	}
}
