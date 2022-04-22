# Focus React library based on elements position and size

## Яку проблему вирішує даний модуль

Даний модуль вирішує проблему переміщення фокуса на SmartTV. Переміщення фокусу відбувається при натисканні кнопок(конфігурація кнопок передається при ініціалізації).

## Ініціалізація

```js
  const initFocus = require('space-focus').default();
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

## Значення, котрі повертає функція ініціалізації
Функція ініціалізації повертає декілька значень:

- store
- FocusElement
- useFocus

__Store__ - це стор, з яким скоріш за все не прийдеться працювати на пряму.

__FocusElement__ - це компопнент, за допомогою якого і можна ствоювати фокусабельні елементи.

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
- action
- focus
- className
- focusedClassName
- layer
- overflowRightHandler
- closest

__closest__ (Boolean)

Властивість відповідає за те, чи потрібно переміщатись до найближчого сусіда, який знаходиться не на одній площині.
По дефолту - false, значить, що в приорітеті елементи, які знаходяться на одній площині.

__useFocus__

```js
  const { focused, setActiveLayer } = useFocus(ref, {
    action,
    isFocused,
    layer,
    overflowRightHandler
  });
```

__useFocus__ - це реакт хук, за допомогою якого, є можливість створювати кастомні фокусабельні елементи.

### Хук приймає такі аргументи:

- ref
- об'єкт конфігурації з властивостями:
  - action
  - isFocused
  - layer
  - overflowRightHandler

### Хук повертає такі значення:

- focused
- setActiveLayer

__Focused__ - властивість, яка вказує на те, чи є зафокушеним даний компонент.

__setActiveLayer__ - функція, за допомогою якої можна змінювати активний шар(layer). Дана функція приймає один аргумент - layerID.