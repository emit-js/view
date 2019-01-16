/** @jsx el */
/* eslint-env jest */
/*global document*/

var dot = require("dot-event")()
var view = require("./")

var JSDOM = require("jsdom").JSDOM
var el = require("attodom").el

var window = new JSDOM().window
global.document = window.document

beforeEach(function() {
  dot.reset()
  view(dot)
})

test("empty dom", function() {
  expect.assertions(2)

  var render = function(prop, arg) {
    expect(arg).toEqual({
      element: window.document.body,
      render: render,
      selector: "body",
      update: update,
    })
    return el("div")
  }

  var update = function(prop, arg) {
    expect(arg).toEqual({
      element: window.document.body,
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
})

test("pre-rendered dom", function() {
  expect.assertions(1)

  document.body.appendChild(el("div"))

  var render = function() {
    expect(true).toEqual(false)
  }

  var update = function(prop, arg) {
    expect(arg).toEqual({
      element: window.document.body,
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
})
