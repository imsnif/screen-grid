const test = require('tape')
const proxyquire = require('proxyquire')

function stubGetGrid () {
  return proxyquire('../../lib/get-grid', {
    'electron': { BrowserWindow: {getFocusedWindow: () => ({id: 3})} }
  })
}

function stubGetGridNoFocusedWindow () {
  return proxyquire('../../lib/get-grid', {
    'electron': { BrowserWindow: {getFocusedWindow: () => null} }
  })
}

test('getGrid(grids, winId): returns grid containing pane with winId', t => {
  t.plan(1)
  const getGrid = stubGetGrid()
  const grids = [
    {panes: [ {wrapped: {id: 1}}, {wrapped: {id: 2}} ]},
    {panes: [ {wrapped: {id: 3}}, {wrapped: {id: 4}} ]}
  ]
  t.deepEquals(getGrid(grids, 1), grids[0], 'grid containing pane with id returned')
})

test('getGrid(grids): uses id of focused window if no id is provided', t => {
  t.plan(1)
  const getGrid = stubGetGrid()
  const grids = [
    {panes: [ {wrapped: {id: 1}}, {wrapped: {id: 2}} ]},
    {panes: [ {wrapped: {id: 3}}, {wrapped: {id: 4}} ]}
  ]
  t.deepEquals(getGrid(grids), grids[1], 'grid containing pane with focused win id returned')
})

test('getGrid(grids): returns false if no id and no focused window', t => {
  t.plan(1)
  const getGrid = stubGetGridNoFocusedWindow()
  const grids = [
    {panes: [ {wrapped: {id: 1}}, {wrapped: {id: 2}} ]},
    {panes: [ {wrapped: {id: 3}}, {wrapped: {id: 4}} ]}
  ]
  t.equals(getGrid(grids), false, 'no grid returned')
})
