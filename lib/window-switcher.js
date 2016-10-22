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

function findAdjacentPane (pane, direction) {
  if (direction === 'right') {
    return pane.grid.panes
      .filter(p => p.id !== pane.id)
      .filter(p => occupySameVerticalSpace(pane, p))
      .filter(p => p.x >= pane.x + pane.width)
      .sort((a, b) => a.x < b.x ? -1 : 1)[0]
  } else if (direction === 'left') {
    return pane.grid.panes
      .filter(p => p.id !== pane.id)
      .filter(p => occupySameVerticalSpace(pane, p))
      .filter(p => p.x < pane.x)
      .sort((a, b) => a.x > b.x ? -1 : 1)[0]
  } else if (direction === 'up') {
    return pane.grid.panes
      .filter(p => p.id !== pane.id)
      .filter(p => occupySameHorizontalSpace(pane, p))
      .filter(p => p.y < pane.y)
      .sort((a, b) => a.y > b.y ? -1 : 1)[0]
  } else if (direction === 'down') {
    return pane.grid.panes
      .filter(p => p.id !== pane.id)
      .filter(p => occupySameHorizontalSpace(pane, p))
      .filter(p => p.y >= pane.y + pane.height)
      .sort((a, b) => a.y < b.y ? -1 : 1)[0]
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
