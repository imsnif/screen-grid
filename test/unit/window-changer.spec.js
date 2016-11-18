const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubWindowChanger (pane) {
  return proxyquire('../../lib/window-changer', {
    'electron': {BrowserWindow: { getFocusedWindow: () => ({id: 1}) }},
    './get-pane': () => pane
  })
}

function stubWindowChangerNoFocusedWin (pane) {
  return proxyquire('../../lib/window-changer', {
    'electron': {BrowserWindow: { getFocusedWindow: () => {} }},
    './get-pane': () => pane
  })
}

test('changeCurWindow(direction, amount): changesOrMaxes location of pane left', t => {
  t.plan(1)
  const changeOrMaxLocation = sinon.spy()
  const pane = {id: 1, changeOrMaxLocation, x: 0, y: 0, width: 100, height: 100}
  const { changeCurWindow } = stubWindowChanger(pane)({})
  changeCurWindow('left', 30)
  t.ok(
    changeOrMaxLocation.calledWith(-30, 0),
    'pane location change called with proper params'
  )
})

test('changeCurWindow(direction, amount): changesOrMaxes location of pane right', t => {
  t.plan(1)
  const changeOrMaxLocation = sinon.spy()
  const pane = {id: 1, changeOrMaxLocation, x: 0, y: 0, width: 100, height: 100}
  const { changeCurWindow } = stubWindowChanger(pane)({})
  changeCurWindow('right', 30)
  t.ok(
    changeOrMaxLocation.calledWith(30, 0),
    'pane location change called with proper params'
  )
})

test('changeCurWindow(direction, amount): changesOrMaxes location of pane up', t => {
  t.plan(1)
  const changeOrMaxLocation = sinon.spy()
  const pane = {id: 1, changeOrMaxLocation, x: 0, y: 0, width: 100, height: 100}
  const { changeCurWindow } = stubWindowChanger(pane)({})
  changeCurWindow('up', 30)
  t.ok(
    changeOrMaxLocation.calledWith(0, -30),
    'pane location change called with proper params'
  )
})

test('changeCurWindow(direction, amount): changesOrMaxes location of pane down', t => {
  t.plan(1)
  const changeOrMaxLocation = sinon.spy()
  const pane = {id: 1, changeOrMaxLocation, x: 0, y: 0, width: 100, height: 100}
  const { changeCurWindow } = stubWindowChanger(pane)({})
  changeCurWindow('down', 30)
  t.ok(
    changeOrMaxLocation.calledWith(0, 30),
    'pane location change called with proper params'
  )
})

test('changeCurWindow(direction, amount): no-op if no focused window', t => {
  t.plan(1)
  const changeOrMaxLocation = sinon.spy()
  const pane = {id: 1, changeOrMaxLocation, x: 0, y: 0, width: 100, height: 100}
  const { changeCurWindow } = stubWindowChangerNoFocusedWin(pane)({})
  changeCurWindow('left', 30)
  t.ok(
    changeOrMaxLocation.notCalled,
    'no-op when no focused window'
  )
})

test('changeCurWindow(direction, amount): ' +
     'attempts to squash into location if failed to changeOrMax', t => {
  t.plan(1)
  const changeOrMaxLocation = sinon.stub().throws()
  const squashIntoLocation = sinon.spy()
  const pane = {
    id: 1,
    changeOrMaxLocation,
    squashIntoLocation,
    x: 0,
    y: 0,
    width: 100,
    height: 100
  }
  const { changeCurWindow } = stubWindowChanger(pane)({})
  changeCurWindow('left', 30)
  t.ok(
    squashIntoLocation.calledWith(-30, 0),
    'squashIntoLocation called with proper args'
  )
})

test('changeCurWindow(direction, amount): ' +
     'no-op if failed to changeOrMax or squash', t => {
  t.plan(1)
  const changeOrMaxLocation = sinon.stub().throws()
  const squashIntoLocation = sinon.stub().throws()
  const pane = {
    id: 1,
    changeOrMaxLocation,
    squashIntoLocation,
    x: 0,
    y: 0,
    width: 100,
    height: 100
  }
  const { changeCurWindow } = stubWindowChanger(pane)({})
  changeCurWindow('left', 30)
  t.pass('no-op')
})

test('increaseAndFillCurWinSize(direction, amount): increases size and fills gtid', t => {
  t.plan(4)
  const increaseAndFillSize = sinon.spy()
  const maxAllPanes = sinon.spy()
  const findGaps = () => [
    {x: 0, y: 0, width: 100, height: 100},
    {x: 100, y: 0, width: 100, height: 100}
  ]
  const grid = {findGaps, maxAllPanes}
  const pane = {id: 1, increaseAndFillSize, grid, wrapped: {constructor: 1}}
  const createWindow = sinon.spy()
  const { increaseAndFillCurWinSize } = stubWindowChanger(pane)({createWindow})
  increaseAndFillCurWinSize('left', 30)
  t.ok(
    increaseAndFillSize.calledWith('left', 30),
    'pane increaseandFillSize method called with proper params'
  )
  t.ok(
    maxAllPanes.calledOnce,
    'maxAllPanes called once'
  )
  t.ok(createWindow.calledWith(0, 1,
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      frame: false,
      skipTaskbar: true,
      fillOnClose: true
    }
  ), 'first window created in first gap with proper params')
  t.ok(createWindow.calledWith(0, 1,
    {
      x: 100,
      y: 0,
      width: 100,
      height: 100,
      frame: false,
      skipTaskbar: true,
      fillOnClose: true
    }
  ), 'second window created in second gap with proper params')
})

test('increaseAndFillCurWinSize(direction, amount): ' +
     'does not fill grid if failed to increase pane size', t => {
  t.plan(2)
  const increaseAndFillSize = sinon.stub().throws()
  const maxAllPanes = sinon.spy()
  const findGaps = () => [
    {x: 0, y: 0, width: 100, height: 100},
    {x: 100, y: 0, width: 100, height: 100}
  ]
  const grid = {findGaps, maxAllPanes}
  const pane = {id: 1, increaseAndFillSize, grid, wrapped: {constructor: 1}}
  const createWindow = sinon.spy()
  const { increaseAndFillCurWinSize } = stubWindowChanger(pane)({createWindow})
  increaseAndFillCurWinSize('left', 30)
  t.ok(maxAllPanes.notCalled, 'maxAllPanes not called')
  t.ok(createWindow.notCalled, 'createWindow not called')
})

test('increaseAndFillCurWinSize(direction, amount): ' +
     'does not create new windows if no gaps are found', t => {
  t.plan(1)
  const increaseAndFillSize = sinon.spy()
  const maxAllPanes = sinon.spy()
  const findGaps = () => []
  const grid = {findGaps, maxAllPanes}
  const pane = {id: 1, increaseAndFillSize, grid, wrapped: {constructor: 1}}
  const createWindow = sinon.spy()
  const { increaseAndFillCurWinSize } = stubWindowChanger(pane)({createWindow})
  increaseAndFillCurWinSize('left', 30)
  t.ok(createWindow.notCalled, 'no new windows created')
})
