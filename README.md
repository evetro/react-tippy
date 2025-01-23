# React Tippy

[![React Version](https://img.shields.io/badge/react-16.x-blue)](https://reactjs.org/)

A lightweight tooltip for React. [Demo page here...](https://tvkhoa.github.io/testlib)

Based on `tippy.js` and powered by `Popper.js`

![Example](https://raw.githubusercontent.com/tvkhoa/react-tippy/master/doc/doc.gif)


## Why you should use it?

It is designed to work friendly with React, it provides `<Tooltip>` element or a higher-order component.

It uses `React DOM` to render tooltip content. Therefore, you can safely use this library in your React project.

It is an enhancement of Tippy.js for using in React.


## Getting Started

```
npm i react-tippy
```


## How to use

First, you need import css

```javascript
import 'react-tippy/dist/tippy.css'
```

Then, there are 2 ways for you to use the Tooltip Component

### Tooltip Component

```javascript
import {
  Tooltip,
} from 'react-tippy';


<Tooltip
  title="Welcome to React"
  position="bottom"
  trigger="click"
>
  <p>
    Click here to show popup
  </p>
</Tooltip>

```

### Higher Order Component

`withTooltip(Component, options)`


```javascript
import {
  withTooltip,
} from 'react-tippy';


const Header = () => (
  <h2>Header here</h2>
);

const HeaderWithTooltip = withTooltip(Header, {
  title: 'Welcome to React with tooltip',
});

```


## Props

|Setting|Default|Options|Role|
|--- |--- |--- |--- |
|animateFill|`true`|`true` `false`|Adds a material design-esque filling animation. This is disabled if the `arrow` prop is set to `true`.|
|animation|`shift`|`shift` `perspective` `fade` `scale` `none`|Specifies the type of transition animation a tooltip has.|
|arrow|`false`|`true` `false`|Adds an arrow pointing to the tooltipped element. Setting this to true disables *animateFill*.|
|arrowSize|`regular`|`small` `regular` `big`|Specifies how big the tooltip's arrow is.|
|appendTo|`document.body`|function or DOM element|HTML Element to which the tooltip is attached. You can either pass a DOM element or a callback function which returns a DOM element|
|children|`undefined`|React.ReactNode|The inner React HTML of the Tippy element|
|className|`''`|string|className of the tooltip trigger element|
|delay|`0`|Any integer >= 0 (milliseconds)|Specifies how long it takes after a trigger event is fired for a tooltip to show.|
|disabled|`false`|`true` `false`|Show or not show tooltip|
|distance|`10`|Any number (pixels)|Specifies how far away the tooltip will be from its element. Overrides the `padding` property in the `flipModifierOptions` prop.|
|duration|`375`|Any integer >= 0 (milliseconds)|Specifies how long the transition animation takes to complete when showing a tooltip.|
|flipModifierOptions|`undefined`|`undefined` [FlipModifierOptions](https://popper.js.org/docs/v2/modifiers/flip/#options)|Option interface for the flipping behaviour of the tooltip|
|followCursor|`false`|`true` `false`|Specifies whether to follow the user's mouse cursor (mouse devices only).|
|hideDelay|`0`|Any integer >= 0 (milliseconds)|Specifies how long it takes after a leave event is fired for a tooltip to hide. Not applicable when clicking on the document to hide tooltips.|
|hideOnClick|`true`|`true` `false` `'persistent'`|Specifies whether to hide a tooltip upon clicking its element after hovering over.|
|hideOnScroll|`false`|`true` `false`|Specifies whether to hide a tooltip on scroll event.|
|html|`null`|react element|Tooltip content. Overrides the **title** prop if defined|
|inertia|`false`|`true` `false`|Modifies the transition-timing-function with a cubic bezier to create a "slingshot" intertial effect.|
|interactive|`false`|`true` `false`|Makes a tooltip interactive, i.e. will not close when the user hovers over or clicks on the tooltip. This lets you create a popover (similar to Bootstrap) when used in conjunction with a click trigger.|
|interactiveBorder|`2`|Any number (pixels)|Specifies the size of the invisible border around an interactive tooltip that will prevent it from closing. Only applies to `mouseenter` triggered tooltips.|
|multiple|`false`|`true` `false`|Specifies whether to allow multiple tooltips open on the page (click trigger only).|
|offset|`[0, 0]`|Array of two integers (pixels)|Respectively, the x-axis and the y-axis offsets for the Popper instance in relation to its reference element. See Popper v2 docs on the [offset modifier](https://popper.js.org/docs/v2/modifiers/offset/) for further information. |
|onHidden|`() => {}`|function|Callback when the tooltip has fully transitioned out and is hidden|
|onHide|`() => {}`|function|Callback when the tooltip has begun to transition out|
|onRequestClose|`() => {}`|Function|Use it only if you want to `show/hide it manually`. This event is fired when you click outside of your tooltip, should be used with the prop `interaction` to keep your tooltip showing|
|onShow|`() => {}`|function|Callback when the tooltip has been triggered and has started to transition in|
|onShown|`() => {}`|function|Callback when the tooltip has fully transitioned in and is showing|
|open|`undefined`|`undefined` | `true` `false`|Use it only if you want to `show/hide it manually`. Usually, you don't need it|
|position|`top`|`top` `bottom` `left` `right`|Specifies which direction to position the tooltip on the element. Add the suffix `-start` or `-end` to shift the position. `top-end` is one such example.|
|size|`regular`|`small` `regular` `big`|Specifies how big the tooltip is.|
|sticky|`false`|`true` `false`|Specifies whether the tooltip should stick to its element reference when it's showing (for example, if the element is animated/moves).|
|stickyDuration|`200`|Any number (milliseconds)|Specifies the 'smoothing' transition when the popper's position updates as its element moves.|
|style|`{}`|React inline style object|styling of the trigger element|
|tabIndex|`undefined`|number|set tabIndex so element can receive focus|
|tag|`div`|A HTML element tag name e.g. `span`|Specifies the HTML element used to wrap the content that triggers the tooltip. When using a tooltip inline, `span` is more likely to be valid markup. When using a higher-order component with a block-level element, a `div` or `a` is more likely to be valid markup.|
|theme|`dark`|`dark` `light` `transparent` `any_custom_theme`|The CSS styling theme for the tooltip component|
|title|`null`|String|The shown text for the tooltip component|
|touchHold|`false`|`true` `false`|Changes the trigger behavior on touch devices. Changes the control from tap to show and tap off to hide, to tap and hold to show, then a release to hide.|
|trigger|`mouseenter focus`|any combination of `mouseenter`, `focus`, `focusin`, and `click` separated by a space, or only `manual`|Specifies which type of events will trigger a tooltip to show. Separate each by a space. mouseenter is for hovering and touch on mobile, and focus is for keyboard navigation. Use manual if you want to show/hide the tooltip manually/programmatically (see below).|
|unmountHTMLWhenHide|`false`|`true` `false`|By default, html component will be mounted at first show and unmount only when your tooltip component is unmounted. When you set unmountHTMLWhenHide is `true`, it will be unmounted whenever tooltip is hidden.|
|zIndex|`9999`|any integer >= 0|Controls the z index of the Popper element.|

## Custom tooltip content

You may pass markup to the `html` prop:

```javascript
import {
  Tooltip,
} from 'react-tippy';


<Tooltip
  html={(
    <div>
      <strong>
        Hello
      </strong>
    </div>
  )}
>
  // ...
</Tooltip>

```

## Interactive html tooltip

You may use `interactive` and `html` to make your tooltip interactive:

```javascript
  <Tooltip
    trigger="click"
    interactive
    html={(
      <div>
        <p>{tooltipContent}</p>
        <input
          type="text"
          value={tooltipContent}
          onChange={(e) => {setTooltipContent(e.target.value)}}
        />
      </div>
    )}
  >
    ...
  </Tooltip>
```

## Show/hide your tooltip manually

```javascript

const [open, setIsOpen] = React.useState(false)

<Tooltip
  title={tooltipContent}
  open={open}
  onRequestClose={() => {console.log('call'); setIsOpen(false)}}
>
  <span className="App-intro" onClick={() => { setIsOpen(true) }}>
    This will show {tooltipContent}
  </span>
</Tooltip>
```

## Show/hide your tooltip manually 2

```javascript

const [open, setOpen] = useState(false)

// ...

<Tooltip
  open={open}
  title="Peekaboo!"
>
  <button
    onClick={() => {
      setOpen(state => !state)
      setTimeout(() => alert('can do things after delay'), 2000)
    }}
  >
  Clicking me will initiate manual open/close tooltip logic
  </button>
</Tooltip>
```

## Browser support

TODO: Investigate browser support compability further.

**NB: This package does not support Internet Explorer or Opera Mini, nor does it support any browser version which has no implementation for the array methods `Array.prototype.find` and `Array.prototype.findIndex`.** In short, if your web browser version is fairly recent (before 01/01/2017 to give one concrete example), you should have no prototype issues.

Tippy gracefully degrades on older browsers (and with JavaScript disabled) by using the browser's default title tooltip.

If you want to support older browsers, please add `polyfill` by yourself.

### Supported browsers

Browsers which support requestAnimationFrame. See [caniuse](https://caniuse.com/#search=requestAnimationFrame). If your audience has low Opera Mini usage (common in western countries), then support should be >96%.

### Touch devices

Tippy works on touch devices almost the same as on desktop/mouse devices. However on iOS devices, in order for tooltips to close when tapping anywhere on the body and to trigger hover events on non-clickable elements, a .tippy-touch { cursor: pointer !important; } class is added to the body.

## Accessibility

Tooltips have ARIA labelling to ensure accessibility.

# FAQ

## Is it possible to change the tooltip style (width, height, et cetera)?

The props `className` and `style` are used for customizing the trigger element of the tooltip.
If you want to customize the markup of the tooltip itself, you may use the props
`html` instead of `title`. In the following example, the width of tooltip is set to 400 pixels.

```javascript
html={(
  <div style={{ width: 400 }}>
    // content here
  </div>
)}
```

## Can I add a theme or otherwise customize the styles of every tooltip component in my app?

If you want to customize all tooltips, or even use your own theme, you can create your css theme as here
https://atomiks.github.io/tippyjs/themes/#creating-a-theme

create a custom theme like this
```css
.my-custom-theme { /* must be end with -theme */
  border: 5px solid red;
}
```

then pass it as theme (they can have multiple themes)
```js
<Tooltip
  theme="my-custom light" // <- react-tippy will auto add postfix -theme so remove it here
```

# License

MIT. See also the licence for Popper.js.
