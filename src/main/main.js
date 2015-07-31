// Entry point
(function () {
  "use strict"

  var game = CHURRO.game
    , ticker = CHURRO.request_frame_ticker
  
  game.set_ticker(ticker)
  game.run()

})()