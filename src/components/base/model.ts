import type { IEvents } from './events';

export abstract class Model<T extends object> {
	protected data: Partial<T> = {};
	protected abstract readonly eventName: string;

	constructor(protected readonly events: IEvents) {}

	protected updateData(data: Partial<T>): void {
		this.data = { ...this.data, ...data };
		this.events.emit(this.eventName, this.data);
	}
}
