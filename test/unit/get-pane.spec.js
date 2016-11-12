const test = require('tape')
const proxyquire = require('proxyquire')

function stubGetPane () {
  return proxyquire('../../lib/get-pane', {
    './get-grid': (grids, winId) => ({getPane: (winId) => ({id: winId})})
  })
}

test('getPane(grids, winId): returns pane with winId', t => {
  t.plan(1)
  const getPane = stubGetPane()
  t.deepEquals(getPane(null, 1), {id: 1}, 'pane with proper id returned')
})
