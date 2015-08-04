CHURRO.state_machine = (function () {
  "use strict"

  return {create: create}

  function create() {
    var self = {
      add_state: add_state,
      set_state: set_state,
      send_message: send_message
    }

    var states = {}
      , current = ""

    return self

    function add_state(state) {
      states[state.name] = state
    }

    function set_state(name) {
      if (states[current])
        states[current].on_exit(self)
      current = name
      states[current].on_enter(self)
    }

    function send_message(message) {
      states[current].handle_message(self, message)
    }
  }

})()