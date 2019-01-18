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

  if (state.log) {
    state.log.levels.view = state.log.levels.view || {
      info: "debug",
    }
  }

  dot.beforeAny("view", view)
}

function view(prop, arg, dot, e, sig) {
  arg = arg || {}

  var propStr = prop.join("."),
    views = dot.state.views

  var exists = views.has(propStr),
    v = getOrCreateView(propStr, arg, dot)

  var a = Object.assign({}, arg, v)

  if (exists && v.element.update) {
    v.element.update(prop, a, dot)
  }

  if (!exists) {
    a.ssr = !exists && !!v.element && !!v.element.innerHTML

    var el = v.render(prop, a, dot)

    if (v.element) {
      if (v.element.parentNode) {
        v.element.parentNode.replaceChild(el, v.element)
      } else {
        v.element.appendChild(el)
      }
    }

    v.element = el
    views.set(propStr, v)
  }

  sig.value = v.element
}

function getOrCreateView(propStr, arg, dot) {
  return (
    dot.state.views.get(propStr) || {
      element:
        arg.element || document.querySelector(arg.selector),
      render: arg.render,
    }
  )
}
