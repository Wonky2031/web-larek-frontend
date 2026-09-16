import type { IEvents } from '../base/events';
import type { IBuyer, IBuyerModel, TPayment } from '../../types';

export class BuyerModel implements IBuyerModel {
	private buyer: IBuyer = {
		payment: '',
		address: '',
		email: '',
		phone: '',
	};

	constructor(private readonly events: IEvents) {}

	setPayment(payment: TPayment): void {
		this.buyer.payment = payment;
		this.events.emit('buyer:changed');
	}

	setAddress(address: string): void {
		this.buyer.address = address;
		this.events.emit('buyer:changed');
	}

	setEmail(email: string): void {
		this.buyer.email = email;
		this.events.emit('buyer:changed');
	}

	setPhone(phone: string): void {
		this.buyer.phone = phone;
		this.events.emit('buyer:changed');
	}

	getData(): Partial<IBuyer> {
		return { ...this.buyer };
	}

	clear(): void {
		this.buyer = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
		this.events.emit('buyer:changed');
	}
}
