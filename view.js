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

function view(prop, arg, dot) {
  dot.beforeAny(prop[0], renderOrUpdate)
  dot.beforeAny(prop[0] + "Render", arg.render)
  dot.any(prop[0] + "Update", arg.update)
}

function renderOrUpdate(prop, arg, dot, e, sig) {
  arg = arg || {}

  var el,
    v = getOrCreateView(prop, arg, dot, e),
    views = dot.state.views

  var exists = views.has(e)

  var existsOrHasContent =
    exists || (v.element && v.element.innerHTML)

  var a = Object.assign({}, arg, v, {
      ssr: !exists && !!v.element && !!v.element.innerHTML,
    }),
    p = e.replace(/View$/, "")

  if (p === prop[prop.length - 1]) {
    p = undefined
  }

  if (existsOrHasContent) {
    el = dot(e + "Update", prop, p, a)

    if (el.then) {
      el = undefined
    }
  } else {
    el = dot(e + "Render", prop, p, a)

    if (v.element && el) {
      if (v.element.parentNode) {
        v.element.parentNode.replaceChild(el, v.element)
      } else {
        v.element.appendChild(el)
      }
    }

    if (!v.element && el) {
      var parent = findElement(prop.slice(0, -1))

      if (parent) {
        parent.appendChild(el)
      }
    }
  }

  if (el) {
    v.element = el
  }

  sig.value = v.element

  views.set(e, v)
}

function getOrCreateView(prop, arg, dot, e) {
  return (
    dot.state.views.get(e) || {
      element: arg.element || findElement(prop, arg),
    }
  )
}

function findElement(prop, arg) {
  if (arg && arg.selector) {
    return document.querySelector(arg.selector)
  } else if (prop.length) {
    return document.getElementById(prop.join("."))
  }
}
