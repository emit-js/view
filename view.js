/*global document Map*/
/*prettier-ignore*/
"use strict"

module.exports = function(dot, opts) {
  var state = dot.state

  if (state.view) {
    return
  }

  state.view = opts || {}
  state.view.views = state.view.views || new Map()

  dot.any("view", view)
}

function view(prop, arg, dot, e, sig) {
  arg = arg || {}

  var propStr = prop.join("."),
    state = dot.state.view

  var selector = arg.selector,
    v = state.views.get(propStr)

  var ssr = !v

  v = v || {
    element: document.querySelector(selector),
    render: arg.render,
    update: arg.update,
  }

  if (!v.element) {
    sig.value = null
    return
  }

  arg = Object.assign({}, arg, v)

  if (v.element.children.length > 0) {
    arg.ssr = ssr
    v.update(prop, arg, dot)
  } else {
    state.views.set(propStr, v)
    document.body.appendChild(v.render(prop, arg, dot))
  }

  sig.value = v.container
}
