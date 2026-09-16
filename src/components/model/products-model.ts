import type { IEvents } from '../base/events';
import type { IProduct, IProductsModel } from '../../types';

export class ProductsModel implements IProductsModel {
	private products: IProduct[] = [];
	private selectedProduct: IProduct | null = null;

	constructor(private readonly events: IEvents) {}

	setProducts(products: IProduct[]): void {
		this.products = products;
		this.events.emit('products:loaded');
	}

	getProducts(): IProduct[] {
		return this.products;
	}

	getProductById(id: string): IProduct | undefined {
		return this.products.find((product) => product.id === id);
	}

	setSelectedProduct(product: IProduct | null): void {
		this.selectedProduct = product;
		this.events.emit('product:selected');
	}

	getSelectedProduct(): IProduct | null {
		return this.selectedProduct;
	}
}
