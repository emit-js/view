# @dot-event/view

dot-event dom views

![view](view.gif)

## Install

```bash
npm install dot-event @dot-event/view
```

## Setup

```js
const dot = require("dot-event")()
require("@dot-event/view")(dot)
```

## Usage

First create your view composer:

```js
export default function(dot) {
  if (dot.myView) {
    return
  }
  dot.view("myView", { render, update })
}

function render() {
  return document.createElement("DIV")
}

function update(prop, arg) {
  arg.element.innerHTML = arg.value
}
```

Then use it:

```js
require("./myView").default(dot)

dot.myView() // creates element from `render`
dot.myView({ value: "hello" }) // updates element from `update`
```

## Attach to dom

By default, the view call finds the element id from props:

```js
dot.myView("myId") // replace #myId with element from `render`
dot.myView("myId") // replace if element returned from `update`
```

You may also specify a selector:

```js
dot.myView({ selector: "#myView" })
```

## SSR

If an element already exists and has content, the `update` function is called instead of the inital `render`.

The [emit argument](https://github.com/dot-event/dot-event2#emit-argument) to the `update` function includes an `ssr: true` option when in SSR mode.

## Props

Commonly we append the view name to [the `prop` array](https://github.com/dot-event/dot-event2#props) and use the concatenated props as the view element id.

By passing those props down to sub-views, it produces descriptive element identifiers and [logs](https://github.com/dot-event/log2) that describe the call stack.

Luckily, the `view` composer injects the view name into [the `prop` array](https://github.com/dot-event/dot-event2#props) automatically, eliminating the view name append step.

## Related composers

| Library    | Description    | URL                                     |
| ---------- | -------------- | --------------------------------------- |
| controller | DOM controller | https://github.com/dot-event/controller |
| el         | DOM elements   | https://github.com/dot-event/el         |
| render     | SSR render     | https://github.com/dot-event/render     |
