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
	setBasketHandler(callback: () => void): void;
}

export interface ICatalogView extends IView {
	render(data: { products: IProductView[] }): HTMLElement;
	setSelectHandler(callback: (product: IProductView) => void): void;
}

export interface ICardView extends IView {
	render(data: IProductView): HTMLElement;
	setClickHandler(callback: () => void): void;
}

export interface IModalView extends IView {
	open(content: HTMLElement): void;
	close(): void;
	setCloseHandler(callback: () => void): void;
}

export interface ICardPreviewView extends IView {
	render(data: { product: IProductView; inBasket: boolean }): HTMLElement;
	setToggleHandler(callback: () => void): void;
}

export interface IBasketView extends IView {
	render(data: { items: IProductView[]; total: string }): HTMLElement;
	setOrderHandler(callback: () => void): void;
	setRemoveHandler(callback: (id: string) => void): void;
}

export interface IBasketItemView extends IView {
	render(data: { product: IProductView; index: number }): HTMLElement;
	setDeleteHandler(callback: () => void): void;
}

export interface IOrderFormView extends IView {
	render(): HTMLElement;
	setPayment(payment: TPayment | ''): void;
	setAddress(value: string): void;
	setErrors(message: string): void;
	setDisabledState(disabled: boolean): void;
	setPaymentChangeHandler(callback: (payment: TPayment) => void): void;
	setAddressChangeHandler(callback: (address: string) => void): void;
	setSubmitHandler(callback: () => void): void;
}

export interface IContactsFormView extends IView {
	render(): HTMLElement;
	setEmail(value: string): void;
	setPhone(value: string): void;
	setErrors(message: string): void;
	setDisabledState(disabled: boolean): void;
	setEmailChangeHandler(callback: (value: string) => void): void;
	setPhoneChangeHandler(callback: (value: string) => void): void;
	setSubmitHandler(callback: () => void): void;
}

export interface ISuccessView extends IView {
	render(data: { total: string }): HTMLElement;
	setCloseHandler(callback: () => void): void;
}

export type TAppEvent =
	| 'products:loaded'
	| 'products:error'
	| 'basket:changed'
	| 'buyer:changed'
	| 'order:success'
	| 'order:error'
	| 'gallery:render'
	| 'modal:open'
	| 'modal:close'
	| 'card:select'
	| 'product:toggle'
	| 'basket:open'
	| 'basket:remove'
	| 'order:start'
	| 'order:next'
	| 'contacts:submit'
	| 'success:close';

export interface IProductsLoadedPayload {
	products: IProduct[];
}

export interface IProductsErrorPayload {
	error: string;
}

export interface IBasketChangedPayload {
	items: IProduct[];
	total: number;
	count: number;
}

export interface IBuyerChangedPayload {
	data: Partial<IBuyer>;
}

export interface IOrderSuccessPayload {
	order: IOrderResponse;
}

export interface IOrderErrorPayload {
	error: string;
}

export interface IProductPayload {
	product: IProduct;
}

export interface IGalleryRenderPayload {
	products: IProduct[];
}

export interface IModalOpenPayload {
	content: HTMLElement;
}

export interface IBasketRemovePayload {
	id: string;
}

export interface IOrderNextPayload {
	payment: TPayment;
	address: string;
}

export interface IContactsSubmitPayload {
	email: string;
	phone: string;
}
