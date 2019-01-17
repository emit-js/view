/** @jsx el */
/* eslint-env jest */

var dot = require("dot-event")()
var view = require("./")

var el = require("attodom").el

var JSDOM = require("jsdom").JSDOM
var jsdom = new JSDOM()
var window = jsdom.window
var body = window.document.body

global.document = window.document

beforeEach(function() {
  while (body.firstChild) {
    body.removeChild(body.firstChild)
  }

  body.appendChild(el("div", { id: "main" }))

  dot.reset()
  view(dot)
})

test("empty dom with element", function() {
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

test("empty dom with selector", function() {
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

test("existing dom with selector", function() {
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
