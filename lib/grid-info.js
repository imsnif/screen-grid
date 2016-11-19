'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const getPane = require('./get-pane')

module.exports = function gridInfo (state) {
  return {
    currentPanePosition: function currentPanePosition () {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return false
      const pane = getPane(state.grids, focusedWindow.id)
      return {x: pane.x, y: pane.y, width: pane.width, height: pane.height}
    },
    isInGrid: function isInGrid (winId, screenId) {
      const grid = state.grids.find(g => g.id === screenId)
      return grid.panes
        .find(p => p.id === winId)
    }
  }
}
