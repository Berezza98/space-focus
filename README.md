# English

# Focus React library, based on elements position and size

## What problem does this module solve?

This module addresses the issue of focus navigation on SmartTVs. Focus navigation occurs when buttons are pressed (button configuration is passed during initialization).

## Library concept

The library employs three entities for creating focus-enabled applications:

- Layers
- FocusableElements
- FocusableContainers

**Layers** - focus layers.

**FocusableElements** - focusable elements (the primary building block).

**FocusableContainers** - focusable containers.

An application can use multiple layers, for example, one layer for the main UI of the application and another for a popup. When creating multiple layers, elements from one layer do not intersect with elements from another layer.

Each layer can contain **FocusableElements** and **FocusableContainers**.

### Difference between **FocusableElements** and **FocusableContainers**

**FocusableElement** - a single focusable element that can only contain the necessary content.

**FocusableContainer** - a virtual container that allows containing more than one **FocusableElement**. This is implemented to retain the last focused **FocusableElement** within the **FocusableContainer**. When focusing on a **FocusableContainer**, it's possible to immediately focus on the last one that was previously focused within this **FocusableContainer**.

## Initialization

```js
import initFocus from 'space-focus';
const focusResult = initFocus(options);
```

The initialization function accepts a configuration object - options.

options - an object that currently accepts properties - keys and wheelDebounceMs.

Default button configuration values:

```js
export const KEYS = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  ENTER: 13,
};
```

**wheelDebounceMs**

The property is responsible for the debounce timeout in the mousewheel event handler. Default value is 300.

## Other exports from the library

```js
import { FocusElement, useFocus, DEFAULT_LAYER_ID } from 'space-focus';
```

- DIRECTION
- DEFAULT_LAYER_ID
- FocusElement
- useFocus

## DIRECTION

A constant object that stores direction names. Inside are 4 properties: UP, DOWN, LEFT, RIGHT. Often used for overwriteControl.

## DEFAULT_LAYER_ID

This is the name of the default layer, most often used when it is necessary to move focus from another layer to the default one.

Example:

```js
setActiveLayer(DEFAULT_LAYER_ID);
```

## FocusElement

This is the component with which focusable elements and focusable containers can be created.

```html
<FocusElement
  focus
  className="block"
  focusedClassName="focused-block"
  action="{enterOrClickHandler}"
  overflowRightHandler="{overflowRightHandler}"
  layer="{layerID}"
>
  Hello I'm focusable component
</FocusElement>
```

This component accepts the following parameters:

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
- onDirectionKeyDown
- overflowRightHandler
- closest
- focusable
- focusableContainer
- saveLastFocused
- id
- overwriteControl

**onDirectionKeyDown** (Function)
An event that occurs when any navigation button (up, down, left, right) is pressed. It takes two arguments: el - the focus element itself, direction - the direction of the button pressed (one of the properties of the **DIRECTION** constant). It is necessary to return true from the function if it is necessary to continue handling the keydown event and move to the next focusable element (if possible), otherwise the event handling will be terminated.

**closest** (Boolean) - default value **true**

The property determines whether to move to the nearest neighbor that is not on the same plane. If set false value it will mean that elements on the same plane are prioritized.

**focusable** (Boolean) - default value **true**

The property indicates whether this component will be handled by the library and whether it can be focused.

**focusableContainer** (String)

This property is responsible for adding **FocusableElement** to **FocusableContainer**. If such a focus container does not exist, it will be created.

**saveLastFocused** (Boolean) - default value **true**

The property that determines whether this **FocusableElement** will be able to be saved as the last focused element in the **FocusableContainer** and **Layer**.

**id** (Number || String) - default undefined

The property that identifies the focus element, with this property it is possible to focus elements with a specific identifier, through **overwriteControl**.

**overwriteControl** (Object) - default undefined

A property in the form of an object, which allows overriding the default focus behavior. For example, you can change the element that will receive focus when pressing any direction button. Example:

```js
import { DIRECTION, FocusElement } from 'space-focus';

const overwriteControl = {
  [DIRECTION.UP]: 'UP_EL_ID',
  [DIRECTION.DOWN]: 'DOWN_EL_ID',
  [DIRECTION.LEFT]: 'LEFT_EL_ID',
  [DIRECTION.RIGHT]: 'RIGHT_EL_ID',
};

<FocusElement
  focus
  className="block"
  focusedClassName="focused-block"
  action={enterOrClickHandler}
  overflowRightHandler={overflowRightHandler}
  layer={layerID}
  id="CLOSE_BTN"
  overwriteControl={overwriteControl}
>
  Close
</FocusElement>;
```

