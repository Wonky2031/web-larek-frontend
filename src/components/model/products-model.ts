import { Model } from '../base/model';
import type { IEvents } from '../base/events';
import type { IProduct, IProductsModel } from '../../types';

export class ProductsModel
	extends Model<{ products: IProduct[] }>
	implements IProductsModel
{
	protected readonly eventName = 'products:loaded';

	constructor(events: IEvents) {
		super(events);
		this.data.products = [];
	}

	setProducts(products: IProduct[]): void {
		this.updateData({ products });
	}

	getProducts(): IProduct[] {
		return this.data.products ?? [];
	}

	getProductById(id: string): IProduct | undefined {
		return this.getProducts().find((product) => product.id === id);
	}
}
