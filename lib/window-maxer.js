'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const getPane = require('./get-pane')
const getGrid = require('./get-grid')

module.exports = function windowMaxer(state) {
  return {
    maxSize: function maxSize (params) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      pane.maxSize(params)
    },
    maxLoc: function maxLoc (params) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      try {
        pane.maxOrSkipLoc(params)
      } catch (e) {
        if (e.toString() === 'Error: location blocked') {
          const grid = getGrid(state.grids, focusedWindow.id)
          const adjacentGrids = state.adjacentGrids[grid.id]
          const direction = Object.keys(params)[0]
          if (adjacentGrids[direction]) {
            const adjacentGrid = state.grids.filter(g => {
              return g.id === adjacentGrids[direction].id
            })[0]
            const win = grid.expel(focusedWindow.id)
            const winBounds = win.getBounds()
            const size = {height: winBounds.height, width: winBounds.width}
            try {
              adjacentGrid.add(win, size)
            } catch (e) {
              // TODO: some indication this did not succeed
              grid.add(win, size, {width: pane.width, height: pane.height})
            }
          } else {
            // TODO: something... no-op?
            console.error('no grid found :(')
          }
        }
      }
    }
  }
}
