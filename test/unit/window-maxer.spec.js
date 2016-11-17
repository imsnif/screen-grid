const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubWindowMaxer (pane) {
  return proxyquire('../../lib/window-maxer', {
    'electron': {BrowserWindow: { getFocusedWindow: () => ({id: 1}) }},
    './get-pane': () => pane
  })
}

function stubWindowMaxerNoFocusedPane (pane) {
  return proxyquire('../../lib/window-maxer', {
    'electron': {BrowserWindow: { getFocusedWindow: () => {} }},
    './get-pane': () => pane
  })
}

test('maxSize(direction): maxes size of focused pane', t => {
  t.plan(1)
  const pane = {maxSize: sinon.spy()}
  const grids = ['grid1', 'grid2']
  const { maxSize } = stubWindowMaxer(pane)({grids})
  maxSize('left')
  t.ok(
    pane.maxSize.calledWith({left: true}),
    'direction formatted and passed to maxSize of pane'
  )
})

test('maxSize(params): no op when there is no focused window', t => {
  t.plan(1)
  const pane = {maxSize: sinon.spy()}
  const grids = ['grid1', 'grid2']
  const { maxSize } = stubWindowMaxerNoFocusedPane(pane)({grids})
  const params = {param1: 1, param2: 2}
  maxSize(params)
  t.ok(pane.maxSize.notCalled, 'no op when no focused window')
})

test('maxLoc(direction): maxes location of focused pane', t => {
  t.plan(1)
  const pane = {maxOrSkipLoc: sinon.spy()}
  const grids = ['grid1', 'grid2']
  const { maxLoc } = stubWindowMaxer(pane)({grids})
  maxLoc('left')
  t.ok(
    pane.maxOrSkipLoc.calledWith({left: true}),
    'direction formatted and passed to maxOrSkipLoc'
  )
})

test('maxLoc(direction): no op when there is no focused window', t => {
  t.plan(1)
  const pane = {maxOrSkipLoc: sinon.spy()}
  const grids = ['grid1', 'grid2']
  const { maxLoc } = stubWindowMaxerNoFocusedPane(pane)({grids})
  maxLoc('left')
  t.ok(pane.maxOrSkipLoc.notCalled, 'no op when no focused window')
})
