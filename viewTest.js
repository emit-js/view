/* eslint-env jest */

var el = require("attodom").el,
  emit,
  JSDOM = require("jsdom").JSDOM,
  log = require("@emit-js/log"),
  view = require("./")

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

  emit = require("@emit-js/emit")()
  log(emit)
  view(emit)
})

test("no element", function() {
  expect.assertions(4)

  var update = function() {
    throw new Error("shouldn't update")
  }

  var render = function(arg, prop) {
    expect(prop).toEqual(["test"])
    expect(arg.ssr).toBe(false)
    return el("div")
  }

  emit.view("testView")
  emit.any("testViewRender", render)
  emit.any("testViewUpdate", update)

  var out = emit.testView()

  expect(out.tagName).toBe("DIV")
  expect(document.body.children[0]).toBe(main)
})

test("no element, call twice", function() {
  expect.assertions(3)

  var update = function(arg) {
    expect(arg.ssr).toBe(false)
  }

  var render = function(arg) {
    expect(arg.ssr).toBe(false)
    return el("div")
  }

  emit.view("testView")
  emit.any("testViewRender", render)
  emit.any("testViewUpdate", update)

  emit.testView()
  emit.testView()

  expect(document.body.children[0]).toBe(main)
})

test("empty document", function() {
  expect.assertions(5)

  clear(document)

  var update = function() {
    expect(true).toBe(true)
  }

  var render = function(arg) {
    expect(arg.ssr).toBe(false)
    return el("html", el("body"))
  }

  emit.view("testView")
  emit.any("testViewRender", render)
  emit.any("testViewUpdate", update)

  emit.testView({ element: document })
  emit.testView()

  expect(document.children.length).toBe(1)
  expect(document.children[0].tagName).toBe("HTML")
  expect(document.children[0].children[0].tagName).toBe(
    "BODY"
  )
})

test("empty body", function() {
  expect.assertions(4)

  var update = function(arg) {
    expect(arg).toEqual({
      element: body.children[0],
      ssr: false,
    })
  }

  var render = function(arg) {
    expect(arg).toEqual({
      element: body.children[0],
      ssr: false,
    })
    return el("div", "test")
  }

  emit.view("testView")
  emit.any("testViewRender", render)
  emit.any("testViewUpdate", update)

  emit.testView({ element: main })
  emit.testView()

  expect(body.children.length).toBe(1)
  expect(body.children[0].textContent).toBe("test")
})

test("empty body (prop)", function() {
  expect.assertions(4)

  var update = function(arg) {
    expect(arg).toEqual({
      element: body.children[0],
      ssr: false,
    })
  }

  var render = function(arg) {
    expect(arg).toEqual({
      element: body.children[0],
      ssr: false,
    })
    return el("div", "test")
  }

  emit.view("testView")
  emit.any("testViewRender", render)
  emit.any("testViewUpdate", update)

  emit.testView("main")
  emit.testView("main")

  expect(body.children.length).toBe(1)
  expect(body.children[0].textContent).toBe("test")
})

test("empty body (selector)", function() {
  expect.assertions(4)

  var update = function(arg) {
    expect(arg).toEqual({
      element: body.children[0],
      ssr: false,
    })
  }

  var render = function(arg) {
    expect(arg).toEqual({
      element: body.children[0],
      selector: "#main\\.test",
      ssr: false,
    })
    return el("div", "test")
  }

  emit.view("testView")
  emit.any("testViewRender", render)
  emit.any("testViewUpdate", update)

  emit.testView({ selector: "#main\\.test" })
  emit.testView()

  expect(body.children.length).toBe(1)
  expect(body.children[0].textContent).toBe("test")
})

test("existing body (prop)", function() {
  expect.assertions(4)
  var counter = 0

  body.children[0].appendChild(el("div", "test"))

  var update = function(arg) {
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

  emit.view("testView")
  emit.any("testViewRender", render)
  emit.any("testViewUpdate", update)

  emit.testView("main")
  emit.testView("main")

  expect(body.children.length).toBe(1)
  expect(body.children[0].textContent).toBe("test2")
})

test("existing body (selector)", function() {
  expect.assertions(4)
  var counter = 0

  body.children[0].appendChild(el("div", "test"))

  var update = function(arg) {
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

  emit.view("testView")
  emit.any("testViewRender", render)
  emit.any("testViewUpdate", update)

  emit.testView({ selector: "#main\\.test" })
  emit.testView()

  expect(body.children.length).toBe(1)
  expect(body.children[0].textContent).toBe("test2")
})
