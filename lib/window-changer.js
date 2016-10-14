'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const getPane = require('./get-pane')

module.exports = function windowChanger(state) {
  return {
    changeCurWindow: function changeCurWindow (params) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      if (params.x || params.y) {
        try {
          pane.changeLocation(
            params.x ? pane.x + parseInt(params.x) : pane.x,
            params.y ? pane.y + parseInt(params.y) : pane.y
          )
        } catch(e) {
          if (e.message === 'location blocked by one or more other panes') {
            try {
              pane.squashIntoLocation(
                params.x ? pane.x + parseInt(params.x) : pane.x,
                params.y ? pane.y + parseInt(params.y) : pane.y
              )
            } catch (e) {
              console.error(e)
            }
          } else {
            console.log('e is:', e)
            console.error(e)
            // TODO: some visual indication (flash border red?)
          }
        }
      } else { // TODO: support both
        try {
          pane.changeSize(
            params.width ? pane.width + parseInt(params.width) : pane.width,
            params.height ? pane.height + parseInt(params.height) : pane.height
          )
        } catch(e) {
          console.error(e)
          // TODO: some visual indication (flash border red?)
        }
      }
    }
  }
}
