CHURRO.webgl_renderer = (function () {
  "use strict"

  var canvas
    , gl
    , program
    , meshes = []
    , textures = []

  return {
    set_canvas: set_canvas,
    init: init,
    create_mesh: create_mesh,
    create_texture: create_texture,
    enable_per_vertex_color: enable_per_vertex_color,
    disable_per_vertex_color: disable_per_vertex_color,
    set_texture: set_texture,
    set_matrix: set_matrix,
    set_color: set_color,
    clear: clear,
    draw_mesh: draw_mesh
  }

  function set_canvas(c) {
    canvas = c
  }

  function init() {
    setup_webgl_context()
    setup_shaders()

    function setup_webgl_context() {
      gl = canvas.getContext("webgl")
      gl.enable(gl.DEPTH_TEST)
    }

    function setup_shaders() {
      program = create_program(get_vertex_source(), get_fragment_source())
      gl.useProgram(program)
      gl.enableVertexAttribArray(gl.getAttribLocation(program, "vertex"))
      gl.enableVertexAttribArray(gl.getAttribLocation(program, "texcoord"))

      function get_vertex_source() {
        return "uniform mat4 matrix;\n"
             + "attribute vec3 vertex;\n"
             + "attribute vec2 texcoord;\n"
             + "attribute vec3 color;\n"
             + "varying lowp vec2 v_texcoord;\n"
             + "varying lowp vec3 v_color;\n"
             + "void main() {\n"
             + " gl_Position = matrix * vec4(vertex, 1);\n"
             + " v_texcoord = texcoord;\n"
             + " v_color = color;\n"
             + "}\n"
      }

      function get_fragment_source() {
        return "uniform sampler2D sampler;\n"
             + "varying lowp vec2 v_texcoord;\n"
             + "varying lowp vec3 v_color;\n"
             + "void main() {\n"
             + " gl_FragColor = texture2D(sampler, v_texcoord) * vec4(v_color, 1);\n"
             + "}\n"
      }

      function create_program(vertex_source, fragment_source) {
        var p = gl.createProgram()

        gl.attachShader(p, create_shader(gl.VERTEX_SHADER, vertex_source))
        gl.attachShader(p, create_shader(gl.FRAGMENT_SHADER, fragment_source))
        gl.linkProgram(p)

        if (!gl.getProgramParameter(p, gl.LINK_STATUS))
          throw new Error("Shader Link Error: " + gl.getProgramInfoLog(p))

        return p

        function create_shader(type, source) {
          var s = gl.createShader(type)

          gl.shaderSource(s, source)
          gl.compileShader(s)

          if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
            throw new Error("Shader Compile Error: " + gl.getShaderInfoLog(s))

          return s
        }
      }
    }
  }

  function create_mesh(data) {
    var buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    meshes.push({vertex_count: data.length / 8, buffer: buffer})

    return meshes.length - 1
  }

  function create_texture(width, height, data) {
    var texture = gl.createTexture()
    
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA,
                  gl.UNSIGNED_BYTE, new Uint8Array(data))
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.bindTexture(gl.TEXTURE_2D, null)

    textures.push(texture)

    return textures.length - 1
  }

  function enable_per_vertex_color() {
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "color"))
  }

  function disable_per_vertex_color() {
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "color"))
  }

  function set_texture(id) {
    gl.bindTexture(gl.TEXTURE_2D, textures[id]);
  }

  function set_matrix(matrix) {
    var location = gl.getUniformLocation(program, "matrix")

    gl.uniformMatrix4fv(location, false, matrix)
  }

  function set_color(color) {
    var location = gl.getAttribLocation(program, "color")

    gl.vertexAttrib3fv(location, color)
  }

  function clear(color) {
    var r = color[0]
      , g = color[1]
      , b = color[2]
      , a = 1.0

    gl.clearColor(r, g, b, a)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }

  function draw_mesh(id) {
    var mesh = meshes[id]
      , vertex_location = gl.getAttribLocation(program, "vertex")
      , texcoord_location = gl.getAttribLocation(program, "texcoord")
      , color_location = gl.getAttribLocation(program, "color")

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer)
    gl.vertexAttribPointer(vertex_location, 3, gl.FLOAT, false, 32, 0)
    gl.vertexAttribPointer(texcoord_location, 2, gl.FLOAT, false, 32, 12)
    gl.vertexAttribPointer(color_location, 3, gl.FLOAT, false, 32, 20)
    gl.drawArrays(gl.TRIANGLES, 0, mesh.vertex_count)
  }

})()