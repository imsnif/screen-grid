'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const TerminalWindow = require('electron-terminal-window')

const Grid = require('grid')

const windowCreator = require('./lib/window-creator')
const windowChanger = require('./lib/window-changer')
const windowMaxer = require('./lib/window-maxer')

module.exports = function screenGrid () {
  const screen = electron.screen
  const displays = screen.getAllDisplays()
  let state = {
    grids: displays.map(d => new Grid(
      d.workArea.width,
      d.workArea.height,
      {x: d.workArea.x, y: d.workArea.y}
    ))
  }
  return Object.assign(state,
    windowCreator(state),
    windowChanger(state),
    windowMaxer(state)
  )
}
