import './scss/styles.scss';

import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { WeblarekApi } from './components/weblarek-api';
import { ProductsModel } from './components/model/products-model';
import { BasketModel } from './components/model/basket-model';
import { BuyerModel } from './components/model/buyer-model';
import { HeaderView } from './components/view/header-view';
import { CatalogView } from './components/view/catalog-view';
import { ModalView } from './components/view/modal-view';
import { CardPreviewView } from './components/view/card-preview-view';
import { BasketView } from './components/view/basket-view';
import { OrderFormView } from './components/view/order-form-view';
import { ContactsFormView } from './components/view/contacts-form-view';
import { SuccessView } from './components/view/success-view';
import { AppPresenter } from './components/app-presenter';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new WeblarekApi(API_URL);

const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const headerView = new HeaderView(ensureElement<HTMLElement>('.header'));
const catalogView = new CatalogView(ensureElement<HTMLElement>('.gallery'));
const modalView = new ModalView(ensureElement<HTMLElement>('#modal-container'));
const cardPreviewView = new CardPreviewView(
	cloneTemplate<HTMLElement>('#card-preview')
);
const basketView = new BasketView(cloneTemplate<HTMLElement>('#basket'));
const orderFormView = new OrderFormView(cloneTemplate<HTMLElement>('#order'));
const contactsFormView = new ContactsFormView(
	cloneTemplate<HTMLElement>('#contacts')
);
const successView = new SuccessView(cloneTemplate<HTMLElement>('#success'));

const appPresenter = new AppPresenter(
	api,
	events,
	productsModel,
	basketModel,
	buyerModel,
	headerView,
	catalogView,
	modalView,
	cardPreviewView,
	basketView,
	orderFormView,
	contactsFormView,
	successView
);

appPresenter.init();
