/*
  Copyright 2015 Sebastian Viklund
  Licenced under the zlib licence
*/

var mat4 = (function () {
  "use strict"

  return {
    identity: identity,
    translation: translation,
    scaling: scaling,
    uniform_scaling: uniform_scaling,
    rotation: rotation,
    rotation_x: rotation_x,
    rotation_y: rotation_y,
    rotation_z: rotation_z,
    frustum: frustum,
    perspective: perspective,
    product: product,
    transpose: transpose
  }

  function identity() {
    return [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1]
  }

  function translation(v) {
    var x = v[0]
      , y = v[1]
      , z = v[2]

    return [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1]
  }

  function scaling(v) {
    var x = v[0]
      , y = v[1]
      , z = v[2]

    return [x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1]
  }

  function uniform_scaling(s) {
    return [s, 0, 0, 0,
            0, s, 0, 0,
            0, 0, s, 0,
            0, 0, 0, 1]
  }

  function rotation(a, v) {
    var x = v[0]
      , y = v[1]
      , z = v[2]
      , s = Math.sin(a)
      , c = Math.cos(a)
      , t = 1 - c
      , m11 = c + x * x * t
      , m12 = y * x * t + z * s
      , m13 = z * x * t - y * s
      , m21 = x * y * t - z * s
      , m22 = c + y * y * t
      , m23 = z * y * t + x * s
      , m31 = x * z * t + y * s
      , m32 = y * z * t - x * s
      , m33 = c + z * z * t

    return [m11, m12, m13, 0,
            m21, m22, m23, 0,
            m31, m32, m33, 0,
            0,   0,   0,   1]
  }

  function rotation_x(a) {
    var s = Math.sin(a)
      , c = Math.cos(a)

    return [1, 0, 0, 0,
            0, c, s, 0,
            0,-s, c, 0,
            0, 0, 0, 1]
  }

  function rotation_y(a) {
    var s = Math.sin(a)
      , c = Math.cos(a)

    return [c, 0,-s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1]
  }

  function rotation_z(a) {
    var s = Math.sin(a)
      , c = Math.cos(a)

    return [c, s, 0, 0,
           -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1]
  }

  function frustum(left, right, bottom, top, near, far) {
    var m11 = 2 * near / (right - left)
      , m22 = 2 * near / (top - bottom)
      , m31 = (right + left) / (right - left)
      , m32 = (top + bottom) / (top - bottom)
      , m33 = (far + near) / (near - far)
      , m43 = 2 * far * near / (near - far)

    return [m11, 0,   0,   0,
            0,   m22, 0,   0,
            m31, m32, m33,-1,
            0,   0,   m43, 0]
  }

  function perspective(fovy, aspect, near, far) {
    var ymax = near * Math.tan(fovy * Math.PI / 180 / 2)
      , ymin = -ymax
      , xmax = ymax * aspect
      , xmin = ymin * aspect

      return frustum(xmin, xmax, ymin, ymax, near, far)
  }

  function product() {
    var r = arguments[0] || identity()
      , i

    for (i = 1; i < arguments.length; i++)
      r = multiply(r, arguments[i])

    return r

    function multiply(m1, m2) {
      return [
        m1[0] * m2[0] + m1[4] * m2[1] + m1[8] * m2[2] + m1[12] * m2[3],
        m1[1] * m2[0] + m1[5] * m2[1] + m1[9] * m2[2] + m1[13] * m2[3],
        m1[2] * m2[0] + m1[6] * m2[1] + m1[10] * m2[2] + m1[14] * m2[3],
        m1[3] * m2[0] + m1[7] * m2[1] + m1[11] * m2[2] + m1[15] * m2[3],

        m1[0] * m2[4] + m1[4] * m2[5] + m1[8] * m2[6] + m1[12] * m2[7],
        m1[1] * m2[4] + m1[5] * m2[5] + m1[9] * m2[6] + m1[13] * m2[7],
        m1[2] * m2[4] + m1[6] * m2[5] + m1[10] * m2[6] + m1[14] * m2[7],
        m1[3] * m2[4] + m1[7] * m2[5] + m1[11] * m2[6] + m1[15] * m2[7],

        m1[0] * m2[8] + m1[4] * m2[9] + m1[8] * m2[10] + m1[12] * m2[11],
        m1[1] * m2[8] + m1[5] * m2[9] + m1[9] * m2[10] + m1[13] * m2[11],
        m1[2] * m2[8] + m1[6] * m2[9] + m1[10] * m2[10] + m1[14] * m2[11],
        m1[3] * m2[8] + m1[7] * m2[9] + m1[11] * m2[10] + m1[15] * m2[11],

        m1[0] * m2[12] + m1[4] * m2[13] + m1[8] * m2[14] + m1[12] * m2[15],
        m1[1] * m2[12] + m1[5] * m2[13] + m1[9] * m2[14] + m1[13] * m2[15],
        m1[2] * m2[12] + m1[6] * m2[13] + m1[10] * m2[14] + m1[14] * m2[15],
        m1[3] * m2[12] + m1[7] * m2[13] + m1[11] * m2[14] + m1[15] * m2[15]
      ]
    }
  }

  function transpose(m) {
    return [m[0], m[4], m[8],  m[12],
            m[1], m[5], m[9],  m[13],
            m[2], m[6], m[10], m[14],
            m[3], m[7], m[11], m[15]]
  }

})()