const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubWindowSwitcher (pane, grid, findAdjacentPane) {
  return proxyquire('../../lib/window-switcher', {
    'electron': {BrowserWindow: { getFocusedWindow: () => ({id: 1}) }},
    './get-pane': () => pane,
    './get-grid': () => grid,
    './find-adjacent-pane': findAdjacentPane
  })
}

function stubWindowSwitcherNoFocusedWin (pane, grid, findAdjacentPane) {
  return proxyquire('../../lib/window-switcher', {
    'electron': {BrowserWindow: { getFocusedWindow: () => {} }},
    './get-pane': () => pane,
    './get-grid': () => grid,
    './find-adjacent-pane': findAdjacentPane
  })
}

test('switchWindow(direction): switches to window at direction', t => {
  t.plan(1)
  const pane = {id: 1}
  const grid = 'I am a grid'
  const focus = sinon.spy()
  const grids = [ grid ]
  const findAdjacentPane = (paneCandidate, direction) => {
    if (pane.id === 1 && direction === 'left') return {wrapped: {focus}}
    return {
      wrapped: {focus: () => {}}
    }
  }
  const { switchWindow } = stubWindowSwitcher(pane, grid, findAdjacentPane)({grids})
  switchWindow('left')
  t.ok(focus.calledOnce, 'focus method of proper pane wrapped window called')
})

test('switchWindow(direction): no-op when no focused window', t => {
  t.plan(1)
  const pane = {id: 1}
  const grid = 'I am a grid'
  const focus = sinon.spy()
  const grids = [ grid ]
  const findAdjacentPane = (paneCandidate, direction) => {
    return {wrapped: {focus}}
  }
  const { switchWindow } =
    stubWindowSwitcherNoFocusedWin(pane, grid, findAdjacentPane)({grids})
  switchWindow('left')
  t.ok(focus.notCalled, 'focus method of proper pane wrapped window not called')
})

test('switchWindow(direction): focus to pane at adjacent grid (left) if no adjacent pane', t => {
  t.plan(1)
  const direction = 'left'
  const pane = {id: 10, x: 0, y: 0, width: 10, height: 10}
  const gridOffset = {x: 100, y: 0}
  const adjacentGridOffset = {x: 0, y: 0}
  const grid = {id: 0, offset: gridOffset}
  const adjacentGrid = {id: 1, offset: adjacentGridOffset}
  const grids = [ grid, adjacentGrid ]
  const adjacentGrids = [{left: {id: 1}}]
  const focus = sinon.spy()
  const findAdjacentPane = sinon.stub()
  const paneAtAdjacentGrid = {id: 11, wrapped: {focus}}
  findAdjacentPane.withArgs(pane, direction).returns()
  findAdjacentPane.withArgs(
    Object.assign({}, pane, {x: pane.x + grid.offset.x}),
    direction,
    adjacentGrid
  ).returns(paneAtAdjacentGrid)
  const { switchWindow } =
    stubWindowSwitcher(pane, grid, findAdjacentPane)({grids, adjacentGrids})
  switchWindow(direction)
  t.ok(focus.calledOnce, 'focus method of pane at adjacent grid called')
})

test('switchWindow(direction): no-op when no adjacent grid at direction', t => {
  t.plan(1)
  const direction = 'left'
  const pane = {id: 10, x: 0, y: 0, width: 10, height: 10}
  const gridOffset = {x: 100, y: 0}
  const adjacentGridOffset = {x: 0, y: 0}
  const grid = {id: 0, offset: gridOffset}
  const adjacentGrid = {id: 1, offset: adjacentGridOffset}
  const grids = [ grid, adjacentGrid ]
  const adjacentGrids = [{right: {id: 1}}]
  const focus = sinon.spy()
  const findAdjacentPane = sinon.stub()
  const paneAtAdjacentGrid = {id: 11, wrapped: {focus}}
  findAdjacentPane.withArgs(pane, direction).returns()
  findAdjacentPane.withArgs(
    Object.assign({}, pane, {x: pane.x + grid.offset.x}),
    direction,
    adjacentGrid
  ).returns(paneAtAdjacentGrid)
  const { switchWindow } =
    stubWindowSwitcher(pane, grid, findAdjacentPane)({grids, adjacentGrids})
  switchWindow(direction)
  t.ok(focus.notCalled, 'focus method of pane in wrong direction not called')
})

test('switchWindow(direction): focus to pane at adjacent grid (right) if no adjacent pane', t => {
  t.plan(1)
  const direction = 'right'
  const pane = {id: 10, x: 0, y: 0, width: 10, height: 10}
  const gridOffset = {x: 0, y: 0}
  const adjacentGridOffset = {x: 100, y: 0}
  const grid = {id: 0, offset: gridOffset}
  const adjacentGrid = {id: 1, offset: adjacentGridOffset}
  const grids = [ grid, adjacentGrid ]
  const adjacentGrids = [{right: {id: 1}}]
  const focus = sinon.spy()
  const findAdjacentPane = sinon.stub()
  const paneAtAdjacentGrid = {id: 11, wrapped: {focus}}
  findAdjacentPane.withArgs(pane, direction).returns()
  findAdjacentPane.withArgs(
    Object.assign({}, pane, {x: pane.x - adjacentGrid.offset.x}),
    direction,
    adjacentGrid
  ).returns(paneAtAdjacentGrid)
  const { switchWindow } =
    stubWindowSwitcher(pane, grid, findAdjacentPane)({grids, adjacentGrids})
  switchWindow(direction)
  t.ok(focus.calledOnce, 'focus method of pane at adjacent grid called')
})

