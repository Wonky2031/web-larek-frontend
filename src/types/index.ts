export type TCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'другое';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: TCategory;
	price: number | null;
}

export interface IProductListResponse {
	total: number;
	items: IProduct[];
}

export type TPayment = 'card' | 'cash';

export interface IOrderRequest {
	payment: TPayment;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IOrderResponse {
	id: string;
	total: number;
}

export interface IApiError {
	error: string;
}

export type TCategoryClass =
	| 'soft'
	| 'hard'
	| 'additional'
	| 'button'
	| 'other';

export interface IProductView {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	priceText: string;
	category: TCategory;
	categoryClass: string;
}

export interface IBuyer {
	payment: TPayment | '';
	address: string;
	email: string;
	phone: string;
}

export interface IWeblarekApi {
	getProductList(): Promise<IProductListResponse>;
	postOrder(order: IOrderRequest): Promise<IOrderResponse>;
}

export interface IProductsModel {
	setProducts(products: IProduct[]): void;
	getProducts(): IProduct[];
	getProductById(id: string): IProduct | undefined;
	setSelectedProduct(product: IProduct | null): void;
	getSelectedProduct(): IProduct | null;
}

export interface IBasketModel {
	add(product: IProduct): void;
	remove(id: string): void;
	clear(): void;
	contains(id: string): boolean;
	getItems(): IProduct[];
	getTotal(): number;
	getCount(): number;
}

export interface IBuyerModel {
	setPayment(payment: TPayment): void;
	setAddress(address: string): void;
	setEmail(email: string): void;
	setPhone(phone: string): void;
	getData(): Partial<IBuyer>;
	clear(): void;
}

export interface IView {
	readonly element: HTMLElement;
}

export interface IHeaderView extends IView {
	render(data: { count: number }): HTMLElement;
}

export interface ICatalogView extends IView {
	render(data: { items: HTMLElement[] }): HTMLElement;
}

export interface ICardView extends IView {
	render(
		data: IProductView,
		options?: { index?: number; inBasket?: boolean }
	): HTMLElement;
}

export interface IModalView extends IView {
	open(content: HTMLElement): void;
	close(): void;
}

export interface IBasketView extends IView {
	render(data: { items: HTMLElement[]; total: string }): HTMLElement;
}

export interface IFormView extends IView {
	setErrors(message: string): void;
	setDisabledState(disabled: boolean): void;
}

export interface IOrderFormView extends IFormView {
	render(data: { payment: TPayment | ''; address: string }): HTMLElement;
	setPayment(payment: TPayment | ''): void;
	setAddress(value: string): void;
}

export interface IContactsFormView extends IFormView {
	render(data: { email: string; phone: string }): HTMLElement;
	setEmail(value: string): void;
	setPhone(value: string): void;
}

export interface ISuccessView extends IView {
	render(data: { total: string }): HTMLElement;
}

export type TAppEvent =
	| 'products:loaded'
	| 'basket:changed'
	| 'buyer:changed'
	| 'product:selected'
	| 'basket:open'
	| 'card:select'
	| 'card:remove'
	| 'card:toggle'
	| 'modal:close'
	| 'order:start'
	| 'order:payment-change'
	| 'order:address-change'
	| 'order:next'
	| 'contacts:email-change'
	| 'contacts:phone-change'
	| 'contacts:submit'
	| 'success:close';