In this example, there is a focus element, **overwriteControl** specifies that if this focus element is active and we press the right button, the transition will be made to the element with the **id** RIGHT_EL_ID, if we press the left button - the transition will be made to the element with the **id** LEFT_EL_ID, and so on...

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
  onDirectionKeyDown,
  focusable,
  focusableContainer,
  saveLastFocused,
  overwriteControl,
  id,
});
```

This is a React hook, which allows creating custom focusable elements and containers.

### The hook accepts the following arguments:

- ref
- a configuration object with properties:
  - action
  - isFocused
  - layer
  - overflowRightHandler
  - closest
  - onFocus
  - onBlur
  - onDirectionKeyDown
  - focusable
  - focusableContainer
  - saveLastFocused
  - overwriteControl
  - id

### The hook returns the following values:

- focused
- setActiveLayer
- remeasureAll
- setFocusById
- isIdFocused

**focused** - a property indicating whether the component is focused.

**setActiveLayer** - a function to change the active layer. This function takes two arguments - layerID and options. Options (optional parameter) is an object that contains the **useLastFocused** property (Boolean). If **useLastFocused** is true, then when switching to the layer, the last element that was previously focused will be immediately focused.

**remeasureAll** - a function to re-measure the sizes and positions of focus elements. It takes one optional parameter - an array of layerIDs for which re-measurement is necessary. By default, re-measurement is performed for all layers. Used in VERY rare cases when the layout changes during rendering of focus elements.

**setFocusById** - a function to focus on any element by Id from any layer. It takes two parameters - **id** (required) and **layerId** (optional, default value **DEFAULT_LAYER_ID**).

**isIdFocused** - a function to determine whether an element with a specific identifier is focused. It takes one parameter - **id** (required).

---

# Українська

# Focus React library, based on elements position and size

## Яку проблему вирішує даний модуль

Даний модуль вирішує проблему переміщення фокуса на SmartTV. Переміщення фокусу відбувається при натисканні кнопок(конфігурація кнопок передається при ініціалізації).

## Концепція бібліотеки

Бібліотека використовує три сутності для створення додатків з фокусами:

- Layers
- FocusableElements
- FocusableContainers

**Layers** - фокусні шари.

**FocusableElements** - фокусні елементи(основний будівельний блок)

**FocusableContainers** - фокусні конейнери

Додаток може використовувати декілька шарів, наприклад, один шар для основного UI додатку, а другий - для popup. При створенні декількох шарів, елементи з одного шару не перетинаються з елементами іншого шару.

Кожен шар у собі може містити **FocusableElements** та **FocusableContainers**

### Різниця між **FocusableElements** та **FocusableContainers**

**FocusableElement** - це один фокусний елемент, який може містити у собі тільки потрібний контент.

**FocusableContainer** - це віртуальний контейнер, який дозволяє містити у собі більше одного **FocusableElement**. Це реалізовано для того, щоб була можливість зберігати останній зафокушений **FocusableElement** з **FocusableContainer**. При фокусі **FocusableContainer**, є можливість одразу поставити фокус на останній, який попередньо був зафокушений у даному **FocusableContainer**.

## Ініціалізація

```js
import initFocus from 'space-focus';
const focusResult = initFocus(storeOptions, handlerOptions);
```

Функція ініціалізації приймає 2 об'єкти конфігцрації - storeOptions та handlerOptions.

storeOptions - об'єкт, який на даний момент приймає властивості:

- getElementSizeFn(опціональна)

handlerOptions - об'єкт, який на даний момент приймає властивості:

- keys(опціональна)
- wheelDebounceMs(опціональна)

Дефолтні значення конфігурації кнопок:

```js
export const KEYS = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  ENTER: 13,
};
```

**wheelDebounceMs**

Властивість відповідає за timeout debounce в обробнику події mousewheel. Дефолтне значення 300.

## Що ще еспортує бібліотека

```js
import { FocusElement, useFocus, DEFAULT_LAYER_ID } from 'space-focus';
```

- DIRECTION
- DEFAULT_LAYER_ID
- FocusElement
- useFocus
- useSetActiveLayer
- useAddLayerHandler
- Layer

## DIRECTION

Константа-об'єкт, у якому зберігаються назви напрямків. Всередині 4 властивості: UP, DOWN, LEFT, RIGHT. Часто використовується для overwriteControl.

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
  action="{enterOrClickHandler}"
  overflowRightHandler="{overflowRightHandler}"
  layer="{layerID}"
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
- onDirectionKeyDown
- overflowRightHandler
- closest
- focusable
- focusableContainer
- saveLastFocused
- id
- overwriteControl

**onDirectionKeyDown** (Function)
Подія, яка відбувається при натисканні будь-якої кнопки навігації(вверх, вниз, вліво, вправо). Приймає два аргументи:
el - сам фокусний елемент, direction - напрямок кнопки, яка була натиснута(одна з властивостей константи **DIRECTION**).
Необхідно повернути з функції true, якщо потрібно продовжити обробку події keydown і перейти до наступного фокусного елементу
(по можливості), інакше виконання обробки події буде закінчено.

**closest** (Boolean) - default value **true**

Властивість відповідає за те, чи потрібно переміщатись до найближчого сусіда, який знаходиться не на одній площині.
Якщо поставити false, значить, що в приорітеті будуть елементи, які знаходяться на одній площині.

**focusable** (Boolean) - default value **true**

Властивість відповідає, чи буде цей компонент оброблятись бібліотекою і чи зможе він бути зафокушеним.

**focusableContainer** (String)

Дана властивість відповідає за додавання **FocusableElement** в **FocusableContainer**. Якщо такого фокусного контейнеру не існує - він буде створений.

**saveLastFocused** (Boolean) - default value **true**

Властивість, котра відповідає за те, чи буде даний **FocusableElement** можливість зберігатись, як останній зафокушений елемент у **FocusableContainer** та **Layer**.

**id** (Number || String) - default undefined

Властивість, котра відповідає за ідентифікацію фокусного елементу, за допомогою цієї властивості є можливість фокусити елементи з певним ідентифікатором, через **overwriteControl**

**overwriteControl** (Object) - default undefined

Влстивість у вигляді об'єкта, за допомогою якої можна перезаписувати дефолтну поведінку фокуса. Для прикладу можна змінити елемент, на який поставиться фокус при натисненні кнопки будь-якого напрямку. Приклад:

```js
import { DIRECTION, FocusElement } from 'space-focus';

