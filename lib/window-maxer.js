'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const getPane = require('./get-pane')

module.exports = function windowMaxer (state) {
  return {
    maxSize: function maxSize (direction) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only max focused window
      const pane = getPane(state.grids, focusedWindow.id)
      pane.maxSize({[direction]: true})
    },
    maxLoc: function maxLoc (direction) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only max focused window
      const pane = getPane(state.grids, focusedWindow.id)
      pane.maxOrSkipLoc({[direction]: true})
    }
  }
}
