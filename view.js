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

  dot("logLevel", "view", { info: "debug" })

  dot.any("view", view)
}

function view(prop, arg, dot) {
  if (prop[0]) {
    dot("logLevel", prop[0], { info: "debug" })
  }

  dot.any(
    prop[0],
    !arg || arg.addProp !== false
      ? addChildProp.bind(renderOrUpdate)
      : renderOrUpdate
  )
}

function addChildProp(p, a, d, e, s) {
  var prop = e.replace(/View$/, "")
  if (p[p.length - 1] !== prop) {
    p = p.concat([prop])
  }
  return this.call(null, p, a, d, e, s)
}

function renderOrUpdate(prop, arg, dot, e, sig) {
  arg = arg || {}

  var el,
    id = [e].concat(prop).join("."),
    suffix = "Render",
    v = getOrCreateView(prop, arg, dot, id),
    views = dot.state.views

  var exists = views.has(id)

  var existsOrHasContent =
    exists || (v.element && v.element.innerHTML)

  if (existsOrHasContent && dot[e + "Update"]) {
    suffix = "Update"
  }

  var a = Object.assign({}, arg, v, {
    ssr: !exists && !!v.element && !!v.element.innerHTML,
  })

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
