import type { IEvents } from '../base/events';
import type { IProduct, IBasketModel } from '../../types';

export class BasketModel implements IBasketModel {
	private items: IProduct[] = [];

	constructor(private readonly events: IEvents) {}

	add(product: IProduct): void {
		if (!this.contains(product.id)) {
			this.items.push(product);
			this.events.emit('basket:changed');
		}
	}

	remove(id: string): void {
		this.items = this.items.filter((product) => product.id !== id);
		this.events.emit('basket:changed');
	}

	clear(): void {
		this.items = [];
		this.events.emit('basket:changed');
	}

	contains(id: string): boolean {
		return this.items.some((product) => product.id === id);
	}

	getItems(): IProduct[] {
		return this.items;
	}

	getTotal(): number {
		return this.items.reduce((sum, product) => sum + (product.price ?? 0), 0);
	}

	getCount(): number {
		return this.items.length;
	}
}
