/** @jsx el */
/* eslint-env jest */

var dot = require("dot-event")()
var view = require("./")
var el = require("attodom").el
var JSDOM = require("jsdom").JSDOM

var body, document, window

function clear(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild)
  }
}

beforeEach(function() {
  var jsdom = new JSDOM()

  window = jsdom.window
  document = window.document
  body = document.body

  global.document = window.document

  clear(body)
  body.appendChild(el("div", { id: "main" }))

  dot.reset()
  view(dot)
})

test("empty document", function() {
  expect.assertions(3)

  clear(document)

  var update = function() {
    expect(true).toBe(true)
  }

  var render = function(prop, arg) {
    expect(arg.ssr).toBe(false)
    return el("html", { update: update }, el("body"))
  }

  dot.view({
    element: document,
    render: render,
  })

  dot.view()

  expect(body.children.length).toBe(1)
})

test("empty body", function() {
  expect.assertions(3)

  var update = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      render: render,
    })
  }

  var render = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      render: render,
      ssr: false,
    })
    return el("div", { update: update })
  }

  dot.view({
    element: body.children[0],
    render: render,
  })

  dot.view()

  expect(body.children.length).toBe(1)
})

test("empty body (selector)", function() {
  expect.assertions(3)

  var update = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      render: render,
    })
  }

  var render = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      render: render,
      selector: "#main",
      ssr: false,
    })
    return el("div", { update: update })
  }

  dot.view({
    render: render,
    selector: "#main",
  })

  dot.view()

  expect(body.children.length).toBe(1)
})

test("existing body (selector)", function() {
  expect.assertions(3)

  body.children[0].appendChild(el("div"))

  var update = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      render: render,
    })
  }

  var render = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      render: render,
      selector: "#main",
      ssr: true,
    })
    return el("div", { update: update })
  }

  dot.view({
    render: render,
    selector: "#main",
  })

  dot.view()

  expect(body.children.length).toBe(1)
})
