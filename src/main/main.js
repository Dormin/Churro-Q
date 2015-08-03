// Entry point
(function () {
  "use strict"

  var game = CHURRO.game
    , webgl_renderer = CHURRO.webgl_renderer
    , request_frame_ticker = CHURRO.request_frame_ticker
  
  webgl_renderer.set_canvas(document.getElementById("view"))
  webgl_renderer.init()

  game.set_renderer(webgl_renderer)
  game.set_ticker(request_frame_ticker)
  game.run()

})()