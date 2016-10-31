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
        const params = opts.maxSize ? Object.assign({}, opts, {width: grid.width, height: grid.height}) : opts
        grid.add(winConstructor, params)
        if (opts.fillOnClose) {
          const win = grid.panes[grid.panes.length - 1].wrapped
          win.on('close', () => {
            grid.maxAllPanes()
            const pane = grid.panes[grid.panes.length - 1]
            const gaps = pane && pane.grid ? pane.grid.findGaps() : 0
            if (gaps.length > 0 && pane && pane.wrapped && pane.wrapped.constructor) {
              gaps.forEach(g => state.createWindow(
                0,
                pane.wrapped.constructor,
                Object.assign({}, g, {frame: false, skipTaskbar: true, fillOnClose: true}))
                // TODO: frame and skipTaskbar should be default options
              )
            } else if (pane && pane.wrapped) pane.wrapped.focus()
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
}
