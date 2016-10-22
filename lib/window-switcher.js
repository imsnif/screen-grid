'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const getPane = require('./get-pane')
const findAdjacentPane = require('./find-adjacent-pane')

module.exports = function windowSwitcher (state) {
  return {
    switchWindow: function switchWindow (direction) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      const adjacentPane = findAdjacentPane(pane, direction)
      if (adjacentPane) adjacentPane.wrapped.focus()
    }
  }
}
