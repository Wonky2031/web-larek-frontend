import {
	toProductView,
	formatPrice,
	validateOrderStep1,
	validateOrderStep2,
	cloneTemplate,
} from '../utils/utils';
import { CardView } from './view/card-view';
import type { IEvents } from './base/events';
import type {
	IWeblarekApi,
	IProductsModel,
	IBasketModel,
	IBuyerModel,
	IHeaderView,
	ICatalogView,
	IModalView,
	ICardView,
	IBasketView,
	IOrderFormView,
	IContactsFormView,
	ISuccessView,
	IProduct,
	TPayment,
} from '../types';

export class AppPresenter {
	constructor(
		private readonly api: IWeblarekApi,
		private readonly events: IEvents,
		private readonly productsModel: IProductsModel,
		private readonly basketModel: IBasketModel,
		private readonly buyerModel: IBuyerModel,
		private readonly headerView: IHeaderView,
		private readonly catalogView: ICatalogView,
		private readonly modalView: IModalView,
		private readonly previewCardView: ICardView,
		private readonly basketView: IBasketView,
		private readonly orderFormView: IOrderFormView,
		private readonly contactsFormView: IContactsFormView,
		private readonly successView: ISuccessView
	) {}

	init(): void {
		this.setupEventListeners();
		this.loadProducts();
		this.renderBasketContent();
	}

	private setupEventListeners(): void {
		this.events.on('products:loaded', () => {
			this.renderCatalog();
		});

		this.events.on('product:selected', () => {
			const product = this.productsModel.getSelectedProduct();
  		if (!product) return;
			this.renderPreview();
  		this.modalView.open(this.previewCardView.element);
		});

		this.events.on('basket:changed', () => {
			this.headerView.render({ count: this.basketModel.getCount() });
			this.renderBasketContent();
			this.updatePreviewState();
		});

		this.events.on('buyer:changed', () => {
			this.updateOrderFormState();
			this.updateContactsFormState();
		});

		this.events.on('basket:open', () => {
			this.openBasket();
		});

		this.events.on<{ id: string }>('card:select', ({ id }) => {
			const product = this.productsModel.getProductById(id);
			if (product) {
				this.productsModel.setSelectedProduct(product);
			}
		});

		this.events.on<{ id: string }>('card:remove', ({ id }) => {
			this.basketModel.remove(id);
		});

		this.events.on<{ id: string }>('card:toggle', ({ id }) => {
			const product = this.productsModel.getProductById(id);
			if (product) {
				this.toggleProduct(product);
			}
		});

		this.events.on('modal:close', () => {
			this.modalView.close();
			this.productsModel.setSelectedProduct(null);
		});

		this.events.on('order:start', () => {
			this.openOrderForm();
		});

		this.events.on<{ payment: TPayment }>(
			'order:payment-change',
			({ payment }) => {
				this.buyerModel.setPayment(payment);
			}
		);

		this.events.on<{ address: string }>(
			'order:address-change',
			({ address }) => {
				this.buyerModel.setAddress(address);
			}
		);

		this.events.on('order:next', () => {
			this.openContactsForm();
		});

		this.events.on<{ email: string }>('contacts:email-change', ({ email }) => {
			this.buyerModel.setEmail(email);
		});

		this.events.on<{ phone: string }>('contacts:phone-change', ({ phone }) => {
			this.buyerModel.setPhone(phone);
		});

		this.events.on('contacts:submit', () => {
			this.submitOrder();
		});

		this.events.on('success:close', () => {
			this.modalView.close();
			this.productsModel.setSelectedProduct(null);
		});
	}

	private renderCatalog(): void {
		const products = this.productsModel.getProducts();

		const itemElements = products.map((product) => {
			const cardElement = cloneTemplate<HTMLElement>('#card-catalog');
			const cardView = new CardView(cardElement, this.events);

			cardView.render(toProductView(product));
			return cardElement;
		});

		this.catalogView.render({ items: itemElements });
	}

	private renderPreview(): void {
		const product = this.productsModel.getSelectedProduct();
		if (!product) return;

		const productView = toProductView(product);
		const inBasket = this.basketModel.contains(product.id);
		this.previewCardView.render(productView, { inBasket });
	}

	private toggleProduct(product: IProduct): void {
		if (this.basketModel.contains(product.id)) {
			this.basketModel.remove(product.id);
		} else {
			this.basketModel.add(product);
		}
	}

	private openOrderForm(): void {
		const buyer = this.buyerModel.getData();
		this.orderFormView.render({
			payment: buyer.payment ?? '',
			address: buyer.address ?? '',
		});
		this.updateOrderFormState();
		this.modalView.open(this.orderFormView.element);
	}

	private openContactsForm(): void {
		const buyer = this.buyerModel.getData();
		this.contactsFormView.render({
			email: buyer.email ?? '',
			phone: buyer.phone ?? '',
		});
		this.updateContactsFormState();
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
				const total = formatPrice(order.total);
				this.modalView.open(this.successView.render({ total }));
				this.basketModel.clear();
				this.buyerModel.clear();
			})
			.catch((error: unknown) => {
				const message = error instanceof Error ? error.message : String(error);
				this.contactsFormView.setErrors(message);
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
				console.error('Ошибка загрузки товаров:', message);
			});
	}

	private updateOrderFormState(): void {
		const buyer = this.buyerModel.getData();
		this.orderFormView.setPayment(buyer.payment ?? '');

		const error = validateOrderStep1({
			payment: buyer.payment ?? '',
			address: buyer.address ?? '',
		});

		this.orderFormView.setErrors(error);
		this.orderFormView.setDisabledState(error !== '');
	}

	private updateContactsFormState(): void {
		const buyer = this.buyerModel.getData();
		const error = validateOrderStep2({
			email: buyer.email ?? '',
			phone: buyer.phone ?? '',
		});

		this.contactsFormView.setErrors(error);
		this.contactsFormView.setDisabledState(error !== '');
	}

	private updatePreviewState(): void {
		const isOpen = this.modalView.element.contains(this.previewCardView.element);
  	if (!isOpen) return;
  	this.renderPreview();
	}

	private openBasket(): void {
		this.modalView.open(this.basketView.element);
	}

	private renderBasketContent(): void {
		const products = this.basketModel.getItems();

		const itemElements = products.map((product, index) => {
			const cardElement = cloneTemplate<HTMLElement>('#card-basket');
			const cardView = new CardView(cardElement, this.events);

			cardView.render(toProductView(product), { index: index + 1 });
			return cardElement;
		});

		const total = formatPrice(this.basketModel.getTotal());
		this.basketView.render({ items: itemElements, total });
	}
}
