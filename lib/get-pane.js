const getGrid = require('./get-grid')

module.exports = function getPane (grids, winId) {
  const grid = getGrid(grids, winId)
  return grid.getPane(winId)
}
