# Проектная работа "Веб-ларек"

Интернет-магазин товаров для веб-разработчиков. Проектная работа по проектированию веб-приложения.

## Используемый стек

| Стек | Технология |
|------|-----------|
| Язык | TypeScript |
| Разметка | HTML |
| Стили | SCSS (Sass), PostCSS |
| Сборка | Webpack + Babel |
| Пакетный менеджер | yarn / npm |
| Линтинг | ESLint + Prettier |
| Архитектура | MVP (Model–View–Presenter) |

### Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

**Важные файлы:**
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## 1. Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

---

## 2. Архитектура проекта

Проект построен по паттерну **MVP (Model–View–Presenter)**. Слои общаются друг с другом только через события — с помощью брокера `EventEmitter`. Это обеспечивает слабую связанность компонентов: Model ничего не знает о View, View ничего не знает о Model, а Presenter играет роль связующего звена.

### Слои приложения

| Слой | Ответственность |
|------|----------------|
| **Model** | Хранение данных и бизнес-логика |
| **View** | Отображение данных и обработка действий пользователя |
| **Presenter** | Связывание Model и View, обработка сценариев |
| **API** | Взаимодействие с сервером |
| **Инфраструктура** | Брокер событий, утилиты |

## 3. Базовых классы
### 1. `EventEmitter`
**Предназначение:** брокер событий. Обеспечивает общение между Model, View и Presenter через события.

**Функции:**
- `on(event, callback)` — подписаться на событие;
- `off(event, callback)` — отписаться от события;
- `emit(event, data?)` — инициировать событие;
- `onAll(callback)` — слушать все события (`'*'`);
- `offAll()` — сбросить все обработчики;
- `trigger(event, context?)` — вернуть колбэк, который при вызове инициирует событие с заданным контекстом.

### 2. `Api`
**Предназначение:** базовый HTTP-клиент. Обеспечивает работу с запросами.

**Функции:**
- `get(uri)` — GET-запрос, возвращает `Promise<object>`;
- `post(uri, data, method = 'POST')` — POST/PUT/DELETE-запрос с JSON-телом;
- `handleResponse(response)` — проверка `response.ok`, парсинг JSON, отклонение промиса с текстом ошибки из поля `error`.

### 3. Утилиты (`src/utils/utils.ts`)

**Предназначение:** вспомогательные функции для работы с DOM и данными элементов.

**Функции:**
| Функция | Назначение |
|---------|-----------|
| `pascalToKebab(value)` | Преобразует текст  `PascalCase` в `kebab-case` |
| `isSelector(x)` | Проверяет, что значение — строка-селектор |
| `isEmpty(value)` | Проверяет `null` / `undefined` |
| `ensureAllElements<T>(selector, context)` | Возвращает массив элементов по селектору |
| `ensureElement<T>(selector, context)` | Возвращает один элемент или бросает ошибку, если ничего не найдено |
| `cloneTemplate<T>(query)` | Клонирует содержимое `<template>` по селектору или элементу |
| `bem(block, element?, modifier?)` | Генерирует имя и класс BEM-блока |
| `getObjectProperties(obj, filter?)` | Возвращает имена методов прототипа |
| `setElementData(el, data)` | Записывает data-атрибуты |
| `getElementData<T>(el, scheme)` | Читает data-атрибуты с типизацией |
| `isPlainObject(obj)` | Проверка на «простой» объект |
| `isBoolean(v)` | Проверка на boolean |
| `createElement<T>(tag, props?, children?)` | Создает DOM-элементы |
| `setText(element, value)` | Устанавливает текст элемента |
| `setImage(element, src, alt?)` | Устанавливает src и alt изображения |
| `toggleClass(element, className, force?)` | Переключает CSS-класс |
| `setDisabled(element, state)` | Устанавливает/снимает атрибут disabled |
| `formatPrice(price)` | Форматирует цену («750 синапсов» / «Бесценно») |
| `getCategoryClass(category)` | Возвращает CSS-модификатор категории |
| `toProductView(product)` | Трансформирует `IProduct` в `IProductView` |
| `validateOrderStep1(data)` | Валидация шага 1 (оплата + адрес) |
| `validateOrderStep2(data)` | Валидация шага 2 (email + телефон) |

---

## 4. Описание компонентов
### 1. Типы данных

Раздел описывает типы и интерфейсы, с которыми работает приложение.

#### Данные API

```ts
/** Категория товара */
type TCategory =
  | 'софт-скил'
  | 'хард-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'другое';

/** Данные товара */
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: TCategory;
  price: number | null;
}

/** Ответ GET /product/ */
interface IProductListResponse {
  total: number;
  items: IProduct[];
}

/** Способ оплаты */
type TPayment = 'card' | 'cash';

/** Тело запроса POST /order */
interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

/** Ответ POST /order */
interface IOrderResponse {
  id: string;
  total: number;
}

/** Ошибка API */
interface IApiError {
  error: string;
}
```

#### Данные отображения

```ts
/** Товар, подготовленный к отображению */
interface IProductView {
  id: string;
  title: string;
  description: string;
  imageUrl: string
  priceText: string;
  category: TCategory;
  categoryClass: string;
}
```

#### Данные форм

```ts
interface IBuyer {
  payment: TPayment | '';
  address: string;
  email: string;
  phone: string;
}
```

#### События

#### События

```ts
type TAppEvent =
  | 'products:loaded'
  | 'product:selected'
  | 'basket:changed'
  | 'buyer:changed'
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
```

Для событий, передающих данные, используются интерфейсы payload'ов (например, `{ id: string }`, `{ payment: TPayment }`).

---
### 2. API-клиент
**Функции:**
- `getProductList(): Promise<ApiListResponse<IProduct>>` — GET-запрос по адресу `/product/`;
- `postOrder(order: IOrderRequest): Promise<IOrderResponse>` — POST-запрос по адресу `/order`.

