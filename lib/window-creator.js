'use strict'

const TerminalWindow = require('electron-terminal-window')

const getGrid = require('./get-grid')

module.exports = function windowCreator(state) {
  return {
    createWindow: function createWindow (gridId) {
      try {
        const grid = typeof gridId === 'number' && typeof state.grids[gridId] === 'object'
          ? state.grids[gridId] : getGrid(state.grids) || state.grids[0]
        grid.add(TerminalWindow, {
          width: 400,
          height: 300,
          frame: false,
          skipTaskbar: true
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
