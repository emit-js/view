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

## Attach view to the DOM

By default, the view will try to discover the element ID from props:

```js
dot.myView("myId") // replace #myId with element from `render`
dot.myView("myId") // replace if element returned from `update`
```

You may also specify a selector:

```js
dot.myView({ selector: "#myView" })
```

## SSR

When attaching to an element that already exists and has content, the view **only calls `update`**.

The [emit argument](https://github.com/dot-event/dot-event2#emit-argument) to `update` includes an `ssr: true` option in SSR mode.

## Props

The `view` composer injects the name of the view to [the `prop` array](https://github.com/dot-event/dot-event2#props).

A common pattern is to use joined props as your div id and then to pass props down to your sub views.

We leverage prop injection to get great element identifiers and [logging](https://github.com/dot-event/log2) without any effort.

## Related composers

| Library    | Description    | URL                                     |
| ---------- | -------------- | --------------------------------------- |
| controller | DOM controller | https://github.com/dot-event/controller |
| el         | DOM elements   | https://github.com/dot-event/el         |
| render     | SSR render     | https://github.com/dot-event/render     |
