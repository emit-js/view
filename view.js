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

  dot.beforeAny(
    prop[0] + "Render",
    arg.idProp ? arg.render : addChildProp.bind(arg.render)
  )

  dot.beforeAny(
    prop[0] + "Update",
    arg.idProp ? arg.update : addChildProp.bind(arg.update)
  )
}

function addChildProp(p, a, d, e, s) {
  var prop = e.replace(/View(Render|Update)$/, "")
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
  })

  if (existsOrHasContent) {
    el = dot(e + "Update", prop, a)

    if (el.then) {
      el = undefined
    }
  } else {
    el = dot(e + "Render", prop, a)

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
