/*global document Map*/
/*prettier-ignore*/
"use strict"

module.exports = function(dot, opts) {
  var state = dot.state

  if (state.view) {
    return
  }

  state.view = opts || {}
  state.views = state.views || new Map()

  dot.beforeAny("view", view)
}

function view(prop, arg, dot, e, sig) {
  arg = arg || {}

  var propStr = prop.join("."),
    views = dot.state.views

  var exists = views.has(propStr),
    v = getOrCreateView(propStr, arg, dot)

  if (!v.element) {
    sig.value = null
    return
  }

  var a = Object.assign({}, arg, v)

  if (v.element.children.length > 0) {
    a.ssr = !exists
    v.update(prop, a, dot)
  } else {
    views.set(propStr, v)
    v.element.appendChild(v.render(prop, a, dot))
  }

  sig.value = v.element
}

function getOrCreateView(propStr, arg, dot) {
  return (
    dot.state.views.get(propStr) || {
      element:
        arg.element || document.querySelector(arg.selector),
      render: arg.render,
      update: arg.update,
    }
  )
}
