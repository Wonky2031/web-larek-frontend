import { Model } from '../base/model';
import type { IEvents } from '../base/events';
import type { IProduct, IBasketModel } from '../../types';

export class BasketModel
	extends Model<{ items: IProduct[] }>
	implements IBasketModel
{
	protected readonly eventName = 'basket:changed';

	constructor(events: IEvents) {
		super(events);
		this.data.items = [];
	}

	add(product: IProduct): void {
		if (!this.contains(product.id)) {
			const items = [...this.getItems(), product];
			this.updateData({ items });
		}
	}

	remove(id: string): void {
		const items = this.getItems().filter((product) => product.id !== id);
		this.updateData({ items });
	}

	clear(): void {
		this.updateData({ items: [] });
	}

	contains(id: string): boolean {
		return this.getItems().some((product) => product.id === id);
	}

	getItems(): IProduct[] {
		return this.data.items ?? [];
	}

	getTotal(): number {
		return this.getItems().reduce((sum, product) => {
			return sum + (product.price ?? 0);
		}, 0);
	}

	getCount(): number {
		return this.getItems().length;
	}
}
