const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubWindowCloser (getPane, id) {
  return proxyquire('../../lib/window-closer', {
    './get-pane': getPane,
    'electron': { BrowserWindow: { getFocusedWindow: () => (id ? {id} : null) } }
  })
}

test('closeCurWindow(): calles remove method of pane grid corresponding to focused window', t => {
  t.plan(1)
  const remove = sinon.spy()
  const pane = {id: 2, grid: {remove}}
  const getPane = sinon.stub().withArgs('grids', 1).returns(pane)
  const grids = 'grids'
  const { closeCurWindow } = stubWindowCloser(getPane, 1)({grids})
  closeCurWindow()
  t.ok(
    remove.calledWith(2),
    'remove method of grid called with pane id'
  )
})

test('closeCurWindow(): no-op if no focused window', t => {
  t.plan(1)
  const remove = sinon.spy()
  const pane = {id: 2, grid: {remove}}
  const getPane = sinon.stub().withArgs('grids', 1).returns(pane)
  const grids = 'grids'
  const { closeCurWindow } = stubWindowCloser(getPane, null)({grids})
  closeCurWindow()
  t.ok(
    remove.notCalled,
    'remove method not called'
  )
})
