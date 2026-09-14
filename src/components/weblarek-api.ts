import { Api } from './base/api';
import type {
	IProductListResponse,
	IOrderRequest,
	IOrderResponse,
} from '../types';

export class WeblarekApi {
	private readonly api: Api;

	constructor(baseUrl: string, options?: RequestInit) {
		this.api = new Api(baseUrl, options);
	}

	getProductList(): Promise<IProductListResponse> {
		return this.api
			.get('/product/')
			.then((data) => data as IProductListResponse);
	}

	postOrder(order: IOrderRequest): Promise<IOrderResponse> {
		return this.api
			.post('/order', order)
			.then((data) => data as IOrderResponse);
	}
}
