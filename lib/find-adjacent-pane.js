'use strict'

function occupySameHorizontalSpace (pane, candidate) {
  return (
    candidate.y < pane.y + pane.height &&
    candidate.height + candidate.y > pane.y
  )
}

function occupySameVerticalSpace (pane, candidate) {
  return (
    candidate.x < pane.x + pane.width &&
    candidate.x + candidate.width > pane.x
  )
}

function closestAt (closest, pane, direction) {
  if (closest.length === 0) {
    closest.push(pane)
    return closest
  } else if (direction === 'right') {
    if (closest[0].x < pane.x) return closest
    if (closest[0].x >= pane.x) closest.push(pane)
    return closest.filter(p => p.x <= pane.x)
  } else if (direction === 'left') {
    if (closest[0].x > pane.x) return closest
    if (closest[0].x + closest[0].width <= pane.x + pane.width) closest.push(pane)
    return closest.filter(p => p.x + p.width >= pane.x + pane.width)
  } else if (direction === 'up') {
    if (closest[0].y > pane.y) return closest
    if (closest[0].y + closest[0].height <= pane.y + pane.height) closest.push(pane)
    return closest.filter(p => p.y + p.height >= pane.y + pane.height)
  } else if (direction === 'down') {
    if (closest[0].y < pane.y) return closest
    if (closest[0].y >= pane.y) closest.push(pane)
    return closest.filter(p => p.y <= pane.y)
  }
}

module.exports = function findAdjacentPane (pane, direction, targetGrid) {
  const grid = targetGrid || pane.grid
  const candidates = grid.panes
    .filter(p => p.id !== pane.id)
    .reduce((memo, p) => {
      const axisCheckMethod = direction === 'up' || direction === 'down'
        ? occupySameVerticalSpace
        : occupySameHorizontalSpace
      const paneGroup = axisCheckMethod(pane, p)
        ? memo.sameAxisSpace
        : memo.notSameAxisSpace
      paneGroup.push(p)
      return memo
    }, {sameAxisSpace: [], notSameAxisSpace: []})
  const choices = candidates.sameAxisSpace.length > 0
    ? candidates.sameAxisSpace
    : candidates.notSameAxisSpace
  return choices.filter(p => direction === 'right' ? p.x >= pane.x + pane.width
      : direction === 'left' ? p.x < pane.x
      : direction === 'up' ? p.y < pane.y
      : direction === 'down' ? p.y >= pane.y + pane.height : []
    )
    .reduce((closest, p) => closestAt(closest, p, direction), [])
    .sort((a, b) => direction === 'up' || direction === 'down'
      ? (a.x < b.x ? -1 : 1)
      : (a.y < b.y ? -1 : 1)
    )[0]
}
