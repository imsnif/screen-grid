'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const getPane = require('./get-pane')
const getGrid = require('./get-grid')
const findAdjacentPane = require('./find-adjacent-pane')

module.exports = function windowSwitcher (state) {
  return {
    switchWindow: function switchWindow (direction, crossGrid) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      const adjacentPane = findAdjacentPane(pane, direction)
      if (adjacentPane) return adjacentPane.wrapped.focus()
      const grid = getGrid(state.grids, pane.id)
      const adjacentGridAtDirection = state.adjacentGrids[grid.id][direction]
      if (!adjacentGridAtDirection) return
      const gridAtDirection = state.grids.filter(g => g.id === adjacentGridAtDirection.id)[0]
      if (crossGrid && gridAtDirection) {
        const adjacentPane = direction === 'left'
        ? findAdjacentPane(Object.assign({}, pane, {
          x: grid.offset.x > gridAtDirection.offset.x ? pane.x + grid.offset.x : pane.x + gridAtDirection.offset.x
        }), direction, gridAtDirection)
        : direction === 'right' ? findAdjacentPane(Object.assign({}, pane, {
          x: grid.offset.x > gridAtDirection.offset.x ? pane.x - grid.offset.x : pane.x - gridAtDirection.offset.x
        }), direction, gridAtDirection)
        : direction === 'up' ? findAdjacentPane(Object.assign({}, pane, {
          y: grid.offset.y > gridAtDirection.offset.y ? pane.y + grid.offset.y : pane.y + gridAtDirection.offset.y
        }), direction, gridAtDirection)
          : direction === 'down' ? findAdjacentPane(Object.assign({}, pane, {
          y: grid.offset.y > gridAtDirection.offset.y ? pane.y - grid.offset.y : pane.y - gridAtDirection.offset.y
        }), direction, gridAtDirection) : false
        if (adjacentPane) return adjacentPane.wrapped.focus()
      }
    },
    switchWindowContents: function switchWindowContents (direction) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      const adjacentPane = findAdjacentPane(pane, direction)
      if (adjacentPane) pane.grid.switchPanes(pane.id, adjacentPane.id)
    }
  }
}
