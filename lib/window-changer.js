'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const getPane = require('./get-pane')

function directionToRelation (direction, amount) {
  if (direction === 'left') return {x: `${-amount}`}
  if (direction === 'right') return {x: amount}
  if (direction === 'up') return {y: `-${amount}`}
  if (direction === 'down') return {y: amount}
}

module.exports = function windowChanger (state) {
  return {
    changeCurWindow: function changeCurWindow (direction, amount) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      const {x, y} = directionToRelation(direction, amount)
      const changeParams = [
        x ? pane.x + parseInt(x) : pane.x,
        y ? pane.y + parseInt(y) : pane.y
      ]
      try {
        pane.changeOrMaxLocation(...changeParams)
      } catch (e) {
        try {
          pane.squashIntoLocation(...changeParams)
        } catch (e) {
          // no-op
        }
      }
    },
    increaseAndFillCurWinSize: function increaseAndFillCurWinSize (
      direction,
      amount,
      winConstructor,
      opts,
      displayId
    ) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      try {
        pane.increaseAndFillSize(direction, amount)
        pane.grid.maxAllPanes()
        const gaps = pane.grid.findGaps()
        if (gaps.length > 0) {
          gaps.forEach(g => state.createWindow(
            displayId,
            winConstructor,
            Object.assign({}, opts, g)
          ))
        }
      } catch (e) {
        // no-op
      }
    },
    decreaseAndFillCurWinSize: function decreaseAndFillCurWinSize (
      direction,
      amount,
      winConstructor,
      opts,
      displayId
    ) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      try {
        pane.decreaseSizeDirectional(direction, amount)
        pane.grid.maxAllPanes()
        const gaps = pane.grid.findGaps()
        if (gaps.length > 0) {
          gaps.forEach(g => state.createWindow(
            displayId,
            winConstructor,
            Object.assign({}, opts, g)
          ))
        }
      } catch (e) {
        // no-op
      }
    },
    decreaseCurWinSize: function decreaseCurWinSize (direction, amount) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      try {
        pane.decreaseSizeDirectional(direction, amount)
      } catch (e) {
        console.error(e)
        // TODO: some visual indication (flash border red?)
      }
    },
    increaseCurWinSize: function decreaseCurWinSize (direction, amount) {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      try {
        pane.increaseSizeDirectional(direction, amount)
      } catch (e) {
        console.error(e)
        // TODO: some visual indication (flash border red?)
      }
    },
    toggleCurrentWinFullSize: function toggleCurrentWinFullSize () {
      // TODO: tidy up
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only change focused window
      const pane = getPane(state.grids, focusedWindow.id)
      const currentBounds = {x: pane.x + pane.grid.offset.x, y: pane.y + pane.grid.offset.y, width: pane.width, height: pane.height}
      const implementationBounds = pane.wrapped.getBounds()
      if (
        currentBounds.x === implementationBounds.x &&
        currentBounds.y === implementationBounds.y &&
        currentBounds.width === implementationBounds.width &&
        currentBounds.height === implementationBounds.height
      ) {
        pane.wrapped.setBounds({width: pane.grid.width, height: pane.grid.height, x: pane.grid.offset.x, y: pane.grid.offset.y})
        pane.wrapped.on('blur', () => {
          // TODO: find a better place for this listener
          const neighborHasFocus = pane.grid.panes.some(p => p.wrapped.isFocused())
          const currentBounds = {x: pane.x + pane.grid.offset.x, y: pane.y + pane.grid.offset.y, width: pane.width, height: pane.height}
          if (neighborHasFocus) pane.wrapped.setBounds(currentBounds)
        })
      } else {
        pane.wrapped.setBounds(currentBounds)
      }
    }
  }
}
