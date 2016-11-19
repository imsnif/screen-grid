const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubWindowSplitter (pane) {
  return proxyquire('../../lib/window-splitter', {
    'electron': {BrowserWindow: { getFocusedWindow: () => ({id: 1}) }},
    './get-pane': () => pane
  })
}

function stubWindowSplitterNoFocusedWin (pane) {
  return proxyquire('../../lib/window-splitter', {
    'electron': {BrowserWindow: { getFocusedWindow: () => {} }},
    './get-pane': () => pane
  })
}

test('splitWindow(screenId, winConstructor, winParams, axis, winId): ' +
     'splits current window (horizontally)', t => {
  t.plan(2)
  const changeSize = sinon.spy()
  const createWindow = sinon.spy()
  const pane = {id: 1, x: 0, y: 0, height: 100, width: 100, changeSize}
  const grid = 'I am a grid'
  const grids = [ grid ]
  const { splitWindow } = stubWindowSplitter(pane)({grids, createWindow})
  splitWindow(
    1,
    {fakeWinConstructor: 'fakeWinConstructor'},
    {fakeWinParams: 'fakeWinParams'},
    'horizontal',
    1
  )
  t.ok(changeSize.calledWith(100, 50), 'window resized to half size horizontally')
  t.ok(createWindow.calledWith(1, {fakeWinConstructor: 'fakeWinConstructor'}, {
    fakeWinParams: 'fakeWinParams',
    width: 100,
    height: 50,
    x: 0,
    y: 50
  }), 'new window created half the size of previous')
})

test('splitWindow(screenId, winConstructor, winParams, axis, winId): ' +
     'splits current window (vertically)', t => {
  t.plan(2)
  const changeSize = sinon.spy()
  const createWindow = sinon.spy()
  const pane = {id: 1, x: 0, y: 0, height: 100, width: 100, changeSize}
  const grid = 'I am a grid'
  const grids = [ grid ]
  const { splitWindow } = stubWindowSplitter(pane)({grids, createWindow})
  splitWindow(
    1,
    {fakeWinConstructor: 'fakeWinConstructor'},
    {fakeWinParams: 'fakeWinParams'},
    'vertical',
    1
  )
  t.ok(changeSize.calledWith(50, 100), 'window resized to half size vertically')
  t.ok(createWindow.calledWith(1, {fakeWinConstructor: 'fakeWinConstructor'}, {
    fakeWinParams: 'fakeWinParams',
    width: 50,
    height: 100,
    x: 50,
    y: 0
  }), 'new window created half the size of previous')
})

test('splitWindow(screenId, winConstructor, winParams, axis, winId): ' +
     'does not split window if cannot find pane', t => {
  t.plan(2)
  const changeSize = sinon.spy()
  const createWindow = sinon.spy()
  const pane = null
  const grid = 'I am a grid'
  const grids = [ grid ]
  const { splitWindow } = stubWindowSplitter(pane)({grids, createWindow})
  splitWindow(
    1,
    {fakeWinConstructor: 'fakeWinConstructor'},
    {fakeWinParams: 'fakeWinParams'},
    'vertical',
    1
  )
  t.ok(changeSize.notCalled, 'no-op')
  t.ok(createWindow.notCalled, 'no-op')
})

test('splitCurrentWindow(screenId, winConstructor, winParams, axis): ' +
     'calls splitWindow with id of focused window', t => {
  t.plan(1)
  const splitWindow = sinon.spy()
  const isInGrid = sinon.stub().returns(true)
  const pane = {id: 1, x: 0, y: 0, height: 100, width: 100}
  const grid = 'I am a grid'
  const grids = [ grid ]
  const { splitCurrentWindow } = stubWindowSplitter(pane)({grids, splitWindow, isInGrid})
  splitCurrentWindow(
    1,
    {fakeWinConstructor: 'fakeWinConstructor'},
    {fakeWinParams: 'fakeWinParams'},
    'horizontal'
  )
  t.ok(splitWindow.calledWith(
    1,
    {fakeWinConstructor: 'fakeWinConstructor'},
    {fakeWinParams: 'fakeWinParams'},
    'horizontal', 1),
    'splitWindow called with focused window id'
  )
})

test('splitCurrentWindow(screenId, winConstructor, winParams, axis): ' +
     'does not call splitWindow if current pane is not in desired grid', t => {
  t.plan(1)
  const splitWindow = sinon.spy()
  const isInGrid = sinon.stub().returns(false)
  const pane = {id: 1, x: 0, y: 0, height: 100, width: 100}
  const grid = 'I am a grid'
  const grids = [ grid ]
  const { splitCurrentWindow } = stubWindowSplitter(pane)({grids, splitWindow, isInGrid})
  splitCurrentWindow(
    1,
    {fakeWinConstructor: 'fakeWinConstructor'},
    {fakeWinParams: 'fakeWinParams'},
    'horizontal'
  )
  t.ok(splitWindow.notCalled, 'no-op')
})

test('splitCurrentWindow(screenId, winConstructor, winParams, axis): ' +
     'no-op when no focused window', t => {
  t.plan(2)
  const changeSize = sinon.spy()
  const createWindow = sinon.spy()
  const pane = {id: 1, x: 0, y: 0, height: 100, width: 100, changeSize}
  const grid = 'I am a grid'
  const grids = [ grid ]
  const { splitCurrentWindow } =
    stubWindowSplitterNoFocusedWin(pane)({grids, createWindow})
  splitCurrentWindow(
    1,
    {fakeWinConstructor: 'fakeWinConstructor'},
    {fakeWinParams: 'fakeWinParams'},
    'vertical'
  )
  t.ok(changeSize.notCalled, 'window size unchanged')
  t.ok(createWindow.notCalled, 'new window not created')
})
