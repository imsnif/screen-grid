const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const EventEmitter = require('events')

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

test('increaseAndFillCurWinSize(direction, amount, winConstructor, opts, displayId): ' +
     'increases size and fills grid', t => {
  t.plan(4)
  const increaseAndFillSize = sinon.spy()
  const maxAllPanes = sinon.spy()
  const findGaps = () => [
    {x: 0, y: 0, width: 100, height: 100},
    {x: 100, y: 0, width: 100, height: 100}
  ]
  const grid = {findGaps, maxAllPanes}
  const pane = {id: 1, increaseAndFillSize, grid, wrapped: {constructor: 1}}
  const listeners = 'listeners'
  const createWindow = sinon.spy()
  const { increaseAndFillCurWinSize } = stubWindowChanger(pane)({createWindow})
  increaseAndFillCurWinSize('left', 30, 'winConstructor', {a: 1, b: 2}, 1, listeners)
  t.ok(
    increaseAndFillSize.calledWith('left', 30),
    'pane increaseandFillSize method called with proper params'
  )
  t.ok(
    maxAllPanes.calledOnce,
    'maxAllPanes called once'
  )
  t.ok(createWindow.calledWith(1, 'winConstructor',
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      a: 1,
      b: 2
    },
    listeners
  ), 'first window created in first gap with proper params')
  t.ok(createWindow.calledWith(1, 'winConstructor',
    {
      x: 100,
      y: 0,
      width: 100,
      height: 100,
      a: 1,
      b: 2
    }
  ), 'second window created in second gap with proper params')
})

