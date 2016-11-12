const test = require('tape')
const proxyquire = require('proxyquire')

function stubGridInfo () {
  return proxyquire('../../lib/grid-info', {
    'electron': { BrowserWindow: {getFocusedWindow: () => ({id: 3})} },
    './get-pane': (grids, id) => id === 3 ? {x: 0, y: 0, width: 10, height: 10} : false
  })
}

function stubGridInfoNoFocusedWindow () {
  return proxyquire('../../lib/grid-info', {
    'electron': { BrowserWindow: {getFocusedWindow: () => null} }
  })
}

test('currentPanePosition(): returns pane position of focused window', t => {
  t.plan(1)
  const grids = [
    {panes: [ {wrapped: {id: 1}}, {wrapped: {id: 2}} ]},
    {panes: [ {wrapped: {id: 3}}, {wrapped: {id: 4}} ]}
  ]
  const { currentPanePosition } = stubGridInfo()({grids})
  t.deepEquals(
    currentPanePosition(),
    {x: 0, y: 0, width: 10, height: 10},
    'grid containing pane with id returned'
  )
})

test('currentPanePosition(): returns false if no focused window', t => {
  t.plan(1)
  const grids = [
    {panes: [ {wrapped: {id: 1}}, {wrapped: {id: 2}} ]},
    {panes: [ {wrapped: {id: 3}}, {wrapped: {id: 4}} ]}
  ]
  const { currentPanePosition } = stubGridInfoNoFocusedWindow()({grids})
  t.deepEquals(
    currentPanePosition(),
    false,
    'returns false when there is no focused window'
  )
})