const overwriteControl = {
  [DIRECTION.UP]: 'UP_EL_ID',
  [DIRECTION.DOWN]: 'DOWN_EL_ID',
  [DIRECTION.LEFT]: 'LEFT_EL_ID',
  [DIRECTION.RIGHT]: 'RIGHT_EL_ID',
};

<FocusElement
  focus
  className="block"
  focusedClassName="focused-block"
  action={enterOrClickHandler}
  overflowRightHandler={overflowRightHandler}
  layer={layerID}
  id="CLOSE_BTN"
  overwriteControl={overwriteControl}
>
  Close
</FocusElement>;
```

У даному прикладі є фокусний елемент, **overwriteControl** вказує, що якщо даний фокусний елемент є активним і ми натискаємо на кнопку вправо - тоді перехід буде відбуватись до елементу з **id** RIGHT_EL_ID, якщо натиснемо на кнопку вліво - перехід буде відбуватись до елементу з **id** LEFT_EL_ID і тд...

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
  onDirectionKeyDown,
  focusable,
  focusableContainer,
  saveLastFocused,
  overwriteControl,
  id,
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
  - onDirectionKeyDown
  - focusable
  - focusableContainer
  - saveLastFocused
  - overwriteControl
  - id

### Хук повертає такі значення:

- focused
- setActiveLayer
- remeasureAll
- setFocusById
- isIdFocused

**focused** - властивість, яка вказує на те, чи є зафокушеним даний компонент.

**setActiveLayer** - функція, за допомогою якої можна змінювати активний шар(layer). Дана функція приймає два аргументи - layerID та options. Options(optional parameter) - об'єкт, який містить у собі властивість **useLastFocused** (Boolean). Якщо **useLastFocused** - true, тоді при перемиканні на шар, буде одразу зафокушений останній елемент, який був попередньо з фокусом.

**remeasureAll** - функція, за допомогою якої можна перерахувати розміри і місце знаходження фокусних елементів. Приймає один опціональний параметр - масив layerID, для яких необхідно здійснити перерахування. По дефолту перерахування відбувається для всіх шарів. Використовується у ДУЖЕ рідких випадках, коли змінюється лейаут в процесі рендреру фокусних елементів.

**setFocusById** - функція, за допомогою якої можна зафокусити будь-який елемент по Id з будь-якого шару. Приймає два параметри - **id** (required) та **layerId** (optional, default value **DEFAULT_LAYER_ID**)

**isIdFocused** - функція, за допомогою якої можна визначити, чи елемент з певним ідентифікатором є зафокушеним. Приймає один параметр - **id** (required)

## useSetActiveLayer

```js
const setActiveLayer = useSetActiveLayer();
```

Це реакт хук, за допомогою якого можна змінити активний шар(layer).

Дана функція приймає два аргументи - layerID та options. Options(optional parameter) - об'єкт, який містить у собі властивість **useLastFocused** (Boolean). Якщо **useLastFocused** - true, тоді при перемиканні на шар, буде одразу зафокушений останній елемент, який був попередньо з фокусом.

## useAddLayerHandler

```js
const addLayerHandler = useAddLayerHandler();

addLayerHandler(layerId, handler);
```

Це реакт хук, за допомогою якого можна додати overflow обробник для шару(layer).

Дана функція приймає два аргументи - layerID та handler. **handler: (direction: Direction) => any**.

## Layer

```js
<Layer name="someLayerId" layerHandler={layerHandler}>
  <FocusElement />
</Layer>
```

Це реакт компонент, а саме контекстний провайдер, за допомогою якого є можливість декларативно створювати шар(layer).

Приймає два параметра:

- name(обовʼязковий параметр) - ідентифікатор шару
- layerHandler(опціональний параметр) - **(direction: Direction) => any** обробник overflow для шару

Усі дочерні фокусні елементи будуть знаходитись в даному шарі.
Якщо у дочернього фокусного елемента явно вказаний ідентифікатор шару, до якого він має відноситись, то вказаний ідентифікатор буде мати приорітет.
