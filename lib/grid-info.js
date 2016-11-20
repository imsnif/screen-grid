'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const getPane = require('./get-pane')
const getGrid = require('./get-grid')
const calcGridOffsets = require('./calc-grid-offsets')
const findAdjacentPane = require('./find-adjacent-pane')

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
    },
    adjacentPane: function adjacentPane (direction) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      const adjacentPane = findAdjacentPane(pane, direction)
      if (adjacentPane) return adjacentPane
      const grid = getGrid(state.grids, pane.id)
      const adjacentGridAtDirection = state.adjacentGrids[grid.id][direction]
      if (!adjacentGridAtDirection) return
      const gridAtDirection = state.grids.filter(g => g.id === adjacentGridAtDirection.id)[0]
      const paneAtNextGrid = gridAtDirection
        ? findAdjacentPane(Object.assign({}, pane, calcGridOffsets(direction, pane, grid, gridAtDirection)), direction, gridAtDirection)
        : null
      if (paneAtNextGrid) return paneAtNextGrid
    },
    adjacentPaneInGrid: function adjacentPaneInGrid (direction) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      const adjacentPane = findAdjacentPane(pane, direction)
      if (adjacentPane) return adjacentPane
    }
  }
}
