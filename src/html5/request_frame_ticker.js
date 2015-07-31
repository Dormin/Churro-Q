CHURRO.request_frame_ticker = (function () {
  "use strict"

  var on_tick_callback

  return {
    set_on_tick_callback: set_on_tick_callback,
    run: run
  }

  function set_on_tick_callback(c) {
    on_tick_callback = c
  }

  function run() {
    var request_frame = window.requestAnimationFrame
      , tick = 0
      , prev_timestamp

    request_frame(on_tick)

    function on_tick(timestamp) {
      request_frame(on_tick)
      if (tick > 0)
        on_tick_callback(milliseconds_to_seconds(timestamp - prev_timestamp))
      prev_timestamp = timestamp
      tick += 1

      function milliseconds_to_seconds(ms) {
        return ms / 1000
      }
    }
  }

})()