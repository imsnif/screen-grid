module.exports = function calcGridOffsets (direction, pane, grid, gridAtDirection) {
  const x = direction === 'left' || direction === 'right'
    ? (grid.offset.x > gridAtDirection.offset.x ? pane.x + grid.offset.x : pane.x - gridAtDirection.offset.x)
    : pane.x
  const y = direction === 'up' || direction === 'down'
    ? (grid.offset.y > gridAtDirection.offset.y ? pane.y + grid.offset.y : pane.y - gridAtDirection.offset.y)
    : pane.y
  return {x, y}
}
