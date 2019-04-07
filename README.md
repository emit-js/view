# @emit-js/view

[emit](https://github.com/emit-js/emit#readme) dom views

![view](view.gif)

## Install

```bash
npm install @emit-js/emit @emit-js/view
```

## Setup

```js
const emit = require("@emit-js/emit")()
require("@emit-js/view")(emit)
```

## Usage

First create your view composer:

```js
module.exports = function(emit) {
  emit.view("myView", { render, update })
}

function render() {
  return document.createElement("DIV")
}

function update(arg, prop) {
  arg.element.innerHTML = arg.value
}
```

Then use it:

```js
require("./myView")(emit)

emit.myView() // `render` element
emit.myView({ value: "hello" }) // `update` element
```

## Attach to dom

By default, the view call finds the element id from props:

```js
emit.myView("myId") // `render` element to #myId
emit.myView("myId") // `update` element if element returned
```

You may also specify a selector:

```js
emit.myView({ selector: "#myId" }) // `render` element to #myId
```

Or provide the element to replace directly:

```js
emit.myView({ element: document.getElementById("myId") })
```

## SSR

If an element already exists and has content, the `update` function is called instead of the inital `render`.

The [emit argument](https://github.com/emit-js/emit#emit-argument) to the `update` function includes an `ssr: true` option when in SSR mode.

## Props

Commonly we append the view name to [the `prop` array](https://github.com/emit-js/emit#props) and pass the concatenated props to sub-events.

Passing those props down produces descriptive element ids and [logs](https://github.com/emit-js/log) that describe the call stack.

Luckily, the `view` composer injects the view name into [the `prop` array](https://github.com/emit-js/emit#props) automatically, eliminating the view name append step.

## Related composers

| Library    | Description        | URL                                          |
| ---------- | ------------------ | -------------------------------------------- |
| controller | DOM controller     | https://github.com/emit-js/controller#readme |
| el         | DOM elements       | https://github.com/emit-js/el#readme         |
| render     | Server side render | https://github.com/emit-js/render#readme     |
