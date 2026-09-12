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

```ts
type TAppEvent =
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
```

Для каждого события с данными объявлен **отдельный payload-интерфейс** (например, `IProductPayload`, `IBasketRemovePayload`).

---
### 2. API-клиент
**Функции:**
- `getProductList(): Promise<ApiListResponse<IProduct>>` — GET-запрос по адресу `/product/`;
- `postOrder(order: IOrderRequest): Promise<IOrderResponse>` — POST-запрос по адресу `/order`.

### 3. Модели
#### 2.1. `ProductsModel`
**Назначение:** хранит каталог товаров.

**Функции:**
- `setProducts(products: IProduct[])` — сохранить список товаров;
- `getProducts(): IProduct[]` — получить список;
- `getProductById(id: string): IProduct | undefined` — найти товар по id.

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

#### 2.3. `BuyerModel`

**Назначение:** хранит данные покупателя.

**Функции:**
- `setPayment(payment: 'card' | 'cash')` — способ оплаты;
- `setAddress(address: string)` — адрес доставки;
- `setEmail(email: string)` — email;
- `setPhone(phone: string)` — телефон;
- `getData(): Partial<IBuyer>` — все сохранённые данные;
- `clear()` — сбросить данные после успешного заказа;
- `validate(): Partial<Record<keyof IBuyer, string>>` — вернуть ошибки валидации.

### 3. Отображения

#### 3.1. `HeaderView`

**Назначение:** шапка страницы с логотипом и счётчиком корзины.

**Функции:**
- `render(count: number)` — обновить счётчик;
- `setBasketHandler(callback)` — подписка на клик по корзине.

#### 3.2. `GalleryView`

**Назначение:** контейнер каталога. Рендерит список из `CardView`.

**Функции:**
- `render(products: IProduct[])` — очистить и отрисовать карточки;
- `setSelectHandler(callback)` — подписка на выбор карточки.

#### 3.3. `CardView`

**Назначение:** карточка товара в каталоге.

**Функции:**
- `render(product: IProduct)` — заполнить поля: title, image, price, category;
- `setClickHandler(callback)` — клик по карточке.

#### 3.4. `ModalView`

**Назначение:** общий контейнер модального окна. Один на всё приложение.

**Функции:**
- `open(content: HTMLElement)` — вставить контент и показать модалку;
- `close()` — скрыть модалку и очистить контент;
- `setCloseHandler(callback)` — подписка на крестик и клик вне модального контейнера.

#### 3.5. `CardPreviewView`

**Назначение:** детальная карточка товара в модалке.

**Функции:**
- `render(product: IProduct, inBasket: boolean)` — заполнить данные и переключить текст кнопки («В корзину» / «Убрать»);
- `setToggleHandler(callback)` — клик по кнопке.

#### 3.6. `BasketView`

**Назначение:** контент модалки корзины.

**Функции:**
- `render(items: IProduct[], total: number)` — отрисовать список `BasketItemView` и итог;
- `setOrderHandler(callback)` — клик по кнопке «Оформить».

#### 3.7. `BasketItemView`

**Назначение:** строка товара в корзине.

**Функции:**
- `render(product: IProduct, index: number)` — заполнить поля;
- `setDeleteHandler(callback)` — клик по иконке удаления.

#### 3.8. `OrderFormView`

**Назначение:** первая форма оформления — способ оплаты и адрес.

**Функции:**
- `render()` — сбросить состояние;
- `setPayment(payment)` — выделить выбранный способ;
- `setAddress(value)` — заполнить поле;
- `setErrors(errors)` — показать/скрыть сообщения об ошибках;
- `setSubmitHandler(callback)` — submit формы.

#### 3.9. `ContactsFormView`

**Назначение:** вторая форма — email и телефон.

**Функции:**
- `render()` — сбросить состояние;
- `setEmail(value)`, `setPhone(value)` — заполнить поля;
- `setErrors(errors)` — показать ошибки;
- `setSubmitHandler(callback)` — submit формы.

#### 3.10. `SuccessView`

**Назначение:** модалка успешного оформления.

**Функции:**
- `render(total: number)` — подставить сумму списания;
- `setCloseHandler(callback)` — клик по кнопке «За новыми покупками!».

### 4. Презентер

#### `AppPresenter`

**Назначение:** единая точка связи Model и View. Инициализирует приложение, загружает данные, обрабатывает пользовательские сценарии.

**Функции:**
- `init()` — запуск: загрузка товаров, отрисовка галереи, подписка на события;
- обработка `card:select` → открыть модалку с `CardPreviewView`;
- обработка `product:toggle` → add/remove в `BasketModel`, обновить кнопку;
- обработка `basket:open` → открыть модалку с `BasketView`;
- обработка `basket:remove` → удалить из модели, обновить модалку и счётчик;
- обработка `order:start` → открыть модалку с `OrderFormView`;
- обработка `order:next` → сохранить в `BuyerModel`, открыть `ContactsFormView`;
- обработка `contacts:submit` → валидация, `POST /order`, открыть `SuccessView`, очистить корзину и `BuyerModel`;
- обработка `success:close` → закрыть модалку;
- обработка `modal:close` → закрыть модалку.

___

