const { BrowserWindow } = require('electron')

module.exports = function getGrid (grids, winId) {
  if (typeof winId === 'undefined' && !BrowserWindow.getFocusedWindow()) return false
  const id = typeof winId === 'undefined'
    ? BrowserWindow.getFocusedWindow().id
    : winId
  const grid = grids.find(grid => grid.panes.some(p => p.wrapped.id === id))
  return grid
}
