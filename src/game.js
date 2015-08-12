CHURRO.game = (function () {
  "use strict"

  var renderer
    , ticker

  return {
    set_renderer: set_renderer,
    set_ticker: set_ticker,
    run: run
  }

  function set_renderer(r) {
    renderer = r
  }

  function set_ticker(t) {
    ticker = t
  }

  function run() {
    ticker.set_on_tick_callback(on_tick)
    ticker.run()
  }

  function on_tick(dt) {
    renderer.clear([0, 0, 0])
  }

})()