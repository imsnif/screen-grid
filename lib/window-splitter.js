'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const getPane = require('./get-pane')

module.exports = function windowChanger (state) {
  return {
    splitCurrentWindow: function changeCurWindow (screenId, winConstructor, winParams, axis) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      const origHeight = pane.height
      const origWidth = pane.width
      const origX = pane.x
      const origY = pane.y
      if (axis === 'vertical') {
        pane.changeSize(
          Math.round(pane.width / 2),
          pane.height
        )
        state.createWindow(screenId, winConstructor, Object.assign({}, winParams, {
          width: Math.round(origWidth / 2),
          height: origHeight,
          x: origX + Math.round(origWidth / 2),
          y: origY
        }))
      } else {
        pane.changeSize(
          pane.width,
          Math.round(pane.height / 2)
        )
        state.createWindow(screenId, winConstructor, Object.assign({}, winParams, {
          width: origWidth,
          height: Math.floor(origHeight / 2),
          x: origX,
          y: origY + Math.ceil(origHeight / 2)
        }))
      }
    }
  }
}
