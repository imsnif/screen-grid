'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const getPane = require('./get-pane')

function occupySameVerticalSpace (pane, candidate) {
  return (
    candidate.y < pane.y + pane.height &&
    candidate.height + candidate.y > pane.y
  )
}

function occupySameHorizontalSpace (pane, candidate) {
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
    if (closest[0].x === pane.x || closest[0].x > pane.x) closest.push(pane)
    return closest.filter(p => p.x <= pane.x)
  } else if (direction === 'left') {
    if (closest[0].x > pane.x) return closest
    if (closest[0].x === pane.x || closest[0].x < pane.x) closest.push(pane)
    return closest.filter(p => p.x >= pane.x)
  } else if (direction === 'up') {
    if (closest[0].y > pane.y) return closest
    if (closest[0].y === pane.y || closest[0].y < pane.y) closest.push(pane)
    return closest.filter(p => p.y >= pane.y)
  } else if (direction === 'down') {
    if (closest[0].y < pane.y) return closest
    if (closest[0].y === pane.y || closest[0].y > pane.y) closest.push(pane)
    return closest.filter(p => p.y <= pane.y)
  }
}

function findAdjacentPane (pane, direction) {
  if (direction === 'right') {
    return pane.grid.panes
      .filter(p => p.id !== pane.id)
      .filter(p => occupySameVerticalSpace(pane, p))
      .filter(p => p.x >= pane.x + pane.width)
      .reduce((closest, p) => closestAt(closest, p, direction), [])
      .sort((a, b) => a.y < b.y ? -1 : 1)[0]
  } else if (direction === 'left') {
    return pane.grid.panes
      .filter(p => p.id !== pane.id)
      .filter(p => occupySameVerticalSpace(pane, p))
      .filter(p => p.x < pane.x)
      .reduce((closest, p) => closestAt(closest, p, direction), [])
      .sort((a, b) => a.y < b.y ? -1 : 1)[0]
  } else if (direction === 'up') {
    return pane.grid.panes
      .filter(p => p.id !== pane.id)
      .filter(p => occupySameHorizontalSpace(pane, p))
      .filter(p => p.y < pane.y)
      .reduce((closest, p) => closestAt(closest, p, direction), [])
      .sort((a, b) => a.x < b.x ? -1 : 1)[0]
  } else if (direction === 'down') {
    return pane.grid.panes
      .filter(p => p.id !== pane.id)
      .filter(p => occupySameHorizontalSpace(pane, p))
      .filter(p => p.y >= pane.y + pane.height)
      .reduce((closest, p) => closestAt(closest, p, direction), [])
      .sort((a, b) => a.x < b.x ? -1 : 1)[0]
  }
}

module.exports = function windowSwitcher (state) {
  return {
    switchWindow: function switchWindow (direction) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      const adjacentPane = findAdjacentPane(pane, direction)
      if (adjacentPane) adjacentPane.wrapped.focus()
    }
  }
}
