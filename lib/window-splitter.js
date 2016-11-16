'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const getPane = require('./get-pane')

module.exports = function windowChanger (state) {
  return {
    splitCurrentWindow: function splitCurrentWindow (screenId, winConstructor, winParams, axis) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return
      const pane = getPane(state.grids, focusedWindow.id)
      const origHeight = pane.height
      const origWidth = pane.width
      const origX = pane.x
      const origY = pane.y
      const changePaneWidth = axis === 'vertical'
        ? Math.floor(pane.width / 2)
        : pane.width
      const changePaneHeight = axis === 'vertical'
        ? pane.height
        : Math.floor(pane.height / 2)
      const newWindowWidth = axis === 'vertical'
        ? Math.ceil(origWidth / 2)
        : origWidth
      const newWindowHeight = axis === 'vertical'
        ? origHeight
        : Math.ceil(origHeight / 2)
      const newWindowX = axis === 'vertical'
        ? origX + Math.floor(origWidth / 2)
        : origX
      const newWindowY = axis === 'vertical'
        ? origY
        : origY + Math.floor(origHeight / 2)
      pane.changeSize(changePaneWidth, changePaneHeight)
      state.createWindow(screenId, winConstructor, Object.assign({}, winParams, {
        width: newWindowWidth,
        height: newWindowHeight,
        x: newWindowX,
        y: newWindowY
      }))
    }
  }
}
