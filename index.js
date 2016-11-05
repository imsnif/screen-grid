'use strict'

const electron = require('electron')

const Grid = require('grid')

const windowCreator = require('./lib/window-creator')
const windowChanger = require('./lib/window-changer')
const windowMaxer = require('./lib/window-maxer')
const windowSplitter = require('./lib/window-splitter')
const windowSwitcher = require('./lib/window-switcher')
const gridInfo = require('./lib/grid-info')

function findAdjacentGrids (d, displays) {
  return Object.assign({}, ...displays.map(candidate => {
    if (candidate.bounds.x + candidate.bounds.width === d.bounds.x) {
      return {left: candidate}
    } else if (d.bounds.x + d.bounds.width === candidate.bounds.x) {
      return {right: candidate}
    } else if (d.bounds.y + d.bounds.height === candidate.bounds.y) {
      return {down: candidate}
    } else if (candidate.bounds.y + candidate.bounds.height === d.bounds.y) {
      return {up: candidate}
    } else {
      return false
    }
  }).filter(neighbour => neighbour))
}

module.exports = function screenGrid () {
  const screen = electron.screen
  const displays = screen.getAllDisplays()
  let state = {
    grids: displays.map(d => Object.assign(new Grid(
      d.workArea.width,
      d.workArea.height,
      {x: d.workArea.x, y: d.workArea.y}
    ), {id: d.id})),
    adjacentGrids: Object.assign(
      ...displays.map(d => ({ [d.id]: findAdjacentGrids(d, displays) }))
    )
  }
  return Object.assign(state,
    windowCreator(state),
    windowChanger(state),
    windowMaxer(state),
    windowSplitter(state),
    windowSwitcher(state),
    gridInfo(state)
  )
}
