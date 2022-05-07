# Focus React library, based on elements position and size

## Яку проблему вирішує даний модуль

Даний модуль вирішує проблему переміщення фокуса на SmartTV. Переміщення фокусу відбувається при натисканні кнопок(конфігурація кнопок передається при ініціалізації).

## Концепція бібліотеки

Бібліотека використовує три сутності для створення додатків з фокусами:

- Layers
- FocusableElements
- FocusableContainers

__Layers__ - фокусні шари.

__FocusableElements__ - фокусні елементи(основний будівельний блок)

__FocusableContainers__ - фокусні конейнери

Додаток може використовувати декілька шарів, наприклад, один шар для основного UI додатку, а другий - для popup. При створенні декількох шарів, елементи з одного шару не перетинаються з елементами іншого шару.

Кожен шар у собі може містити __FocusableElements__ та __FocusableContainers__

### Різниця між __FocusableElements__ та __FocusableContainers__

__FocusableElement__ - це один фокусний елемент, який може містити у собі тільки потрібний контент.

__FocusableContainer__ - це віртуальний контейнер, який дозволяє містити у собі більше одного  __FocusableElement__. Це реалізовано для того, щоб була можливість зберігати останній зафокушений __FocusableElement__ з __FocusableContainer__. При фокусі __FocusableContainer__, є можливість одразу поставити фокус на останній, який попередньо був зафокушений у даному __FocusableContainer__.

## Ініціалізація

```js
  import initFocus from 'space-focus';
  const focusResult = initFocus(options)
```
Функція ініціалізації приймає об'єкт конфігцрації - options.

options - об'єкт, який на даний момент приймає тільки одну властивість - keys.

Дефолтні значення конфігурації кнопок:
```js
  export const KEYS = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ENTER: 13
  };
```

## Що ще еспортує бібліотека
```js
  import { FocusElement, useFocus, DEFAULT_LAYER_ID } from 'space-focus';
```

- DEFAULT_LAYER_ID
- FocusElement
- useFocus

## DEFAULT_LAYER_ID

це назва дефолтного шару, частіше за все використовується у випаку, коли потрібно перенести фокус з іншого шару на дефолтний.

Приклад: 
```js
  setActiveLayer(DEFAULT_LAYER_ID);
```

## FocusElement

це компопнент, за допомогою якого і можна ствоювати фокусабельні елементи та фокусні контейнери.

```html
<FocusElement
  focus
  className="block"
  focusedClassName="focused-block"
  action={enterOrClickHandler}
  overflowRightHandler={overflowRightHandler}
  layer={layerID}
>
 Hello I'm focusable component
</FocusElement>
```

Даний компонент приймає такі параметри:
- children
- dangerouslySetInnerHTML
- action
- focus
- style
- className
- focusedClassName
- layer
- onFocus
- onBlur
- overflowRightHandler
- closest
- focusable
- focusableContainer
- saveLastFocused

__closest__ (Boolean)

Властивість відповідає за те, чи потрібно переміщатись до найближчого сусіда, який знаходиться не на одній площині.
По дефолту - false, значить, що в приорітеті елементи, які знаходяться на одній площині.

__focusable__ (Boolean) - default value __true__

Властивість відповідає, чи буде цей компонент оброблятись бібліотекою і чи зможе він бути зафокушеним.

__focusableContainer__ (String)

Дана властивість відповідає за додавання __FocusableElement__ в __FocusableContainer__. Якщо такого фокусного контейнеру не існує - він буде створений.

__saveLastFocused__ (Boolean) - default value __true__

Властивість, котра відповідає за те, чи буде даний __FocusableElement__ можливість зберігатись, як останній зафокушений елемент у __FocusableContainer__ та __Layer__.

## useFocus

```js
  const { focused, setActiveLayer } = useFocus(ref, {
    action,
    isFocused,
    layer,
    overflowRightHandler,
    closest,
    onFocus,
    onBlur,
    focusable,
    focusableContainer,
    saveLastFocused
  });
```

це реакт хук, за допомогою якого, є можливість створювати кастомні фокусабельні елементи та контейнери.

### Хук приймає такі аргументи:

- ref
- об'єкт конфігурації з властивостями:
  - action
  - isFocused
  - layer
  - overflowRightHandler
  - closest
  - onFocus
  - onBlur
  - focusable
  - focusableContainer
  - saveLastFocused

### Хук повертає такі значення:

- focused
- setActiveLayer

__focused__ - властивість, яка вказує на те, чи є зафокушеним даний компонент.

__setActiveLayer__ - функція, за допомогою якої можна змінювати активний шар(layer). Дана функція приймає два аргументи - layerID та options. Options(optional parameter) - об'єкт, який містить у собі властивість __useLastFocused__ (Boolean). Якщо __useLastFocused__ - true, тоді при перемиканні на шар, буде одразу зафокушений останній елемент, який був попередньо з фокусом.