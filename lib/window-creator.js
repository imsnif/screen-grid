'use strict'

const getGrid = require('./get-grid')

function findGridById (state, gridId) {
  return state.grids.filter(g => g.id === gridId)[0]
}

module.exports = function windowCreator (state) {
  return {
    createWindow: function createWindow (gridId, winConstructor, opts) {
      try {
        const grid = typeof gridId === 'number' && findGridById(state, gridId)
          ? findGridById(state, gridId)
          : getGrid(state.grids) || state.grids[0]
        const params = opts.maxSize ? Object.assign({}, opts, {
          width: grid.width,
          height: grid.height,
          x: 0,
          y: 0
        }) : opts
        grid.add(winConstructor, params)
      } catch (e) {
        console.error(e)
        // TODO: throw exception up so that we can have some visual indication
      }
    }
  }
}
