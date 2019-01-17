/** @jsx el */
/* eslint-env jest */

var dot = require("dot-event")()
var view = require("./")

var JSDOM = require("jsdom").JSDOM
var el = require("attodom").el

var window = new JSDOM().window
var body = window.document.body
global.document = window.document

beforeEach(function() {
  while (body.firstChild) {
    body.removeChild(body.firstChild)
  }

  dot.reset()
  view(dot)
})

test("empty dom with element", function() {
  var render = function(prop, arg) {
    expect(arg).toEqual({
      element: body,
      render: render,
    })
    return el("div")
  }

  dot.view({
    element: body,
    render: render,
  })

  expect(body.children.length).toBe(1)
})

test("empty dom with selector", function() {
  expect.assertions(3)

  var render = function(prop, arg) {
    expect(arg).toEqual({
      element: body,
      render: render,
      selector: "body",
      update: update,
    })
    return el("div")
  }

  var update = function(prop, arg) {
    expect(arg).toEqual({
      element: body,
      render: render,
      ssr: false,
      update: update,
    })
  }

  dot.view({
    render: render,
    selector: "body",
    update: update,
  })

  dot.view()

  expect(body.children.length).toBe(1)
})

test("existing dom with selector", function() {
  expect.assertions(2)

  body.appendChild(el("div"))

  var render = function() {
    throw new Error("render shouldn't run")
  }

  var update = function(prop, arg) {
    expect(arg).toEqual({
      element: body,
      render: render,
      selector: "body",
      ssr: true,
      update: update,
    })
  }

  dot.view({
    render: render,
    selector: "body",
    update: update,
  })

  expect(body.children.length).toBe(1)
})
