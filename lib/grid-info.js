'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const getPane = require('./get-pane')

module.exports = function gridInfo (state) {
  return {
    currentPanePosition: function currentPanePosition () {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      return {x: pane.x, y: pane.y, width: pane.width, height: pane.height}
    }
  }
}
