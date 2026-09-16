// form-view.ts
import { Component } from '../base/component';
import { ensureElement, setText, setDisabled } from '../../utils/utils';
import type { IEvents } from '../base/events';

export abstract class FormView<T extends object = object> extends Component<T> {
	protected readonly formElement: HTMLFormElement;
	protected readonly submitButton: HTMLButtonElement;
	protected readonly errorsElement: HTMLElement;

	constructor(container: HTMLElement, events: IEvents, onSubmitEvent: string) {
		super(container);

		this.formElement = container as HTMLFormElement;
		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			container
		);
		this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

		this.formElement.addEventListener('submit', (event) => {
			event.preventDefault();
			events.emit(onSubmitEvent);
		});
	}

	setErrors(message: string): void {
		setText(this.errorsElement, message);
	}

	setDisabledState(disabled: boolean): void {
		setDisabled(this.submitButton, disabled);
	}
}