### 3. Модели
#### 2.1. `ProductsModel`
**Назначение:** хранит каталог товаров и выбранный товар.

**Функции:**
- `setProducts(products: IProduct[])` — сохранить список товаров (эмитит `products:loaded`);
- `getProducts(): IProduct[]` — получить список;
- `getProductById(id: string): IProduct | undefined` — найти товар по id;
- `setSelectedProduct(product: IProduct | null)` — сохранить выбранный товар (эмитит `product:selected`);
- `getSelectedProduct(): IProduct | null` — получить выбранный товар.

#### 2.2. `BasketModel`

**Назначение:** хранит товары в корзине и управляет ими.

**Функции:**
- `add(product: IProduct)` — добавить товар;
- `remove(id: string)` — удалить товар по id;
- `clear()` — очистить корзину;
- `contains(id: string): boolean` — проверяет, есть ли товар в корзине;
- `getItems(): IProduct[]` — список товаров в корзине;
- `getTotal(): number` — суммарная стоимость;
- `getCount(): number` — количество товаров.

При любом изменении эмитит `basket:changed` (без данных).

#### 2.3. `BuyerModel`

**Назначение:** хранит данные покупателя.

**Функции:**
- `setPayment(payment: 'card' | 'cash')` — способ оплаты;
- `setAddress(address: string)` — адрес доставки;
- `setEmail(email: string)` — email;
- `setPhone(phone: string)` — телефон;
- `getData(): Partial<IBuyer>` — все сохранённые данные;
- `clear()` — сбросить данные после успешного заказа.

При любом изменении эмитит `buyer:changed` (без данных).

### 3. Отображения

#### 3.1. `HeaderView`

**Назначение:** шапка страницы с логотипом и счётчиком корзины.

**Функции:**
- `render(data: { count: number })` — обновить счётчик.


#### 3.2. `CatalogView`

**Назначение:** контейнер каталога. Рендерит готовый список DOM-элементов карточек.

**Функции:**
- `render(data: { items: HTMLElement[] })` — вывести список карточек.

#### 3.3. `CardView`

**Назначение:** универсальная карточка товара. Работает с шаблонами `#card-catalog`, `#card-basket`, `#card-preview`. Заполняет только те элементы, которые есть в DOM.

**Функции:**
- `render(data: IProductView, options?: { index?: number; inBasket?: boolean })` — заполнить поля: title, image, price, category, description; переключить текст кнопки; вывести индекс.


#### 3.4. `ModalView`

**Назначение:** общий контейнер модального окна. Один на всё приложение.

**Функции:**
- `open(content: HTMLElement)` — вставить контент и показать модалку;
- `close()` — скрыть модалку и очистить контент.


#### 3.5. `FormView`

**Назначение:** общий родитель для всех форм. Реализует общий функционал: поиск формы, кнопки submit, контейнера ошибок, подписка на submit, показ ошибок, блокировка кнопки.

**Функции:**
- `setErrors(message: string)` — показать/скрыть сообщение об ошибке;
- `setDisabledState(disabled: boolean)` — установить состояние кнопки submit.

#### 3.6. `OrderFormView`

**Назначение:** первая форма оформления — способ оплаты и адрес.

**Функции:**
- `render(data: { payment: TPayment | ''; address: string })` — отобразить данные из модели;
- `setPayment(payment)` — выделить выбранный способ;
- `setAddress(value)` — заполнить поле.


#### 3.7. `ContactsFormView`

**Назначение:** вторая форма — email и телефон.

**Функции:**
- `render(data: { email: string; phone: string })` — отобразить данные из модели;
- `setEmail(value)`, `setPhone(value)` — заполнить поля.


#### 3.8. `BasketView`

**Назначение:** контент модалки корзины.

**Функции:**
- `render(data: { items: HTMLElement[]; total: string })` — вывести готовый список карточек, итог, показать/скрыть надпись «Корзина пуста», заблокировать кнопку.


#### 3.9. `SuccessView`

**Назначение:** модалка успешного оформления.

**Функции:**
- `render(data: { total: string })` — подставить сумму списания.


### 4. Презентер

#### `AppPresenter`

**Назначение:** единая точка связи Model и View. Инициализирует приложение, загружает данные, обрабатывает пользовательские сценарии.

**Функции:**
- `init()` — запуск: загрузка товаров, отрисовка галереи, первичный рендер корзины, подписка на события;
- обработка `products:loaded` → отрисовка каталога;
- обработка `product:selected` → рендер превью, открытие модалки;
- обработка `basket:changed` → обновление счётчика, рендер корзины и превью (если открыто);
- обработка `buyer:changed` → обновление состояния форм;
- обработка `basket:open` → открытие модалки корзины;
- обработка `card:select` → сохранение выбранного товара в модель;
- обработка `card:remove` → удаление из корзины;
- обработка `card:toggle` → add/remove в корзине;
- обработка `modal:close` → закрытие модалки, сброс выбранного товара;
- обработка `order:start` → открытие формы шага 1;
- обработка `order:payment-change` / `order:address-change` → сохранение в `BuyerModel`;
- обработка `order:next` → открытие формы шага 2;
- обработка `contacts:email-change` / `contacts:phone-change` → сохранение в `BuyerModel`;
- обработка `contacts:submit` → валидация, `POST /order`, открытие `SuccessView`, очистка корзины и `BuyerModel`;
- обработка `success:close` → закрытие модалки, сброс выбранного товара.

**Особенности:**
- Все зависимости — через интерфейсы (инверсия зависимостей).
- Presenter не эмитит события — только обрабатывает их.
- Состояния хранятся только в моделях.
___

