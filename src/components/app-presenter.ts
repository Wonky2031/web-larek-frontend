import { toProductView, formatPrice } from '../utils/utils';
import { ModalView } from './view/modal-view';
import { HeaderView } from './view/header-view';
import { CatalogView } from './view/catalog-view';
import { CardPreviewView } from './view/card-preview-view';
import { BasketView } from './view/basket-view';
import { OrderFormView } from './view/order-form-view';
import { ContactsFormView } from './view/contacts-form-view';
import { SuccessView } from './view/success-view';
import type { IEvents } from './base/events';
import type { WeblarekApi } from './weblarek-api';
import type { ProductsModel } from './model/products-model';
import type { BasketModel } from './model/basket-model';
import type { BuyerModel } from './model/buyer-model';
import type {
	IProduct,
	IProductsLoadedPayload,
	IOrderResponse,
	IProductView,
	TPayment,
} from '../types';

export class AppPresenter {
	constructor(
		private readonly api: WeblarekApi,
		private readonly events: IEvents,
		private readonly productsModel: ProductsModel,
		private readonly basketModel: BasketModel,
		private readonly buyerModel: BuyerModel,

		private readonly headerView: HeaderView,
		private readonly catalogView: CatalogView,
		private readonly modalView: ModalView,
		private readonly cardPreviewView: CardPreviewView,
		private readonly basketView: BasketView,
		private readonly orderFormView: OrderFormView,
		private readonly contactsFormView: ContactsFormView,
		private readonly successView: SuccessView
	) {}

	init(): void {
		this.setupEventListeners();
		this.setupViewHandlers();
		this.loadProducts();
	}

	private setupEventListeners(): void {
		this.events.on<IProductsLoadedPayload>(
			'products:loaded',
			({ products }) => {
				const productViews = products.map(toProductView);
				this.catalogView.render({ products: productViews });
			}
		);

		this.events.on<{ error: string }>('products:error', ({ error }) => {
			console.error('Ошибка загрузки товаров:', error);
		});

		this.events.on('basket:changed', () => {
			this.headerView.render({ count: this.basketModel.getCount() });
		});

		this.events.on('buyer:changed', () => {
			this.updateOrderFormState();
			this.updateContactsFormState();
		});

		this.events.on<{ order: IOrderResponse }>('order:success', ({ order }) => {
			const total = formatPrice(order.total);
			this.modalView.open(this.successView.render({ total }));
			this.basketModel.clear();
			this.buyerModel.clear();
		});

		this.events.on<{ error: string }>('order:error', ({ error }) => {
			this.contactsFormView.setErrors(error);
		});
	}

	private setupViewHandlers(): void {
		this.headerView.setBasketHandler(() => {
			this.openBasket();
		});

		this.catalogView.setSelectHandler((productView) => {
			this.openProductPreview(productView);
		});

		this.modalView.setCloseHandler(() => {
			this.modalView.close();
		});

		this.cardPreviewView.setToggleHandler(() => {
			this.toggleProduct();
		});

		this.basketView.setOrderHandler(() => {
			this.openOrderForm();
		});

		this.basketView.setRemoveHandler((id) => {
			this.basketModel.remove(id);
			const items = this.basketModel.getItems().map(toProductView);
			const total = formatPrice(this.basketModel.getTotal());
			this.basketView.render({ items, total });
		});

		this.orderFormView.setPaymentChangeHandler((payment) => {
			this.buyerModel.setPayment(payment);
		});
		this.orderFormView.setAddressChangeHandler((address) => {
			this.buyerModel.setAddress(address);
		});
		this.orderFormView.setSubmitHandler(() => {
			this.openContactsForm();
		});

		this.contactsFormView.setEmailChangeHandler((email) => {
			this.buyerModel.setEmail(email);
		});
		this.contactsFormView.setPhoneChangeHandler((phone) => {
			this.buyerModel.setPhone(phone);
		});
		this.contactsFormView.setSubmitHandler(() => {
			this.submitOrder();
		});

		this.successView.setCloseHandler(() => {
			this.modalView.close();
		});
	}

	private loadProducts(): void {
		this.api
			.getProductList()
			.then((data) => {
				this.productsModel.setProducts(data.items);
			})
			.catch((error: unknown) => {
				const message = error instanceof Error ? error.message : String(error);
				this.events.emit('products:error', { error: message });
			});
	}

	private openProductPreview(productView: IProductView): void {
		const product = this.productsModel.getProductById(productView.id);
		if (!product) return;

		this.currentProduct = product;
		const inBasket = this.basketModel.contains(product.id);
		const content = this.cardPreviewView.render({
			product: productView,
			inBasket,
		});
		this.modalView.open(content);
	}

	private toggleProduct(): void {
		const product = this.currentProduct;
		if (!product) return;

		if (this.basketModel.contains(product.id)) {
			this.basketModel.remove(product.id);
		} else {
			this.basketModel.add(product);
		}

		const inBasket = this.basketModel.contains(product.id);
		const productView = toProductView(product);
		this.cardPreviewView.render({ product: productView, inBasket });
	}

	private openBasket(): void {
		const items = this.basketModel.getItems().map(toProductView);
		const total = formatPrice(this.basketModel.getTotal());
		const content = this.basketView.render({ items, total });
		this.modalView.open(content);
	}

	private openOrderForm(): void {
		this.orderFormView.render();
		const buyer = this.buyerModel.getData();
		this.orderFormView.setPayment(buyer.payment ?? '');
		this.orderFormView.setAddress(buyer.address ?? '');
		this.modalView.open(this.orderFormView.element);
	}

	private openContactsForm(): void {
		this.contactsFormView.render();
		const buyer = this.buyerModel.getData();
		this.contactsFormView.setEmail(buyer.email ?? '');
		this.contactsFormView.setPhone(buyer.phone ?? '');
		this.modalView.open(this.contactsFormView.element);
	}

	private submitOrder(): void {
		const buyer = this.buyerModel.getData();

		this.api
			.postOrder({
				payment: buyer.payment as TPayment,
				address: buyer.address ?? '',
				email: buyer.email ?? '',
				phone: buyer.phone ?? '',
				total: this.basketModel.getTotal(),
				items: this.basketModel.getItems().map((p) => p.id),
			})
			.then((order) => {
				this.events.emit('order:success', { order });
			})
			.catch((error: unknown) => {
				const message = error instanceof Error ? error.message : String(error);
				this.events.emit('order:error', { error: message });
			});
	}

	private updateOrderFormState(): void {
		const buyer = this.buyerModel.getData();
		this.orderFormView.setPayment(buyer.payment ?? '');
		const isValid = Boolean(buyer.payment) && Boolean(buyer.address);
		this.orderFormView.setDisabledState(!isValid);
	}

	private updateContactsFormState(): void {
		const buyer = this.buyerModel.getData();
		const isValid = Boolean(buyer.email) && Boolean(buyer.phone);
		this.contactsFormView.setDisabledState(!isValid);
	}

	private currentProduct: IProduct | null = null;
}
