'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const getPane = require('./get-pane')

module.exports = function windowSwitcher (state) {
  return {
    switchWindow: function switchWindow (direction) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      if (direction === 'right') {
        const adjacentPane = pane.grid.panes
        .filter(p => p.id !== pane.id)
        .filter(p => {
          return (
            (
              p.y >= pane.y && p.y <= pane.y + pane.height ||
              p.y + p.height <= pane.y + pane.height && p.y + p.height >= pane.y
            ) &&
            p.x >= pane.x + pane.width
          )
        })
        .sort((a, b) => a.x < b.x ? -1 : 1)[0]
        if (adjacentPane) adjacentPane.wrapped.focus()
      } else if (direction === 'left') {
        const adjacentPane = pane.grid.panes
        .filter(p => p.id !== pane.id)
        .filter(p => {
          return (
            (
              p.y >= pane.y && p.y <= pane.y + pane.height ||
              p.y + p.height <= pane.y + pane.height && p.y + p.height >= pane.y
            ) &&
            p.x < pane.x
          )
        })
        .sort((a, b) => a.x > b.x ? -1 : 1)[0]
        if (adjacentPane) adjacentPane.wrapped.focus()
      } else if (direction === 'up') {
        const adjacentPane = pane.grid.panes
        .filter(p => p.id !== pane.id)
        .filter(p => {
          return (
            (
              p.x >= pane.x && p.x <= pane.x + pane.width ||
              p.x + p.width <= pane.x + pane.width && p.x + p.width >= pane.x
            ) &&
            p.y < pane.y
          )
        })
        .sort((a, b) => a.y > b.y ? -1 : 1)[0]
        if (adjacentPane) adjacentPane.wrapped.focus()
      } else if (direction === 'down') {
        const adjacentPane = pane.grid.panes
        .filter(p => p.id !== pane.id)
        .filter(p => {
          return (
            (
              p.x >= pane.x && p.x <= pane.x + pane.width ||
              p.x + p.width <= pane.x + pane.width && p.x + p.width >= pane.x
            ) &&
            p.y >= pane.y + pane.height
          )
        })
        .sort((a, b) => a.y < b.y ? -1 : 1)[0]
        if (adjacentPane) adjacentPane.wrapped.focus()
      }
    }
  }
}