test('increaseAndFillCurWinSize(direction, amount, winConstructor, opts, displayId): ' +
     'no-op if no focused window', t => {
  t.plan(3)
  const increaseAndFillSize = sinon.spy()
  const maxAllPanes = sinon.spy()
  const findGaps = () => [
    {x: 0, y: 0, width: 100, height: 100},
    {x: 100, y: 0, width: 100, height: 100}
  ]
  const grid = {findGaps, maxAllPanes}
  const pane = {id: 1, increaseAndFillSize, grid, wrapped: {constructor: 1}}
  const createWindow = sinon.spy()
  const { increaseAndFillCurWinSize } = stubWindowChangerNoFocusedWin(pane)({createWindow})
  increaseAndFillCurWinSize('left', 30, 'winConstructor', {a: 1, b: 2}, 1)
  t.ok(increaseAndFillSize.notCalled, 'pane increaseandFillSize not called')
  t.ok(maxAllPanes.notCalled, 'maxAllPanes not called')
  t.ok(createWindow.notCalled, 'createWindow not called')
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

test('decreaseAndFillCurWinSize(direction, amount, winConstructor, opts, displayId): ' +
     'decreases size and fills gtid', t => {
  t.plan(4)
  const decreaseSizeDirectional = sinon.spy()
  const maxAllPanes = sinon.spy()
  const findGaps = () => [
    {x: 0, y: 0, width: 100, height: 100},
    {x: 100, y: 0, width: 100, height: 100}
  ]
  const grid = {findGaps, maxAllPanes}
  const listeners = 'listeners'
  const pane = {id: 1, decreaseSizeDirectional, grid, wrapped: {constructor: 1}}
  const createWindow = sinon.spy()
  const { decreaseAndFillCurWinSize } = stubWindowChanger(pane)({createWindow})
  decreaseAndFillCurWinSize('left', 30, 'winConstructor', {a: 1, b: 2}, 1, listeners)
  t.ok(
    decreaseSizeDirectional.calledWith('left', 30),
    'pane decreaseandFillSize method called with proper params'
  )
  t.ok(
    maxAllPanes.calledOnce,
    'maxAllPanes called once'
  )
  t.ok(createWindow.calledWith(1, 'winConstructor',
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      a: 1,
      b: 2
    },
    listeners
  ), 'first window created in first gap with proper params')
  t.ok(createWindow.calledWith(1, 'winConstructor',
    {
      x: 100,
      y: 0,
      width: 100,
      height: 100,
      a: 1,
      b: 2
    },
    listeners
  ), 'second window created in second gap with proper params')
})

test('decreaseAndFillCurWinSize(direction, amount, winConstructor, opts, displayId): ' +
     'no-op if no focused window', t => {
  t.plan(3)
  const decreaseSizeDirectional = sinon.spy()
  const maxAllPanes = sinon.spy()
  const findGaps = () => [
    {x: 0, y: 0, width: 100, height: 100},
    {x: 100, y: 0, width: 100, height: 100}
  ]
  const grid = {findGaps, maxAllPanes}
  const pane = {id: 1, decreaseSizeDirectional, grid, wrapped: {constructor: 1}}
  const createWindow = sinon.spy()
  const { decreaseAndFillCurWinSize } = stubWindowChangerNoFocusedWin(pane)({createWindow})
  decreaseAndFillCurWinSize('left', 30, 'winConstructor', {a: 1, b: 2}, 1)
  t.ok(decreaseSizeDirectional.notCalled, 'pane increaseandFillSize not called')
  t.ok(maxAllPanes.notCalled, 'maxAllPanes not called')
  t.ok(createWindow.notCalled, 'createWindow not called')
})

test('decreaseAndFillCurWinSize(direction, amount): ' +
     'does not fill grid if failed to decrease pane size', t => {
  t.plan(2)
  const decreaseAndFillSize = sinon.stub().throws()
  const maxAllPanes = sinon.spy()
  const findGaps = () => [
    {x: 0, y: 0, width: 100, height: 100},
    {x: 100, y: 0, width: 100, height: 100}
  ]
  const grid = {findGaps, maxAllPanes}
  const pane = {id: 1, decreaseAndFillSize, grid, wrapped: {constructor: 1}}
  const createWindow = sinon.spy()
  const { decreaseAndFillCurWinSize } = stubWindowChanger(pane)({createWindow})
  decreaseAndFillCurWinSize('left', 30)
  t.ok(maxAllPanes.notCalled, 'maxAllPanes not called')
  t.ok(createWindow.notCalled, 'createWindow not called')
})

test('decreaseAndFillCurWinSize(direction, amount): ' +
     'does not create new windows if no gaps are found', t => {
  t.plan(1)
  const decreaseAndFillSize = sinon.spy()
  const maxAllPanes = sinon.spy()
  const findGaps = () => []
  const grid = {findGaps, maxAllPanes}
  const pane = {id: 1, decreaseAndFillSize, grid, wrapped: {constructor: 1}}
  const createWindow = sinon.spy()
  const { decreaseAndFillCurWinSize } = stubWindowChanger(pane)({createWindow})
  decreaseAndFillCurWinSize('left', 30)
  t.ok(createWindow.notCalled, 'no new windows created')
})

test('decreaseCurWinSize(direction, amount): ' +
     'decreases focused pane size directionally', t => {
  t.plan(1)
  const decreaseSizeDirectional = sinon.spy()
  const pane = {id: 1, decreaseSizeDirectional}
  const { decreaseCurWinSize } = stubWindowChanger(pane)({})
  decreaseCurWinSize('left', 30)
  t.ok(
    decreaseSizeDirectional.calledWith('left', 30),
    'decreaseSizeDirectional called with proper args'
  )
})

test('decreaseCurWinSize(direction, amount): ' +
     'no-op if no focused window', t => {
  t.plan(1)
  const decreaseSizeDirectional = sinon.spy()
  const pane = {id: 1, decreaseSizeDirectional}
  const { decreaseCurWinSize } = stubWindowChangerNoFocusedWin(pane)({})
  decreaseCurWinSize('left', 30)
  t.ok(
    decreaseSizeDirectional.notCalled,
    'decreaseSizeDirectional not called'
  )
})

test('decreaseCurWinSize(direction, amount): ' +
     'no-op if decreaseSizeDirectional throws', t => {
  t.plan(1)
  const decreaseSizeDirectional = sinon.stub().throws()
  const pane = {id: 1, decreaseSizeDirectional}
  const { decreaseCurWinSize } = stubWindowChanger(pane)({})
  decreaseCurWinSize('left', 30)
  t.pass('no-op')
})

test('increaseCurWinSize(direction, amount): ' +
     'decreases focused pane size directionally', t => {
  t.plan(1)
  const increaseSizeDirectional = sinon.spy()
  const pane = {id: 1, increaseSizeDirectional}
  const { increaseCurWinSize } = stubWindowChanger(pane)({})
  increaseCurWinSize('left', 30)
  t.ok(
    increaseSizeDirectional.calledWith('left', 30),
    'increaseSizeDirectional called with proper args'
  )
})

test('increaseCurWinSize(direction, amount): ' +
     'no-op if no focused window', t => {
  t.plan(1)
  const increaseSizeDirectional = sinon.spy()
  const pane = {id: 1, increaseSizeDirectional}
  const { increaseCurWinSize } = stubWindowChangerNoFocusedWin(pane)({})
  increaseCurWinSize('left', 30)
  t.ok(
    increaseSizeDirectional.notCalled,
    'increaseSizeDirectional not called'
  )
})

test('increaseCurWinSize(direction, amount): ' +
     'no-op if increaseSizeDirectional throws', t => {
  t.plan(1)
  const increaseSizeDirectional = sinon.stub().throws()
  const pane = {id: 1, increaseSizeDirectional}
  const { increaseCurWinSize } = stubWindowChanger(pane)({})
  increaseCurWinSize('left', 30)
  t.pass('no-op')
})

test('toggleCurrentWinFullSize(): changes win to grid size if it is not', t => {
  t.plan(2)
  const wrapped = Object.assign(new EventEmitter(), {
    getBounds: () => ({x: 1000, y: 1000, width: 100, height: 100}),
    setBounds: sinon.spy()
  })
  const grid = {
    offset: {x: 1000, y: 1000},
    height: 500,
    width: 500
  }
  const pane = {
    id: 1,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    grid,
    wrapped
  }
  const { toggleCurrentWinFullSize } = stubWindowChanger(pane)({})
  toggleCurrentWinFullSize()
  t.equals(
    wrapped.listeners('blur').length, 1,
    'listener added to blur event'
  )
  t.ok(
    wrapped.setBounds.calledWith({width: 500, height: 500, x: 1000, y: 1000}),
    'setBounds of wrapped window called with proper full screen and offset'
  )
})

test('toggleCurrentWinFullSize(): no-op if no focused window', t => {
  t.plan(2)
  const wrapped = Object.assign(new EventEmitter(), {
    getBounds: () => ({x: 1000, y: 1000, width: 100, height: 100}),
    setBounds: sinon.spy()
  })
  const grid = {
    offset: {x: 1000, y: 1000},
    height: 500,
    width: 500
  }
  const pane = {
    id: 1,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    grid,
    wrapped
  }
  const { toggleCurrentWinFullSize } = stubWindowChangerNoFocusedWin(pane)({})
  toggleCurrentWinFullSize()
  t.equals(
    wrapped.listeners('blur').length, 0,
    'listener not added to blur event'
  )
  t.ok(
    wrapped.setBounds.notCalled,
    'setBounds method of wrapped window not called'
  )
})

test('toggleCurrentWinFullSize(): changes win to orig size ' +
     'if its size differs from its original', t => {
  t.plan(1)
  const wrapped = Object.assign(new EventEmitter(), {
    getBounds: () => ({x: 1000, y: 1000, width: 500, height: 500}),
    setBounds: sinon.spy()
  })
  const grid = {
    offset: {x: 1000, y: 1000},
    height: 500,
    width: 500
  }
  const pane = {
    id: 1,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    grid,
    wrapped
  }
  const { toggleCurrentWinFullSize } = stubWindowChanger(pane)({})
  toggleCurrentWinFullSize()
  t.ok(
    wrapped.setBounds.calledWith({width: 100, height: 100, x: 1000, y: 1000}),
    'setBounds of wrapped window called with orig size and offset'
  )
})

test('toggleCurrentWinFullSize(): changes win back to orig size ' +
     'if it loses focus to another pane on screen', t => {
  t.plan(2)
  const wrapped = Object.assign(new EventEmitter(), {
    getBounds: () => ({x: 1000, y: 1000, width: 100, height: 100}),
    setBounds: sinon.spy()
  })
  const grid = {
    offset: {x: 1000, y: 1000},
    height: 500,
    width: 500,
    panes: [{wrapped: {isFocused: () => true}}]
  }
  const pane = {
    id: 1,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    grid,
    wrapped
  }
  const { toggleCurrentWinFullSize } = stubWindowChanger(pane)({})
  toggleCurrentWinFullSize()
  wrapped.emit('blur')
  t.ok(
    wrapped.setBounds.calledWith({x: 1000, y: 1000, width: 100, height: 100}),
    'setBounds called with original pane size and grid offset'
  )
  t.equals(
    wrapped.listeners('blur').length, 0,
    'listener removed once window returned to original size'
  )
})
