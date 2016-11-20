const test = require('tape')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

function stubGridInfo (findAdjacentPane, pane, grid) {
  return proxyquire('../../lib/grid-info', {
    'electron': { BrowserWindow: {getFocusedWindow: () => ({id: 3})} },
    './get-pane': pane ? () => pane : (grids, id) => id === 3 ? {x: 0, y: 0, width: 10, height: 10} : false,
    './get-grid': () => grid,
    './find-adjacent-pane': findAdjacentPane
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
  const { currentPanePosition } = stubGridInfo(() => {})({grids})
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

test('isInGrid(winId, screenId): returns true if pane id is in grid on screenId', t => {
  t.plan(1)
  const grids = [
    {id: 1, panes: [ {id: 1}, {id: 2} ]},
    {id: 2, panes: [ {id: 3}, {id: 4} ]}
  ]
  const { isInGrid } = stubGridInfoNoFocusedWindow()({grids})
  t.ok(isInGrid(1, 1), 'returns true if pane is in grid')
})

test('isInGrid(winId, screenId): returns false if pane id is not in grid on screenId', t => {
  t.plan(1)
  const grids = [
    {id: 1, panes: [ {id: 1}, {id: 2} ]},
    {id: 2, panes: [ {id: 3}, {id: 4} ]}
  ]
  const { isInGrid } = stubGridInfoNoFocusedWindow()({grids})
  t.notOk(isInGrid(1, 2), 'returns false if pane is not in grid')
})

test('adjacentPaneInGrid(direction): returns adjacent pane in direction', t => {
  t.plan(1)
  const grids = [
    {id: 1, panes: [ {id: 1}, {id: 2} ]},
    {id: 2, panes: [ {id: 3}, {id: 4} ]}
  ]
  const findAdjacentPane = () => ({id: 5})
  const { adjacentPaneInGrid } = stubGridInfo(findAdjacentPane)({grids})
  t.deepEquals(adjacentPaneInGrid('left'), {id: 5}, 'returned adjacent pane to the left')
})

test('adjacentPaneInGrid(direction): no-op if no focused window', t => {
  t.plan(1)
  const grids = [
    {id: 1, panes: [ {id: 1}, {id: 2} ]},
    {id: 2, panes: [ {id: 3}, {id: 4} ]}
  ]
  const findAdjacentPane = () => ({id: 5})
  const { adjacentPaneInGrid } = stubGridInfoNoFocusedWindow(findAdjacentPane)({grids})
  t.equals(adjacentPaneInGrid('left'), undefined, 'returned undefined')
})

test('adjacentPaneInGrid(direction): no-op if no adjacent pane', t => {
  t.plan(1)
  const grids = [
    {id: 1, panes: [ {id: 1}, {id: 2} ]},
    {id: 2, panes: [ {id: 3}, {id: 4} ]}
  ]
  const findAdjacentPane = () => {}
  const { adjacentPaneInGrid } = stubGridInfo(findAdjacentPane)({grids})
  t.equals(adjacentPaneInGrid('left'), undefined, 'returned undefined')
})

test('adjacentPane(direction): returns adjacent pane in current grid at direction if exists', t => {
  t.plan(1)
  const grids = [
    {id: 1, panes: [ {id: 1}, {id: 2} ]},
    {id: 2, panes: [ {id: 3}, {id: 4} ]}
  ]
  const findAdjacentPane = () => ({id: 5})
  const { adjacentPane } = stubGridInfo(findAdjacentPane)({grids})
  t.deepEquals(adjacentPane('left'), {id: 5}, 'returned adjacent pane to the left')
})

test('adjacentPane(direction): no-op if no focused window', t => {
  t.plan(1)
  const grids = [
    {id: 1, panes: [ {id: 1}, {id: 2} ]},
    {id: 2, panes: [ {id: 3}, {id: 4} ]}
  ]
  const findAdjacentPane = () => ({id: 5})
  const { adjacentPane } = stubGridInfoNoFocusedWindow(findAdjacentPane)({grids})
  t.equals(adjacentPane('left'), undefined, 'returned undefined')
})

test('adjacentPane(direction): returns pane at adjacent grid if no adjacent pane', t => {
  t.plan(1)
  const direction = 'left'
  const pane = {id: 10, x: 0, y: 0, width: 10, height: 10}
  const gridOffset = {x: 100, y: 0}
  const adjacentGridOffset = {x: 0, y: 0}
  const grid = {id: 0, offset: gridOffset}
  const adjacentGrid = {id: 1, offset: adjacentGridOffset}
  const grids = [ grid, adjacentGrid ]
  const adjacentGrids = [{left: {id: 1}}]
  const findAdjacentPane = sinon.stub()
  const paneAtAdjacentGrid = {id: 11, wrapped: {}}
  findAdjacentPane.withArgs(pane, direction).returns()
  findAdjacentPane.withArgs(
    Object.assign({}, pane, {x: pane.x + grid.offset.x}),
    direction,
    adjacentGrid
  ).returns(paneAtAdjacentGrid)
  const { adjacentPane } =
    stubGridInfo(findAdjacentPane, pane, grid)({grids, adjacentGrids})
  t.equals(adjacentPane(direction), paneAtAdjacentGrid, 'pane at adjacent grid returned')
})

test('adjacentPane(direction): returns undefined if no pane at direction in grid or outside of it', t => {
  t.plan(1)
  const direction = 'left'
  const pane = {id: 10, x: 0, y: 0, width: 10, height: 10}
  const gridOffset = {x: 100, y: 0}
  const adjacentGridOffset = {x: 0, y: 0}
  const grid = {id: 0, offset: gridOffset}
  const adjacentGrid = {id: 1, offset: adjacentGridOffset}
  const grids = [ grid, adjacentGrid ]
  const adjacentGrids = [{left: {id: 1}}]
  const findAdjacentPane = sinon.stub().returns()
  const { adjacentPane } =
    stubGridInfo(findAdjacentPane, pane, grid)({grids, adjacentGrids})
  t.equals(adjacentPane(direction), undefined, 'returned undefined')
})

test('adjacentPane(direction): returns undefined if no grid at direction', t => {
  t.plan(1)
  const direction = 'left'
  const pane = {id: 10, x: 0, y: 0, width: 10, height: 10}
  const gridOffset = {x: 100, y: 0}
  const adjacentGridOffset = {x: 0, y: 0}
  const grid = {id: 0, offset: gridOffset}
  const adjacentGrid = {id: 1, offset: adjacentGridOffset}
  const grids = [ grid, adjacentGrid ]
  const adjacentGrids = [{right: {id: 1}}]
  const findAdjacentPane = sinon.stub().returns()
  const { adjacentPane } =
    stubGridInfo(findAdjacentPane, pane, grid)({grids, adjacentGrids})
  t.equals(adjacentPane(direction), undefined, 'returned undefined')
})
