const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubWindowCreator () {
  return proxyquire('../../lib/window-creator', {
    './get-grid': (grids) => grids[1]
  })
}

test('createWindow(gridId, winConstructor, opts): ' +
     'adds window to specified grid', t => {
  t.plan(2)
  const grids = [
    {id: 1, add: sinon.spy()},
    {id: 2, add: sinon.spy()}
  ]
  const { createWindow } = stubWindowCreator()({grids})
  createWindow(1, 'winConstructor', {x: 0, y: 0, width: 100, height: 100})
  t.ok(
    grids[0].add.calledWith('winConstructor', {x: 0, y: 0, width: 100, height: 100}),
    'window with provided opts added to proper grid'
  )
  t.ok(
    grids[1].add.notCalled,
    'window not added to second grid'
  )
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
