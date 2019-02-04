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

  dot.any("view", view)
}

function view(prop, arg, dot) {
  var state = dot.state

  if (state.log) {
    state.log.levels[prop[0]] = state.log.levels[
      prop[0]
    ] || {
      info: "debug",
    }
  }

  dot.any(prop[0], renderOrUpdate)

  dot.any(
    prop[0] + "Render",
    arg.idProp ? arg.render : addChildProp.bind(arg.render)
  )

  dot.any(
    prop[0] + "Update",
    arg.idProp ? arg.update : addChildProp.bind(arg.update)
  )
}

function addChildProp(p, a, d, e, s) {
  var prop = e.replace(/[A-Z][a-z]*[A-Z][a-z]*$/, "")
  if (p[p.length - 1] !== prop) {
    p = p.concat([prop])
  }
  return this.call(null, p, a, d, e, s)
}

function renderOrUpdate(prop, arg, dot, e, sig) {
  arg = arg || {}

  var el,
    id = [e].concat(prop).join("."),
    v = getOrCreateView(prop, arg, dot, id),
    views = dot.state.views

  var exists = views.has(id)

  var existsOrHasContent =
    exists || (v.element && v.element.innerHTML)

  var a = Object.assign({}, arg, v, {
      ssr: !exists && !!v.element && !!v.element.innerHTML,
    }),
    suffix = existsOrHasContent ? "Update" : "Render"

  el = dot(e + suffix, prop, a)

  if (el.then) {
    el = undefined
  }

  if (v.element && el) {
    if (v.element.parentNode) {
      v.element.parentNode.replaceChild(el, v.element)
    } else {
      v.element.appendChild(el)
    }
  }

  if (el) {
    v.element = el
  }

  sig.value = v.element

  views.set(id, v)
}

function getOrCreateView(prop, arg, dot, id) {
  return (
    dot.state.views.get(id) || {
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
