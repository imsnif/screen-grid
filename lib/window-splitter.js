'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const getPane = require('./get-pane')

function paneIsInGrid (pane, screenId, state) {
  const grid = findGridById (state, screenId)
  if (grid.panes.filter(p => p.id === pane.id)[0]) {
    return true
  } else {
    return false
  }
}

function findGridById (state, gridId) {
  return state.grids.filter(g => g.id === gridId)[0]
}

module.exports = function windowChanger (state) {
  return {
    splitCurrentWindow: function splitCurrentWindow (screenId, winConstructor, winParams, axis) {
      // TODO: this method needs to make a lot more sense...
      const focusedWindow = BrowserWindow.getFocusedWindow()
      const winToSplit = !focusedWindow || !paneIsInGrid(focusedWindow, screenId, state)
        ? findGridById(state, screenId).panes[0]
        : focusedWindow
      const pane = getPane(state.grids, winToSplit.id)
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
