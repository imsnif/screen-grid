'use strict'

const getGrid = require('./get-grid')

function findGridById (state, gridId) {
  return state.grids.filter(g => g.id === gridId)[0]
}

module.exports = function windowCreator (state) {
  return {
    createWindow: function createWindow (gridId, winConstructor, opts, listeners) {
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
        const pane = grid.add(winConstructor, params)
        Object.keys(listeners).forEach(l => {
          pane.on(l, (params) => listeners[l](pane.wrapped, params))
        })
      } catch (e) {
        // no-op
      }
    },
    createWindowCentered: function createWindow (gridId, winConstructor, opts, listeners) {
      try {
        const grid = typeof gridId === 'number' && findGridById(state, gridId)
          ? findGridById(state, gridId)
          : getGrid(state.grids) || state.grids[0]
        const gaps = grid.findGaps()
        if (gaps.length === 0) return // no-op
        const largestGap = gaps
          .sort((a, b) => a.height * a.width > b.height * b.width ? -1 : 1)[0]
        const x = largestGap.width > opts.width
          ? Math.floor((largestGap.width - opts.width) / 2) + largestGap.x
          : largestGap.x
        const y = largestGap.height > opts.height
          ? Math.floor((largestGap.height - opts.height) / 2) + largestGap.y
          : largestGap.y
        const pane = grid.add(winConstructor, Object.assign({}, opts, {x, y}))
        Object.keys(listeners).forEach(l => {
          pane.on(l, (params) => listeners[l](pane.wrapped, params))
        })
      } catch (e) {
        // no-op
      }
    }
  }
}
