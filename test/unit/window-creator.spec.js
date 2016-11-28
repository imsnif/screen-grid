const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const EventEmitter = require('events')

function stubWindowCreator () {
  return proxyquire('../../lib/window-creator', {
    './get-grid': (grids) => grids[1]
  })
}

test('createWindow(gridId, winConstructor, opts): ' +
     'adds window to specified grid and properly registers listeners', t => {
  t.plan(4)
  const emitter = new EventEmitter()
  const pane = Object.assign({}, {on: emitter.on, emit: emitter.emit}, {wrapped: {id: 1}})
  const add = sinon.stub().returns(pane)
  const grids = [
    {id: 1, add},
    {id: 2, add: sinon.spy()}
  ]
  const listener1 = sinon.spy()
  const listener2 = sinon.spy()
  const listeners = {event1: listener1, event2: listener2}
  const { createWindow } = stubWindowCreator()({grids})
  createWindow(1, 'winConstructor', {x: 0, y: 0, width: 100, height: 100}, listeners)
  t.ok(
    grids[0].add.calledWith('winConstructor', {x: 0, y: 0, width: 100, height: 100}),
    'window with provided opts added to proper grid'
  )
  t.ok(
    grids[1].add.notCalled,
    'window not added to second grid'
  )
  pane.emit('event1', {one: 1})
  t.ok(listener1.calledWith({id: 1}, {one: 1}), 'first listener called with winId and emitted params')
  pane.emit('event2', {two: 2})
  t.ok(listener2.calledWith({id: 1}, {two: 2}), 'second listener called with winId and emitted params')
})

test('createWindow(gridId, winConstructor, opts): ' +
     'no-op if failed to add window to grid', t => {
  t.plan(1)
  const grids = [
    {id: 1, add: sinon.stub().throws()}
  ]
  const { createWindow } = stubWindowCreator()({grids})
  createWindow(1, 'winConstructor', {x: 0, y: 0, width: 100, height: 100})
  t.pass('no-op')
})

test('createWindow(null, winConstructor, opts): ' +
     'adds window to focused grid if no id provided', t => {
  t.plan(2)
  const grids = [
    {id: 1, add: sinon.spy()},
    {id: 2, add: sinon.spy()}
  ]
  const { createWindow } = stubWindowCreator()({grids})
  createWindow(null, 'winConstructor', {x: 0, y: 0, width: 100, height: 100})
  t.ok(
    grids[1].add.calledWith('winConstructor', {x: 0, y: 0, width: 100, height: 100}),
    'window added to default grid if no id provided'
  )
  t.ok(
    grids[0].add.notCalled,
    'window not added to second grid'
  )
})

test('createWindow(gridId, winConstructor, opts): ' +
     'adds window to focused grid with maxSize if the option is given', t => {
  t.plan(2)
  const grids = [
    {id: 1, add: sinon.spy(), width: 1000, height: 1000},
    {id: 2, add: sinon.spy(), width: 1000, height: 1000}
  ]
  const { createWindow } = stubWindowCreator()({grids})
  createWindow(null, 'winConstructor', {x: 10, y: 10, width: 100, height: 100, maxSize: true})
  t.ok(
    grids[1].add.calledWith('winConstructor', {x: 0, y: 0, width: 1000, height: 1000, maxSize: true}),
    'window added to default grid at its dimensions'
  )
  t.ok(
    grids[0].add.notCalled,
    'window not added to second grid'
  )
})

test('createWindowCentered(gridId, winConstructor, opts): ' +
     'adds window to specified grid at the center of the largest gap ' +
     'and proper registers listeners', t => {
  t.plan(3)
  const emitter = new EventEmitter()
  const pane = Object.assign({}, {on: emitter.on, emit: emitter.emit}, {wrapped: {id: 1}})
  const add = sinon.stub().returns(pane)
  const listener1 = sinon.spy()
  const listener2 = sinon.spy()
  const listeners = {event1: listener1, event2: listener2}
  const grids = [{
    id: 1,
    add,
    findGaps: sinon.stub().returns([
      { x: 100, y: 100, height: 500, width: 500 },
      { x: 500, y: 500, height: 300, width: 300 }
    ])},
    {id: 2, add: sinon.spy()}
  ]
  const { createWindowCentered } = stubWindowCreator()({grids})
  createWindowCentered(1, 'winConstructor', {x: 0, y: 0, width: 100, height: 100}, listeners)
  t.ok(grids[0].add.calledWith(
    'winConstructor',
    {x: 300, y: 300, width: 100, height: 100}
  ), 'pane created in the center of largest gap')
  pane.emit('event1', {one: 1})
  t.ok(listener1.calledWith({id: 1}, {one: 1}), 'first listener called with winId and emitted params')
  pane.emit('event2', {two: 2})
  t.ok(listener2.calledWith({id: 1}, {two: 2}), 'second listener called with winId and emitted params')
})

test('createWindowCentered(gridId, winConstructor, opts): ' +
     'no-op if failed to add window to grid', t => {
  t.plan(1)
  const grids = [
    {id: 1, add: sinon.stub().throws()}
  ]
  const { createWindowCentered } = stubWindowCreator()({grids})
  createWindowCentered(1, 'winConstructor', {x: 0, y: 0, width: 100, height: 100})
  t.pass('no-op')
})

test('createWindowCentered(null, winConstructor, opts): ' +
     'adds window to focused grid if no id provided', t => {
  t.plan(1)
  const grids = [
    {id: 2, add: sinon.spy()},
    {
      id: 1,
      add: sinon.spy(),
      findGaps: sinon.stub().returns([
        { x: 100, y: 100, height: 500, width: 500 },
        { x: 500, y: 500, height: 300, width: 300 }
      ])
    }
  ]
  const { createWindowCentered } = stubWindowCreator()({grids})
  createWindowCentered(null, 'winConstructor', {x: 0, y: 0, width: 100, height: 100})
  t.ok(
    grids[1].add.calledWith(
    'winConstructor',
    {x: 300, y: 300, width: 100, height: 100}
  ), 'pane created in the center of largest gap')
})

test('createWindowCentered(gridId, winConstructor, opts): ' +
     'no-op if no gaps found', t => {
  t.plan(1)
  const grids = [
    {
      id: 1,
      add: sinon.spy(),
      findGaps: sinon.stub().returns([])
    },
    {id: 2, add: sinon.spy()}
  ]
  const { createWindowCentered } = stubWindowCreator()({grids})
  createWindowCentered(1, 'winConstructor', {x: 0, y: 0, width: 100, height: 100})
  t.ok(grids[0].add.notCalled, 'no-op')
})
