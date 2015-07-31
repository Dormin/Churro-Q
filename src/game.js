CHURRO.game = (function () {
  "use strict"

  var ticker

  return {
    set_ticker: set_ticker,
    run: run
  }

  function set_ticker(t) {
    ticker = t
  }

  function run() {
    ticker.set_on_tick_callback(on_tick)
    ticker.run()
  }

  function on_tick(dt) {
    
  }

})()