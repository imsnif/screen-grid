'use strict'

const getGrid = require('./get-grid')

module.exports = function windowCreator(state) {
  return {
    createWindow: function createWindow (gridId, winConstructor, params) {
      try {
        const grid = typeof gridId === 'number' &&
          typeof state.grids[gridId] === 'object'
          ? state.grids[gridId]
          : getGrid(state.grids) || state.grids[0]
        grid.add(winConstructor, params)
      } catch (e) {
        console.error(e)
      }
    }
  }
}
