/*
  Copyright 2015 Sebastian Viklund
  Licenced under the zlib licence
*/

var vec3 = (function () {
  "use strict"

  return {
    equal: equal,
    neg: neg,
    add: add,
    sub: sub,
    mul: mul,
    div: div,
    dot: dot,
    cross: cross,
    len: len,
    unit: unit
  }

  function equal(v1, v2) {
    return v1[0] == v2[0] && v1[1] == v2[1] && v1[2] == v2[2]
  }

  function neg(v) {
    return [-v[0], -v[1], -v[2]]
  }

  function add(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]]
  }

  function sub(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]]
  }

  function mul(v, s) {
    return [v[0] * s, v[1] * s, v[2] * s]
  }

  function div(v, s) {
    return [v[0] / s, v[1] / s, v[2] / s]
  }

  function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]
  }

  function cross(v1, v2) {
    return [v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0]]
  }

  function len(v) {
    return Math.sqrt(dot(v, v))
  }

  function unit(v) {
    return div(v, len(v))
  }

})()