/** @jsx el */
/* eslint-env jest */

var dot = require("dot-event")()
var view = require("./")
var el = require("attodom").el
var JSDOM = require("jsdom").JSDOM

var body, document, main, window

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
  main = el("div", { id: "main" })

  clear(body)
  body.appendChild(main)

  dot.reset()
  view(dot)
})

test("no element", function() {
  expect.assertions(4)

  var update = function() {
    expect(true).toBe(true)
  }

  var render = function(prop, arg) {
    expect(arg.ssr).toBe(false)
    return el("div")
  }

  var out = dot.view({ render: render, update: update })
  dot.view()

  expect(out.tagName).toBe("DIV")
  expect(main.children.length).toBe(0)
})

test("empty document", function() {
  expect.assertions(3)

  clear(document)

  var update = function() {
    expect(true).toBe(true)
  }

  var render = function(prop, arg) {
    expect(arg.ssr).toBe(false)
    return el("html", el("body"))
  }

  dot.view({
    element: document,
    render: render,
    update: update,
  })

  dot.view()

  expect(document.children.length).toBe(1)
})

test("empty body", function() {
  expect.assertions(3)

  var update = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      render: render,
      ssr: false,
      update: update,
    })
  }

  var render = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      render: render,
      ssr: false,
      update: update,
    })
    return el("div", "test")
  }

  dot.view({
    element: main,
    render: render,
    update: update,
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
      ssr: false,
      update: update,
    })
  }

  var render = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      render: render,
      selector: "#main",
      ssr: false,
      update: update,
    })
    return el("div", "test")
  }

  dot.view({
    render: render,
    selector: "#main",
    update: update,
  })

  dot.view()

  expect(body.children.length).toBe(1)
})

test("existing body (selector)", function() {
  expect.assertions(2)

  body.children[0].appendChild(el("div"))

  var update = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      render: render,
      selector: "#main",
      ssr: true,
      update: update,
    })
  }

  var render = function() {
    throw new Error("shouldn't render")
  }

  dot.view({
    render: render,
    selector: "#main",
    update: update,
  })

  expect(body.children.length).toBe(1)
})