test('switchWindow(direction): focus to pane at adjacent grid (up) if no adjacent pane', t => {
  t.plan(1)
  const direction = 'up'
  const pane = {id: 10, x: 0, y: 0, width: 10, height: 10}
  const gridOffset = {x: 0, y: 100}
  const adjacentGridOffset = {x: 0, y: 0}
  const grid = {id: 0, offset: gridOffset}
  const adjacentGrid = {id: 1, offset: adjacentGridOffset}
  const grids = [ grid, adjacentGrid ]
  const adjacentGrids = [{up: {id: 1}}]
  const focus = sinon.spy()
  const findAdjacentPane = sinon.stub()
  const paneAtAdjacentGrid = {id: 11, wrapped: {focus}}
  findAdjacentPane.withArgs(pane, direction).returns()
  findAdjacentPane.withArgs(
    Object.assign({}, pane, {y: pane.y + grid.offset.y}),
    direction,
    adjacentGrid
  ).returns(paneAtAdjacentGrid)
  const { switchWindow } =
    stubWindowSwitcher(pane, grid, findAdjacentPane)({grids, adjacentGrids})
  switchWindow(direction)
  t.ok(focus.calledOnce, 'focus method of pane at adjacent grid called')
})

test('switchWindow(direction): focus to pane at adjacent grid (down) if no adjacent pane', t => {
  t.plan(1)
  const direction = 'down'
  const pane = {id: 10, x: 0, y: 0, width: 10, height: 10}
  const gridOffset = {x: 0, y: 0}
  const adjacentGridOffset = {x: 0, y: 100}
  const grid = {id: 0, offset: gridOffset}
  const adjacentGrid = {id: 1, offset: adjacentGridOffset}
  const grids = [ grid, adjacentGrid ]
  const adjacentGrids = [{down: {id: 1}}]
  const focus = sinon.spy()
  const findAdjacentPane = sinon.stub()
  const paneAtAdjacentGrid = {id: 11, wrapped: {focus}}
  findAdjacentPane.withArgs(pane, direction).returns()
  findAdjacentPane.withArgs(
    Object.assign({}, pane, {y: pane.y - adjacentGrid.offset.y}),
    direction,
    adjacentGrid
  ).returns(paneAtAdjacentGrid)
  const { switchWindow } =
    stubWindowSwitcher(pane, grid, findAdjacentPane)({grids, adjacentGrids})
  switchWindow(direction)
  t.ok(focus.calledOnce, 'focus method of pane at adjacent grid called')
})

test('switchWindowContents(direction): switches between panes at direction', t => {
  t.plan(1)
  const direction = 'left'
  const switchPanes = sinon.spy()
  const grid = {switchPanes}
  const pane = {id: 1, grid}
  const grids = [ grid ]
  const findAdjacentPane = sinon.stub()
  const adjacentPane = {id: 10}
  findAdjacentPane.withArgs(pane, direction).returns(adjacentPane)
  const { switchWindowContents } = stubWindowSwitcher(pane, grid, findAdjacentPane)({grids})
  switchWindowContents(direction)
  t.ok(
    switchPanes.calledWith(pane.id, adjacentPane.id),
    'switchPanes of grid called with proper args'
  )
})

test('switchWindowContents(direction): no op if no focused window', t => {
  t.plan(1)
  const direction = 'left'
  const switchPanes = sinon.spy()
  const grid = {switchPanes}
  const pane = {id: 1, grid}
  const grids = [ grid ]
  const findAdjacentPane = sinon.stub()
  const adjacentPane = {id: 10}
  findAdjacentPane.withArgs(pane, direction).returns(adjacentPane)
  const { switchWindowContents } =
    stubWindowSwitcherNoFocusedWin(pane, grid, findAdjacentPane)({grids})
  switchWindowContents(direction)
  t.ok(
    switchPanes.notCalled,
    'no-op when no focused window'
  )
})

test('switchWindowContents(direction): no op if no adjacent pane', t => {
  t.plan(1)
  const direction = 'left'
  const switchPanes = sinon.spy()
  const grid = {switchPanes}
  const pane = {id: 1, grid}
  const grids = [ grid ]
  const findAdjacentPane = sinon.stub()
  findAdjacentPane.withArgs(pane, direction).returns()
  const { switchWindowContents } = stubWindowSwitcher(pane, grid, findAdjacentPane)({grids})
  switchWindowContents(direction)
  t.ok(
    switchPanes.notCalled,
    'no-op when no adjacent pane'
  )
})
