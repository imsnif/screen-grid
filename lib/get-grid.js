const { BrowserWindow } = require('electron')

module.exports = function getGrid (grids, winId) {
  if (winId === undefined) {
    const win = BrowserWindow.getFocusedWindow()
    if (win === null) return false
    winId = win.id
  }
  const grid = grids
    .filter(grid => {
      return grid.panes.some(p => {
        return p.wrapped.id === winId
      })
    })[0]
  return grid
}
