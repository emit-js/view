/* eslint-env jest */

var dot = require("dot-event")()
var log = require("@dot-event/log")
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
  log(dot)
  view(dot)
})

test("no element", function() {
  expect.assertions(4)

  var update = function() {
    throw new Error("shouldn't update")
  }

  var render = function(prop, arg) {
    expect(prop).toEqual(["test"])
    expect(arg.ssr).toBe(false)
    return el("div")
  }

  dot.view("testView", "test", {
    render: render,
    update: update,
  })

  var out = dot.testView()

  expect(out.tagName).toBe("DIV")
  expect(main.children.length).toBe(0)
})

test("no element, call twice", function() {
  expect.assertions(2)

  var update = function(prop, arg) {
    expect(arg.ssr).toBe(false)
  }

  var render = function(prop, arg) {
    expect(arg.ssr).toBe(false)
    return el("div")
  }

  dot.view("testView", { render: render, update: update })

  dot.testView()
  dot.testView()
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

  dot.view("testView", { render: render, update: update })

  dot.testView({ element: document })
  dot.testView()

  expect(document.children.length).toBe(1)
})

test("empty body", function() {
  expect.assertions(3)

  var update = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      ssr: false,
    })
  }

  var render = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      ssr: false,
    })
    return el("div", "test")
  }

  dot.view("testView", { render: render, update: update })

  dot.testView({ element: main })
  dot.testView()

  expect(body.children.length).toBe(1)
})

test("empty body (prop)", function() {
  expect.assertions(3)

  var update = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      ssr: false,
    })
  }

  var render = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      ssr: false,
    })
    return el("div", "test")
  }

  dot.view("testView", { render: render, update: update })

  dot.testView("main")
  dot.testView("main")

  expect(body.children.length).toBe(1)
})

test("empty body (selector)", function() {
  expect.assertions(3)

  var update = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      ssr: false,
    })
  }

  var render = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      selector: "#main",
      ssr: false,
    })
    return el("div", "test")
  }

  dot.view("testView", { render: render, update: update })

  dot.testView({ selector: "#main" })
  dot.testView()

  expect(body.children.length).toBe(1)
})

test("existing body (prop)", function() {
  expect.assertions(3)
  var counter = 0

  body.children[0].appendChild(el("div", "test"))

  var update = function(prop, arg) {
    if (counter++ === 0) {
      expect(arg).toEqual({
        element: body.children[0],
        ssr: true,
      })
    } else {
      expect(arg).toEqual({
        element: body.children[0],
        ssr: false,
      })
    }
  }

  var render = function() {
    throw new Error("shouldn't render")
  }

  dot.view("testView", { render: render, update: update })

  dot.testView("main")
  dot.testView("main")

  expect(body.children.length).toBe(1)
})

test("existing body (selector)", function() {
  expect.assertions(3)
  var counter = 0

  body.children[0].appendChild(el("div", "test"))

  var update = function(prop, arg) {
    if (counter++ === 0) {
      expect(arg).toEqual({
        element: body.children[0],
        selector: "#main",
        ssr: true,
      })
    } else {
      expect(arg).toEqual({
        element: body.children[0],
        ssr: false,
      })
    }
  }

  var render = function() {
    throw new Error("shouldn't render")
  }

  dot.view("testView", { render: render, update: update })

  dot.testView({ selector: "#main" })
  dot.testView()

  expect(body.children.length).toBe(1)
})
