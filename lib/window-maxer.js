'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const getPane = require('./get-pane')

module.exports = function windowMaxer (state) {
  return {
    maxSize: function maxSize (params) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only max focused window
      const pane = getPane(state.grids, focusedWindow.id)
      pane.maxSize(params)
    },
    maxLoc: function maxLoc (params) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only max focused window
      const pane = getPane(state.grids, focusedWindow.id)
      pane.maxOrSkipLoc(params)
    }
  }
}
