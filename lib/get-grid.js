const { BrowserWindow } = require('electron')

module.exports = function getGrid (grids, winId) {
  if (winId === undefined) {
    winId = BrowserWindow.getFocusedWindow()
    if (winId === null) return false
  }
  const grid = grids
    .filter(grid => {
      return grid.panes.some(p => {
        return p.wrapped.id === winId
      })
    })[0]
  return grid
}
