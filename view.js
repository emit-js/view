/*global document Map*/
/*prettier-ignore*/
"use strict"

module.exports = function(emit) {
  if (emit.view) {
    return
  }

  emit.state.views = new Map()

  emit("logLevel", "view", { info: "debug" })

  emit.any("view", view)
}

function view(arg, prop, emit) {
  var name = prop[0] || arg

  if (name) {
    emit("logLevel", name, { info: "debug" })
  }

  emit.any(
    name,
    arg.addProp !== false
      ? addChildProp.bind(renderOrUpdate)
      : renderOrUpdate
  )
}

function addChildProp(a, p, e, s) {
  var prop = s.event.replace(/View$/, "")
  if (p[p.length - 1] !== prop) {
    p = p.concat([prop])
  }
  return this.call(null, a, p, e, s)
}

function renderOrUpdate(arg, prop, emit, sig) {
  arg = arg || {}

  if (typeof arg === "string") {
    prop = [arg].concat(prop)
    arg = {}
  }

  var el,
    id = [sig.event].concat(prop).join("."),
    suffix = "Render",
    v = getOrCreateView(arg, prop, emit, id),
    views = emit.state.views

  var exists = views.has(id)

  var existsOrHasContent =
    exists || (v.element && v.element.innerHTML)

  if (existsOrHasContent && emit[sig.event + "Update"]) {
    suffix = "Update"
  }

  var a = Object.assign({}, arg, v, {
    ssr: !exists && !!v.element && !!v.element.innerHTML,
  })

  el = emit(sig.event + suffix, prop, a)

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

function getOrCreateView(arg, prop, emit, id) {
  return (
    emit.state.views.get(id) || {
      element: arg.element || findElement(arg, prop),
    }
  )
}

function findElement(arg, prop) {
  if (arg && arg.selector) {
    return document.querySelector(arg.selector)
  } else if (prop.length) {
    return document.getElementById(prop.join("."))
  }
}
