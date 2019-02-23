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
  main = el("div", { id: "main.test" })

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

  dot.view("testView")
  dot.any("testViewRender", render)
  dot.any("testViewUpdate", update)

  var out = dot.testView()

  expect(out.tagName).toBe("DIV")
  expect(document.body.children[0]).toBe(main)
})

test("no element, call twice", function() {
  expect.assertions(3)

  var update = function(prop, arg) {
    expect(arg.ssr).toBe(false)
  }

  var render = function(prop, arg) {
    expect(arg.ssr).toBe(false)
    return el("div")
  }

  dot.view("testView")
  dot.any("testViewRender", render)
  dot.any("testViewUpdate", update)

  dot.testView()
  dot.testView()

  expect(document.body.children[0]).toBe(main)
})

test("empty document", function() {
  expect.assertions(5)

  clear(document)

  var update = function() {
    expect(true).toBe(true)
  }

  var render = function(prop, arg) {
    expect(arg.ssr).toBe(false)
    return el("html", el("body"))
  }

  dot.view("testView")
  dot.any("testViewRender", render)
  dot.any("testViewUpdate", update)

  dot.testView({ element: document })
  dot.testView()

  expect(document.children.length).toBe(1)
  expect(document.children[0].tagName).toBe("HTML")
  expect(document.children[0].children[0].tagName).toBe(
    "BODY"
  )
})

test("empty body", function() {
  expect.assertions(4)

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

  dot.view("testView")
  dot.any("testViewRender", render)
  dot.any("testViewUpdate", update)

  dot.testView({ element: main })
  dot.testView()

  expect(body.children.length).toBe(1)
  expect(body.children[0].textContent).toBe("test")
})

test("empty body (prop)", function() {
  expect.assertions(4)

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

  dot.view("testView")
  dot.any("testViewRender", render)
  dot.any("testViewUpdate", update)

  dot.testView("main")
  dot.testView("main")

  expect(body.children.length).toBe(1)
  expect(body.children[0].textContent).toBe("test")
})

test("empty body (selector)", function() {
  expect.assertions(4)

  var update = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      ssr: false,
    })
  }

  var render = function(prop, arg) {
    expect(arg).toEqual({
      element: body.children[0],
      selector: "#main\\.test",
      ssr: false,
    })
    return el("div", "test")
  }

  dot.view("testView")
  dot.any("testViewRender", render)
  dot.any("testViewUpdate", update)

  dot.testView({ selector: "#main\\.test" })
  dot.testView()

  expect(body.children.length).toBe(1)
  expect(body.children[0].textContent).toBe("test")
})

test("existing body (prop)", function() {
  expect.assertions(4)
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
      return el("div", "test2")
    }
  }

  var render = function() {
    throw new Error("shouldn't render")
  }

  dot.view("testView")
  dot.any("testViewRender", render)
  dot.any("testViewUpdate", update)

  dot.testView("main")
  dot.testView("main")

  expect(body.children.length).toBe(1)
  expect(body.children[0].textContent).toBe("test2")
})

test("existing body (selector)", function() {
  expect.assertions(4)
  var counter = 0

  body.children[0].appendChild(el("div", "test"))

  var update = function(prop, arg) {
    if (counter++ === 0) {
      expect(arg).toEqual({
        element: body.children[0],
        selector: "#main\\.test",
        ssr: true,
      })
    } else {
      expect(arg).toEqual({
        element: body.children[0],
        ssr: false,
      })
      return el("div", "test2")
    }
  }

  var render = function() {
    throw new Error("shouldn't render")
  }

  dot.view("testView")
  dot.any("testViewRender", render)
  dot.any("testViewUpdate", update)

  dot.testView({ selector: "#main\\.test" })
  dot.testView()

  expect(body.children.length).toBe(1)
  expect(body.children[0].textContent).toBe("test2")
})
