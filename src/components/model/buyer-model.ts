import { Model } from '../base/model';
import type { IEvents } from '../base/events';
import type { IBuyer, IBuyerModel, TPayment } from '../../types';

export class BuyerModel extends Model<IBuyer> implements IBuyerModel {
	protected readonly eventName = 'buyer:changed';

	constructor(events: IEvents) {
		super(events);
		this.data = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
	}

	setPayment(payment: TPayment): void {
		this.updateData({ payment });
	}

	setAddress(address: string): void {
		this.updateData({ address });
	}

	setEmail(email: string): void {
		this.updateData({ email });
	}

	setPhone(phone: string): void {
		this.updateData({ phone });
	}

	getData(): Partial<IBuyer> {
		return { ...this.data };
	}

	clear(): void {
		this.data = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
		this.events.emit(this.eventName, this.data);
	}
}
